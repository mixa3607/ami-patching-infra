#!/usr/bin/env bash
set -euo pipefail

base_dir="$(cd "$(dirname "$0")" && pwd)"
exec "$base_dir/../SOFTWARE/ifr-extractor/extract.cs" \
  --uefi-dump "$base_dir/IMB760_BIOS.bin" \
  --manifest "$base_dir/IFR/sections.yaml" \
  --output-dir "$base_dir/IFR"
