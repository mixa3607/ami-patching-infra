//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2013        **;
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

// File Name  : configure_video_sol_recordings
// Brief      : 
// Author Name: Kirankumar B

var SOL_UART_LOG=false;

function doInit() {
	 // TODO: add page initialization code
	exposeElms(["_autoVideoRecording",
	    		"_autoSOLRecording",
	    		"_tblAutoVideoEvents",
	    		"_lblDescription",
	    		"_tblTabs",
	    		"_divMain",
	    		//"_tblAutoSOLVideoEvents",
	    		"_btnSave",
	    		"_btnReset"
	    		]);
	
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
	
	SOL_UART_LOG =checkProjectCfg("UARTLOG");
	
	if(SOL_UART_LOG) {
		lblDescription.innerHTML="Use this page to configure Auto Video Recording and SOL Recording.";
		tblTabs.className="visibleRow";
		divMain.className="classicTabContent";
	}
	
	autoVideoRecording.onclick = doAutoVideoCfg;
	autoSOLRecording.onclick = doSOLRecrodingCfg;
	_begin();
}

function _begin() {
	var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
	if (tabLastVisit != null) {
		$(tabLastVisit).onclick();
	} else {
		doAutoVideoCfg();
	}
}

function clearVideoRecordingsUI() {
	autoVideoRecording.style.fontWeight = "normal";
	autoSOLRecording.style.fontWeight = "normal";
	try{
		tblAutoVideoEvents.innerHTML = "";
	}catch(e){
		$("divAutoVideoEvents").innHTML = "<table cellspacing='5' cellpadding='5' border='0'width='1000' id='_tblAutoVideoEvent'></table>";
	}
}

function doAutoVideoCfg() {
	clearVideoRecordingsUI();
	autoVideoRecording.style.fontWeight = "bold";
	getSystemDateTime();
	reloadHelp();
}
function doSOLRecrodingCfg() {
	clearVideoRecordingsUI();
	autoSOLRecording.style.fontWeight = "bold";	
	getSystemDateTime();
	reloadHelp();
}
