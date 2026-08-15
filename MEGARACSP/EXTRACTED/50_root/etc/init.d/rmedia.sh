#!/bin/sh
# /etc/init.d/rmedia: Start rmedia server 
#
#Starting at rc3.d and stopping at rc6.d
#Runlevel : 3 = S50
# Restart the service on warm reboot
#Runlevel : 9 = K50
#Runlevel : 9 = S50

PATH=/bin:/usr/bin:/sbin:/usr/sbin
PATHFUL_RMEDIA=/usr/local/bin/rmedia
PIDFILE="/var/run/rmedia.pid"
test -f /usr/local/bin/rmedia || exit 0
ACTION=$1

#check if process is stopped
check_process_status()
{
	if [ -e "$PIDFILE" ]
        then
		retry=0
	    	PID=`cat $PIDFILE`
		if [ $? == 0 ]
		then
			while [ -d /proc/$PID ]
			do
				sleep 1
				retry=`expr $retry + 1`
				if [ `expr $retry % 6` == 0 ]
				then
					kill -SIGKILL $PID
				elif [ `expr $retry % 3` == 0 ]
				then
					start-stop-daemon --stop --quiet --exec $PATHFUL_RMEDIA --signal INT
				fi
			done
		fi
	fi
}

# Options for start/restart the daemons

if [ -f "/etc/core_features" ]
then
	feature=`cat /etc/core_features | grep -v "^#" | grep " *CONFIG_SPX_FEATURE_RMEDIA_LICENSE_ENABLED *$"`
	if [ -z $feature ]
	then
		test -f /var/tmp/licstat/vmapp_nolicense && ACTION=stop
	else
		test -f /var/tmp/licstat/rmedia_nolicense && ACTION=stop
	fi
fi

case "$ACTION" in
	start)
		echo -n "Starting Remote Media Server"
	    	start-stop-daemon --start --quiet --exec $PATHFUL_RMEDIA
	    	echo "."
	    	;;
	stop)
		echo -n "Stopping Remote Media Server"
		umount /usr/local/rmedia/cd/ 2&>/dev/null
		umount /usr/local/rmedia/fd/ 2&>/dev/null
		umount /usr/local/rmedia/hd/ 2&>/dev/null
	    	start-stop-daemon --stop --quiet --exec $PATHFUL_RMEDIA --signal INT
	    	echo "."
		check_process_status
	   	 ;;
	reload)
		echo -n "Reloading Remote Media Server"
		start-stop-daemon --stop --quiet --exec $PATHFUL_RMEDIA --signal 1
		echo "."
		;;
	force-reload)
		$0 reload
		;;
	restart)
		echo -n "Restarting Remote Media Server"
		start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_RMEDIA --signal INT
		check_process_status
		start-stop-daemon --start --quiet --exec $PATHFUL_RMEDIA
		echo "."
		;;
	*)
		echo "Usage: /etc/init.d/rmedia {start|stop|reload|restart|force-reload}"
	 	exit 1
esac

exit 0
