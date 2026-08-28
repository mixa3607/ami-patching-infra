#!/bin/sh
# Generic payload slot bootstrap.
#
# Mounts the 80_payload-slot-a CramFS region on the SPI flash early in boot
# and runs each payload's init.sh for the requested stage. Presence of a
# payload directory in payloads.list means the payload is enabled.
#
# Stages:
#   mount     - right after the slot is mounted (early, from rcS)
#   adviserd  - later, when the stock adviserd/KVM stack is up (from adviserd.sh)
set -u

MOUNT_POINT=/var/payload
SLOT_MTD=/dev/mtdblock0
SLOT_OFFSET=0x016D0000
LOOP_HELPER=/usr/local/sbin/payload-loop
ATTACH_TRIES=20

mount_slot()
{
	[ -d "$MOUNT_POINT" ] || mkdir -p "$MOUNT_POINT" || return 1
	grep -q " $MOUNT_POINT " /proc/mounts && return 0
	[ -x "$LOOP_HELPER" ] || return 1
	[ -b "$SLOT_MTD" ] || return 1

	tries=0
	while [ "$tries" -lt "$ATTACH_TRIES" ]; do
		for loop in /dev/loop0 /dev/loop1 /dev/loop2 /dev/loop3 \
			/dev/loop4 /dev/loop5 /dev/loop6 /dev/loop7; do
			[ -b "$loop" ] || continue
			if "$LOOP_HELPER" "$loop" "$SLOT_MTD" "$SLOT_OFFSET" 2>/dev/null; then
				if mount -t cramfs -o ro "$loop" "$MOUNT_POINT" 2>/dev/null; then
					return 0
				fi
				"$LOOP_HELPER" -d "$loop" 2>/dev/null
			fi
		done
		tries=$((tries + 1))
		sleep 1
	done
	return 1
}

run_stage()
{
	stage=$1
	[ -r "$MOUNT_POINT/payloads.list" ] || return 0
	IFS='
'
	for payload in $(cat "$MOUNT_POINT/payloads.list"); do
		[ -n "$payload" ] || continue
		init="$MOUNT_POINT/$payload/init.sh"
		[ -x "$init" ] || continue
		(
			cd "$MOUNT_POINT/$payload" || exit 1
			PAYLOAD_MOUNT="$MOUNT_POINT"
			./init.sh "$stage"
		)
	done
	return 0
}

case "${1:-mount}" in
	mount)
		mount_slot && run_stage mount
		;;
	adviserd)
		mount_slot && run_stage adviserd
		;;
	*)
		printf 'usage: %s mount|adviserd\n' "$0" >&2
		exit 2
		;;
esac
