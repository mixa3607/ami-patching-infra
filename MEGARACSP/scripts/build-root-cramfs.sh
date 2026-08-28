#!/bin/sh
set -eu

ROOT_SIZE=15929344

usage()
{
	printf 'Usage: %s ROOT.BIN PAYLOAD-LOOP PAYLOAD-BOOTSTRAP OUTPUT.BIN [--drop-legacy-zoneinfo|--drop-posix-zoneinfo]\n' "$0" >&2
	exit 2
}

[ "$#" -eq 4 ] || [ "$#" -eq 5 ] || usage
source_root=$1
loop_helper=$2
bootstrap=$3
output=$4
drop_zoneinfo=none
if [ "$#" -eq 5 ]; then
	case "$5" in
		--drop-legacy-zoneinfo) drop_zoneinfo=legacy ;;
		--drop-posix-zoneinfo) drop_zoneinfo=posix ;;
		*) usage ;;
	esac
fi
[ -f "$source_root" ] || { printf 'root image is not a regular file: %s\n' "$source_root" >&2; exit 1; }
[ -f "$loop_helper" ] || { printf 'loop helper is not a regular file: %s\n' "$loop_helper" >&2; exit 1; }
[ -f "$bootstrap" ] || { printf 'payload bootstrap is not a regular file: %s\n' "$bootstrap" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }
[ "$(wc -c < "$source_root")" -eq "$ROOT_SIZE" ] || {
	printf 'root image must be exactly %s bytes\n' "$ROOT_SIZE" >&2
	exit 1
}

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
output_parent=$(dirname "$output")
[ -d "$output_parent" ] || { printf 'output parent does not exist: %s\n' "$output_parent" >&2; exit 1; }
output_parent=$(CDPATH= cd "$output_parent" && pwd)
tmp=$(mktemp -d "$output_parent/.payload-root.XXXXXX") || exit 1
cleanup()
{
	rm -rf "$tmp"
}
trap cleanup EXIT HUP INT TERM

fakeroot sh -c '
	set -eu
	source_root=$1
	loop_helper=$2
	bootstrap=$3
	tmp=$4
	output=$5
	drop_zoneinfo=$6
	fsck.cramfs --extract="$tmp/root" "$source_root"
	mkdir -p "$tmp/root/usr/local/sbin" "$tmp/root/etc/init.d" "$tmp/root/etc/rcS.d" "$tmp/root/etc/rc3.d"
	cp "$loop_helper" "$tmp/root/usr/local/sbin/payload-loop"
	cp "$bootstrap" "$tmp/root/usr/local/sbin/payload-bootstrap"
	cat > "$tmp/root/etc/init.d/payload-mount.sh" <<EOS
#!/bin/sh
### BEGIN INIT INFO
# Provides:          payload-mount
# Required-Start:    mountall
# Required-Stop:
# Default-Start:     S
# Default-Stop:
# Short-Description: Mount generic CramFS payload slot early
### END INIT INFO

case "\$1" in
	start)
		/usr/local/sbin/payload-bootstrap mount
		;;
esac
EOS
	chmod 755 "$tmp/root/etc/init.d/payload-mount.sh"
	ln -s ../init.d/payload-mount.sh "$tmp/root/etc/rcS.d/S19payload-mount.sh"
	{
		while IFS= read -r line; do
			[ "$line" = "exit 0" ] && printf "\n[ \"\$ACTION\" = start ] && ( sleep 5; /usr/local/sbin/payload-bootstrap adviserd ) &\n"
			printf "%s\n" "$line"
		done < "$tmp/root/etc/init.d/adviserd.sh"
	} > "$tmp/root/etc/init.d/adviserd.sh.new"
	mv "$tmp/root/etc/init.d/adviserd.sh.new" "$tmp/root/etc/init.d/adviserd.sh"
	chmod 755 "$tmp/root/etc/init.d/adviserd.sh" \
		"$tmp/root/usr/local/sbin/payload-loop" \
		"$tmp/root/usr/local/sbin/payload-bootstrap"
	chown 0:0 "$tmp/root/usr/local/sbin/payload-loop" \
		"$tmp/root/usr/local/sbin/payload-bootstrap"
	if [ "$drop_zoneinfo" = legacy ]; then
		rm -rf "$tmp/root/usr/share/zoneinfo/SystemV" "$tmp/root/usr/share/zoneinfo/posixrules"
	elif [ "$drop_zoneinfo" = posix ]; then
		rm -rf "$tmp/root/usr/share/zoneinfo/posix"
	fi
	mkfs.cramfs -N little -b 4096 -e 0 -n Compressed "$tmp/root" "$output"
' sh "$source_root" "$loop_helper" "$bootstrap" "$tmp" "$output_parent/$(basename "$output")" "$drop_zoneinfo"


output_file=$output_parent/$(basename "$output")
output_size=$(wc -c < "$output_file")
[ "$output_size" -le "$ROOT_SIZE" ] || {
	printf 'rebuilt root is %s bytes, exceeds %s-byte allocation by %s bytes\n' \
		"$output_size" "$ROOT_SIZE" "$((output_size - ROOT_SIZE))" >&2
	rm -f "$output_file"
	exit 1
}
fsck.cramfs -v "$output_file"
sha256sum "$output_file"
