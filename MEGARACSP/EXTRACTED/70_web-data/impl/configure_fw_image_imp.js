//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2011        **;
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

// File Name  : configure_fw_image_imp.js
// Brief      : This implementation is to display and configure the firmware
// update image on the BMC.
// Author Name: Arockia Selva Rani. A

var FWIMAGECFG_DATA;			//It holds the get RPC virtual media response data

var CONST_PROTOTYPE_HTTP = 0;
var CONST_PROTOTYPE_TFTP = 1;
var CONST_PROTOTYPE_FTP = 2;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lstProtocol",
		"_txtAddress",
		"_txtSrcPath",
		"_txtRetryCnt",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = validateFWImageCfg;
		btnReset.onclick = reloadFWImageCfg;
	} else {
		disableActions();
	}
	lstProtocol.onchange = enableProtoType;
	_begin();
}

/*
 * It will fill data for user controls like list box, if any.
 * Also it will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	var index;				//loop counter
	for (index = CONST_PROTOTYPE_HTTP; index <= CONST_PROTOTYPE_TFTP; index++) {
		lstProtocol.add(new Option(eLang.getString("common",
			"STR_CONF_FWIMG_PROTO" + index),index), isIE?index:null);
	}
	getFWImageCfg();
}

/*
 * It will invoke the RPC method to get the firmware image configuration.
 * Once it get response from RPC, on receive method will be called
 * automatically.
 */
function getFWImageCfg()
{
	xmit.get({url:"/rpc/getfwimgcfg.asp", onrcv:getFWImageCfgRes, status:""});
}

/*
 * This is the response function for getFWImageCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getFWImageCfgRes(arg)
{
	var errstr;		//Error string
	if (GET_ERROR_CODE(arg.HAPI_STATUS) == 0xD4) { //Insufficient privilege level
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	} else if(arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_FWIMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		FWIMAGECFG_DATA = WEBVAR_JSONVAR_GETFWIMGCFG.WEBVAR_STRUCTNAME_GETFWIMGCFG[0];
		reloadFWImageCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadFWImageCfg()
{
	lstProtocol.value = FWIMAGECFG_DATA.PROTO_TYPE;
	txtAddress.value = FWIMAGECFG_DATA.IP_ADDR;
	txtSrcPath.value = FWIMAGECFG_DATA.SHARE_PATH;
	txtRetryCnt.value = FWIMAGECFG_DATA.RETRY_CNT;
	enableProtoType();
}

/*
 * It will validate the data of all user controls before saving it.
 * Here it compares with old data, if any difference then send data to save.
 */
function validateFWImageCfg()
{
	if ((FWIMAGECFG_DATA.PROTO_TYPE == lstProtocol.value) &&
		(FWIMAGECFG_DATA.IP_ADDR == txtAddress.value) &&
		(FWIMAGECFG_DATA.SHARE_PATH == txtSrcPath.value) &&
		(FWIMAGECFG_DATA.SHARE_PATH == txtRetryCnt.value)) {
		return;
	} else {
		if (lstProtocol.value != CONST_PROTOTYPE_HTTP) {
			
			
			if (eVal.ip(txtAddress.value) || eVal.ipv6(txtAddress.value)) {
				
			} else {
				alert(eLang.getString("common", "STR_INVALID_IP") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtAddress.focus();
				return;
			}

			if (eVal.isblank(txtSrcPath.value)) {
				alert(eLang.getString("common", "STR_INVALID_SRC_PATH") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtSrcPath.focus();
				return;
			}

			if (!eVal.isnumstr(txtRetryCnt.value, 0, 255)) {
				alert(eLang.getString("common",
					"STR_CONF_FWIMG_INVALID_RETRYCNT") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtRetryCnt.focus();
				return;
			}
		}
		setFWImageCfg();
	}
}
/*
 * It will invoke the RPC method to set the firmware image configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setFWImageCfg()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setfwimgcfg.asp", 
		onrcv:setFWImageCfgRes, status:""});
	req.add("PROTO_TYPE", lstProtocol.value);
	req.add("IP_ADDR", txtAddress.value);
	req.add("SHARE_PATH", txtSrcPath.value);
	req.add("RETRY_CNT", txtRetryCnt.value);
	req.send();
	delete req;
}

/*
 * This is the response function for setFWImageCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setFWImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_FWIMG_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_CONF_FWIMG_SUCCESS"));
		getFWImageCfg();
	}
}

function enableProtoType()
{
	var opt;
	opt = (lstProtocol.value == CONST_PROTOTYPE_HTTP) ? true : false;
	txtAddress.disabled = opt;
	txtSrcPath.disabled = opt;
	txtRetryCnt.disabled = opt;
}
