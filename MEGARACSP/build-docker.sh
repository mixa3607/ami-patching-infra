#!/bin/bash
set -euo pipefail

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
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

build_dir="$script_dir/build/$patch_version"
version="$(tr -d '\r\n' < "$script_dir/version.txt")"
case "$version" in
    [0-9][0-9]) ;;
    *) printf 'version.txt must contain exactly two digits: %s\n' "$version" >&2; exit 1 ;;
esac
image_name="IMB760_BMC_mixa3607_mod-$version-$patch_version.bin"
rm -rf "$build_dir"
mkdir -p "$build_dir"

docker buildx build --output "type=local,dest=$build_dir" .
mv "$build_dir/IMB760_BMC_payload-final.bin" "$build_dir/$image_name"
sha256sum "$build_dir/$image_name"
