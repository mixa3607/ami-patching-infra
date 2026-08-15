#!/bin/sh
# /etc/init.d/sdremount.sh: remount sd partitions 

ShouldBeSkipped()
        {
                echo $1 | grep "^#" > /dev/null
                if [ $? == 0 ]
                then
                        return 1
                fi
                if [ "`echo $1`" == "" ]
                then
                        return 1
                fi

                return 0
        }

isfeatureenabled()
        {
                feature="$1"

                if [ -f $CORE_FEATURES ]
                then
                        line=`cat $CORE_FEATURES | grep -w $feature`
                        if [ "$line" == "" ]; then
                                return 0
                        fi

                        ShouldBeSkipped $line
                        if [ $? == 1 ]; then
                                return 0
                        fi

                        return 1
                fi

                return 0
        }
mount_all()
{
        isfeatureenabled CONFIG_SPX_FEATURE_EXTENDEDLOG_MEDIUM_TYPE_SD
        ismedium_sd=$?
        if [ "$ismedium_sd" -eq "1" ]; then
    		/etc/init.d/mountextendedlog.sh start
    		/etc/init.d/rsyncconfd start
    		/etc/init.d/uartmirrorlog.sh start
    		/etc/init.d/extlogrotate.sh start &
        fi
	mount  /dev/mmcblk0p1  /mnt/sdmmc0p1
	mount  /dev/mmcblk0p2  /mnt/sdmmc0p2
	mount  /dev/mmcblk0p3  /mnt/sdmmc0p3
	mount  /dev/mmcblk0p4  /mnt/sdmmc0p4
	mount  /dev/mmcblk0p5  /mnt/sdmmc0p5
	mount  /dev/mmcblk0p6  /mnt/sdmmc0p6
	mount  /dev/mmcblk0p7  /mnt/sdmmc0p7
}
unmount_all()
{
  isfeatureenabled CONFIG_SPX_FEATURE_EXTENDEDLOG_MEDIUM_TYPE_SD
        ismedium_sd=$?
        if [ "$ismedium_sd" -eq "1" ]; then
		line1=`ps ax |grep -w  extlog |awk -F " " '{print $1}'`
		if [ "$line1" != "0" ]; then
		kill -9 $line1 
		fi
		/etc/init.d/uartmirrorlog.sh stop
		umount /extlog
		umount /bkupextlog
        fi

	umount  /mnt/sdmmc0p1
	umount  /mnt/sdmmc0p2
	umount  /mnt/sdmmc0p3
	umount  /mnt/sdmmc0p4
	umount  /mnt/sdmmc0p5
	umount  /mnt/sdmmc0p6
	umount  /mnt/sdmmc0p7
}
PATH=/bin:/usr/bin:/sbin:/usr/sbin

ACTION=$1
CTRL_DIR="/etc/init.d"
LMEDIA_CTRL="${CTRL_DIR}/lmedia.sh"
SDSERVER_CTRL="${CTRL_DIR}/sdserver"
CORE_FEATURES="/etc/core_features"
line1=0

# Options for start/restart the daemons

case "$ACTION" in
    sd-probe)
	sd_status=`cat /proc/SD_STATUS/sdInfo`
	grep -q "CONFIG_SPX_FEATURE_LMEDIA_MEDIUM_TYPE_SD" /etc/core_features
	lmedia_use_sd=$?
	if [ "$sd_status" = 0 ]; then
		
		mount_all
		$SDSERVER_CTRL start
		[ "$lmedia_use_sd" = 0 ] && $LMEDIA_CTRL start
        else
		unmount_all
		$SDSERVER_CTRL stop
		[ "$lmedia_use_sd" = 0 ] && $LMEDIA_CTRL stop
	fi
	;;
   *)
    echo "Usage: /etc/init.d/sdremount {sd-probe}"
    exit 1
esac

exit 0