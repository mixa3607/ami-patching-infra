#!/bin/sh
set -eu

INFO_SIZE=157
usage()
{
	printf 'Usage: %s INPUT-FIRMWARE-INFO.BIN OUTPUT-FIRMWARE-INFO.BIN VERSION\n' "$0" >&2
	exit 2
}

[ "$#" -eq 3 ] || usage
input=$1
output=$2
version=$3
case "$version" in
	[0-9][0-9]) ;;
	*) printf 'version must be exactly two digits: %s\n' "$version" >&2; exit 2 ;;
esac
BUILD_TIME="MOD N1 VER$version"
DESCRIPTION="RR10 AST2500 MOD N1 VER $version"
[ -f "$input" ] || { printf 'missing firmware info: %s\n' "$input" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output exists: %s\n' "$output" >&2; exit 1; }
[ "$(wc -c < "$input")" -eq "$INFO_SIZE" ] || {
	printf 'unexpected firmware info size: %s\n' "$input" >&2
	exit 1
}
[ "${#BUILD_TIME}" -eq 12 ] || { printf '%s\n' 'internal build-time length error' >&2; exit 1; }
[ "${#DESCRIPTION}" -eq 26 ] || { printf '%s\n' 'internal description length error' >&2; exit 1; }

# These fields have fixed-width values in the 157-byte AST2500 firmware-info record.
cp "$input" "$output"
printf '%s' "$BUILD_TIME" | dd of="$output" bs=1 seek=54 count=12 conv=notrunc 2>/dev/null
printf '%s' "$DESCRIPTION" | dd of="$output" bs=1 seek=75 count=26 conv=notrunc 2>/dev/null
[ "$(wc -c < "$output")" -eq "$INFO_SIZE" ] || {
	printf 'patched firmware info changed size: %s\n' "$output" >&2
	exit 1
}
expected=$(mktemp) || exit 1
trap 'rm -f "$expected"' EXIT HUP INT TERM
printf '%s\n' \
	'FW_VERSION=2.02.76714' \
	'FW_DATE=Aug 8 2022' \
	"FW_BUILDTIME=$BUILD_TIME" \
	"FW_DESC=$DESCRIPTION" \
	'FW_PRODUCTID=1' \
	'FW_RELEASEID=RR9' \
	'FW_CODEBASEVERSION=3.X' > "$expected"
cmp -s "$output" "$expected" || {
	printf '%s\n' 'unexpected firmware-info record format' >&2
	exit 1
}
