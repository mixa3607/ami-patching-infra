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

// File Name  : lan_dest_imp.js
// Brief      : This implementation is to configure LAN destination entries.
// Author Name:

var LANDESTS_DATA;	//Holds RPC response data of LAN destination
var USERINFO_DATA;	//Holds RPC response data of User information
var SMTPCFG_DATA;	//Holds RPC response data of SMTP configuration

var tblLANDests;	//List grid object to hold LAN destination
var tblJSON;		//Object to hold image information in JSON structure

/*
 * The following are the constants used in this implementation.
 * The below listed is for media types available.
 */
var CONST_SEND_ALERT = 4;		//Constant for Sent Test alert operation
var CONST_MAX_LAN_DESTS = 15;	//Maximum LAN destinations for each channel
var CONST_DESTTYPE_SNMP = 0;	//Destination type - SNMP
var CONST_DESTTYPE_EMAIL = 6;	//Destination type - EMail
var CONST_AMIFORMAT_EMAIL = "AMI-Format";	//AMI-Email formate, EMail type
var CONST_DESTADDR_IPV4 = 0;	//Destination address in IPv4 format
var CONST_DESTADDR_IPV6 = 1;	//Destination address in IPv6 format

var varLANDestOper;				//Integer to hold LAN destination operation
var varAddrFormat = CONST_DESTADDR_IPV4;	//By default IPv4 Address Format.
var selectedRowIndex;			//Used to hold the selected row index value

/*
 * This function is used to initialize the LAN destination page when LAN
 * destination option is clicked.
 * Also initialized the event handler for various buttons.
 */
function initLANDestAction()
{
	getSMTPCfg();
	getAllUserInfo();
	lanChannelLabel.className = "visibleRow";
	lstLANChannel.className = "visibleRow";
	addBtn.onclick = function() {
		doLANDest(top.CONSTANTS.ADD);
	};
	modBtn.onclick = function() {
		doLANDest(top.CONSTANTS.MODIFY);
	};
	delBtn.onclick = function() {
		doLANDest(top.CONSTANTS.DELETE);
	};
	sendAlert.onclick = function() {
		doLANDest(CONST_SEND_ALERT);
	};
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select and double click event handler.
 */
function loadLANDestElements()
{
	var height = parent.$("pageFrame").offsetHeight - 270;
	height = (height > 45) ? height : 45;
	tblLANDests = listgrid({
		w : "100%",
		h : height + "px",
		doAllowNoSelect : false
	});

	listGridHolder.appendChild(tblLANDests.table);

	try {
		tblJSON = {
			cols:[
			{text:eLang.getString("common", "STR_LAN_DEST_HEAD1"),
				fieldType:2, w:"15%", textAlign:"center"},
			{text:eLang.getString("common", "STR_LAN_DEST_HEAD2"),
				w:"35%", textAlign:"center"},
			{text:eLang.getString("common", "STR_LAN_DEST_HEAD3"),
				w:"47%", textAlign:"center"}
			]
		};

		tblLANDests.loadFromJson(tblJSON);
	} catch(e) {
		alert(e);
	}

	if (top.user.isAdmin()) {
		/*
		 * This event handler will be invoked when the list grid row is selected.
		 */
		tblLANDests.ontableselect = function ()
		{
			var selectedindex;
			disableButtons();
			if (this.selected.length) {
				var desttype = tblLANDests.getRow(tblLANDests.selected[0]);
				desttype = desttype.cells[1].innerHTML.replace("&nbsp;", "");
				desttype = desttype.replace(" ", "");
				if (desttype == "~") {
					addBtn.disabled = false;
				} else {
					modBtn.disabled = false;
					delBtn.disabled = false;
					selectedindex = tblLANDests.getRow(tblLANDests.selected[0]);
					selectedindex = parseInt(selectedindex.cells[0].innerHTML);
					index = getListIndex(lstLANChannel, lstLANChannel.value);
					//index starts with 0
					index = (index * CONST_MAX_LAN_DESTS) + selectedindex - 1;
					if (LANDESTS_DATA[index].DestType == CONST_DESTTYPE_EMAIL) {
						index = getIndex(lstLANChannel.value)
						sendAlert.disabled = !(SMTPCFG_DATA[index].SMTPENABLE1 ||
							SMTPCFG_DATA[index].SMTPENABLE2);
					} else {
						sendAlert.disabled = false;
					}
				}
			}
		};

		/*
		 * This event handler will be invoked when double click in list grid row.
		 */
		tblLANDests.ondblclick = function()
		{
			var desttype = tblLANDests.getRow(tblLANDests.selected[0]);
			desttype = desttype.cells[1].innerHTML.replace("&nbsp;", "");
			desttype = desttype.replace(" ", "");
			if (desttype == "~") {
				doLANDest(top.CONSTANTS.ADD);
			} else {
				doLANDest(top.CONSTANTS.MODIFY);
			}
		};
	}
}

/*
 * It will invoke the RPC method to get the SMTP configuration.
 * Once it get response from RPC, onreceive method will be called automatically.
 */
function getSMTPCfg()
{
	xmit.get({url:"/rpc/getsmtpcfg.asp", onrcv:getSMTPCfgRes, status:""});
}

/*
 * This is the response function for getSMTPCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable.
 * @param arg object, RPC response data from xmit library
 */
function getSMTPCfgRes(arg)
{
	var errstr;		//Error string
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_SMTP_GETVAL");
		errstr +=(eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		SMTPCFG_DATA = WEBVAR_JSONVAR_GETSMTPCFG.WEBVAR_STRUCTNAME_GETSMTPCFG;
	}
}

/*
 * It will invoke the RPC method to get all user information.
 * Once it get response from RPC, onreceive method will be called automatically.
 */
function getAllUserInfo()
{
	lstLANChannel.disabled = false;
	xmit.get({url:"/rpc/getalluserinfo.asp",onrcv:getAllUserInfoRes, status:""});
}

/*
 * This is the response function for getAllUserInfo RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable.
 * @param arg object, RPC response data from xmit library
 */
function getAllUserInfoRes (arg)
{
	if (GET_ERROR_CODE(arg.HAPI_STATUS) == 0xD4) {//Insufficient privilege level
		alert (eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	} else if (arg.HAPI_STATUS) {
		var errstr =  eLang.getString("common", "STR_CONF_USER_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		USERINFO_DATA = WEBVAR_JSONVAR_HL_GETALLUSERINFO.WEBVAR_STRUCTNAME_HL_GETALLUSERINFO;
	}
	getLANDestsTable();
}

/*
 * It will invoke the RPC method to get LAN destination configuration.
 * Once it get response from RPC, onreceive method will be called automatically.
 */
function getLANDestsTable()
{
	disableButtons();
	xmit.get({url:"/rpc/getlandeststable.asp", onrcv:getLANDestsRes,
		status:""});
}

/*
 * This is the response function for getLANDestsTable RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and load the data
 * in UI controls.
 * @param arg object, RPC response data from xmit library
 */
function getLANDestsRes (arg)
{
	if (GET_ERROR_CODE(arg.HAPI_STATUS) == 0xD4) {//Insufficient privilege level
		alert (eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	} else if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_LAN_DEST_GETVAL")
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		LANDESTS_DATA = WEBVAR_JSONVAR_HL_GETLANDESTSTABLE.WEBVAR_STRUCTNAME_HL_GETLANDESTSTABLE;
		if (LANDESTS_DATA.length == 0)
			alert(eLang.getString("common", "NO_LANALERTDESTS_STRING"));
		loadLanChannel();
	}
}

/*
 * It will load the LAN channel information in the list box.
 */
function loadLanChannel()
{
	lstLANChannel.innerHTML = "";
	for (i = 0; i < LANDESTS_DATA.length; i++) {
		lstLANChannel.add(new Option(LANDESTS_DATA[i].CHANNEL_NUM, 
			LANDESTS_DATA[i].CHANNEL_NUM), isIE ? i : null);
	}

	if (top.mainFrame.pageFrame.location.hash) {
		lstLANChannel.value = comboParser(top.mainFrame.pageFrame.location.hash,
			lstLANChannel.id);	//id->id of the selection box
	}
	removeDuplicate(lstLANChannel);
	lstLANChannel.onchange = loadLANDestTable;
	loadLANDestTable();
}

/*
 * It will load response LAN destination data from global variable to list grid 
 * control in UI.
 */
function loadLANDestTable()
{
	var landest_count = 0;		//Count of configured LAN destination
	var dest_type_todisplay;	//destination type to display in List grid
	var dest_addr_todisplay;	//destination address to display in List grid
	var userIndex;				//User index to map with User information
	var serialIndex = 0;		//Serial Index of LAN dest's for each channel
	var i = 0;					//loop counter
	var rowJSON = [];			//Object of array of rows to load list grid

	tblLANDests.clear();
	for (i = 0; i < LANDESTS_DATA.length; i++) {
		if (lstLANChannel.value == LANDESTS_DATA[i].CHANNEL_NUM) {
			//Use ~ char to indicate free slot so it will sort alphabetically
			serialIndex++;
			dest_type_todisplay = "~";
			dest_addr_todisplay = "~";
			if (! ((LANDESTS_DATA[i].DestAddr == eLang.getString("common",
					"STR_IPV4_ADDR0") ||
				LANDESTS_DATA[i].DestAddr == eLang.getString("common",
					"STR_IPV6_ADDR0") ||
				LANDESTS_DATA[i].DestAddr == "") &&
				(LANDESTS_DATA[i].UserID == 0)) || (LANDESTS_DATA[i].UserID == 0)&&
				(LANDESTS_DATA[i].DestType == CONST_DESTTYPE_EMAIL)) {
				landest_count++;
				dest_type_todisplay = eLang.getString("common",
					"STR_DEST_TYPE_" + LANDESTS_DATA[i].DestType);
				if (LANDESTS_DATA[i].DestType == CONST_DESTTYPE_SNMP) {
					dest_addr_todisplay = LANDESTS_DATA[i].DestAddr;
				} else if (LANDESTS_DATA[i].DestType == CONST_DESTTYPE_EMAIL) {
					//User ID index starts with 0
					userIndex = (LANDESTS_DATA[i].UserID == 0) ? 
						LANDESTS_DATA[i].UserID : LANDESTS_DATA[i].UserID - 1;
					dest_addr_todisplay = USERINFO_DATA[userIndex].UserName;
					if(USERINFO_DATA[userIndex].EmailID != "") {
						dest_addr_todisplay += "(" +
							USERINFO_DATA[userIndex].EmailID + ")";
					}
				}
			}
			try {
				rowJSON.push({cells:[
					{text : serialIndex, value : serialIndex},
					{text : dest_type_todisplay, value : dest_type_todisplay},
					{text : dest_addr_todisplay, value : dest_addr_todisplay}
				]});
			} catch(e) {
				alert(e);
			}
		}
	}

	tblJSON.rows = rowJSON;
	tblLANDests.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_LAN_DEST_CNT") + "</strong>" + landest_count +
		eLang.getString("common", "STR_BLANK");
}

/*
 * This will get index from the selected row of list grid, based on the data
 * in selected row and user inputs, it will invoke corresponding operation
 * @param oper integer, LAN destination operation. 1-Add, 2-Modify, 3-Delete &
 * 4-Send Test Alert
 */
function doLANDest(oper)
{
	var selectedrow;
	var selectedindex;
	var selecteddesttype;

	if ((tblLANDests.selected.length != 1) ||
		(tblLANDests.selected[0].cells[0] == undefined) ||
		(tblLANDests.selected[0].cells[0] == null)) {
		alert(eLang.getString("common", "STR_LAN_DEST_ERR1"));
		disableButtons();
		return;
	} else {
		selectedrow = tblLANDests.getRow(tblLANDests.selected[0]);
		selectedindex = parseInt(selectedrow.cells[0].innerHTML);
		selectedRowIndex = selectedindex - 1;
		selecteddesttype = selectedrow.cells[1].innerHTML.replace("&nbsp;", "");
		selecteddesttype = selecteddesttype.replace(" ", "")
		switch(oper) {
		case top.CONSTANTS.ADD:
			if ("~" != selecteddesttype) {
				if (confirm(eLang.getString("common",
					"STR_LAN_DEST_CONFIRM1"))) {
					frmLANDest(selectedindex, top.CONSTANTS.MODIFY);
				}
			} else {
				frmLANDest(selectedindex, top.CONSTANTS.ADD);
			}
		break;
		case top.CONSTANTS.MODIFY:
			if ("~" == selecteddesttype) {
				if (confirm(eLang.getString("common",
					"STR_LAN_DEST_CONFIRM2"))) {
					frmLANDest(selectedindex, top.CONSTANTS.ADD);
				}
			} else {
				frmLANDest(selectedindex, top.CONSTANTS.MODIFY);
			}
		break;
		case top.CONSTANTS.DELETE:
			if ("~" == selecteddesttype) {
				alert (eLang.getString("common", "STR_LAN_DEST_ERR2"));
				disableButtons();
			} else {
				if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
					deleteLANDest(selectedindex);
				}
			}
		break;
		case CONST_SEND_ALERT:
			if ("~" == selecteddesttype) {
				alert (eLang.getString("common", "STR_LAN_DEST_ERR2"));
				disableButtons();
			} else {
				sendTestAlert(selectedindex);
			}
		break;
		}
	}

}

/*
 * It will display a form, which contains UI controls to add or modify the LAN 
 * destination configuration.
 * @param destID number, LAN destination ID of selected slot in list grid.
 * @param oper integer, LAN destination operation. 1 - Add, 2 - Modify.
 */
function frmLANDest(destID, oper)
{
	var formname = "";
	var btnname = "";
	var btnvalue = "";
	var index;

	varLANDestOper = oper;

	switch (oper) {
	case top.CONSTANTS.ADD:
		formname = "addLANDestForm";
		btnname = "btnFormAdd";
		btnvalue = eLang.getString("common", "STR_ADD");
		break;
	case top.CONSTANTS.MODIFY:
		formname = "modifyLANDestForm";
		btnname = "btnFormModify";
		btnvalue = eLang.getString("common", "STR_MODIFY");
		break;
	}

	var frm = new form(formname, "POST", "javascript://", "general");

	txtLANChannel = frm.addTextField("LAN Channel Number", "_txtLANChannel",
		lstLANChannel.value, {"readOnly" : true}, "smallclassicTxtBox");

	txtDestID = frm.addTextField(eLang.getString("common", "STR_LAN_DEST_HEAD1"),
		"_txtDestID", destID, {"readOnly" : true}, "smallclassicTxtBox");

	lstDestType = frm.addSelectBox(eLang.getString("common",
		"STR_LAN_DEST_HEAD2"), "_lstDestType", "", "", "", "",
		"classicTxtBox");
	fillDestType();

	txtDestAddr = frm.addTextField(eLang.getString("common",
		"STR_LAN_DEST_HEAD3"), "_txtDestAddr", "", {"maxLength":63},
		"bigclassicTxtBox");

	lstUsername = frm.addSelectBox(eLang.getString("common",
		"STR_CONF_USER_NAME"), "_lstUsername", "", "" ,"", "", "classicTxtBox");
	fillUserName();

	txtSubject = frm.addTextField(eLang.getString("common",
		"STR_EMAIL_SUBJECT"), "_txtSubject", "", {"maxLength" : 31},
		"classicTxtBox");
	txtMessage = frm.addTextField(eLang.getString("common",
		"STR_EMAIL_MESSAGE"), "_txtMessage", "", {"maxLength":63},
		"bigclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton(btnname, btnvalue, validateLANDest));
	btnAry.push(createButton("cancelBtn", eLang.getString("common",
		"STR_CANCEL"), closeLANDestForm));

	wnd = MessageBox(eLang.getString("common", "STR_LAN_DEST_" + oper),
		frm.display(), btnAry);

	txtLANChannel.onkeydown = checkBackspace;
	txtDestID.onkeydown = checkBackspace;
	lstDestType.onchange = doDestType;
	lstUsername.onchange = doUserType;

	wnd.onclose = getAllUserInfo;
	reloadLANDestInfo(destID);
}

/* This function is used to load the rpc data into respecitve UI Controls */
function reloadLANDestInfo(destid) 
{	
	var sIndex=0;
	for (i = 0; i < LANDESTS_DATA.length; i++) {
		if (lstLANChannel.value == LANDESTS_DATA[i].CHANNEL_NUM) {
			sIndex++;
			if(sIndex == destid) {
				lstDestType.value = LANDESTS_DATA[i].DestType;
				txtDestAddr.value = LANDESTS_DATA[i].DestAddr;
				lstUsername.value = LANDESTS_DATA[i].UserID;
			}
		}
	}
	doDestType();
}

/*
 * It will validate the data of LAN destination user controls before saving it.
 */
function validateLANDest()
{
	if (lstDestType.value == CONST_DESTTYPE_SNMP) {
		if (eVal.ip(txtDestAddr.value)) {
			varAddrFormat = CONST_DESTADDR_IPV4;
		} else if (eVal.ipv6(txtDestAddr.value, false, false)) {
			varAddrFormat = CONST_DESTADDR_IPV6;
		} else {
			alert(eLang.getString("common", "STR_LAN_DEST_ADDR_ERR") + 
				eLang.getString("common", "STR_HELP_INFO"));
			txtDestAddr.focus();
			return;
		}
	} else if (lstDestType.value == CONST_DESTTYPE_EMAIL) {
		if ((USERINFO_DATA[(lstUsername.value - 1)].EmailFormat) != 
			CONST_AMIFORMAT_EMAIL) {
			if (eVal.isblank(eVal.trim(txtSubject.value))) {
				alert(eLang.getString("common", "STR_LAN_EMAIL_SUB_ERR"));
				txtSubject.focus();
				return;
			}
			if(eVal.isblank(eVal.trim(txtMessage.value))) {
				alert(eLang.getString("common", "STR_LAN_EMAIL_MSG_ERR"));
				txtMessage.focus();
				return;
			}
		}
		if (eVal.isblank(USERINFO_DATA[(lstUsername.value - 1)].EmailID)) {
			if (!confirm(eLang.getString("common",
				"STR_LAN_NO_EMAIL_CONFIRM"))) {
				lstUsername.focus();
				return;
			}
		}
	}
	setLANDest();
}

/*
 * It will invoke the RPC method to set the LAN destination configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setLANDest()
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setlandest.asp", onrcv:setLANDestRes,
		status:""});
	req.add("LANChannel", txtLANChannel.value);
	req.add("LANDestIndex", txtDestID.value);
	req.add("DestType", lstDestType.value);
	req.add("AddressFormat", varAddrFormat);
	req.add("DestAddress", txtDestAddr.value);
	req.add("UserID",lstUsername.value);
	req.add("Subject", txtSubject.value);
	req.add("Message", txtMessage.value);
	req.send();
	delete req;
}

/*
 * This is the response function for setLANDest RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set LAN destination configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setLANDestRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_LAN_DEST_SETVAL")
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		alert (eLang.getString("common", "STR_LAN_DEST_SUCCESS_" +
			varLANDestOper));
		closeLANDestForm();
	}
}

/*
 * It will invoke the RPC method to delete the LAN destination configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 * @param destid number, destination ID of the selected row in list grid.
 */
function deleteLANDest(destid)
{
 	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setlandest.asp", onrcv:deleteLANDestRes,
		status:""});
	req.add("LANChannel", lstLANChannel.value);
	req.add("LANDestIndex", destid);
	req.add("DestType", CONST_DESTTYPE_SNMP);
	req.add("AddressFormat", CONST_DESTADDR_IPV4);
	req.add("DestAddress", eLang.getString("common", "STR_IPV4_ADDR0"));
	req.add("UserID", 0);
	req.add("Subject", "");
	req.add("Message", "");
	req.send();
	delete req;
}

/*
 * This is the response function for deleteLANDest RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then delete LAN destination configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function deleteLANDestRes(arg)
{
	if(arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_LAN_DEST_DELETEVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
	} else {
		alert (eLang.getString("common", "STR_LAN_DEST_DEL_SUCCESS"));
		getAllUserInfo();
	}
}

/*
 * It will invoke the RPC method to send test alert for LAN destination.
 * Once it get response from RPC, on receive method will be called automatically.
 * @param destid number, destination ID of the selected row in list grid.
 */
function sendTestAlert(destid)
{
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/testalert.asp", onrcv:sendTestAlertRes,
		status:""});
	req.add("WEBVAR_DSTSEL", destid);
	req.add("WEBVAR_LANCHANNEL", lstLANChannel.value);
	req.send();
	delete req;
}

/*
 * This is the response function for sendTestAlert RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then send test alert is success, intimate proper message to end user
 * @param arg object, RPC response data from xmit library
 */
function sendTestAlertRes(arg)
{
	switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
	case 0x0:
		alert(eLang.getString("common", "STR_LAN_DEST_ALERT_SUCCESS"));
		break;
	case 0x80: case 0x81: case 0x82:
		alert (eLang.getString("common", "STR_SMTP_FAILURE" +
			(GET_ERROR_CODE(arg.HAPI_STATUS) - 0x7F)));
		break;
	case 0xF:
		alert (eLang.getString("common", "STR_EMAIL_FAILURE1"));
		break;
	case 0x10:
		alert (eLang.getString("common", "STR_EMAIL_FAILURE2"));
		break;
	case 0xD3:
		alert (eLang.getString("common", "STR_EMAIL_TESTALERT"));
		break;
	case 0x16:
		alert (eLang.getString("common", "STR_EMAIL_USER_ACCESS"));
		break;
	default:
		errstr = eLang.getString("common", "STR_LAN_DEST_ALERT_FAILURE");
		errstr += eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS);
		alert (errstr);
	}
}

/*
 * This will enable or disable the UI controls based on destination type value.
 */
function doDestType()
{
	var bopt = (lstDestType.value == CONST_DESTTYPE_SNMP) ? true : false;
	if (!bopt) {
		txtDestAddr.value = "";
	}
	txtDestAddr.disabled = !bopt;
	lstUsername.disabled = bopt;
	doUserType();
}

/*
* This will enable/disable UI controls based on the User type
*/
function doUserType() 
{
	var bopt = (lstUsername.disabled || 
		(USERINFO_DATA[lstUsername.value - 1].EmailFormat == 
		CONST_AMIFORMAT_EMAIL));
	txtSubject.value = "";
	txtMessage.value = "";
	if (!bopt) {
	var sIndex=0;
	var destid= txtDestID.value;
	for (i = 0; i < LANDESTS_DATA.length; i++) {
		if (lstLANChannel.value == LANDESTS_DATA[i].CHANNEL_NUM) {
			sIndex++;
			if(sIndex == destid) {
				txtSubject.value = LANDESTS_DATA[i].Subject;
				txtMessage.value = LANDESTS_DATA[i].Message;
				}
			}
		}
	}
	clearDestInfo(bopt);
} 

/*
 * This will clear and enable/diable the UI control values.
 */
function clearDestInfo(bopt) {
	txtSubject.disabled = bopt;
	txtMessage.disabled = bopt;
}

/*
 * Used to close the form which is used to add or replace the LAN destination
 */
function closeLANDestForm()
{
	wnd.close();
}

/*
 * This will fill the user names in user name list box with User information
 */
function fillUserName()
{
	var optind = 0;
	var i = 0;	//loop counter
	lstUsername.innerHTML = "";
	for(i = 0; i < USERINFO_DATA.length; i++) {
		if ((USERINFO_DATA[i].UserName != undefined) && 
			(USERINFO_DATA[i].UserName != "")) {
			lstUsername.add(new Option(USERINFO_DATA[i].UserName,
				(i + 1)), isIE ? optind++ : null);
		}
	}
}

/*
 * This will fill available LAN destination types in listbox.
 */
function fillDestType()
{
	var optind = 0;
	lstDestType.innerHTML = "";
	lstDestType.add(new Option(eLang.getString("common", "STR_DEST_TYPE_" +
		CONST_DESTTYPE_SNMP), CONST_DESTTYPE_SNMP), isIE ? optind++ : null);
	lstDestType.add(new Option(eLang.getString("common", "STR_DEST_TYPE_" +
		CONST_DESTTYPE_EMAIL), CONST_DESTTYPE_EMAIL), isIE ? optind++ : null);
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

