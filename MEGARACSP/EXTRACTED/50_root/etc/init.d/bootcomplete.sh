#!/bin/sh
# /etc/init.d/bootcomplete.sh: 
#
# chkconfig: 2345 10 90
#
#Runlevel : 3 = S98
#

PATH=/bin:/usr/bin:/sbin:/usr/sbin
BOOT_COMPLETE="/usr/local/bin/bootcomplete"
#BMCINIT_STOP_CMDOPTS="INT"
#BMCINIT_STOP_CMDOPTS_CONF="USR1"
#BMCINIT_NAME="bootcomplete"

WATCHDOG_DRIVERNAME=watchdog
WATCHDOG_HW_DRIVERNAME=watchdog_hw

#check if video driver is loaded
check_driver_loaded()
{
	lsmod | grep $WATCHDOG_DRIVERNAME >/dev/null
	if [ $? == 1 ]
        then
  		echo -n "Loading watchdog driver ... "
	        insmod $WATCHDOG_DRIVERNAME
	       	echo "Done"
	fi

	lsmod | grep $WATCHDOG_HW_DRIVERNAME >/dev/null
	if [ $? == 1 ]
        then
  		echo -n "Loading watchdog_hw driver ... "
	        insmod $WATCHDOG_HW_DRIVERNAME
	       	echo "Done"
	fi

}

# Options for start/stop the daemons

case "$1" in
  start)
    check_driver_loaded	   
    echo -n "Starting Boot Complete"
    start-stop-daemon --start --quiet --exec  $BOOT_COMPLETE --background
    echo "."
    echo -n
    ;;
  stop)
    echo -n "Stopping Boot Complete"
    start-stop-daemon --stop --quiet --exec $BOOT_COMPLETE
    echo "."
    echo -n
    ;;
  restart)
    echo -n "Restarting Boot Complete "
    start-stop-daemon --stop --quiet --exec $BOOT_COMPLETE
    sleep 1
    check_driver_loaded	   
    start-stop-daemon --start --quiet --exec   $BOOT_COMPLETE --background
    echo "."
    echo -n
    ;;
  *)
    echo "Usage: /etc/init.d/bootcomplete {start|stop}"
    echo "."
    echo -n
    exit 1
esac
  
exit 0
