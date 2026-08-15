#!/bin/sh
 
#
# This script will use sum and diff to compare files in two different directories
# 

EXCLUDE_FILE="cim.db"

TEMP_FILE1="/tmp/conf.sumlist"
TEMP_FILE2="/tmp/bkupconf.sumlist"
# TEMP_TESTFILE="/conf/junkdata"

if [ -f "$TEMP_FILE1" ] || [ -f "$TEMP_FILE2" ]; then
    echo "temp files name $TEMP_FILE1 or $TEMP_FILE2 conflict, quit!"
    exit 1
fi   

delete_tmpfile() {

    # clear temp files
    if [ -f "$TEMP_FILE1" ] || [ -f "$TEMP_FILE2" ]; then
        # echo "remove temp files"
        rm $TEMP_FILE1
        rm $TEMP_FILE2
    fi

#   if [ -f "$TEMP_TESTFILE" ]; then
#        rm $TEMP_FILE
#   fi

}

check_sync() {

    for x in `find /conf -type f | sort`; do
            
            sum_v=`sum $x`;
            EXCLUDE=`echo $x | grep -n $EXCLUDE_FILE`
            if [ "$EXCLUDE" == "" ]; then
                y=`echo $x | sed 's/\/conf\///g'`;
                echo "$sum_v$y" >> $TEMP_FILE1
            else
                echo "exclude file: $EXCLUDE"    
            fi
    done
    
    for x in `find /bkupconf -type f | sort`; do
            
            sum_v=`sum $x`;
            EXCLUDE=`echo $x | grep -n $EXCLUDE_FILE`
            if [ "$EXCLUDE" == "" ]; then
                y=`echo $x | sed 's/\/bkupconf\///g'`;
                echo "$sum_v$y" >> $TEMP_FILE2
            else
                echo "exclude file: $EXCLUDE"                   
            fi    
    done
    
    diff $TEMP_FILE1 $TEMP_FILE2
    
    if [ $? != 0 ]; then
        echo "/conf and /bkupconf are not synchronized"
    else
        echo "/conf and /bkupconf are synchronized"      
    fi
           
}

echo "This script will check if directories are always synchronized"
echo "start to test..."

# Create a temporary juck data in /conf for testing
# touch $TEMP_TESTFILE 
# echo "junk" > $TEMP_TESTFILE
# sleep 1

check_sync

delete_tmpfile
