#!/bin/sh

test -f /etc/init.d/adviserd.sh && /etc/init.d/adviserd.sh restart_conf

test -f /etc/init.d/vmscript && /etc/init.d/vmscript restart

#test -f /etc/init.d/lmedia.sh && /etc/init.d/lmedia.sh restart

#test -f /etc/init.d/rmedia.sh && /etc/init.d/rmedia.sh restart

