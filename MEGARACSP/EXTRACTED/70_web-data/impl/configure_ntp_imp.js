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

//initialize the global variables
/*The following list variables are to preserve the Date, Time, Time Zone & NTP configuration*/
var preserveMonth;
var preserveDate;
var preserveYear;
var preserveHour;
var preserveMinute;
var preserveSecond;
var preserveUTCTzone;
var preserveNTPEnable;

var CONST_AUTO = 1;
var CONST_MANUAL = 0;
var CONST_FAILURE = 2;
var TIMEZONE_SUPPORT = false; //It used to hold the Timezone localization feature support

var startYear = 2005;
var endYear = 2038;

var NTPCFG;
var DATETIMECFG;

function doInit() {
	exposeElms([
		"_divNTPError",
		"_lstMonth",
		"_lstDate",
		"_lstYear",
		"_txtHour",
		"_txtMinute",
		"_txtSecond",
		"_lstUTCTZone",
		"_lblHour",
		"_txtNTPServer1",
		"_txtNTPServer2",
		"_chkNTPEnable",
		"_btnRefresh",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		chkNTPEnable.onclick = enableNTP;
		btnSave.onclick = validateNTPCfg;
		btnReset.onclick = reloadNTPCfg;
	} else {
		disableActions();
	}

	btnRefresh.onclick = refreshNTPCfg;
	_begin();
}

function _begin() {
	TIMEZONE_SUPPORT = checkProjectCfg("TIMEZONE_SUPPORT");
	initControls();
	getNTPCfg();
	getDateTime();
	if (TIMEZONE_SUPPORT) {
		lstUTCTZone.className = "visibleRow";
	} else {
		lblHour.className = "visibleRow";
	}
}

function initControls() {
	var month =	["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	var utcOffsetValue = [ "-12:00", "-11:30","-11:00", "-10:30","-10:00", "-09:30", "-09:00", "-08:30",
		"-08:00", "-07:30", "-07:00", "-06:30", "-06:00", "-05:30", "-05:00", "-04:30",
		"-04:00", "-03:30", "-03:00", "-02:30", "-02:00", "-01:30", "-01:00","-00:30",
		"+/-0",
		"+00:30", "+01:00", "+01:30", "+02:00", "+02:30", "+03:00", "+03:30", "+04:00",
		"+04:30", "+05:00", "+05:30", "+05:45", "+06:00", "+06:30", "+07:00", "+07:30", 
		"+08:00", "+08:30", "+09:00", "+09:30", "+10:00", "+10:30", "+11:00", "+11:30", 
		"+12:00", "+12:45"];

	optind =0;
	for (dat=1; dat<=31; dat++) {
		lstDate.add(new Option(dat,dat),isIE?optind++:null);
	}

	optind = 0;
	for (mon=0; mon<12; mon++) {
		lstMonth.add(new Option(month[mon], mon), isIE?optind++:null);
	}

	optind = 0;
	for (year = startYear; year<=endYear; year++) {
		lstYear.add(new Option(year, year), isIE?optind++:null);
	}

	if (!TIMEZONE_SUPPORT) {
		optind = 0;
		for (offset = 0; offset<utcOffsetValue.length; offset++) {
			lstUTCTZone.add(new Option(eLang.getString("common", "STR_GMT_ETC") + 
				utcOffsetValue[offset] + ")",
			utcOffsetValue[offset]), isIE?optind++:null);
		}
	} else {
		loadTimezone();
	}
}

function getDateTime() {
	xmit.get({url:"/rpc/getdatetime.asp", onrcv:getDateTimeRes, status:""});
}

function getDateTimeRes(arg) {
	var clientSeconds;
	var clientDateObject;
	var yearCheck;

	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DATE_TIME_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DATETIMECFG = WEBVAR_JSONVAR_GETDATETIME.WEBVAR_STRUCTNAME_GETDATETIME[0];

		clientSeconds = DATETIMECFG.SECONDS;	//BMC will give the local time, so no need to add UTC Offset here
		clientDateObject = new Date(clientSeconds * 1000);		//Date object requires milliseconds
		yearCheck = clientDateObject.getUTCFullYear();
		if ((yearCheck < startYear) || (yearCheck > endYear)) {
			alert (eLang.getString("common", "STR_CONF_NTP_DATE_RANGE"));
		} else {
			lstMonth.value = clientDateObject.getUTCMonth();
			lstDate.value = clientDateObject.getUTCDate();
			lstYear.value = yearCheck;

			var disp_hours = clientDateObject.getUTCHours();
			var disp_mins = clientDateObject.getUTCMinutes();
			var disp_secs = clientDateObject.getUTCSeconds();
			if ((!isNaN(disp_hours)) && (!isNaN(disp_mins)) &&
				(!isNaN(disp_secs))) {
				txtHour.value = ((disp_hours < 10)?"0":"") + disp_hours;
				txtMinute.value = ((disp_mins < 10)?"0":"") + disp_mins;
				txtSecond.value = ((disp_secs < 10)?"0":"") + disp_secs;
			}
		}

		lstUTCTZone.value = (TIMEZONE_SUPPORT ? DATETIMECFG.TIMEZONE : (getUTCString(DATETIMECFG.UTCMINUTES * 60)));

		//Preserving the values
		preserveMonth = lstMonth.value;
		preserveDate = lstDate.value;
		preserveYear = lstYear.value;
		preserveHour = txtHour.value;
		preserveMinute = txtMinute.value;
		preserveSecond = txtSecond.value;
		preserveUTCTzone = lstUTCTZone.value;
	}
}

function getNTPCfg() {
	xmit.get({url:"/rpc/getntpcfg.asp", onrcv:getNTPCfgRes, status:""});
}

function getNTPCfgRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_NTP_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
		chkNTPEnable.checked = false;
	} else {
		NTPCFG = WEBVAR_JSONVAR_GETNTPCFG.WEBVAR_STRUCTNAME_GETNTPCFG[0];
		txtNTPServer1.value = NTPCFG.SERVER_NAME1;
		txtNTPServer2.value = NTPCFG.SERVER_NAME2;

		divNTPError.innerHTML = "";
		if (NTPCFG.NTP_STATUS == CONST_AUTO) {
			chkNTPEnable.checked = true;
		} else if (NTPCFG.NTP_STATUS == CONST_MANUAL) {
			chkNTPEnable.checked = false;
		} else if (NTPCFG.NTP_STATUS == CONST_FAILURE) {
			chkNTPEnable.checked = true;
			divNTPError.innerHTML = eLang.getString("common", 
				"STR_CONF_NTP_SERVER_FAIL");
		}
	}
	preserveNTPEnable = chkNTPEnable.checked;
	enableNTP();
}

function validateNTPCfg() {
	var setSeconds = 0;		//If NTP is enabled, then we should not save Date/Time Configuration
	if (top.user.isAdmin()) {
		if (!chkNTPEnable.checked) {
			if(!eVal.isnumstr(txtHour.value, 0, 23)) {
				alert(eLang.getString("common","STR_CONF_NTP_INVALID_HOUR"));
				txtHour.focus();
				return;
			}
			if(!eVal.isnumstr(txtMinute.value, 0, 59)) {
				alert(eLang.getString("common","STR_CONF_NTP_INVALID_MINS"));
				txtMinute.focus();
				return;
			}
			if(!eVal.isnumstr(txtSecond.value, 0, 59)) {
				alert(eLang.getString("common","STR_CONF_NTP_INVALID_SECS"));
				txtSecond.focus();
				return;
			}

			if ((lstMonth.value) == 1) {
				if((lstYear.value)%4 == 0) {
					if((lstDate.value) > 29) {
						alert(eLang.getString("common", 
							"STR_CONF_NTP_INVALID_DATE") + 
							eLang.getString("common", "STR_CONF_NTP_INVALID_LEAP"));
						return;
					}
				} else {
					if((lstDate.value) > 28) {
						alert(eLang.getString("common", 
							"STR_CONF_NTP_INVALID_DATE") + 
							eLang.getString("common", "STR_CONF_NTP_INVALID_FEB"));
						return;
					}
				}
			} else if (((lstMonth.value) == 3)  || ((lstMonth.value) == 5) || 
				((lstMonth.value) == 8) || ((lstMonth.value) == 10)) {
					if ((lstDate.value) > 30)
					{
						alert(eLang.getString("common", 
							"STR_CONF_NTP_INVALID_DATE") + 
							eLang.getString("common", "STR_CONF_NTP_INVALID_MONTH"));
						return;
					}
			}
			if ((lstMonth.value == 0) && (lstDate.value >= 19) && 
				(lstYear.value == endYear)) {		//Check upto 18th January 2038 (Year 2038 Problem)
				alert(eLang.getString("common", 
					"STR_CONF_NTP_INVALID_DATE") + 
					eLang.getString("common", "STR_HELP_INFO"));
				return;
			}
			var setDateObject = Date.UTC(lstYear.value, lstMonth.value, lstDate.value, 
				parseInt(txtHour.value, 10),
				parseInt(txtMinute.value, 10),
				parseInt(txtSecond.value, 10));
			setSeconds = (setDateObject/1000);	//To milliseconds to seconds
			if (setSeconds > Math.pow(2,31)) {		//Check for Year 2038 Problem exact value
				alert(eLang.getString("common","STR_CONF_NTP_INVALID_DATE") + 
					eLang.getString("common","STR_HELP_INFO"));
				return;
			}
		} else {
			if ((!eVal.domainname(txtNTPServer1.value,true)) && 
				(!eVal.ip(txtNTPServer1.value,false)) && 
				(!eVal.ipv6(txtNTPServer1.value, false, false))) {
					alert(eLang.getString("common", 
						"STR_CONF_NTP_INVALID_PRIMARY_SERVER"));
					return;
			}
			if ((!eVal.isblank(txtNTPServer2.value)) &&
				(!eVal.domainname(txtNTPServer2.value,true)) && 
				(!eVal.ip(txtNTPServer2.value,false)) && 
				(!eVal.ipv6(txtNTPServer2.value, false, false))) {
					alert(eLang.getString("common", 
						"STR_CONF_NTP_INVALID_SECONDARY_SERVER"));
					return;
			}
		}
		btnRefresh.disabled = true;
		btnSave.disabled = true;
		setDateTime(setSeconds);
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setDateTime(setSeconds) {
	var utcseconds = (TIMEZONE_SUPPORT ? getUTC() : 
		getUTCSeconds(lstUTCTZone.value));
	var req = new xmit.getset({url:"/rpc/setdatetime.asp", 
		onrcv:setDateTimeRes, status:""});
	req.add("SECONDS", (setSeconds-utcseconds));
	req.add("UTCMINUTES", (utcseconds/60));	//To seconds to hours - UTC hours supported by IPMI Spec
	if (TIMEZONE_SUPPORT) {
		req.add("TIMEZONE", lstUTCTZone.value);
	}
	req.add("ISNTPENABLE", chkNTPEnable.checked ? 1 : 0);	//If this argument is 1, then we need to save UTC Tzone alone.
	req.send();
	delete req;
}

function setDateTimeRes(arg) {
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DATE_TIME_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		setNTPCfg();
	}
}

function setNTPCfg() {
	var req = xmit.getset({url:"/rpc/setntpcfg.asp", 
		onrcv:setNTPcfgRes, status:""});
	req.add("NTPSERVER_NAME1", txtNTPServer1.value);
	req.add("NTPSERVER_NAME2", txtNTPServer2.value);
	req.add("ISNTPENABLE", chkNTPEnable.checked ? 1 : 0);	//If this argument is 0, then we need to update the status file alone.
	req.send();
	delete req;
}

function setNTPcfgRes(arg) {
	var errstr;
	switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
	case 0x0:
		alert (eLang.getString("common", "STR_CONF_NTP_SAVE"));
		break;
	case 0x80:
		divNTPError.innerHTML = eLang.getString("common", 
			"STR_CONF_NTP_SERVER_FAIL");
		alert(eLang.getString("common", "STR_CONF_NTP_SERVER_FAIL"));
		break;
	case 0x82:
		alert(eLang.getString("common", "STR_CONF_NTP_INVALID_SERVERS"));
		break;
	default:
		errstr = eLang.getString("common", "STR_CONF_NTP_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
	}
	getNTPCfg();
	getDateTime();
	btnRefresh.disabled = false;
	btnSave.disabled = false;
}

function getPreserveValues() {
	lstMonth.value = preserveMonth;
	lstDate.value = preserveDate;
	lstYear.value = preserveYear;
	txtHour.value =preserveHour;
	txtMinute.value = preserveMinute;
	txtSecond.value = preserveSecond;
	lstUTCTZone.value = preserveUTCTzone;

	chkNTPEnable.checked = preserveNTPEnable;
	txtNTPServer1.value = NTPCFG.SERVER_NAME1;
	txtNTPServer2.value = NTPCFG.SERVER_NAME2;
}

function refreshNTPCfg() {
	if (preserveNTPEnable == chkNTPEnable.checked) {
		if (chkNTPEnable.checked) {	//Check whether any changes made to NTP configuration
			if ((NTPCFG.SERVER_NAME1 == txtNTPServer1.value) && 
				(NTPCFG.SERVER_NAME2 == txtNTPServer2.value) && 
				(preserveUTCTzone == lstUTCTZone.value)) {
				getDateTime();
			} else {
				if (confirm(eLang.getString("common", "STR_CONF_NTP_CONFIRM"))){
					validateNTPCfg();
				} else {
					reloadNTPCfg();
				}
			}
		} else {		//Check whether any changes made to Date and Time configuration
			if ((preserveMonth == lstMonth.value) && (preserveDate == lstDate.value)
				&& (preserveYear == lstYear.value) && (preserveHour == txtHour.value)
				&& (preserveMinute == txtMinute.value) && (preserveSecond == txtSecond.value)
				&& (preserveUTCTzone == lstUTCTZone.value)) {
					getDateTime();
			} else {
				if (confirm(eLang.getString("common", "STR_CONF_NTP_CONFIRM"))){
					validateNTPCfg();
				} else {
					reloadNTPCfg();
				}
			}
		}
	} else {
		if (confirm(eLang.getString("common", "STR_CONF_NTP_CONFIRM"))) {
			validateNTPCfg();
		} else {
			reloadNTPCfg();
		}
	}
}

function enableNTP() {
	if (top.user.isAdmin()) {
		var bopt = chkNTPEnable.checked;
		lstMonth.disabled = bopt;
		lstDate.disabled = bopt;
		lstYear.disabled = bopt;
		txtHour.disabled = bopt;
		txtMinute.disabled = bopt;
		txtSecond.disabled = bopt;

		txtNTPServer1.disabled = !bopt;
		txtNTPServer2.disabled = !bopt;
	}
}

function reloadNTPCfg() {
	getPreserveValues();
	enableNTP();
	getDateTime();
}

/* 
 * This function is used to load all the Timezone locations into WebUI controls
 */
function loadTimezone() {
	var lstTZGroup;	// Group the list items
	var lstTZLocation;	// Holds all the list items
	for (locations in timezone) {
		lstTZGroup = document.createElement("optgroup");
		lstTZGroup.label = locations;
		for (j = 0; j<timezone[locations].length; j++) {
			lstTZLocation = document.createElement("option");
			lstTZLocation.value = timezone[locations][j].value;
			lstTZLocation.appendChild(document.createTextNode(timezone[locations][j].text));
			lstTZGroup.appendChild(lstTZLocation);
		}
		lstUTCTZone.appendChild(lstTZGroup);
	}
}

/* 
 * This function is used to get the UTCOffset(miniutes) according location
 * choosen in the listbox
 */
function getUTC() {
	for (locations in timezone) {
		for (j = 0; j<timezone[locations].length; j++) {
			if (lstUTCTZone.value == timezone[locations][j].value) {
				return (getUTCSeconds(timezone[locations][j].utc));
			}
		}
	}
}
