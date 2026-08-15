//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2009        **;
//;**                     ALL RIGHTS RESERVED                     **;
//;**                                                             **;
//;**  This computer software, including display screens and      **;
//;**  all related materials, are confidential and the            **;
//;**  exclusive property of American Megatrends, Inc.  They      **;
//;**  are available for limited use, but only pursuant to        **;
//;**  a written license agreement distributed with this          **;
//;**  computer software.  This computer software, including      **;
//;**  display screens and all related materials, shall not be    **;
//;**  copied, reproduced, published or distributed, in whole     **;
//;**  or in part, in any medium, by any means, for any           **;
//;**  purpose without the express written consent of American    **;
//;**  Megatrends, Inc.                                           **;
//;**                                                             **;
//;**                                                             **;
//;**                American Megatrends, Inc.                    **;
//;**           5555 Oakbook Parkway, Building 200                **;
//;**     Norcross,  Georgia - 30071, USA. Phone-(770)-246-8600.  **;
//;**                                                             **;
//;*****************************************************************;
//;*****************************************************************;
/**********************************************************************************

Name : libifc_extn.c

Purpose : Web interface handlers for OEM defined method misc

 **********************************************************************************/

#include "webifc.h"
#include <stdlib.h>
#include <stdgrps.h>
#include "dbgout.h"

/**
 * THis package and method is define for the below fcuntion to achieve by the OEM:
 * 	1. To create the OEM defined libifc layer method and use this library name in asp file to call this method
 * 	2. TO override the AMI defined method override by the OEM can be achieved in this package.
 */
WEBIFC_HAPIFN_DEFINE( GetRomFileSize )
{
	

	return( 0 );
}

WEBIFC_HAPIFN_DEFINE(WEBSETGPIO){
	
#define NetFn_GPIO 0x36
#define CMD_SETGPIO 0x01
	
	typedef struct{
		INT8U PinNumber;
		INT8U Status;
		INT8U Reserved;
	}PACKED SetGPIOReq_T;
	typedef struct{
		INT8U CompleteCode;
	}PACKED SetGPIORes_T;
	
	int retval = 1;
	
	WP_VAR_DECLARE(WEBVAR_PINNUMBER , VARTYPE_INT);
	WP_VAR_DECLARE(WEBVAR_STATUS , VARTYPE_INT);
	
	WEBPAGE_WRITE_BEGIN();
	WEBPAGE_WRITE_JSON_BEGIN(WEBSETGPIO);
	
	WEBVAR_PINNUMBER = WP_GET_VAR_INT(WEBVAR_PINNUMBER);
	WEBVAR_STATUS = WP_GET_VAR_INT(WEBVAR_STATUS);
	SetGPIOReq_T SetGPIOReq = {0};
	SetGPIORes_T GPIORes;
	uint32 ResLen ;
	ResLen = sizeof(SetGPIORes_T);
	
	
	SetGPIOReq.PinNumber = WEBVAR_PINNUMBER;
	SetGPIOReq.Status =  WEBVAR_STATUS;
	SetGPIOReq.Reserved = 0x00;
	
	retval =  LIBIPMI_Send_RAW_IPMI2_0_Command(&((wc_get_ipmi_session(wp))->IPMISession), PAYLOAD_TYPE_IPMI,
			NetFn_GPIO << 2, CMD_SETGPIO,
			(uint8 *)&SetGPIOReq,sizeof(SetGPIOReq_T),
			(uint8 *)&GPIORes,(uint32*)&ResLen,
			DEFAULT_IPMITIMEOUT);
	
	if (retval != RPC_HAPI_SUCCESS) {
		TCRIT("Error in Getting BMC Recovery configuration");
		goto error_out;
	}   
	
error_out:
	WEBPAGE_WRITE_JSON_END(WEBSETGPIO, retval);
	WEBPAGE_WRITE_END();
	return RPC_HAPI_SUCCESS;
}  
