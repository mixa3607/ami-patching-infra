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

var roleGroupTable;
var tblJSON;
var RG_DATA;
var AD_CFG;
var EXTENDED_PRIV = false;		//It used to hold the Extended privilege feature support

function doInit()
{
	exposeElms(["_adDesc",
	 			"_advSettingsBtn",
	 			"_roleGroupHolder",
	 			"_addRoleGroupBtn",
	 			"_modRoleGroupBtn",
	 			"_delRoleGroupBtn",
	 			"_lblHeader"]);

	if(top.user.isAdmin())
	{
		addRoleGroupBtn.onclick = doAddRoleGroup;
		modRoleGroupBtn.onclick = doModifyRoleGroup;
		delRoleGroupBtn.onclick = doDeleteRoleGroup;
	}
	else
	{
		disableActions({id: ["_advSettingsBtn"]});
	}
	advSettingsBtn.onclick = doAdvancedAD;
	_begin();
}

function _begin()
{
	EXTENDED_PRIV = checkProjectCfg("EXTENDED_PRIV");
	getADCfg();
	loadCustomPageElements();
}

function getADCfg()
{
	advSettingsBtn.disabled = false;
	xmit.get({url:"/rpc/getactivedircfg.asp",onrcv:getADCfgRes,status:""});
	disableButtons();
	xmit.get({url:"/rpc/getallrolegroupcfg.asp",onrcv:getAllRoleGroupInfoRes, status:""});
}

function getADCfgRes(arg)
{
	if (arg.HAPI_STATUS != 0)
	{
		errstr =  eLang.getString("common","STR_CONF_AD_GETINFO");
		errstr += (eLang.getString("common","STR_IPMI_ERROR") + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		AD_CFG = WEBVAR_JSONVAR_GETADCONFIG.WEBVAR_STRUCTNAME_GETADCONFIG[0];
		if (AD_CFG.AD_ENABLE)
			adDesc.innerHTML = eLang.getString("common","STR_CONF_AD_ADENABLE_DESC");
		else
			adDesc.innerHTML = eLang.getString("common","STR_CONF_AD_ADDISABLE_DESC");
	}
}

function loadCustomPageElements()
{
	roleGroupTable = listgrid({
		w				: "100%",
		doAllowNoSelect : false
	});
	roleGroupHolder.appendChild(roleGroupTable.table);

	try
	{
		tblJSON = {cols:[
			{text:eLang.getString("common","STR_CONF_AD_HEAD1"), fieldName:"rg_id", fieldType:2, w:"10%", textAlign:"center"},
			{text:eLang.getString("common","STR_CONF_AD_HEAD2"), fieldName:"rg_name", w:"25%", textAlign:"center"},
			{text:eLang.getString("common","STR_CONF_AD_HEAD3"), fieldName:"rg_domain", w:"35%", textAlign:"center"} ,
			{text:eLang.getString("common","STR_CONF_AD_HEAD4"), fieldName:"rg_priv", w:"30%", textAlign:"center"}
			]};

		roleGroupTable.loadFromJson(tblJSON);
	}
	catch(e)
	{
		alert(e);
	}

	roleGroupTable.ontableselect = function ()
	{
		disableButtons();
		if(top.user.isAdmin() && (AD_CFG.AD_ENABLE))
		{
			if(this.selected.length)
			{
				selectedid = parseInt(roleGroupTable.getRow(roleGroupTable.selected[0]).cells[0].innerHTML);
				if(RG_DATA[selectedid-1].ROLEGROUP_NAME == "")
				{
					addRoleGroupBtn.disabled = false;
				}
				else
				{
					modRoleGroupBtn.disabled = false;
					delRoleGroupBtn.disabled = false;
				}
			}
		}
	}
	roleGroupTable.ondblclick = function()
	{
		if(top.user.isAdmin() && (AD_CFG.AD_ENABLE))
		{
			selectedid = parseInt(roleGroupTable.getRow(roleGroupTable.selected[0]).cells[0].innerHTML);
			if (RG_DATA[selectedid-1].ROLEGROUP_NAME == "")
				doAddRoleGroup();
			else
				doModifyRoleGroup();
		}
	}
}

function disableButtons()
{
	addRoleGroupBtn.disabled = true;
	modRoleGroupBtn.disabled = true;
	delRoleGroupBtn.disabled = true;
}

function getAllRoleGroupInfoRes(arg)
{
	var JSONRows = new Array();
	if (arg.HAPI_STATUS != 0)
	{
		errstr =  eLang.getString("common","STR_CONF_AD_RG_GETINFO");
		errstr += (eLang.getString("common","STR_IPMI_ERROR") + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		roleGroupTable.clear();
		RG_DATA = WEBVAR_JSONVAR_GETALLROLEGROUPCFG.WEBVAR_STRUCTNAME_GETALLROLEGROUPCFG;

		var tRoleGroupCnt = 0;
		for (i=0;i<RG_DATA.length;i++)
		{
			// Use ~ char to indicate free slot so it will sort alphabetically
			rgnametodisplay = (RG_DATA[i].ROLEGROUP_NAME == "")?"~":RG_DATA[i].ROLEGROUP_NAME;
			rgdomaintodisplay = (RG_DATA[i].ROLEGROUP_DOMAIN == "")?"~":RG_DATA[i].ROLEGROUP_DOMAIN;
			rgprivtodisplay = (RG_DATA[i].ROLEGROUP_PRIVILEGE)?IPMIPrivileges[RG_DATA[i].ROLEGROUP_PRIVILEGE]:"~";
			if(rgnametodisplay!="~")
				tRoleGroupCnt++;

			try
			{
				JSONRows.push({cells:[
					{text:RG_DATA[i].ROLEGROUP_ID, value:RG_DATA[i].ROLEGROUP_ID},
					{text:rgnametodisplay, value:rgnametodisplay},
					{text:rgdomaintodisplay, value:rgdomaintodisplay},
					{text:rgprivtodisplay, value:rgprivtodisplay}
				]});
			}
			catch(e)
			{
				alert(e);
			}
		}

		tblJSON.rows = JSONRows;
		roleGroupTable.loadFromJson(tblJSON);
		lblHeader.innerHTML = eLang.getString("common","STR_CONF_AD_RG_CNT") + tRoleGroupCnt + eLang.getString("common","STR_BLANK");
	}
}

function doAdvancedAD()
{
	frmAdvancedAD();
	loadAdvancedADCfg();
}

function frmAdvancedAD()
{
	var frm = new form("advancedADFrm", "POST", "javascript://", "general");
	settings = frm.addCheckBox(eLang.getString("common",
		"STR_CONF_AD_ADV_ENABLEAD"), "adAuth", {"enable":"Enable"}, false,
		["enable"]);
	chkEnableAD = settings.enable;

	txtUsername = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_SECRETNAME"), "_txtUsername", "", {"maxLength":64},
		"bigclassicTxtBox");

	txtPassword = frm.addPasswordField(eLang.getString("common",
		"STR_CONF_AD_ADV_SECRETPASSWORD"), "_txtPassword", "", {"maxLength":127},
		"bigclassicTxtBox");

	txtDomainName = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_DOMAINNAME"), "_txtDomainName", "", {"maxLength":255},
		"bigclassicTxtBox");

	/*txtTimeOut = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_TIMEOUT"), "_txtTimeOut", "", {"maxLength":3},
		"smallclassicTxtBox");*/

	txtDomainAddress1 = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_DOMAINSRVR1"), "_txtDomainAddress1", "",
		{"maxLength":40}, "bigclassicTxtBox");

	txtDomainAddress2 = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_DOMAINSRVR2"), "_txtDomainAddress2", "",
		{"maxLength":40}, "bigclassicTxtBox");

	txtDomainAddress3 = frm.addTextField(eLang.getString("common",
		"STR_CONF_AD_ADV_DOMAINSRVR3"), "_txtDomainAddress3", "",
		{"maxLength":40}, "bigclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common",
		"STR_CONF_AD_ADV_SAVE"), isADCfgChange));
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	chkEnableAD.onclick = enableADOptions;
	wnd = MessageBox(eLang.getString("common", "STR_CONF_AD_ADV_TITLE"),
		frm.display(), btnAry);
	wnd.onclose = getADCfg;
	chkEnableAD.focus();
	if(!top.user.isAdmin()) {
		disableActions({id: ["_advSettingsBtn", "_btnCancel"]});
	}
}

function getAdvancedADCfg()
{
	xmit.get({url:"/rpc/getactivedircfg.asp",onrcv:getAdvancedADCfgRes,status:""});
}

function loadAdvancedADCfg()
{
	chkEnableAD.checked = AD_CFG.AD_ENABLE ? true : false;
	enableADOptions();
	txtUsername.value = AD_CFG.AD_SECRETUSER;
	txtPassword.value = "";
	txtDomainName.value = AD_CFG.AD_DOMAINNAME;
	//txtTimeOut.value = AD_CFG.AD_TIMEOUT;
	txtDomainAddress1.value = AD_CFG.AD_DOMAINSRVR1;
	txtDomainAddress2.value = AD_CFG.AD_DOMAINSRVR2;
	txtDomainAddress3.value = AD_CFG.AD_DOMAINSRVR3;
}

function enableADOptions()
{
	var opt;
	if (top.user.isAdmin()) {
		opt = !chkEnableAD.checked;
		txtUsername.disabled = opt;
		txtPassword.disabled = opt;
		txtDomainName.disabled = opt;
		//txtTimeOut.disabled = opt;
		txtDomainAddress1.disabled = opt;
		txtDomainAddress2.disabled = opt;
		txtDomainAddress3.disabled = opt;
		if (!opt) {
			txtUsername.focus();
		}
	}
	if (!chkEnableAD.checked) {
		txtUsername.value = AD_CFG.AD_SECRETUSER;
		txtPassword.value = "";
		txtDomainName.value = AD_CFG.AD_DOMAINNAME;
		//txtTimeOut.value = AD_CFG.AD_TIMEOUT;
		txtDomainAddress1.value = AD_CFG.AD_DOMAINSRVR1;
		txtDomainAddress2.value = AD_CFG.AD_DOMAINSRVR2;
		txtDomainAddress3.value = AD_CFG.AD_DOMAINSRVR3;
	}
}

/*
 * This function is used to compare the configuration values with the data in 
 * the controls.
 */
function isADCfgChange()
{
	if ((AD_CFG.AD_ENABLE == chkEnableAD.checked) &&
		(AD_CFG.AD_SECRETUSER == txtUsername.value) &&
		("" == txtPassword.value) &&
		(AD_CFG.AD_DOMAINNAME == txtDomainName.value) && 
		//(AD_CFG.AD_TIMEOUT == txtTimeOut.value) && 
		(AD_CFG.AD_DOMAINSRVR1 == txtDomainAddress1.value) && 
		(AD_CFG.AD_DOMAINSRVR2 == txtDomainAddress2.value) && 
		(AD_CFG.AD_DOMAINSRVR3 == txtDomainAddress3.value)) {
		return;
	}
	validateADCfg();
}

function validateADCfg()
{
	if (chkEnableAD.checked) {
		if ((!eVal.isblank(eVal.trim(txtUsername.value))) &&
			(!eVal.isblank(eVal.trim(txtPassword.value)))) {
			if(!eVal.username(txtUsername.value, "AD", 1, 64)) {
				alert (eLang.getString("common", "STR_INVALID_USERNAME") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtUsername.focus();
				return false;
			}

			if (!eVal.password(txtPassword.value, 6, 127)) {
				alert (eLang.getString("common", "STR_INVALID_PASSWORD") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtPassword.focus();
				return false;
			}
		} else if (!(eVal.isblank(eVal.trim(txtUsername.value)) &&
			eVal.isblank(eVal.trim(txtPassword.value)))) {
			alert (eLang.getString("common", "STR_INVALID_UNAME_PWORD") +
				eLang.getString("common", "STR_HELP_INFO"));
			return false;
		}

		if(!eVal.domainname(txtDomainName.value,1)) {
			alert(eLang.getString("common",
				"STR_CONF_AD_ADV_INVALID_DOMAINNAME") +
				eLang.getString("common", "STR_HELP_INFO"));
			txtDomainName.focus();
			return false;
		}

		/*if (!eVal.isnumstr(txtTimeOut.value, 15, 300)) {
			alert(eLang.getString("common", "STR_INVALID_TIMEOUT") +
				eLang.getString("common", "STR_HELP_INFO"));
			txtTimeOut.focus();
			return false;
		}*/

		if ((eVal.isblank(txtDomainAddress1.value)) &&
			(eVal.isblank(txtDomainAddress2.value)) &&
			(eVal.isblank(txtDomainAddress3.value))) {
			alert(eLang.getString("common",
				"STR_CONF_AD_ADV_INVALID_DOMAINSRVR"));
			txtDomainAddress1.focus();
			return false;
		}

		if (!eVal.isblank(txtDomainAddress1.value)) {
			if (!eVal.ip(txtDomainAddress1.value) &&
				!eVal.ipv6(txtDomainAddress1.value)) {
				alert(eLang.getString("common",
					"STR_CONF_AD_ADV_INVALID_DOMAINSRVR1") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtDomainAddress1.focus();
				return false;
			}
		}

		if (!eVal.isblank(txtDomainAddress2.value)) {
			if ((!eVal.ip(txtDomainAddress2.value)) &&
				!eVal.ipv6(txtDomainAddress2.value)) {
				alert(eLang.getString("common",
					"STR_CONF_AD_ADV_INVALID_DOMAINSRVR2") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtDomainAddress2.focus();
				return false;
			}
		}

		if (!eVal.isblank(txtDomainAddress3.value)) {
			if ((!eVal.ip(txtDomainAddress3.value)) &&
				!eVal.ipv6(txtDomainAddress3.value)) {
				alert(eLang.getString("common",
					"STR_CONF_AD_ADV_INVALID_DOMAINSRVR3") +
					eLang.getString("common","STR_HELP_INFO"));
				txtDomainAddress3.focus();
				return false;
			}
		}

		if ((eVal.compareip(txtDomainAddress1.value, txtDomainAddress2.value)) ||
			(eVal.compareip(txtDomainAddress1.value, txtDomainAddress3.value)) ||
			(eVal.compareip(txtDomainAddress2.value, txtDomainAddress3.value))) {
			alert(eLang.getString("common", "STR_CONF_AD_ADV_DIFF_DOMAINSRVR"));
			return false;
		}

		if ((eVal.comparev6ip(txtDomainAddress1.value, txtDomainAddress2.value)) ||
			(eVal.comparev6ip(txtDomainAddress1.value, txtDomainAddress3.value)) ||
			(eVal.comparev6ip(txtDomainAddress2.value, txtDomainAddress3.value))) {
			alert(eLang.getString("common","STR_CONF_AD_ADV_DIFF_DOMAINSRVR"));
			return false;
		}
	}
	doSetADCfg();
	return true;
}

function doSetADCfg()
{
	var req;
	if (top.user.isAdmin()) {
		req = new xmit.getset({url:"/rpc/setactivedircfg.asp",
			onrcv:doSetADCfgRes, status:""});
		req.add("AD_ENABLE", chkEnableAD.checked ? 1 : 0);
		req.add("AD_SECRETUSER", txtUsername.value);
		req.add("AD_SECRETPASSS", txtPassword.value);
		req.add("AD_DOMAINNAME", txtDomainName.value);
		//req.add("AD_TIMEOUT", parseInt(txtTimeOut.value, 10));
		req.add("AD_DOMAINSRVR1", txtDomainAddress1.value);
		req.add("AD_DOMAINSRVR2", txtDomainAddress2.value);
		req.add("AD_DOMAINSRVR3", txtDomainAddress3.value);
		req.send();
		delete req;
	} else {
		alert(eLang.getString("common","STR_CONF_AD_ADV_ADMINPRIV"));
	}
}

function doSetADCfgRes(arg)
{
	if(arg.HAPI_STATUS)
	{
		errstr =  eLang.getString("common","STR_CONF_AD_SETINFO");
		errstr += (eLang.getString("common","STR_IPMI_ERROR") + GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_ADV_SAVE_SUCCESS"));
		closeForm();
	}
}

function doAddRoleGroup()
{
	if ((roleGroupTable.selected.length != 1) || (roleGroupTable.selected[0].cells[0] == undefined) || (roleGroupTable.selected[0].cells[0] == null))
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_ERR1"));
		disableButtons();
	}
	else
	{
		selectedrgid = parseInt(roleGroupTable.getRow(roleGroupTable.selected[0]).cells[0].innerHTML);
		selectedrgname = roleGroupTable.getRow(roleGroupTable.selected[0]).cells[1].innerHTML;
		selectedrgdomain = roleGroupTable.getRow(roleGroupTable.selected[0]).cells[2].innerHTML;
		selectedrgpriv = getbits(RG_DATA[selectedid-1].ROLEGROUP_PRIVILEGE,3,0);
		if ("" != RG_DATA[selectedid-1].ROLEGROUP_NAME)
		{
			if (confirm(eLang.getString("common","STR_CONF_AD_CONFIRM1")))
			{
				frmModifyRoleGroup({"rgindex":selectedrgid,
					"rgname":selectedrgname,
					"rgdomain":selectedrgdomain,
					"rgpriv":selectedrgpriv,
					"kvmpriv":RG_DATA[selectedid-1].ROLEGROUP_KVM,
					"vmediapriv":RG_DATA[selectedid-1].ROLEGROUP_VMEDIA});
			}
		}
		else
		{
			frmAddRoleGroup({"rgindex":selectedrgid});
		}
	}
}

function frmAddRoleGroup(arg)
{
	var frm = new form("addRoleGroup","POST","javascript://","general");
	rgName = frm.addTextField(eLang.getString("common","STR_CONF_AD_RG_NAME"),"_rgName","",{"maxLength":64},"classicTxtBox");
	rgDomain = frm.addTextField(eLang.getString("common","STR_CONF_AD_RG_DOMAIN"),"_rgDomain","",{"maxLength":255},"bigclassicTxtBox");

/*	var privVals = {4:"Administrator", 3:"Operator", 2:"User", 5:"OEM Proprietary", 0xf:"No Access"};
	rgPriv = frm.addSelectBox(eLang.getString("common","STR_CONF_AD_RG_PRIV"),"_rgPriv",privVals,"","","","classicTxtBox");
*/
	rgPrivHead = eLang.getString("common", "STR_CONF_AD_RG_PRIV");
	rgPrivRow = frm.addRow(rgPrivHead, bindUsersList("_rgPriv", 
		"classicTxtBox"));

	if (EXTENDED_PRIV) {
		chkExtendedPriv = frm.addCheckBox(eLang.getString("common", 
			"STR_EXTENDED_PRIV"), "_extendedPriv", {"_chkKVMPriv" : 
			eLang.getString("common", "STR_KVM_PRIV"), "_chkVMediaPriv" : 
			eLang.getString("common", "STR_VMEDIA_PRIV")}, false, [""]);

		chkKVMPriv = chkExtendedPriv._chkKVMPriv;
		chkVMediaPriv = chkExtendedPriv._chkVMediaPriv;
	}

	var btnAry = [];
	btnAry.push(createButton("addBtn",eLang.getString("common","STR_ADD"),addRoleGroup));
	btnAry.push(createButton("cancelBtn",eLang.getString("common","STR_CANCEL"),closeForm));
	rgindex = arg.rgindex;

	wnd = MessageBox(eLang.getString("common","STR_CONF_AD_RG_ADD_TITLE"),frm.display(),btnAry);
	wnd.onclose = getADCfg;
	rgPriv = $("_rgPriv");
	rgName.focus();
}

function addRoleGroup()
{
	if (validateRoleGroup())
	{
		var req = new xmit.getset({url:"/rpc/addrolegroup.asp",onrcv:addRoleGroupRes});
		req.add("ROLEGROUP_ID",rgindex);
		req.add("ROLEGROUP_NAME",rgName.value);
		req.add("ROLEGROUP_DOMAIN",rgDomain.value);
		req.add("ROLEGROUP_PRIV",rgPriv.value);
		if (EXTENDED_PRIV) {
			req.add("ROLEGROUP_KVM", chkKVMPriv.checked ? 1 : 0);
			req.add("ROLEGROUP_VMEDIA", chkVMediaPriv.checked ? 1 : 0);
		}
		req.send();
		delete req;
	}
}

function addRoleGroupRes(arg)
{
	if (arg.HAPI_STATUS != 0)
	{
		switch(GET_ERROR_CODE(arg.HAPI_STATUS))
		{
			case 0xcc:
				rErrStr = eLang.getString("common","STR_CONF_AD_RG_ERR3");
				alert(rErrStr);
			break;
			default:
				rErrStr = eLang.getString("common","STR_CONF_AD_RG_ADDINFO");
				rErrStr += (eLang.getString("common","STR_IPMI_ERROR")+GET_ERROR_CODE(arg.HAPI_STATUS));
				alert(rErrStr);
			break;
		}
	}
	else
	{
		alert(eLang.getString("common","STR_CONF_RG_SAVE_SUCCESS_1"));
	}
	closeForm();
}

function validateRoleGroup()
{
	if (!eVal.str(rgName.value))
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_INVALID_RGNAME")+eLang.getString("common","STR_HELP_INFO"));
		return false;
	}
	if (!eVal.domainname(rgDomain.value,1))
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_INVALID_RGDOMAIN")+eLang.getString("common","STR_HELP_INFO"));
		return false;
	}
	return true;
}

function doModifyRoleGroup()
{
	if ((roleGroupTable.selected.length != 1) || (roleGroupTable.selected[0].cells[0] == undefined) || (roleGroupTable.selected[0].cells[0] == null))
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_ERR1"));
		disableButtons();
		return;
	}
	else
	{
		selectedrgid = parseInt(roleGroupTable.getRow(roleGroupTable.selected[0]).cells[0].innerHTML);
		selectedrgname = roleGroupTable.getRow(roleGroupTable.selected[0]).cells[1].innerHTML;
		selectedrgdomain = roleGroupTable.getRow(roleGroupTable.selected[0]).cells[2].innerHTML;
		selectedrgpriv = getbits(RG_DATA[selectedid-1].ROLEGROUP_PRIVILEGE,3,0);

		if ("" == RG_DATA[selectedid-1].ROLEGROUP_NAME)
		{
			if (confirm(eLang.getString("common","STR_CONF_AD_CONFIRM2")))
			{
				frmAddRoleGroup({"rgindex":selectedrgid});
			}
		}
		else
		{
			frmModifyRoleGroup({"rgindex":selectedrgid,
				"rgname":selectedrgname,
				"rgdomain":selectedrgdomain,
				"rgpriv":selectedrgpriv,
				"kvmpriv":RG_DATA[selectedid-1].ROLEGROUP_KVM,
				"vmediapriv":RG_DATA[selectedid-1].ROLEGROUP_VMEDIA});
		}
	}
}

function frmModifyRoleGroup(arg)
{
	var frm = new form("modRoleGroup","POST","javascript://","general");
	rgName = frm.addTextField(eLang.getString("common","STR_CONF_AD_RG_NAME"),"_rgName",arg.rgname,{"maxLength":64},"classicTxtBox");
	rgDomain = frm.addTextField(eLang.getString("common","STR_CONF_AD_RG_DOMAIN"),"_rgDomain",arg.rgdomain,{"maxLength":255},"bigclassicTxtBox");

/*	var privVals = {4:"Administrator", 3:"Operator", 2:"User", 5:"OEM Proprietary", 0xf:"No Access"};
	rgPriv = frm.addSelectBox(eLang.getString("common","STR_CONF_AD_RG_PRIV"),"_rgPriv",privVals,arg.rgpriv,"","","classicTxtBox");
*/
	rgPrivHead = eLang.getString("common", "STR_CONF_AD_RG_PRIV");
	rgPrivRow = frm.addRow(rgPrivHead, bindUsersList("_rgPriv", 
		"classicTxtBox"));

	if (EXTENDED_PRIV) {
		chkExtendedPriv = frm.addCheckBox(eLang.getString("common", 
			"STR_EXTENDED_PRIV"), "_extendedPriv", {"_chkKVMPriv" : 
			eLang.getString("common", "STR_KVM_PRIV"), "_chkVMediaPriv" : 
			eLang.getString("common", "STR_VMEDIA_PRIV")}, false, [""]);

		chkKVMPriv = chkExtendedPriv._chkKVMPriv;
		chkVMediaPriv = chkExtendedPriv._chkVMediaPriv;
	}

	var btnAry = [];
	btnAry.push(createButton("modBtn",eLang.getString("common","STR_MODIFY"),modifyRoleGroup));
	btnAry.push(createButton("cancelBtn",eLang.getString("common","STR_CANCEL"),closeForm));
	rgindex = arg.rgindex;

	wnd = MessageBox(eLang.getString("common","STR_CONF_AD_RG_MODIFY_TITLE"),frm.display(),btnAry);
	wnd.onclose = getADCfg;
	rgPriv = $("_rgPriv");
	rgPriv.value = arg.rgpriv;
	if (EXTENDED_PRIV) {
		chkKVMPriv.checked = arg.kvmpriv ? true : false;
		chkVMediaPriv.checked = arg.vmediapriv ? true : false;
	}
}

function modifyRoleGroup()
{
	if (validateRoleGroup())
	{
		var req = new xmit.getset({url:"/rpc/modrolegroup.asp",onrcv:modifyRoleGroupRes});
		req.add("ROLEGROUP_ID",rgindex);
		req.add("ROLEGROUP_NAME",rgName.value);
		req.add("ROLEGROUP_DOMAIN",rgDomain.value);
		req.add("ROLEGROUP_PRIV",rgPriv.value);
		if (EXTENDED_PRIV) {
			req.add("ROLEGROUP_KVM", chkKVMPriv.checked ? 1 : 0);
			req.add("ROLEGROUP_VMEDIA", chkVMediaPriv.checked ? 1 : 0);
		}
		req.send();
		delete req;
	}
}

function modifyRoleGroupRes(arg)
{
	if (arg.HAPI_STATUS != 0)
	{
		switch(GET_ERROR_CODE(arg.HAPI_STATUS))
		{
			case 0xcc:
				errstr = eLang.getString("common","STR_CONF_AD_RG_ERR3");
				alert(errstr);
			break;
			default:
				errstr = eLang.getString("common","STR_CONF_AD_RG_MODINFO");
				errstr += (eLang.getString("common","STR_IPMI_ERROR")+GET_ERROR_CODE(arg.HAPI_STATUS));
				alert(errstr);
			break;
		}
	}
	else
	{
		alert(eLang.getString("common","STR_CONF_RG_SAVE_SUCCESS_2"));
	}
	closeForm();
}

function doDeleteRoleGroup()
{
	if ((roleGroupTable.selected.length != 1) || (roleGroupTable.selected[0].cells[0] == undefined) || (roleGroupTable.selected[0].cells[0] == null))
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_ERR1"));
		disableButtons();
	}
	else
	{
		selectedid = parseInt(roleGroupTable.getRow(roleGroupTable.selected[0]).cells[0].innerHTML);
		if (RG_DATA[selectedid - 1].ROLEGROUP_NAME == "")
			alert (eLang.getString("common","STR_CONF_AD_RG_ERR2"));
		else if (confirm(eLang.getString("common","STR_CONFIRM_DELETE")))
		{
			var req = new xmit.getset({url:"/rpc/delrolegroup.asp",onrcv:deleteRoleGroupRes});
			req.add("ROLEGROUP_ID",selectedid);
			req.send();
			delete req;
		}
	}
}

function deleteRoleGroupRes(arg)
{
	if (arg.HAPI_STATUS != 0)
	{
		errstr = eLang.getString("common","STR_CONF_AD_RG_DELINFO");
		errstr +=  (eLang.getString("common","STR_IPMI_ERROR") +GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString("common","STR_CONF_AD_RG_DELETE_SUCCESS"));
		getADCfg();
	}
}

function closeForm()
{
	wnd.close();
}
