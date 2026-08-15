//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2010-2012        **;
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

// File Name  : event_filter_imp.js
// Brief      : Implementation is to configure PEF Event Filter entries
// Author Name:

var pefListTable;		//List grid object to hold Event filter
var PEFCFG_DATA;		//Holds RPC response data of Event filter
var SENSORINFO_DATA;	//Holds RPC response data of Sensor informations
var tblJSON;			//Object to hold image information in JSON structure
var sensorTypeCodes;	//List array to hold sensornames
var EventFilterOper;	//Integer to hold Event filter operation
var CONST_ALL_SENSORS = 0xFF	//Constant to hold all sensor values

/*
 * This function is used to initialize the Event filter page when 
 * Event Filter option is clicked.
 * Also initialized the event handler for various buttons.
 */
function initPEFAction() {
	addBtn.onclick = function() {
		doEventFilter(top.CONSTANTS.ADD);
	};
	modBtn.onclick = function() {
		doEventFilter(top.CONSTANTS.MODIFY);
	};
	delBtn.onclick = function() {
		doEventFilter(top.CONSTANTS.DELETE);
	};
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select and double click event handler.
 */
function loadPEFPageElements() {
	var height = parent.$("pageFrame").offsetHeight - 270;
	height = (height > 45) ? height : 45;
	pefListTable = listgrid ({
		w : "100%",
		h : height + "px",
		doAllowNoSelect : false
	});
	listGridHolder.appendChild(pefListTable.table);

	try {
		tblJSON = {cols:[
			{text:eLang.getString("common", "STR_CONF_PEF_ID"),
				fieldType:2, w:"10%", textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_PEF_CONFIGURATION"),
				w:"20%", textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_PEF_ACTION"),
				w:"25%", textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_PEF_EVENT_SEVERITY"),
				w:"20%", textAlign:"center"},
			{text:eLang.getString("common", "STR_CONF_PEF_SENSOR_NAME"),
				w:"25%", textAlign:"center"}
		]};

		pefListTable.loadFromJson(tblJSON);
	} catch(e) {
		alert(e);
	}

	if (top.user.isAdmin()) {
		pefListTable.ontableselect = function () {
			disableButtons();
			if (this.selected.length) {
				var pefevent = pefListTable.getRow(pefListTable.selected[0]);
				pefevent = pefevent.cells[1].innerHTML.replace("&nbsp;", "");
				pefevent = pefevent.replace(" ", "");
				if (pefevent == "~") {
					addBtn.disabled = false;
				} else {
					modBtn.disabled = false;
					delBtn.disabled = false;
				}
			}
		}

		pefListTable.ondblclick = function() {
			var pefevent = pefListTable.getRow(pefListTable.selected[0]);
			pefevent = pefevent.cells[1].innerHTML.replace("&nbsp;", "");
			pefevent = pefevent.replace(" ", "");
			if (pefevent == "~") {
				doEventFilter(top.CONSTANTS.ADD);
			} else {
				doEventFilter(top.CONSTANTS.MODIFY);
			}
		}
	}
}

/*
 * It will invoke the RPC method to get the Event filter configurations.
 * Once it get response from RPC, onreceive method will be called automatically.
 */
function getAllPEFCfg() {
	RPCStatus = false;
	disableButtons();
	xmit.get({url:"/rpc/getallpefcfg.asp", onrcv:getAllPEFCfgRes, status:""});
}

/*
 * This is the response function for getAllPEFCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable.
 * @param arg object, RPC response data from xmit library
 */
function getAllPEFCfgRes(arg) {
	if (GET_ERROR_CODE(arg.HAPI_STATUS) == 0xD4) { //Insufficient privilege level
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	} else if (arg.HAPI_STATUS) {
		errstr =  eLang.getString("common", "STR_CONF_PEF_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		PEFCFG_DATA = WEBVAR_JSONVAR_HL_GETPEFTABLE.WEBVAR_STRUCTNAME_HL_GETPEFTABLE;
		loadPEFTable();
	}
	getAllSensorsInfo();
}

/*
 * It will invoke the RPC method to get the Sensor configurations.
 * Once it get response from RPC, onreceive method will be called automatically.
 */
function getAllSensorsInfo() {
	xmit.get({url:"/rpc/getallsensors.asp", onrcv:getAllSensorsInfoRes, 
		status:""});
}

/*
 * This is the response function for getAllSensorsInfo RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable.
 * @param arg object, RPC response data from xmit library
 */
function getAllSensorsInfoRes(arg) {
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_SENSOR_GETVAL")
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SENSORINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSENSORS.WEBVAR_STRUCTNAME_HL_GETALLSENSORS;
	}	
	RPCStatus = true;
}

/*
 * It will load response Event Filter data from global variable to list grid 
 * control in UI.
 */
function loadPEFTable() {
	var filtertodisplay;		//Event filter configuration to display in List grid
	var actiontodisplay;		//Event action to display in List grid
	var severitytodisplay;		//Event severity to display in List grid
	var sensornametodisplay;	//Sensorname to display in List grid
	var JSONRows = [];			//Object of array of rows to load list grid
	var tPEFCnt = 0;			//Count of configured Event filter entries
	pefListTable.clear();

	for (i = 0; i < PEFCFG_DATA.length; i++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		filtertodisplay = "~";
		sensornametodisplay = "~";
		eventtodisplay = "~";
		severitytodisplay = "~";
		actiontodisplay = getPEFActionString(PEFCFG_DATA[i].EvtFilterAction);
		if(actiontodisplay != "~") {
			tPEFCnt++;
			filtertodisplay = (getbitsval(PEFCFG_DATA[i].FilterConfig,7,7) == 
				1) ? eLang.getString("common", "STR_ENABLED") : 
				eLang.getString("common", "STR_DISABLED");
			severitytodisplay = getEventSeverity(PEFCFG_DATA[i].EventSeverity);
			sensornametodisplay = PEFCFG_DATA[i].SensorName;
		}

		try {
			JSONRows.push({cells:[
				{text:(i+1), value:(i+1)},
				{text:filtertodisplay, value:filtertodisplay},
				{text:actiontodisplay, value:actiontodisplay},
				{text:severitytodisplay, value:severitytodisplay},
				{text:sensornametodisplay, value:sensornametodisplay}
			]});
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = JSONRows;
	pefListTable.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_CONF_PEF_CNT") + "</strong>" + tPEFCnt + eLang.getString("common",
		"STR_BLANK");
}

/* 
 * This function used to return the event severity string.
 * @param eventseverity integer, event severity number.
 * @return string, string for matching event severity number.
 */
function getEventSeverity(eventseverity) {
	for (var i = 0; i < 6; i++) {
		if (getbitsval(eventseverity,i,i) == 1) {
			return (eLang.getString("common", "STR_PEF_SEVERITY_" + i));
		}
	}
	return (eLang.getString("common", "STR_PEF_SEVERITY"));
}

/* 
 * This function used to returns corresponding PEF Action string.
 * @pefaction number, holds pefaction number.
 * @return string, holds the corresponding pefaction string for pefaction number.
 */
function getPEFActionString(pefaction) {
	var actionstr = "~";
	if (getbitsval(pefaction, 0, 0)) {
		actionstr = " [Alert] ";
	}
	if (getbitsval(pefaction, 1, 1)) {
		actionstr += " [Power Down] ";
	} else if (getbitsval(pefaction, 2, 2)) {
		actionstr += " [Reset] ";
	} else if (getbitsval(pefaction, 3, 3)) {
		actionstr += " [Power Cycle] ";
	}
	
	return actionstr;
}

/*
 * This will get index from the selected row of list grid, based on the data
 * in selected row and user inputs, it will invoke corresponding operation
 * @param oper integer, Event Filter operation. 1-Add, 2-Modify and 3-Delete.
 */
function doEventFilter(oper) {
	var selectedrow;
	var selectedindex;
	var selectedeventtype;

	if (!RPCStatus) {
		alert(eLang.getString("common", "STR_RPC_WAIT"));
		return;
	}

	if ((pefListTable.selected.length != 1) ||
		(pefListTable.selected[0].cells[0] == undefined) ||
		(pefListTable.selected[0].cells[0] == null)) {
		alert(eLang.getString("common", "STR_CONF_PEF_ERR1"));
		disableButtons();
		return;
	} else {
		selectedrow = pefListTable.getRow(pefListTable.selected[0]);
		selectedindex = parseInt(selectedrow.cells[0].innerHTML);
		selectedeventtype = selectedrow.cells[1].innerHTML.replace("&nbsp;", 
			"");
		selectedeventtype = selectedeventtype.replace(" ", "")
		switch(oper) {
		case top.CONSTANTS.ADD:
			if ("~" != selectedeventtype) {
				if (confirm(eLang.getString("common",
					"STR_CONF_PEF_CONFIRM1"))) {
					frmEventFilter(selectedindex, top.CONSTANTS.MODIFY);
				}
			} else {
				frmEventFilter(selectedindex, top.CONSTANTS.ADD);
			}
		break;
		case top.CONSTANTS.MODIFY:
			if ("~" == selectedeventtype) {
				if (confirm(eLang.getString("common",
					"STR_CONF_PEF_CONFIRM2"))) {
					frmEventFilter(selectedindex, top.CONSTANTS.ADD);
				}
			} else {
				frmEventFilter(selectedindex, top.CONSTANTS.MODIFY);
			}
		break;
		case top.CONSTANTS.DELETE:
			if ("~" == selectedeventtype) {
				alert (eLang.getString("common", "STR_CONF_PEF_ERR2"));
				disableButtons();
			} else {
				if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
					deletePEF(selectedindex);
				}
			}
		break;
		}
	}
}

/*
 * It will display a form, which contains UI controls to add or modify the 
 * Event filter configuration.
 * @param pefID number, Event filter ID of selected slot in list grid.
 * @param oper integer, Event filter operation. 1 - Add and 2 - Modify.
 */
function frmEventFilter(pefID, oper) {
	var formname = "";		// It used to hold the form name
	var btnname = "";		// It used to hold the button name
	var btnvalue = "";		// It used to hold the button value
	EventFilterOper = oper;	// Used to hold the Event filter action operator

	switch (oper) {
	case top.CONSTANTS.ADD:
		formname = "addEventFilterForm";
		btnname = "btnFormAdd";
		btnvalue = eLang.getString("common", "STR_ADD");
		break;
	case top.CONSTANTS.MODIFY:
		formname = "modifyEventFilterForm";
		btnname = "btnFormModify";
		btnvalue = eLang.getString("common", "STR_MODIFY");
		break;
	}

	var frm = new form(formname, "POST", "javascript://", "formWizard");
	
	var eventFilterTitle = frm.addRow("<strong>" + eLang.getString("common", 
		"STR_PEF_CFG") + "</strong>", "");

	txtPefID = frm.addTextField(eLang.getString("common",
		"STR_PEF_ID"), "_txtpefID", pefID, {"readOnly" : true}, 
		"smallclassicTxtBox");

	settings = frm.addCheckBox(eLang.getString("common", "STR_PEF_FILTER"),
		"", {"_chkEnablePEF":"Enable"}, false, [""]);
	chkEnablePEF = settings._chkEnablePEF;

	lstEventSeverity = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_EVENT"), "_lstEventSeverity", "", "" ,"", "", "classicTxtBox");

	var filterActionTitle = frm.addRow("<strong>" + eLang.getString("common",
		"STR_PEF_ACTION_CFG") + "</strong>", "");

	settings = frm.addCheckBox(eLang.getString("common", 
		"STR_PEF_ACTION"), "", {"_chkPefAlert":eLang.getString("common", 
		"STR_PEF_ALERT")}, false, [""]);
	chkPefAlert = settings._chkPefAlert;
	chkPefAlert.checked = true;
	chkPefAlert.disabled = true;

	lstPowerAction = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_POWER"), "_lstPowerAction", "", "" ,"", "", "classicTxtBox");

	chkPolicyNo = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_POLICY"), "_chkPolicyNo", "", "" ,"", "", "smallclassicTxtBox");

	var generatorIDTitle = frm.addRow("<strong>" + eLang.getString("common",
		"STR_PEF_GNTR_CFG") + "</strong>", "");

	settings = frm.addCheckBox(eLang.getString("common", 
		"STR_PEF_GNTR_DATA"), "", {"_chkRawType":eLang.getString("common", 
		"STR_PEF_GNTR_RAW")}, false, [""]);
	chkRawType = settings._chkRawType;
	chkRawType.checked = true;

	txtGenID1 = frm.addTextField(eLang.getString("common",
		"STR_PEF_GNTR_ID1"), "_txtGenID1", "", "", "smallclassicTxtBox");

	txtGenID2 = frm.addTextField(eLang.getString("common",
		"STR_PEF_GNTR_ID2"), "_txtGenID2", "", "", "smallclassicTxtBox");

	rdoGenType = frm.addRadioField(eLang.getString("common", 
		"STR_PEF_GNTR_TYPE"), "_rdoGenType", {"_rdoSlaveType":
		eLang.getString("common", "STR_PEF_GNTR_SLAVE"), "_rdoSoftwareType":
		eLang.getString("common", "STR_PEF_GNTR_SOFTWARE")}, false, [""]);

	txtSlaveSoftware = frm.addTextField(eLang.getString("common",
		"STR_PEF_SLAVE_SW"), "_txtSlaveSoftware", "", "", "classicTxtBox");

	lstChannelNo = frm.addSelectBox(eLang.getString("common", 
		"STR_PEF_CHANNEL_NO"), "_lstChannelNo", "", "" ,"", "", 
		"smallclassicTxtBox");

	lstIPMBDevice = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_IPMB_DEVICE"), "_lstIPMBDevice", "", "" ,"", "", 
		"smallclassicTxtBox");

	var sensorConfTitle = frm.addRow( "<strong>" + eLang.getString("common",
		"STR_PEF_SENSOR_CFG") + "</strong>", "");

	lstSensorType = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_SENSORTYPE"), "_lstSensorType", "", "" ,"", "", 
		"bigclassicTxtBox");

	lstSensorName = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_SENSORNAME"), "_lstSensorName", "", "" ,"", "", 
		"bigclassicTxtBox");

	lstEventOpt = frm.addSelectBox(eLang.getString("common",
		"STR_PEF_EVENT_OPT"), "_lstEventOpt", "", "" ,"", "", "classicTxtBox");

	var sensorRowTitle = frm.addRow("<strong id='_sensorEventRow'></strong>", 
		"<div id='_sensorEvent'></div>");

	var eventData1Title = frm.addRow("<strong>" + eLang.getString("common",
		"STR_PEF_EVT_DATA_CFG") + "</strong>", "");

	txtEventTrigger = frm.addTextField(eLang.getString("common",
		"STR_PEF_TRIGGER"), "_txtEventTrigger", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent1ANDMask = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT1_AND"), "_txtEvent1ANDMask", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent1Compare1 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT1_COMPARE1"), "_txtEvent1Compare1", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent1Compare2 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT1_COMPARE2"), "_txtEvent1Compare2", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	var eventData2Title = frm.addRow("<strong>" + eLang.getString("common",
		"STR_PEF_EVT_DATA2_CFG") + "</strong>", "");

	txtEvent2ANDMask = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT2_AND"), "_txtEvent2ANDMask", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent2Compare1 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT2_COMPARE1"), "_txtEvent2Compare1", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent2Compare2 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT2_COMPARE2"), "_txtEvent2Compare2", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	var eventData3Title = frm.addRow("<strong>" + eLang.getString("common",
		"STR_PEF_EVT_DATA3_CFG") + "</strong>","");

	txtEvent3ANDMask = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT3_AND"), "_txtEvent3ANDMask", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent3Compare1 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT3_COMPARE1"), "_txtEvent3Compare1", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	txtEvent3Compare2 = frm.addTextField(eLang.getString("common",
		"STR_PEF_EVENT3_COMPARE2"), "_txtEvent3Compare2", "", {"maxLength" : 3},
		"smallclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton(btnname, btnvalue, validatePEFCfg));
	btnAry.push(createButton("cancelBtn", eLang.getString("common",
		"STR_CANCEL"), closeEventFilterForm));
	wnd = MessageBox(eLang.getString("common", "STR_PEF_TITLE_" + oper),
		frm.display(), btnAry);

	frameName = top.frames["mainFrame"].pageFrame;
	frameName = frameName.document.getElementsByTagName("FORM");
	if (frameName[0].getAttribute("id").indexOf("modifyEventFilterForm") != 
		-1) {
		$("modifyEventFilterForm").style.height = parent.$("pageFrame").
			offsetHeight - 270 + "px";
	} else if (frameName[0].getAttribute("id").indexOf("addEventFilterForm") != 
		-1) {
		$("addEventFilterForm").style.height = parent.$("pageFrame").
			offsetHeight - 270 + "px";
	}

	wnd.onclose = getAllPEFCfg;
	PEFCFG_DATA = PEFCFG_DATA[pefID-1];

	sensorEvent = $("_sensorEvent");
	slaveType = $("_rdoSlaveType");
	softwareType = $("_rdoSoftwareType");
	sensorEventRow = $("_sensorEventRow");
	sensorEventRow.innerHTML = eLang.getString("common", 
		"STR_PEF_SENSOREVENTS");
	sensorTypeCodes = eLang.getString("common", "STR_SENSOR_TYPES");

	fillSensorType();
	initEventSeverity();
	initPowerAction();
	initPolicyNumber();
	initChannelNo();
	initIPMBDevices();
	reloadPEFCfg();
	toggleRawData();

	lstSensorType.onchange = function() {
		fillSensorNames();
		fillEventOptions();
		loadSensorEvents();
	};

	lstSensorName.onchange = function () {
		fillEventOptions();
		loadSensorEvents();
	};

	lstEventOpt.onchange = loadSensorEvents;
	chkRawType.onclick = toggleRawData;
	slaveType.onclick = toggleSlaveSoftware;
	softwareType.onclick = toggleSlaveSoftware;
	txtSlaveSoftware.onblur = calculateGenID;
	lstChannelNo.onchange = calculateGenID;
	lstIPMBDevice.onchange = calculateGenID;
}

/*
 * It will configure RPC response data from global variable to UI control.
 */
function reloadPEFCfg() {
	chkEnablePEF.checked = (getbitsval(PEFCFG_DATA.FilterConfig,7,7) == 1) ? 
		true : false;
	lstPowerAction.value = PEFCFG_DATA.EvtFilterAction & 14; 		//Binary 1110, Bitwise mask for 0th bit.
	chkPolicyNo.value = fillSelectBox(chkPolicyNo, PEFCFG_DATA.AlertPolicyNum);
	lstEventSeverity.value = PEFCFG_DATA.EventSeverity;

	txtGenID1.value = "0x" + PEFCFG_DATA.GeneratorByte1.toString(16).toUpperCase();
	txtGenID2.value = "0x" + PEFCFG_DATA.GeneratorByte2.toString(16).toUpperCase();

	lstSensorType.value = fillSelectBox(lstSensorType, PEFCFG_DATA.SensorType);
	fillSensorNames();
	lstSensorName.value = (PEFCFG_DATA.SensorName == "Any") ? CONST_ALL_SENSORS :
		fillSelectBox(lstSensorName, getSensorNumber(PEFCFG_DATA.SensorName));

	fillEventOptions();
	lstEventOpt.value = fillSelectBox(lstEventOpt,
		((PEFCFG_DATA.EventData1OffsetMask == 0xFFFF) ? 0 : 1));
	loadSensorEvents();
	fillSensorEvents(PEFCFG_DATA.EventData1OffsetMask);

	txtEventTrigger.value = PEFCFG_DATA.EventTrigger;
	txtEvent1ANDMask.value = PEFCFG_DATA.EventData1ANDMask;
	txtEvent1Compare1.value = PEFCFG_DATA.EventData1Cmp1;
	txtEvent1Compare2.value = PEFCFG_DATA.EventData1Cmp2;
	txtEvent2ANDMask.value = PEFCFG_DATA.EventData2ANDMask;
	txtEvent2Compare1.value = PEFCFG_DATA.EventData2Cmp1;
	txtEvent2Compare2.value = PEFCFG_DATA.EventData2Cmp2;
	txtEvent3ANDMask.value = PEFCFG_DATA.EventData3ANDMask;
	txtEvent3Compare1.value = PEFCFG_DATA.EventData3Cmp1;
	txtEvent3Compare2.value = PEFCFG_DATA.EventData3Cmp2;
}

/*
 * This function loads dynamic checkboxes based on sensor type, sensor name 
 * and event options choosen
 */
function loadSensorEvents() {
	if (lstEventOpt.value == 1) {		//Get the sensor type and load corresponding events as checkbox 
		var tmp_sensortype = CONST_ALL_SENSORS;
		if (lstSensorType.value != CONST_ALL_SENSORS) {
			tmp_sensortype = lstSensorType.value;
		} else if (lstSensorName.value != CONST_ALL_SENSORS) {
			tmp_sensortype = getSensorType(lstSensorName.value);
		}

		if (tmp_sensortype != CONST_ALL_SENSORS) {
			sensorEventRow.className = "visibleRow";
			sensorEvent.innerHTML = "";
			if (tmp_sensortype > 0x0 && tmp_sensortype < 0x5) {		//Threshold sensors range is 0x1 to 0x4
				fillThresholdEvents();
			} else if (tmp_sensortype > 0x4 && tmp_sensortype < 0x2D) {	//Other sensors range is 0x5 to 0x2C
				fillDiscreteEvents(tmp_sensortype);
			} else {	//OEM Sensors, get the Sensor event strings using PDK Hooks
				sensorEventRow.className = "hiddenRow";
			}
		}
	} else {		//Unload Sensor Event checkboxes
		sensorEvent.innerHTML = "";
		sensorEventRow.className = "hiddenRow";
	}
}

/*
 * This function used to returns corresponding Sensor number for the given 
 * Sensor Name
 * @param sensorname string, used to hold the sensor name
 * @return sensornum number, It will return the corresponding sensor number 
 * for particular sensor name. If it's not match, it will return the sensor 
 * number as zero
 */
function getSensorNumber(sensorname) {
	var sensornum = 0;
	for (var j = 0; j < SENSORINFO_DATA.length; j++) {
		if (SENSORINFO_DATA[j].SensorName == sensorname) {
			sensornum = SENSORINFO_DATA[j].SensorNumber;
			break;
		}
	}
	return sensornum;
}

/*
 *  This function used to returns SensorType, for the given Sensor Number
 *  @param sensornum number, hold sensor number
 *  @return sensortype number, It will return corresponding sensor type 
 *  for particular sensor number. It it's not match, it will return the 
 *  sensor type as zero.
 */
function getSensorType(sensornum) {
	var sensortype = 0;
	for (var j = 0; j < SENSORINFO_DATA.length; j++) {
		if (SENSORINFO_DATA[j].SensorNumber == sensornum) {
			sensortype = SENSORINFO_DATA[j].SensorType;
			break;
		}
	}
	return sensortype;
}

/*
 * This function fills the available Sensor types in SensorType selectbox
 */
function fillSensorType() {
	var index = 0;
	lstSensorType.innerHTML = "";
	if (!SENSORINFO_DATA.length) {
		alert (eLang.getString("common", "NO_SENSOR_STRING"));
		return;
	}

	lstSensorType.add(new Option(sensorTypeCodes[0x0], CONST_ALL_SENSORS), 
		isIE?index++:null);
	for (var i = 1; i < sensorTypeCodes.length; i++) {
		for (var j=0; j<SENSORINFO_DATA.length; j++) {
			if (SENSORINFO_DATA[j].SensorType == i) { 
				lstSensorType.add(new Option(sensorTypeCodes[i],i),isIE?index++:null);
				break;
			}
		}
	}
}

/*
 * This function fills available sensors (based on the choice choosen in
 * SensorType) in SensorName selectbox
 */
function fillSensorNames() {
	var index = 0;
	lstSensorName.innerHTML = "";
	lstSensorName.add(new Option(sensorTypeCodes[0x0], CONST_ALL_SENSORS), 
		isIE?index++:null);
	for (var j = 0; j < SENSORINFO_DATA.length; j++) {
		if ((SENSORINFO_DATA[j].SensorType == lstSensorType.value) || 
			(lstSensorType.value == CONST_ALL_SENSORS)) {
			lstSensorName.add(new Option(SENSORINFO_DATA[j].SensorName, 
				SENSORINFO_DATA[j].SensorNumber), isIE?index++:null);
		}
	}
}

/* 
 * This function fills All Events, Specific Sensor Events in Event Option
 * selectbox (based on SensorType and SensorName)
 */
function fillEventOptions() {
	var index = 0;
	lstEventOpt.innerHTML = "";
	lstEventOpt.add(new Option(eLang.getString("common", "STR_PEF_ALL_EVENTS"), 
		0),isIE?index++:null);
	if (lstSensorType.value != CONST_ALL_SENSORS || lstSensorName.value != 
		CONST_ALL_SENSORS) {
			lstEventOpt.add(new Option(eLang.getString("common", 
				"STR_PEF_SENSOR_EVENTS"), 1),isIE?index++:null);
	}
}

/* 
 * This function is used to binds the Event severity values in Event severity
 * selectbox control.
 */
function initEventSeverity() {
	var index = 0;
	lstEventSeverity.innerHTML = "";
	lstEventSeverity.add(new Option(eLang.getString("common", 
		"STR_PEF_SEVERITY"), 0), isIE?index++:null);
	for (var i = 0; i < 6; i++) {
		lstEventSeverity.add(new Option(eLang.getString("common", 
			"STR_PEF_SEVERITY_" + i),Math.pow(2,i)), isIE?index++:null);
	}
}

/* 
 * This function is used to binds the power option values in power option
 * selectbox control.
 */
function initPowerAction() {
	var index = 0;
	lstPowerAction.innerHTML = "";
	lstPowerAction.add(new Option(eLang.getString("common", "STR_NONE"), 0),
		isIE?index++:null);
	for (var i = 1; i < 4; i++) {
		lstPowerAction.add(new Option(eLang.getString("common", 
			"STR_PEF_POWER_" + i), Math.pow(2,i)), isIE?index++:null);
	}
}

/* 
 * This function is used to binds the policy number values in policy number selectbox.
 */
function initPolicyNumber() {
	var index = 0;
	chkPolicyNo.innerHTML = "";
	for (var i = 1; i < 16; i++) {
		chkPolicyNo.add(new Option(i,i), isIE?index++:null);
	}
}

/* 
 * This function is used to binds the channel number values in channel number selectbox.
 */
function initChannelNo() {
	var index = 0;
	lstChannelNo.innerHTML = "";
	for (var i = 0; i < 12; i++) {
		lstChannelNo.add(new Option(i,i), isIE?index++:null);
	}
	lstChannelNo.add(new Option(15,15), isIE?index++:null);
}

/* 
 * This function is used to binds the IPMB device number in IPMB Device selectbox.
 */
function initIPMBDevices() {
	var index = 0;
	lstIPMBDevice.innerHTML = "";
	for (var i = 0; i < 4; i++) {
		lstIPMBDevice.add(new Option(i,i), isIE?index++:null);
	}
}

/*
 * This function is used to calculate the generator ID's, based on the channel number and
 * IPMB device choosen in WebUI.
 */
function calculateGenID() {
	var genvalue1,genvalue2;
	if (slaveType.checked) {
		genvalue1 = 0x0;
	} else if (softwareType.checked) {
		genvalue1 = 0x1;
	}

	if (eVal.isnumstr(txtSlaveSoftware.value,0,127)) {
		genvalue1 = ((txtSlaveSoftware.value << 1) & 0xFE) | genvalue1;
	}

	txtGenID1.value = "0x" + genvalue1.toString(16).toUpperCase();

	genvalue2 = (lstChannelNo.value << 4) & 0xF0;
	if (slaveType.checked) {
		genvalue2 = (lstIPMBDevice.value | genvalue2);
	}
	txtGenID2.value = "0x" + genvalue2.toString(16).toUpperCase();
}

/*
 * This function check/uncheck the corresponding sensor event checkbox
 * based on Event data offset mask value
 * @param offsetmask number, hold event data offset mask value
 */
function fillSensorEvents(offsetmask) {
	for (var i = 0; i < 16; i++) {
		if (getbitsval(offsetmask,i,i) == 1) {
			try {
				chkboxname = "_chkThresBit" + i;
				chkbox = $(chkboxname);
				chkbox.checked = true
			} catch(e) {
				break;
			}
		}
	}
}

/*
 * This function used to change enable/disable some WebUI controls, based 
 * on the rawdata checkbox onclick operation
 */
function toggleRawData() {
	var opt = chkRawType.checked;
	txtGenID1.disabled = !opt;
	txtGenID2.disabled = !opt;
	slaveType.disabled = opt;
	softwareType.disabled = opt;
	txtSlaveSoftware.disabled = opt;
	lstChannelNo.disabled = opt;
	lstIPMBDevice.disabled = opt;
	if (!opt) {
		slaveType.checked = true;
	}
}

/*
 * This function used to change enable/disable some WebUI controls, based on 
 * the slave type or software type radio button choosen
 */
function toggleSlaveSoftware() {
	lstIPMBDevice.disabled = !slaveType.checked;
	calculateGenID();
	txtSlaveSoftware.focus();
}

/*
 * This function loads 12checkboxes for threshold sensors
 */
function fillThresholdEvents() {
	var i;					//loop counter
	var sensor_spec;			//sensor specific events
	var table = "";				//Table with Discrete Events list as checkbox

	sensor_spec = eLang.getString("common", "STR_SENSOR_THRESHOLD");
	table =  document.createElement("table");
	var tbody = document.createElement("tbody");
	for (i = 0; i < 12; i += 2) {
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		td1.innerHTML = sensor_spec[(i/2)];
		var td2 = document.createElement("td");
		td2.innerHTML = ":";
		var td3 = document.createElement("td");
		var chkThresLeft = document.createElement("input");
		chkThresLeft.type = "checkbox";
		chkThresLeft.id = "_chkThresBit" + i;
		var lblThresLeft = document.createElement("label");
		lblThresLeft.innerHTML = eLang.getString("common", 
			"STR_PEF_EVENT_LOW");
		lblThresLeft.htmlFor = "_chkThresBit" + i;

		var td4 = document.createElement("td");
		var chkThresRight = document.createElement("input");
		chkThresRight.type = "checkbox";
		chkThresRight.id = "_chkThresBit" + (i + 1);
		var lblThresRight = document.createElement("label");
		lblThresRight.innerHTML = eLang.getString("common", 
			"STR_PEF_EVENT_HIGH");
		lblThresRight.htmlFor = "_chkThresBit" + (i + 1);

		td3.appendChild(chkThresLeft);
		td3.appendChild(lblThresLeft);
		td4.appendChild(chkThresRight);
		td4.appendChild(lblThresRight);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	sensorEvent.appendChild(table);
}

/*
 * This function gets the sensor specific event count and loads checkboxes for
 * each event.
 * @param sensortype number, Sensor type value
 * @return object, bind Html elements
 */
function fillDiscreteEvents(sensortype) {
	var i;						//loop counter
	var j;						//used to hold loop counter value
	var sensor_spec;			//sensor specific events
	var table = "";				//Table with Discrete Events list as checkbox

	sensor_spec = eLang.getString("sensor_specific_event", sensortype);
	if (sensor_spec.indexOf("[undefined]") == -1) {
		table =  document.createElement("table");
		var tbody = document.createElement("tbody");
		for (i = 0; i < sensor_spec.length; i += 2) {
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			var chkThresLeft = document.createElement("input");
			chkThresLeft.type = "checkbox";
			chkThresLeft.id = "_chkThresBit" + i;
			var lblThresLeft = document.createElement("label");
			lblThresLeft.innerHTML = sensor_spec[i];
			lblThresLeft.htmlFor = "_chkThresBit" + i;
			td1.appendChild(chkThresLeft);
			td1.appendChild(lblThresLeft);
			tr.appendChild(td1);

			j = i + 1;
			if (j != sensor_spec.length) {
				var td2 = document.createElement("td");
				var chkThresRight = document.createElement("input");
				chkThresRight.type = "checkbox";
				chkThresRight.id = "_chkThresBit" + j;
				var lblThresRight = document.createElement("label");
				lblThresRight.innerHTML = sensor_spec[j];
				lblThresRight.htmlFor = "_chkThresBit" + j;

				td2.appendChild(chkThresRight);
				td2.appendChild(lblThresRight);
				tr.appendChild(td2);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
	}
	sensorEvent.appendChild(table);
}

/*
 * Used to close the form which is used to add or replace the Event Filter entries
 */
function closeEventFilterForm() {
	wnd.close();
}

/*
 * It will invoke the RPC method to delete the Event filter configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 * @param pefid number, Event filter ID of the selected row in list grid.
 */
function deletePEF(pefid) {
	var req = new xmit.getset({url:"/rpc/configurepef.asp", 
		onrcv:deletePEFRes, status:""});
	req.add ("WEBVAR_ENTRYINDEX", pefid);
	req.add ("WEBVAR_FILTERCFG", 0);
	req.add ("WEBVAR_EVTFILTERACTION", 0);
	req.add ("WEBVAR_POLICYNUM", 0); 
	req.add ("WEBVAR_SEVERITY", 0);
	req.add ("WEBVAR_GENID1", CONST_ALL_SENSORS);
	req.add ("WEBVAR_GENID2", CONST_ALL_SENSORS);
	req.add ("WEBVAR_SENSORTYPE", 0);
	req.add ("WEBVAR_SENSORNUM", 0);
	req.add ("WEBVAR_EVTDATA1OFFSETMASK", 0);
	req.add ("WEBVAR_EVTTRIGGER", 0);
	req.add ("WEBVAR_EVTDATA1AND", 0);
	req.add ("WEBVAR_EVTDATA1COMP1", 0);
	req.add ("WEBVAR_EVTDATA1COMP2", 0);
	req.add ("WEBVAR_EVTDATA2AND", 0);
	req.add ("WEBVAR_EVTDATA2COMP1", 0);
	req.add ("WEBVAR_EVTDATA2COMP2", 0);
	req.add ("WEBVAR_EVTDATA3AND", 0);
	req.add ("WEBVAR_EVTDATA3COMP1", 0);
	req.add ("WEBVAR_EVTDATA3COMP2", 0);
	req.send();
	delete req; 
}

/*
 * This is the response function for deletePEF RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then delete Event filter configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function deletePEFRes(arg) {
	if (arg.HAPI_STATUS) 	{
		errstr = eLang.getString("common", "STR_CONF_PEF_DELINFO");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert(eLang.getString("common", "STR_CONF_PEF_DELETE_SUCCESS"));
		getAllPEFCfg();
	}
}

/*
 * It will validate the data of Event filter user controls before saving it.
 */
function validatePEFCfg() {
	if (!chkPefAlert.checked) {
		alert(eLang.getString("common", "STR_PEF_ALERT_ERR"));
		chkPefAlert.focus();
		return;
	}
	if (!eVal.isnumstr(txtEventTrigger.value, 1, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT_TRIG_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEventTrigger.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent1ANDMask.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT1_MASK_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent1ANDMask.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent1Compare1.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT1_CMP1_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent1Compare1.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent1Compare2.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT1_CMP2_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent1Compare2.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent2ANDMask.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT2_MASK_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent2ANDMask.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent2Compare1.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT2_CMP1_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent2Compare1.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent2Compare2.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT2_CMP2_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent2Compare2.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent3ANDMask.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT3_MASK_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent3ANDMask.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent3Compare1.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT3_CMP1_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent3Compare1.focus();
		return;
	}
	if (!eVal.isnumstr(txtEvent3Compare2.value, 0, 255)) {
		alert(eLang.getString("common", "STR_PEF_EVT3_CMP2_ERR") + 
			eLang.getString("common", "STR_HELP_INFO"));
		txtEvent3Compare2.focus();
		return;
	}
	setPEFCfg();
}

/*
 * It will invoke the RPC method to set the Event Filter configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setPEFCfg() {
	var pefactionval = 0;
	var req = new xmit.getset({url:"/rpc/configurepef.asp", onrcv:setPEFRes, 
		status:""});
	req.add ("WEBVAR_ENTRYINDEX", txtPefID.value);
	req.add ("WEBVAR_FILTERCFG", chkEnablePEF.checked ? 0x80 : 0);

	pefactionval += chkPefAlert.checked ? 1 : 0;
	pefactionval += parseInt(lstPowerAction.value);
	req.add ("WEBVAR_EVTFILTERACTION", pefactionval); 

	req.add ("WEBVAR_POLICYNUM", chkPolicyNo.value);
	req.add ("WEBVAR_SEVERITY", lstEventSeverity.value);

	var sensortypeval = CONST_ALL_SENSORS;
	if (lstSensorType.value != CONST_ALL_SENSORS) {
		sensortypeval = lstSensorType.value
	} else if (lstSensorName.value != CONST_ALL_SENSORS) {
		sensortypeval = getSensorType(lstSensorName.value);
	}
	req.add ("WEBVAR_GENID1", txtGenID1.value);
	req.add ("WEBVAR_GENID2", txtGenID2.value);
	req.add ("WEBVAR_SENSORTYPE", sensortypeval);
	req.add ("WEBVAR_SENSORNUM", lstSensorName.value);

	var eventdataval = 0;
	if (lstEventOpt.value == 0) {
		eventdataval = 0xFFFF;
	} else {
		for (var i = 0; i < 16; i++) {
			try {
				chkboxname = "_chkThresBit" + i;
				chkbox = $(chkboxname);
				if (chkbox.checked) {
					eventdataval += Math.pow(2,i);
				}
			} catch(e) {
				break;
			}
		}
	}
	req.add ("WEBVAR_EVTDATA1OFFSETMASK", eventdataval);
	req.add ("WEBVAR_EVTTRIGGER", parseInt(txtEventTrigger.value,10));
	req.add ("WEBVAR_EVTDATA1AND", parseInt(txtEvent1ANDMask.value,10));
	req.add ("WEBVAR_EVTDATA1COMP1", parseInt(txtEvent1Compare1.value,10));
	req.add ("WEBVAR_EVTDATA1COMP2", parseInt(txtEvent1Compare2.value,10));
	req.add ("WEBVAR_EVTDATA2AND", parseInt(txtEvent2ANDMask.value,10));
	req.add ("WEBVAR_EVTDATA2COMP1", parseInt(txtEvent2Compare1.value,10));
	req.add ("WEBVAR_EVTDATA2COMP2", parseInt(txtEvent2Compare2.value,10));
	req.add ("WEBVAR_EVTDATA3AND", parseInt(txtEvent3ANDMask.value,10));
	req.add ("WEBVAR_EVTDATA3COMP1", parseInt(txtEvent3Compare1.value,10));
	req.add ("WEBVAR_EVTDATA3COMP2", parseInt(txtEvent3Compare2.value,10));

	req.send();
	delete req;
}

/*
 * This is the response function for setPEFCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set Event Filter configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setPEFRes(arg) {
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_PEF_CFGINFO");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert(eLang.getString("common", "STR_CONF_PEF_SUCCESS_" + 
			EventFilterOper));
		wnd.close();
	}
}
