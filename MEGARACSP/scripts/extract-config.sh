#!/bin/sh
set -eu

usage()
{
	printf 'Usage: %s PARTITIONS-DIR OUTPUT-DIR\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || usage
partitions=$1
output=$2
mkdir -p "$output"
for name in main backup failsafe; do
	case "$name" in
		main) image=20_conf-main.bin ;;
		backup) image=30_conf-backup.bin ;;
		failsafe) image=40_conf-failsafe.bin ;;
	esac
	[ -f "$partitions/$image" ] || { printf 'missing partition: %s\n' "$partitions/$image" >&2; exit 1; }
	jefferson --dest "$output/$name" "$partitions/$image"
	chmod -R u+rX "$output/$name"
done
