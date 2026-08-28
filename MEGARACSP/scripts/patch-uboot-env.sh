#!/bin/sh
# Generic U-Boot environment patch. Reads an environment partition, sets the
# given variables, writes it back and verifies the result.
#
#   patch-uboot-env.sh INPUT.BIN OUTPUT.BIN VAR=VALUE [VAR=VALUE ...]
set -eu

usage()
{
	printf 'Usage: %s INPUT-ENV.BIN OUTPUT-ENV.BIN VAR=VALUE...\n' "$0" >&2
	exit 2
}

[ "$#" -ge 4 ] || usage
input=$1
output=$2
shift 2
[ "$#" -ge 1 ] || usage

[ -f "$input" ] || { printf 'missing environment: %s\n' "$input" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output exists: %s\n' "$output" >&2; exit 1; }

tool_dir=$(CDPATH= cd "$(dirname "$0")/../.." && pwd)
tool=$tool_dir/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools
[ -x "$tool" ] || { printf 'UEFI mod tool is not executable: %s\n' "$tool" >&2; exit 1; }

tmp=$(mktemp -d) || exit 1
trap 'rm -rf "$tmp"' EXIT HUP INT TERM

jq_filter='.'
for pair in "$@"; do
	var=${pair%%=*}
	val=${pair#*=}
	case "$var" in
		''|*[!A-Za-z0-9_.]*) printf 'invalid variable name: %s\n' "$var" >&2; exit 1 ;;
	esac
	[ -n "$val" ] || { printf 'empty value for %s\n' "$var" >&2; exit 1; }
	jq_filter=$(printf '%s | .variables[%s] = %s' "$jq_filter" \
		"$(printf '%s' "$var" | jq -R .)" "$(printf '%s' "$val" | jq -R .)")
done

"$tool" uboot env-read --input "$input" --output "$tmp/environment.json"
jq "$jq_filter" "$tmp/environment.json" > "$tmp/patched.json"
"$tool" uboot env-write --input "$tmp/patched.json" --output "$output"
"$tool" uboot env-read --input "$output" --output "$tmp/verified.json"
for pair in "$@"; do
	var=${pair%%=*}
	val=${pair#*=}
	jq -e --arg var "$var" --arg val "$val" \
		'.variables[$var] == $val' "$tmp/verified.json" >/dev/null || {
		printf 'verification failed for %s=%s\n' "$var" "$val" >&2
		exit 1
	}
done
