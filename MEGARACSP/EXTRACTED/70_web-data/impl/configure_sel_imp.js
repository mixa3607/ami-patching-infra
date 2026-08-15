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

// File Name  : configure_sel_imp.js
// Brief      : This implementation is to display and configure the event log 
// policy for Event Log.
// Author Name: Arockia Selva Rani. A

var SELCFG_DATA;			//RPC SEL Configuration response data
var SEL_POLICY_LINEAR = 0;				//Linear log policy
var SEL_POLICY_CIRCULAR = 1;			//Circular log policy

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lblLogPolicy",
		"_rdoLogLinear",
		"_rdoLogCircular",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = validateSELCfg;
		btnReset.onclick = reloadSELCfg;
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
	getSELCfg();
}

/*
 * It will invoke the RPC method to get the SEL configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getSELCfg()
{
	xmit.get({url:"/rpc/getselcfg.asp", onrcv:getSELCfgRes, status:""});
}

/*
 * This is the response function for getSELCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSELCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_SEL_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SELCFG_DATA = WEBVAR_JSONVAR_GETSELCFG.WEBVAR_STRUCTNAME_GETSELCFG[0];
		lblLogPolicy.innerHTML = (SELCFG_DATA.SEL_POLICY) ? "Circular" : "Linear";
		reloadSELCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadSELCfg() {
	activateButtons();
	if (SELCFG_DATA.SEL_POLICY == SEL_POLICY_LINEAR) {
		rdoLogLinear.disabled = true;
	} else if(SELCFG_DATA.SEL_POLICY == SEL_POLICY_CIRCULAR) {
		rdoLogCircular.disabled = true;
	} else {
		alert(eLang.getString("common", "STR_CONF_SEL_POLICY_UNKNOWN"));
	}
}

function activateButtons() {
	if (top.user.isAdmin()) {
		rdoLogLinear.disabled = false;
		rdoLogCircular.disabled = false;

		rdoLogLinear.checked = false;
		rdoLogCircular.checked = false;
	}
}

/*
 * It will validate the data of all user controls before saving it.
 * Here it compares with old data, if any difference then send data to save.
 */
function validateSELCfg()
{
	if ((SELCFG_DATA.SEL_POLICY == SEL_POLICY_CIRCULAR) && (rdoLogCircular.checked)) {
		return;
	} else if ((SELCFG_DATA.SEL_POLICY == SEL_POLICY_LINEAR) && (rdoLogLinear.checked)) {
		return;
	} else if ((!rdoLogCircular.checked) && (!rdoLogLinear.checked)) {
		alert (eLang.getString("common", "STR_CONF_SEL_POLICY_ERR"));
	} else {
		setSELCfg();
	}
}

/*
 * It will invoke the RPC method to set the event log configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setSELCfg()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setselcfg.asp", 
		onrcv:setSELCfgRes, status:""});
	req.add("SEL_POLICY", (rdoLogCircular.checked) ? 1 : 0);
	req.send();
	delete req;
}

/*
 * This is the response function for setSELCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setSELCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_SEL_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_CONF_SEL_SAVE_SUCCESS"));
		getSELCfg();
	}
}
