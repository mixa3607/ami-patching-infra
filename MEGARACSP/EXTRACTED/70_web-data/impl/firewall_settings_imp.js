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

// File Name  : firewall_settings_imp.js
// Brief      : This implementation is used to display all the configured 
// firewall settings. This implementation contains Add and Delete functionalities.
// Author Name: Sakthivel. R

var FWALLCFG_DATA; 		//Holds RPC response data of firewall Rule configurations
var tblJSON;			//Object to hold Port/Port Range information in JSON structure
var tblFwallSettings;	//List grid object to hold Port/Port Range information
var fwSettingsRuleOper;		//Integer to hold the firewall Port Rule operator
var selectedIndex;		//Integer to hold the selected index in the IP Rule table

/*
 * This function used to initialized the event handler for 
 * various buttons.
 */
function initSettingsAction() {
	btnAdd.onclick = function() {
		addFirewallSettings();
	};
	btnDelete.onclick = function() {
		delFwallSettings(top.CONSTANTS.DELETE);
	};
}

/*
 * This function is used to initialize the System firewall page when 
 * Settings tab option is clicked.
 * Also initialized the event handler for various buttons.
 */
function doFirewallSettings() {
	clearUI();
	btnAdd.className = "hiddenRow";
	fwallSettings.style.fontWeight = "bold";
	initSettingsAction();
	loadFirewallSettingsPageElements();
	getFirewallCfg();
	reloadHelp();
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select event handler.
 */
function loadFirewallSettingsPageElements() {
	var height = parent.$("pageFrame").offsetHeight - 280;
	tblFwallSettings = listgrid({
		w : "100%",
		//h : height + "px",
		doAllowNoSelect : false
	});
	listGridHolder.appendChild(tblFwallSettings.table);

	try {
		tblJSON = {cols:[
			{text:eLang.getString("common", "STR_HASH"), fieldType:2, 
				w:"5%", textAlign:"center"},
			{text:eLang.getString("common", "STR_FWALL_PORT_NETWORKTYPE"), fieldType:2, 
				w:"15%", textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_FWALL_START_TIME"), w:"30%", 
				textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_FWALL_END_TIME"), w:"30%", 
				textAlign:"center"},
			{text:eLang.getString("common", "STR_FWALL_SETTING"), 
				w:"20%", textAlign:"center"}
		]};
		tblFwallSettings.loadFromJson(tblJSON);
	} catch(e) {
		alert(e);
	}

	if (top.user.isAdmin()) {
		tblFwallSettings.ontableselect = function() {
			if (this.selected.length) {
				btnDelete.disabled = false;
			}
		}
		tblFwallSettings.ondblclick = function() {
			//addFirewallSettings();
		}
	}
}

/*
 * It will invoke the RPC method to get the firewall configuration and
 * get date and time configurations based on the project settings.  
 * Once it get data from RPC, response function will be called 
 * automatically.
 */
function getFirewallCfg() {
	varFwallType = CONST_SETTINGS;
	btnDelete.disabled = true;
	btnAdvSettings.disabled = false;
	xmit.get({url:"/rpc/getfirewallcfg.asp", onrcv:getFirewallCfgRes, status:""});	
}

/*
 * This is the response function for getFirewallCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and load the 
 * output data value in UI.
 * @param arg object, RPC response data from xmit library
 */
function getFirewallCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_FWALL_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		FWALLCFG_DATA = WEBVAR_JSONVAR_GETFWALLCFG.WEBVAR_STRUCTNAME_GETFWALLCFG;
		loadFirewallSettingsTable();
		btnAdd.disabled = false;
	}
}

/*
 * It will load response firewall Port rule data from global variable to 
 * list grid control in UI.
 */
function loadFirewallSettingsTable() {
	var JSONRows = [];		//Object of array of rows to load list grid
	var status;				//String to hold the Port setting(Allow or Block)
	var network_type;
	var settingsRuleStartTime = ""; //String to hold the start date and time format
	var settingsRuleEndTime = "";	//String to hold the end date and time format
	tblFwallSettings.clear();

	for (i = 0; i < FWALLCFG_DATA.length; i++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		if( typeof FWALLCFG_DATA[i].DATEFROMDD !== 'undefined' ) {
			settingsRuleStartTime = doStartDateTime(FWALLCFG_DATA[i]);
			settingsRuleEndTime = doEndDateTime(FWALLCFG_DATA[i]);
		}
		else{
			settingsRuleStartTime = '--';
			settingsRuleEndTime = '--';
		}
		status = FWALLCFG_DATA[i].BLOCKALL ? eLang.getString("common", 
			"STR_CONF_FWALL_BLOCK_ALL") : eLang.getString("common", 
			"STR_CONF_FWALL_ALLOW_ALL");

		if(status == eLang.getString("common","STR_CONF_FWALL_BLOCK_ALL")){
			network_type = (FWALLCFG_DATA[i].BLOCKALL == 1) ? "IPv4" : "IPv6";
		}

		if(FWALLCFG_DATA[i].BLOCKTYPE){
			status = eLang.getString("common", "STR_CONF_FWALL_BLOCK_ALL");
			network_type = (FWALLCFG_DATA[i].BLOCKTYPE == 1) ? "IPv4" : "IPv6";
			settingsRuleStartTime = '--';
			settingsRuleEndTime = '--';
		}

		try {
			JSONRows.push({cells:[
				{text:(i+1), value:(i+1)},
				{text:network_type, value:network_type},
				{text:settingsRuleStartTime, value:settingsRuleStartTime},
				{text:settingsRuleEndTime, value:settingsRuleEndTime},
				{text:status, value:status}
			]});
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = JSONRows;
	tblFwallSettings.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_CONF_SETTINGS_CNT") +  "</strong>" + FWALLCFG_DATA.length + 
		eLang.getString("common", "STR_BLANK");
}

/*
 * It will display a form, which contains UI controls to configure the 
 * firewall rule configuration.
 */
function addFirewallSettings() {
	fwSettingsRuleOper = top.CONSTANTS.ADD;
	var frm = new form("advFwallForm", "POST", "javascript://", "general");

	var valIPType = {1:"IPv4", 2:"IPv6", 3:"Both"};
	lstIPType = frm.addSelectBox(eLang.getString("common",
		"STR_CONF_FWALL_BLOCK_ALL"), "_lstShrType", valIPType,
		"", "", "", "classicTxtBox");

	chkFlushAll = frm.addCheckBox(eLang.getString("common",
		"STR_CONF_FWALL_FLUSH_ALL"), "_chkFwallFlushAll",
		{"_chkFwallFlushAll":"Enable"}, false, ["_chkFwallFlushAll"]);
	chkFwallFlushAll = chkFlushAll._chkFwallFlushAll;
	chkFwallFlushAll.checked = false;

	if (SYSTEM_FIREWALL_TIMEOUT) {
		chkFwallTimeout = frm.addCheckBox(eLang.getString("common",
			"STR_CONF_FWALL_TIMEOUT"), "_chkFwallTimeout",
			{"_chkFwallTimeout":"Enable"}, false, ["_chkFwallTimeout"]);
		chkFwallTimeout = chkFwallTimeout._chkFwallTimeout;
	
		var lstStartDate = frm.addRow(fmtStartDateTime, 
			"<div id='_startDate'></div>");
	
		var lstEndDate = frm.addRow(fmtEndDateTime,
			"<div id='_endDate'></div>");
	}

	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common",
		"STR_SAVE"), validateFwallCfg));
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));
	wnd = MessageBox(eLang.getString("common", "STR_CONF_FWALL_ADV_TITLE"),
		frm.display(), btnAry);

	wnd.onclose = function () {
		if (varFwallType == CONST_IP) {
			getAllFirewallIPCfg();
		} else if (varFwallType == CONST_PORT) {
			getAllFirewallPortCfg();
		} else if (varFwallType == CONST_SETTINGS) {
			getFirewallCfg();
		}
	};

	if (SYSTEM_FIREWALL_TIMEOUT) {
		startDate = $("_startDate");
		endDate = $("_endDate");
		loadStartDateTime();
		chkFwallTimeout.onclick = enableTimeSettings;
	}

	chkFwallFlushAll.onclick = settingStatus;
	settingStatus();
	if (!top.user.isAdmin()) {
		disableActions({id:["_btnAdvSettings", "_btnCancel"]});
	}
}

/* This method is used to enable/disable the Advanced settings UI controls 
 * based on the check box value.
 */
function settingStatus() {
	var bopt;	//Boolean variable
	bopt = chkFwallFlushAll.checked;
	lstIPType.disabled = bopt;
	if (SYSTEM_FIREWALL_TIMEOUT) {
		if (bopt) {
			chkFwallTimeout.checked = !bopt
		}
		chkFwallTimeout.disabled = bopt;
		enableTimeSettings();
	}
}

/*
 * It will validate the data of firewall configuration rule user controls 
 * before saving it.
 */
function validateFwallCfg() {
	if (chkFwallTimeout.checked) {
		if ((!(validateDateTime(lstFromDate.value, lstFromMonth.value, 
			lstFromYear.value, lstFromHour.value, lstFromMinute.value))) || 
			(!(validateDateTime(lstToDate.value, lstToMonth.value, 
				lstToYear.value, lstToHour.value, lstToMinute.value))) || 
			(!compareDateTime())) {
			return;
		}
	}
	
	if (chkFwallFlushAll.checked) {
		if (!confirm(eLang.getString("common", "STR_FWALL_FLUSHALL"))) {
			return;
		}
	} else {
		if (!confirm(eLang.getString("common", "STR_FWALL_BLOCKALL_" + 
			lstIPType.value))) {
			return;
		}
	}
	setFirewallCfg();
}

/*
 * It will invoke the RPC method to set or delete firewall configuration.
 * Once it get response from RPC, on receive method will be called 
 * automatically.
 */
function setFirewallCfg() {
	var req = new xmit.getset({url:"/rpc/setfirewallcfg.asp", 
		onrcv:setFirewallCfgRes, status:""});
	req.add("OPER", fwSettingsRuleOper);
	if (fwSettingsRuleOper == top.CONSTANTS.ADD) {
		req.add("BLOCKALL", chkFwallFlushAll.checked ? 0 : lstIPType.value);
		req.add("FLUSHALL", chkFwallFlushAll.checked ? 1 : 0);
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
	} else {
		var i = selectedIndex-1;
		if(typeof FWALLCFG_DATA[i].DATEFROMDD !== 'undefined'){
			req.add("BLOCKALL", FWALLCFG_DATA[i].BLOCKALL);
		}
		else{
			req.add("BLOCKALL", FWALLCFG_DATA[i].BLOCKTYPE);
		}
		req.add("DATEFROMDD", typeof FWALLCFG_DATA[i].DATEFROMDD !== 'undefined' ? FWALLCFG_DATA[i].DATEFROMDD : 0);
		req.add("DATEFROMMM", typeof FWALLCFG_DATA[i].DATEFROMMM !== 'undefined' ? FWALLCFG_DATA[i].DATEFROMMM : 0);
		req.add("DATEFROMYY", typeof FWALLCFG_DATA[i].DATEFROMYY !== 'undefined' ? FWALLCFG_DATA[i].DATEFROMYY : 0);
		req.add("TIMEFROMHH", typeof FWALLCFG_DATA[i].TIMEFROMHH !== 'undefined' ? FWALLCFG_DATA[i].TIMEFROMHH : 0);
		req.add("TIMEFROMMM", typeof FWALLCFG_DATA[i].TIMEFROMMM !== 'undefined' ? FWALLCFG_DATA[i].TIMEFROMMM : 0);

		req.add("DATETODD", typeof FWALLCFG_DATA[i].DATETODD !== 'undefined' ? FWALLCFG_DATA[i].DATETODD : 0);
		req.add("DATETOMM", typeof FWALLCFG_DATA[i].DATETOMM !== 'undefined' ? FWALLCFG_DATA[i].DATETOMM : 0);
		req.add("DATETOYY", typeof FWALLCFG_DATA[i].DATETOYY !== 'undefined' ? FWALLCFG_DATA[i].DATETOYY : 0);
		req.add("TIMETOHH", typeof FWALLCFG_DATA[i].TIMETOHH !== 'undefined' ? FWALLCFG_DATA[i].TIMETOHH : 0);
		req.add("TIMETOMM", typeof FWALLCFG_DATA[i].TIMETOMM !== 'undefined' ? FWALLCFG_DATA[i].TIMETOMM : 0);
	}
	req.send();
	delete req;
}

/*
 * This is the response function for setFirewallCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set firewall rule configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setFirewallCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_FWALL_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		if(chkFwallFlushAll.checked) {
			alert (eLang.getString("common", "STR_CONF_FWALL_SAVE_FLUSH_RESULT_" + fwSettingsRuleOper));
		} else {
			alert (eLang.getString("common", "STR_CONF_FWALL_SAVE_RESULT_" + fwSettingsRuleOper));
		}
		if (fwSettingsRuleOper != top.CONSTANTS.DELETE) {
			closeForm();
		} else {
			getFirewallCfg();
		}
	}
}

/*
 * It will invoke the RPC method to delete the firewall settings configuration.
 * @param arg oper, holds the settings operation. 1- Add, 3 - Delete.
 */
function delFwallSettings(oper) {
	if (tblFwallSettings.selected.length != 1) {
		alert (eLang.getString("common", "STR_FWALL_SETTINGS_ERR1"));
		btnDelete.disabled = true;
	} else {
		if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
			fwSettingsRuleOper = oper;	// Firewall settings rule rule oper for delete update to the global variable
			selectedIndex = parseInt(tblFwallSettings.getRow
				(tblFwallSettings.selected[0]).cells[0].innerHTML);
			setFirewallCfg();
		}
	}
}

/*
 * Used to close the form which is used to set the Advanced firewall 
 * configuration form
 */
function closeForm() {
	wnd.close();
}


