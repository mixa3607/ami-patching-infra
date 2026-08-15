#!/bin/sh -f


usage ()
{

   echo "Usage:"
   echo "    set_sdpart <SlotId PartitionID StartAddr PartitionSize FileSystemType>"
   echo "    set_sdpart <0/1 1 0 32768 3 (1=vfat,2=ext2,3=ext3,4=ext4)>"
   exit 0

}

s=$1
n=$2
o=$3
z=$4
f=$5
p=$2

if [ "$s" -ne "0" ] && [ "$s" -ne "1" ] ; then
    echo "   Invalid SlotID, valid range <0,1>"
    usage
fi

PC="0"
PS="0"
PE="0"
PC=$(fdisk -l | egrep -c "mmcblk$1*") >/dev/null 2>/dev/null
PC=$(( $PC - 1 ))

pe=$(fdisk -l | egrep -c "mmcblk$1p$2") >/dev/null 2>/dev/null


SDSZ=$(fdisk -l /dev/mmcblk$s  |  grep mmcblk$s: | awk '{print $5}') >/dev/null 2>/dev/null
SDSZE=$(( $SDSZ / (64*512) ))
#echo $SDSZ

# Format SD Card 
if [ "$n" == "0" ] && [ "$o" == "0" ] && [ "$z" == "0" ] ; then

	echo "Formatting SD card on slot $1..."

	i="1"
	while [ $i -le $PC ]
	do
   		umount /dev/mmcblk$1p$i >/dev/null 2>/dev/null
   		i=$(( $i + 1 ))
	done
	mkdosfs  -I -F32 /dev/mmcblk$s >/dev/null 2>/dev/null &
	exit 0
fi

# Delete Partition 
if [ "$o" == "-1" ] && [ "$z" == "-1" ] ; then
	if [ "$p" != "$PC" ] ; then
    	echo "   Invalid Partition Number...$p"
		exit 0
	fi
echo "Deleting SD Card partition $p..."
umount /dev/mmcblk$1p$p >/dev/null 2>/dev/null 
fdisk  /dev/mmcblk$s <<EOF >/dev/null 2>/dev/null
d
$p
w
EOF
exit 0
fi

if [ "$p" -gt "$(($PC + 1))" ] ; then
    echo "   Invalid Partition Number...$p"
    exit 0
fi


# Format Partitions 
if [ "$o" == "0" ] && [ "$z" == "0" ] ; then

	umount /dev/mmcblk$1p$p >/dev/null 2>/dev/null 
	if   [ "$f" == "1" ] ; then
    	mkdosfs     /dev/mmcblk$1p$p >/dev/null 2>/dev/null
	elif [ "$f" == "2" ] ; then
    	mkfs.ext2   /dev/mmcblk$1p$p >/dev/null 2>/dev/null
	elif [ "$f" == "3" ] ; then
    	mkfs.ext3   /dev/mmcblk$1p$p >/dev/null 2>/dev/null
	elif [ "$f" == "4" ] ; then
    	mkfs.ext4   /dev/mmcblk$1p$p >/dev/null 2>/dev/null
	fi

	mount /dev/mmcblk$1p$p /mnt/sdmmc$1p$p
	exit 0
fi

if [ "$pe" == "1" ] ; then
    echo "   Invalid Partition Number...$p"
    exit 0
fi

if [ "$p" -le "$PC" ] ; then
    echo "   Invalid Partition Number...$p"
    exit 0
fi

if [ "$PC" -ge "1" ] ; then
    PS=$(fdisk -l /dev/mmcblk$1 | grep "mmcblk$1p$PC" | awk '{print $2}') >/dev/null 2>/dev/null
    PE=$(fdisk -l /dev/mmcblk$1 | grep "mmcblk$1p$PC" | awk '{print $3}') >/dev/null 2>/dev/null
fi

# validate the offset and size 
u=$(fdisk -l /dev/mmcblk$s  |  grep Units | awk '{print $9}') >/dev/null 2>/dev/null

o=$(( $o * 1024 ))
z=$(( $z * 1024 ))

if [ "$o" -le "$u" ] ; then
	o=$(( $u ))
fi
o=$(( $o / $u ))

if [ "$z" -le "$u" ] ; then
	z=$(( $u ))
fi
z=$(( $z / $u )) 

if [ "$o" -le "$PE" ] ; then
	o=$(( $PE + 1 ))
fi

# unmount partition
i="1"
while [ $i -le $n ]
do
umount /dev/mmcblk$1p$i >/dev/null 2>/dev/null 
i=$(( $i + 1 ))
done

# create partition
echo "Creating partition on  mmblk$s..."

if [ "$p" -le "3" ] ; then		# Create Primary Partitions
DSZ=$(( $SDSZ - $z ))
fdisk  /dev/mmcblk$s <<EOF >/dev/null 2>/dev/null
n
p
$p
$o
$z
w
EOF
elif [ "$p" == "4" ] ; then		#Create Extended Partition
fdisk  /dev/mmcblk$s <<EOF >/dev/null 2>/dev/null
n
e
$o

$z
w
EOF
else
fdisk  /dev/mmcblk$s <<EOF >/dev/null 2>/dev/null
n
$p
$o
$z
w
EOF
fi

if   [ "$f" == "1" ] ; then
	mkdosfs   	/dev/mmcblk$1p$p >/dev/null 2>/dev/null
elif [ "$f" == "2" ] ; then 
	mkfs.ext2  	/dev/mmcblk$1p$p >/dev/null 2>/dev/null
elif [ "$f" == "3" ] ; then
	mkfs.ext3  	/dev/mmcblk$1p$p >/dev/null 2>/dev/null
elif [ "$f" == "4" ] ; then 
	mkfs.ext4  	/dev/mmcblk$1p$p >/dev/null 2>/dev/null
fi

i="1"
while [ $i -le $p ]
do
if [ "$i" -ne "4" ] ; then
	if [ ! -d "/mnt/sdmmc$1p$i" ] ; then
		echo "directory do not exits"
		mkdir /mnt/sdmmc$1p$i
	fi
	mount /dev/mmcblk$1p$i /mnt/sdmmc$1p$i
fi
i=$(( $i + 1 ))
done
