#!/bin/sh
set -eu

SLOT_SIZE=4194304

usage()
{
	printf 'Usage: %s VIDEOCAP.KO OUTPUT.IMG\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || usage
module=$1
output=$2
[ -f "$module" ] || { printf 'module is not a regular file: %s\n' "$module" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
output_parent=$(dirname "$output")
output_name=$(basename "$output")
[ -d "$output_parent" ] || { printf 'output parent does not exist: %s\n' "$output_parent" >&2; exit 1; }
output_parent=$(CDPATH= cd "$output_parent" && pwd)

tmp=$(mktemp -d "$output_parent/.native-kvm-cramfs.XXXXXX") || exit 1
cleanup()
{
	rm -rf "$tmp"
}
trap cleanup EXIT HUP INT TERM

"$script_dir/build-bundle.sh" "$module" "$tmp/bundle"

if command -v mkfs.cramfs >/dev/null 2>&1; then
	if mkfs.cramfs --help 2>&1 | grep -q -- '-N endian'; then
		mkfs.cramfs -N little -n native-kvm "$tmp/bundle" "$tmp/filesystem.cramfs"
	else
		mkfs.cramfs -n native-kvm "$tmp/bundle" "$tmp/filesystem.cramfs"
	fi
elif command -v mkcramfs >/dev/null 2>&1; then
	mkcramfs "$tmp/bundle" "$tmp/filesystem.cramfs"
else
	printf '%s\n' 'mkfs.cramfs or mkcramfs is required' >&2
	exit 1
fi

payload_size=$(wc -c < "$tmp/filesystem.cramfs")
[ "$payload_size" -le "$SLOT_SIZE" ] || {
	printf 'CramFS payload is too large: %s > %s bytes\n' "$payload_size" "$SLOT_SIZE" >&2
	exit 1
}

if command -v fsck.cramfs >/dev/null 2>&1; then
	fsck.cramfs "$tmp/filesystem.cramfs"
fi

dd if=/dev/zero bs=65536 count=64 2>/dev/null | tr '\000' '\377' > "$tmp/slot.img"
dd if="$tmp/filesystem.cramfs" of="$tmp/slot.img" bs=65536 conv=notrunc 2>/dev/null
image_size=$(wc -c < "$tmp/slot.img")
[ "$image_size" -eq "$SLOT_SIZE" ] || {
	printf 'internal error: image size is %s, expected %s\n' "$image_size" "$SLOT_SIZE" >&2
	exit 1
}

mv "$tmp/slot.img" "$output_parent/$output_name"
trap - EXIT HUP INT TERM
rm -rf "$tmp"
sha256sum "$output_parent/$output_name"
