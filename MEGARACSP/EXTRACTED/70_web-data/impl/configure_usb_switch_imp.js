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

var BMCCOUNT;								//It holds the get RPC number of BMC Inst response data
var USBSWITCHSETTING;						//It holds the get RPC USB Switch Setting response data
var USBSWITCHSETTING_SETTING_MASK=0xF0;
var USBSWITCHSETTING_ENABLE_MASK=0x80;
var USBSWITCHSETTING_NODE_MASK=0x70;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_tblUSBSwitch",
		"_chkUSBSwitchStatus",
		"_lblUSBSwitch",
		"_btnSave"]);

	if (top.user.isAdmin()) {
		chkUSBSwitchStatus.onclick = validateSelected;
		btnSave.disabled = true;
		btnSave.onclick = setUSBSwitchSetting;

	} else {
		chkUSBSwitchStatus.disabled = true;
		btnSave.disabled = true;
	}

	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	getNumOfBMCInst();
}

/*
 * It will invoke the RPC method to get the number of BMC Inst.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getNumOfBMCInst()
{
	xmit.get({url:"/rpc/getnumofbmcinst.asp", onrcv:getNumOfBMCInstRes, status:""});
}

/*
 * This is the response function for getnumofbmcinst RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getNumOfBMCInstRes(arg)
{
	var errstr;		//Error string
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_MULTI_BMCINST_GETVAL");
		errstr +=(eLang.getString("common", "STR_ERROR_CODE") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	}
	BMCCOUNT = WEBVAR_JSONVAR_GETNUMOFBMCINST.WEBVAR_STRUCTNAME_GETNUMOFBMCINST[0].BMC_INST_COUNT;

	createNodeTable();
}

function createNodeTable()
{
	var USBSwitchTable = document.getElementById("_tblUSBSwitch");
	for(var count=1;count <= BMCCOUNT;count++)
	{
        var row = USBSwitchTable.insertRow(-1);
        var cell = row.insertCell(-1);
		var element='<input type ="radio" name="rdoUSBSwitchSelect" id="rdoUSBSwitchSelect' + count + '"';
		element += 'onclick="validateSelected()" />';
		element +="Node " + count;
		cell.innerHTML=element;
	}
	getUSBSwitchSetting();
}

/*
 * It will invoke the RPC method to get USB Switch Settings.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getUSBSwitchSetting()
{
	xmit.get({url:"/rpc/getUSBSwitchSetting.asp", onrcv:getUSBSwitchSettingRes, status:""});
}

/*
 * This is the response function for getUSBSwitchSetting RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getUSBSwitchSettingRes(arg)
{
	var errstr;		//Error string
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_MULTI_BMCINST_USB_SWITCH_GETVAL");
		errstr +=(eLang.getString("common", "STR_ERROR_CODE") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	}

	USBSWITCHSETTING = WEBVAR_JSONVAR_GETUSBSWITCHSETTING.WEBVAR_STRUCTNAME_GETUSBSWITCHSETTING[0].USB_SWITCH_SETTING;

	setUSBSwitchSettingPageStatus ();
}

function setUSBSwitchSettingPageStatus()
{
	if (USBSWITCHSETTING & USBSWITCHSETTING_ENABLE_MASK)
	{
		chkUSBSwitchStatus.checked = true;

		/* get redirection node */
		redirNode = ((USBSWITCHSETTING & USBSWITCHSETTING_NODE_MASK)>>4)+1;
		if ( redirNode <= BMCCOUNT)
		{
			enableNode="rdoUSBSwitchSelect"+redirNode;
			document.getElementById(enableNode).checked=true;
		}
	}
}

function validateSelected()
{
	var tmpUSBSwitchSetting=getTmpUSBSwitchSetting();
	if (top.user.isAdmin()) {
		if ( (USBSWITCHSETTING_SETTING_MASK & USBSWITCHSETTING) != tmpUSBSwitchSetting )
			btnSave.disabled = false;
		else
			btnSave.disabled = true;
	}

}

function getTmpUSBSwitchSetting()
{
	var tmpUSBSwitchSetting=0;
	if ( chkUSBSwitchStatus.checked == true)
		tmpUSBSwitchSetting=0x80;
	for(var count=1;count <= BMCCOUNT;count++)
	{
		tmpNodeSelect="rdoUSBSwitchSelect"+count;
		if(document.getElementById(tmpNodeSelect).checked == true)
		{
			tmpUSBSwitchSetting += ((count-1) << 4);
			break;
		}
	}
	return tmpUSBSwitchSetting;
}


function setUSBSwitchSetting()
{

	if (top.user.isAdmin()) {
		if(confirm(eLang.getString("common", "STR_MULTI_BMCINST_USB_SWITCH_CONFIRM"))) {
			var req = new xmit.getset({url:"/rpc/setUSBSwitchSetting.asp", 
				onrcv:setUSBSwitchSettingRes, status:""});
			req.add("USB_SWITCH_SETTING", getTmpUSBSwitchSetting());
			req.send();
			delete req;
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setUSBSwitchSettingRes(arg)
{
	var errstr;		//Error string
	if ( arg.HAPI_STATUS ) 
	{
		errstr = eLang.getString("common", "STR_MULTI_BMCINST_USB_SWITCH_SETVAL");
		errstr +=(eLang.getString("common", "STR_ERROR_CODE") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	}
	USBSWITCHSETTING = getTmpUSBSwitchSetting();
	btnSave.disabled = true;
	alert(eLang.getString("common", "STR_MULTI_BMCINST_SET_USB_SWITCH_SUCCESS"));
}

