#!/bin/sh
#
# USAGE: automount.sh DEVICE 
#   DEVICE   is the actual device node at /dev/DEVICE
/etc/udev/mount.sh ${1} &
