#!/bin/bash
set -e

source ./env.sh

function patch_mcodes {
  echo "Building microcodes"
  $uefimodtools uefi mcodes-combine \
    --input  "$BUILD_DIR/partitions/microcodes_hole-0.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-0.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/microcodes_hole-0.bin"
  $uefimodtools uefi mcodes-combine \
    --input  "$BUILD_DIR/partitions/microcodes_hole-1.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-1.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/microcodes_hole-1.bin"
  $uefimodtools uefi mcodes-combine \
    --input  "$BUILD_DIR/partitions/microcodes_hole-2.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-2.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/microcodes_hole-2.bin"

  echo "Building FIT"
  $uefimodtools uefi fit-inject-mcodes \
    --input  "$BUILD_DIR/partitions/10_FIT_table.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-0.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/10_FIT_table.bin"
  $uefimodtools uefi fit-inject-mcodes \
    --input  "$BUILD_DIR/partitions/10_FIT_table.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-1.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/10_FIT_table.bin"
  $uefimodtools uefi fit-inject-mcodes \
    --input  "$BUILD_DIR/partitions/10_FIT_table.bin" \
    --table  "$SOURCES_DIR/microcodes_hole-2.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/partitions/10_FIT_table.bin"
    
  echo "Injecting patched sections"
  $uefimodtools bin combine \
    --input "$BUILD_DIR/$PATCHED_DUMP" \
    --table "$SOURCES_DIR/partitions-table.json" \
    --partitions "$BUILD_DIR/partitions" \
    --output "$BUILD_DIR/$PATCHED_DUMP"
}

echo "==================== Ami Aptio BIOS patching ==============="
echo "Patch version: $PATCH_VERSION"
echo "Source dir: $SOURCES_DIR"
echo "Build dir: $BUILD_DIR"
echo "Base BIOS dump: $SOURCES_DIR/$BASE_DUMP"
echo "Patched BIOS dump: $BUILD_DIR/$PATCHED_DUMP"
echo

echo "==================== Prepare ===================="
rm -r "$BUILD_DIR" || true
mkdir -p "$BUILD_DIR"
pushd "$BUILD_DIR"
cp "$SOURCES_DIR/$BASE_DUMP" "$BUILD_DIR/$PATCHED_DUMP"
cp -r "$SOURCES_DIR/partitions" "$BUILD_DIR/partitions"
echo

echo "==================== Patch ===================="
patch_mcodes
echo

echo "==================== Final ===================="
echo "Final BIOS rom: $BUILD_DIR/$PATCHED_DUMP"
popd
