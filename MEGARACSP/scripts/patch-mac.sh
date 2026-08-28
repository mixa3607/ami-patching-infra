#!/bin/sh
# MAC address patch: one implementation on top of the generic U-Boot
# environment mechanism (patch-uboot-env.sh).
set -eu

usage()
{
	printf 'Usage: %s INPUT-ENV.BIN OUTPUT-ENV.BIN [MAC]\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || [ "$#" -eq 3 ] || usage
input=$1
output=$2
mac=${3:-de:ad:be:ee:ee:ef}
if ! printf '%s\n' "$mac" | grep -Eq '^[[:xdigit:]]{2}(:[[:xdigit:]]{2}){5}$'; then
	printf 'invalid MAC address: %s\n' "$mac" >&2
	exit 2
fi

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
"$script_dir/patch-uboot-env.sh" "$input" "$output" "ethaddr=$mac" "eth1addr=$mac"
