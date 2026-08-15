####################################################
##########      Restore to defaults     #############
#####################################################

restore_function()
{
	echo -n "Restoring to default configuration...  "
	rm -rf /conf/*
	cp -Rp /etc/defconfig/* /conf
	if [ $? != 0 ]
	then
		echo "Failed."
		exit 1
	else
		echo "Done."
	fi
}

case "$1" in
        restore)
        if [ -x /usr/local/bin/flasher ];	then
        	if [ -f /var/flasher.initcomplete ]
        	then
          			restore_function     
        	fi
        else
        	restore_function
        fi
        ;;
        *)
        echo "Usage: $0 start"
        ;;
esac

