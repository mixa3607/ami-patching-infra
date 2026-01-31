#!/bin/bash
set -e

source ./env.sh

function render_IFRs {
  find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type d | while read IFR_DIR; do
    echo "Processing $IFR_DIR"
    $uefimodtools uefi-editor-js render-menu -i $IFR_DIR/data.json -o $IFR_DIR/data.md
  done
}

render_IFRs
