#!/bin/sh
# native-kvm payload launcher. Runs only at the adviserd stage, when the
# stock adviserd/KVM stack is up and its iUSB HID reservation is available.
set -u

AUTH_FILE=/conf/native-kvm.users
PIDFILE=/var/run/native-kvm.pid
LOGFILE=/var/log/native-kvm.log
SELF_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)

[ "$1" = adviserd ] || exit 0
[ -r "$AUTH_FILE" ] || exit 0

if [ -r "$PIDFILE" ]; then
	IFS= read -r old_pid < "$PIDFILE" || old_pid=
	case "$old_pid" in
		''|*[!0-9]*) ;;
		*) kill -0 "$old_pid" 2>/dev/null && exit 0 ;;
	esac
fi

remaining=120
while :; do
	for process in /proc/[0-9]*; do
		[ -r "$process/comm" ] || continue
		IFS= read -r name < "$process/comm" || continue
		[ "$name" = adviserd ] || continue
		printf '%s\n' "${process#/proc/}" > /var/run/Adviserd.pid
		break 2
	done
	[ "$remaining" -gt 0 ] || exit 1
	sleep 1
	remaining=$((remaining - 1))
done

cd "$SELF_DIR" || exit 1
AMI_KVM_SERVER="$PWD/ami-kvm-server" \
CUSTOM_VIDEOCAP_KO="$PWD/videocap.ko" \
"$PWD/run-ami-kvm-with-videocap.sh" \
	--web-root "$PWD/vendor" --auth-file "$AUTH_FILE" >> "$LOGFILE" 2>&1 &
printf '%s\n' "$!" > "$PIDFILE"
