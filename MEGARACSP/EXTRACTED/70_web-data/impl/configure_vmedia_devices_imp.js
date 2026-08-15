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

// File Name  : configure_vmedia_devices_imp.js
// Brief      : This implementation is to display and configure the virtual 
// media devices in the BMC.
// Author Name: Arockia Selva Rani. A

var VMEDIACFG_DATA;			//It holds the get RPC virtual media response data
var SD_SERVER_SUPPORT = false; //It holds the feature of sd server support
var POWER_CONSUMPTION = false; //It hold the power consumption feature support
var DEDICATED_MEDIA_FOR_LMEDIA_RMEDIA = false; //It hold the dedicated media for lmedia and rmedia support
var VMEDIA_ENABLE_BOOT_ONCE = false; //It hold the virtual devices boot once support
var KVM_DEVICE_COUNT = false; //It hold the KVM Virtual device support
var SINGLE_PORT_APP = false;	//It holds the feature of single port application
var RUNTIME_SINGLEPORT = false;	//This will be used to hold the Runtime single port support
/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {
	exposeElms(["_lstFDCount",
		"_lstCDCount",
		"_lstHDCount",
		"_rowKVMCDSupport",
		"_rowKVMFDSupport",
		"_rowKVMHDSupport",
		"_lstKVMFDCount",
		"_lstKVMCDCount",
		"_lstKVMHDCount",
		"_rowSDSupport",
		"_chkSDSupport",
		"_rowVirtualDevices",
		"_chkVirtualDevices",
		"_rowBootOnce",
		"_chkBootOnce",
		"_rowMediaEncrypt",
		"_chkMediaEncrypt",
		"_btnSave",
		"_btnReset"]);

	if (top.user.isAdmin()) {
		btnSave.onclick = validateVMediaCfg;
		btnReset.onclick = reloadVMediaCfg;
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
	var index;				//loop counter
	var optind = 0;			//Optional index needed for IE, starts with 0
	var kvmoptind = 0;			//Optional index needed for IE, starts with 0
	var devCount = 0;		//Used to hold the maximum instance count
	var startindex = 0;		//Used to hold the start index value

	SD_SERVER_SUPPORT = checkProjectCfg("SD_SERVER_SUPPORT");
	POWER_CONSUMPTION = checkProjectCfg("POWER_CONSUMPTION");
	DEDICATED_MEDIA_FOR_LMEDIA_RMEDIA = checkProjectCfg("DEDICATED_MEDIA_FOR_LMEDIA_RMEDIA");
	VMEDIA_ENABLE_BOOT_ONCE = checkProjectCfg("VMEDIA_ENABLE_BOOT_ONCE");
	KVM_DEVICE_COUNT = checkProjectCfg("VMEDIA_MAX_COUNT_FOR_KVM");
	SINGLE_PORT_APP = checkProjectCfg("SINGLE_PORT_APP");
	RUNTIME_SINGLEPORT = checkProjectCfg("RUNTIME_SINGLEPORT_SUPPORT");
	
	if (SD_SERVER_SUPPORT) {
		rowSDSupport.className = "visibleRow";
	}

	if (KVM_DEVICE_COUNT) {
		rowKVMCDSupport.className = "visibleRow";
		rowKVMFDSupport.className = "visibleRow";
		rowKVMHDSupport.className = "visibleRow";
	}

	if (POWER_CONSUMPTION) {
		rowVirtualDevices.className = "visibleRow";
	}

	if (VMEDIA_ENABLE_BOOT_ONCE) {
		rowBootOnce.className = "visibleRow";
	}

	
	
	if (DEDICATED_MEDIA_FOR_LMEDIA_RMEDIA) {
		startindex = 1;
		devCount = 2;
	} else {
		startindex = 0;
		devCount = 4;
	}
	for (index = startindex; index <= devCount; index++,optind++) {
		lstFDCount.add(new Option(index,index), isIE?optind:null);
		lstCDCount.add(new Option(index,index), isIE?optind:null);
		lstHDCount.add(new Option(index,index), isIE?optind:null);
	}
	if (KVM_DEVICE_COUNT) {
		for (index = startindex; index <= devCount; index++,optind++) {
			lstKVMFDCount.add(new Option(index,index), isIE?kvmoptind:null);
			lstKVMCDCount.add(new Option(index,index), isIE?kvmoptind:null);
			lstKVMHDCount.add(new Option(index,index), isIE?kvmoptind:null);
		}
	}
	getVMediaCfg();
}

/*
 * It will invoke the RPC method to get the virtual media configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getVMediaCfg() {
	xmit.get({url:"/rpc/getvmediacfg.asp", onrcv:getVMediaCfgRes, status:""});
}

/*
 * This is the response function for getVMediaCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getVMediaCfgRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_VMEDIA_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		VMEDIACFG_DATA = WEBVAR_JSONVAR_GETVMEDIACFG.WEBVAR_STRUCTNAME_GETVMEDIACFG[0];
		reloadVMediaCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadVMediaCfg() {
	lstFDCount.value = VMEDIACFG_DATA.V_NUM_FD;
	lstCDCount.value = VMEDIACFG_DATA.V_NUM_CD;
	lstHDCount.value = VMEDIACFG_DATA.V_NUM_HD;
	if (KVM_DEVICE_COUNT) {
		lstKVMFDCount.value = VMEDIACFG_DATA.V_KVM_NUM_FD;
		lstKVMCDCount.value = VMEDIACFG_DATA.V_KVM_NUM_CD;
		lstKVMHDCount.value = VMEDIACFG_DATA.V_KVM_NUM_HD;
	}

	if (SD_SERVER_SUPPORT) {
		chkSDSupport.checked = (VMEDIACFG_DATA.SD_MEDIA == 1) ? true : false;
	}
	
	if (POWER_CONSUMPTION) {
		chkVirtualDevices.checked = (VMEDIACFG_DATA.V_MEDIA_STATUS == 1) ? 
			true : false;
	}

	if (VMEDIA_ENABLE_BOOT_ONCE) {
		chkBootOnce.checked = (VMEDIACFG_DATA.V_STR_BOOT_ONCE == 1) ? 
			true : false;
	}
	//if (!SINGLE_PORT_APP || (SINGLE_PORT_APP && RUNTIME_SINGLEPORT)) {
	//if(VMEDIACFG_DATA.V_SINGLE_PORT_ENABLED== false)
		//rowMediaEncrypt.className = "visibleRow";
		if (VMEDIACFG_DATA.V_SINGLE_PORT_ENABLED==false) {
			rowMediaEncrypt.className = "visibleRow";
			chkMediaEncrypt.checked = (VMEDIACFG_DATA.V_STR_SECURE_CHANNEL == 1) ? 
					true : false;
		}	
	//}
	
}

/*
 * It will validate the data of all user controls before saving it.
 * Here it compares with old data, if any difference then send data to save.
 */
function validateVMediaCfg() {
	var errstr;		//Error string

	if (KVM_DEVICE_COUNT) {

		if((lstKVMFDCount.value >  lstFDCount.value ) ||
			(lstKVMCDCount.value > lstCDCount.value) ||
			(lstKVMHDCount.value > lstHDCount.value)){
			errstr = eLang.getString("common", "STR_CONF_KVM_VMEDIA_SETVAL");
			alert(errstr);
			return;
		}
		if ((VMEDIACFG_DATA.V_KVM_NUM_FD != lstKVMFDCount.value) ||
		(VMEDIACFG_DATA.V_KVM_NUM_CD != lstKVMCDCount.value) ||
		(VMEDIACFG_DATA.V_KVM_NUM_HD != lstKVMHDCount.value)) {
			setVMediaCfg();
			return;
		}
	}

	if ((VMEDIACFG_DATA.V_NUM_FD != lstFDCount.value) ||
		(VMEDIACFG_DATA.V_NUM_CD != lstCDCount.value) ||
		(VMEDIACFG_DATA.V_NUM_HD != lstHDCount.value)) {
		setVMediaCfg();
		return;
	}
	if (VMEDIACFG_DATA.V_SINGLE_PORT_ENABLED==false) {
		if (VMEDIACFG_DATA.V_STR_SECURE_CHANNEL != chkMediaEncrypt.checked) {
			setVMediaCfg();
			return;
		}
	}
	
	if (SD_SERVER_SUPPORT) {
		if (VMEDIACFG_DATA.SD_MEDIA != chkSDSupport.checked) {
			setVMediaCfg();
			return;
		}
	}

	if (POWER_CONSUMPTION) {
		if (VMEDIACFG_DATA.V_MEDIA_STATUS != chkVirtualDevices.checked) {
			setVMediaCfg();
			return;
		}
	}

	if (VMEDIA_ENABLE_BOOT_ONCE) {
		if (VMEDIACFG_DATA.V_STR_BOOT_ONCE != chkBootOnce.checked) {
			setVMediaCfg();
			return;
		}
	}
}

/*
 * It will invoke the RPC method to set the virtual media configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setVMediaCfg() {
	var req;			//xmit object to send RPC request with parameters
	if (confirm(eLang.getString("common", "STR_CONF_VMEDIA_CONFIRM"))) {
		req = new xmit.getset({url:"/rpc/setvmediacfg.asp", 
			onrcv:setVMediaCfgRes, status:""});
		req.add("V_NUM_FD", lstFDCount.value);
		req.add("V_NUM_CD", lstCDCount.value);
		req.add("V_NUM_HD", lstHDCount.value);

		if (KVM_DEVICE_COUNT) {
			req.add("V_KVM_NUM_FD", lstKVMFDCount.value);
			req.add("V_KVM_NUM_CD", lstKVMCDCount.value);
			req.add("V_KVM_NUM_HD", lstKVMHDCount.value);
		}
		if (SD_SERVER_SUPPORT) {
			req.add("SD_MEDIA", chkSDSupport.checked ? 1 : 0);
		}
		if (POWER_CONSUMPTION) {
			req.add("V_MEDIA_STATUS", chkVirtualDevices.checked ? 1 : 0);
		}
		if (VMEDIA_ENABLE_BOOT_ONCE) {
			req.add("V_MEDIA_BOOTONCE", chkBootOnce.checked ? 1 : 0);
		}		
		req.add("MEDIAENCRYPTION", chkMediaEncrypt.checked ? 1 : 0);
		
		req.send();
		delete req;
	}
}

/*
 * This is the response function for setVMediaCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setVMediaCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x83:
			alert(eLang.getString("common", "STR_CONF_KVM_VMEDIA_IN_PROGRESS"));
			break;
		default:
			errstr = eLang.getString("common", "STR_CONF_VMEDIA_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
			break;
		}
	}else {
		alert (eLang.getString("common", "STR_CONF_VMEDIA_SAVE_SUCCESS"));
		getVMediaCfg();
	}
}