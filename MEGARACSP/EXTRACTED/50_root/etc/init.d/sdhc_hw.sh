#!/bin/sh
# /etc/init.d/sdhc_hw.sh: automatically mount SD partitions.
#
#Runlevel : S = S38


mount  /dev/mmcblk0p1  /mnt/sdmmc0p1
mount  /dev/mmcblk0p2  /mnt/sdmmc0p2
mount  /dev/mmcblk0p3  /mnt/sdmmc0p3
mount  /dev/mmcblk0p4  /mnt/sdmmc0p4
mount  /dev/mmcblk0p5  /mnt/sdmmc0p5
mount  /dev/mmcblk0p6  /mnt/sdmmc0p6
mount  /dev/mmcblk0p7  /mnt/sdmmc0p7

#commenting the mounting of 2nd SD card block as no one is using both the SD controller.
#this is done to reduce the time taken for mouting the below paritions and thereby getting an error.
#mount  /dev/mmcblk1p1  /mnt/sdmmc1p1
#mount  /dev/mmcblk1p2  /mnt/sdmmc1p2
#mount  /dev/mmcblk1p3  /mnt/sdmmc1p3
#mount  /dev/mmcblk1p4  /mnt/sdmmc1p4
#mount  /dev/mmcblk1p5  /mnt/sdmmc1p5
#mount  /dev/mmcblk1p6  /mnt/sdmmc1p6
#mount  /dev/mmcblk1p7  /mnt/sdmmc1p7
