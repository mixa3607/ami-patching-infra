#!/bin/sh
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
[ -f "$input" ] || { printf 'missing environment: %s\n' "$input" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output exists: %s\n' "$output" >&2; exit 1; }

tool_dir=$(CDPATH= cd "$(dirname "$0")/../.." && pwd)
tool=$tool_dir/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools
tmp=$(mktemp -d) || exit 1
trap 'rm -rf "$tmp"' EXIT HUP INT TERM
"$tool" uboot env-read --input "$input" --output "$tmp/environment.json"
jq --arg mac "$mac" '.variables.ethaddr = $mac | .variables.eth1addr = $mac' \
	"$tmp/environment.json" > "$tmp/patched.json"
"$tool" uboot env-write --input "$tmp/patched.json" --output "$output"
"$tool" uboot env-read --input "$output" --output "$tmp/verified.json"
jq -e --arg mac "$mac" '.variables.ethaddr == $mac and .variables.eth1addr == $mac' \
	"$tmp/verified.json" >/dev/null
