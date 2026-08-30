#!/usr/bin/env bash
set -euo pipefail

form_name="${1:?Usage: $(basename "$0") FORM_NAME}"
base_dir="$(cd "$(dirname "$0")" && pwd)"
ifr_dir="$base_dir/boards/imb760/ifr"
manifest="$ifr_dir/sections.yaml"
renderer="$base_dir/../SOFTWARE/uefi-mod-tools/uefi-mod-tools"

[ -f "$manifest" ] || { echo "manifest not found: $manifest" >&2; exit 1; }
[ -x "$renderer" ] || { echo "renderer not found: $renderer" >&2; exit 1; }
command -v yq >/dev/null || { echo "yq not found" >&2; exit 1; }

matches="$(form_name="$form_name" yq -r '[.sections[] | select(.name == strenv(form_name))] | length' "$manifest")"
[ "$matches" = 1 ] || { echo "expected one form named '$form_name', found $matches" >&2; exit 1; }

section="$(form_name="$form_name" yq -r '.sections[] | select(.name == strenv(form_name)) | .output' "$manifest")"
ifr="$(form_name="$form_name" yq -r '.sections[] | select(.name == strenv(form_name)) | .ifrJson' "$manifest")"
setup_data="$(yq -r '.sections[] | select(.name == "SetupData") | .output' "$manifest")"

[ "$ifr" != null ] || { echo "form '$form_name' has no ifrJson path" >&2; exit 1; }
[ -f "$ifr_dir/$section" ] || { echo "section not found: $section" >&2; exit 1; }
[ -f "$ifr_dir/$ifr" ] || { echo "IFR JSON not found: $ifr" >&2; exit 1; }
[ -f "$ifr_dir/$setup_data" ] || { echo "setup data not found: $setup_data" >&2; exit 1; }

exec "$renderer" uefi ifr-render \
  --format html \
  --serve localhost:4060 \
  --input "$ifr_dir/$section" \
  --ifr "$ifr_dir/$ifr" \
  --setup-data "$ifr_dir/$setup_data"
