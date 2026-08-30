#!/bin/bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 INPUT_ROM OUTPUT_ROM" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
BRIDGE_DIR="$SCRIPT_DIR/components/bios-state-lab-bridge"
UEFI_REPLACE="$REPO_DIR/SOFTWARE/UEFITool_0.28.0/UEFIReplace"
RED_FISH_GUID="D4395796-6F4C-4C6B-B9D1-92DAA7199A84"

INPUT_ROM="$1"
OUTPUT_ROM="$2"

if [ ! -f "$INPUT_ROM" ]; then
  echo "Input ROM does not exist: $INPUT_ROM" >&2
  exit 2
fi

make -C "$BRIDGE_DIR" clean all
"$UEFI_REPLACE" "$INPUT_ROM" "$RED_FISH_GUID" 0x10 \
  "$BRIDGE_DIR/build/BiosStateLabBridge.efi" -o "$OUTPUT_ROM"

if [ "$(stat --format=%s "$INPUT_ROM")" != "$(stat --format=%s "$OUTPUT_ROM")" ]; then
  echo "Output ROM size changed" >&2
  exit 1
fi

echo "Bridge ROM: $OUTPUT_ROM"
echo "Replaced AmiRedFishApi PE32 section: $RED_FISH_GUID"
