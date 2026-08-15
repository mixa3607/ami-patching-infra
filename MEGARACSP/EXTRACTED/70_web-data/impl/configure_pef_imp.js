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

// File Name  : configure_pef_imp.js
// Brief      : This implementation is to configure PEF entries.
// Author Name:

var RPCStatus = false;		//It is used to hold the RPC request status

function doInit() {
	exposeElms(["_eventFilter",
		"_alertPolicy",
		"_lanDests",
		"_lblHeader",
		"_lanChannelLabel",
		"_lstLANChannel",
		"_listGridHolder",
		"_sendAlert",
		"_addBtn",
		"_modBtn",
		"_delBtn"
		]);

	if (top.user.isOperator()) {
		disableActions();
	} else if (!top.user.isAdmin()) {
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}

	eventFilter.onclick = doPEFCfg;
	alertPolicy.onclick = doAlertPolicy;
	lanDests.onclick = doLANDestination;
	_begin();
}

function _begin() {
	var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
	if (tabLastVisit != null) {
		$(tabLastVisit).onclick();
	} else {
		doPEFCfg();
	}
}

function clearPEFUI() {
	eventFilter.style.fontWeight = "normal";
	alertPolicy.style.fontWeight = "normal";
	lanDests.style.fontWeight = "normal";
	listGridHolder.innerHTML = "";
	lblHeader.innerHTML = "";
	lanChannelLabel.className = "hiddenRow";
	lstLANChannel.className = "hiddenRow";
	sendAlert.className = "hiddenRow";
	addBtn.onclick = function(){};
	modBtn.onclick = function(){};
	delBtn.onclick = function(){};
	sendAlert.onclick = function(){};
}

function doPEFCfg() {
	clearPEFUI();
	eventFilter.style.fontWeight = "bold";
	loadPEFPageElements();
	initPEFAction();
	getAllPEFCfg();
	reloadHelp();
}

function doAlertPolicy() {
	clearPEFUI();
	alertPolicy.style.fontWeight = "bold";
	loadAlertPolicyElements();
	getAllPolicyCfg();
	initPolicyAction();
	reloadHelp();
}

function doLANDestination() {
	clearPEFUI();
	lanDests.style.fontWeight = "bold";
	sendAlert.className = "visibleRow";
	loadLANDestElements();
	initLANDestAction();
	reloadHelp();
}

function disableButtons() {
	addBtn.disabled = true;
	modBtn.disabled = true;
	delBtn.disabled = true;
	sendAlert.disabled = true;
}
