#!/bin/sh
set -eu

usage()
{
	printf 'Usage: %s INPUT-PARTITIONS-DIR OUTPUT-DIR\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || usage
input=$1
output=$2
[ -d "$input" ] || { printf 'missing partitions directory: %s\n' "$input" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output exists: %s\n' "$output" >&2; exit 1; }
mkdir -p "$output"
tmp=$(mktemp -d) || exit 1
trap 'rm -rf "$tmp"' EXIT HUP INT TERM

for item in 'main:20_conf-main.bin' 'backup:30_conf-backup.bin' 'failsafe:40_conf-failsafe.bin'; do
	name=${item%%:*}
	image=${item#*:}
	[ -f "$input/$image" ] || { printf 'missing partition: %s\n' "$input/$image" >&2; exit 1; }
	jefferson --dest "$tmp/$name" "$input/$image" >/dev/null
	chmod -R u+rX "$tmp/$name"
	printf '%s\n' '[defaultshell]' 'default_shell="/bin/sh"' > "$tmp/$name/default_sh"
	fakeroot mkfs.jffs2 --little-endian --eraseblock=0x10000 --pad=0x70000 \
		--root="$tmp/$name" --output="$output/$image"
	[ "$(wc -c < "$output/$image")" -eq 458752 ] || {
		printf 'unexpected JFFS2 size: %s\n' "$output/$image" >&2
		exit 1
	}
	jffs2dump -c "$output/$image" >/dev/null
done
