#!/bin/sh

# This script will use inotifywait to mointor target directory for close write changes.
# And use rsync to synchronize target directory and backup directory.

EXCLUDE_FILE="/etc/rsync-excludes"
RSYNC_TMP="/tmp/rsync_tmp"


test -e $RSYNC_TMP && echo "folder exist" || mkdir $RSYNC_TMP
#sync first time when service is started
rsync -raq --temp-dir=$RSYNC_TMP  --delete --exclude-from $EXCLUDE_FILE $1/ $2/
inotifywait -mr -e close_write -e modify $1/ | while read date time dir file; do

       rsync -raq --temp-dir=$RSYNC_TMP  --delete --exclude-from $EXCLUDE_FILE $1/ $2/
		
done

