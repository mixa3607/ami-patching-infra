#!/bin/sh
set -eu

SLOT_SIZE=4194304
CONFIRM=--i-understand-this-erases-native-kvm-slot
MTD=/dev/mtd0
MTD_RO=/dev/mtd0ro

usage()
{
	printf 'Usage: %s A|B IMAGE %s\n' "$0" "$CONFIRM" >&2
	exit 2
}

[ "$#" -eq 3 ] || usage
slot=$1
image=$2
[ "$3" = "$CONFIRM" ] || usage

case "$slot" in
	A) block=365; erase_offset=23920640 ;;
	B) block=429; erase_offset=28114944 ;;
	*) usage ;;
esac

[ "$(id -u)" -eq 0 ] || { printf '%s\n' 'must run as root' >&2; exit 1; }
for tool in flash_erase dd diff od wc mktemp sum; do
	command -v "$tool" >/dev/null 2>&1 || { printf 'required tool is unavailable: %s\n' "$tool" >&2; exit 1; }
done
[ -f "$image" ] || { printf 'image is not a regular file: %s\n' "$image" >&2; exit 1; }
[ -c "$MTD" ] || { printf 'MTD device is unavailable: %s\n' "$MTD" >&2; exit 1; }
[ -c "$MTD_RO" ] || { printf 'read-only MTD device is unavailable: %s\n' "$MTD_RO" >&2; exit 1; }
[ "$(wc -c < "$image")" -eq "$SLOT_SIZE" ] || {
	printf 'image must be exactly %s bytes\n' "$SLOT_SIZE" >&2
	exit 1
}

set -- $(dd if="$image" bs=4 count=1 2>/dev/null | od -An -tx1)
[ "$#" -eq 4 ] && [ "$1" = 45 ] && [ "$2" = 3d ] && [ "$3" = cd ] && [ "$4" = 28 ] || {
	printf '%s\n' 'image does not have little-endian CramFS magic' >&2
	exit 1
}

if [ -e /conf/native-kvm.enabled ]; then
	active=A
	if [ -r /conf/native-kvm.slot ]; then
		IFS= read -r active < /conf/native-kvm.slot || true
	fi
	[ "$active" != "$slot" ] || {
		printf 'refusing to overwrite enabled slot %s\n' "$slot" >&2
		exit 1
	}
fi

for offset_file in /sys/block/loop*/loop/offset; do
	[ -r "$offset_file" ] || continue
	IFS= read -r mounted_offset < "$offset_file" || mounted_offset=
	[ "$mounted_offset" != "$erase_offset" ] || {
		printf 'refusing to overwrite slot %s while it is attached through a loop device\n' "$slot" >&2
		exit 1
	}
done

if [ -r /sys/class/mtd/mtd0/erasesize ]; then
	IFS= read -r erase_size < /sys/class/mtd/mtd0/erasesize || erase_size=
	[ "$erase_size" = 65536 ] || {
		printf 'unexpected mtd0 erase size: %s\n' "$erase_size" >&2
		exit 1
	}
fi
if [ -r /sys/class/mtd/mtd0/size ]; then
	IFS= read -r mtd_size < /sys/class/mtd/mtd0/size || mtd_size=0
	case "$mtd_size" in
		''|*[!0-9]*) printf 'invalid mtd0 size: %s\n' "$mtd_size" >&2; exit 1 ;;
	esac
	[ "$mtd_size" -ge $((erase_offset + SLOT_SIZE)) ] || {
		printf 'mtd0 is too small: %s bytes\n' "$mtd_size" >&2
		exit 1
	}
fi

readback=$(mktemp /tmp/native-kvm-readback.XXXXXX) || exit 1
cleanup()
{
	rm -f "$readback"
}
trap cleanup EXIT HUP INT TERM

printf 'Image checksum: %s\n' "$(sum "$image")"
printf 'Erasing slot %s: block 0x%x, 64 blocks on %s\n' "$slot" "$block" "$MTD"
flash_erase "$MTD" "$erase_offset" 64
dd if="$image" of="$MTD" bs=65536 seek="$block" count=64 conv=notrunc

dd if="$MTD_RO" of="$readback" bs=65536 skip="$block" count=64
[ "$(wc -c < "$readback")" -eq "$SLOT_SIZE" ] || {
	printf '%s\n' 'short read while verifying slot' >&2
	exit 1
}
if ! diff "$image" "$readback" >/dev/null; then
	printf '%s\n' 'verification failed: read-back differs from image' >&2
	exit 1
fi
printf 'Verified slot %s byte-for-byte: %s\n' "$slot" "$(sum "$readback")"
printf '%s\n' 'Slot was not activated.'
