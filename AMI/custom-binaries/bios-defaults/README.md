# bios-defaults

Edit the default values of AMI Aptio setup variables directly in the firmware
image (Axiomtek IMB760). No runtime code is injected — the values are baked
into the ROM before flashing.

## Why it works

The ROM is a full flash dump that already contains a populated NVAR variable
store (SPI `0x1000000` / `0x1080000`, two mirrored banks + embedded
`StdDefaults`). The firmware reads the live setup variables straight from this
store. The "defaults" sources (external-defaults file `AF516361`, setupdata,
IFR markers) are only consulted when a variable is **missing**, so on a valid
store none of them ever applies.

The tools here change the values in two complementary ways:

1. **Patch the `AF516361` external-defaults blob** — the file AMI uses to
   rebuild the store when variables are missing.
2. **Erase the populated store** — makes every variable missing, so the
   next boot rebuilds the store from the patched `AF516361` blob.

`StdDefaults` in the rebuilt store comes from the same blob, so F9 / CMOS-clear
also restore the patched values.

## Files

- `nvar-defaults-editor.py` — dump/patch the `AF516361` external-defaults blob.
  No dependencies. `patch --rom IN --out OUT --set NAME:OFF=BYTE,...`
- `nvar-store-erase.py` — blank the populated NVAR store (both banks + FTW
  scratch, 0xFF). Locates the banks structurally (scan for `_FVH` + FFS2 GUID +
  `NVAR` chain), so no hardcoded SPI offsets.
- `patch-ifr-defaults.py` — move the Default / MfgDefault markers in the
  generated `.sct` files so F9 picks the patched options.

## Usage

Wired into `../../build-ver.sh`:

```
patch_IFRs                # ... + patch-ifr-defaults.py (F9 defaults)
patch_nvar_defaults       # nvar-defaults-editor.py  patch AF516361
patch_erase_nvar_store    # nvar-store-erase.py      erase the store
```

To change which values are applied, edit the `--set` argument of
`patch_nvar_defaults` and the data.json failsafe/optimal fields used by
`patch_IFRs`.

## Defaults currently applied

| Var                   | offset | meaning                       | old             | new             |
|-----------------------|--------|-------------------------------|-----------------|-----------------|
| SocketMemoryConfig    | 0xC8   | Halt on mem Training Error    | 0x01 (Enable)   | 0x00 (Disable)  |
| ServerSetup           | 0x19   | FRB-2 Timer Policy            | 0x00 (Do Nothing)| 0x03 (Power Cycle) |
| MemBootHealthConfig   | 0x01   | Memory Boot Health Check      | 0x02 (Disable)  | 0x00 (Auto)     |
| Setup                 | 0xEF   | Boot option filter            | 0x00 (UEFI+Legacy)| 0x02 (UEFI only) |

## Verify before flashing

```sh
# AF516361 patched?
python3 nvar-defaults-editor.py dump --rom ../build/<ref>/<rom> --offsets 0xC8,0x19,0x01

# store erased?
python3 nvar-store-erase.py ../build/<ref>/<rom> /tmp/out.rom   # sanity must pass

# IFR default markers (in the build log):
#   HaltOnMemTrainError made-default=1 cleared-default=1
#   MemBootHealthCheck  made-default=1 cleared-default=1
#   FRB-2 Policy defaults set to Power Cycle: 2 opcode(s)
#   Boot option filter  made-default=1 cleared-default=1
```

## Caveats

- Erasing the store drops the variables not covered by the external defaults
  (BootOrder/Boot####, DriverOrder, SMBIOS entry points, runtime counters);
  they are recreated from defaults on first boot. Boot order may reset.
- The erase variant assumes the firmware rebuilds an empty store from the
  external defaults on first boot. `--keep-headers` keeps each bank's FV
  header (valid empty FV) as a safer option.
- Flash only via the recovery-capable procedure; verify `bios_version` after.
