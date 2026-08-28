#!/bin/sh
set -u

manifest=${1:-manifest.sum}
[ -r "$manifest" ] || { printf 'manifest is not readable: %s\n' "$manifest" >&2; exit 1; }
command -v sum >/dev/null 2>&1 || { printf '%s\n' 'sum is required' >&2; exit 1; }

status=0
while IFS=' ' read -r expected blocks path; do
	[ -n "$expected" ] || continue
	while [ "${path# }" != "$path" ]; do path=${path# }; done
	case "$path" in
		./*) ;;
		*) printf 'invalid manifest path: %s\n' "$path" >&2; status=1; continue ;;
	esac
	[ -f "$path" ] || { printf '%s: missing\n' "$path" >&2; status=1; continue; }
	line=$(sum "$path") || { status=1; continue; }
	set -- $line
	if [ "$#" -ge 2 ] && [ "$1" = "$expected" ] && [ "$2" = "$blocks" ]; then
		printf '%s: OK\n' "$path"
	else
		printf '%s: FAILED\n' "$path" >&2
		status=1
	fi
done < "$manifest"
exit "$status"
