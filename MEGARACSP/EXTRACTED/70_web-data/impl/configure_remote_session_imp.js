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

// File Name  : configure_remote_session_imp.js
// Brief      : This implementation is to display and configure the remote
// session configuration on the BMC. 
// Author Name: Arockia Selva Rani. A

var RMTSESS_CFG;		//It holds get RPC Remote session configuration response
var SINGLE_PORT_APP = false;	//It holds the feature of single port application
var KEYBOARD_LANG = false;		//It holds the feature of physical keyboard language support
var POWER_CONSUMPTION = false;	//It hold the feature of Power consumption support for virtual USB Devices
var HOSTLOCK = false;			//Holds the Host Monitor Lock command enabled feature support
var HOSTLOCKAUTO = false;		//Holds the Host Monitor Lock when JViewer Launched feature support
var RUNTIME_SINGLEPORT = false;	//This will be used to hold the Runtime single port support
var KVM_SESSION_RECONNECT = false;			//This will be used to hold the KVM Retry support configuration
var featueStatus = false;		//Used to hold the feature status value
var KEYBOARD_LANG_COUNT = 19;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {
	exposeElms(["_lblRemoteSessDesc",
		"_rowKVMEncrypt",
		"_chkKVMEncrypt",
		"_rowSinglePort",
		"_chkSinglePort",
		"_rowKeyboardLang",
		"_lstKeyboardLang",
		//"_rowMediaEncrypt",
		//"_chkMediaEncrypt",
		"_rowVMAttach",
		"_lstVMAttach",
		"_rowRetryCount",
		"_txtRetryCount",
		"_rowRetryTimeInterval",
		"_txtRetryTimeInterval",
		"_rowMonitorOFF",
		"_chkMonitorOFF",
		"_rowMonitorOFFAuto",
		"_chkMonitorOFFAuto",
		"_btnTray",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = validateRemoteSessionCfg;
		btnReset.onclick = reloadRemoteSessionCfg;
		chkMonitorOFF.onclick=EnableAutochkMonitorOFF;
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will fill data for user controls like list box, if any.
 * It will invoke the RPC method to get the data for the page.
 */
function _begin() {
	SINGLE_PORT_APP = checkProjectCfg("SINGLE_PORT_APP");
	KEYBOARD_LANG = checkProjectCfg("KB_LANG_SELECT_SUPPORT");
	POWER_CONSUMPTION = checkProjectCfg("POWER_CONSUMPTION");
	HOSTLOCK = checkProjectCfg("RUNTIME_HOST_LOCK");
	HOSTLOCKAUTO = checkProjectCfg("HOST_LOCK_AUTO");
	RUNTIME_SINGLEPORT = checkProjectCfg("RUNTIME_SINGLEPORT_SUPPORT");
	KVM_SESSION_RECONNECT = checkProjectCfg("KVM_SESSION_RECONNECT");
	if (!SINGLE_PORT_APP || (SINGLE_PORT_APP && RUNTIME_SINGLEPORT)) {
		featueStatus = true;
		rowKVMEncrypt.className = "visibleRow";
		//rowMediaEncrypt.className = "visibleRow";
	}
	if (KEYBOARD_LANG) {
		featueStatus = true;
		rowKeyboardLang.className = "visibleRow";
		fillKeyboardLanguage();
	}
	if (!POWER_CONSUMPTION) {
		featueStatus = true;
		rowVMAttach.className = "visibleRow";
		fillAttachMode();
	}
	if (HOSTLOCK) {
		rowMonitorOFF.className = "visibleRow";
	}
	if (HOSTLOCKAUTO) {
		featueStatus = true;
		rowMonitorOFFAuto.className = "visibleRow";
	}
	if (RUNTIME_SINGLEPORT) {
		featueStatus = true;
		rowSinglePort.className = "visibleRow";
		chkSinglePort.onclick = doEncryption;
	}
	if (KVM_SESSION_RECONNECT) {
		featueStatus = true;
		rowRetryCount.className = "visibleRow";
		rowRetryTimeInterval.className = "visibleRow";
	}
	if (!featueStatus) {
		btnTray.className = "hiddenRow";
		alert(eLang.getString("common", "STR_NO_CONFIGURATION"));
		location.href = "dashboard.html";
		return;
	}
	getRemoteSessionCfg();
}

/*
 * It will invoke the RPC method to get the remote session configuration.
 * Once it gets response from RPC, on receive method will be called automatically.
 */
function getRemoteSessionCfg() {
	xmit.get ({url:"/rpc/getremotesession.asp", onrcv:getRemoteSessionCfgRes, 
		status:""});
}

/*
 * This is the response function for getRemoteSessionCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getRemoteSessionCfgRes(arg) {
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_RMT_SESS_GETVAL");
		errstr +=(eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		RMTSESS_CFG = WEBVAR_JSONVAR_GETREMOTESESSIONCFG.WEBVAR_STRUCTNAME_GETREMOTESESSIONCFG[0];
		lblRemoteSessDesc.innerHTML = eLang.getString("common", 
			"STR_CONF_REMOTE_SUPPORT_DESC");
		reloadRemoteSessionCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadRemoteSessionCfg() {
	if (KEYBOARD_LANG) {
		lstKeyboardLang.value = RMTSESS_CFG.KEYBOARDLANG;
	}

	if (!SINGLE_PORT_APP || (SINGLE_PORT_APP && RUNTIME_SINGLEPORT)) {
		chkKVMEncrypt.checked = RMTSESS_CFG.KVMENCRYPTION ? true : false;
		//chkMediaEncrypt.checked = RMTSESS_CFG.MEDIAENCRYPTION ? true : false;
	}

	if (RUNTIME_SINGLEPORT) {
		chkSinglePort.checked = RMTSESS_CFG.SINGLEPORT ? true : false;
		doEncryption();
	}

	if (!POWER_CONSUMPTION) {
		lstVMAttach.value = RMTSESS_CFG.VMEDIAATTACH;
	}
	if (HOSTLOCK) {
		chkMonitorOFF.checked = RMTSESS_CFG.HOSTLOCK ? true : false;
	}
	if (HOSTLOCKAUTO) {
		chkMonitorOFFAuto.checked = RMTSESS_CFG.HOSTLOCKAUTO ? true : false;
	}
	if (KVM_SESSION_RECONNECT) {
		txtRetryCount.value = RMTSESS_CFG.RETRY_COUNT;
		txtRetryTimeInterval.value = RMTSESS_CFG.RETRY_TIMEINTERVAL;
	}
	EnableAutochkMonitorOFF();
}

/*
 * It will validate the data of all user controls before saving it.
 * Here it compares with old data, if any difference then send data to save.
 */
function validateRemoteSessionCfg() {
	//This is common validation on Local Monitor Off,if user not selecting
	//	Automatically OFF Local Monitor when Local Monitor Off checked
	/*if(chkMonitorOFF.checked== false && chkMonitorOFFAuto.checked==true) {
		alert(eLang.getString("common", "STR_RMT_SUPPORT_AUTO_LOCAL_MONITOR"));
		return;
	}*/
	
	if (KVM_SESSION_RECONNECT) {
		if (validateKVMRetry()==false) {
			return false;
		}
	}
	
	if (!SINGLE_PORT_APP || (SINGLE_PORT_APP && RUNTIME_SINGLEPORT)) {
		if ((RMTSESS_CFG.KVMENCRYPTION != chkKVMEncrypt.checked)) {
			//||(RMTSESS_CFG.MEDIAENCRYPTION != chkMediaEncrypt.checked)
			if (confirm(eLang.getString("common", "STR_CONF_RMT_SESS_CONFIRM_1"))) {
				setRemoteSessionCfg();
			}
			return;
		}
	}
	if (RUNTIME_SINGLEPORT) {
		if (RMTSESS_CFG.SINGLEPORT != chkSinglePort.checked) {
			if(chkSinglePort.checked){
				if (confirm(eLang.getString("common", "STR_CONF_RMT_SESS_CONFIRM_2"))) {
					setRemoteSessionCfg();
				}
			}else {
				if (confirm(eLang.getString("common", "STR_CONF_RMT_SESS_CONFIRM_3"))) {
					setRemoteSessionCfg();
				}
			}
			return;
		}
	}
	if (KEYBOARD_LANG) {
		if (RMTSESS_CFG.KEYBOARDLANG != lstKeyboardLang.value) {
			setRemoteSessionCfg();
			return;
		}
	}
	if (!POWER_CONSUMPTION) {
		if (RMTSESS_CFG.VMEDIAATTACH != lstVMAttach.value) {
			setRemoteSessionCfg();
			return;
		}
	}
	if (HOSTLOCK) {
		if (RMTSESS_CFG.HOSTLOCK != chkMonitorOFF.checked) {
			setRemoteSessionCfg();
			return;
		}
	}
	if (HOSTLOCKAUTO) {
		if (RMTSESS_CFG.HOSTLOCKAUTO != chkMonitorOFFAuto.checked) {
			setRemoteSessionCfg();
			return;
		}
	}
	if (KVM_SESSION_RECONNECT) {
		//if (validateKVMRetry()) {
			setRemoteSessionCfg();
			return;
		//}
	}
	return;
}

/*
 * It will invoke the RPC method to set the remote session configuration.
 * Once it gets response from RPC, on receive method will be called automatically.
 */
function setRemoteSessionCfg() {
	btnSave.disabled = true;
	setTimeout("btnSave.disabled = false" ,1800);	//It avoid chage the single port status before set finished, for EIP issue.
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setremotesession.asp", 
		onrcv:setRemoteSessionCfgRes, status:""});
	if (!SINGLE_PORT_APP || (SINGLE_PORT_APP && RUNTIME_SINGLEPORT)) {
		if (chkSinglePort.checked) {
			req.add("KVMENCRYPTION", RMTSESS_CFG.KVMENCRYPTION);
			//req.add("MEDIAENCRYPTION", RMTSESS_CFG.MEDIAENCRYPTION);
		} else {
			req.add("KVMENCRYPTION", chkKVMEncrypt.checked ? 1 : 0);
			//req.add("MEDIAENCRYPTION", chkMediaEncrypt.checked ? 1 : 0);
		}
	}
	if (RUNTIME_SINGLEPORT) {
		req.add("SINGLEPORT_OLD", RMTSESS_CFG.SINGLEPORT);
		req.add("SINGLEPORT", chkSinglePort.checked ? 1 : 0);
	}
	if (KEYBOARD_LANG) {
		req.add("KEYBOARDLANG", lstKeyboardLang.value);
	}
	if (!POWER_CONSUMPTION) {
		req.add("VMEDIAATTACH", lstVMAttach.value);
	}
	if (HOSTLOCK) {
		req.add("HOSTLOCK", chkMonitorOFF.checked ? 1 : 0);
	}
	if (HOSTLOCKAUTO) {
		req.add("HOSTLOCKAUTO", chkMonitorOFFAuto.checked ? 1 : 0);
	}
	if (KVM_SESSION_RECONNECT) {
		req.add("RETRY_COUNT", txtRetryCount.value);
		req.add("RETRY_TIMEINTERVAL", txtRetryTimeInterval.value);
	}
	req.send();
	delete req;
}

/*
 * This is the response function for setRemoteSessionCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setRemoteSessionCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x92:
			alert(eLang.getString("common", "STR_CONF_RMT_SESS_INVALID_RETRY_INTERVAL"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_CONF_RMT_SESS_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_RMT_SESS_SAVE_SUCCESS"));
		setTimeout(getRemoteSessionCfg(),1100);		//Avoid to get the singleport status before set finished, for EIP issue 167580
	}
}

/*
 * It will fill attach mode types of Virtual media in the list box.
 */
function fillAttachMode() {
	var index;				//loop counter
	lstVMAttach.innerHTML = "";
	for (index = 0; index < 2; index++) {
		lstVMAttach.add(new Option(eLang.getString("common", 
			"STR_CONF_RMT_SESS_VMATTACH_" + index), index), isIE?index:null);
	}
}

/*
 * It will fill keyboard supported languages in the list box.
 */
function fillKeyboardLanguage() {
	var index				//loop counter
	lstKeyboardLang.innerHTML = "";
	for (index = 0; index < KEYBOARD_LANG_COUNT; index++) {
		lstKeyboardLang.add(new Option(eLang.getString("common", 
			"STR_CONF_RMT_SESS_KEYLANG_" + index), eLang.getString("common", 
			"STR_CONF_RMT_SESS_KEYLANG_INDEX_" + index)), isIE?index:null);
	}
}

/*
 * This will be used to Enable/Disable the UI controls based on the
 * Runtime singleport feature changes.
 */
function doEncryption() {
	var opt = chkSinglePort.checked;
	if (!opt) {
		rowKVMEncrypt.className = "visibleRow";
	} else {
		rowKVMEncrypt.className = "hiddenRow";
	}
}

/*
 * This will be used to validate the Retry count and Retry time interval
 * value ranges
 */
function validateKVMRetry() {
	if (!eVal.isnumstr(txtRetryCount.value, 1, 3)) {
		alert(eLang.getString("common", "STR_CONF_RMT_SESS_ERR_1") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtRetryCount.focus();
		return false;
	}
	if (!eVal.isnumstr(txtRetryTimeInterval.value, 5, 15)) {
		alert(eLang.getString("common", "STR_CONF_RMT_SESS_ERR_2") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtRetryTimeInterval.focus();
		return false;
	}
	return true;
}

/*
 *  This will be used to Enable/Disable UI controls based on Local Monitor Off
 * 
 */
function EnableAutochkMonitorOFF() {
  if(chkMonitorOFF.checked==true)
	  chkMonitorOFFAuto.disabled= false;
  else {
	  chkMonitorOFFAuto.disabled= true;
	  //chkMonitorOFFAuto.checked= false;
	  }
}


