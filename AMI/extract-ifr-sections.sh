#!/bin/bash
# Extract clean UEFI IFR sections from an AMI Aptio BIOS dump into the IFR/
# source structure, so patches (data.json) can be applied on top of clean data.
#
# Usage:
#   ./extract-ifr-sections.sh [BIOS_DUMP]
#
# Default BIOS dump: IMB760_BIOS.bin (same as build-ver.sh BASE_DUMP).
#
# Output layout (matching IFR/readme.md):
#   IFR/
#     Section_PE32_image_AMITSE_AMITSE.sct                 (AMITSE PE32 body)
#     Section_Freeform_subtype_GUID_setupdata_..._body.bin (setupdata body)
#     <FormName>/
#       <guid>.guid
#       <FormName>_setup.sct        (PE32 image section body: header+body)
#       orig/
#         <FormName>_setup.sct
#         <FormName>_ifr.txt        (IFRExtractor-RS verbose output)
#         data.json                 (orig, empty placeholders)
set -eu
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
DUMP="${1:-$BASE_DIR/IMB760_BIOS.bin}"

UEFIEXTRACT="$BASE_DIR/../SOFTWARE/UEFITool_NE_A72_win64/uefiextract"
IFREXTRACTOR="$BASE_DIR/../SOFTWARE/IFRExtractor-RS_v1.6.0/ifrextractor"

# Form names -> file GUID mapping (AMI Aptio DXE drivers holding the IFR).
# Extend/override for other boards by editing this table.
declare -A FORM_GUIDS=(
  [Setup]="899407D7-99FE-43D8-9A21-79EC328CAC21"
  [Platform]="ABBCE13D-E25A-4D9F-A1F9-2F7710786892"
  [ServerMgmtSetup]="1B08A1DB-F91A-4FA1-A911-255C417F1CF7"
  [SocketSetup]="6B6FD380-2C55-42C6-98BF-CBBC5A9AA666"
  [FpgaSocketSetup]="BCEA6548-E204-4486-8F2A-36E13C7838CE"
)

# GUIDs for the shared AMITSE / setupdata files
AMITSE_GUID="F77B7BA0-...-AMITSE"        # file GUID (dir name only, matched by UI name)
SETUPDATA_GUID="FE612B72-203C-47B1-8560-A66D946EB371"

[ -f "$DUMP" ] || { echo "dump not found: $DUMP" >&2; exit 1; }
[ -x "$UEFIEXTRACT" ] || { echo "uefiextract not found" >&2; exit 1; }
[ -x "$IFREXTRACTOR" ] || { echo "ifrextractor not found" >&2; exit 1; }

echo "== Extracting full dump (this can take a while) =="
# uefiextract writes <dump>.dump next to the dump file
DUMP_DIR="${DUMP}.dump"
rm -rf "$DUMP_DIR"
"$UEFIEXTRACT" "$DUMP" all >/dev/null

IFR_DIR="${EXTRACT_IFR_DIR:-$BASE_DIR/IFR}"
mkdir -p "$IFR_DIR"

# ---------------------------------------------------------------------------
# Find a DXE/PEI file (dir) whose UI section body contains the given UTF-16 name
# ---------------------------------------------------------------------------
find_file_by_ui() {
  local name="$1"
  # UI section body is UTF-16LE, strip trailing NULs; return the file (form) dir.
  # -exec avoids the broken-pipe SIGPIPE that find+while/break triggers under pipefail.
  find "$DUMP_DIR" -type f -path "*/2 UI section/body.bin" \
    -exec sh -c '
      for ui do
        text="$(iconv -f UTF-16LE -t UTF-8 "$ui" 2>/dev/null | tr -d "\0")"
        if [ "$text" = "$1" ]; then
          dirname "$(dirname "$ui")"
          exit 0
        fi
      done
    ' sh "$name" {} + 2>/dev/null | head -1
}

# Locate a PE32 image section within a file dir and write header+body to $out
extract_pe32() {
  local file_dir="$1"
  local out="$2"
  # PE32 section may be nested (e.g. AMITSE under a GUID-defined section).
  # -name is used because -path matching with spaces is brittle here.
  local pe32
  pe32="$(find "$file_dir" -type f -name "body.bin" 2>/dev/null | grep -F "PE32 image section/body.bin" | head -1)"
  [ -n "$pe32" ] || return 1
  local dir
  dir="$(dirname "$pe32")"
  cp "$dir/header.bin" "$out"
  cat "$dir/body.bin" >> "$out"
}

echo "== Extracting form IFR sections =="
for name in "${!FORM_GUIDS[@]}"; do
  guid="${FORM_GUIDS[$name]}"
  echo "  $name ($guid)"
  file_dir="$(find_file_by_ui "$name")"
  if [ -z "$file_dir" ]; then
    echo "    WARN: file with UI name '$name' not found, skipping" >&2
    continue
  fi

  out_dir="$IFR_DIR/$name"
  mkdir -p "$out_dir/orig"
  echo "$guid" > "$out_dir/$guid.guid"
  extract_pe32 "$file_dir" "$out_dir/orig/${name}_setup.sct" \
    || { echo "    ERROR: PE32 section not found" >&2; continue; }

  # regenerate verbose IFR text next to the sct
  "$IFREXTRACTOR" "$out_dir/orig/${name}_setup.sct" verbose >/dev/null
  ifr="$(ls "$out_dir/orig/${name}_setup.sct"*.ifr.txt 2>/dev/null | head -1)"
  if [ -n "$ifr" ]; then
    mv "$ifr" "$out_dir/orig/${name}_ifr.txt"
  else
    echo "    WARN: IFRExtractor produced no IFR text" >&2
  fi
done

echo "== Extracting AMITSE =="
amitse_dir="$(find "$DUMP_DIR" -type d -name "*AMITSE" | head -1)"
if [ -n "$amitse_dir" ]; then
  extract_pe32 "$amitse_dir" "$IFR_DIR/Section_PE32_image_AMITSE_AMITSE.sct" \
    && echo "  ok" || echo "  WARN: AMITSE PE32 not found" >&2
else
  echo "  WARN: AMITSE file not found" >&2
fi

echo "== Extracting setupdata =="
setupdata_dir="$(find "$DUMP_DIR" -type d -name "*AMITSESetupData" | head -1)"
if [ -n "$setupdata_dir" ]; then
  # setupdata body is the freeform body inside the GUID section
  body="$(find "$setupdata_dir" -type f -name "body.bin" | grep -F "$SETUPDATA_GUID" | head -1)"
  if [ -n "$body" ]; then
    cp "$body" "$IFR_DIR/Section_Freeform_subtype_GUID_setupdata_setupdata_AMITSESetupData_body.bin"
    echo "  ok"
  else
    echo "  WARN: setupdata body not found" >&2
  fi
else
  echo "  WARN: AMITSESetupData file not found" >&2
fi

echo "== Done =="
echo "Extracted IFR sources are in: $IFR_DIR"
echo "Next steps:"
echo "  - Load each IFR/<Form>/<Form>_setup.sct in UEFI-Editor, make changes, save data.json"
echo "  - Run build-ver.sh (it now patches orig .sct + data.json automatically)"
