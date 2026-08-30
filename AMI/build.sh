#!/usr/bin/env bash
set -euo pipefail

base_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec python3 "$base_dir/build.py" "$@"
