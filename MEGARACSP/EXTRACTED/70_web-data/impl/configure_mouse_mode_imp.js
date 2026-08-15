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

var MOUSEMODE;			//It holds the get RPC mouse mode response data
var tmpMousemode = -1;
/*
 * The following are the constants used in this implementation.
*/
var RELATIVE_MODE = 1;		//Relative Mouse mode
var ABSOLUTE_MODE = 2;		//Absolute Mouse mode
var OTHER_MODE = 3;			//Othe Mouse mode


/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lblMousemode",
		"_rdoAbsolute",
		"_rdoRelative",
		"_rdoOther",
		"_btnSave",
		"_btnReset"]);

	if (top.user.isAdmin()) {
		rdoRelative.onclick = function ()
		{
			tmpMousemode = RELATIVE_MODE;
		};
		rdoAbsolute.onclick = function ()
		{
			tmpMousemode = ABSOLUTE_MODE;
		};
		rdoOther.onclick = function ()
		{
			tmpMousemode = OTHER_MODE;
		};
		btnSave.onclick = validateMouseMode;
		btnReset.onclick = reloadMouseMode;
	} else {
		disableActions();
	}

	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	getMouseMode();
}

/*
 * It will invoke the RPC method to get the mouse mode configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getMouseMode()
{
	xmit.get({url:"/rpc/getmousemode.asp", onrcv:getMouseModeRes, status:""});
}

/*
 * This is the response function for getMouseMode RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getMouseModeRes(arg)
{
	var errstr;		//Error string
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_MOUSE_GETVAL");
		errstr +=(eLang.getString("common", "STR_ERROR_CODE") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	}
	MOUSEMODE = WEBVAR_JSONVAR_GETMOUSEMODE.WEBVAR_STRUCTNAME_GETMOUSEMODE[0].MOUSE_MODE;
	lblMousemode.innerHTML = eLang.getString("common", "STR_CONF_MOUSE_MODE_" + MOUSEMODE);
	reloadMouseMode();
}

function activateButtons()
{
	if (top.user.isAdmin())
	{
		rdoRelative.disabled = false;
		rdoAbsolute.disabled = false;
		rdoOther.disabled = false;

		rdoRelative.checked = false;
		rdoAbsolute.checked = false;
		rdoOther.checked = false;
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadMouseMode()
{
	activateButtons();
	tmpMousemode = MOUSEMODE;
	if (MOUSEMODE == RELATIVE_MODE) {
		rdoRelative.disabled = true;
	} else if (MOUSEMODE == ABSOLUTE_MODE) {
		rdoAbsolute.disabled = true;
	} else if (MOUSEMODE == OTHER_MODE) {
		rdoOther.disabled = true;
	} else {
		alert(eLang.getString("common", "STR_CONF_MOUSE_UNKNOWN"));
	}
}

function validateMouseMode()
{
	if (!rdoRelative.checked && !rdoAbsolute.checked && !rdoOther.checked) {
		//alert(eLang.getString("common", "STR_CONF_MOUSE_ALERT1"));
		return;
	} else if (MOUSEMODE == tmpMousemode) {
		//alert(eLang.getString("common", "STR_CONF_MOUSE_ALERT2"));
		return;
	}
	setMouseMode();
}

function setMouseMode()
{
	if (top.user.isAdmin()) {
		if(confirm(eLang.getString("common", "STR_CONF_MOUSE_CONFIRM"))) {
			var req = new xmit.getset({url:"/rpc/setmousemode.asp", 
				onrcv:setMouseModeRes, status:""});
			req.add("MOUSE_MODE", tmpMousemode);
			req.send();
			delete req;
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setMouseModeRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_MOUSE_SETVAL");
		errstr += eLang.getString("common", "STR_ERROR_CODE") + 
				GET_ERROR_CODE(arg.HAPI_STATUS);
		alert(errstr);
	} else {
		alert(eLang.getString("common", "STR_CONF_MOUSE_SUCCESS"));
		getMouseMode();
	}
}
