#!/bin/bash
set -euo pipefail

# Injects the rollback modules (PEI watchdog + DXE backup/commit) into a ROM
# by replacing the PE32 sections of sacrificial modules.
#
#   DXE: UsbOcUpdateDxeNeonCityEPRP  EF0E795C-749A-4B41-B994-7DDC6B594388
#        (Neon City reference-platform config updater; dead code on IMB760)
#   PEI: PeiInterposerToSvidMap      DF11893B-FAC7-4812-8DD7-F5DD56889040
#        (early-dispatch single-PPI depex PEIM; disposable)
#
# Usage: build-rollback.sh [INPUT_ROM] [OUTPUT_ROM]

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 INPUT_ROM OUTPUT_ROM" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
UEFI_REPLACE="$REPO_DIR/SOFTWARE/UEFITool_0.28.0/UEFIReplace"

DXE_GUID="EF0E795C-749A-4B41-B994-7DDC6B594388"
PEI_GUID="DF11893B-FAC7-4812-8DD7-F5DD56889040"

INPUT_ROM="$1"
OUTPUT_ROM="$2"

if [ ! -f "$INPUT_ROM" ]; then
  echo "Input ROM does not exist: $INPUT_ROM" >&2
  exit 2
fi

make -C "$SCRIPT_DIR" clean all >/dev/null

"$UEFI_REPLACE" "$INPUT_ROM" "$DXE_GUID" 0x10 \
  "$SCRIPT_DIR/build/BiosStateRollbackDxe.efi" -o "$OUTPUT_ROM"

"$UEFI_REPLACE" "$OUTPUT_ROM" "$PEI_GUID" 0x10 \
  "$SCRIPT_DIR/build/BiosStateRollbackPei.flat.efi" -o "$OUTPUT_ROM.tmp"

mv "$OUTPUT_ROM.tmp" "$OUTPUT_ROM"

if [ "$(stat --format=%s "$INPUT_ROM")" != "$(stat --format=%s "$OUTPUT_ROM")" ]; then
  echo "Output ROM size changed" >&2
  exit 1
fi

echo "Rollback ROM: $OUTPUT_ROM"
echo "Replaced DXE UsbOcUpdateDxeNeonCityEPRP: $DXE_GUID"
echo "Replaced PEI PeiInterposerToSvidMap:      $PEI_GUID"
