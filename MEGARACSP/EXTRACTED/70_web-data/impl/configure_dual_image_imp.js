//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2012        **;
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

// File Name  : configure_dual_image
// Brief      : 
// Author Name:

var DUALIMGCFG_DATA;		//It holds the get RPC Dual Image response data

var bootImg = 0;
/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lblFWVer1",
		"_lblState1",
		"_lblFWVer2",
		"_lblState2",
		"_rdoBootImg0",
		"_rdoBootImg1",
		"_rdoBootImg2",
		"_rdoBootImg3",
		"_rdoBootImg4",
		"_rdoBootImg5",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = setDualImageCfg;
		btnReset.onclick = reloadDualImageCfg;
		rdoBootImg1.onclick = rdoBootImg2.onclick = rdoBootImgCfg;
		rdoBootImg0.onclick = rdoBootImg3.onclick = rdoBootImgCfg;
		rdoBootImg4.onclick = rdoBootImg5.onclick = rdoBootImgCfg; 
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will fill data for user controls like list box, if any.
 * Also it will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	getDualImageCfg();
}

/*
 * It will invoke the RPC method to get the dual image configuration.
 * Once it get response from RPC, on receive method will be called
 * automatically.
 */
function getDualImageCfg()
{
	xmit.get({url:"/rpc/getdualimgcfg.asp", onrcv:getDualImageCfgRes,
		status:""});
}

/*
 * This is the response function for getDualImageCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getDualImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DUAL_IMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DUALIMGCFG_DATA = WEBVAR_JSONVAR_GETDUALIMGCFG.WEBVAR_STRUCTNAME_GETDUALIMGCFG[0];
		reloadDualImageCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadDualImageCfg()
{
    if (bcd_to_decimal(DUALIMGCFG_DATA.FW1_MAJOR_VER) < 10 && bcd_to_decimal(DUALIMGCFG_DATA.FW2_MAJOR_VER) < 10) {
		lblFWVer1.innerHTML = getbits(DUALIMGCFG_DATA.FW1_MAJOR_VER,6,0) + ".0" + bcd_to_decimal(DUALIMGCFG_DATA.FW1_MINOR_VER) + "." + DUALIMGCFG_DATA.FW1_AUX_VER;
		lblFWVer2.innerHTML = getbits(DUALIMGCFG_DATA.FW2_MAJOR_VER,6,0) + ".0" + bcd_to_decimal(DUALIMGCFG_DATA.FW2_MINOR_VER) + "." + DUALIMGCFG_DATA.FW2_AUX_VER;
    }
	else {
		lblFWVer1.innerHTML = getbits(DUALIMGCFG_DATA.FW1_MAJOR_VER,6,0) + "." + bcd_to_decimal(DUALIMGCFG_DATA.FW1_MINOR_VER) + "." + DUALIMGCFG_DATA.FW1_AUX_VER;
		lblFWVer2.innerHTML = getbits(DUALIMGCFG_DATA.FW2_MAJOR_VER,6,0) + "." + bcd_to_decimal(DUALIMGCFG_DATA.FW2_MINOR_VER) + "." + DUALIMGCFG_DATA.FW2_AUX_VER;
    }

	lblState1.innerHTML = ":  " + ((DUALIMGCFG_DATA.ACTIVE_IMAGE == 1) ?
		eLang.getString("common", "STR_ACTIVE") :
		eLang.getString("common", "STR_STAND_BY"));
	lblState2.innerHTML = ":  " + ((DUALIMGCFG_DATA.ACTIVE_IMAGE == 2) ?
		eLang.getString("common", "STR_ACTIVE") :
		eLang.getString("common", "STR_STAND_BY"));

	$("_rdoBootImg" + DUALIMGCFG_DATA.BOOT_IMAGE).checked = true;
	$("_rdoBootImg" + DUALIMGCFG_DATA.BOOT_IMAGE).onclick();
}

function bcd_to_decimal(bcd_value)
{
	var lsnibble = bcd_value % 16;
	var msnibble = (bcd_value - lsnibble) / 16;
	return ((msnibble * 10) + lsnibble);
}

/*
 * It will invoke the RPC method to set the dual image configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setDualImageCfg()
{
	var req;			//xmit object to send RPC request with parameters
	if (bootImg != DUALIMGCFG_DATA.BOOT_IMAGE) {
		req = new xmit.getset({url:"/rpc/setdualimgcfg.asp", 
			onrcv:setDualImageCfgRes, status:""});
		req.add("BOOT_IMAGE", bootImg);
		req.send();
		delete req;
	}
}

/*
 * This is the response function for setDualImageCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting dual image configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setDualImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DUAL_IMG_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_CONF_DUAL_IMG_SUCCESS"));
		getDualImageCfg();
	}
}

function rdoBootImgCfg()
{
	bootImg = this.id[this.id.length - 1]
}