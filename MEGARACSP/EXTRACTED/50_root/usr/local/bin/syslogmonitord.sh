#!/bin/sh
# /etc/init.d/syslogmonitor.sh: start syslogmonitor daemon
#
# chkconfig: 2345 10 90
#Runlevel : S = S56
PATH=/bin:/usr/bin:/sbin:/usr/sbin

PATHFUL_SYSLOGMONITORDINIT="/usr/local/bin/syslogmonitord"



test -f /usr/local/bin/syslogmonitord || exit 0


# Options for start/restart the daemons
#

case "$1" in
  start)
    echo -n "Starting Syslog Monitor Daemon: SyslogMonitorD"
    /usr/local/bin/syslogmonitord &
#    start-stop-daemon --start --quiet --exec $PATHFUL_SYSLOGMONITORDINIT
    echo "."
    ;;
  stop)
    echo -n "Stopping Syslog Monitor Daemon: SyslogMonitorD "
    killall syslogmonitord
#    start-stop-daemon --stop --quiet --exec $PATHFUL_SYSLOGMONITORDINIT
    echo "."
    ;;
  restart)
    echo -n "Restarting Syslog Monitor Daemon: SyslogMonitorD "
    killall syslogmonitord
    /usr/local/bin/syslogmonitord &
#	start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_SYSLOGMONITORDINIT
#	start-stop-daemon --start --quiet --exec $PATHFUL_SYSLOGMONITORDINIT
    echo "."
    ;;
   *)
    echo "Usage: /etc/init.d/pamhelperd {start|stop|restart}"
    exit 1
esac

exit 0
