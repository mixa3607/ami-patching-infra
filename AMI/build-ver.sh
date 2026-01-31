#!/bin/bash
set -e

source ./env.sh

function patch_logos {
  # patch big logo
  echo "Processing big logo"
  TEXT_INFO="Patched by mixa3607\n$PATCH_VERSION"
  BIG_LOGO_GUID="7BB28B99-61BB-11D5-9A5D-0090273FC14D"
  convert "$SOURCES_DIR/LOGO/$BIG_LOGO_GUID.bmp" -gravity NorthWest -pointsize 30 -fill white -annotate -0-3 "$TEXT_INFO" BMP3:"$BUILD_DIR/$BIG_LOGO_GUID.bmp"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$BIG_LOGO_GUID" 0x19 "$BUILD_DIR/$BIG_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  #$uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$BIG_LOGO_GUID" 0x19 "$SOURCES_DIR/$BIG_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  
  # patch small logo
  echo "Processing small logo"
  SMALL_LOGO_GUID="63819805-67BB-46EF-AA8D-1524A19A01E4"
  convert "$SOURCES_DIR/LOGO/$SMALL_LOGO_GUID.bmp" -gravity NorthWest -pointsize 20 -fill white -annotate -0-3 "$TEXT_INFO" BMP3:"$BUILD_DIR/$SMALL_LOGO_GUID.bmp"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$SMALL_LOGO_GUID" 0x19 "$BUILD_DIR/$SMALL_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  #$uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$SMALL_LOGO_GUID" 0x19 "$SOURCES_DIR/$SMALL_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
}

function patch_IFRs {
  NO_REPLACEMNT_ERR_CODE=41
  find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type d | while read IFR_DIR; do
    echo "Processing IFR $IFR_DIR"
    IFR_GUID="$(ls "$IFR_DIR" | grep '\.guid$' | sed 's|\.guid$||1')"
    IFR_FILE="$(ls "$IFR_DIR" | grep '\.sct$')"
    echo "GUID: $IFR_GUID"
    echo "FILE: $IFR_FILE"
    $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$IFR_GUID" 0x10 "$IFR_DIR/$IFR_FILE" -asis -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))
  done

  SETUPDATA_GUID=FE612B72-203C-47B1-8560-A66D946EB371
  SETUPDATA_FILE="$(find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type f -name '*setupdata*.bin')"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$SETUPDATA_GUID" 0x18 "$SETUPDATA_FILE" -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))
}

function patch_mcodes {
  echo "Building microcodes"
  $uefimodtools uefi mcodes-combine \
    --input  "$SOURCES_DIR/microcodes_base.bin" \
    --table  "$SOURCES_DIR/microcodes.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/microcodes.bin"
  echo "Injecting microcodes"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "17088572-377F-44EF-8F4E-B09FFF46A070" 0x01 "$BUILD_DIR/microcodes.bin" -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))

  echo "Building FIT"
  $uefimodtools uefi fit-inject-mcodes \
    --input  "$SOURCES_DIR/FIT_table_base.bin" \
    --table  "$SOURCES_DIR/microcodes.json" \
    --mcodes "$SOURCES_DIR/../MCODES" \
    --output "$BUILD_DIR/fit.bin"
  echo "Injecting FIT"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "B52282EE-9B66-44B9-B1CF-7E5040F787C1" 0x01 "$BUILD_DIR/fit.bin" -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))
}

function patch_dmi {
  echo "Processing DMI table"
  DMI_TABLE_GUID="$(ls "$SOURCES_DIR/DMI" | grep '\.guid$' | sed 's|\.guid$||1')"
  DMI_TABLE_FILE="$(ls "$SOURCES_DIR/DMI" | grep '\.bin$')"
  echo "GUID: $DMI_TABLE_GUID"
  echo "FILE: $DMI_TABLE_FILE"
  $uefimodtools smbios table2json -i "$SOURCES_DIR/DMI/$DMI_TABLE_FILE" -o "$BUILD_DIR/dmi-table.json"
  #
  BIOS_INFO_HANDLE=$(cat "$BUILD_DIR/dmi-table.json" | jq '.structures[] | select(.structureType == "BiosInformation") | .structureHandle')
  $uefimodtools smbios extract-struct -i "$BUILD_DIR/dmi-table.json" --handle $BIOS_INFO_HANDLE -o "$BUILD_DIR/dmi-BiosInformation.json"
  cat "$BUILD_DIR/dmi-BiosInformation.json" | jq '.vendor += "; patched by mixa3607"| .version += "; patch '$PATCH_VERSION'"' > "$BUILD_DIR/dmi-BiosInformation-edited.json"
  $uefimodtools smbios inject-struct -i "$BUILD_DIR/dmi-table.json" -s "$BUILD_DIR/dmi-BiosInformation-edited.json" -o "$BUILD_DIR/dmi-table.json"
  
  #
  SYSTEM_INFO_HANDLE=$(cat "$BUILD_DIR/dmi-table.json" | jq '.structures[] | select(.structureType == "SystemInformation") | .structureHandle')
  $uefimodtools smbios extract-struct -i "$BUILD_DIR/dmi-table.json" --handle $SYSTEM_INFO_HANDLE -o "$BUILD_DIR/dmi-SystemInformation.json"
  $uefimodtools smbios inject-struct -i "$BUILD_DIR/dmi-table.json" -s "$BUILD_DIR/dmi-SystemInformation.json" -o "$BUILD_DIR/dmi-table.json"
  
  #
  $uefimodtools smbios json2table -i "$BUILD_DIR/dmi-table.json" -o "$BUILD_DIR/dmi-table.bin"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$DMI_TABLE_GUID" 0x18 "$BUILD_DIR/dmi-table.bin" -o "$BUILD_DIR/$PATCHED_DUMP"
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
echo

echo "==================== Patch ===================="
patch_dmi
patch_logos
patch_IFRs
patch_mcodes
echo

echo "==================== Final ===================="
echo "Final BIOS rom: $BUILD_DIR/$PATCHED_DUMP"
popd
