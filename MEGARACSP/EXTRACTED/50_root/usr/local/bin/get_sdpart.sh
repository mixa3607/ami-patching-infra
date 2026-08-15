#!/bin/sh -f



usage ()
{

   echo "Usage:"
   echo "    get_sdpart  <SlotId> <PartitionId>"
   echo "    get_sdpart  <0/1> <0..n>"
   exit 0

}

FILE="/var/ptable.txt"

hex_value=""

dec2hex()
{
	HEX_DIGITS="0123456789abcdef"
	dec_value=$1
	hex_value=""
	until [ $dec_value == 0 ]; do
    	rem_value=$((dec_value % 16))
    	dec_value=$((dec_value / 16))
    	hex_digit=${HEX_DIGITS:$rem_value:1}
    	hex_value="${hex_digit}${hex_value}"
	done
	if [ "$hex_value" == "" ] ; then
		hex_value="0"
	fi
}

fwrite()
{
#	dec2hex $1
	echo -n $1 >> $FILE
	echo -n " " >> $FILE
}


PC=$(fdisk -l | egrep -c "mmcblk$1*") >/dev/null 2>/dev/null
PC=$(( $PC - 1 ))

if [ -f $FILE ]; then
#   echo "File $FILE exist."
   rm -r $FILE 
fi

if [ "$2" == "0" ] ; then
    fwrite $PC 
    exit 0
fi

if [ "$2" == "255" ] ; then
	SZ=$(fdisk -l /dev/mmcblk$1  |  grep mmcblk$1: | awk '{print $3}') >/dev/null 2>/dev/null
#	SZ=$(( $SZ / 1024 ))
	echo -n $SZ >> $FILE
#	echo -n "!" >> $FILE
#	fwrite $SZ
	exit 0
fi


fwrite $PC 

if [ "$2" -gt "$PC" ] ; then
    echo "   Invalid Partition Number...$2"
    exit 0
fi

FDISK="/var/fdisk.txt"

fdisk -l /dev/mmcblk$1 > $FDISK

# convert cylinders to KB
u=$(egrep Units $FDISK | awk '{print $9}') >/dev/null 2>/dev/null

s=$(egrep -w  mmcblk$1p$2 $FDISK | awk '{print $2}') >/dev/null 2>/dev/null
s=$(( $s - 1 ))
s=$(( $s * $u ))
s=$(( $s / 1024 ))
echo $s
fwrite $s


e=$(egrep -w  mmcblk$1p$2 $FDISK | awk '{print $3}') >/dev/null 2>/dev/null
e=$(( $e - 1 ))
e=$(( $e * $u ))
e=$(( $e / 1024 ))
fwrite $e

#b=$(egrep -w  mmcblk$1p$2 $FDISK | awk '{print $4}') >/dev/null 2>/dev/null
#b=$(( $b * $u ))
#b=$(( $b / 1024 ))
b=$(( $e - $s ))
fwrite $b

type=$(mount | egrep -w  mmcblk$1p$2 | awk '{print $5}')
if   [ "$type" == "vfat" ]; then
	fwrite 1
elif [ "$type" == "ext2" ]; then
	fwrite 2
elif [ "$type" == "ext3" ]; then
	fwrite 3
elif [ "$type" == "ext4" ]; then
	fwrite 4
else
	fwrite 3
fi

exit 0

