#!/bin/sh
set -u

ENABLED=/conf/native-kvm.enabled
SLOT_FILE=/conf/native-kvm.slot
MTD_BLOCK=/dev/mtdblock0
MOUNT_POINT=/var/native-kvm
PIDFILE=/var/run/native-kvm.pid
LOGFILE=/var/log/native-kvm.log
AUTH_FILE=/conf/native-kvm.users
WAIT_SECONDS=${WAIT_SECONDS:-120}

[ -e "$ENABLED" ] || exit 0
[ "$(id -u)" -eq 0 ] || { printf '%s\n' 'native-kvm bootstrap must run as root' >&2; exit 1; }
case "$WAIT_SECONDS" in
	''|*[!0-9]*) printf 'invalid WAIT_SECONDS: %s\n' "$WAIT_SECONDS" >&2; exit 1 ;;
esac

slot=A
if [ -r "$SLOT_FILE" ]; then
	IFS= read -r slot < "$SLOT_FILE" || true
fi
case "$slot" in
	A) offset=23920640 ;;
	B) offset=28114944 ;;
	*) printf 'invalid native-kvm slot: %s\n' "$slot" >&2; exit 1 ;;
esac

if [ -r "$PIDFILE" ]; then
	IFS= read -r old_pid < "$PIDFILE" || old_pid=
	case "$old_pid" in
		''|*[!0-9]*) ;;
		*) kill -0 "$old_pid" 2>/dev/null && exit 0 ;;
	esac
fi

[ -b "$MTD_BLOCK" ] || { printf 'block device is unavailable: %s\n' "$MTD_BLOCK" >&2; exit 1; }
mkdir -p "$MOUNT_POINT" || exit 1

mounted=0
while read -r device point type options rest; do
	if [ "$point" = "$MOUNT_POINT" ]; then
		mounted=1
		[ "$type" = cramfs ] || { printf '%s is not a CramFS mount\n' "$MOUNT_POINT" >&2; exit 1; }
		case ",$options," in
			*,ro,*) ;;
			*) printf '%s is not mounted read-only\n' "$MOUNT_POINT" >&2; exit 1 ;;
		esac
		case "$device" in
			/dev/loop*) ;;
			*) printf '%s is not mounted through a loop device\n' "$MOUNT_POINT" >&2; exit 1 ;;
		esac
		loop_name=${device##*/}
		[ -r "/sys/block/$loop_name/loop/offset" ] || {
			printf 'cannot verify offset for %s\n' "$device" >&2
			exit 1
		}
		IFS= read -r mounted_offset < "/sys/block/$loop_name/loop/offset" || mounted_offset=
		[ "$mounted_offset" = "$offset" ] || {
			printf '%s is mounted at the wrong flash offset\n' "$MOUNT_POINT" >&2
			exit 1
		}
		[ -r "/sys/block/$loop_name/loop/backing_file" ] || {
			printf 'cannot verify backing device for %s\n' "$device" >&2
			exit 1
		}
		IFS= read -r backing_file < "/sys/block/$loop_name/loop/backing_file" || backing_file=
		case "$backing_file" in
			/dev/mtdblock0|dev/mtdblock0) ;;
			*) printf '%s has the wrong backing device\n' "$device" >&2; exit 1 ;;
		esac
		break
	fi
done < /proc/mounts

new_loop=
cleanup_mount()
{
	if [ -n "$new_loop" ]; then
		umount "$MOUNT_POINT" 2>/dev/null || true
		losetup -d "$new_loop" 2>/dev/null || true
	fi
}

if [ "$mounted" -eq 0 ]; then
	for loop in /dev/loop0 /dev/loop1 /dev/loop2 /dev/loop3 /dev/loop4 /dev/loop5 /dev/loop6 /dev/loop7; do
		[ -b "$loop" ] || continue
		if ! losetup "$loop" >/dev/null 2>&1; then
			new_loop=$loop
			break
		fi
	done
	[ -n "$new_loop" ] || { printf '%s\n' 'no free loop device' >&2; exit 1; }
	losetup -r -o "$offset" "$new_loop" "$MTD_BLOCK" || exit 1
	if ! mount -t cramfs -o ro "$new_loop" "$MOUNT_POINT"; then
		losetup -d "$new_loop" 2>/dev/null || true
		exit 1
	fi
fi

valid=1
[ -x "$MOUNT_POINT/ami-kvm-server" ] || valid=0
	[ -x "$MOUNT_POINT/run-ami-kvm-with-videocap.sh" ] || valid=0
[ -r "$MOUNT_POINT/videocap.ko" ] || valid=0
[ -r "$MOUNT_POINT/vendor/novnc/vnc.html" ] || valid=0
[ -r "$MOUNT_POINT/VERSION" ] || valid=0
[ -r "$MOUNT_POINT/manifest.sha256" ] || valid=0
[ -r "$MOUNT_POINT/manifest.sum" ] || valid=0
[ -x "$MOUNT_POINT/verify-manifest.sh" ] || valid=0
[ -r "$AUTH_FILE" ] || valid=0
if [ "$valid" -eq 1 ] && ! (cd "$MOUNT_POINT" && ./verify-manifest.sh manifest.sum >/dev/null 2>&1); then
	valid=0
fi
if [ "$valid" -ne 1 ]; then
	printf '%s\n' 'native-kvm slot contents failed validation' >&2
	cleanup_mount
	exit 1
fi

remaining=$WAIT_SECONDS
while ! pidof adviserd >/dev/null 2>&1; do
	if [ "$remaining" -le 0 ]; then
		printf '%s\n' 'timed out waiting for adviserd' >&2
		cleanup_mount
		exit 1
	fi
	sleep 1
	remaining=$((remaining - 1))
done

if ! AMI_KVM_SERVER="$MOUNT_POINT/ami-kvm-server" \
	CUSTOM_VIDEOCAP_KO="$MOUNT_POINT/videocap.ko" \
	start-stop-daemon --start --background --make-pidfile --pidfile "$PIDFILE" \
		--startas "$MOUNT_POINT/run-ami-kvm-with-videocap.sh" -- \
		--web-root "$MOUNT_POINT/vendor" --auth-file "$AUTH_FILE" >> "$LOGFILE" 2>&1; then
	cleanup_mount
	exit 1
fi
