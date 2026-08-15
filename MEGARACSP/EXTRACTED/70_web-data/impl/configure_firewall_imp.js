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

// File Name  : configure_firewall_imp.js
// Brief      : This implementation is used to display System firewall
// configurations. It lists all the firewall Settings, IP and Port rules in list grid.
// Author Name: Sakthivel. R

var varFwallType;		//Integer to hold the firewall type(IP or Port or Settings)
var CONST_IP = 0x1;		//Constant to hold the firewall IP type
var CONST_PORT = 0x2;	//Constant to hold the firewall Port type
var CONST_SETTINGS = 0x3; //Constant to hold the firewall Settings type
var STARTYEAR = 2005;		//It is used to hold the Default start year
var ENDYEAR = 2038;			//It is used to hold the Default end year
var preserveYear;	//Holds the year value
var fmtStartDateTime = ""; //It used to hold the date and time format
var fmtEndDateTime = "";	//It used to hold the date and time format
var SYSTEM_FIREWALL_TIMEOUT = false; // It holds the feature for firewall with timeout support

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {	// TODO: add page initialization code
	exposeElms([
		"_btnAdvSettings",
		"_tblTab",
		"_fwallSettings",
		"_fwallIP",
		"_fwallPort",
		"_lblHeader",
		"_listGridHolder",
		"_btnAdd",
		"_btnDelete"
	]);

	if (top.user.isOperator()) {
		disableActions();
	} else if (!top.user.isAdmin()) {
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}

	fwallIP.onclick = doFirewallIP;
	fwallPort.onclick = doFirewallPorts;
	btnAdvSettings.onclick = addFirewallSettings;
	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 * Also initiate the Defautl tab based on the project settings.
 */
function _begin() {
	var i = 0;	//Loop counter
	SYSTEM_FIREWALL_TIMEOUT = checkProjectCfg("SYSTEM_FIREWALL_TIMEOUT");
	if (SYSTEM_FIREWALL_TIMEOUT) {
		fwallSettings.onclick = doFirewallSettings;
	} else {
		while(i < 3) {
			try {
				tblTab.rows[0].deleteCell(0);
				tblTab.rows[1].deleteCell(0);
				i++;
			} catch (e) {
				continue;
			}
		}
		getFirewallCfg();
	}
	var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
	if (tabLastVisit != null) {
		$(tabLastVisit).onclick();
	} else {
		if (SYSTEM_FIREWALL_TIMEOUT) {
			doFirewallSettings();
		} else {
			doFirewallIP();
		}
	}
	if (SYSTEM_FIREWALL_TIMEOUT) {
		xmit.get({url:"/rpc/getdatetime.asp", onrcv:getDateTimeRes, status:""});
	}
	fmtStartDateTime = eLang.getString("common", "STR_CONF_FWALL_START_TIME") + 
		"<span class='dateFormat'> "+ eLang.getString("common", "STR_CONF_FWALL_TIME_FORMAT") +"</span>";
	fmtEndDateTime = eLang.getString("common", "STR_CONF_FWALL_END_TIME") + 
		"<span class='dateFormat'> "+ eLang.getString("common", "STR_CONF_FWALL_TIME_FORMAT") +"</span>";
}

/*
 * This function is used to clear all the UI settings and used to 
 * assign the button handler events as null by default.
 */
function clearUI() {
	fwallIP.style.fontWeight = "normal";
	fwallPort.style.fontWeight = "normal";
	fwallSettings.style.fontWeight = "normal";
	listGridHolder.innerHTML = "";
	lblHeader.innerHTML = "";
	btnAdd.onclick = function(){};
	btnDelete.onclick = function(){};
}

/*
 * This function is used to disable UI buttons based on the 
 * firewall rule configurations.
 */
function disableButtons() {
	btnAdd.disabled = true;
	btnDelete.disabled = true;
}

/*
 * This function is used to design the Start Date and Time UI controls for the 
 * firewall rule configurations.
 */
function loadStartDateTime() {
	table =  document.createElement("table");
	var tbody = document.createElement("tbody");
	var tr = document.createElement("tr");
	var SecFromDate = document.createElement("td");
	var lstFromDate = document.createElement("select");
	lstFromDate.id = "lstFromDate";

	var SecFromMonth = document.createElement("td");
	var lstFromMonth = document.createElement("select");
	lstFromMonth.id = "lstFromMonth";

	var SecFromYear = document.createElement("td");
	var lstFromYear = document.createElement("select");
	lstFromYear.id = "lstFromYear";

	var Separator = document.createElement("td");
	var lblSpace = document.createElement("label");
	lblSpace.innerHTML = " - ";

	var SecFromHour = document.createElement("td");
	var lstFromHour = document.createElement("select");
	lstFromHour.id = "lstFromHour";

	var SecFromMinute = document.createElement("td");
	var lstFromMinute = document.createElement("select");
	lstFromMinute.id = "lstFromMinute";

	SecFromDate.appendChild(lstFromDate);
	SecFromMonth.appendChild(lstFromMonth);
	SecFromYear.appendChild(lstFromYear);
	SecFromHour.appendChild(lstFromHour);
	SecFromMinute.appendChild(lstFromMinute);
	Separator.appendChild(lblSpace);

	tr.appendChild(SecFromDate);
	tr.appendChild(SecFromMonth);
	tr.appendChild(SecFromYear);
	tr.appendChild(Separator);
	tr.appendChild(SecFromHour);
	tr.appendChild(SecFromMinute);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	startDate.appendChild(table);
	loadEndDateTime();
}

/*
 * This function is used to design the End Date and Time UI controls for the 
 * firewall rule configurations.
 */
function loadEndDateTime() {
	table =  document.createElement("table");
	var tbody = document.createElement("tbody");
	var tr = document.createElement("tr");
	var SecToDate = document.createElement("td");
	var lstToDate = document.createElement("select");
	lstToDate.id = "lstToDate";

	var SecToMonth = document.createElement("td");
	var lstToMonth = document.createElement("select");
	lstToMonth.id = "lstToMonth";

	var SecToYear = document.createElement("td");
	var lstToYear = document.createElement("select");
	lstToYear.id = "lstToYear";

	var Separator = document.createElement("td");
	var lblSpace = document.createElement("label");
	lblSpace.innerHTML = " - ";

	var SecToHour = document.createElement("td");
	var lstToHour = document.createElement("select");
	lstToHour.id = "lstToHour";

	var SecToMinute = document.createElement("td");
	var lstToMinute = document.createElement("select");
	lstToMinute.id = "lstToMinute";

	SecToDate.appendChild(lstToDate);
	SecToMonth.appendChild(lstToMonth);
	SecToYear.appendChild(lstToYear);
	SecToHour.appendChild(lstToHour);
	SecToMinute.appendChild(lstToMinute);
	Separator.appendChild(lblSpace);

	tr.appendChild(SecToDate);
	tr.appendChild(SecToMonth);
	tr.appendChild(SecToYear);
	tr.appendChild(Separator);
	tr.appendChild(SecToHour);
	tr.appendChild(SecToMinute);

	tbody.appendChild(tr);
	table.appendChild(tbody);
	endDate.appendChild(table);
	loadDateTime();
}

/*
 * This function is used to extract the DOM elements and load the default 
 * values for the date and time UI controls.
 */
function loadDateTime() {
	lstFromDate = $("lstFromDate");
	lstToDate	= $("lstToDate");
	lstFromMonth = $("lstFromMonth");
	lstToMonth = $("lstToMonth");
	lstFromYear = $("lstFromYear");
	lstToYear = $("lstToYear");
	lstFromHour = $("lstFromHour");
	lstToHour = $("lstToHour");
	lstFromMinute = $("lstFromMinute");
	lstToMinute = $("lstToMinute");

	loadDate();
	loadMonth();
	loadYear();
	loadHour();
	loadMinute();
	preserveDateTime();
}

/*
 * This is the response function for getDateTime RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI.
 * @param arg object, RPC response data from xmit library
 */
function getDateTimeRes(arg) {
	var clientDateObject; //It used to hold the date and time value
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DATE_TIME_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DATETIMECFG = WEBVAR_JSONVAR_GETDATETIME.WEBVAR_STRUCTNAME_GETDATETIME[0];
		if (DATETIMECFG != null && DATETIMECFG != undefined) {
			clientDateObject = new Date(DATETIMECFG.SECONDS * 1000);	//Date object requires milliseconds
			preserveYear = clientDateObject.getUTCFullYear();
			if ((preserveYear < STARTYEAR) || (preserveYear > ENDYEAR)) {
				alert (eLang.getString("common", "STR_CONF_NTP_DATE_RANGE"));
			}
			preserveMonth = clientDateObject.getUTCMonth();
			preserverDay = clientDateObject.getUTCDate();
			preserveHrs = clientDateObject.getUTCHours();
			preserveMins = clientDateObject.getUTCMinutes();
		}
	}
}

/*
 * This function is used to load date value in the UI controls
 */
function loadDate() {
	var optind = 0; //Loop counter
	var dat;	//Loop counter

	for (dat = 1; dat <= 31; dat++) {
		lstFromDate.add(new Option(dat,dat),isIE?optind++:null);
		lstToDate.add(new Option(dat,dat),isIE?optind++:null);
	}
}

/*
 * This function is used to load month value in the UI controls
 */
function loadMonth() {
	var optind = 0;	//Loop counter
	var month = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	for (mon = 0; mon < 12; mon++) {
		lstFromMonth.add(new Option(month[mon], (mon+1)), isIE?optind++:null);
		lstToMonth.add(new Option(month[mon], (mon+1)), isIE?optind++:null);
	}
}

/*
 * This function is used to load year value in the UI controls
 */
function loadYear() {
	var year;	//Loop counter
	var optind = 0;	//Loop counter

	for (year = STARTYEAR; year <= ENDYEAR; year++) {
		lstFromYear.add(new Option(year, year), isIE?optind++:null);
		lstToYear.add(new Option(year, year), isIE?optind++:null);
	}
}

/*
 * This function is used to load hour value in the UI controls
 */
function loadHour() {
	var optind = 0;	//Loop counter

	for (hour = 0; hour <= 23; hour++) {
		lstFromHour.add(new Option(hour, hour), isIE?optind++:null);
		lstToHour.add(new Option(hour, hour), isIE?optind++:null);
	}
}

/*
 * This function is used to load minutue value in the UI controls
 */
function loadMinute() {
	var optind = 0;	//Loop counter

	for (min = 0; min <= 59; min++) {
		lstFromMinute.add(new Option(min, min), isIE?optind++:null);
		lstToMinute.add(new Option(min, min), isIE?optind++:null);
	}
}

/*
 * This function is used to preserve the date and time to respective UI Controls.
 */
function preserveDateTime() {
	lstFromYear.value = fillSelectBox(lstFromYear, preserveYear);
	lstToYear.value = fillSelectBox(lstToYear, preserveYear);
	lstFromMonth.value = fillSelectBox(lstFromMonth, (preserveMonth+1));
	lstToMonth.value = fillSelectBox(lstToMonth, (preserveMonth+1));
	lstFromDate.value = fillSelectBox(lstFromDate, preserverDay);
	lstToDate.value = fillSelectBox(lstToDate, preserverDay);
	lstFromHour.value = fillSelectBox(lstFromHour, preserveHrs);
	lstToHour.value = fillSelectBox(lstToHour, preserveHrs);
	lstFromMinute.value = fillSelectBox(lstFromMinute, preserveMins);
	lstToMinute.value = fillSelectBox(lstToMinute, preserveMins);
}

/*
 * This function is used to frame the start date and time formate in the Listgrid.
 * @param datetime object, date and time value from xmit library
 * @return DateTime string, Date and time format string
 */
function doStartDateTime(datetime) {
	var DateTime = ""; //Used to hold the Date and Time format
	DateTime = datetime.DATEFROMDD + "/" + datetime.DATEFROMMM + "/" +
	datetime.DATEFROMYY + " " + (datetime.TIMEFROMHH = (datetime.TIMEFROMHH < 10) ? 
		("0" + datetime.TIMEFROMHH) : datetime.TIMEFROMHH) + ":" + 
	(datetime.TIMEFROMMM = (datetime.TIMEFROMMM < 10) ? 
		("0" + datetime.TIMEFROMMM) : datetime.TIMEFROMMM);
	return DateTime;
}

/*
 * This function is used to frame the end date and time formate in the Listgrid.
 * @param datetime object, date and time value from xmit library
 * @return DateTime string, Date and time format string
 */
function doEndDateTime(datetime) {
	var DateTime = "";	//Used to hold the Date and Time format
	DateTime = datetime.DATETODD + "/" + datetime.DATETOMM + "/" +
	datetime.DATETOYY + " " + (datetime.TIMETOHH = (datetime.TIMETOHH < 10) ? 
		"0" + datetime.TIMETOHH : datetime.TIMETOHH) + ":" + 
	(datetime.TIMETOMM = (datetime.TIMETOMM < 10) ? 
		("0" + datetime.TIMETOMM) : datetime.TIMETOMM);
	return DateTime;
}

/*
 * This function is used to enable/disable the Date and Time controls 
 * based on the timeout status.
 */
function enableTimeSettings() {
	if (top.user.isAdmin()) {
		var bopt = !chkFwallTimeout.checked;
		lstFromDate.disabled = bopt;
		lstFromMonth.disabled = bopt;
		lstFromYear.disabled = bopt;
		lstFromHour.disabled = bopt;
		lstFromMinute.disabled = bopt;
		
		lstToDate.disabled = bopt;
		lstToMonth.disabled = bopt;
		lstToYear.disabled = bopt;
		lstToHour.disabled = bopt;
		lstToMinute.disabled = bopt;
	}
}

/*
 * This function is used to validate the Date and time settings.
 */
function validateDateTime(date, month, year, hour, minute) {
	var seconds = 0;	//If NTP is enabled, then we should not save Date/Time Configuration
	var timeStamp;
	if (chkFwallTimeout.checked) {
	if ((month) == 2) {
		if((year)%4 == 0) {
			if((date) > 29) {
				alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") + 
					eLang.getString("common", "STR_CONF_NTP_INVALID_LEAP"));
				return false;
			}
		} else {
			if((date) > 28) {
				alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") + 
					eLang.getString("common", "STR_CONF_NTP_INVALID_FEB"));
				return false;
			}
		}
	} else if (((month) == 4)  || ((month) == 6) || ((month) == 9) || ((month) == 11)) {
		if ((date) > 30) {
			alert(eLang.getString("common", "STR_CONF_NTP_INVALID_DATE") + 
				eLang.getString("common", "STR_CONF_NTP_INVALID_MONTH"));
			return false;
		}
	}
	var timeStamp = Date.UTC(year, month, date, hour, minute);
		seconds = (timeStamp/1000);	//To milliseconds to seconds
		if (seconds > Math.pow(2,31)) {		//Check for Year 2038 Problem exact value
			alert(eLang.getString("common","STR_CONF_NTP_INVALID_DATE") + 
				eLang.getString("common","STR_HELP_INFO"));
			return false;
		}
	}
	return true;
}

/*
 * This method is used to compare the start time and end time settings to ensure
 * no overlap.
 */
 function compareDateTime() {
	if (chkFwallTimeout.checked) {
		if (lstFromYear.value > lstToYear.value) {
			alert(eLang.getString("common", "STR_CONF_FWALL_TIME_ERROR_1"));
			return false;
		}
		
		if( ( parseInt(lstFromYear.value)==parseInt(lstToYear.value) ) && ( parseInt(lstFromMonth.value)>parseInt(lstToMonth.value) ) ) {
			alert(eLang.getString("common", "STR_CONF_FWALL_TIME_ERROR_2"));
			return false;
		}
		if( ( parseInt(lstFromYear.value)==parseInt(lstToYear.value) ) && ( parseInt(lstFromMonth.value)==parseInt(lstToMonth.value) ) && ( parseInt(lstFromDate.value)>parseInt(lstToDate.value) ) )
		{
			alert(eLang.getString("common", "STR_CONF_FWALL_TIME_ERROR_2"));
			return false;
		}
		if( ( parseInt(lstFromYear.value)==parseInt(lstToYear.value) ) && ( parseInt(lstFromMonth.value)==parseInt(lstToMonth.value) ) && ( parseInt(lstFromDate.value)==parseInt(lstToDate.value) ) && ( parseInt(lstFromHour.value)>parseInt(lstToHour.value) ) )
		{
			alert(eLang.getString("common", "STR_CONF_FWALL_TIME_ERROR_2"));
			return false;
		}
		if( ( parseInt(lstFromYear.value)==parseInt(lstToYear.value) ) && ( parseInt(lstFromMonth.value)==parseInt(lstToMonth.value) ) && ( parseInt(lstFromDate.value)==parseInt(lstToDate.value) ) && ( parseInt(lstFromHour.value)==parseInt(lstToHour.value) ) && ( parseInt(lstFromMinute.value)>parseInt(lstToMinute.value) ) )
		{
			alert(eLang.getString("common", "STR_CONF_FWALL_TIME_ERROR_2"));
			return false;
		}
		else {
			return true;
		}
		
	}
	return true;
}
