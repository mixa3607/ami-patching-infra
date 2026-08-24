# BiosStateRollback

Auto-rollback to the last known-good variable state after repeated failed
boots. If memory overclocking (or anything else) hangs the board before the
BIOS picture, this restores the previously successful variables after 3
consecutive hangs.

Test-board oriented: the rollback is best-effort and the counting is coarse,
but the mechanism is simple and requires no SPI surgery.

## How it works

Two modules + the already-patched BIOS defaults.

### BIOS defaults (already committed in `../IFR/*/data.json`)

So a failed boot *resets instead of dead-halting*:

- `SocketMemoryConfig` "Halt on mem Training Error": Enable -> **Disable**
  (MRC no longer dead-halts on a training failure, it takes the reset path).
- `MemBootHealthConfig` "Memory Boot Health Check": Disable -> **Auto**,
  "Reboot On Critical Failure" stays Enable.
- `ServerMgmtSetup` "FRB-2 Timer Policy": Do Nothing -> **Power Cycle**
  (BMC auto power-cycles a POST hang; FRB-2 is on by default, timeout 6 min).

### PEI watchdog (`BiosStateRollbackPei.c`)

Injected over `OememPei` (disposable OEM module, last PEIM in the PEI
volume - growing it only eats the trailing free space, so no other PEIM
moves). Its depex is replaced with the single-early-PPI depex
(`{01F34D25-4DE2-23AD-3FF3-36353FF323F1}`) so it dispatches on the first FV
scan pass, i.e. before the memory reference code (`UncoreInitPeim`, which
waits for the variable service and only dispatches on a later pass).

- state lives in battery-backed RTC SRAM: magic (`0x34`), failure counter
  (`0x35`), "boot completed" marker (`0x36`), "rollback pending" (`0x37`);
- each boot: if the previous boot never reached DXE (marker clear), bump the
  counter, else reset it;
- at `ROLLBACK_MAX_FAILS` (3) consecutive failed boots it reads the golden
  snapshot variable `BslRollbackGolden` (vendor GUID
  `2ad85717-6422-46e7-9d3f-a4e2f8d278d9`) through the real pre-memory var
  service and installs a **shadow** `EFI_PEI_READ_ONLY_VARIABLE2_PPI` that
  returns the snapshot values for the boot-critical variables. MRC then
  trains memory with the good settings on this very boot.

### DXE driver (`BiosStateRollbackDxe.c`)

Injected over `UsbOcUpdateDxeNeonCityEPRP` (dead Neon City config updater).
Runs at DXE dispatch (only reached if memory trained OK):

- if "rollback pending" is set, commits the snapshot variables back into
  NVRAM via `SetVariable` (makes the rollback permanent) and clears the flag;
- snapshots the boot-critical variables into `BslRollbackGolden`;
- sets the RTC "boot completed" marker.

Full cycle: bad OC -> MRC hang -> BMC FRB-2 power-cycle -> counter++ -> on the
3rd power-cycle the shadow PPI feeds the good values -> board boots -> DXE
commits them -> next boot the counter resets.

## Build

```sh
make clean all
# produces build/BiosStateRollbackDxe.efi (x64 runtime driver) and
# build/BiosStateRollbackPei.flat.efi (IA32 PEI, GenFw-style flat layout)
```

The PEI module is built with clang (`i686-pc-windows-msvc`) + lld-link and
then flattened by `genfw_fixup.py`. UEFIReplace's rebase pass can only handle
the flat raw==virtual layout; a stock lld-link image makes it fail with
"executable section rebase failed" (it walks the .reloc table treating the
DataDirectory VirtualAddress as a file offset).

## Inject and flash

```sh
../../build-ver.sh          # full build incl. defaults, bridge and rollback
# or standalone:
./build-rollback.sh INPUT.rom OUTPUT.rom
```

Flash `build/<ref>/IMB760_BIOS_AMI_mixa3607_mod-<ref>.rom` (only via the
recovery-capable procedure).

## Verify the injected modules

```sh
UEFIExtract output.rom all
# .../82 OememPei/1 PE32 image section/body.bin          (12384 B, MZ)
# .../82 OememPei/0 PEI dependency section/body.bin      (18 B, PUSH {01F34D25...} END)
# .../114 UsbOcUpdateDxeNeonCityEPRP/1 PE32 image section/body.bin (4096 B, MZ)
# both PE32 bodies contain the UTF-16 string "BslRollbackGolden"
# all other PEI modules are byte-identical to the base image
```

## Limitations / knobs

- `ROLLBACK_MAX_FAILS`, the RTC bytes and the snapshot variable list live in
  `rollback.h`. The RTC offsets must not collide with what AMI
  `CmosManager`/`CmosPei` or the BMC use.
- The snapshot is a normal EFI variable: if the whole varstore is lost the
  golden is gone too (that is a deeper failure than a bad OC).
- "Boot completed" is set at DXE dispatch, so a hang that happens *after* DXE
  starts is not counted (the target scenario is the pre-video MRC hang).
- A snapshot is only taken on boots that reach DXE, so an OC config that
  boots once successfully becomes the new "good" baseline.
- If no snapshot exists (e.g., the very first hang ever), the PEI watchdog
  does nothing and the board stays in the reset loop until a manual CMOS
  clear.
- Debug POST codes on port 0x80 are enabled by default (`-DDEBUG_POST` in the
  Makefile; remove it for a clean build):
  - PEI: `0xE0` watchdog dispatched, `0xE1` var service notified,
    `0xE2` rollback triggered (shadow PPI installed);
  - DXE: `0xE3` driver ran, `0xE4` rollback committed, `0xE5` snapshot taken.
