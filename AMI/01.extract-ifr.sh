#!/usr/bin/env bash
set -euo pipefail

base_dir="$(cd "$(dirname "$0")" && pwd)"
ifr_dir="$base_dir/boards/imb760/ifr"
uefi_mod_tools="$base_dir/../SOFTWARE/uefi-mod-tools/uefi-mod-tools"
uefi_extract="$base_dir/../SOFTWARE/UEFITool_NE-cli/uefitool-ne-cli"
ifr_extractor="$base_dir/../SOFTWARE/IFRExtractor-RS-structured/ifrextractor"

"$uefi_extract" extract \
  "$base_dir/boards/imb760/base/IMB760_BIOS.bin" \
  "$base_dir/boards/imb760/ifr/sections-new.yaml" \
  "$ifr_dir"

for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
  "$ifr_extractor" "$ifr_dir/${D}/${D}_setup.sct" json
done

for defaults in AF516361-BiosDefaults 9221315B-BiosDefaults; do
  "$uefi_mod_tools" uefi nvar map -i "$ifr_dir/${defaults}.bin" -o "$ifr_dir/${defaults}.json"

  for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
    "$uefi_mod_tools" uefi nvar map-ifr-stores \
      -i "$ifr_dir/${defaults}.json" \
      --ifr "$ifr_dir/${D}/${D}_setup.sct.0.0.uefi.ifr.json" \
      -o "$ifr_dir/${D}/${defaults}-nvar-map.json"
  done
done

for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
  "$uefi_mod_tools" uefi ifr render \
    -s "$ifr_dir/${D}/${D}_setup.sct.0.0.uefi.ifr.json" \
    -o "$ifr_dir/${D}/${D}_setup.sct.render.json"
done

for D in $(find "$ifr_dir" -maxdepth 1 -mindepth 1 -type d -printf '%P\n'); do
  "$uefi_mod_tools" uefi setup-data map-ifr \
    -i "$ifr_dir/SetupData.bin" \
    --ifr "$ifr_dir/${D}/${D}_setup.sct.0.0.uefi.ifr.json" \
    -o "$ifr_dir/${D}/SetupData.map.json"
done
