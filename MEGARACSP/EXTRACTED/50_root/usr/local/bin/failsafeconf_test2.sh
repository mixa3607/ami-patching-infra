#!/bin/sh

#
# This script will use mtd_debug to wirte junk data into mtd
# and reboot BMC.
# 
# mtd_debug format:
# mtd_debug write <device> <offset> <len> <source-filename>
#
 
TEMP_FILE="/tmp/junkdata"

if [ -f "$TEMP_FILE" ]; then
    echo "temp file $TEMP_FILE name conflict, quit!"
    exit 1
fi   

OFFSET=1
LEN=1
touch $TEMP_FILE
echo "junk" > $TEMP_FILE

conf_name="conf"
Foundconf=0
while read dev size erasesize name
do
        dev_name=`echo $name | sed 's/"//g'`
        if [ $Foundconf != 1 ] ; then
        	if [ $dev_name == $conf_name ] ; then                
			CONF_MTD="/dev/mtd`echo $dev | awk -F: '{ print $1 }' | sed 's/mtd//g'`"
                        Foundconf=$((Foundconf+1))
                        continue
                fi
        fi
        if [ $Foundconf == 1 ] ; then
                if [[ "$dev_name" == *"$conf_name"* ]] ;then
                        BKUPCONF_MTD="/dev/mtd`echo $dev | awk -F: '{ print $1 }' | sed 's/mtd//g'`"
                        break
                fi
        fi
done < /proc/mtd

delete_tmpfile() {
    
    # clear temp files
    if [ -f "$TEMP_FILE" ]; then
        # echo "remove temp files"
        rm $TEMP_FILE
    fi

}

case "$1" in
  conf)
	mtd_debug write $CONF_MTD $OFFSET $LEN $TEMP_FILE
        delete_tmpfile
        echo "reboot BMC..."
        reboot 
    ;;
  bkupconf)    	
        mtd_debug write $BKUPCONF_MTD $OFFSET $LEN $TEMP_FILE
        delete_tmpfile
    	echo "reboot BMC..."
    	reboot
    ;;
   *)
    echo "This test script will wirte junk data into mtd and reboot BMC"
    echo "Usage: failsafeconf_test2 { conf | bkupconf }"
    delete_tmpfile
    exit 1
esac

exit 0

