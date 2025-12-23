#!/bin/bash
set -e

PATCH_VERSION="$(date +%Y%m%d%H%M%S)"
BASE_DUMP="IMB760_BIOS_mixa3607_stock-2.rom"
PATCHED_DUMP="IMB760_BIOS_mixa3607_mod-$PATCH_VERSION.rom"
SOURCES_DIR="$PWD"
BUILD_DIR="$PWD/build-$PATCH_VERSION"

uefireplace="$PWD/SOFTWARE/UEFITool_0.28.0/UEFIReplace"
uefimodtools="$PWD/SOFTWARE/uefi-mod-tools_v1.0.1/uefi-mod-tools"

function render_IFRs {
  find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type d | while read IFR_DIR; do
    echo "Processing $IFR_DIR"
    $uefimodtools uefi-editor-js render-menu -i $IFR_DIR/data.json -o $IFR_DIR/data.md
  done
}

render_IFRs
