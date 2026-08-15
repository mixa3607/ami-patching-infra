# Backward compatibility for iptables

#!/bin/sh

IPTABLES_CONF="/mnt/newconf/iptables.conf"
IPTABLES_BK_CONF="/mnt/newbkconf/iptables.conf"

IPTABLES_TIMEOUT_CONF="/mnt/newconf/iptables_timeout.conf"
IPTABLES_TIMEOUT_BK_CONF="/mnt/newbkconf/iptables_timeout.conf"

echo "Updateiptables.sh called "
if [ -f $IPTABLES_CONF ]; then
    #check for the timeout entires present or not
    if grep -q ' time ' $IPTABLES_CONF; then
	    echo "Generating  iptables_timeout.conf"
	    
	    #copy iptables.conf to iptables_timeout.conf
	    cp $IPTABLES_CONF $IPTABLES_TIMEOUT_CONF
		   	if [ $? = 0 ] 
			then
			    echo $IPTABLES_TIMEOUT_CONF "copy Success"
		    else
			    echo $IPTABLES_TIMEOUT_CONF "copy Failed" 
		 	fi
	    cp $IPTABLES_BK_CONF $IPTABLES_TIMEOUT_BK_CONF
	    if [ $? = 0 ] 
			then
			    echo $IPTABLES_TIMEOUT_BK_CONF "copy Success"
		    else
			    echo $IPTABLES_TIMEOUT_BK_CONF "copy Failed" 
		 fi
	    
        echo "delete the timeout entries in iptables.conf"
        sed -i '/time/d' $IPTABLES_CONF
          if [ $? = 0 ] 
			then
			    echo  $IPTABLES_CONF "Deleting timeout entries Success"
		    else
			    echo $IPTABLES_CONF "Deleting timeout entires Failed" 
		 fi
        
        sed -i '/time/d' $IPTABLES_BK_CONF
          if [ $? = 0 ] 
			then
			    echo  $IPTABLES_BK_CONF "Deleting timeout entries Success"
		    else
			    echo $IPTABLES_BK_CONF "Deleting timeout entires Failed" 
		 fi

        echo "Done iptables backward compatibility"
    else
        echo "No timeout entries found"
    fi

else
	echo "No iptables conf found"

fi
