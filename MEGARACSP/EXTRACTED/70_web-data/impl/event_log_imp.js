//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2011        **;
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

var SELINFO_DATA;		//It holds RPC response data of Event Records.
var SENSORINFO_DATA;	//It holds RPC response data of Sensor Records.
var eventLogTable;		//List grid object to hold event records.
var clearlog = false;	//Flag to check for clear log event.
var bmcUTCString;		//BMC UTC Timestamp value in string
var clientUTCSeconds;	//Client UTC seconds in integer
var m_Max_allowed_offset= [];	//Offset of Event/Reading Type, 0x1 to 0x0c
var m_Max_allowed_SensorSpecific_offset = [];	//Offset of Event/Reading Type-0x6F

var sensorNameType = [];	//Array of Sensor Name Filter
var sensorNameCount = [];	//Array holds count of events in each Sensor Name
var sensorNamePage = [];	//Array holds object of event's index for each Sensors
var eventTypeCount = [];	//Array holds count of events in each Event type
var eventTypePage = [];		//Array holds object of event's index for each event type
var bkupPageNumber;		//Back up page number

/*
 * The following are the constants used in this implementation.
 * The below listed is for event type filters available.
 */
var EVENT_PAGE_SIZE = 50;	//Maximum no. of entries in one page.
var MAX_EVENT_TYPE = 9;		//0 to 8, Filter of Event type
var ALL_SENSORS = 0;		//Filter for all sensors
var ALL_EVENTS = 0;		//Filter for all events.
var SYSTEM_EVT = 1;		//System Event Record tye.
var OEM_EVT = 2;		//OEM Event record type.
var BIOS = 3;		//BIOS generated events.
var SMI = 4;		//SMI Handler Events
var SMS = 5;		//System Management Software events
var SYSTEM_OEM = 6;	//System Software - OEM Events
var RCS = 7;		//Remote Console Software Events
var TMRCS = 8;		//Terminal Mode RCS Events

//This constants used for page navigations.
var FIRSTPAGE = 1;
var MOVEFIRST = 1;
var MOVEPREVIOUS = 2;
var MOVENEXT = 3;
var MOVELAST = 4;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms([
		"_lstEventType",
		"_lstSensorName",
		"_lblHeader",
		"_btnFirst",
		"_btnPrevious",
		"_btnNext",
		"_btnLast",
		"_txtPage",
		"_rdoBMCTzone",
		"_rdoClientTzone",
		"_lblUTCOffset",
		"_lgdEventLog",
		"_btnSaveLog",
		"_btnClearLog"]);

	if (top.user.isAdmin()) {
		btnClearLog.onclick = clearSEL;
		if (checkProjectCfg("SAVE_SELLOG")) {
			btnSaveLog.className = "visibleRow";
			btnSaveLog.onclick = saveSEL;
		} 
	} else {
		btnClearLog.disabled = true;
	}

	btnFirst.onclick = function () {
		movePage(MOVEFIRST);
	}
	btnPrevious.onclick = function () {
		movePage(MOVEPREVIOUS);
	}
	btnNext.onclick = function () {
		movePage(MOVENEXT);
	}
	btnLast.onclick = function () {
		movePage(MOVELAST);
	}

	txtPage.onkeydown = movePageNumber;
	rdoBMCTzone.onclick = refreshEventTzone;
	rdoClientTzone.onclick = refreshEventTzone;

	_begin();
}
/*
window.onresize= function() 
{	
	showWait(true, eLang.getString("common","STR_WAIT"));
	lgdEventLog.innerHTML = "";
	//eventLogTable.clear();
	loadCustomPageElements();
	refreshEvents();
}
*/

function saveSEL()
{
	if ( !SELINFO_DATA.length ) {
		alert(eLang.getString("common", "NO_SEL_STRING"));
	} else {
		 xmit.get({url:"/rpc/WEBSES/validate.asp", onrcv:function(arg) {
			if(arg.HAPI_STATUS == 0) { 
				if (top.user.isAdmin()) {
					xmit.get({url:"/rpc/saveAllSELEntries.asp", 
						onrcv:saveAllSELEntriesRes, status:""});
				} else {
					alert(eLang.getString("common","STR_CONF_ADMIN_PRIV"));
				}
			} else {
				parent.gLogout = 1; 
				top.document.cookie = "SessionExpired=true;path=/";
				parent.location.href = "login.html";
			}
		},evalit:false});
	}
}

function saveAllSELEntriesRes(arg)
{
	if(arg.HAPI_STATUS == 0) {
		window.location.href="/SELLog";
	} else {
		alert(eLang.getString("common", "STR_EVENT_LOG_SAVEEVENTS_ERROR"));
	}
}

/*
 * It will fill data for user controls like list box, if any.
 * Invokes loadCustomPageElements method to load list grid.
 * And will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	fillEventType();
	initializeOffsetValue();
	loadCustomPageElements();
	initializeCustomPageElements();
	getAllSensors();
}

/*
 * This function is used to load the list grid and its header information.
 */
function loadCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	eventLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_SEL_STRING"),
		doAllowNoSelect : false
	});

	//add the list grid to the body division
	lgdEventLog.appendChild(eventLogTable.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_EVENT_LOG_HEAD1"), fieldType:2, 
			w:"7%", textAlign:"center"},
		{text:eLang.getString("common", "STR_EVENT_LOG_HEAD2"), w:"18%", textAlign:"center"},
		{text:eLang.getString("common", "STR_EVENT_LOG_HEAD3"), w:"23%", textAlign:"center"},
		{text:eLang.getString("common", "STR_EVENT_LOG_HEAD4"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_EVENT_LOG_HEAD5"), w:"37%", textAlign:"center"}
		]};
	eventLogTable.loadFromJson(tblJSON);
}

/*
 * It will initialize the Event type and Sensor Name filter's change event 
 * handler. Also initialize the list grid select and double click event handler.
 */
function initializeCustomPageElements()
{
	lstSensorName.onchange = lstEventType.onchange = comboRefresh;

	eventLogTable.ondblclick = function(selectedRow)
	{
		var eventId = getEventId(parseInt(selectedRow.cells[0].innerHTML));
		if(eventId != null) {
			var descFrame = getDescFrame();
			var data = processEventRecordForGraph(SELINFO_DATA[eventId]);
			var ExtendedType=SELINFO_DATA[eventId].RecordType;

			var eventType = "";
			if (getbits(SELINFO_DATA[eventId].EventDirType,7,7) == 0) {
				eventType = "Asserted";
			} else {
				eventType = "Deasserted";
			}

			var heading = document.createElement("h3");
			if(ExtendedType=="0xDF") {
				heading.innerHTML = SELINFO_DATA[eventId].SensorName 
			} else {
				heading.innerHTML = SELINFO_DATA[eventId].SensorName + 
				"<font class='grey'> - " + eventType + "</font>";
			}

			var description = document.createElement("p");
			if(ExtendedType=="0xDF") {
				description.innerHTML = "This event was occurred on " + 
				selectedRow.cells[1].innerHTML;
			description.innerHTML += "<br/><br/>";

			var rawData= toHex(SELINFO_DATA[eventId].RecordID) + " " + 
			toHex(SELINFO_DATA[eventId].RecordType) + " " +
			toHex(SELINFO_DATA[eventId].TimeStamp) + " " +
			toHex(SELINFO_DATA[eventId].GenID1) + " " +
			toHex(SELINFO_DATA[eventId].GenID2) + " " +
			toHex(SELINFO_DATA[eventId].EvmRev) + " " +
			toHex(SELINFO_DATA[eventId].SensorType) + " " +
			toHex(SELINFO_DATA[eventId].SensorNumber) + " " +
			toHex(SELINFO_DATA[eventId].EventDirType) + " " +
			toHex(SELINFO_DATA[eventId].EventData1) + " " +
			toHex(SELINFO_DATA[eventId].EventData2)	+ " " +
			toHex(SELINFO_DATA[eventId].EventData3);
			description.innerHTML += "<em>" + rawData + "</em>";
			} else {
			description.innerHTML = "This event was " + eventType+" on " + 
				selectedRow.cells[1].innerHTML;
			description.innerHTML += "<br/><br/>";
			description.innerHTML += "<em>" + data.str + "</em>";
			}

			var eventDeasserted = null;
			var deassertEvent = false;

			for(var i=eventId; i<SELINFO_DATA.length; i++) {
				if(SELINFO_DATA[i].SensorName == SELINFO_DATA[eventId].SensorName
					&& getbits(SELINFO_DATA[i].EventDirType,6,0) == 
					getbits(SELINFO_DATA[eventId].EventDirType,6,0)
					&& getbits(SELINFO_DATA[i].EventData1,3,0) == 
					getbits(SELINFO_DATA[eventId].EventData1,3,0)
					&& SELINFO_DATA[i].GenID1 == SELINFO_DATA[eventId].GenID1) {
					if (getbits(SELINFO_DATA[i].EventDirType,7,7) != 0) {
						eventDeasserted = SELINFO_DATA[i];
						break;
					} else {
						deassertEvent = true;
					}
				}
			}

			if(deassertEvent) {
				var durTxt = "";
				if(eventDeasserted) {
					var duration = SELINFO_DATA[eventId].TimeStamp - eventDeasserted.TimeStamp;
					var fDur = getFormattedDate(duration);
					durTxt = "This event was deasserted after "+fDur;
				} else {
					durTxt = "This event is not yet deasserted";
				}
				description.innerHTML += "<br/><br/>";
				if(ExtendedType != "0xDF") {
					description.innerHTML += durTxt;
				}
			}

			descFrame.appendChild(heading);
			descFrame.appendChild(description);
		}
	}
}

/*
 * It will invoke the RPC method to get the Sensor information.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getAllSensors()
{
	xmit.get({url:"/rpc/getallsensors.asp",onrcv:getAllSensorsRes,status:""});
}

/*
 * This is the response function for getAllSensors RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getAllSensorsRes(arg)
{
	var i = 0;	//loop counter
	var index;
	if(arg.HAPI_STATUS == 0) {
		SENSORINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSENSORS.WEBVAR_STRUCTNAME_HL_GETALLSENSORS;
		lstSensorName.add(new Option("All Sensors", i), isIE ? i : null);
		for(i = 1; i <= SENSORINFO_DATA.length; i++) {
			lstSensorName.add(new Option(SENSORINFO_DATA[i-1].SensorName, i),
				isIE ? i : null);
			sensorNameType[i-1] = SENSORINFO_DATA[i-1].SensorName;
			sensorNameCount[i-1] = 0;
		}
	}
	getUTCOffset(getUTCOffsetRes);
}

/*
 * This function will be called once we get response for the getUTCOffset RPC.
 * getUTCOffset will get the UTC offset value of the BMC.
 * @param utcOffsetMinutes, UTC offset value of the BMC in minutes.
 */
function getUTCOffsetRes(utcOffsetMinutes)
{
	var clientDate = new Date();
	bmcUTCString = getUTCString(utcOffsetMinutes * 60);
	clientUTCSeconds = -(clientDate.getTimezoneOffset() * 60);	//JS Date object method
	refreshEventTzone();
	getAllSELEntries();
}

/*
 * It is used to get the index of SEL, for the given event record ID.
 * @param id, Event record ID.
 * @return integer, index of the matching record or null.
 */
function getEventId(id)
{
	for(var eid=0; eid < SELINFO_DATA.length; eid++) {
		if(SELINFO_DATA[eid].RecordID == id) {
			return eid;
		}
	}
	return null;
}

/*
 * It will invoke the RPC method to get the System Event entries.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getAllSELEntries()
{
	disablePageButtons();
	xmit.get({url:"/rpc/getallselentries.asp", onrcv:getAllSELEntriesRes,
		status:""});
}

/*
 * This is the response function for getAllSELEntries RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getAllSELEntriesRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_EVENT_LOG_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SELINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSELENTRIES.WEBVAR_STRUCTNAME_HL_GETALLSELENTRIES;
		if (!SELINFO_DATA.length && !clearlog) {
			alert(eLang.getString("common", "NO_SEL_STRING"));
			loadEmptySELEntries();
			return;
		}
		clearlog = false;
		if (SELINFO_DATA.length != 0) {
			initializeAllEvents();
			initializePageRange();
			//Sensor name field is filled by either dashboard or sensors page.
			if(HTTP_GET_VARS["sid"]) {
				var extendedsid=HTTP_GET_VARS["sid"]; //Extended SEL will come as false.
				if(extendedsid=="false") {
					lstSensorName.value=0;
					lstEventType.value = OEM_EVT
					comboRefresh();
					return;
					} else {
					index = HTTP_GET_VARS["sid"];
					index++;
					lstSensorName.value = index;
					comboRefresh();
					return;
				}
			}

			//Page is reloaded using refresh option
			if (top.mainFrame.pageFrame.location.hash) {
				lstEventType.value = comboParser(top.mainFrame.pageFrame.location.hash,
					lstEventType.id);	//id->id of the selection box
				lstSensorName.value = comboParser(top.mainFrame.pageFrame.location.hash,
					lstSensorName.id);
				comboRefresh();
				return;
			}

			//Default case
			loadSELEntries(eventTypeCount, eventTypePage, ALL_EVENTS, FIRSTPAGE);
		} else {
			loadEmptySELEntries();
		}
	}
}

/*
 * This function will toggle between the BMC and Client Timestamp display.
 * Based on the user selection, particular timestamp data will displayed in the
 * listgrid using css styles.
 * @param visibleStyle, cssStyle name to be displayed.
 * @param hiddenStyle, cssStyle name to be hided.
 */
function toggleBMCClient(visibleStyle, hiddenStyle)
{
	var theRules = [];
	var searchStyle = "";
	for (i=0;i<document.styleSheets.length;i++) {
		theRules = document.styleSheets[i].cssRules ? 
			document.styleSheets[i].cssRules : document.styleSheets[i].rules;
		for (j=0;j<theRules.length;j++) {
			searchStyle = theRules[j].cssText ? theRules[j].cssText : 
				theRules[j].selectorText;
			if (searchStyle.indexOf(visibleStyle) != -1) {
				theRules[j].style.display = "";
			}
			if (searchStyle.indexOf(hiddenStyle) != -1) {
				theRules[j].style.display = "none";
			}
		}
	}
}

/*
 * This function will be called whenever user switches between BMC and client
 * Timestamp option.
 */
function refreshEventTzone()
{
	lblUTCOffset.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_UTC_OFFSET") + "</strong>";
	lblUTCOffset.innerHTML += eLang.getString("common","STR_GMT");
	if (rdoBMCTzone.checked) {
		toggleBMCClient("toggleBMC", "toggleClient");
		lblUTCOffset.innerHTML += bmcUTCString;
	} else if (rdoClientTzone.checked) {
		toggleBMCClient("toggleClient", "toggleBMC");
		lblUTCOffset.innerHTML += getUTCString(clientUTCSeconds);
	}
	lblUTCOffset.innerHTML += ")" + eLang.getString("common","STR_BLANK");
}

/*
 * It will reload the event entries in the list grid based on the index value.
 * @param startPos, index of the starting record.
 * @param endPos, index of the end record.
 * @param count, total count of the filtered option.
 */
function refreshEvents(startPos, endPos, count)
{
	var eventtype = 0;
	var sensortype;
	var eventdesc;
	var type;
	var offset;
	var JSONRows = [];
	var eventTimeStamp;		//Event TimeStamp in seconds
	var bmcUTCSeconds;		//BMC UTC Offset value in seconds
	var bmcTimestamp;		//BMC TimeStamp in string
	var clientTimestamp;	//Client TimeStamp in string

	showWait(true, "Populating");
	eventLogTable.clear();
	for (j = startPos; j <= endPos; j++) {
		if (j >= SELINFO_DATA.length) {
			break;
		}

		if (parseInt(lstEventType.value) != ALL_EVENTS) {
		//Check for Event Type list box value
			eventtype = ALL_EVENTS;
			if (SELINFO_DATA[j].RecordType >= 0x0 && 
				SELINFO_DATA[j].RecordType <= 0xBF) {
			//System Event Records
				eventtype = SYSTEM_EVT;
				if (parseInt(lstEventType.value) != SYSTEM_EVT) {
					if (getbits(SELINFO_DATA[j].GenID1, 0, 0) == 1) {
						if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x0) && 
							(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x0F)) {
							eventtype = BIOS;
						} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x10) && 
							(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x1F)) {
							eventtype = SMI;
						} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x20) && 
							(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x2F)) {
							eventtype = SMS;
						} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x30) && 
							(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x3F)) {
							eventtype = SYSTEM_OEM;
						} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x40) && 
							(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x46)) {
							eventtype = RCS;
						} else if (getbitsval(SELINFO_DATA[j].GenID1, 7, 1) == 0x47) {
							eventtype = TMRCS;
						}
						eventdesc = eLang.getString("common", "STR_SOFTWARE_ID") + 
							"-" + eLang.getString("common", "STR_EVENT_LOG_TYPE" +
							eventtype);
					}
				}
			} else if ((SELINFO_DATA[j].RecordType >= 0xC0) &&
				(SELINFO_DATA[j].RecordType <= 0xFF)){
			//C0h-DFh = OEM timestamped
			//E0h-FFh = OEM non-timestamped
				eventtype = OEM_EVT;
			}
			if (parseInt(lstEventType.value) != eventtype) {
			//if not matches skips the record
				continue;
			}
		}

		if(parseInt(lstSensorName.value) != 0) {
		//Check for Sensor Name list box value
			if(sensorNameType[parseInt(lstSensorName.value)-1] != 
				SELINFO_DATA[j].SensorName) {
			//if not matches skips the record
				continue;
			}
		}

		if (SELINFO_DATA[j].RecordType >= 0x0 && 
			SELINFO_DATA[j].RecordType <= 0xBF) {
			//Range reserved for standard SEL Record Types

			//7-bit Event/Reading Type Code Range
			type = getbits(SELINFO_DATA[j].EventDirType, 6, 0);
			if (type == 0x0) {
				//Event/Reading Type unspecified
			} else if (type == 0x6F) {
				//Sensor-specific Discrete
				//If event type is 0x6F then read from sensor-specific table
				offset = getbits(SELINFO_DATA[j].EventData1, 3, 0);
				if(m_Max_allowed_SensorSpecific_offset[SELINFO_DATA[j].SensorType]
					>= offset) {
					eventdesc = eLang.getString("sensor_specific_event", 
						SELINFO_DATA[j].SensorType, offset);
				} else {
					eventdesc = eLang.getString("common", "INVALID_OFFSET");
				}
			} else if ((type >= 0x01) && (type <= 0x0C)) {
				//0x01-Threshold based, 0x02-0x0C Generic Discrete
				offset = getbits(SELINFO_DATA[j].EventData1, 3, 0);
				if (m_Max_allowed_offset[type] >= offset) {
					eventdesc = eLang.getString("event", type, offset);
				} else {
					eventdesc = eLang.getString("common", "INVALID_OFFSET");
				}
			} else {
				/* 0x70-0x7F,OEM Discrete */
				eventdesc = eLang.getString("event", "OEM_DISCRETE");
			}

			//if it is a BIOS Post event then
			if ((SELINFO_DATA[j].GenID1 >= 0x01) && 
				(SELINFO_DATA[j].GenID1 <= 0x1F) && 
				(SELINFO_DATA[j].SensorType == 0xf)) {
				/* look up bios_post_String using offset and evtdata2
				we are clean event data 2 should be seen only if this bits 
				indicate evtdata2 has something */

				//Only 0 and 1 table are in Bios_post_event_str.js
				if ((getbits(SELINFO_DATA[j].EventData1,7,6) == 0xC0) && 
					((offset >= 0) && (offset <= 2))) {
					/* Since SensorType 0xf ,Offset 1 and 2 use the same table Entry */
					if(2 == offset) {
						offset =1;
					}
					eventdesc += "-" + eLang.getString("bios_post_event", 
						offset, getbits(SELINFO_DATA[j].EventData2, 3, 0));
				} else {
					eventdesc += "-" + eLang.getString("common", "STR_UNKNOWN");
				}
			}

			if (getbits(SELINFO_DATA[j].EventDirType,7,7) == 0) {
				if(typeof(eventdesc) != "undefined") {
					// to avoid eventdesc with multiple Asserted like "undefined - Asserted - Asserted"
					if(eventdesc.indexOf(eLang.getString("common", "STR_EVENT_LOG_ASSERT")) == -1) {
						eventdesc += " - "+eLang.getString("common", "STR_EVENT_LOG_ASSERT");
					}
				} else 
					eventdesc += " - "+eLang.getString("common", "STR_EVENT_LOG_ASSERT");
			} else {
				if(typeof(eventdesc) != "undefined") {
					// to avoid eventdesc with multiple Asserted like "undefined - Deasserted - Deasserted"
					if(eventdesc.indexOf(eLang.getString("common", "STR_EVENT_LOG_DEASSERT")) == -1) {
						eventdesc += " - "+eLang.getString("common", "STR_EVENT_LOG_DEASSERT");
					}
				} else 
					eventdesc += " - "+eLang.getString("common", "STR_EVENT_LOG_DEASSERT");
			}
			sensortype = eLang.getString("sensortype", SELINFO_DATA[j].SensorType);

		} else if (SELINFO_DATA[j].RecordType >= 0xC0 &&
			SELINFO_DATA[j].RecordType < 0xDF) {
			//Range reserved for timestamped OEM SEL records.
			eventdesc = "OEM timestamped";
			sensortype = "OEM Record";
		} else if (SELINFO_DATA[j].RecordType == 0xDF) {
			//0xDF- Extended SEL records.
			eventdesc = "OEM timestamped";
			sensortype = "Extended SEL";
		} else if (SELINFO_DATA[j].RecordType >= 0xE0 &&
			SELINFO_DATA[j].RecordType <= 0xFF) {
			//Range reserved for non-timestamped OEM SEL records.
			eventdesc = "OEM non-timestamped";
			sensortype = "OEM Record";
		}

		var eventTimeStamp = SELINFO_DATA[j].TimeStamp;		//Event TimeStamp in Seconds
		var bmcUTCSeconds = getUTCSeconds(bmcUTCString);	//BMC UTC Offset value in seconds
		var strBmcTimeStamp=getTimeStamp(eventTimeStamp);
		if (strBmcTimeStamp.substring(6,10) == "1970") {
			var bmcTimestamp = "<span class='toggleBMC'>" + 
				eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
				"</span>";
		} else {
			var bmcTimestamp = "<span class='toggleBMC'>" + 
				strBmcTimeStamp + "</span>";
		}
		var strClientTimeStamp = getTimeStamp(eventTimeStamp - 
			bmcUTCSeconds + clientUTCSeconds);
		if (strClientTimeStamp.substring(6,10) == "1970") {
			var clientTimestamp = "<span class='toggleClient'>" + 
				eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
				"</span>";
		} else {
			var clientTimestamp = "<span class='toggleClient'>" + 
				getTimeStamp(eventTimeStamp - bmcUTCSeconds + 
				clientUTCSeconds) + "</span>";
		}

		JSONRows.push({cells:[
			{text:parseInt(SELINFO_DATA[j].RecordID), value:parseInt(SELINFO_DATA[j].RecordID)},
			{text:bmcTimestamp + clientTimestamp, value:bmcTimestamp + clientTimestamp},
			{text:SELINFO_DATA[j].SensorName, value:SELINFO_DATA[j].SensorName},
			{text:sensortype, value:sensortype},
			{text:eventdesc, value:eventdesc}
			]});
	}

	tblJSON.rows = JSONRows;
	eventLogTable.loadFromJson(tblJSON);

	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_EVENT_LOG_CNT") + "</strong>" + count + eLang.getString("common", 
		"STR_EVENT_ENTRIES") + ", " + Math.ceil(count / EVENT_PAGE_SIZE) + 
		eLang.getString("common", "STR_BLANK") + eLang.getString("common",
		"STR_EVENT_LOG_PAGES") + eLang.getString("common", "STR_BLANK");

	if(top.user.isAdmin()) {
		btnClearLog.disabled = (SELINFO_DATA.length) ? false : true;
	}
}

/*
 * It will display the table with single record shows that the selected filter
 * has no records.
 */
function loadEmptySELEntries()
{
	disablePageButtons();
	txtPage.value = "";
	tblJSON.rows = [];
	eventLogTable.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_EVENT_LOG_CNT") + "</strong>0" + 
		eLang.getString("common", "STR_EVENT_ENTRIES") + 
		eLang.getString("common", "STR_BLANK");
}

/*
 * This function will load the SEL entries based on the user filter option
 * @filterTypeCount, Total count of the records for the selected filter.
 * @filterTypePage, Object of the event's index for the selected filter.
 * @lstIndex, Index of the user selected filter.
 * @pageIndex, Which page of records to be displayed.
 */
function loadSELEntries(filterTypeCount, filterTypePage, lstIndex, pageIndex)
{
	showWait(true, eLang.getString("common", "STR_WAIT"));
	if (filterTypeCount[lstIndex] != 0) {
		disablePageButtons();
		refreshEvents(filterTypePage[lstIndex][pageIndex].startIndex, 
			filterTypePage[lstIndex][pageIndex].endIndex,
			filterTypeCount[lstIndex]);
		bkupPageNumber = pageIndex
		txtPage.value = pageIndex;
		enablePageButtons(filterTypeCount[lstIndex]);
	} else {
		loadEmptySELEntries();
	}
}

/*
 * It will be invoked whenever the user filters the event records based on 
 * event type or sensor names.
 */
function comboRefresh()
{
	var sensorIndex;
	switch (parseInt(lstEventType.value)) {
	case ALL_EVENTS:
	case SYSTEM_EVT:
		lstSensorName.disabled = false;
		if (parseInt(lstSensorName.value) == ALL_SENSORS) {
			loadSELEntries(eventTypeCount, eventTypePage, lstEventType.value, FIRSTPAGE);
		} else {
			//sensorNameType array value starts with 0.
			sensorIndex = parseInt(lstSensorName.value) - 1;
			loadSELEntries(sensorNameCount, sensorNamePage, sensorIndex, FIRSTPAGE);
		}
		break;
	default:
		lstSensorName.disabled = true;
		lstSensorName.value = 0;
		loadSELEntries(eventTypeCount, eventTypePage, lstEventType.value, FIRSTPAGE);
		break;
	}
}

/*
 * It will invoke the RPC method to clear the System Event entries.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function clearSEL()
{
	if (top.user.isAdmin()) {
		if (!SELINFO_DATA.length) {
			alert(eLang.getString("common", "NO_SEL_STRING"));
			btnClearLog.disabled = true;
			return;
		}

		if (confirm(eLang.getString("common", "STR_EVENT_LOG_CLEAR_CONFIRM"))) {
			xmit.get({url:"/rpc/clearsel.asp", onrcv:clearSELRes, status:"", 
				timeout:60});
		}
	} else {
		alert(eLang.getString("common","STR_CONF_ADMIN_PRIV"));
	}
}

/*
 * This is the response function for clearSEL RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function clearSELRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_EVENT_LOG_CLEARLOG");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		clearlog = true;
		parent.web_alerts.lastEventId = 0;
		alert(eLang.getString("common", "STR_EVENT_LOG_CLEAR_SUCCESS"));
		getAllSELEntries();
	}
}

/*
 * This function will be invoked whenever the user navigates the pages 
 * using navigation controls.
 * @param navCtrl, which navigation control is clicked.
 */
function movePage(navCtrl)
{
	var pageCount;
	var sensorIndex;
	var pageIndex;

	if (parseInt(lstSensorName.value) != ALL_SENSORS) {
		//sensorNameType array value starts with 0.
		sensorIndex = parseInt(lstSensorName.value) - 1;
		pageCount = Math.ceil(sensorNameCount[sensorIndex] / EVENT_PAGE_SIZE);
	} else {
		pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
	}

	switch (navCtrl) {
	case MOVEFIRST:
		pageIndex = FIRSTPAGE;
		break;
	case MOVEPREVIOUS:
		pageIndex = parseInt(bkupPageNumber) - 1;
		break;
	case MOVENEXT:
		pageIndex = parseInt(bkupPageNumber) + 1;
		break;
	case MOVELAST:
		pageIndex = pageCount;
	}

	if (parseInt(lstSensorName.value) != ALL_SENSORS) {
		loadSELEntries(sensorNameCount, sensorNamePage, sensorIndex, pageIndex);
	} else {
		loadSELEntries(eventTypeCount, eventTypePage, lstEventType.value, pageIndex);
	}
}

/*
 * This event is triggered whenever the user enters the page number to navigate.
 * @param e, keyboard event.
 */
function movePageNumber(e)
{
	var pageCount;
	var sensorIndex;
	var pageIndex;
	var keycode;

	if (window.event) { //IE
		keycode = window.event.keyCode;
	} else if (e.which) { //Netscape/Firefox/Opera
		keycode = e.which
	}

	if(keycode == 13) { //13-Enter keycode
		if (parseInt(lstSensorName.value) != ALL_SENSORS) {
			//sensorNameType array value starts with 0.
			sensorIndex = parseInt(lstSensorName.value) - 1;
			pageCount = Math.ceil(sensorNameCount[sensorIndex] / EVENT_PAGE_SIZE);
		} else {
			pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
		}

		if (eVal.isnumstr(txtPage.value, FIRSTPAGE, pageCount)) {
			pageIndex = parseInt(txtPage.value);
			if (parseInt(lstSensorName.value) != ALL_SENSORS) {
				loadSELEntries(sensorNameCount, sensorNamePage, sensorIndex, 
					pageIndex);
			} else {
				loadSELEntries(eventTypeCount, eventTypePage, 
					lstEventType.value, pageIndex);
			}
		} else {
			alert (eLang.getString("common", "STR_INVALID_PAGENO") + 
				eLang.getString("common", "STR_HELP_INFO"));
			txtPage.value = bkupPageNumber;
		}
	}
}

/*
 * It will enable the navigation controls based on the page index value.
 * @param count, total number of event entries for the filtered type.
 */
function enablePageButtons(count)
{
	var pgcnt = Math.ceil(count / EVENT_PAGE_SIZE);
	if (SELINFO_DATA.length != 0) {
		if (parseInt(txtPage.value) != FIRSTPAGE) {
			btnFirst.disabled = false;
			btnPrevious.disabled = false;
		}
		if (parseInt(txtPage.value) != pgcnt) {
			btnNext.disabled = false;
			btnLast.disabled = false;
		}
		if (FIRSTPAGE != pgcnt) {
			txtPage.disabled = false;
		}
	}
}

/*
 * It will disable all the navigation controls.
 */
function disablePageButtons()
{
	btnFirst.disabled = true;
	btnPrevious.disabled = true;
	btnNext.disabled = true;
	btnLast.disabled = true;
	txtPage.disabled = true;
}

/*
 * This will fill all the event types in the list box, also initializes with 
 * zero for the count value of the event type records.
 */
function fillEventType()
{
	var i;	//loop counter
	lstEventType.innerHTML = "";
	for (i = 0; i < MAX_EVENT_TYPE; i++) {
		lstEventType.add(new Option(eLang.getString("common", 
			"STR_EVENT_LOG_TYPE" + i), i), isIE ? i : null);
		eventTypeCount[i] = 0;
	}
}

/*
 * This function will be invoked when all the sel entries to be displayed for
 * the first time. It will fill the event type page index for all the records.
 */
function initializeAllEvents()
{
	if (SELINFO_DATA.length != 0) {
		var pgcnt = Math.ceil(SELINFO_DATA.length / EVENT_PAGE_SIZE);
		eventTypeCount[ALL_EVENTS] = SELINFO_DATA.length;
		eventTypePage[ALL_EVENTS] = [];
		for (i = 0; i < pgcnt; i++) {
			eventTypePage[ALL_EVENTS][i+1] = {};
			eventTypePage[ALL_EVENTS][i+1].startIndex = (i * EVENT_PAGE_SIZE);
			eventTypePage[ALL_EVENTS][i+1].endIndex = (i * EVENT_PAGE_SIZE) + (EVENT_PAGE_SIZE - 1);
		}
	}
}

/*
 * This function will be invoked to fill the page index for various
 * event type and sensor names.
 */
function initializePageRange()
{
	var sensorIndex;
	for (j = 0; j < SELINFO_DATA.length; j++) {
		if (SELINFO_DATA[j].RecordType >= 0x0 && 
			SELINFO_DATA[j].RecordType <= 0xBF) {
			//System Event Records
			initializeEventFilter(eventTypePage, eventTypeCount, SYSTEM_EVT, j);
			/*
			 * The following events are filtered under System Event Records
			 * And it is sorted based on its Sensor's Name.
			 */
			if (SELINFO_DATA[j].SensorName != "Unknown") {
				sensorIndex = sensorNameType.indexOf(SELINFO_DATA[j].SensorName);
				if (sensorIndex != -1) {
					initializeEventFilter(sensorNamePage, sensorNameCount, 
						sensorIndex, j);
				}
			}

			/*
			 * The following events are filtered undered System Software ID.
			 * And it is sorted based on its various types. Refer System 
			 * Software IDs table in IPMI specification
			 */
			if (getbits(SELINFO_DATA[j].GenID1, 0, 0) == 1) {
				if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x0) && 
					(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x0F)) {
					//System Software ID - BIOS Generated
					initializeEventFilter(eventTypePage, eventTypeCount, BIOS, j);
				} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x10) && 
					(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x1F)) {
					//System Software ID - SMI Handler
					initializeEventFilter(eventTypePage, eventTypeCount, SMI, j);
				} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x20) && 
					(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x2F)) {
					//System Software ID - System Management Software
					initializeEventFilter(eventTypePage, eventTypeCount, SMS, j);
				} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x30) && 
					(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x3F)) {
					//System Software ID - OEM
					initializeEventFilter(eventTypePage, eventTypeCount, SYSTEM_OEM, j);
				} else if ((getbitsval(SELINFO_DATA[j].GenID1, 7, 1) >= 0x40) && 
					(getbitsval(SELINFO_DATA[j].GenID1, 7, 1) <= 0x46)) {
					//System Software ID - Remote Console software
					initializeEventFilter(eventTypePage, eventTypeCount, RCS, j);
				} else if (getbitsval(SELINFO_DATA[j].GenID1, 7, 1) == 0x47) {
					//System Software ID - Terminal Mode Remote Console software
					initializeEventFilter(eventTypePage, eventTypeCount, TMRCS, j);
				}
			}
		} else if ((SELINFO_DATA[j].RecordType >= 0xC0) &&
			(SELINFO_DATA[j].RecordType <= 0xFF)){
			//C0h-DFh = OEM timestamped
			//E0h-FFh = OEM non-timestamped
			initializeEventFilter(eventTypePage, eventTypeCount, OEM_EVT, j);
		}
	}
}

/*
 * This function will initialize the SEL entries based on event type and 
 * sensor names.
 * @filterTypePage, Object of the event's index for event type or sensor name.
 * @filterTypeCount, Object of the record's count for event type or sensor name.
 * @lstIndex, Index of the event type of sensor name.
 * @eventIndex, Index of the event to be initialized.
 */
function initializeEventFilter(filterTypePage, filterTypeCount, lstIndex, eventIndex)
{
	var pageCount = 0;
	filterTypeCount[lstIndex] += 1;
	if (filterTypeCount[lstIndex] == 1) {
		filterTypePage[lstIndex] = [];
	}

	pageCount = Math.ceil(filterTypeCount[lstIndex] / EVENT_PAGE_SIZE);
	if ((filterTypeCount[lstIndex] % EVENT_PAGE_SIZE) == 1) {
		filterTypePage[lstIndex][pageCount] = {};
		filterTypePage[lstIndex][pageCount].startIndex = eventIndex;
		filterTypePage[lstIndex][pageCount].endIndex = eventIndex;
	} else {
		filterTypePage[lstIndex][pageCount].endIndex = eventIndex;
	}
}

/*
 * This function will initialize the offset value of event/reading type.
 */
function initializeOffsetValue()
{
	/* 
	 * Please refer the IPMI specification. This array contain max allowed 
	 * offset for particular generic Event/Reading Type for 0x1 to 0x0c.
	 */
	m_Max_allowed_offset[0] = 0x0;
	m_Max_allowed_offset[1] = 0x0b;
	m_Max_allowed_offset[2] = 0x3;
	m_Max_allowed_offset[3] = 0x2;
	m_Max_allowed_offset[4] = 0x2;
	m_Max_allowed_offset[5] = 0x2;
	m_Max_allowed_offset[6] = 0x2;
	m_Max_allowed_offset[7] = 0x8;
	m_Max_allowed_offset[8] = 0x2;
	m_Max_allowed_offset[9] = 0x2;
	m_Max_allowed_offset[10] = 0x8;
	m_Max_allowed_offset[11] = 0x7;
	m_Max_allowed_offset[12] = 0x3;

	/* 
	 * Please refer the IPMI specification. This array contain max allowed 
	 * offset for particular generic Event/Reading Type for 0x6f
	 */
	m_Max_allowed_SensorSpecific_offset[5] = 6;
	m_Max_allowed_SensorSpecific_offset[6] = 5;
	m_Max_allowed_SensorSpecific_offset[7] = 12;
	m_Max_allowed_SensorSpecific_offset[8] = 6;
	m_Max_allowed_SensorSpecific_offset[9] = 7;
	m_Max_allowed_SensorSpecific_offset[12] = 10
	m_Max_allowed_SensorSpecific_offset[13] = 8;
	m_Max_allowed_SensorSpecific_offset[15] = 2;
	m_Max_allowed_SensorSpecific_offset[16] = 6;
	m_Max_allowed_SensorSpecific_offset[17] = 7;
	m_Max_allowed_SensorSpecific_offset[18] = 5;
	m_Max_allowed_SensorSpecific_offset[19] = 11;
	m_Max_allowed_SensorSpecific_offset[20] = 4;
	m_Max_allowed_SensorSpecific_offset[25] = 1;
	m_Max_allowed_SensorSpecific_offset[27] = 1;
	m_Max_allowed_SensorSpecific_offset[29] = 7;
	m_Max_allowed_SensorSpecific_offset[30] = 4;
	m_Max_allowed_SensorSpecific_offset[31] = 6;
	m_Max_allowed_SensorSpecific_offset[32] = 5;
	m_Max_allowed_SensorSpecific_offset[33] = 9;
	m_Max_allowed_SensorSpecific_offset[34] = 13;
	m_Max_allowed_SensorSpecific_offset[35] = 8;
	m_Max_allowed_SensorSpecific_offset[36] = 3;
	m_Max_allowed_SensorSpecific_offset[37] = 2;
	m_Max_allowed_SensorSpecific_offset[39] = 1;
	m_Max_allowed_SensorSpecific_offset[40] = 5;
	m_Max_allowed_SensorSpecific_offset[41] = 2;
	m_Max_allowed_SensorSpecific_offset[42] = 3;
	m_Max_allowed_SensorSpecific_offset[43] = 7;
	m_Max_allowed_SensorSpecific_offset[44] = 7;
}
