//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2010        **;
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

// File Name  : configure_ncsi_imp.js
// Brief      : This implementation is to display and configure the NCSI
// configuration in the BMC.
// Author Name: Arockia Selva Rani. A

var NCSI_MODE;			//It holds the get RPC NCSI response data
var NCSI_CFG;			//It holds the get RPC NCSI response data

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lblNCSImode",
	            "_rdoAuto",
	            "_rdoManual",
	            "_lstNCSIInterface",
				"_lstChannelNo",
				"_lstPackageID",
				"_btnSave",
				"_btnReset"]);

	if(top.user.isAdmin()) {
		rdoAuto.onclick = disableManual;
		rdoManual.onclick = enableManual
		btnSave.onclick = setNCSIMode;
		btnReset.onclick = reloadNCSICfg;
	} else if(top.user.isOperator()) {
		disableActions();
	} else {
		alert(eLang.getString("common","STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}
	_begin();
}

/*
 * It will fill data for user controls like list box, if any.
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	var index;				//loop counter
	for (index = 0; index < 2; index++) {
		lstChannelNo.add(new Option(index, index), isIE?index:null);
		lstPackageID.add(new Option(index, index), isIE?index:null);
	}
	getNCSICfg();	
}

function getNCSIMode()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/getncsimode.asp", onrcv:getNCSIModeRes,
		status:""});
	req.add("NCSI_INTERFACE_NAME", 
		NCSI_CFG[lstNCSIInterface.value].NCSI_INTERFACE_NAME);
	req.send();
	delete req;
}

function getNCSIModeRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_SENSOR_GETVAL");
		errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS);
		alert(errstr);
	} else {		
		NCSI_MODE = WEBVAR_JSONVAR_GETNCSIMODE.WEBVAR_STRUCTNAME_GETNCSIMODE[0].NCSI_MODE;
		if(NCSI_MODE == 0) // Manual Switch Mode
		{
			enableManual();		
			rdoManual.checked = true;
		}									
		else  // Auto Failover Mode
		{
			disableManual();
			rdoAuto.checked = true;
		}					
		lblNCSImode.innerHTML = eLang.getString("common", "STR_CONF_NCSI_MODE_" + NCSI_MODE);
	}
}

/*
 * It will invoke the RPC method to get the NCSI configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getNCSICfg()
{
	xmit.get({url:"/rpc/getncsicfg.asp", onrcv:getNCSICfgRes, status:""});
}

/*
 * This is the response function for getNCSICfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getNCSICfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_NCSI_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		NCSI_CFG = WEBVAR_JSONVAR_GETNCSICFG.WEBVAR_STRUCTNAME_GETNCSICFG;
		fillInterfacesNames();
		reloadNCSICfg();
		getNCSIMode();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadNCSICfg()
{
	lstChannelNo.value = NCSI_CFG[lstNCSIInterface.value].CHANNEL_NO;
	lstPackageID.value = NCSI_CFG[lstNCSIInterface.value].PACKAGE_ID;
}

/*
 * It will fill interface name in the list box using the RPC response.
 */
function fillInterfacesNames()
{
	var index;				//loop counter
	lstNCSIInterface.innerHTML = "";
	for (index = 0; index < NCSI_CFG.length; index++) {
		lstNCSIInterface.add(new Option(NCSI_CFG[index].NCSI_INTERFACE_NAME, 
			index), isIE?index:null);
	}
}

/*
 * It will invoke the RPC method to set the NCSI configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setNCSICfg()
{	
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setncsicfg.asp", onrcv:setNCSICfgRes,
		status:""});
	req.add("NCSI_INTERFACE_NAME", 
		NCSI_CFG[lstNCSIInterface.value].NCSI_INTERFACE_NAME);
	req.add("CHANNEL_NO", lstChannelNo.value);
	req.add("PACKAGE_ID", lstPackageID.value);
	req.send();
	delete req;
	
}

/*
 * This is the response function for setNCSICfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then NCSI configuration is success, intimate proper message to end 
 * user.
 * @param arg object, RPC response data from xmit library
 */
function setNCSICfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_NCSI_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert(eLang.getString("common", "STR_CONF_NCSI_SAVE_SUCCESS"));
		getNCSICfg();	
	}
}

function setNCSIMode()
{
	var req;			//xmit object to send RPC request with parameters
	var index = -1;
	index = NCSI_CFG[lstNCSIInterface.value].NCSI_INTERFACE_NAME.replace("eth","");

	req = new xmit.getset({url:"/rpc/setncsimode.asp", onrcv:setNCSIModeRes,
		status:""});
	req.add("NCSIMODE",rdoAuto.checked == true ?1:0);	
	req.add("INTERFACE",index);
	req.send();
	delete req;
}

function setNCSIModeRes(arg)
{
	var errstr;		//Error string
	
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_NCSI_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		if(rdoAuto.checked == true)
		{
			alert(eLang.getString("common", "STR_CONF_NCSI_SAVE_SUCCESS"));
			getNCSICfg();			
		}
		else
			setNCSICfg();		
	}
}

function disableManual()
{
	lstNCSIInterface.disabled = true;
	lstChannelNo.disabled = true;
	lstPackageID.disabled = true;
}

function enableManual()
{
	lstNCSIInterface.disabled = false;
	lstChannelNo.disabled = false;
	lstPackageID.disabled = false;			
}
