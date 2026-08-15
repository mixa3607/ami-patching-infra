#!/bin/sh
#
# USAGE: udev-auto-mount.sh DEVICE
#   DEVICE   is the actual device node at /dev/DEVICE
# 
# This script takes a device name, looks up the partition label and
# type, creates /media/ID_FS_LABEL and mounts the partition.  Mount options
# are hard-coded below.

export PATH=/sbin:/usr/sbin:/bin:/usr/bin

DEVICE=$1

# check input
if [ -z "$DEVICE" ]; then
   exit 1
fi

# test that this device isn't already mounted
device_is_mounted=`grep ${DEVICE} /etc/mtab`
if [ -n "$device_is_mounted" ]; then
   echo "error: seems /dev/${DEVICE} is already mounted"
   exit 1
fi

# If there's a problem at boot-time, this is where we'd put
# some test to check that we're booting, and then run
#     sleep 60
# so the system is ready for the mount below.
#
# An example to experiment with:
# Assume the system is "booted enough" if the HTTPD server is running.
# If it isn't, sleep for half a minute before checking again.
#
# The risk: if the server fails for some reason, this mount script
# will just keep waiting for it to show up.  A better solution would
# be to check for some file that exists after the boot process is complete.
#
# HTTPD_UP=`ps -ax | grep httpd | grep -v grep`
# while [ -z "$HTTPD_UP" ]; do
#    sleep 30
#    HTTPD_UP=`ps -ax | grep httpd | grep -v grep`
# done


# pull in useful variables from blkid, quote everything Just In Case
eval `/sbin/blkid -o udev -p /dev/${DEVICE} | sed 's/^/export /; s/=/="/; s/$/"/'`

if [ -z "$ID_FS_UUID" ] && [ -z "$ID_FS_TYPE" ]; then
   echo "error: ID_FS_UUID and ID_FS_TYPE is empty! did blkid break? tried /dev/${DEVICE}"
   exit 1
fi

if [ ! -e "/var/local/devices" ]; then 
   mkdir "/var/local/devices"
fi

if [ -z "$ID_FS_LABEL" ]; then
   MOUNTPOINT="/var/local/devices/${ID_FS_UUID}"
else
   MOUNTPOINT="/var/local/devices/${ID_FS_LABEL}"
fi

# test mountpoint - it shouldn't exist
if [ -e ${MOUNTPOINT} ]; then
   COUNT=0
   while : ; do
       COUNT=$((COUNT+1))
       TESTMOUNTPOINT="${MOUNTPOINT}_${COUNT}"
       if [ ! -e ${TESTMOUNTPOINT} ]; then
          break
       fi
   done
   MOUNTPOINT="${TESTMOUNTPOINT}"
fi

   # make the mountpoint
   mkdir ${MOUNTPOINT}

   # mount the device
   # 
   # If expecting thumbdrives, you probably want 
   #      mount -t auto -o sync,noatime [...]
   # 
   # If drive is VFAT/NFTS, this mounts the filesystem such that all files
   # are owned by a std user instead of by root.  Change to your user's UID
   # (listed in /etc/passwd).  You may also want "gid=1000" and/or "umask=022", eg:
   #      mount -t auto -o uid=1000,gid=1000 [...]
   # 
   # 
   case "$ID_FS_TYPE" in

       vfat)  mount -t vfat -o sync,noatime,uid=1000 /dev/${DEVICE} ${MOUNTPOINT}
              ;;

              # Enabling NTFS filesystem support
       ntfs)  mount -t ntfs-3g -o sync,noatime,uid=1000 /dev/${DEVICE} ${MOUNTPOINT}
              ;;

              # ext2/3/4 don't like uid option
       ext*)  mount -t auto -o sync,noatime /dev/${DEVICE} ${MOUNTPOINT}
              ;;

              # Enabling exfat file system support
       exfat) mount -t exfat -o sync,noatime /dev/${DEVICE} ${MOUNTPOINT}
              ;;
   esac

   # all done here, return successful
   exit 0

exit 1
