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

// File Name  : firewall_ip_imp.js
// Brief      : This implementation is used to display all the configured 
// IP Address and Range of IP Addressess in the list grid. It contains 
// implementation to Add and Delete.
// Author Name: Sakthivel. R

var fwIPRuleOper;	//Integer to hold the firewall IP Rule operator
var tblJSON;		//Object to hold IP/IP Range information in JSON structure
var FWIP_DATA;		//Holds RPC response data of IP Rule informations
var tblFwallIPTable	//List grid object to hold IP/IP Range information
var selectedIndex;	//Integer to hold the selected index in the IP Rule table
var CONST_IPV4_TIMEOUT = 0x0b;	//Constant to hold the timeout for ip rule configuration
var CONST_IPV4_RANGE_TIMEOUT = 0x0c;	//Constant to hold the timeout for range of ip rule configuration
var CONST_IPV6_TIMEOUT = 0x15;	//Constant to hold the timeout for ip rule configuration
var CONST_IPV6_RANGE_TIMEOUT = 0x16;	//Constant to hold the timeout for range of ip rule configuration

/*
 * This function is used to initialize the event handler for 
 * various buttons.
 */
function initIPAction() {
	btnAdd.onclick = function() {
		doAddIPRule(top.CONSTANTS.ADD);
	};
	btnDelete.onclick = function() {
		doDeleteIPRule(top.CONSTANTS.DELETE);
	};
}

/*
 * This function is used to initialize the System firewall page when 
 * IP Address tab option is clicked.
 * Also initialized the event handler for various buttons.
 */
function doFirewallIP() {
	clearUI();
	btnAdd.className = "vissibleRow";
	fwallIP.style.fontWeight = "bold";
	initIPAction();
	loadFirewallIPPageElements();
	getAllFirewallIPCfg();
	reloadHelp();
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select event handler.
 */
function loadFirewallIPPageElements() {
	var height = parent.$("pageFrame").offsetHeight - 280;
	height = (height > 45) ? height : 45;
	tblFwallIPTable = listgrid ({
		w : "100%",
		//h : height + "px",
		doAllowNoSelect : false
	});
	listGridHolder.appendChild(tblFwallIPTable.table);

	try {
		if (SYSTEM_FIREWALL_TIMEOUT) {
			tblJSON = {cols:[
				{text:eLang.getString("common", "STR_HASH"), fieldType:2, 
					w:"5%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_IP_RANGE"), w:"35%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_CONF_FWALL_START_TIME"), w:"25%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_CONF_FWALL_END_TIME"), w:"25%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_IP_SETTING"), 
					w:"10%", textAlign:"center"}
			]};
		} else {
			tblJSON = {cols:[
				{text:eLang.getString("common", "STR_HASH"), fieldType:2, 
					w:"15%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_IP_RANGE"), w:"60%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_IP_SETTING"), 
					w:"25%", textAlign:"center"}
			]};
		}
		tblFwallIPTable.loadFromJson(tblJSON);
	} catch(e) {
		alert(e);
	}

	if (top.user.isAdmin()) {
		tblFwallIPTable.ontableselect = function () {
			if (this.selected.length) {
				btnDelete.disabled = false;
			}
		}

		tblFwallIPTable.ondblclick = function() {
			//doAddIPRule(top.CONSTANTS.ADD);
		}
	}
}

/*
 * It will invoke the RPC method to get the firewall IP Address configuration.  
 * Once it get data from RPC, response function will be called 
 * automatically.
 */
function getAllFirewallIPCfg() {
	varFwallType = CONST_IP;
	disableButtons();
	btnAdvSettings.disabled = false;
	xmit.get({url:"/rpc/getfwalliprule.asp", onrcv:getAllFirewallIPCfgRes, status:""});
}

/*
 * This is the response function for getAllFirewallIPCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and load the output
 * data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getAllFirewallIPCfgRes(arg) {
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_FWALL_IP_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		FWIP_DATA = WEBVAR_JSONVAR_GETFWALLIPCFG.WEBVAR_STRUCTNAME_GETFWALLIPCFG;
		loadFirewallIPTable();
		btnAdd.disabled = false;
	}
}

/*
 * It will load response firewall IP rule data from global variable to 
 * list grid control in UI.
 */
function loadFirewallIPTable() {
	var JSONRows = [];		//Object of array of rows to load list grid
	var iprange_todisplay;	//Holds IP or IP range informations
	var status;				//String to hold to the IP/IP Address status(Allow or Block)
	var IPRuleStartTime = "";
	var IPRuleEndTime = "";
	tblFwallIPTable.clear();

	for (i = 0; i < FWIP_DATA.length; i++) {
		IPRuleStartTime = "~";
		IPRuleEndTime = "~";
		// Use ~ char to indicate free slot so it will sort alphabetically
		iprange_todisplay = FWIP_DATA[i].IPFROM;
		if (FWIP_DATA[i].IPTO != "") {
			iprange_todisplay += " - " + FWIP_DATA[i].IPTO;
		}
		if (SYSTEM_FIREWALL_TIMEOUT && ((FWIP_DATA[i].TYPE == CONST_IPV4_TIMEOUT) || 
				(FWIP_DATA[i].TYPE == CONST_IPV4_RANGE_TIMEOUT) || 
				(FWIP_DATA[i].TYPE == CONST_IPV6_TIMEOUT) || 
				(FWIP_DATA[i].TYPE == CONST_IPV6_RANGE_TIMEOUT))) {
			IPRuleStartTime = doStartDateTime(FWIP_DATA[i]);
			IPRuleEndTime = doEndDateTime(FWIP_DATA[i]);
		}
		status = FWIP_DATA[i].SETTINGS ? eLang.getString("common", 
			"STR_CONF_FWALL_ALLOW") : eLang.getString("common", 
			"STR_CONF_FWALL_BLOCK");

		try {
			if (SYSTEM_FIREWALL_TIMEOUT) {
				JSONRows.push({cells:[
					{text:(i+1), value:(i+1)},
					{text:iprange_todisplay, value:iprange_todisplay},
					{text:IPRuleStartTime, value:IPRuleStartTime},
					{text:IPRuleEndTime, value:IPRuleEndTime},
					{text:status, value:status}
				]});
			} else {
				JSONRows.push({cells:[
					{text:(i+1), value:(i+1)},
					{text:iprange_todisplay, value:iprange_todisplay},
					{text:status, value:status}
				]});
			}
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = JSONRows;
	tblFwallIPTable.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_FWALL_IP_CNT") + "</strong>" + FWIP_DATA.length + 
		eLang.getString("common", "STR_BLANK");
}

/*
 * It will display a form, which contains UI controls to add the 
 * firewall IP Address configuration.
 * @param oper integer, IP Address operation. 1 - Add.
 */
function doAddIPRule(oper) {
	fwIPRuleOper = oper;	// IP rule oper for Add is update to the global variable
	var frm = new form("addIPRuleForm", "POST", "javascript://", "general");

	ipRange = document.createElement("div");
	var txtIpFrom = document.createElement("input");
		txtIpFrom.type = "text";
		txtIpFrom.className = "bigclassicTxtBox";
		txtIpFrom.id = "_txtIpFrom";
		txtIpFrom.maxLength = "46";
		ipRange.appendChild(txtIpFrom);
	var lblIpRange = document.createElement("label");
		lblIpRange.innerHTML = " - ";
		ipRange.appendChild(lblIpRange);
	var txtIpTo = document.createElement("input");
		txtIpTo.type = "text";
		txtIpTo.className = "bigclassicTxtBox";
		txtIpTo.id = "_txtIpTo";
		txtIpTo.maxLength = "46";
		ipRange.appendChild(txtIpTo);

	ipRangerow = frm.addRow(eLang.getString("common", 
		"STR_FWALL_IP_RANGE"), ipRange);
	if (SYSTEM_FIREWALL_TIMEOUT) {

	chkFwallTimeout = frm.addCheckBox(eLang.getString("common",
		"STR_CONF_FWALL_TIMEOUT"), "_chkFwallTimeout",
		{"_chkFwallTimeout":"Enable"}, false, ["_chkFwallTimeout"]);
	chkFwallTimeout = chkFwallTimeout._chkFwallTimeout;

	lstStartDate = frm.addRow(fmtStartDateTime,
		"<div id='_startDate'></div>");

	lstEndDate = frm.addRow(fmtEndDateTime, 
		"<div id='_endDate'></div>");
	}
	var ipStatus = {0 : "Block", 1 : "Allow"};
	ipSetting = frm.addSelectBox(eLang.getString("common", 
		"STR_FWALL_IP_SETTING"), "_ipSetting", ipStatus,"","","", 
		"smallclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton("addBtn", eLang.getString("common", "STR_SAVE"), 
		validateIPRuleCfg));
	btnAry.push(createButton("cancelBtn", eLang.getString("common", 
		"STR_CANCEL"), closeIPRuleForm));
	wnd = MessageBox(eLang.getString("common", "STR_FWALL_ADD_IPRULE"), 
		frm.display(), btnAry);
	wnd.onclose = function() {
		getFirewallCfg();
		getAllFirewallIPCfg();
	};

	if (SYSTEM_FIREWALL_TIMEOUT) {
		startDate = $("_startDate");
		endDate = $("_endDate");
		loadStartDateTime();
		chkFwallTimeout.onclick = enableTimeSettings;
	}

	if(!top.user.isAdmin()) {
		disableActions({id:["_btnAdvSettings", "_cancelBtn"]});
	}
}

/*
 * It will validate the data of firewall Add IP Address user controls before 
 * saving it.
 */
function validateIPRuleCfg() {
	var btn = document.getElementById('_addBtn');	
	if ((eVal.isblank($("_txtIpFrom").value)) && 
		(eVal.isblank($("_txtIpTo").value))) {
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_IP_1") +
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}

	
	if((!eVal.isblank($("_txtIpFrom").value)) && (!eVal.isblank($("_txtIpTo").value)) ){
		if((eVal.ip($("_txtIpFrom").value) && eVal.ip($("_txtIpTo").value)) || (eVal.ipv6($("_txtIpFrom").value) && eVal.ipv6($("_txtIpTo").value))) {
			
		}
		else
		{
			alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_IP_2") +
					eLang.getString("common", "STR_HELP_INFO"));
			return;
		}
	}
	
	if(!eVal.isblank($("_txtIpFrom").value)){
		if(eVal.ip($("_txtIpFrom").value) || eVal.ipv6($("_txtIpFrom").value)) {
			
		}
		else
		{
			alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_IP_2") +
					eLang.getString("common", "STR_HELP_INFO"));
			return;
		}
	}

	if (eVal.isblank($("_txtIpFrom").value)) {
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_IP_3") +
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}

	if (SYSTEM_FIREWALL_TIMEOUT && chkFwallTimeout.checked) {
		if (!((validateDateTime(lstFromDate.value, lstFromMonth.value, 
				lstFromYear.value, lstFromHour.value, lstFromMinute.value)) && 
			(validateDateTime(lstToDate.value, lstToMonth.value, 
				lstToYear.value, lstToHour.value, lstToMinute.value)) && 
			compareDateTime())) {
				return;
		}
	}
	btn.disabled = true;
	addIPRuleCfg();
}

/*
 * It will invoke the RPC method to set or delete the IP Address configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function addIPRuleCfg() {
	var req = new xmit.getset({url:"/rpc/addiprule.asp", onrcv:addIPRuleCfgRes, status:""});
	req.add("OPER", fwIPRuleOper);
	if (fwIPRuleOper == top.CONSTANTS.DELETE) {
		req.add("TYPE", FWIP_DATA[selectedIndex-1].TYPE);
		req.add("IPFROM", FWIP_DATA[selectedIndex-1].IPFROM);
		req.add("IPTO", FWIP_DATA[selectedIndex-1].IPTO);		
		req.add("SETTINGS", FWIP_DATA[selectedIndex-1].SETTINGS);
		if (SYSTEM_FIREWALL_TIMEOUT) {
			req.add("DATEFROMDD", FWIP_DATA[selectedIndex-1].DATEFROMDD);
			req.add("DATEFROMMM", FWIP_DATA[selectedIndex-1].DATEFROMMM);
			req.add("DATEFROMYY", FWIP_DATA[selectedIndex-1].DATEFROMYY);
			req.add("TIMEFROMHH", FWIP_DATA[selectedIndex-1].TIMEFROMHH);
			req.add("TIMEFROMMM", FWIP_DATA[selectedIndex-1].TIMEFROMMM);
			req.add("DATETODD", FWIP_DATA[selectedIndex-1].DATETODD);
			req.add("DATETOMM", FWIP_DATA[selectedIndex-1].DATETOMM);
			req.add("DATETOYY", FWIP_DATA[selectedIndex-1].DATETOYY);
			req.add("TIMETOHH", FWIP_DATA[selectedIndex-1].TIMETOHH);
			req.add("TIMETOMM", FWIP_DATA[selectedIndex-1].TIMETOMM);
		}
		
		var ipv6Status = (eVal.ipv6(FWIP_DATA[selectedIndex-1].IPFROM) ) ? 1 : 0;
		req.add("IPV6STATUS", ipv6Status);
	} else {
		req.add("IPFROM", $("_txtIpFrom").value);
		req.add("IPTO", $("_txtIpTo").value);
		if (SYSTEM_FIREWALL_TIMEOUT) {
			req.add("TIMEOUT_STATUS", chkFwallTimeout.checked ? 1 : 0);
			if (chkFwallTimeout.checked) {
				req.add("DATEFROMDD", lstFromDate.value);
				req.add("DATEFROMMM", lstFromMonth.value);
				req.add("DATEFROMYY", lstFromYear.value);
				req.add("TIMEFROMHH", lstFromHour.value);
				req.add("TIMEFROMMM", lstFromMinute.value);
		
				req.add("DATETODD", lstToDate.value);
				req.add("DATETOMM", lstToMonth.value);
				req.add("DATETOYY", lstToYear.value);
				req.add("TIMETOHH", lstToHour.value);
				req.add("TIMETOMM", lstToMinute.value);
			}
		}
		req.add("SETTINGS", ipSetting.value);
		
		var ipv6Status = (eVal.ipv6($("_txtIpFrom").value) ) ? 1 : 0;
		req.add("IPV6STATUS", ipv6Status);
	}
	
	req.send();
	delete req;
}

/*
 * This is the response function for addIPRuleCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set IP Address configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function addIPRuleCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		if(GET_ERROR_CODE(arg.HAPI_STATUS) == 130){
			alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_IP_4") +
					eLang.getString("common", "STR_HELP_INFO"));
			document.getElementById('_addBtn').disabled = false;
		}
		else{
			errstr = eLang.getString("common", "STR_FWALL_IP_SET_ERR_" + fwIPRuleOper);
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		alert (eLang.getString("common", "STR_FWALL_IP_RULE_RESULT_" + 
			fwIPRuleOper));
		if (fwIPRuleOper != top.CONSTANTS.DELETE) {
			closeIPRuleForm();
		} else {
			getFirewallCfg();
			getAllFirewallIPCfg();
		}
	}
}

/*
 * It will invoke the RPC method to delete the IP Address configuration.
 * @param arg oper, holds the IP Address operation. 3 - Delete.
 */
function doDeleteIPRule(oper) {
	if (tblFwallIPTable.selected.length != 1) {
		alert (eLang.getString("common", "STR_FWALL_IP_ERR1"));
		btnDelete.disabled = true;
	} else {
		if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
			fwIPRuleOper = oper;	// IP rule oper for delete update to the global variable
			selectedIndex = parseInt(tblFwallIPTable.getRow
				(tblFwallIPTable.selected[0]).cells[0].innerHTML);
			addIPRuleCfg();
		}
	}
}

/*
 * Used to close the form which is used to add the firewall IP Address
 * entries form
 */
function closeIPRuleForm() {
	wnd.close();
}

/*
 * It will load response data from global variable to respective controls in UI.
 * Based on the global variable response, list grid rows will be used to 
 * grayed-out or enabled.
 */
function fwallIPRuleStatus() {
	var i; // loop counter
	for (i = 0; i < FWIP_DATA.length; i++) {
		try {
			tblFwallIPTable.container.rows[i+1].setEnabled
				(!FWALLCFG_DATA[0].BLOCKALL); // This will grayed out all the rows
		} catch (e) {
			continue;
		}
	}
}

