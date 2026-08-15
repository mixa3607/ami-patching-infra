#!/bin/sh
# /etc/init.d/upnp: start UPnP discovery
#
#Starting at rc3.d and stopping at rc6.d
#Runlevel : 3 = S50
#Runlevel : 6 = K50
#Runlevel : 7 = K50
#Runlevel : 8 = K50

. /lib/lsb/init-functions
PATH=/bin:/usr/bin:/sbin:/usr/sbin
PATHFUL_UPNPDISCOVERY=/usr/local/bin/upnp
test -f /usr/local/bin/upnp || exit 0


# Options for start/restart the daemons

case "$1" in
    start)
    	log_daemon_msg "Starting upnp discovery" "upnp"
    	start-stop-daemon --start --quiet --exec $PATHFUL_UPNPDISCOVERY 
    	log_end_msg $?
    	;;
    stop)
    	log_daemon_msg "Stopping upnp discovery" "upnp"
   	start-stop-daemon --stop --quiet --exec $PATHFUL_UPNPDISCOVERY --signal INT
   	log_end_msg $?
    	;;
    reload)
    	log_daemon_msg "Reloading upnp discovery" "upnp"
	start-stop-daemon --stop --quiet --exec $PATHFUL_UPNPDISCOVERY --signal 1
    	log_end_msg $?
	;;
    force-reload)
	$0 reload
	;;
    restart)
    	log_daemon_msg "Restarting upnp discovery" "upnp"
	start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_UPNPDISCOVERY
	start-stop-daemon --start --quiet --exec $PATHFUL_UPNPDISCOVERY 
    	log_end_msg $?
	;;
     *)
    	echo "Usage: /etc/init.d/upnp {start|stop|reload|restart|force-reload}"
    	exit 1
esac

exit 0
