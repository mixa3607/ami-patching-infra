#!/bin/sh
set -eu

FLASH_SIZE=33554432
SLOT_SIZE=4194304
ROOT_SIZE=15929344

usage()
{
	printf 'Usage: %s A|B FULL-DUMP SLOT-IMAGE OUTPUT-DUMP [ROOT-IMAGE]\n' "$0" >&2
	exit 2
}

[ "$#" -eq 4 ] || [ "$#" -eq 5 ] || usage
slot=$1
input=$2
image=$3
output=$4
root_image=${5:-}

case "$slot" in
	A) offset=23920640 ;;
	B) offset=28114944 ;;
	*) usage ;;
esac

[ -f "$input" ] || { printf 'input is not a regular file: %s\n' "$input" >&2; exit 1; }
[ -f "$image" ] || { printf 'slot image is not a regular file: %s\n' "$image" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }
[ "$(wc -c < "$input")" -eq "$FLASH_SIZE" ] || {
	printf 'input must be exactly %s bytes\n' "$FLASH_SIZE" >&2
	exit 1
}
[ "$(wc -c < "$image")" -eq "$SLOT_SIZE" ] || {
	printf 'slot image must be exactly %s bytes\n' "$SLOT_SIZE" >&2
	exit 1
}
if [ -n "$root_image" ]; then
	[ -f "$root_image" ] || { printf 'root image is not a regular file: %s\n' "$root_image" >&2; exit 1; }
	[ "$(wc -c < "$root_image")" -eq "$ROOT_SIZE" ] || {
		printf 'root image must be exactly %s bytes\n' "$ROOT_SIZE" >&2
		exit 1
	}
fi

# Native KVM slots are reserved erased NOR blocks in the confirmed IMB760 layout.
if dd if="$input" bs=65536 skip=$((offset / 65536)) count=64 2>/dev/null |
	LC_ALL=C tr -d '\377' | cmp -s - /dev/null; then
	:
else
	printf 'target slot %s is not fully erased; refusing to overwrite it\n' "$slot" >&2
	exit 1
fi

cp "$input" "$output"
dd if="$image" of="$output" bs=65536 seek=$((offset / 65536)) count=64 conv=notrunc 2>/dev/null
if [ -n "$root_image" ]; then
	dd if="$root_image" of="$output" bs=65536 seek=30 count=243 conv=notrunc 2>/dev/null
	dd if="$root_image" of="$output" bs=4096 skip=3888 seek=4368 count=1 conv=notrunc 2>/dev/null
fi
readback=$(mktemp) || { rm -f "$output"; exit 1; }
trap 'rm -f "$readback"' EXIT HUP INT TERM
dd if="$output" of="$readback" bs=65536 skip=$((offset / 65536)) count=64 2>/dev/null
cmp -s "$image" "$readback" || {
	printf 'slot read-back differs from input image\n' >&2
	rm -f "$output"
	exit 1
}
if [ -n "$root_image" ]; then
	dd if="$output" of="$readback" bs=4096 skip=480 count=3889 2>/dev/null
	cmp -s "$root_image" "$readback" || {
		printf 'root read-back differs from input image\n' >&2
		rm -f "$output"
		exit 1
	}
fi
rm -f "$readback"
trap - EXIT HUP INT TERM

printf 'Composed %s slot at 0x%08x into %s\n' "$slot" "$offset" "$output"
sha256sum "$output"
