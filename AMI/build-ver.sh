#!/bin/bash
set -e

source ./env.sh

function patch_logos {
  # ImageMagick needs an explicit font when annotating inside minimal
  # containers; fall back to whatever default the host provides otherwise.
  FONT_ARGS=()
  if [ -n "${FONT_NAME:-}" ]; then
    FONT_ARGS=(-font "$FONT_NAME")
  fi

  # patch big logo
  echo "Processing big logo"
  TEXT_INFO="Patched by mixa3607\n$PATCH_VERSION"
  BIG_LOGO_GUID="7BB28B99-61BB-11D5-9A5D-0090273FC14D"
  convert "$SOURCES_DIR/LOGO/$BIG_LOGO_GUID.bmp" -gravity NorthWest -pointsize 30 -fill white "${FONT_ARGS[@]}" -annotate -0-3 "$TEXT_INFO" BMP3:"$BUILD_DIR/$BIG_LOGO_GUID.bmp"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$BIG_LOGO_GUID" 0x19 "$BUILD_DIR/$BIG_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  #$uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$BIG_LOGO_GUID" 0x19 "$SOURCES_DIR/$BIG_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  
  # patch small logo
  echo "Processing small logo"
  SMALL_LOGO_GUID="63819805-67BB-46EF-AA8D-1524A19A01E4"
  convert "$SOURCES_DIR/LOGO/$SMALL_LOGO_GUID.bmp" -gravity NorthWest -pointsize 20 -fill white "${FONT_ARGS[@]}" -annotate -0-3 "$TEXT_INFO" BMP3:"$BUILD_DIR/$SMALL_LOGO_GUID.bmp"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$SMALL_LOGO_GUID" 0x19 "$BUILD_DIR/$SMALL_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
  #$uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$SMALL_LOGO_GUID" 0x19 "$SOURCES_DIR/$SMALL_LOGO_GUID.bmp" -o "$BUILD_DIR/$PATCHED_DUMP"
}

function patch_IFRs {
  NO_REPLACEMNT_ERR_CODE=41

  AMITSE_SCT="$(ls "$SOURCES_DIR/IFR" | grep 'AMITSE.*\.sct$' | head -1)"
  SETUPDATA_BIN="$(find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type f -name '*setupdata*.bin')"
  echo "AMITSE SCT: $AMITSE_SCT"
  echo "Setupdata bin: $SETUPDATA_BIN"

  # Build all IFR data.json paths first (setupdata + amitse patching is cumulative
  # over every form, so it must run once with all data.jsons)
  IFR_JSONS=()
  for IFR_DIR in $(find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type d | sort); do
    if [ -f "$IFR_DIR/data.json" ]; then
      IFR_JSONS+=("$IFR_DIR/data.json")
    fi
  done

  echo "Processing setupdata bin"
  SETUPDATA_ARGS=()
  for JSON in "${IFR_JSONS[@]}"; do SETUPDATA_ARGS+=(--data "$JSON"); done
  $uefieditorcli setupdata --setupdata "$SETUPDATA_BIN" "${SETUPDATA_ARGS[@]}" -o "$BUILD_DIR/setupdata.bin"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "FE612B72-203C-47B1-8560-A66D946EB371" 0x18 "$BUILD_DIR/setupdata.bin" -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))

  # Per-form setup .sct: patch the orig .sct with this form's data.json
  for IFR_DIR in $(find "$SOURCES_DIR/IFR" -maxdepth 1 -mindepth 1 -type d | sort); do
    echo "Processing IFR $IFR_DIR"
    IFR_GUID="$(ls "$IFR_DIR" | grep '\.guid$' | sed 's|\.guid$||1')"
    ORIG_SCT="$(ls "$IFR_DIR/orig" | grep '_setup\.sct$' | head -1)"
    if [ -z "$IFR_GUID" ] || [ -z "$ORIG_SCT" ] || [ ! -f "$IFR_DIR/data.json" ]; then
      echo "SKIP $IFR_DIR (missing guid/sct/data.json)"
      continue
    fi
    IFR_NAME="$(basename "$IFR_DIR")"
    echo "GUID: $IFR_GUID"
    echo "ORIG: $ORIG_SCT"
    $uefieditorcli sct --setup "$IFR_DIR/orig/$ORIG_SCT" --data "$IFR_DIR/data.json" -o "$BUILD_DIR/$IFR_NAME.sct"
    if [ "$IFR_NAME" == "SocketSetup" ] || [ "$IFR_NAME" == "ServerMgmtSetup" ]; then
      python3 "$SOURCES_DIR/custom-binaries/bios-state-rollback/patch-ifr-defaults.py" "$BUILD_DIR/$IFR_NAME.sct" "$IFR_NAME"
    fi
    $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$IFR_GUID" 0x10 "$BUILD_DIR/$IFR_NAME.sct" -asis -o "$BUILD_DIR/$PATCHED_DUMP" || (($?==$NO_REPLACEMNT_ERR_CODE ? 1 : 0))
  done
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

function patch_bios_state_lab_bridge {
  BRIDGE_DIR="$SOURCES_DIR/custom-binaries/bios-state-lab-bridge"
  RED_FISH_GUID="D4395796-6F4C-4C6B-B9D1-92DAA7199A84"

  echo "Building BIOS state lab bridge"
  make -C "$BRIDGE_DIR" clean all
  echo "Injecting BIOS state lab bridge"
  $uefireplace "$BUILD_DIR/$PATCHED_DUMP" "$RED_FISH_GUID" 0x10 \
    "$BRIDGE_DIR/build/BiosStateLabBridge.efi" -o "$BUILD_DIR/$PATCHED_DUMP"
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

function patch_rollback {
  echo "Building rollback modules"
  ROLLBACK_ROM="$BUILD_DIR/$PATCHED_DUMP.rollback"
  "$SOURCES_DIR/custom-binaries/bios-state-rollback/build-rollback.sh" "$BUILD_DIR/$PATCHED_DUMP" "$ROLLBACK_ROM"
  mv "$ROLLBACK_ROM" "$BUILD_DIR/$PATCHED_DUMP"
}

function patch_nvar_defaults {
  echo "Patching NVRAM external defaults (AF516361)"
  NVAR_EDITOR="$SOURCES_DIR/custom-binaries/bios-state-rollback/nvar-defaults-editor.py"
  NVAR_OUT="$BUILD_DIR/$PATCHED_DUMP.nvar"
  python3 "$NVAR_EDITOR" patch \
    --rom "$BUILD_DIR/$PATCHED_DUMP" --out "$NVAR_OUT" \
    --set SocketMemoryConfig:0xC8=0x00,ServerSetup:0x19=0x03,MemBootHealthConfig:0x01=0x00
  mv "$NVAR_OUT" "$BUILD_DIR/$PATCHED_DUMP"
}

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
patch_bios_state_lab_bridge
if [ "${WITHOUT_ROLLBACK:-0}" != "1" ]; then
  patch_rollback
else
  echo "SKIP rollback modules (WITHOUT_ROLLBACK=1)"
fi
patch_nvar_defaults
echo

echo "==================== Final ===================="

echo "Final BIOS rom: $BUILD_DIR/$PATCHED_DUMP"
popd
