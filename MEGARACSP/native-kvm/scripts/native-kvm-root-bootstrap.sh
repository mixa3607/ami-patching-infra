#!/bin/sh
set -u

ENABLED=/conf/native-kvm.enabled
AUTH_FILE=/conf/native-kvm.users
MTD_BLOCK=/dev/mtdblock0
MOUNT_POINT=/var/native-kvm
LOOP_HELPER=/usr/local/sbin/native-kvm-loop
PIDFILE=/var/run/native-kvm.pid
LOGFILE=/var/log/native-kvm.log

[ -e "$ENABLED" ] || exit 0

offset=23920640

find_adviserd()
{
	for process in /proc/[0-9]*; do
		[ -r "$process/comm" ] || continue
		IFS= read -r name < "$process/comm" || continue
		[ "$name" = adviserd ] && { printf '%s\n' "${process#/proc/}"; return 0; }
	done
	return 1
}

if [ -r "$PIDFILE" ]; then
	IFS= read -r old_pid < "$PIDFILE" || old_pid=
	case "$old_pid" in
		''|*[!0-9]*) ;;
		*) kill -0 "$old_pid" 2>/dev/null && exit 0 ;;
	esac
fi

[ -x "$LOOP_HELPER" ] && [ -b "$MTD_BLOCK" ] && [ -r "$AUTH_FILE" ] || exit 1
mkdir -p "$MOUNT_POINT" || exit 1

loop=
for candidate in /dev/loop0 /dev/loop1 /dev/loop2 /dev/loop3 /dev/loop4 /dev/loop5 /dev/loop6 /dev/loop7; do
	[ -b "$candidate" ] || continue
	if "$LOOP_HELPER" "$candidate" "$MTD_BLOCK" "$offset"; then
		loop=$candidate
		break
	fi
done
[ -n "$loop" ] || exit 1

cleanup()
{
	umount "$MOUNT_POINT" 2>/dev/null || true
	"$LOOP_HELPER" -d "$loop" 2>/dev/null || true
}

mount -t cramfs -o ro "$loop" "$MOUNT_POINT" || { cleanup; exit 1; }
if ! (cd "$MOUNT_POINT" && ./verify-manifest.sh manifest.sum >/dev/null 2>&1); then
	cleanup
	exit 1
fi

remaining=120
while :; do
	if adviser=$(find_adviserd); then
		printf '%s\n' "$adviser" >/var/run/Adviserd.pid
		break
	fi
	[ "$remaining" -gt 0 ] || { cleanup; exit 1; }
	sleep 1
	remaining=$((remaining - 1))
done

AMI_KVM_SERVER="$MOUNT_POINT/ami-kvm-server" \
CUSTOM_VIDEOCAP_KO="$MOUNT_POINT/videocap.ko" \
"$MOUNT_POINT/run-ami-kvm-with-videocap.sh" \
	--web-root "$MOUNT_POINT/vendor" --auth-file "$AUTH_FILE" >> "$LOGFILE" 2>&1 &
printf '%s\n' "$!" > "$PIDFILE"
