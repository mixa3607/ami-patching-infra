#!/bin/bash
set -euo pipefail

ARM=0
REBOOT=0
while [ "${1:-}" = "--arm" ] || [ "${1:-}" = "--reboot" ]; do
  case "$1" in
    --arm) ARM=1 ;;
    --reboot) REBOOT=1 ; ARM=1 ;;
  esac
  shift
done

if [ "$#" -lt 2 ]; then
  echo "Usage: sudo $0 [--arm|--reboot] AFUEFI_X64.EFI ROM [AFUEFI arguments...]" >&2
  exit 2
fi
if [ "$EUID" -ne 0 ]; then
  echo "Run as root so the EFI System Partition and BootNext can be changed" >&2
  exit 2
fi

AFUEFI="$1"
ROM="$2"
shift 2
ESP="${ESP:-/boot/efi}"
SHELL_FS="${SHELL_FS:-fs0}"
STAGE="$ESP/BiosStateLabFlash"
STARTUP="$ESP/startup.nsh"
BACKUP="$ESP/startup.nsh.bios-state-lab-backup"

for required in "$AFUEFI" "$ROM"; do
  if [ ! -f "$required" ]; then
    echo "Missing file: $required" >&2
    exit 2
  fi
done
if ! mountpoint -q "$ESP"; then
  echo "EFI System Partition is not mounted at $ESP" >&2
  exit 2
fi
if [ -e "$BACKUP" ]; then
  echo "Existing startup backup found: $BACKUP" >&2
  echo "Resolve the previous shell-flash attempt before staging another one" >&2
  exit 1
fi

mkdir -p "$STAGE"
install -m 0644 "$AFUEFI" "$STAGE/AFUEFIx64.efi"
install -m 0644 "$ROM" "$STAGE/Bridge.rom"
if [ -e "$STARTUP" ]; then
  mv "$STARTUP" "$BACKUP"
else
  : > "$BACKUP"
fi

AFU_COMMAND="AFUEFIx64.efi Bridge.rom"
for argument in "$@"; do
  AFU_COMMAND="$AFU_COMMAND $argument"
done

{
  printf '%s\n' '@echo -off'
  printf '%s\n' "${SHELL_FS}:"
  printf '%s\n' 'cd \BiosStateLabFlash'
  printf '%s\n' 'rm \startup.nsh'
  printf '%s\n' 'mv \startup.nsh.bios-state-lab-backup \startup.nsh'
  printf '%s\n' "$AFU_COMMAND > \\BiosStateLabFlash\\afuefi.log"
  printf '%s\n' 'reset'
} > "$STARTUP"

echo "Staged AFUEFI shell flash at $STAGE"
echo "EFI Shell will execute from ${SHELL_FS}: and then reset"
if [ "$ARM" -eq 1 ]; then
  efibootmgr -n 0006
  echo "BootNext set to Boot0006 (Built-in EFI Shell)"
fi
if [ "$REBOOT" -eq 1 ]; then
  systemctl reboot
fi
