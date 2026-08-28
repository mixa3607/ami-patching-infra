#!/bin/sh
# DIO control from the BMC - PCA9554 @0x22 on the shared PCH SMBus (i2c-0).
# GPIO3:0 = outputs (header pins 1,3,5,7, 5V logic), GPIO7:4 = inputs.
set -u

SELF_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
DIO="$SELF_DIR/dio"
BUS=/dev/i2c-0
ADDR=0x22

case "$1" in
	status)
		echo "out=$($DIO r $BUS $ADDR 1) in=$($DIO r $BUS $ADDR 0) cfg=$($DIO r $BUS $ADDR 3)"
		;;
	on)
		$DIO w $BUS $ADDR 3 0xf0
		$DIO w $BUS $ADDR 1 "$2"
		echo "out=$($DIO r $BUS $ADDR 1)"
		;;
	off)
		$DIO w $BUS $ADDR 3 0xf0
		$DIO w $BUS $ADDR 1 0x00
		;;
	pulse)
		$DIO w $BUS $ADDR 3 0xf0
		$DIO w $BUS $ADDR 1 "$2"
		sleep "${3:-1}"
		$DIO w $BUS $ADDR 1 0x00
		echo "pulsed $2"
		;;
	reset)
		$DIO w $BUS $ADDR 3 0xff
		$DIO w $BUS $ADDR 1 0xff
		echo "restored to defaults"
		;;
	*)
		echo "usage: $0 status|on <hexmask>|off|pulse <hexmask> [sec]|reset" >&2
		exit 1
		;;
esac
