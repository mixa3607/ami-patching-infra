#!/bin/sh
# Generic configuration partition patch. Injects the given files into all
# three JFFS2 configuration partitions (main, backup, failsafe). Source file
# permissions are preserved (create e.g. native-kvm.users with mode 600).
#
#   patch-config.sh INPUT-PARTITIONS-DIR OUTPUT-DIR SRC=INSTALL...
set -eu

usage()
{
	printf 'Usage: %s INPUT-PARTITIONS-DIR OUTPUT-DIR SRC=INSTALL...\n' "$0" >&2
	exit 2
}

[ "$#" -ge 3 ] || usage
input=$1
output=$2
shift 2
[ "$#" -ge 1 ] || usage

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
	for spec in "$@"; do
		src=${spec%%=*}
		install=${spec#*=}
		[ -f "$src" ] || { printf 'missing config source: %s\n' "$src" >&2; exit 1; }
		install=${install#/}
		case "$install" in
			''|*/*) printf 'config install path must be a plain file name: %s\n' "$install" >&2; exit 1 ;;
		esac
		cp -p "$src" "$tmp/$name/$install"
	done
	fakeroot mkfs.jffs2 --little-endian --eraseblock=0x10000 --pad=0x70000 \
		--root="$tmp/$name" --output="$output/$image"
	[ "$(wc -c < "$output/$image")" -eq 458752 ] || {
		printf 'unexpected JFFS2 size: %s\n' "$output/$image" >&2
		exit 1
	}
	jffs2dump -c "$output/$image" >/dev/null
done
