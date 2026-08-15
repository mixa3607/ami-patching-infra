#!/bin/sh
set -eu

usage()
{
	printf 'Usage: %s VIDEOCAP.KO OUTPUT_DIRECTORY\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || usage
module=$1
output=$2

[ -f "$module" ] || { printf 'module is not a regular file: %s\n' "$module" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
repo_dir=$(CDPATH= cd "$script_dir/.." && pwd)
output_parent=$(dirname "$output")
output_name=$(basename "$output")
[ -d "$output_parent" ] || { printf 'output parent does not exist: %s\n' "$output_parent" >&2; exit 1; }
output_parent=$(CDPATH= cd "$output_parent" && pwd)

tmp=$(mktemp -d "$output_parent/.native-kvm-bundle.XXXXXX") || exit 1
cleanup()
{
	rm -rf "$tmp"
}
trap cleanup EXIT HUP INT TERM

make -C "$repo_dir" ami-kvm-server
file "$repo_dir/ami-kvm-server" | grep -q 'statically linked' || {
	printf '%s\n' 'ami-kvm-server is not statically linked' >&2
	exit 1
}

stage=$tmp/root
mkdir -p "$stage/vendor"
cp "$repo_dir/ami-kvm-server" "$stage/ami-kvm-server"
cp "$repo_dir/run-ami-kvm-with-videocap.sh" "$stage/run-ami-kvm-with-videocap.sh"
cp "$repo_dir/scripts/verify-manifest.sh" "$stage/verify-manifest.sh"
cp "$module" "$stage/videocap.ko"
cp -R "$repo_dir/vendor/novnc" "$stage/vendor/novnc"
chmod 755 "$stage/ami-kvm-server" "$stage/run-ami-kvm-with-videocap.sh" \
	"$stage/verify-manifest.sh"
chmod 644 "$stage/videocap.ko"

commit=unknown
branch=unknown
source_epoch=${SOURCE_DATE_EPOCH:-}
if command -v git >/dev/null 2>&1 && git -C "$repo_dir" rev-parse --git-dir >/dev/null 2>&1; then
	commit=$(git -C "$repo_dir" rev-parse HEAD)
	branch=$(git -C "$repo_dir" symbolic-ref --short -q HEAD || printf detached)
	[ -n "$source_epoch" ] || source_epoch=$(git -C "$repo_dir" show -s --format=%ct HEAD)
fi
[ -n "$source_epoch" ] || source_epoch=0

printf '%s\n' "$commit" > "$stage/VERSION"
{
	printf 'format=1\n'
	printf 'commit=%s\n' "$commit"
	printf 'branch=%s\n' "$branch"
	printf 'source_date_epoch=%s\n' "$source_epoch"
	printf 'videocap_sha256=%s\n' "$(sha256sum "$module" | cut -d ' ' -f 1)"
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

mv "$stage" "$output_parent/$output_name"
trap - EXIT HUP INT TERM
rm -rf "$tmp"
printf 'Bundle: %s\n' "$output_parent/$output_name"
