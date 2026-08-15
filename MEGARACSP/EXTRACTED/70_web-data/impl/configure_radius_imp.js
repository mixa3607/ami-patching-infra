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

var EXTENDED_PRIV = false;		//It used to hold the Extended privilege feature support

function doInit() {
	exposeElms(["_lblRADIUSDesc",
		"_enableRADIUS",
		"_port",
		"_ipaddr",
		"_secret",
		"_rowExtendedPriv",
		"_chkKVM",
		"_chkVMedia",
		"_saveBtn",
		"_resetBtn",
		"_btnAdvSettings"]);

	if(top.user.isAdmin()) {
		enableRADIUS.onclick = doRADIUScfg;
		saveBtn.onclick = isRADIUSCfgChange;
		resetBtn.onclick = reloadRADIUSCfg;
		btnAdvSettings.onclick = doAdvancedRADIUSPrivCfg;
	} else {
		disableActions();
	}
	_begin();
}

function _begin() {
	EXTENDED_PRIV = checkProjectCfg("EXTENDED_PRIV");
	if(EXTENDED_PRIV) {
		rowExtendedPriv.className = "visibleRow";
	}
	getRADIUSCfg();
}

function getRADIUSCfg() {
	xmit.get({url:"/rpc/getradiuscfg.asp",onrcv:getRADIUSCfgRes, status:""});
	xmit.get({url:"/rpc/getradiuspriv.asp",onrcv:getRADIUSPrivCfgRes, status:""});
	if (top.user.isAdmin()) {
		EnableButtons();
	}
}

function getRADIUSCfgRes (arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common","STR_CONF_RADIUS_GETVAL");
		errstr +=(eLang.getString("common","STR_IPMI_ERROR") + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	} else {
		RADIUSCFG_DATA = WEBVAR_JSONVAR_HL_GETRADIUSCFG.WEBVAR_STRUCTNAME_HL_GETRADIUSCFG[0];
		lblRADIUSDesc.innerHTML = eLang.getString("common", 
				"STR_CONF_RADIUS_DESC_" + RADIUSCFG_DATA.ENABLE);
		btnAdvSettings.disabled = RADIUSCFG_DATA.ENABLE ? false : true;
		reloadRADIUSCfg();
	}
}

function getRADIUSPrivCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString('common','STR_CONF_RADIUS_GETVAL');
		errstr +=(eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	} else {
		RADIUSPRIVCFG_DATA = WEBVAR_JSONVAR_HL_GETRADIUSPRIVCFG.WEBVAR_STRUCTNAME_HL_GETRADIUSPRIVCFG;
	}
}

function fillRADIUSCfg() {
	port.value = RADIUSCFG_DATA.PORTNUM;
	ipaddr.value = RADIUSCFG_DATA.IP;
	secret.value = "";
	if (EXTENDED_PRIV) {
		chkKVM.checked = (RADIUSCFG_DATA.KVMPRIV) ? true : false;
		chkVMedia.checked = (RADIUSCFG_DATA.VMEDIAPRIV) ? true : false;
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadRADIUSCfg() {
	enableRADIUS.checked = (RADIUSCFG_DATA.ENABLE) ? true : false;
	doRADIUScfg();
	if (enableRADIUS.checked) {
		fillRADIUSCfg();
	}
}

/*
 * This function will compare the configuration values with the data in 
 * the controls.
 */
function isRADIUSCfgChange()
{
	if ((RADIUSCFG_DATA.ENABLE == enableRADIUS.checked) && 
		(RADIUSCFG_DATA.PORTNUM == port.value) && 
		(RADIUSCFG_DATA.IP == ipaddr.value) && 
		("" == secret.value) &&
		(RADIUSCFG_DATA.KVMPRIV == chkKVM.checked) &&
		(RADIUSCFG_DATA.VMEDIAPRIV == chkVMedia.checked)) {
		return;
	}
	validateRADIUSCfg()
}

/*
 * This will validate all the UI controls value of RADIUS configuration before 
 * saving it.
 */
function validateRADIUSCfg() {
	if (enableRADIUS.checked) {
		if (!eVal.port(port.value)) {
			alert(eLang.getString("common", "STR_INVALID_PORT"));
			port.focus();
			return;
		}
		if ((!eVal.ip(ipaddr.value)) && 
			(!eVal.ipv6(ipaddr.value, false, false)) &&
			(!eVal.domainname(ipaddr.value,true))) {
			alert(eLang.getString("common", "STR_INVALID_SERVERADDR") +
				eLang.getString("common", "STR_HELP_INFO"));
			ipaddr.focus();
			return;
		}

		if (!eVal.password(secret.value, 4, 31)) {
			alert(eLang.getString("err", 0x03) + 
				eLang.getString("common", "STR_HELP_INFO"));
			secret.focus();
			return;
		}
	}
	setRADIUSCfg();
}

/*
 * It will invoke the RPC method to set the RADIUS configuration.
 * Once it get response from RPC, on receive method will be called 
 * automatically.
 */
function setRADIUSCfg() {
	if (top.user.isAdmin()) {
		var req = new xmit.getset({url:"/rpc/setradiuscfg.asp", onrcv:setRADIUSCfgRes});
		req.add("ENABLE", enableRADIUS.checked?1:0);
		req.add("PORTNUM", port.value);
		req.add("IP", ipaddr.value);
		req.add("SECRET", secret.value);
		if (EXTENDED_PRIV) {
			req.add("KVMPRIV", chkKVM.checked ? 1 : 0);
			req.add("VMEDIAPRIV", chkVMedia.checked ? 1 : 0);
		}
		req.send();
		delete req;
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function EnableButtons() {
	saveBtn.disabled = false;
	resetBtn.disabled = false;
	btnAdvSettings.disabled = false;
	enableRADIUS.disabled = false;
}

function setRADIUSCfgRes (arg) {
	switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0xDF: case 0xE2: 
		case 0xE4: case 0x93:
			errstr = eLang.getString("common", "STR_INVALID_SERVERADDR");
			errstr += eLang.getString("common", "STR_HELP_INFO");
			alert(errstr);
		break;
		case top.CONSTANTS.SUCCESS:
			alert(eLang.getString("common","STR_CONF_RADIUS_SAVE_SUCCESS"));
			_begin();
		break;
		default:
			errstr =  eLang.getString("common","STR_CONF_RADIUS_SETVAL");
				errstr += (eLang.getString("common","STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
	}
}

function doRADIUScfg() {
	if (top.user.isAdmin()) {
		bopt = !enableRADIUS.checked;
		port.disabled = bopt;
		ipaddr.disabled = bopt;
		secret.disabled = bopt;
		if (EXTENDED_PRIV) {
			chkKVM.disabled = bopt;
			chkVMedia.disabled = bopt;
		}
		if (!bopt) {
			port.focus();
		} else {
			fillRADIUSCfg();
		}
	}
}

function doAdvancedRADIUSPrivCfg() {
	if(enableRADIUS.checked) {
		loadadvanceRADIUSPrivCfg();
		filladvancedRADIUSPrivCfg();
	} else {
		alert(eLang.getString("common","STR_CONF_RADIUS_NOT_ENABLED"));
	}
}

function loadadvanceRADIUSPrivCfg() {
	var frm = new form("advancedRADIUSPrivFrm", "POST", "javascript://", "general");

	txtAdmin = frm.addTextField(eLang.getString("common", 
		"STR_PRIVILEGE_ADMIN"), "_txtAdmin", "", {"maxLength":127}, "classicTxtBox");

	txtOperator = frm.addTextField(eLang.getString("common", 
		"STR_PRIVILEGE_OPERATOR"),"_txtOperator", "", {"maxLength":127}, "classicTxtBox");

	txtUser = frm.addTextField(eLang.getString("common", 
		"STR_PRIVILEGE_USER"), "_txtUser", "", {"maxLength":127}, "classicTxtBox");

	txtOEM = frm.addTextField(eLang.getString("common",
		"STR_PRIVILEGE_OEM"),"_txtOEM", "", {"maxLength":127}, "classicTxtBox");

	txtNoaccess = frm.addTextField(eLang.getString("common", 
		"STR_PRIVILEGE_NOACCESS"),"_txtNoaccess", "", {"maxLength":127}, "classicTxtBox");
	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common",
		"STR_SAVE"), setRadiusPrivCfg));
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_CONF_RADIUS_TITLE"),
	frm.display(), btnAry);
	wnd.onclose = getRADIUSCfg;
}

function setRadiusPrivCfg() {
	var vendor="";
	if ((!eVal.specialCharacter(txtAdmin.value, "#")) || (!eVal.specialCharacter(txtOperator.value, "#")) ||
		(!eVal.specialCharacter(txtUser.value, "#")) || (!eVal.specialCharacter(txtOEM.value, "#")) ||
		(!eVal.specialCharacter(txtNoaccess.value, "#"))) {
		alert(eLang.getString("common", "STR_PRIVILEGE_ERR_1") + 
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}
	if ((txtAdmin.value == RADIUSPRIVCFG_DATA[0].VENDORDATA) &&
	(txtOperator.value == RADIUSPRIVCFG_DATA[1].VENDORDATA) &&
	(txtUser.value == RADIUSPRIVCFG_DATA[2].VENDORDATA) &&
	(txtOEM.value == RADIUSPRIVCFG_DATA[3].VENDORDATA) &&
	(txtNoaccess.value == RADIUSPRIVCFG_DATA[4].VENDORDATA)) {
		return;
	}
	vendor=((txtAdmin.value!="" )? txtAdmin.value :" ")+",";
	vendor+=((txtOperator.value!="")? txtOperator.value :" ")+",";
	vendor+=((txtUser.value!="")? txtUser.value :" ")+",";
	vendor+=((txtOEM.value!="")? txtOEM.value :" ")+",";
	vendor+=((txtNoaccess.value!="")? txtNoaccess.value :" ")+",";

	if (top.user.isAdmin()) {
		var req = new xmit.getset({url:"/rpc/setradiuspriv.asp", 
				onrcv:setRadiusPrivCfgRes, status:""});
		req.add("DATA",vendor);
		req.send();
		delete req;
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setRadiusPrivCfgRes (arg) {
	if(arg.HAPI_STATUS != 0) {
		errstr =  eLang.getString('common','STR_CONF_RADIUS_SETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert(eLang.getString('common','STR_CONF_RADIUS_PRIV_SAVE_SUCCESS'));
		closeForm();
	}
}

function filladvancedRADIUSPrivCfg() {
	txtAdmin.value = RADIUSPRIVCFG_DATA[0].VENDORDATA;
	txtOperator.value = RADIUSPRIVCFG_DATA[1].VENDORDATA;
	txtUser.value = RADIUSPRIVCFG_DATA[2].VENDORDATA;
	txtOEM.value = RADIUSPRIVCFG_DATA[3].VENDORDATA;
	txtNoaccess.value = RADIUSPRIVCFG_DATA[4].VENDORDATA;
}

function closeForm() {
	wnd.close();
}

