#------- Comment/uncomment the following line to enable/disable debugging------
DEBUG = n

LIBRARY_NAME=libifc_extension

SRC += libifc_extn.c


CFLAGS += -I${SPXINC}/global
CFLAGS += -I${SPXINC}/dbgout
CFLAGS += -I${SPXINC}/webifc
CFLAGS += -I${TARGETDIR}/usr/include
CFLAGS += -I${SPXINC}/featuredefine
CFLAGS += -I${SPXINC}/libipmi
CFLAGS += -I${SPXINC}/ipmi
CFLAGS += -I${SPXINC}/encryption
CFLAGS += -I${SPXINC}/userm

LIBS += -L$(SPXLIB)/libsslcrt -lsslcertificate

include ${TOOLDIR}/rules/Rules.make.libs
#------------------------------------------------------------------------------
