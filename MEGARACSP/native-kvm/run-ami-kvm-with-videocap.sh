#!/bin/sh
set -u

# Override these from the environment for the target image/layout.
AMI_KVM_SERVER=${AMI_KVM_SERVER:-/tmp/ami-kvm-server}
CUSTOM_VIDEOCAP_KO=${CUSTOM_VIDEOCAP_KO:-/tmp/videocap.ko}
STOCK_VIDEOCAP_KO=${STOCK_VIDEOCAP_KO:-/lib/modules/generic/misc/videocap.ko}
ADVISER_INIT=${ADVISER_INIT:-/etc/init.d/adviserd.sh}
ADVISER_PIDFILE=${ADVISER_PIDFILE:-/var/run/Adviserd.pid}
MODULE_NAME=${MODULE_NAME:-videocap}
STOP_TIMEOUT=${STOP_TIMEOUT:-8}
ADOPT_FILE=${ADOPT_FILE:-/var/run/ami-kvm-adopt.$$}
ADVISERD_MOUSE_ADDRESS=161184
ADVISERD_KEYBOARD_ADDRESS=161196

server_pid=
adviserd_was_running=0
cleanup_running=0
restore_needed=0
adopt_file_created=0

is_module_loaded()
{
	while read -r name rest; do
		[ "$name" = "$MODULE_NAME" ] && return 0
	done < /proc/modules
	return 1
}

adviserd_pid()
{
	if [ -r "$ADVISER_PIDFILE" ]; then
		pid=$(sed -n '1p' "$ADVISER_PIDFILE")
		case "$pid" in
			''|*[!0-9]*) ;;
			*) kill -0 "$pid" 2>/dev/null && { printf '%s\n' "$pid"; return 0; } ;;
		esac
	fi
	pidof adviserd 2>/dev/null | cut -d ' ' -f 1
}

wait_stopped()
{
	pid=$1
	remaining=$STOP_TIMEOUT
	while kill -0 "$pid" 2>/dev/null && [ "$remaining" -gt 0 ]; do
		sleep 1
		remaining=$((remaining - 1))
	done
	! kill -0 "$pid" 2>/dev/null
}

capture_adoption()
{
	pid=$1
	umask 077
	set -C
	if ! exec 3>"$ADOPT_FILE"; then
		set +C
		printf '%s\n' "cannot create adoption file: $ADOPT_FILE" >&2
		return 1
	fi
	set +C
	adopt_file_created=1
	if ! dd if="/proc/$pid/mem" bs=1 skip=$ADVISERD_MOUSE_ADDRESS count=9 >&3 2>/dev/null ||
	   ! dd if="/proc/$pid/mem" bs=1 skip=$ADVISERD_KEYBOARD_ADDRESS count=9 >&3 2>/dev/null; then
		exec 3>&-
		return 1
	fi
	exec 3>&-
	chmod 600 "$ADOPT_FILE" || return 1
	size=$(wc -c < "$ADOPT_FILE")
	[ "$size" -eq 18 ] || return 1
}

stop_adviserd()
{
	pid=$1
	"$ADVISER_INIT" stop || true
	if ! wait_stopped "$pid"; then
		kill -TERM "$pid" 2>/dev/null || true
		wait_stopped "$pid" || {
			kill -KILL "$pid" 2>/dev/null || true
			wait_stopped "$pid" || return 1
		}
	fi
}

cleanup()
{
	status=$?
	[ "$cleanup_running" -eq 0 ] || exit "$status"
	cleanup_running=1
	trap - EXIT HUP INT TERM
	if [ -n "$server_pid" ] && kill -0 "$server_pid" 2>/dev/null; then
		kill -TERM "$server_pid" 2>/dev/null || true
		wait "$server_pid" 2>/dev/null || true
	fi
	server_pid=
	if [ "$restore_needed" -eq 1 ]; then
		if is_module_loaded; then
			rmmod "$MODULE_NAME" || status=1
		fi
		if [ -r "$STOCK_VIDEOCAP_KO" ]; then
			insmod "$STOCK_VIDEOCAP_KO" || status=1
		else
			printf '%s\n' "stock module not readable: $STOCK_VIDEOCAP_KO" >&2
			status=1
		fi
	fi
	if [ "$adopt_file_created" -eq 1 ]; then
		rm -f "$ADOPT_FILE" || status=1
		adopt_file_created=0
	fi
	if [ "$adviserd_was_running" -eq 1 ]; then
		current_pid=$(adviserd_pid || true)
		[ -n "$current_pid" ] || "$ADVISER_INIT" start || status=1
	fi
	exit "$status"
}

trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

[ "$(id -u)" -eq 0 ] || { printf '%s\n' 'must run as root' >&2; exit 1; }
[ -x "$AMI_KVM_SERVER" ] || { printf '%s\n' "server not executable: $AMI_KVM_SERVER" >&2; exit 1; }
[ -r "$CUSTOM_VIDEOCAP_KO" ] || { printf '%s\n' "custom module not readable: $CUSTOM_VIDEOCAP_KO" >&2; exit 1; }
[ -r "$STOCK_VIDEOCAP_KO" ] || { printf '%s\n' "stock module not readable: $STOCK_VIDEOCAP_KO" >&2; exit 1; }
[ -x "$ADVISER_INIT" ] || { printf '%s\n' "adviserd init script not executable: $ADVISER_INIT" >&2; exit 1; }

pid=$(adviserd_pid || true)
[ -n "$pid" ] || { printf '%s\n' 'adviserd must be running to capture iUSB records' >&2; exit 1; }
adviserd_was_running=1
capture_adoption "$pid" || { printf '%s\n' 'unable to capture adviserd iUSB records' >&2; exit 1; }
stop_adviserd "$pid" || { printf '%s\n' 'unable to stop adviserd' >&2; exit 1; }
restore_needed=1
if is_module_loaded; then
	rmmod "$MODULE_NAME" || exit 1
fi
insmod "$CUSTOM_VIDEOCAP_KO" || exit 1

"$AMI_KVM_SERVER" --adopt-file "$ADOPT_FILE" "$@" &
server_pid=$!
wait "$server_pid"
status=$?
server_pid=
exit "$status"
