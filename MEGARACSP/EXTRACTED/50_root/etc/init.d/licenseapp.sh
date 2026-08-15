#!/bin/sh

# chkconfig: 2345 10 90
#Runlevel : S = S35
# Restart the service on warm reboot
#Runlevel : 9 = K35
#Runlevel : 9 = S32

PATHFULL_LICENSEAPP=/usr/local/bin/licenseapp
test -f $PATHFULL_LICENSEAPP || exit 0

#Create "licstat" directory to create no-license files and license app config file 
test -d /var/tmp/licstat || mkdir /var/tmp/licstat

# initiating the app
[ 0 -eq `ps -ef | grep licenseapp | grep -v "licenseapp.sh" | grep -vc "grep"` ] || exit 0
$PATHFULL_LICENSEAPP
#Checking exit status
if [ $? != 0 ]
then
        echo "Error in licenseapp!!!"
        exit 0
else
	echo -n "License App started"
fi

FILE_PATH_LICAPP_CFG=/etc/license/license.conf
FILE_PATH_LICENSE_STATUS=/var/tmp/licstat/status
FILE_PATH_NOLICENSE=/var/tmp/licstat
FILE_PATH_INITSCRIPT=/etc/init.d
FILE_COUNT_DAYS=/conf/license/count_days
app_cnt=0
service_id="0"


cat $FILE_PATH_LICAPP_CFG | while read LINE
do
        let app_cnt++
done

#As of now we are supporting only 32 App 
if [ $app_cnt -ge 32 ]
then 
	echo "LicenseApp : App limit exceeded"
	exit 0
fi

read lic_status <$FILE_PATH_LICENSE_STATUS
bit_pos=$lic_status

app_with_validlicense()
{
   if [ -f $FILE_PATH_INITSCRIPT/$2 ]
   then 
	service_id=`ps axc | grep $1`
	if  [ -z "$service_id" ];
	then
		echo "starting $1 daemon from license app"
		test -f $FILE_PATH_NOLICENSE/$1_nolicense &&  rm $FILE_PATH_NOLICENSE/$1_nolicense
		$FILE_PATH_INITSCRIPT/$2 start
	fi
   fi
}

app_without_validlicense()
{
   if [ -f $FILE_PATH_INITSCRIPT/$2 ]
   then
	touch $FILE_PATH_NOLICENSE/$1_nolicense
	echo "$1 doesn't have the valid license. So stopping the $1 service"
   	service_id=`ps axc | grep $1`
   	if ! [ -z "$service_id" ];
   	then
		echo "Stopping the $1 from license app"
		$FILE_PATH_INITSCRIPT/$2 stop
	fi
   fi

}

#Checking the valid License
case "$1" in
start)
   cat $FILE_PATH_LICAPP_CFG | while read LINE
    do
   	 bit_val=$((bit_pos & 1))
   	 bit_pos=$((bit_pos >> 1))

	 type=$(echo $LINE | cut -d':' -f4)
	 if [ "$type" == "v" ]
	 then
	 	INIT_SCRIPT=$(echo $LINE | cut -d':' -f2)
		DAEMON=$(echo $LINE | cut -d':' -f3)
		if ! [ $bit_val == 1 ]
		then
			app_without_validlicense "$DAEMON" "$INIT_SCRIPT"
		fi
	fi
     done
;;

manual)
  cat $FILE_PATH_LICAPP_CFG | while read LINE
  do
	 bit_val=$((bit_pos & 1))
	 bit_pos=$((bit_pos >> 1))
	 
	 type=$(echo $LINE | cut -d':' -f4)
	 if [ "$type" == "v" ]
	 then
	 	INIT_SCRIPT=$(echo $LINE | cut -d':' -f2)
		DAEMON=$(echo $LINE | cut -d':' -f3)  
		if [ $bit_val == 1 ]
		then
			app_with_validlicense "$DAEMON" "$INIT_SCRIPT"
 		else
			app_without_validlicense "$DAEMON" "$INIT_SCRIPT"
		fi
	fi
  done	
  ;;
*)
   echo "LicenseApp : In-valid option."
;;
esac
exit 0

