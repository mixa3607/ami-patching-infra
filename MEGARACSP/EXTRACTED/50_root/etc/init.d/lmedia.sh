#!/bin/sh
# /etc/init.d/lmedia: Start lmedia server 
#
#Starting at rc3.d and stopping at rc6.d
#Runlevel : 3 = S50
# Restart the service on warm reboot
#Runlevel : 9 = K50
#Runlevel : 9 = S50

PATH=/bin:/usr/bin:/sbin:/usr/sbin
PATHFUL_LMEDIA=/usr/local/bin/lmedia
PIDFILE="/var/run/lmedia.pid"
test -f /usr/local/bin/lmedia || exit 0
ACTION=$1

#check if process is stopped
check_process_status()
{
	if [ -e "$PIDFILE" ]
	then 
		PID=`cat $PIDFILE`
		if [ $? == 0 ]
		then	
			while [ -d /proc/$PID ]
			do
				sleep 1
			done
		fi
	fi
}

# Options for start/restart the daemons

if [ -f "/etc/core_features" ]
then
	feature=`cat /etc/core_features | grep -v "^#" | grep " *CONFIG_SPX_FEATURE_LMEDIA_LICENSE_ENABLED *$"`
	if [ -z $feature ]
	then
		test -f /var/tmp/licstat/vmapp_nolicense && ACTION=stop
	else
		test -f /var/tmp/licstat/lmedia_nolicense && ACTION=stop
	fi
fi

case "$ACTION" in
	start)
		echo -n "Starting Local Media Server"
		#mount -t tmpfs /dev/shm /usr/local/tmplmedia
	    	start-stop-daemon --start --quiet --exec $PATHFUL_LMEDIA
	    	echo "."
	    	;;
	stop)
		echo -n "Stopping Local Media Server"
		#umount /usr/local/tmplmedia
	    	start-stop-daemon --stop --quiet --exec $PATHFUL_LMEDIA --signal HUP
	    	echo "."
		check_process_status
	   	 ;;
	reload)
		echo -n "Reloading Local Media Server"
		start-stop-daemon --stop --quiet --exec $PATHFUL_LMEDIA --signal HUP
		echo "."
		;;
	force-reload)
		$0 reload
		;;
	restart)
		echo -n "Restarting Local Media Server"
		start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_LMEDIA --signal HUP
		check_process_status
		start-stop-daemon --start --quiet --exec $PATHFUL_LMEDIA
		echo "."
		;;
	*)
		echo "Usage: /etc/init.d/lmedia {start|stop|reload|restart|force-reload}"
	 	exit 1
esac

exit 0
