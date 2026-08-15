//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2012-2015        **;
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

// File Name  : configure_cont_videorecord_imp.js
// Brief      : This implementation is used to display and Pre-Events video
//				Recording informations
// Author Name: Sakthivel. R

var PRE_EVENT_DATA;			//It holds the get RPC Pre-Event video recording response data

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {		// TODO: add page initialization code
	exposeElms(["_contVideoDesc",
		"_lstVideoQuality",
		"_lstCompressionMode",
		"_lstFPS",
		"_lstVideoDuration",
		"_btnSave",
		"_btnReset"]);

	if (top.user.isAdmin()) {
		btnSave.onclick = setPreEventCfg;
		btnReset.onclick = reloadPreEventCfg;
		lstCompressionMode.onchange = doVideoDuration;
		lstFPS.onchange = doVideoDuration;
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will fill data for user controls like list box, if any.
 * Also it will invoke the RPC method to get the data for the page.
 */
function _begin() {
	fillPreEventDetails();
	fillDuration();
	getPreEventCfg();
}

/*
 * It will invoke the RPC method to get the Pre-Event video recording configurations.
 * Once it get response from RPC, on receive method will be called
 * automatically.
 */
function getPreEventCfg() {
	contVideoDesc.innerHTML = "";
	xmit.get({url:"/rpc/getpreeventcfg.asp", onrcv:getPreEventCfgRes, status:""});
}

/*
 * This is the response function for getPreEventCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getPreEventCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_PRE_EVENT_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		PRE_EVENT_DATA = WEBVAR_JSONVAR_GETPREEVENTCFG.WEBVAR_STRUCTNAME_GETPREEVENTCFG[0];
		contVideoDesc.innerHTML = eLang.getString("common", 
			"STR_PRE_EVENT_DESC_" + PRE_EVENT_DATA.ENABLE);
		reloadPreEventCfg();
	}
}

/*
 * It will fill default data to all the UI controls
 */
function fillPreEventDetails() {
	var i;	//Loop counter
	for (i = 0; i <= 4; i++) {
		lstVideoQuality.add(new Option(eLang.getString("common", 
			"STR_PRE_EVENT_QUALITY_" + i), i), isIE?i:null);
	}

	for (i = 0; i <= 3; i++) {
		lstCompressionMode.add(new Option(eLang.getString("common", 
			"STR_PRE_EVENT_COMPRESSION_" + i), i), isIE?i:null);
	}

	for (i = 1; i <= 4; i++) {
		lstFPS.add(new Option(i ,i), isIE?i:null);
	}
}

/*
 * It will fill default data to Video duration UI control
 */
function fillDuration() {
	var i;	//Loop counter
	for (i = 10; i <= 60; i += 10) {
		lstVideoDuration.add(new Option(i , i), isIE ? i : null);
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadPreEventCfg() {
	lstVideoQuality.value = PRE_EVENT_DATA.VIDEO_QUALITY;
	lstCompressionMode.value = PRE_EVENT_DATA.COMP_MODE;
	lstFPS.value = PRE_EVENT_DATA.FPS;
	doVideoDuration();
}

/*
 * It will invoke the RPC method to set the Pre-Event video recording configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setPreEventCfg() {
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setpreeventcfg.asp", 
		onrcv:setPreEventCfgRes, status:""});
	req.add("VIDEO_QUALITY", lstVideoQuality.value);
	req.add("COMP_MODE", lstCompressionMode.value);
	req.add("FPS", lstFPS.value);
	req.add("VIDEO_DURATION", lstVideoDuration.value);
	req.send();
	delete req;
}

/*
 * This is the response function for setPreEventCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setPreEventCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_PRE_EVENT_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_PRE_EVENT_SUCCESS"));
		getPreEventCfg();
	}
}

/* This method is used to reload and display the duration the listbox items 
 * based on the compresstion and frames per second options in UI.
 */
function doVideoDuration() {
	var sum;
	lstVideoDuration.innerHTML = "";
	fillDuration();
	sum = parseInt(lstCompressionMode.value) + parseInt(lstFPS.value);
	if (sum > 5) {
		modifyVideoDuration(10);
	}
	if ((sum > 3) && (sum <= 5)) {
		modifyVideoDuration(30);
	}	
	lstVideoDuration.value = PRE_EVENT_DATA.VIDEO_DURATION;
}

/* This method is used to reload the listbox items based on the compresstion and 
 * frames per second options in UI.
 */
function modifyVideoDuration(limit) {
	var index; // Loop counter
	for (index = lstVideoDuration.length - 1; index > 0; index--) {
		if (lstVideoDuration.options[index].value > limit) {
			lstVideoDuration.remove(index);
		}
	}
}