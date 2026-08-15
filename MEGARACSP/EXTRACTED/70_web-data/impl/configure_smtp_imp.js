//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2012        **;
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

// File Name  : configure_smtp_imp.js
// Brief      : This implementation is to display and configure the SMTP 
// on the BMC.
// Author Name: Arockia Selva Rani. A

var CONST_PRIMARY = 1;		//SMTP Primary Server
var CONST_SECONDARY = 2;	//SMTP Secondary Server
var CONST_MIN_MACHINE_NAME = 0xF;	//Integer to hold the min length of license key

var SMTPCFG_DATA;			//It holds the get RPC SMTP response data
var upload_stage;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_lstLANChannel",
		"_txtSenderAddr",
		"_txtMachineName",
		"_chkSMTPEnable1",
		"_txtPort1",
		"_txtSMTPServer1",
		"_chkSMTPAuth1",
		"_txtUsername1",
		"_txtPassword1",
		"_chkSMTPSTARTTLS1",
		"_rowSMTPCACert1",
		"_SMTPCACertBrowse1",
		"_rowSMTPCert1",
		"_SMTPCertBrowse1",
		"_rowSMTPPrivKey1",
		"_SMTPPrivKeyBrowse1",
		"_chkSMTPEnable2",
		"_txtPort2",
		"_txtSMTPServer2",
		"_chkSMTPAuth2",
		"_txtUsername2",
		"_txtPassword2",
		"_chkSMTPSTARTTLS2",
		"_rowSMTPCACert2",
		"_SMTPCACertBrowse2",
		"_rowSMTPCert2",
		"_SMTPCertBrowse2",
		"_rowSMTPPrivKey2",
		"_SMTPPrivKeyBrowse2",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		chkSMTPEnable1.onclick = function() {
			var index = 0;
			index = getIndex(lstLANChannel.value);
			enableSMTPEnable(CONST_PRIMARY, index);
			if (chkSMTPEnable1.checked) {
				txtSMTPServer1.focus();
			}
		}

		chkSMTPAuth1.onclick = function() {
			var index = 0;
			index = getIndex(lstLANChannel.value);
			enableSMTPEnable(CONST_PRIMARY, index);
		}

		chkSMTPSTARTTLS1.onclick = function() {
			if(chkSMTPSTARTTLS1.checked == true)
			{
				$("_rowSMTPCACert1").className = "visibleRow";
				$("_rowSMTPCert1").className = "visibleRow";
				$("_rowSMTPPrivKey1").className = "visibleRow";
			}
			else
			{
				$("_rowSMTPCACert1").className = "hiddenRow";
				$("_rowSMTPCert1").className = "hiddenRow";
				$("_rowSMTPPrivKey1").className = "hiddenRow";
			}
		}

		chkSMTPEnable2.onclick = function() {
			var index = 0;
			index = getIndex(lstLANChannel.value);
			enableSMTPEnable(CONST_SECONDARY, index);
			if (chkSMTPEnable2.checked) {
				txtSMTPServer2.focus();
			}
		}

		chkSMTPAuth2.onclick = function() {
			var index = 0;
			index = getIndex(lstLANChannel.value);
			enableSMTPEnable(CONST_SECONDARY, index);
		}

		chkSMTPSTARTTLS2.onclick = function() {
			if(chkSMTPSTARTTLS2.checked == true)
			{
				$("_rowSMTPCACert2").className = "visibleRow";
				$("_rowSMTPCert2").className = "visibleRow";
				$("_rowSMTPPrivKey2").className = "visibleRow";
			}
			else
			{
				$("_rowSMTPCACert2").className = "hiddenRow";
				$("_rowSMTPCert2").className = "hiddenRow";
				$("_rowSMTPPrivKey2").className = "hiddenRow";
			}
		}

		btnSave.onclick = validateSMTPCfg;
		btnReset.onclick = reloadSMTPCfg;
	} else {
		disableActions({id: ["_lstLANChannel"]});
	}
	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	getSMTPCfg();
}

/*
 * It will invoke the RPC method to get the SMTP configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getSMTPCfg()
{
	xmit.get({url:"/rpc/getsmtpcfg.asp", onrcv:getSMTPCfgRes, 
		status:"", timeout:10000});
}

/*
 * This is the response function for getSMTPCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSMTPCfgRes(arg)
{
	var errstr;		//Error string
	if (GET_ERROR_CODE(arg.HAPI_STATUS) == 0xD4) { //Insufficient privilege level
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	} else if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_SMTP_GETVAL");
		errstr +=(eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SMTPCFG_DATA = WEBVAR_JSONVAR_GETSMTPCFG.WEBVAR_STRUCTNAME_GETSMTPCFG;
		loadLanChannel();
	}
}

/*
 * It will load the LAN channel information if MultiLAN support is enabled.
 */
function loadLanChannel()
{
	lstLANChannel.innerHTML = "";
	for (i = 0; i < SMTPCFG_DATA.length; i++) {
		lstLANChannel.add(new Option(SMTPCFG_DATA[i].CHANNEL_NUM, 
			SMTPCFG_DATA[i].CHANNEL_NUM), isIE ? i : null);
	}

	if (top.mainFrame.pageFrame.location.hash) {
		lstLANChannel.value = comboParser(top.mainFrame.pageFrame.location.hash,
			lstLANChannel.id);	//id->id of the selection box
	}
	lstLANChannel.onchange = reloadSMTPCfg;
	reloadSMTPCfg();
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadSMTPCfg()
{
	var index = 0;

	index = getIndex(lstLANChannel.value);
	txtSenderAddr.value = SMTPCFG_DATA[index].SENDERADDR;
	txtMachineName.value = SMTPCFG_DATA[index].MACHINENAME;

	chkSMTPEnable1.checked = (SMTPCFG_DATA[index].SMTPENABLE1 == 1) ? true :
		false;
	txtPort1.value = SMTPCFG_DATA[index].SMTPPORT1;
	txtSMTPServer1.value = (SMTPCFG_DATA[index].SMTPSERVER1 ==
		eLang.getString("common", "STR_IPV4_ADDR0")) ? "" :
		SMTPCFG_DATA[index].SMTPSERVER1;
	chkSMTPAuth1.checked = (SMTPCFG_DATA[index].SMTPAUTHENABLE1 == 1) ? true :
		false;
	txtUsername1.value = SMTPCFG_DATA[index].USERNAME1;
	txtPassword1.value = "";
	chkSMTPSTARTTLS1.checked = (SMTPCFG_DATA[index].SMTPENABLESTARTTLS1 == 1) ? true :
		false;
	if(chkSMTPSTARTTLS1.checked == true)
	{
		$("_rowSMTPCACert1").className = "visibleRow";
		$("_rowSMTPCert1").className = "visibleRow";
		$("_rowSMTPPrivKey1").className = "visibleRow";
	}
	else
	{
		$("_rowSMTPCACert1").className = "hiddenRow";
		$("_rowSMTPCert1").className = "hiddenRow";
		$("_rowSMTPPrivKey1").className = "hiddenRow";
	}
	enableSMTPEnable(CONST_PRIMARY, index);

	chkSMTPEnable2.checked = (SMTPCFG_DATA[index].SMTPENABLE2 == 1) ? true :
		false;
	txtPort2.value = SMTPCFG_DATA[index].SMTPPORT2;
	txtSMTPServer2.value = (SMTPCFG_DATA[index].SMTPSERVER2 ==
		eLang.getString("common", "STR_IPV4_ADDR0")) ? "" :
		SMTPCFG_DATA[index].SMTPSERVER2;
	chkSMTPAuth2.checked = (SMTPCFG_DATA[index].SMTPAUTHENABLE2 == 1) ? true :
		false;
	txtUsername2.value = SMTPCFG_DATA[index].USERNAME2;
	txtPassword2.value = "";
	chkSMTPSTARTTLS2.checked = (SMTPCFG_DATA[index].SMTPENABLESTARTTLS2 == 1) ? true :
		false;
	if(chkSMTPSTARTTLS2.checked == true)
	{
		$("_rowSMTPCACert2").className = "visibleRow";
		$("_rowSMTPCert2").className = "visibleRow";
		$("_rowSMTPPrivKey2").className = "visibleRow";
	}
	else
	{
		$("_rowSMTPCACert2").className = "hiddenRow";
		$("_rowSMTPCert2").className = "hiddenRow";
		$("_rowSMTPPrivKey2").className = "hiddenRow";
	}
	enableSMTPEnable(CONST_SECONDARY, index);
}

/*
 * It will return the index value of the LAN channel from the global RPC LAN
 * configuration data. 
 * @param channel number, one of the value in global RPC response data.
 * @return number, index position of the global RPC data.
 */
function getIndex(channel)
{
	var i; 				//loop counter
	var index = -1;		//position of the global RPC data
	for (i = 0; i < SMTPCFG_DATA.length; i++) {
		if (SMTPCFG_DATA[i].CHANNEL_NUM == channel) {
			index = i;
			break;
		}
	}
	if (index == -1) {
		alert ("Error in getting the index for Channel::" + channel);
		index = 0;
	}
	return index;
}

/*
 * It will validate the data of all user controls before saving it.
 * Sender Address - Email
 * Machine Name - String
 * Port - Port
 * SMTP Server - IPv4/IPv6 Address
 * User Name - SMTP user name
 * Password - Password, 4-64
 */
function validateSMTPCfg()
{
	if (!eVal.email(txtSenderAddr.value)) {
		alert(eLang.getString("err",0x06) + "-" + 
			eLang.getString("common", "STR_CONF_SMTP_SENDERADDR"));
		txtSenderAddr.focus();
		return;
	}
	if (!eVal.alphanum(txtMachineName.value) ||
		txtMachineName.value.length > CONST_MIN_MACHINE_NAME) {
		alert(eLang.getString("common", "STR_CONF_SMTP_INVALID_MACHINENAME"));
		txtMachineName.focus();
		return;
	}

	if (chkSMTPEnable1.checked) {
		if(!eVal.port(txtPort1.value)) {
			alert(eLang.getString("common","STR_INVALID_PORT"));
			txtPort1.focus();
			return;
		}
		if ((!eVal.ip(txtSMTPServer1.value)) && 
			(!eVal.ipv6(txtSMTPServer1.value, false, false))) {
			alert(eLang.getString("common", "STR_CONF_SMTP_PRIMARY") +
				eLang.getString("common", "STR_INVALID_IP") + 
				eLang.getString("common", "STR_HELP_INFO"));
			txtSMTPServer1.focus();
			return;
		}
		if (chkSMTPAuth1.checked) {
			if (!eVal.username(txtUsername1.value, "SMTP", 4, 64)) {
				alert(eLang.getString("err", 0x01) + 
					eLang.getString("common", "STR_HELP_INFO"));
				txtUsername1.focus();
				return;
			}
			if (!eVal.password(txtPassword1.value, 4, 64)) {
				alert(eLang.getString("err", 0x03) + 
					eLang.getString("common", "STR_HELP_INFO"));
				txtPassword1.focus();
				return;
			}
		}
	}

	if (chkSMTPEnable2.checked) {
		if(!eVal.port(txtPort2.value))
		{
			alert(eLang.getString("common","STR_INVALID_PORT"));
			txtPort2.focus();
			return;
		}
		if ((!eVal.ip(txtSMTPServer2.value)) && 
			(!eVal.ipv6(txtSMTPServer2.value, false, false))) {
			alert(eLang.getString("common", "STR_CONF_SMTP_SECONDARY") + 
				eLang.getString("common", "STR_INVALID_IP") +
				eLang.getString("common", "STR_HELP_INFO"));
			txtSMTPServer2.focus();
			return;
		}
		if (chkSMTPAuth2.checked) {
			if (!eVal.username(txtUsername2.value, "SMTP", 4, 64)) {
				alert(eLang.getString("err", 0x01) + 
					eLang.getString("common", "STR_HELP_INFO"));
				txtUsername2.focus();
				return;
			}
			if (!eVal.password(txtPassword2.value, 4, 64)) {
				alert(eLang.getString("err", 0x03) + 
					eLang.getString("common", "STR_HELP_INFO"));
				txtPassword2.focus();
				return;
			}
		}
	}
	if (chkSMTPEnable1.checked && chkSMTPEnable2.checked) {
		if ((eVal.compareip(txtSMTPServer1.value, txtSMTPServer2.value)) || 
			(eVal.comparev6ip(txtSMTPServer1.value, txtSMTPServer2.value))) {
			alert(eLang.getString("common", "STR_CONF_SMTP_DIFF_SMTPSRVR") + 
				eLang.getString("common", "STR_HELP_INFO"));
			txtSMTPServer2.focus();
			return;
		}
	}
	if ( (chkSMTPEnable1.checked && chkSMTPSTARTTLS1.checked) || 
		 (chkSMTPEnable2.checked && chkSMTPSTARTTLS2.checked) )
		validateCertFile();
	else
		setSMTPCfg();
}

function validateCertFile()
{
	if ( !eVal.isblank(SMTPCACertBrowse1.value) ||
		 !eVal.isblank(SMTPCertBrowse1.value) ||
		 !eVal.isblank(SMTPPrivKeyBrowse1.value) ||
		 !eVal.isblank(SMTPCACertBrowse1.value) ||
		 !eVal.isblank(SMTPCertBrowse1.value) ||
		 !eVal.isblank(SMTPPrivKeyBrowse1.value) ) 
	{
		uploadCertFile();
	}
	else
		setSMTPCfg();
}

function uploadCertFile()
{
	if (top.user.isAdmin()) {
		upload_stage = "";
		showWait(true,"Uploading");
		if(SMTPCACertBrowse1.value != "") 
		{
			upload_stage = "SMTPCACert1";
			document.forms["frmSMTPCACertUpload1"].submit(); 
		}
		else if(SMTPCertBrowse1.value != "") 
		{
			upload_stage = "SMTPCert1";
			document.forms["frmSMTPCertUpload1"].submit(); 
		}
		else if(SMTPPrivKeyBrowse1.value != "") 
		{
			upload_stage = "SMTPPrivKey1";
			document.forms["frmSMTPPrivKeyUpload1"].submit(); 
		}
		else if(SMTPCACertBrowse2.value != "") 
		{
			upload_stage = "SMTPCACert2";
			document.forms["frmSMTPCACertUpload2"].submit(); 
		}
		else if(SMTPCertBrowse2.value != "") 
		{
			upload_stage = "SMTPCert2";
			document.forms["frmSMTPCertUpload2"].submit(); 
		}
		else if(SMTPPrivKeyBrowse2.value != "") 
		{
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit(); 
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function uploadComplete()
{
	if(upload_stage == "SMTPCACert1") {
		if (SMTPCertBrowse1.value != "") {
			upload_stage = "SMTPCert1";
			document.forms["frmSMTPCertUpload1"].submit();
			return;
			
		} else if (SMTPPrivKeyBrowse1.value != "") {
			upload_stage = "SMTPPrivKey1";
			document.forms["frmSMTPPrivKeyUpload1"].submit();
			return;
		} else if (SMTPCACertBrowse2.value != "") {
			upload_stage = "SMTPCACert2";
			document.forms["frmSMTPCACertUpload2"].submit();
			return;
		} else if (SMTPCertBrowse2.value != "") {
			upload_stage = "SMTPCert2";
			document.forms["frmSMTPCertUpload2"].submit();
			return;
		} else if (SMTPPrivKeyBrowse2.value != "") {
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit();
			return;
		}
	} else if (upload_stage == "SMTPCert1") {
		if (SMTPPrivKeyBrowse1.value != "") {
			upload_stage = "SMTPPrivKey1";
			document.forms["frmSMTPPrivKeyUpload1"].submit();
			return;
		} else if (SMTPCACertBrowse2.value != "") {
			upload_stage = "SMTPCACert2";
			document.forms["frmSMTPCACertUpload2"].submit();
			return;
		} else if (SMTPCertBrowse2.value != "") {
			upload_stage = "SMTPCert2";
			document.forms["frmSMTPCertUpload2"].submit();
			return;
		} else if (SMTPPrivKeyBrowse2.value != "") {
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit();
			return;
		}
	} else if (upload_stage == "SMTPPrivKey1") {
		if (SMTPCACertBrowse2.value != "") {
			upload_stage = "SMTPCACert2";
			document.forms["frmSMTPCACertUpload2"].submit();
			return;
		} else if (SMTPCertBrowse2.value != "") {
			upload_stage = "SMTPCert2";
			document.forms["frmSMTPCertUpload2"].submit();
			return;
		} else if (SMTPPrivKeyBrowse2.value != "") {
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit();
			return;
		}
	} else if (upload_stage == "SMTPCACert2") {
		if (SMTPCertBrowse2.value != "") {
			upload_stage = "SMTPCert2";
			document.forms["frmSMTPCertUpload2"].submit();
			return;
		} else if (SMTPPrivKeyBrowse2.value != "") {
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit();
			return;
		}
	} else if (upload_stage == "SMTPCert2") {
		if (SMTPPrivKeyBrowse2.value != "") {
			upload_stage = "SMTPPrivKey2";
			document.forms["frmSMTPPrivKeyUpload2"].submit();
			return;
		}
	}

	showWait(false);
	upload_stage = "";
	setSMTPCfg();
	
}

/*
 * It will invoke the RPC method to set the SMTP configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setSMTPCfg()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setsmtpcfg.asp", onrcv:setSMTPCfgRes, 
		status:""});
	req.add("CHANNEL_NUM", lstLANChannel.value);
	req.add("SENDERADDR", txtSenderAddr.value);
	req.add("MACHINENAME", txtMachineName.value);

	req.add("SMTPENABLE1", chkSMTPEnable1.checked ? 1 : 0);
	req.add("SMTPPORT1", txtPort1.value);
	req.add("SMTPSERVER1", txtSMTPServer1.value);
	req.add("SMTPAUTHENABLE1", chkSMTPAuth1.checked ? 1 : 0);
	req.add("USERNAME1", txtUsername1.value);
	req.add("PASSWORD1", txtPassword1.value);
	req.add("ENABLESMTPSTARTTLS1", chkSMTPSTARTTLS1.checked ? 1 : 0);

	req.add("SMTPENABLE2", chkSMTPEnable2.checked ? 1 : 0);
	req.add("SMTPPORT2", txtPort2.value);
	req.add("SMTPSERVER2", txtSMTPServer2.value);
	req.add("SMTPAUTHENABLE2", chkSMTPAuth2.checked ? 1 : 0);
	req.add("USERNAME2", txtUsername2.value);
	req.add("PASSWORD2", txtPassword2.value);
	req.add("ENABLESMTPSTARTTLS2", chkSMTPSTARTTLS2.checked ? 1 : 0);

	req.send();
	delete req;
}

/*
 * This is the response function for setSMTPCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting network bonding configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setSMTPCfgRes(arg)
{
	var errstr;		//Error string
	switch(arg.HAPI_STATUS) {
	case 0x0:
		alert(eLang.getString("common", "STR_CONF_SMTP_SAVE_SUCCESS"));
		getSMTPCfg();
	break;
	case 0xE2:
		alert(eLang.getString("common", "STR_INVALID_IP") + 
			eLang.getString("common", "STR_HELP_INFO"));
	break;
	default:
		errstr = eLang.getString("common", "STR_CONF_SMTP_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

/*
 * It will disable or enable the user controls based on SMTP authentication 
 * check box option of Primary or Secondary server.
 * @param server number, SMTP server 1-Primary server, 2-Secondary server.
 */
function enableSMTPEnable(server, index)
{
	var bopt;		//boolean value to enable/disable

	$("_chkSMTPSTARTTLS" + server).disabled = !$("_chkSMTPEnable" + server).checked;
	if( $("_chkSMTPEnable" + server).checked == false )
	{
		$("_chkSMTPSTARTTLS" + server).checked = false;
		$("_rowSMTPCACert" + server).className = "hiddenRow";
		$("_rowSMTPCert" + server).className = "hiddenRow";
		$("_rowSMTPPrivKey" + server).className = "hiddenRow";
	}
	$("_chkSMTPAuth" + server).disabled = !$("_chkSMTPEnable" + server).checked;
	$("_txtSMTPServer" + server).disabled = !$("_chkSMTPEnable" + server).checked;

	bopt = (($("_chkSMTPAuth" + server).disabled) || 
		(!$("_chkSMTPAuth" + server).checked));
	$("_txtUsername" + server).disabled = bopt;
	$("_txtPassword" + server).disabled = bopt;

	if (!$("_chkSMTPEnable" + server).checked) {
		$("_txtSMTPServer" + server).value = SMTPCFG_DATA[index]["SMTPSERVER" +
			server];
	}

	if (!bopt) {
		$("_txtUsername" + server).focus();
	} else {
		$("_txtUsername" + server).value = SMTPCFG_DATA[index]["USERNAME" +
			server];
		$("_txtPassword" + server).value = "";
	}
}

