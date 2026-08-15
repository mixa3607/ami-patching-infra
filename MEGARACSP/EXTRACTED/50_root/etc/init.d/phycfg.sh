#!/bin/sh
# /etc/init.d/phycfg.sh: Set user specified network link mode
#
#Running at RCS.d
#Runlevel : S = S37

if [ -f /proc/sys/net/ipv6/conf/all/disable_ipv6 ]; then
        echo 1 > /proc/sys/net/ipv6/conf/all/disable_ipv6
fi
if [ -r /proc/cmdline ] && grep -q 'root=\/dev\/nfs' /proc/cmdline
    then
        echo "Booting via NFS. Network link mode can not be set."
        exit 0
fi
if [ -x /usr/local/bin/phycfg ]
then
	echo "Setting the network link mode as specified in the configuration file - /conf/phycfg.conf ..."
	/usr/local/bin/phycfg
	sleep 2
else
	echo "Application not found -/usr/local/bin/phycfg ####"
	echo -n 
fi
#Enable IPv6
if [ -f /proc/sys/net/ipv6/conf/all/disable_ipv6 ]; then
        echo 0 > /proc/sys/net/ipv6/conf/all/disable_ipv6
fi
