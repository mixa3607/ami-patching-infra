#!/bin/bash
set -e

source ./env.sh

echo "Original BIOS microcodes"
python3 "$TOOLS_DIR/MCExtractor/MCE.py" "$SOURCES_DIR/$BASE_DUMP" -exit -skip 

echo "Patched BIOS microcodes"
python3 "$TOOLS_DIR/MCExtractor/MCE.py" "$BUILD_DIR/$PATCHED_DUMP" -exit -skip 
