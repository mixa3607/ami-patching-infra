//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2014-2017        **;
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

// File Name  : configure_license_imp.js
// Brief      : This page is used to display all the available features and 
//				it's license validity in the list grid formate. This will also supports the
//				upload license key feature.
// Author Name: Sakthivel. R

var LICENSE_INFO;		//It holds the RPC data for All Feature License informations
var tblJSON;			//Object to hold image information in JSON structure
var tblLicense;			//List grid object to hold license information
var CONST_MIN_LICENSE_KEY = 0x1A;	//Integer to hold the min length of license key
var CONST_NO_LICENSE = 0x0;		//Constant to hold the no license
var CONST_FULL_LICENSE = 0xFF;	//Constant to hold the full license validity

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() { // TODO: add page initialization code
	exposeElms(["_btnUploadLicenseKey",
		"_lblHeader",
		"_lgdLicense"]);

	if (top.user.isAdmin()) {
		btnUploadLicenseKey.onclick = uploadLicenseCfg;
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will invoke loadCustomPageElements method to load list grid.
 * Also it will invoke the RPC method to get the data for the page.
 */
function _begin() {
	getLicenseInfo();
	loadCustomPageElements();
}

/*
 * This function is used to load the list grid and its header information.
 */
function loadCustomPageElements() {
	tblLicense = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	//Append the list grid to the body division
	lgdLicense.appendChild(tblLicense.table);

	tblJSON = {cols:[
		{text : eLang.getString("common", "STR_HASH"),
			fieldType:2, w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_LICENSE_CFG_FEATURE_NAME"),
			w:"40%", textAlign:"center"},
		{text:eLang.getString("common", "STR_LICENSE_CFG_FEATURE_VALIDITY"),
			w:"40%", textAlign:"center"}
		]};
	tblLicense.loadFromJson(tblJSON);

	if (!top.user.isAdmin()) {
		btnUploadLicenseKey.disabled = true;
	}
}

/*
 * It will invoke the RPC method to get the license information.
 * Once it get data from RPC, response function will be called automatically.
 */
function getLicenseInfo() {
	btnUploadLicenseKey.disabled = false;
	xmit.get({url:"/rpc/getlicenseinfo.asp", onrcv:getLicenseInfoRes, status:""});
}

/*
 * This is the response function for getLicenseInfo RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getLicenseInfoRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_LICENSE_CFG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		LICENSE_INFO = WEBVAR_JSONVAR_GETLICENSECFG.WEBVAR_STRUCTNAME_GETLICENSECFG;
		
		var strLicense = ""; //String to hold the Un-licensed services
		var index;
		top.fnCookie.erase("License");
		for (index = 0; index < LICENSE_INFO.length; index++) {
			if ((LICENSE_INFO[index].SERVICE_NAME != "") && 
				(LICENSE_INFO[index].VALIDITY == 0)) {
				strLicense += LICENSE_INFO[index].SERVICE_NAME + ",";
			}
		}
		top.document.cookie = "License = '" + strLicense + "' ;path=/";
		
		loadLicenseInfo();
		licenseStatus();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function loadLicenseInfo() {
	var index;					//loop counter
	var rowJSON = [];			//Object to holds the array of rows to load list grid
	var license_count = 0;		//Integer to hold the number of licensed feature
	var validity = "";			//String used to display the validity

	tblLicense.clear();
	for (index = 0; index < LICENSE_INFO.length; index++) {
		if (LICENSE_INFO[index].VALIDITY == CONST_NO_LICENSE) {
			validity = eLang.getString("common", "STR_LICENSE_CFG_NO_LICENSE");
		} else if (LICENSE_INFO[index].VALIDITY == CONST_FULL_LICENSE) {
			validity = eLang.getString("common", "STR_LICENSE_CFG_LIFETIME");
			license_count++;
		} else {
			validity = LICENSE_INFO[index].VALIDITY + eLang.getString("common", 
			"STR_EMPTY") + eLang.getString("common", "STR_LICENSE_CFG_DAYS");
			license_count++;
		}

		try {
			rowJSON.push({cells:[
				{text:(index + 1), value:(index + 1)},
				{text:LICENSE_INFO[index].SERVICE_NAME, 
					value:LICENSE_INFO[index].SERVICE_NAME},
				{text:validity, value:validity}
			]});
		} catch (e) {
			alert(e);
		}
	}
	tblJSON.rows = rowJSON;
	tblLicense.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_LICENSE_CFG_CNT") + "</strong>" + 
		license_count + eLang.getString("common", "STR_BLANK");
}

/*
 * This will draw the UI controls for Upload License Key form.
 */
function uploadLicenseCfg() {
	var frm = new form("uploadLicenseFrm", "POST", "javascript://", "general");

	txtLicenseKey = frm.addTextField(eLang.getString("common",
		"STR_LICENSE_CFG_KEY"), "_txtLicenseKey", "",
		"", "bigclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton("btnUpload", eLang.getString("common",
		"STR_UPLOAD"), validateLicenseKeyCfg));
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_LICENSE_CFG_ADV_TITLE"),
		frm.display(), btnAry);
	txtLicenseKey.focus();
	wnd.onclose = function() {
		getLicenseInfo();
	};

	if (!top.user.isAdmin()) {
		disableActions({id:["_btnUploadLicenseKey", "_btnCancel"]});
	}
}

/*
 * It will validate all UI user controls data before saving it.
 */
function validateLicenseKeyCfg() {
	var errstr;
	var str = eVal.trimdash(eVal.trim(txtLicenseKey.value));

	//empty string would be blocked by alphanum() so no need to check
	if (!eVal.alphanum(str) || 
		str.length < CONST_MIN_LICENSE_KEY) {
		errstr = eLang.getString("common", "STR_LICENSE_CFG_INVALID_KEY");
		errstr += eLang.getString("common", "STR_HELP_INFO");
		alert(errstr);
		return;
	}
	setLicenseKeyCfg();
}

/*
 * It will invoke the RPC method to set the License key configuration.
 * Once it get the response data from RPC, onrcv method will be called 
 * automatically. 
 */
function setLicenseKeyCfg() {
	if(confirm(eLang.getString("common", "STR_LICENSE_CONFIRM_UPDATE"))) {
		var req;	//xmit object to send RPC request with parameters
		req = new xmit.getset({url:"/rpc/setlicensekeycfg.asp", onrcv:setLicenseKeyCfgRes,
			status:""});
		req.add("LICENSE_KEY", txtLicenseKey.value);
		req.send();
		delete req;
	}
}

/*
 * This is the response function for setLicenseKeyCfg RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library.
 */
function setLicenseKeyCfgRes(arg) {
	var errstr;		//Error string
	switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
	case 0x0:
		alert(eLang.getString("common", "STR_LICENSE_CFG_SUCCESS"));
		top.gConsoleOpen = false;
		top.logoutWeb();
		break;
	case 0x80:
	case 0x85:
		alert(eLang.getString("common", "STR_LICENSE_CFG_INVALID_KEY"));
		break;
	default:
		errstr = eLang.getString("common", "STR_LICENSE_CFG_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

/*
 * Used to close the form which is used to configure the Add License 
 * Key settings. 
 */
function closeForm() {
	wnd.close();
}

/*
 * It will load response data from global variable to respective controls in UI.
 * Based on the global variable response, list grid rows will be used to 
 * grayed-out or enabled.
 */
function licenseStatus() {
	var i; // loop counter
	for (i = 0; i < LICENSE_INFO.length; i++) {
		try {
			tblLicense.container.rows[i+1].setEnabled((LICENSE_INFO[i].VALIDITY 
				== CONST_NO_LICENSE) ? false : true); // This will grayed out the rows, which has no license
		} catch (e) {
			continue;
		}
	}
}
