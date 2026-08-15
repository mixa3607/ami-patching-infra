//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2010        **;
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

// File Name  : configure_pamorder_imp.js
// Brief      : This implementation is to display and configure the PAM Order 
// for User authentication into the BMC.
// Author Name: Arockia Selva Rani. A

var PAMORDER_DATA;	//It holds RPC response data of services configuration.
var MININDEX = 0;	//Minimum PAM index
var pamHighlightIndex = -1;	//It holds the highlighted PAM Module index 
var pamModue = [];	//It used to holds the PAM Module list
var DefTblPAM = [];	//It used to holds the default PAM Table
/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {
	exposeElms(["_tblPAM",
		"_btnNAV",
		"_btnUp",
		"_btnDown",
		"_btnTray",
		"_btnSave",
		"_btnReset"]);

	if (top.user.isAdmin()) {
		btnUp.onclick = movePAMUp;
		btnDown.onclick = movePAMDown;
		btnSave.onclick = setPAMOrder;
		btnReset.onclick = ResetTblPam;
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin() {
	pamModule = {1: "IPMI", 2: "LDAP", 3: "Active Directory", 4: "RADIUS"};
	getPAMOrder();
}

/*
 * It will invoke the RPC method to get the PAM Order configuration. Once it
 * get response from RPC, on receive method will be called automatically.
 */
function getPAMOrder() {
	xmit.get({url:"/rpc/getpamorder.asp", onrcv:getPAMOrderRes, status:""});
}

/*
 * This is the response function for getPAMOrder RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getPAMOrderRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_PAM_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		PAMORDER_DATA = WEBVAR_JSONVAR_GETPAMORDER.WEBVAR_STRUCTNAME_GETPAMORDER;
		loadPAMOrder();
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
 
function loadPAMOrder() {
	var i;	//Loop counter
	var tbody = document.createElement("tbody");
	for (i = 1; i <= PAMORDER_DATA.length; i++) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		var div = document.createElement("div");
		div.id = "_divPAM" + i;
		div.className = "pamNormal";
		div.innerHTML = pamModule[PAMORDER_DATA[i-1].POSITION];
		th.appendChild(div);
		tr.appendChild(th);
		tbody.appendChild(tr);
	}
	tblPAM.appendChild(tbody);
	DefTblPam();
	if (tblPAM.rows.length < 2) {
		btnNAV.className = btnTray.className = "hiddenRow";
	} else {
		initializePAM();
	}
} 

function DefTblPam() {

	DefTblPAM[0] = tblPAM.rows[0].cells[0].innerHTML;
	DefTblPAM[1] = tblPAM.rows[1].cells[0].innerHTML;
	DefTblPAM[2] = tblPAM.rows[2].cells[0].innerHTML;
	DefTblPAM[3] = tblPAM.rows[3].cells[0].innerHTML;
}

/*
 * It will initialize the function handler for all the PAM div elements.
 */
function initializePAM() {
	var i;	//Loop counter
	for (i = 1;i <= tblPAM.rows.length; i++) {
	try {
		$("_divPAM" + i ).onclick = highlightPAM;
		} catch(e) {
			alert(eLang.getString("common", "STR_CONF_PAM__INITIALIZE_ERR"));
		}
	}
}

/*
 * It will clear all the PAM div elements to default background.
 */
function clearPAM() {
	var i;	//Loop counter
	for (i = 1;i <= tblPAM.rows.length; i++) {
	try{
		$("_divPAM" + i ).style.backgroundColor = "#ffffff";
		} catch(e) { 
			alert(eLang.getString("common", "STR_CONF_PAM__SELECT_ERR"));
		}
	}
}

/*
 * Whenever user clicks a PAM div element, it gets highlighted.
 * It will invoke the disable navigation buttons based on its index.
 */
function highlightPAM() {
	clearPAM();
	this.style.backgroundColor = "#cccccc";
	pamHighlightIndex = getHighlightPAMIndex(this.id);
	disableNavButtons(pamHighlightIndex);
}
/*
 * It will move up the selected PAM and initialize the function handler.
 */
function movePAMUp() {
	if (pamHighlightIndex == -1) {
		return;
	}
	if (pamHighlightIndex != MININDEX) {
		swapElement (pamHighlightIndex, pamHighlightIndex - 1);
		pamHighlightIndex--;
		disableNavButtons(pamHighlightIndex);
		initializePAM();
	}
}

/*
 * It will move down the selected PAM and initialize the function handler.
 */
function movePAMDown() {
	if (pamHighlightIndex == -1) {
		return;
	}
	if (pamHighlightIndex != (tblPAM.rows.length - 1)) {
		swapElement (pamHighlightIndex, pamHighlightIndex + 1);
		pamHighlightIndex++;
		disableNavButtons(pamHighlightIndex);
		initializePAM();
	}
}

/*
 * It will swap the row content of the PAM table.
 */
function swapElement(elmtIndex1, elmtIndex2) {
	var temp;	//It hold table object
	temp = tblPAM.rows[elmtIndex1].cells[0].innerHTML;
	tblPAM.rows[elmtIndex1].cells[0].innerHTML = 
		tblPAM.rows[elmtIndex2].cells[0].innerHTML;
	tblPAM.rows[elmtIndex2].cells[0].innerHTML = temp;
}

function ResetTblPam() {
	tblPAM.rows[0].cells[0].innerHTML= DefTblPAM[0];
	tblPAM.rows[1].cells[0].innerHTML= DefTblPAM[1];
	tblPAM.rows[2].cells[0].innerHTML= DefTblPAM[2];
	tblPAM.rows[3].cells[0].innerHTML= DefTblPAM[3];
	initializePAM();
}

/*
 * It will invoke the RPC method to set the PAM order configuration. Once it
 * get response from RPC, on receive method will be called automatically.
 */
function setPAMOrder() {
	var req;			//xmit object to send RPC request with parameters
	var pamPosition = [];	//Array to hold the PAM Order
	var i, count = 0; //Loop counters
	var index;			//Variable to hold the PAM Position order
	if (confirm(eLang.getString("common", "STR_CONF_PAM_CONFIRM") + 
			eLang.getString("common", "STR_CONF_SERVICES_CNFMWEB"))) {
		req = new xmit.getset({url:"/rpc/setpamorder.asp", onrcv:setPAMOrderRes, 
			status:""});
		for (i = 0; i < tblPAM.rows.length; i++) {
			index = getPAMPosition(i);
			pamPosition[count++] = index;
		}
		req.add("COUNT", count);
		req.add("POSITION", pamPosition);
		req.send();
		delete req;
	}
}

/*
 * This is the response function for setPAMOrder RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting virtual media configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setPAMOrderRes(arg) {
	var errstr;		//Error string
	switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
	case 0x0:
		restartWebServer();
		break;
	case 0x90:
		alert (eLang.getString("common", "STR_CONF_PAM_ERR"));
		break;
	default:
		errstr = eLang.getString("common", "STR_CONF_PAM_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

/* This method is used to get the highlighted PAM index position.
 * @param highlightID HTML DOM id, Selected PAM Module id
 * @return pamIndex number, Selected PAM Module position
 */
function getHighlightPAMIndex(highlightID) {
	var i;	//Loop Counter
	var pamIndex = -1;
	for (i = 0; i < tblPAM.rows.length; i++) {
		if (tblPAM.rows[i].cells[0].innerHTML.indexOf(highlightID) != -1) {
			pamIndex = i;
			break;
		}
	}
	if (pamIndex == -1) {
		alert ("Error in getting PAM Index");
	}
	return (pamIndex);
}

/* This method will used to disable the navigation buttons.
 * @param index number, Selected PAM Module position
 */
function disableNavButtons(index) {
	enableNavButtons(false);
	if (index == MININDEX) {
		btnUp.disabled = true;
	} else if (index == (tblPAM.rows.length - 1)) {
		btnDown.disabled = true;
	}
}

/* This method will used to enable/disable the navigation buttons.
 * @param option boolean, true/false.
 */
function enableNavButtons(option) {
	btnUp.disabled = option;
	btnDown.disabled = option;
}

/* This method is used to get the highlighted PAM index position from the PAM Module list
 * @param index number, table rows index
 * @return pamIndex number, PAM Module position
 */
function getPAMPosition(index) {
	var i;	//Loop counter
	var pamIndex = -1;	//It holds the PAM Module index
	var pamName = ""; //String to hold the PAM Module name	
	pamName = tblPAM.rows[index].cells[0].firstChild.innerHTML;
	for (i in pamModule) {
		if (pamModule[i] == pamName) {
			pamIndex = i;
			break;
		}
	}
	if (pamIndex == -1) {
		alert ("Error in getting PAM Position");
	}
	return (pamIndex);
}