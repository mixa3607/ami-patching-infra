#!/bin/bash
set -euo pipefail

# Injects the rollback modules (PEI watchdog + DXE backup/commit) into a ROM
# by replacing the PE32 sections of sacrificial modules.
#
#   DXE: UsbOcUpdateDxeNeonCityEPRP  EF0E795C-749A-4B41-B994-7DDC6B594388
#        (Neon City reference-platform config updater; dead code on IMB760)
#   PEI: OememPei                   0A602C5B-05A0-40C4-9181-EDCD891D0003
#        (last PEIM in the PEI volume, so growing its section only eats the
#         trailing free space - no other PEIM moves, no rebase churn)
#
# The PEI target's depex is replaced with the single-early-PPI depex used by
# PeiInterposerToSvidMap so the watchdog dispatches on the first FV scan pass,
# i.e. before the MRC (which waits for the var service and dispatches on a
# later pass).
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
PEI_GUID="0A602C5B-05A0-40C4-9181-EDCD891D0003"

INPUT_ROM="$1"
OUTPUT_ROM="$2"

if [ ! -f "$INPUT_ROM" ]; then
  echo "Input ROM does not exist: $INPUT_ROM" >&2
  exit 2
fi

make -C "$SCRIPT_DIR" clean all >/dev/null

# Single-early-PPI depex (same bytes PeiInterposerToSvidMap ships with):
#   PUSH {01F34D25-4DE2-23AD-3FF3-36353FF323F1} END
DEPEX_BIN="$(mktemp)"
printf '\x02\x25\x4d\xf3\x01\xe2\x4d\xad\x23\x3f\xf3\x36\x35\x3f\xf3\x23\xf1\x08' > "$DEPEX_BIN"

"$UEFI_REPLACE" "$INPUT_ROM" "$DXE_GUID" 0x10 \
  "$SCRIPT_DIR/build/BiosStateRollbackDxe.efi" -o "$OUTPUT_ROM"

"$UEFI_REPLACE" "$OUTPUT_ROM" "$PEI_GUID" 0x10 \
  "$SCRIPT_DIR/build/BiosStateRollbackPei.flat.efi" -o "$OUTPUT_ROM.tmp1"

"$UEFI_REPLACE" "$OUTPUT_ROM.tmp1" "$PEI_GUID" 0x1B "$DEPEX_BIN" -o "$OUTPUT_ROM.tmp2"

rm -f "$OUTPUT_ROM.tmp1" "$DEPEX_BIN"
mv "$OUTPUT_ROM.tmp2" "$OUTPUT_ROM"

if [ "$(stat --format=%s "$INPUT_ROM")" != "$(stat --format=%s "$OUTPUT_ROM")" ]; then
  echo "Output ROM size changed" >&2
  exit 1
fi

echo "Rollback ROM: $OUTPUT_ROM"
echo "Replaced DXE UsbOcUpdateDxeNeonCityEPRP: $DXE_GUID"
echo "Replaced PEI OememPei:                  $PEI_GUID (PE32 + depex)"
