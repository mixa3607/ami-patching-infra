# Ami Aptio BIOS patching infra (configured for Axiomtek IMB760)

Features:
- auto patch logo images
- auto patch DMI/SMBios table
- auto patch IFR sections from versioned clean inputs and patch JSON
- auto inject microcodes + FIT
- auto compile and inject custom BIOS State Lab bridge binary

## Flow

- Extract board-local IFR sources with `./01.extract-ifr.sh` when updating the
  base BIOS dump.
- Edit form patches under `boards/imb760/ifr/`; `99.run-ifr-editor.sh FORM`
  serves a form in the current IFR renderer.
- Run `python3 build.py` to create checkpoints for DMI, logos, IFR, microcodes,
  and the BIOS State Lab bridge under `build/<version>/`.
- Flash the final ROM from `build/<version>/`.

## IMB760

### Automated AFUEFI flash

`flash-via-shell.sh` removes the VNC step when the vendor `AFUEFIx64.efi` is
available. The host already has Boot0006, the built-in EFI Shell, and its ESP
is mounted at `/boot/efi`.

Copy the ROM and AFUEFI binary to the host, then stage, arm, and reboot it:

```sh
SHELL_FS=fs1 sudo ./flash-via-shell.sh --reboot AFUEFIx64.efi bridge.rom <vendor AFUEFI flags>
```

It places both files on the selected FAT filesystem, installs a temporary root `startup.nsh`, sets
`BootNext=0006`, and reboots. The shell restores a prior `startup.nsh`, invokes
AFUEFI with the supplied arguments, writes `BiosStateLabFlash/afuefi.log`, and
resets into the normal boot order. The script does not choose AFUEFI flags:
they must be the tested flags for the exact vendor AFUEFI version and must
preserve or intentionally handle NVRAM as required.

Set `ESP` to the mounted filesystem used by the Shell and `SHELL_FS` to its
Shell mapping. On `worker7`, the connected `EFI-TOOLS` USB partition is mounted
at `/mnt/efi-tools` and is `FS1:` in the built-in Shell.
### Known issue
- Пункты в сервер менеджмент открыть можно через снятие флагов + изменение доступа до 0x05 но
  - Пункты без имён
  - Они не работают, а часть приводит к залипанию биоса
- Пункты в `Advanced` можно открыть можно через снятие флагов + изменение доступа до 0x05 но
  - Пункты без имён, ориентировка на [menu table](./IFR/Setup/data.md)

### Статус по меню
- ✅ - работает как задумано
- ❌ - не работает
- ❓ - есть вопросы

` `

- Socket Configuration
  - Unicore Configuration
    - Unicore General Configuration
      - ✅ Unicore status
      - ✅ Link Frequency Select
  - Memory Configuration
    - ✅ Memory Frequency | но не оверклок частоты (оно и понятно)
    - ✅ Memory Topology

