//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2013        **;
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
var BMC_RECOVERY_CFG;		//It holds get RPC BMC Recovery configuration response
// File Name  : bmc_recovery
// Brief      : 
// Author Name:Kirankumar B
function doInit() {
	 // TODO: add page initialization code	
	exposeElms([
			"_chkForceRecovery",
			"_txtBootRetry",
			"_txtRecoveryRetry",
			"_txtServerIP",
			"_txtImageName",
			"_btnSave",
			"_btnReset"]);

		if(top.user.isAdmin()) {
			btnSave.onclick = validateBMCRecoveryCfg;
			btnReset.onclick = loadBMCRecoveryCfg;
		} 
	_begin();
}
/*
 * It will fill data for user controls like list box, if any.
 * It will invoke the RPC method to get the data for the page.
 */
function _begin() {
	getBMCRecoveryCfg();
}
/*
 * It will invoke the RPC method to get the BMC Recovery configuration.
 * Once it gets response from RPC, on receive method will be called automatically.
 */
function getBMCRecoveryCfg() {
	xmit.get ({url:"/rpc/getbmcrecovery.asp", onrcv:getBMCRecoveryCfgRes, 
		status:""});
}
/*
 * This is the response function for getBMCRecoveryCfgRes RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getBMCRecoveryCfgRes(arg) {
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_BMC_RECOVERY_GETVAL");
		errstr +=(eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		BMC_RECOVERY_CFG = WEBVAR_JSONVAR_GETBMCRECOVERY.WEBVAR_STRUCTNAME_GETBMCRECOVERY[0];
		loadBMCRecoveryCfg();
	}
}

function loadBMCRecoveryCfg() {
	if(BMC_RECOVERY_CFG != null && BMC_RECOVERY_CFG != undefined) {
		chkForceRecovery.checked = (BMC_RECOVERY_CFG.FORCE_RECOVERY==1)?true: false;
		txtBootRetry.value= BMC_RECOVERY_CFG.BOOT_RETRY;
		txtRecoveryRetry.value= BMC_RECOVERY_CFG.RECOVERY_RETRY;
		txtServerIP.value= BMC_RECOVERY_CFG.SERVERIP;
		txtImageName.value= BMC_RECOVERY_CFG.IMAGE_NAME.replace(/.[^.]+$/,'');
	}
}

function validateBMCRecoveryCfg() {
	if(BMC_RECOVERY_CFG != null && BMC_RECOVERY_CFG != undefined) {
	
		if ((BMC_RECOVERY_CFG.FORCE_RECOVERY == chkForceRecovery.checked) &&
			(BMC_RECOVERY_CFG.BOOT_RETRY == txtBootRetry.value) &&
			(BMC_RECOVERY_CFG.RECOVERY_RETRY == txtRecoveryRetry.value) &&
			(BMC_RECOVERY_CFG.SERVERIP == txtServerIP.value) &&
			(BMC_RECOVERY_CFG.IMAGE_NAME == txtImageName.value+".ima")) {
			return;
		} else {
			if (!eVal.ip(txtServerIP.value)) {
				alert(eLang.getString("common", "STR_INVALID_IP") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtServerIP.focus();
				return;
			}
			if (eVal.isblank(txtImageName.value)) {
				alert(eLang.getString("common", "STR_INVALID_BMC_RECOVERY_IMAGE_NAME") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtImageName.focus();
				return;
			}

			//Check the image name length
			 if(txtImageName.value.length >5)
				 {
		          	alert(eLang.getString("common",
					"STR_CONF_BMC_RECOVERY_CHARACTER_LIMIT") +
					eLang.getString("common", "STR_HELP_INFO"));
		          txtImageName.focus();
		          return;
		         }

		    //Check the image name special characters
		    if (!eVal.isblank(txtImageName.value)) {
			var condition = /^[a-zA-Z0-9-_]+$/;
			if(!txtImageName.value.match(condition))
				{
				 		alert(eLang.getString("common",
					"STR_CONF_BMC_RECOVERY_ALPHANUM_ALERT") +
					eLang.getString("common", "STR_HELP_INFO"));
					txtImageName.focus();
					return ;
				}
		    }

			if (!eVal.isnumstr(txtBootRetry.value, 1, 5)) {
				alert(eLang.getString("common",
					"STR_CONF_BMC_RECOVERY_BOOT_INVALID_RETRYCNT") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtBootRetry.focus();
				return;
			}
			if (!eVal.isnumstr(txtRecoveryRetry.value, 1, 5)) {
				alert(eLang.getString("common",
					"STR_CONF_BMC_RECOVERY_INVALID_RETRYCNT") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtRecoveryRetry.focus();
				return;
			}
			setBMCRecoveryCfg();
		}
	}
}

/*
 * It will invoke the RPC method to set the BMC Recovery configuration.
 * Once it gets response from RPC, on receive method will be called automatically.
 */
function setBMCRecoveryCfg() {
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setbmcrecovery.asp", 
		onrcv:setBMCRecoveryCfgRes, status:""});
	
	req.add("BMC_FORCE_RECOVERY",chkForceRecovery.checked ? 1 : 0);
	req.add("BOOT_RETRY", txtBootRetry.value);
	req.add("RECOVERY_RETRY", txtRecoveryRetry.value);
	req.add("SERVERIP", txtServerIP.value);
	req.add("IMAGE_NAME", txtImageName.value+".ima");
	req.send();
	delete req;
}

/*
 * This is the response function for setBMCRecoveryCfgRes RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setBMCRecoveryCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		default:
			errstr =  eLang.getString("common", "STR_CONF_BMC_RECOVERY_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_BMC_RECOVERY_SAVE_SUCCESS"));
		getBMCRecoveryCfg();
	}
}

