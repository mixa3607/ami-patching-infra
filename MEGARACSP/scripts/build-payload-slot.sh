#!/bin/sh
# Build the generic payload slot CramFS from one or more payload directories.
#
# Each payload directory becomes $stage/<basename>/. The resulting filesystem
# carries:
#   verify-manifest.sh   manifest checker used by the runtime bootstrap
#   payloads.list        enabled payload names (sorted)
#   provenance           build provenance
#   manifest.sha256      SHA-256 manifest
#   manifest.sum         sum(1) manifest (target-compatible)
#
# The output is a plain CramFS image; the uefi-mod-tools bin combine pads it
# with 0xff to the partition length and fails if it does not fit.
set -eu

usage()
{
	printf 'Usage: %s OUTPUT.CRAMFS PAYLOAD-DIR...\n' "$0" >&2
	exit 2
}

[ "$#" -ge 2 ] || usage
output=$1
shift
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
workspace=$(CDPATH= cd "$script_dir/.." && pwd)
output_parent=$(dirname "$output")
[ -d "$output_parent" ] || { printf 'output parent does not exist: %s\n' "$output_parent" >&2; exit 1; }
output_parent=$(CDPATH= cd "$output_parent" && pwd)
output_name=$(basename "$output")

tmp=$(mktemp -d "$output_parent/.payload-slot.XXXXXX") || exit 1
cleanup()
{
	rm -rf "$tmp"
}
trap cleanup EXIT HUP INT TERM

stage=$tmp/root
mkdir -p "$stage"

cp "$script_dir/verify-manifest.sh" "$stage/verify-manifest.sh"
chmod 755 "$stage/verify-manifest.sh"

payloads=
for dir in "$@"; do
	[ -d "$dir" ] || { printf 'payload directory not found: %s\n' "$dir" >&2; exit 1; }
	name=$(basename "$dir")
	case "$name" in
		''|*[!A-Za-z0-9_.-]*) printf 'invalid payload name: %s\n' "$name" >&2; exit 1 ;;
		payloads.list|verify-manifest.sh|provenance|manifest.sha256|manifest.sum)
			printf 'reserved payload name: %s\n' "$name" >&2
			exit 1
			;;
	esac
	[ -e "$stage/$name" ] && { printf 'duplicate payload name: %s\n' "$name" >&2; exit 1; }
	cp -a "$dir" "$stage/$name"
	chmod -R u+rX "$stage/$name"
	payloads="$payloads
$name"
done

printf '%s\n' "$payloads" | sed '/^$/d' | LC_ALL=C sort > "$stage/payloads.list"
[ -s "$stage/payloads.list" ] || { printf '%s\n' 'no payloads selected' >&2; exit 1; }

commit=unknown
branch=unknown
source_epoch=${SOURCE_DATE_EPOCH:-}
if command -v git >/dev/null 2>&1 && git -C "$workspace" rev-parse --git-dir >/dev/null 2>&1; then
	commit=$(git -C "$workspace" rev-parse HEAD)
	branch=$(git -C "$workspace" symbolic-ref --short -q HEAD || printf detached)
	[ -n "$source_epoch" ] || source_epoch=$(git -C "$workspace" show -s --format=%ct HEAD)
fi
[ -n "$source_epoch" ] || source_epoch=0

{
	printf 'format=1\n'
	printf 'commit=%s\n' "$commit"
	printf 'branch=%s\n' "$branch"
	printf 'source_date_epoch=%s\n' "$source_epoch"
	while IFS= read -r p; do
		[ -n "$p" ] || continue
		# shellcheck disable=SC2046
		sum=$(cd "$stage/$p" && find . -type f -print | LC_ALL=C sort | xargs sha256sum | sha256sum | cut -d ' ' -f 1)
		printf 'payload_%s=%s\n' "$p" "$sum"
	done < "$stage/payloads.list"
} > "$stage/provenance"

(
	cd "$stage"
	find . -type f ! -name manifest.sha256 ! -name manifest.sum -print | LC_ALL=C sort |
	while IFS= read -r path; do
		sha256sum "$path"
	done > manifest.sha256
	find . -type f ! -name manifest.sha256 ! -name manifest.sum -print | LC_ALL=C sort |
	while IFS= read -r path; do
		sum "$path"
	done > manifest.sum
)

if command -v mkfs.cramfs >/dev/null 2>&1; then
	if mkfs.cramfs --help 2>&1 | grep -q -- '-N endian'; then
		mkfs.cramfs -N little -n payload "$stage" "$tmp/filesystem.cramfs"
	else
		mkfs.cramfs -n payload "$stage" "$tmp/filesystem.cramfs"
	fi
elif command -v mkcramfs >/dev/null 2>&1; then
	mkcramfs "$stage" "$tmp/filesystem.cramfs"
else
	printf '%s\n' 'mkfs.cramfs or mkcramfs is required' >&2
	exit 1
fi

if command -v fsck.cramfs >/dev/null 2>&1; then
	fsck.cramfs "$tmp/filesystem.cramfs"
fi

mv "$tmp/filesystem.cramfs" "$output_parent/$output_name"
trap - EXIT HUP INT TERM
rm -rf "$tmp"
sha256sum "$output_parent/$output_name"
