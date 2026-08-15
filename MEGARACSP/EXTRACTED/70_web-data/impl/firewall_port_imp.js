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

// File Name  : firewall_port_imp.js
// Brief      : This implementation is used to display all the configured 
// Port and Range of Ports in the list grid. It contains implementation 
// to Add and Delete.
// Author Name: Sakthivel. R

var FWPORT_DATA;		//Holds RPC response data of IP Rule informations
var tblJSON;			//Object to hold Port/Port Range information in JSON structure
var tblFwallPortTable;	//List grid object to hold Port/Port Range information
var fwPortRuleOper;		//Integer to hold the firewall Port Rule operator
var selectedIndex;		//Integer to hold the selected index in the IP Rule table
var CONST_PORT_TIMEOUT = 0x0d; 	//Constant to hold the parameter for port with timeout
var CONST_PORT_RANGE_TIMEOUT = 0x0e;	//Constant to hold the parameter for port range with timeout
var CONST_PORTV6_TIMEOUT = 0x48;	//Constant to hold the timeout for ip rule configuration
var CONST_PORTV6_RANGE_TIMEOUT = 0x49;	//Constant to hold the timeout for range of ip rule configuration
/*
 * This function is used to initialize the event handler for 
 * various buttons.
 */
function initPortAction() {
	btnAdd.onclick = function() {
		doAddPortRule(top.CONSTANTS.ADD);
	};
	btnDelete.onclick = function() {
		doDeletePortRule(top.CONSTANTS.DELETE);
	};
}

/*
 * This function is used to initialize the System firewall page when 
 * Port Address tab option is clicked.
 * Also initialized the event handler for various buttons.
 */
function doFirewallPorts() {
	clearUI();
	btnAdd.className = "vissibleRow";
	fwallPort.style.fontWeight = "bold";
	initPortAction();
	loadFirewallPortPageElements();
	getAllFirewallPortCfg();
	reloadHelp();
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select event handler.
 */
function loadFirewallPortPageElements() {
	var height = parent.$("pageFrame").offsetHeight - 280;
	tblFwallPortTable = listgrid({
		w : "100%",
		//h : height + "px",
		doAllowNoSelect : false
	});
	listGridHolder.appendChild(tblFwallPortTable.table);

	try {
		if (SYSTEM_FIREWALL_TIMEOUT) {
			tblJSON = {cols:[
				{text:eLang.getString("common", "STR_HASH"), fieldType:2, 
					w:"5%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_PROTOCOL"), 
					w:"10%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_NETWORKTYPE"), 
					w:"15%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_RANGE"), 
					w:"20%", textAlign:"center"},
				{text:eLang.getString("common", "STR_CONF_FWALL_START_TIME"), w:"20%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_CONF_FWALL_END_TIME"), w:"20%", 
					textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_SETTING"), 
					w:"10%", textAlign:"center"}
			]};
		} else {
			tblJSON = {cols:[
				{text:eLang.getString("common", "STR_HASH"), fieldType:2, 
					w:"15%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_PROTOCOL"), 
					w:"15%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_NETWORKTYPE"), 
					w:"15%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_RANGE"), 
					w:"35%", textAlign:"center"},
				{text:eLang.getString("common", "STR_FWALL_PORT_SETTING"), 
					w:"20%", textAlign:"center"}
			]};
		}
		tblFwallPortTable.loadFromJson(tblJSON);
	} catch(e) {
		alert(e);
	}

	if (top.user.isAdmin()) {
		tblFwallPortTable.ontableselect = function() {
			if (this.selected.length) {
				btnDelete.disabled = false;
			}
		}
		tblFwallPortTable.ondblclick = function() {
			//doAddPortRule(top.CONSTANTS.ADD);
		}
	}
}

/*
 * It will invoke the RPC method to get the firewall Port rule configuration.  
 * Once it get data from RPC, response function will be called 
 * automatically.
 */
function getAllFirewallPortCfg() {
	varFwallType = CONST_PORT;
	disableButtons();
	btnAdvSettings.disabled = false;
	xmit.get({url:"/rpc/getfwallportrule.asp", onrcv:getAllFirewallPortCfgRes, status:""});
}

/*
 * This is the response function for getAllFirewallPortCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and load the output
 * data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getAllFirewallPortCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_FWALL_PORT_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		FWPORT_DATA = WEBVAR_JSONVAR_GETFWALLPORTCFG.WEBVAR_STRUCTNAME_GETFWALLPORTCFG;
		loadFirewallPortTable();
		btnAdd.disabled = false;
	}
}

/*
 * It will load response firewall Port rule data from global variable to 
 * list grid control in UI.
 */
function loadFirewallPortTable() {
	var JSONRows = [];		//Object of array of rows to load list grid
	var protocol = "";		//String to hold the protocol
	var network = "";		//String to hold the network type
	var portrange_todisplay;//String to hold the Port/Port Range to display
	var status;				//String to hold the Port setting(Allow or Block)
	var portRuleStartTime = "";
	var portRuleEndTime = "";
	tblFwallPortTable.clear();

	for (i = 0; i < FWPORT_DATA.length; i++) {
		portRuleStartTime = "~";
		portRuleEndTime = "~";
		// Use ~ char to indicate free slot so it will sort alphabetically
		protocol = eLang.getString("common", "STR_FWALL_PORT_PROTOCOL_" + 
			FWPORT_DATA[i].PROTOCOL);
		
		network = eLang.getString("common", "STR_FWALL_PORT_NETWORKTYPE_" + 
				FWPORT_DATA[i].NETWORKTYPE);
		
		portrange_todisplay = FWPORT_DATA[i].PORTFROM;
		if (FWPORT_DATA[i].PORTTO != 0) {
			portrange_todisplay += " - " + FWPORT_DATA[i].PORTTO;
		}
		if (SYSTEM_FIREWALL_TIMEOUT && ((FWPORT_DATA[i].TYPE == CONST_PORT_TIMEOUT) || 
				(FWPORT_DATA[i].TYPE == CONST_PORT_RANGE_TIMEOUT) ||
				(FWPORT_DATA[i].TYPE == CONST_PORTV6_TIMEOUT) ||
				(FWPORT_DATA[i].TYPE == CONST_PORTV6_RANGE_TIMEOUT) )) {
			portRuleStartTime = doStartDateTime(FWPORT_DATA[i]);
			portRuleEndTime = doEndDateTime(FWPORT_DATA[i]);
		}
		status = FWPORT_DATA[i].SETTINGS ? eLang.getString("common", 
			"STR_CONF_FWALL_ALLOW") : eLang.getString("common", 
			"STR_CONF_FWALL_BLOCK");

		try {
			if (SYSTEM_FIREWALL_TIMEOUT) {
				JSONRows.push({cells:[
					{text:(i+1), value:(i+1)},
					{text:protocol, value:protocol},
					{text:network, value:network},
					{text:portrange_todisplay, value:portrange_todisplay},
					{text:portRuleStartTime, value:portRuleStartTime},
					{text:portRuleEndTime, value:portRuleEndTime},
					{text:status, value:status}
				]});
			} else {
				JSONRows.push({cells:[
					{text:(i+1), value:(i+1)},
					{text:protocol, value:protocol},
					{text:network, value:network},
					{text:portrange_todisplay, value:portrange_todisplay},
					{text:status, value:status}
				]});
			}
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = JSONRows;
	tblFwallPortTable.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_FWALL_PORT_CNT") +  "</strong>" + FWPORT_DATA.length + 
		eLang.getString("common", "STR_BLANK");
}

/*
 * It will display a form, which contains UI controls to add the 
 * firewall Port rule configuration.
 * @param oper integer, Port rule operation. 1 - Add.
 */
function doAddPortRule(oper) {
	fwPortRuleOper = oper;
	var frm = new form("addPortRuleForm", "POST", "javascript://", "general");

	portRange = document.createElement("div"); 
	var txtPortFrom = document.createElement("input");
		txtPortFrom.type = "text";
		txtPortFrom.className = "classicTxtBox";
		txtPortFrom.id = "_txtPortFrom";
		txtPortFrom.maxLength = "5";
		portRange.appendChild(txtPortFrom);
	var lblPortRange = document.createElement("label");
		lblPortRange.innerHTML = " - ";
		portRange.appendChild(lblPortRange);
	var txtPortTo = document.createElement("input");
		txtPortTo.type = "text";
		txtPortTo.className = "classicTxtBox";
		txtPortTo.id = "_txtPortTo";
		txtPortTo.maxLength = "5";
		portRange.appendChild(txtPortTo);

	portRangerow = frm.addRow(eLang.getString("common", 
		"STR_FWALL_PORT_RANGE"), portRange);

	var protocol = {0 : "TCP", 1 : "UDP", 2: "Both"};
	protocolSetting = frm.addSelectBox(eLang.getString("common", 
		"STR_FWALL_PORT_PROTOCOL"), "_protocolSetting", protocol,"",
		"","","classicTxtBox");
	
	var network = {1 : "IPv4", 2 : "IPv6", 3 : "Both"};
	networkType = frm.addSelectBox(eLang.getString("common", 
		"STR_FWALL_PORT_NETWORKTYPE"), "_networkType", network,"","",
		"","smallclassicTxtBox");
	
	if (SYSTEM_FIREWALL_TIMEOUT) {
		chkFwallTimeout = frm.addCheckBox(eLang.getString("common",
			"STR_CONF_FWALL_TIMEOUT"), "_chkFwallTimeout",
			{"_chkFwallTimeout":"Enable"}, false, ["_chkFwallTimeout"]);
		chkFwallTimeout = chkFwallTimeout._chkFwallTimeout;
	
		lstStartDate = frm.addRow(fmtStartDateTime, "<div id='_startDate'></div>");
	
		lstEndDate = frm.addRow(fmtEndDateTime, "<div id='_endDate'></div>");
	}
	var portStatus = {0 : "Block", 1 : "Allow"};
	portSetting = frm.addSelectBox(eLang.getString("common", 
		"STR_FWALL_PORT_SETTING"), "_portSetting", portStatus,"","",
		"","smallclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton("addBtn",eLang.getString("common", "STR_SAVE"), 
		validatePortRuleCfg));
	btnAry.push(createButton("cancelBtn",eLang.getString("common", 
		"STR_CANCEL"), closePortRuleForm));
	wnd = MessageBox(eLang.getString("common", "STR_FWALL_ADD_PORTRULE"), 
		frm.display(), btnAry);

	wnd.onclose = function (){
		getFirewallCfg();
		getAllFirewallPortCfg();
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
 * It will validate the data of firewall Add Port rule user controls before 
 * saving it.
 */
function validatePortRuleCfg() {
	var btn = document.getElementById('_addBtn');
	if ((eVal.isblank($("_txtPortFrom").value)) && 
		(eVal.isblank($("_txtPortTo").value))) {
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_PORT_1") +
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}

	if ((!eVal.isblank($("_txtPortFrom").value)) &&
		(!eVal.port($("_txtPortFrom").value)) || 
		(!eVal.isblank($("_txtPortTo").value)) &&
		(!eVal.port($("_txtPortTo").value))){
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_PORT_2") +
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}

	if (eVal.isblank($("_txtPortFrom").value)) {
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_PORT_3") +
			eLang.getString("common", "STR_HELP_INFO"));
		return;
	}

	if (((parseInt($("_txtPortFrom").value)) > 
		(parseInt($("_txtPortTo").value)))) {
		alert(eLang.getString("common", "STR_CONF_FWALL_INVALID_PORT_4") +
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
	addPortRuleCfg();
}

/*
 * It will invoke the RPC method to set or delete the Port rule configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function addPortRuleCfg() {
	var req = new xmit.getset({url:"/rpc/addportrule.asp", onrcv:addPortRuleCfgRes, status:""});
	req.add("OPER", fwPortRuleOper);
	if (fwPortRuleOper == top.CONSTANTS.ADD) {
		req.add("PROTOCOL", protocolSetting.value);
		req.add("NETWORKTYPE", networkType.value);
		req.add("PORTFROM", $("_txtPortFrom").value);
		req.add("PORTTO", $("_txtPortTo").value);
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
		req.add("SETTINGS", portSetting.value);
	} else {				
		req.add("TYPE", FWPORT_DATA[selectedIndex-1].TYPE);
		req.add("PROTOCOL", FWPORT_DATA[selectedIndex-1].PROTOCOL);
		req.add("NETWORKTYPE", (FWPORT_DATA[selectedIndex-1].NETWORKTYPE)+1);
		req.add("PORTFROM", FWPORT_DATA[selectedIndex-1].PORTFROM);
		req.add("PORTTO", FWPORT_DATA[selectedIndex-1].PORTTO);
		if (SYSTEM_FIREWALL_TIMEOUT) {
			req.add("DATEFROMDD", FWPORT_DATA[selectedIndex-1].DATEFROMDD);
			req.add("DATEFROMMM", FWPORT_DATA[selectedIndex-1].DATEFROMMM);
			req.add("DATEFROMYY", FWPORT_DATA[selectedIndex-1].DATEFROMYY);
			req.add("TIMEFROMHH", FWPORT_DATA[selectedIndex-1].TIMEFROMHH);
			req.add("TIMEFROMMM", FWPORT_DATA[selectedIndex-1].TIMEFROMMM);
			req.add("DATETODD", FWPORT_DATA[selectedIndex-1].DATETODD);
			req.add("DATETOMM", FWPORT_DATA[selectedIndex-1].DATETOMM);
			req.add("DATETOYY", FWPORT_DATA[selectedIndex-1].DATETOYY);
			req.add("TIMETOHH", FWPORT_DATA[selectedIndex-1].TIMETOHH);
			req.add("TIMETOMM", FWPORT_DATA[selectedIndex-1].TIMETOMM);
		}
		req.add("SETTINGS", FWPORT_DATA[selectedIndex-1].SETTINGS);
	}
	req.send();
	delete req;
}

/*
 * This is the response function for addPortRuleCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set Port rule configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function addPortRuleCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_FWALL_PORT_SAVE_ERR_" + fwPortRuleOper);
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_FWALL_PORT_RULE_RESULT_" + 
			fwPortRuleOper));
		if (fwPortRuleOper != top.CONSTANTS.DELETE) {
			closePortRuleForm();
		} else {
			getFirewallCfg();
			getAllFirewallPortCfg();
		}
	}
}

/*
 * It will invoke the RPC method to delete the Port rule configuration.
 * @param arg oper, holds the Port rule operation. 3 - Delete.
 */
function doDeletePortRule(oper) {
	if (tblFwallPortTable.selected.length != 1) {
		alert (eLang.getString("common", "STR_FWALL_PORT_ERR1"));
		btnDelete.disabled = true;
	} else {
		if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
			fwPortRuleOper = oper;
			selectedIndex = parseInt(tblFwallPortTable.getRow
				(tblFwallPortTable.selected[0]).cells[0].innerHTML);
			addPortRuleCfg();
		}
	}
}

/*
 * Used to close the form which is used to add the firewall Port rule
 * entries form
 */
function closePortRuleForm() {
	wnd.close();
}

/*
 * It will load response data from global variable to respective controls in UI.
 * Based on the global variable response Port rule list grid rows will be used 
 * to grayed-out or enabled.
 */
function fwallPortRuleStatus() {
	var i; // loop counter
	for (i = 0; i < FWPORT_DATA.length; i++) {
		try {
			tblFwallPortTable.container.rows[i+1].setEnabled
				(!FWALLCFG_DATA[0].BLOCKALL); // This will grayed out all the rows
		} catch (e) {
			continue;
		}
	}
}

