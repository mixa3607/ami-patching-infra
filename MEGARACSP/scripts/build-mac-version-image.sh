#!/bin/sh
set -eu

FLASH_SIZE=33554432
BASELINE_SHA256=aa8ae3bf892d18689e9ba7d0089a3abc5b413671aa6673a438f7dbf08df2e68c

usage()
{
	printf 'Usage: %s [--bak2shell] OUTPUT.BIN\n' "$0" >&2
	exit 2
}

bak2shell=0
case "$#" in
	1) output=$1 ;;
	2)
		[ "$1" = --bak2shell ] || usage
		bak2shell=1
		output=$2
		;;
	*) usage ;;
esac
script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
workspace=$(CDPATH= cd "$script_dir/.." && pwd)
tools_dir=$(CDPATH= cd "$workspace/.." && pwd)
tool=$tools_dir/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools
baseline=$workspace/IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin
table=$workspace/partitions.json
version_file=$workspace/version.txt
mac_file=$workspace/eth-mac.txt
[ -x "$tool" ] || { printf 'UEFI mod tool is not executable: %s\n' "$tool" >&2; exit 1; }
[ -f "$baseline" ] || { printf 'baseline is not a regular file: %s\n' "$baseline" >&2; exit 1; }
[ -f "$version_file" ] || { printf 'missing version file: %s\n' "$version_file" >&2; exit 1; }
[ -f "$mac_file" ] || { printf 'missing MAC file: %s\n' "$mac_file" >&2; exit 1; }
[ ! -e "$output" ] || { printf 'output already exists: %s\n' "$output" >&2; exit 1; }
[ "$(wc -c < "$baseline")" -eq "$FLASH_SIZE" ] || {
	printf 'baseline must be exactly %s bytes\n' "$FLASH_SIZE" >&2
	exit 1
}
[ "$(sha256sum "$baseline" | cut -d ' ' -f 1)" = "$BASELINE_SHA256" ] || {
	printf '%s\n' 'baseline SHA-256 does not match the verified IMB760 image' >&2
	exit 1
}
version=$(tr -d '\r\n' < "$version_file")
case "$version" in
	[0-9][0-9]) ;;
	*) printf 'version.txt must contain exactly two digits: %s\n' "$version" >&2; exit 1 ;;
esac
mac=$(tr -d '\r\n' < "$mac_file")
if ! printf '%s\n' "$mac" | grep -Eq '^[[:xdigit:]]{2}(:[[:xdigit:]]{2}){5}$'; then
	printf 'eth-mac.txt must contain a MAC address: %s\n' "$mac" >&2
	exit 1
fi
output_parent=$(dirname "$output")
[ -d "$output_parent" ] || { printf 'output parent does not exist: %s\n' "$output_parent" >&2; exit 1; }
output_parent=$(CDPATH= cd "$output_parent" && pwd)
output_name=$(basename "$output")
tmp=$(mktemp -d "$output_parent/.mac-version-image.XXXXXX") || exit 1
trap 'rm -rf "$tmp"' EXIT HUP INT TERM

"$tool" bin split --input "$baseline" --table "$table" --output "$tmp/partitions"
"$script_dir/patch-mac.sh" "$tmp/partitions/02_uboot-env.bin" "$tmp/uboot-env.bin" "$mac"
"$script_dir/patch-version-info.sh" "$tmp/partitions/90_firmware-info.bin" \
	"$tmp/firmware-info.bin" "$version"
if [ "$bak2shell" -eq 1 ]; then
	"$script_dir/patch-bak2shell.sh" "$tmp/partitions" "$tmp/config"
	cp "$tmp/config/20_conf-main.bin" "$tmp/partitions/20_conf-main.bin"
	cp "$tmp/config/30_conf-backup.bin" "$tmp/partitions/30_conf-backup.bin"
	cp "$tmp/config/40_conf-failsafe.bin" "$tmp/partitions/40_conf-failsafe.bin"
fi
cp "$tmp/uboot-env.bin" "$tmp/partitions/02_uboot-env.bin"
cp "$tmp/firmware-info.bin" "$tmp/partitions/90_firmware-info.bin"
"$tool" bin combine --input "$baseline" --table "$table" --partitions "$tmp/partitions" \
	--output "$output_parent/$output_name"

"$tool" bin split --input "$output_parent/$output_name" --table "$table" --output "$tmp/verified" >/dev/null
"$tool" uboot env-read --input "$tmp/verified/02_uboot-env.bin" --output "$tmp/verified-env.json" >/dev/null
jq -e --arg mac "$mac" '.variables.ethaddr == $mac and .variables.eth1addr == $mac' \
	"$tmp/verified-env.json" >/dev/null
cmp -s "$tmp/firmware-info.bin" "$tmp/verified/90_firmware-info.bin" || {
	printf '%s\n' 'firmware-info verification failed' >&2
	exit 1
}
if [ "$bak2shell" -eq 1 ]; then
	for item in 'main:20_conf-main.bin' 'backup:30_conf-backup.bin' 'failsafe:40_conf-failsafe.bin'; do
		name=${item%%:*}
		image=${item#*:}
		jefferson --dest "$tmp/verified-$name" "$tmp/verified/$image" >/dev/null
		[ "$(cat "$tmp/verified-$name/default_sh")" = "$(printf '%s\n' '[defaultshell]' 'default_shell="/bin/sh"')" ] || {
			printf 'bak2shell verification failed for %s\n' "$name" >&2
			exit 1
		}
	done
fi
for image in 01_uboot.bin 20_conf-main.bin 30_conf-backup.bin 40_conf-failsafe.bin \
	50_root.cramfs 60_uimage.bin 70_web-data.cramfs 80_native-kvm-slot-a.bin 90_firmware-info.bin; do
	[ "$image" = 90_firmware-info.bin ] && continue
	if [ "$bak2shell" -eq 1 ]; then
		case "$image" in
			20_conf-main.bin|30_conf-backup.bin|40_conf-failsafe.bin) continue ;;
		esac
	fi
	cmp -s "$tmp/partitions/$image" "$tmp/verified/$image" || {
		printf 'unexpected change in %s\n' "$image" >&2
		exit 1
	}
done
printf 'Patched image: %s\n' "$output_parent/$output_name"
sha256sum "$output_parent/$output_name"
