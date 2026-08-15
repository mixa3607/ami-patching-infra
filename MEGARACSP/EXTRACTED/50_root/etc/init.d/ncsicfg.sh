#!/bin/sh
# /etc/init.d/ncsicfg.sh: Enable user specified ncsi port
#
#Running at RCS.d
#Runlevel : S = S38

if [ -f "/etc/core_macros" ]
then
        IFACES=`cat /etc/core_macros | grep "CONFIG_SPX_FEATURE_NCSI_INTERFACE_NAMES" | awk -F'=' '{print $2}'`
	for iface in `echo $IFACES | sed 's/,/ /g' `
        do
		#Disable IPv6
		if [ -f /proc/sys/net/ipv6/conf/$iface/disable_ipv6 ]; then
			echo 1 > /proc/sys/net/ipv6/conf/$iface/disable_ipv6
		fi
        done
fi

modprobe ncsi > /dev/null 2>&1

if [ -x /usr/local/bin/ncsicfg ]
then
	echo "Enabling User Specified NCSI Port ..."
	/usr/local/bin/ncsicfg
fi

if [ -f "/etc/core_macros" ]
then
	for iface in `echo $IFACES | sed 's/,/ /g' `
        do
		#Enable IPv6
		if [ -f /proc/sys/net/ipv6/conf/$iface/disable_ipv6 ]; then
			if [ -r /proc/cmdline ] && ! grep -q 'root=\/dev\/nfs' /proc/cmdline
			then
				ifconfig $iface down
			fi
			echo 0 > /proc/sys/net/ipv6/conf/$iface/disable_ipv6
		fi
        done
fi


