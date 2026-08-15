#!/bin/sh
set -eu

usage()
{
	printf 'Usage: %s INPUT-PARTITIONS-DIR OUTPUT-DIR [--native-kvm]\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || [ "$#" -eq 3 ] || usage
input=$1
output=$2
native_kvm=0
if [ "$#" -eq 3 ]; then
	[ "$3" = --native-kvm ] || usage
	native_kvm=1
fi
[ -d "$input" ] || { printf 'missing partitions directory: %s\n' "$input" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output exists: %s\n' "$output" >&2; exit 1; }
mkdir -p "$output"
tmp=$(mktemp -d) || exit 1
trap 'rm -rf "$tmp"' EXIT HUP INT TERM

for item in 'main:20_conf-main.bin' 'backup:30_conf-backup.bin' 'failsafe:40_conf-failsafe.bin'; do
	name=${item%%:*}
	image=${item#*:}
	[ -f "$input/$image" ] || { printf 'missing partition: %s\n' "$input/$image" >&2; exit 1; }
	jefferson --dest "$tmp/$name" "$input/$image"
	chmod -R u+rX "$tmp/$name"
	printf '%s\n' '[defaultshell]' 'default_shell="/bin/sh"' > "$tmp/$name/default_sh"
	if [ "$native_kvm" -eq 1 ]; then
		: > "$tmp/$name/native-kvm.enabled"
		printf '%s\n' A > "$tmp/$name/native-kvm.slot"
		printf '%s\n' 'admin:admin' > "$tmp/$name/native-kvm.users"
		chmod 600 "$tmp/$name/native-kvm.users"
	fi
	fakeroot mkfs.jffs2 --little-endian --eraseblock=0x10000 --pad=0x70000 \
		--root="$tmp/$name" --output="$output/$image"
	[ "$(wc -c < "$output/$image")" -eq 458752 ] || {
		printf 'unexpected JFFS2 size: %s\n' "$output/$image" >&2
		exit 1
	}
	jffs2dump -c "$output/$image" >/dev/null
done
