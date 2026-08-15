#! /bin/sh
#
# We run as soon as networking is live, and before we use NFS!
# chkconfig: S 43 0
#
#Runlevel : S = S43

IPTABLES="/sbin/iptables"
IPTABLES_RESTORE="/sbin/iptables-restore"

IPTABLES_CONF="/conf/iptables.conf"
IPTABLES_TIMEOUT_CONF="/conf/iptables_timeout.conf"


IP6TABLES="/sbin/ip6tables"
IP6TABLES_RESTORE="/sbin/ip6tables-restore"
IP6TABLES_CONF="/conf/ip6tables.conf"

CORE_FEATURES="/etc/core_features"

echo "starting iptables... "
if [ -f $IPTABLES ]; then
	#check for the timeout feature is enabled or not if enabled then only call the timeout conf file to restore
	grep -q 'CONFIG_SPX_FEATURE_SYSTEM_FIREWALL_TIMEOUT_SUPPORT=SYSTEM_FIREWALL_TIMEOUT' $CORE_FEATURES
	retVal=$?
	if [ $retVal -eq 0 -a -f $IPTABLES_TIMEOUT_CONF ]; then
		echo "Restoring timeout configuration..."			
	   	$IPTABLES_RESTORE -c $IPTABLES_TIMEOUT_CONF >/dev/null 2>&1
	   	if [ $? = 0 ] 
			then
			    echo $IPTABLES_TIMEOUT_CONF "Success"
		    else
			    echo $IPTABLES_TIMEOUT_CONF "Failed" 
		 fi
	   	 mv $IPTABLES_TIMEOUT_CONF $IPTABLES_CONF
	else
		
		echo "Restoring normal configuration.."
		if [ -f $IPTABLES_CONF ]; then
			
		 	$IPTABLES_RESTORE -c $IPTABLES_CONF >/dev/null 2>&1
		    if [ $? = 0 ] 
			    then
				    echo $IPTABLES_CONF "Success"
		    	else
				    echo $IPTABLES_CONF "Failed" 
			fi
		fi
		 
		if [ -f $IPTABLES_TIMEOUT_CONF ]; then
			echo "Deleting the iptables timeout files..."
			rm $IPTABLES_TIMEOUT_CONF -f
		fi
	fi
else
	echo $IPTABLES "failed"
fi



echo "starting ip6tables... "
if [ -f $IP6TABLES ]; then
    if [ -f $IP6TABLES_CONF ]; then
        $IP6TABLES_RESTORE -c $IP6TABLES_CONF >/dev/null 2>&1
        if [ $? == 0 ]
        then
            echo "Success."
        else
            echo "Failed."
        fi
    fi
else
    echo "failed."
fi

exit 0
