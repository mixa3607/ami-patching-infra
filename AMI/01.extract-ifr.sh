#!/usr/bin/env bash
set -euo pipefail

base_dir="$(cd "$(dirname "$0")" && pwd)"
ifr_dir="$base_dir/boards/imb760/ifr"
uefi_mod_tools="$base_dir/../SOFTWARE/uefi-mod-tools/uefi-mod-tools"

#exec "$base_dir/../SOFTWARE/ifr-extractor/extract.cs" \
#  --uefi-dump "$base_dir/boards/imb760/base/IMB760_BIOS.bin" \
#  --manifest "$base_dir/boards/imb760/ifr/sections.yaml" \
#  --output-dir "$base_dir/boards/imb760/ifr"

"$uefi_mod_tools" uefi nvar map -i "$ifr_dir/AF516361-BiosDefaults.bin" -o "$ifr_dir/AF516361-BiosDefaults.json"

for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
  "$uefi_mod_tools" uefi nvar map-ifr-stores \
    -i "$ifr_dir/AF516361-BiosDefaults.json" \
    --ifr "$ifr_dir/${D}/${D}_setup.sct.0.0.uefi.ifr.json" \
    -o "$ifr_dir/${D}/AF516361-BiosDefaults-nvar-map.json"
done

for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
  "$uefi_mod_tools" uefi ifr render \
    -s "$ifr_dir/${D}/${D}_setup.sct.0.0.uefi.ifr.json" \
    -o "$ifr_dir/${D}/${D}_setup.sct.render.json"
done
