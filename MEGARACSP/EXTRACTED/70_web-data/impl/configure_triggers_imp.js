//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2012-2015        **;
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

// File Name  : configure_triggers_imp.js
// Brief      : This implementation is to display and configure the event 
// triggers available for Auto Video Recording feature in BMC.
// Author Name: Kirankumar B

var TRIGCFG_DATA;			//It holds the get RPC Event Triggers response data
var SERVICE_DATA;			//It is used to hold the Service configuration RPC response
var TIMESTAMP_EVENT = (9 - 1);	//Index starts with 0, TimeStamp event is 8.
var PRE_EVENTS = (11 - 1);			//Index starts with 0, PreEvent is 10.
var STARTYEAR = 2005;		//It is used to hold the Default start year
var ENDYEAR = 2038;			//It is used to hold the Default end year
var DATETIMECFG;	//It is used to hold the Date and Time RPC response
var seconds;		//It is used to hold the Trigger video date and time in seconds
var clientSeconds;	//It is used to hold the System date and time in seconds
var preserveYear;	//Holds the year value
/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
/*function doInit()
{
	exposeElms([
		"_tblAutoVideoEvents",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = validateTimeStamp;
		btnReset.onclick = reloadTriggerCfg;
	} else if (top.user.isOperator()) {
		disableActions();
	} else {
		alert(eLang.getString("common","STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}
	_begin();
}*/

/*
 * It will invoke the RPC method to get the event trigger data for the page.
 */
/*function _begin()
{	
	getSystemDateTime();
}*/

/*
 * It will invoke the RPC method to get date and time configuration.
 * Once it gets response from RPC, on receive method will be called automatically.
 */
function getSystemDateTime() {
	//alert("in getSystemDateTime");
	xmit.get({url:"/rpc/getdatetime.asp", onrcv:getSystemDateTimeRes, status:""});
}

/*
 * This is the response function for getSystemDateTime RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSystemDateTimeRes(arg) {
	var clientDateObject; //It used to hold the date and time

	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DATE_TIME_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DATETIMECFG = WEBVAR_JSONVAR_GETDATETIME.WEBVAR_STRUCTNAME_GETDATETIME[0];

		clientSeconds = DATETIMECFG.SECONDS;
		clientDateObject = new Date(clientSeconds * 1000);		//Date object requires milliseconds
		preserveYear = clientDateObject.getUTCFullYear();
		if ((preserveYear < STARTYEAR) || (preserveYear > ENDYEAR)) {
			alert (eLang.getString("common", "STR_CONF_NTP_DATE_RANGE"));
		}
	}
	if(autoVideoRecording.style.fontWeight=="bold") {
		getTriggerCfg();
		getServiceCfg();
	} else if(autoSOLRecording.style.fontWeight=="bold") {
		getSOLTriggerCfg();
	}
}

/*
 * It will invoke the RPC method to get all event trigger configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getTriggerCfg()
{
	xmit.get({url:"/rpc/gettriggercfg.asp", onrcv:getTriggerCfgRes, status:""});
}

/*
 * This is the response function for getTriggerCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getTriggerCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_TRIG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		TRIGCFG_DATA = WEBVAR_JSONVAR_GETTRIGCFG.WEBVAR_STRUCTNAME_GETTRIGCFG;
		designTriggerCfg();
		reloadTriggerCfg();
	}
}

/*
* It will invoke the RPC method to get all SOL event trigger configuration.
* Once it get response from RPC, on receive method will be called automatically.
*/
function getSOLTriggerCfg()
{
	xmit.get({url:"/rpc/getsoltriggercfg.asp", onrcv:getSOLTriggerCfgRes, status:""});
}
/*
 * This is the response function for getSOLTriggerCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSOLTriggerCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_SOL_TRIG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		TRIGCFG_DATA = WEBVAR_JSONVAR_GETSOLTRIGCFG.WEBVAR_STRUCTNAME_GETSOLTRIGCFG;
		designTriggerCfg();
		reloadTriggerCfg();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadTriggerCfg()
{
	var i;		//loop counter
	for(i = 0; i < TRIGCFG_DATA.length; i++) {
		try {
			$("_chkTrigEnable" + i).checked = (TRIGCFG_DATA[i].ENABLE) ? true : false;
		} catch(e) {
			continue;
		}
	}
	reloadTimestamp();
	reloadPreEvents();
	enablePreEvents();
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function reloadTimestamp()
{
	var timeStamp;
	var yearCheck;
	var monCheck;
	var dayCheck;
	var hrsCheck;
	var minsCheck;
	var secsCheck;

	//Date object requires milliseconds
	timeStamp = new Date(TRIGCFG_DATA[TIMESTAMP_EVENT].TIMESTAMP * 1000);
	yearCheck = timeStamp.getUTCFullYear();
	if ((yearCheck >= STARTYEAR) && (yearCheck <= ENDYEAR)) {
		lstYear.value = yearCheck;
	} else {
		lstYear.value = STARTYEAR;
	}

	monCheck = timeStamp.getUTCMonth();
	if ((monCheck >= 0) && (monCheck <= 11)) {
		lstMonth.value = monCheck;
	} else {
		lstMonth.value = 0;
	}

	dayCheck = timeStamp.getUTCDate();
	if ((dayCheck >= 1) && (dayCheck <= 31)) {
		lstDate.value = dayCheck;
	} else {
		lstDate.value = 1;
	}
	hrsCheck = timeStamp.getUTCHours();
	minsCheck = timeStamp.getUTCMinutes();
	secsCheck = timeStamp.getUTCSeconds();
	if ((!isNaN(hrsCheck)) && (!isNaN(minsCheck)) && (!isNaN(secsCheck))) {
		txtHour.value = ((hrsCheck < 10) ? "0" : "") + hrsCheck;
		txtMinute.value = ((minsCheck < 10) ? "0" : "") + minsCheck;
		txtSecond.value = ((secsCheck < 10) ? "0" : "") + secsCheck;
	}
	enableTimeStamp();
}

function reloadPreEvents() {
	if ($("_chkTrigEnable" + PRE_EVENTS).checked) {
		try {
			(TRIGCFG_DATA[PRE_EVENTS].ENABLE == 1) ? 
				(rdoPreCrash.checked = true) : (rdoPreReset.checked = true);
		} catch(e) {
		}
	}
}

/*
 * It will validate the data of all user controls before saving it.
 */
function validateTimeStamp()
{
	if ($("_chkTrigEnable" + TIMESTAMP_EVENT).checked) {
		if(!eVal.isnumstr(txtHour.value, 0, 23)) {
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_HOUR"));
			txtHour.focus();
			return;
		}
		if(!eVal.isnumstr(txtMinute.value, 0, 59)) {
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_MINS"));
			txtMinute.focus();
			return;
		}
		if(!eVal.isnumstr(txtSecond.value, 0, 59)) {
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_SECS"));
			txtSecond.focus();
			return;
		}
		
		if(lstMonth.value == 1) {//Check for February
			if((lstYear.value % 4) == 0) {
				if(lstDate.value > 29) {
					alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") +
						eLang.getString("common", "STR_CONF_NTP_INVALID_LEAP"));
					return;
				}
			} else {
				if(lstDate.value > 28) {
					alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") +
						eLang.getString("common", "STR_CONF_NTP_INVALID_FEB"));
					return;
				}
			}
		} else if((lstMonth.value == 3)  || (lstMonth.value == 5) || 
			(lstMonth.value == 8) || (lstMonth.value == 10)) {
			if(lstDate.value > 30) {
				alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") +
					eLang.getString("common", "STR_CONF_NTP_INVALID_MONTH"));
				return;
			}
		}
	
		/*
		 * Check for unix timestamp, Check upto 18th January 2038 (Year 2038 Problem)
		 */
		if((lstMonth.value == 0) && (lstDate.value >= 19) &&
			(lstYear.value == ENDYEAR)) {
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") +
				eLang.getString("common", "STR_CONF_TRIG_YEAR2038"));
			return;
		}
		var chkSeconds = Date(lstYear.value, lstMonth.value, lstDate.value, 
			parseInt(txtHour.value, 10), parseInt(txtMinute.value, 10),
			parseInt(txtSecond.value, 10));
		chkSeconds /= 1000;		//To milliseconds to seconds
		if (chkSeconds > Math.pow(2,31)){	//Check for Year 2038 Problem exact value
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") +
				eLang.getString("common", "STR_CONF_TRIG_YEAR2038"));
			return;
		}
		//Compare date and time with system date and time
		seconds = Date.UTC(lstYear.value, lstMonth.value, lstDate.value, 
			parseInt(txtHour.value, 10), parseInt(txtMinute.value, 10),
			parseInt(txtSecond.value, 10), 0);
		seconds /= 1000;	//To milliseconds to seconds

		if (clientSeconds > seconds)  {
				alert(eLang.getString("common", "STR_CONF_TRIG_EVT_ERR9"));
			return;
		}
	}
	if(autoVideoRecording.style.fontWeight=="bold") {
		setTriggerCfg();
	} else if(autoSOLRecording.style.fontWeight=="bold") {
		setSOLTriggerCfg();
	}
}

/*
 * It will invoke the RPC method to set all event trigger configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setTriggerCfg()
{
	var req;	//xmit object to send RPC request with parameters
	var i;		//loop counter
	var data;	//Variable to hold the all event status
	var count = 0;	//Variable to hold total events
	var selected_event = "";	//Var to hold the selected event trigger entries

	req = new xmit.getset({url:"/rpc/settriggercfg.asp", 
		onrcv:setTriggerCfgRes, status:""});
	for(i = 0; i < TRIGCFG_DATA.length; i++) {
		try {
			data = ($("_chkTrigEnable" + i).checked) ? 1 : 0;
			if (i == PRE_EVENTS) {
				try {
					data = (($("_chkTrigEnable" + i).checked) ?
						(rdoPreCrash.checked ? 1 : (rdoPreReset.checked ? 2 : 0)) : 0);
				} catch(e) {}
			}

			selected_event += data + ",";
			count++;
		} catch(e) {
			continue;
		}
	}
	req.add("SELECTED_EVENT", selected_event);
	req.add("COUNT", count);

	if ($("_chkTrigEnable" + TIMESTAMP_EVENT).checked) {
		req.add("TIMESTAMP", seconds);
	}
	req.send();
	delete req;
}

/*
 * This is the response function for setTriggerCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting network bonding configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setTriggerCfgRes(arg)
{
	var errstr;		//Error string
	var i;		//loop counter

	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_TRIG_SETVAL");
		STATUS_DATA = WEBVAR_JSONVAR_SETTRIGCFG.WEBVAR_STRUCTNAME_SETTRIGCFG;
		for(i = 0; i < STATUS_DATA.length; i++) {
			if (STATUS_DATA[i].STATUS != 0) {
				errstr += eLang.getString("common", "STR_NEWLINE");
				errstr += eLang.getString("common", "STR_CONF_TRIG_EVT" + i);
				if ((i == TIMESTAMP_EVENT) && 
					(GET_ERROR_CODE(STATUS_DATA[i].STATUS) == 0x93)) {
					//Check for TimeStamp invalid data
					errstr += " - " + eLang.getString("common", 
						"STR_CONF_TRIG_EVT_ERR" + TIMESTAMP_EVENT);
				}
			}
		}
		alert(errstr);
	} else {
		errstr = eLang.getString("common", "STR_CONF_TRIG_SUCCESS");
		errstr += (SERVICE_DATA.STATE) ? "" : eLang.getString("common",
			"STR_CONF_TRIG_KVMDISABLE");
		alert(errstr);
	}
	getTriggerCfg();
}

/*
 * It will invoke the RPC method to set all SOL event trigger configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setSOLTriggerCfg()
{
	var req;	//xmit object to send RPC request with parameters
	var i;		//loop counter
	var data;	//Variable to hold the all event status
	var count = 0;	//Variable to hold total events
	var selected_event = "";	//Var to hold the selected event trigger entries

	req = new xmit.getset({url:"/rpc/setsoltriggercfg.asp", 
		onrcv:setSOLTriggerCfgRes, status:""});
	for(i = 0; i < TRIGCFG_DATA.length; i++) {
		try {
			data = ($("_chkTrigEnable" + i).checked) ? 1 : 0;
			/*if (i == PRE_EVENTS) {
				try {
					data = (($("_chkTrigEnable" + i).checked) ?
						(rdoPreCrash.checked ? 1 : (rdoPreReset.checked ? 2 : 0)) : 0);
				} catch(e) {}
			}*/
			selected_event += data + ",";
			count++;
		} catch(e) {
			continue;
		}
	}
	req.add("SELECTED_EVENT", selected_event);
	req.add("COUNT", count);

	if ($("_chkTrigEnable" + TIMESTAMP_EVENT).checked) {
		req.add("TIMESTAMP", seconds);
	}
	req.send();
	delete req;
}
/*
 * This is the response function for setTriggerCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting network bonding configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setSOLTriggerCfgRes(arg)
{
	var errstr;		//Error string
	var i;		//loop counter

	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_SOL_TRIG_SETVAL");
		STATUS_DATA = WEBVAR_JSONVAR_SETSOLTRIGCFG.WEBVAR_STRUCTNAME_SETSOLTRIGCFG;
		for(i = 0; i < STATUS_DATA.length; i++) {
			if (STATUS_DATA[i].STATUS != 0) {
				errstr += eLang.getString("common", "STR_NEWLINE");
				errstr += eLang.getString("common", "STR_CONF_TRIG_EVT" + i);
				if ((i == TIMESTAMP_EVENT) && 
					(GET_ERROR_CODE(STATUS_DATA[i].STATUS) == 0x93)) {
					//Check for TimeStamp invalid data
					errstr += " - " + eLang.getString("common", 
						"STR_CONF_TRIG_EVT_ERR" + TIMESTAMP_EVENT);
				}
			}
		}
		alert(errstr);
	} else {
		errstr = eLang.getString("common", "STR_CONF_SOL_TRIG_SUCCESS");
		/*errstr += (SERVICE_DATA.STATE) ? "" : eLang.getString("common",
			"STR_CONF_TRIG_KVMDISABLE");*/
		alert(errstr);
	}
	getSOLTriggerCfg();
}
/*
 * It will design the needed check boxes based on RPC response in UI.
 */
function designTriggerCfg()
{
	var rowCount = 0;	//Row count
	var celIndex = 0;	//Cell index
	var i;		//loop counter
	tblEvents=tblAutoVideoEvents;
	clearTable(tblEvents);
	rowCount = Math.floor(TRIGCFG_DATA.length / 2) + (TRIGCFG_DATA.length % 2);
	for(i = 0; i < rowCount; i++) {
		rowEvent = tblEvents.insertRow(i);
		//Check boxed to be drawn in left side
		celIndex = i + i;
		celLeft = rowEvent.insertCell(0);
		if (celIndex != PRE_EVENTS) {
			tagCheckbox = "<input type='checkbox' id='_chkTrigEnable" + celIndex + 
				"'>&nbsp;<strong><label for='_chkTrigEnable" + celIndex + "'>" + 
				eLang.getString("common", "STR_CONF_TRIG_EVT" + celIndex) + 
				"</label></strong>";
			celLeft.innerHTML = tagCheckbox;
		}
		if (celIndex == TIMESTAMP_EVENT) {
			celLeft.innerHTML += designTimestamp();
			lstDate = $("_lstDate");
			lstMonth = $("_lstMonth");
			lstYear = $("_lstYear");
			txtHour = $("_txtHour");
			txtMinute = $("_txtMinute");
			txtSecond = $("_txtSecond");
			initTimestamp();
			$("_chkTrigEnable" + TIMESTAMP_EVENT).onclick = enableTimeStamp;
		}
		if(autoVideoRecording.style.fontWeight=="bold") {
			if (celIndex == PRE_EVENTS) {
				tagCheckbox = "<input type='checkbox' id='_chkTrigEnable" + celIndex + 
					"'>&nbsp;<strong><a href='configure_pre_events.html'><label" +
					"style='cursor:pointer;' for='_chkTrigEnable" + celIndex + "'>" + 
					eLang.getString("common", "STR_CONF_TRIG_EVT" + celIndex) + 
					"</label></a></strong>";
				celLeft.innerHTML = tagCheckbox;
	
				celLeft.innerHTML += designPreEvent();
				rdoPreCrash = $("_rdoPreCrash");
				rdoPreReset = $("_rdoPreReset");
				$("_chkTrigEnable" + PRE_EVENTS).onclick = enablePreEvents;
			}
		}

		//Check boxed to be drawn in right side
		celIndex++;
		if (celIndex < TRIGCFG_DATA.length) {
			celRight = rowEvent.insertCell(1);
			tagCheckbox = "<input type='checkbox' id='_chkTrigEnable" + celIndex + 
				"'>&nbsp;<strong><label for='_chkTrigEnable" + celIndex + "'>" + 
				eLang.getString("common", "STR_CONF_TRIG_EVT" + celIndex) + 
				"</label></strong>";
			celRight.innerHTML = tagCheckbox;
		}
	}
}

/*
 * It will design the Time stamp control includes Date, Month, Year, Hours, 
 * Minutes and Seconds for event which needs time stamp control, based on RPC 
 * response in UI.
 */
function designTimestamp()
{
	var tagTimestampTbl;
	tagTimestampTbl = "<br><table cellspacing='2' cellpadding='5' border='0' width='500'>" +
		"<tr><td>&nbsp;&nbsp;&nbsp;&nbsp<strong>Date:</strong></td><td>" +
		"<select id='_lstMonth' class='classicTxtBox'></select> &nbsp;" +
		"<select id='_lstDate' class='smallclassicTxtBox'></select> &nbsp;" +
		"<select id='_lstYear' class='smallclassicTxtBox'></select>" +
		"</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp<strong>Time:</strong><br>" +
		"&nbsp;&nbsp;&nbsp;&nbsp<em>(hh:mm:ss)</em></td><td>" +
		"<input type='text' maxlength='2' style='text-align:center;'" +
		" id='_txtHour' class='smallclassicTxtBox'/> &nbsp;" +
		"<input type='text' maxlength='2' style='text-align:center;'" +
		" id='_txtMinute' class='smallclassicTxtBox'/> &nbsp;" +
		"<input type='text' maxlength='2' style='text-align:center;'" +
		" id='_txtSecond' class='smallclassicTxtBox'/>" +
		"</td></tr></table>";
	return tagTimestampTbl;
}

/*
 * It will design the Pre-event video recording control includes Pre-reset and  
 * Pre-crash controls event which needs  Pre-event video recording control, based on RPC 
 * response in UI.
 */
function designPreEvent() {
	var tagPreEventData;
	tagPreEventData = "<br>&nbsp;&nbsp;&nbsp;&nbsp " +
		"<input type='radio' id='_rdoPreCrash' name='_rdoPreEventRecord'> " +
		"<label for='_rdoPreCrash'>Pre-crash</label>&nbsp;&nbsp " +
		"<input type='radio' id='_rdoPreReset' name='_rdoPreEventRecord'> " +
		"<label for='_rdoPreReset'>Pre-reset</label>&nbsp;&nbsp";
	return tagPreEventData;
}

/*
 * It will initialize the Time stamp control for Year, Month and Year.
 */
function initTimestamp()
{
	var month = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	optind = 0;
	for (i = 1; i <= 31; i++) {
		lstDate.add(new Option(i, i), isIE?optind++:null);
	}

	for (i = 0; i < 12; i++) {
		lstMonth.add(new Option(month[i], i), isIE?i:null);
	}

	optind = 0;
	for (i = preserveYear = (preserveYear != undefined || 
		preserveYear != null) ? preserveYear : STARTYEAR; i <= ENDYEAR; i++) {
		lstYear.add(new Option(i, i), isIE?optind++:null);
	}
}

/*
 * This will enable or disable the Timestamp UI controls based on the Timestamp 
 * event check box value.
 */
function enableTimeStamp()
{
	var bopt;
	if(top.user.isAdmin()) {
		bopt = !$("_chkTrigEnable" + TIMESTAMP_EVENT).checked;
		lstMonth.disabled = bopt;
		lstDate.disabled = bopt;
		lstYear.disabled = bopt;
		txtHour.disabled = bopt;
		txtMinute.disabled = bopt;
		txtSecond.disabled = bopt;
	}
}

/*
 * This will enable or disable the Pre-event video recording controls 
 * based on the Pre-event video recording check box value.
 */
function enablePreEvents() {
	var bopt = !$("_chkTrigEnable" + PRE_EVENTS).checked;
	rdoPreCrash.disabled = bopt;
	rdoPreReset.disabled = bopt;
	if (bopt) {
		rdoPreCrash.checked = rdoPreReset.checked = !bopt
	} else if (!bopt && !rdoPreCrash.checked && !rdoPreReset.checked) {
		rdoPreCrash.checked = !bopt;
	}
}

/*
 * It will invoke the RPC method to get the service configuration.
 * Once it get data from RPC, response function will be called automatically. 
 */
function getServiceCfg()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/getservicecfg.asp", onrcv:getServiceCfgRes,
		status:""});
	req.add("SERVICEBIT", top.CONSTANTS.KVM_SERVICE_ID_BIT);
	req.send();
	delete req;
}

/*
 * This is the response function for getServiceCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI.
 * @param arg object, RPC response data from xmit library
 */
function getServiceCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_SERVICES_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SERVICE_DATA = WEBVAR_JSONVAR_GETSERVICECFG.WEBVAR_STRUCTNAME_GETSERVICECFG[0];
	}
}
