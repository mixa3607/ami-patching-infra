#!/bin/bash
set -euo pipefail

# Build the patched IMB760 AMI BIOS in Docker.
# Build context is AMI/ itself; SOFTWARE/ and MCODES/ are attached as extra
# build contexts so they do not need to be inside AMI/.
script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH= cd -- "$script_dir/.." && pwd)"
cd "$script_dir"

if [ -n "${REPO_GIT_REF:-}" ]; then
    patch_version="$REPO_GIT_REF"
else
    patch_version="$(git tag --points-at HEAD)"
    patch_version="${patch_version%%$'\n'*}"
    patch_version="${patch_version//+/}"
    if [ -z "$patch_version" ]; then
        patch_version="$(git rev-parse --short HEAD)"
    fi
fi

build_dir="$script_dir/build-$patch_version"
rm -rf "$build_dir"
mkdir -p "$build_dir"

docker buildx build \
    --build-context sw="$repo_root/SOFTWARE" \
    --build-context mc="$repo_root/MCODES" \
    --build-arg "REPO_GIT_REF=$patch_version" \
    --output "type=local,dest=$build_dir" \
    -f "$script_dir/Dockerfile" \
    .

image_name="IMB760_BIOS_AMI_mixa3607_mod-$patch_version.rom"
sha256sum "$build_dir/$image_name"
