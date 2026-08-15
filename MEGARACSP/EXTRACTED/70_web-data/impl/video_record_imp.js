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

// File Name  : video_record_imp.js
// Brief      : This implementation is to display the video files in list grid. 
// It contains implementation to play, download and delete the video files.
// Author Name: Arockia Selva Rani. A

var tblJSON;		//object to hold video information in JSON structure
var tblVideo		//List grid object to hold video information
var VIDEO_INFO;		//It holds the get RPC response data
var varVideoOper = 0;	//Specifies the Video Operation
var REMOTEVIDEO_CFG		//It holds the RPC response data for remote video configurations
var AUTOVIDEO_REMOTE = false;		//It used to hold the feature for Remote video share support
var EXTENDED_PRIV = false;		//It used to hold the Extended privilege feature support

var SOL_UART_LOG=false;
var SOL_UART_REMOTE=false;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {
	exposeElms(["_lblHeader",
		"_tabAutoVideo",
		"_tabSOLVideo",
		"_tblRVideo",
		"_lblRVideoDesc",
		"_lblPlayVideo",
		"_btnAdvSettings",
		"_divMountError",
		"_lgdVideo",
		"_btnPlay",
		"_tblTab",
		"_divTab",
		"_btnDownload",
		"_btnDelete"]);

	btnPlay.onclick = playVideo;
	btnDownload.onclick = downloadVideo;
	btnDelete.onclick = deleteVideo;
	
	tabAutoVideo.onclick = doAutoRecordedVideo;
	tabSOLVideo.onclick = doSOLRecordedVideo;
	
	SOL_UART_LOG =checkProjectCfg("UARTLOG");
	SOL_UART_REMOTE =checkProjectCfg("UARTLOG_REMOTE");
	
	if(SOL_UART_LOG){
		tblTab.className="visibleRow";
		divTab.className="classicTabContent";
	}
	_begin();
}

/*
 * It will invoke loadCustomPageElements method to load list grid.
 * Also it will invoke the RPC method to get the data for the page.
 */
function _begin() {
	var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
	if (tabLastVisit != null) {
		$(tabLastVisit).onclick();
	} else {
		doAutoRecordedVideo();
	}
}

function clearRecordedVideoUI() {
	tabAutoVideo.style.fontWeight = "normal";
	tabSOLVideo.style.fontWeight = "normal";
	lgdVideo.innerHTML = "";
	btnPlay.className="hiddenRow";
	btnAdvSettings.onclick={};
}



function doAutoRecordedVideo() {
	clearRecordedVideoUI();
	tabAutoVideo.style.fontWeight = "bold";
	btnPlay.className="visibleRow";
	lblPlayVideo.className="visibleRow";
	reloadHelp();
	getVideoInfo();
    window.currentTab = "VIDEO";
	AUTOVIDEO_REMOTE = checkProjectCfg("AUTOVDORECORD_REMOTE");
	EXTENDED_PRIV = checkProjectCfg("EXTENDED_PRIV");
	loadCustomPageElements();
	disableButtons(true);
	if (AUTOVIDEO_REMOTE) {
		tblRVideo.className = "visibleRow";
		btnAdvSettings.onclick = frmRemoteVideoCfg;
		getRemoteVideoCfg();
	}
}

function doSOLRecordedVideo() {
	clearRecordedVideoUI();
	tabSOLVideo.style.fontWeight = "bold";
	btnPlay.className="hiddenRow";
	lblPlayVideo.className="hiddenRow";
	reloadHelp();
	getSOLVideoInfo();
    window.currentTab = "SOL";
	//AUTOVIDEO_REMOTE = checkProjectCfg("AUTOVDORECORD_REMOTE");
	EXTENDED_PRIV = checkProjectCfg("EXTENDED_PRIV");
	loadCustomPageElements();
	disableButtons(true);
	if (SOL_UART_REMOTE) {
		tblRVideo.className = "visibleRow";
		btnAdvSettings.onclick = frmSOLRemoteVideoCfg;
		getSOLRemoteVideoCfg();
	}
}
/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select and double click event handler.  
 */
function loadCustomPageElements() {
	lgdVideo.innerHTML = "";
	tblVideo = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	lgdVideo.appendChild(tblVideo.table);

	if(tabAutoVideo.style.fontWeight=="bold") {
		tblJSON = {cols:[
				{text : eLang.getString("common", "STR_HASH"),
					fieldName:"file_no", fieldType:2, w:"10%", textAlign:"center"},
				{text:eLang.getString("common", "STR_VIDEO_RCRD_FILENAME"),
					fieldName:"img_name", w:"30%", textAlign:"center"},
				{text:eLang.getString("common", "STR_VIDEO_RCRD_VIDEOTYPE"),
					fieldName:"img_name", w:"30%", textAlign:"center"},
				{text:eLang.getString("common", "STR_VIDEO_RCRD_FILEINFO"),
					fieldName:"img_info", w:"30%", textAlign:"center"}
				]};
	} else if(tabSOLVideo.style.fontWeight=="bold") {
		tblJSON = {cols:[
				{text : eLang.getString("common", "STR_HASH"),
					fieldName:"file_no", fieldType:2, w:"10%", textAlign:"center"},
				{text:eLang.getString("common", "STR_VIDEO_RCRD_FILENAME"),
					fieldName:"img_name", w:"30%", textAlign:"center"},
				{text:eLang.getString("common", "STR_VIDEO_RCRD_FILEINFO"),
					fieldName:"img_info", w:"30%", textAlign:"center"}
				]};
	}
	
	tblVideo.loadFromJson(tblJSON);

	/*
	 * This event handler will be invoked when the list grid row is selected.
	 */
	tblVideo.ontableselect = function () {
		var filename;		//Selected file name
		if (this.selected.length) {
			filename = tblVideo.getRow(tblVideo.selected[0]).cells[1].innerHTML;
			filename.replace("&nbsp;", "").replace(" ", "");
			if (filename == "~") {
				disableButtons(true);
			} else {
				if (!EXTENDED_PRIV) {
					disableButtons(false);
				} else {
					btnDelete.disabled = !top.user.isAdmin();
					btnPlay.disabled = !top.user.isKVM();
					btnDownload.disabled = !top.user.isKVM();
				}
			}
		}
	}

	/*
	 * This event handler will be invoked when double click in list grid row.
	 */
	tblVideo.ondblclick = function () {
		var filename;		//Selected file name
		filename = tblVideo.getRow(tblVideo.selected[0]).cells[1].innerHTML;
		filename.replace("&nbsp;", "").replace(" ", "");
		if (filename != "~") {
			playVideo();
		}
	}
}

/*
 * It will invoke the RPC method to get the video information.
 * Once it get data from RPC, response function will be called automatically. 
 */
function getVideoInfo() {
	btnAdvSettings.disabled = false;
	xmit.get({url:"/rpc/getvideoinfo.asp", onrcv:getVideoInfoRes, status:""});
}

/*
 * This is the response function for getVideoinfo RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getVideoInfoRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_VIDEO_RCRD_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		VIDEO_INFO = WEBVAR_JSONVAR_GETVIDEOFILE.WEBVAR_STRUCTNAME_GETVIDEOFILE;
		loadVideoInfo();
		if (varVideoOper == top.CONSTANTS.DELETE) {
			alert (eLang.getString("common", "STR_VIDEO_RCRD_DEL_SUCCESS"));
			varVideoOper = 0;
		}
	}
}

/*
 * It will invoke the RPC method to get the video information.
 * Once it get data from RPC, response function will be called automatically. 
 */
function getSOLVideoInfo() {
	btnAdvSettings.disabled = false;
	xmit.get({url:"/rpc/getsolvideoinfo.asp", onrcv:getSOLVideoInfoRes, status:""});
}

/*
 * This is the response function for getVideoinfo RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSOLVideoInfoRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_VIDEO_RCRD_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		VIDEO_INFO = WEBVAR_JSONVAR_GETSOLVIDEOFILE.WEBVAR_STRUCTNAME_GETSOLVIDEOFILE;
		loadSOLVideoInfo();
		if (varVideoOper == top.CONSTANTS.DELETE) {
			alert (eLang.getString("common", "STR_VIDEO_RCRD_DEL_SUCCESS"));
			varVideoOper = 0;
		}
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function loadVideoInfo() {
	var filename_todisplay;		//File name to display in List grid
	var fileinfo_todisplay;		//File name to display in List grid
	var videotype_todisplay;	//Video type to display in List grid
	var index;					//loop counter
	var rowJSON = [];			//Object of array of rows to load list grid
	var video_count = 0;		//Number of available video files

	tblVideo.clear();
	for (index = 0; index < VIDEO_INFO.length; index++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		filename_todisplay = "~";
		fileinfo_todisplay = "~";
		videotype_todisplay = "~";

		if ((VIDEO_INFO[index].FILE_NAME != "") && 
			(VIDEO_INFO[index].FILE_INFO != "")) {
			filename_todisplay = VIDEO_INFO[index].FILE_NAME;
			if (filename_todisplay.indexOf("video_dump") != -1) {
				videotype_todisplay = eLang.getString("common", "STR_VIDEO_RCRD_POST_EVENT");
			} else {
				videotype_todisplay = eLang.getString("common", "STR_VIDEO_RCRD_PRE_EVENT");
			}
			fileinfo_todisplay = VIDEO_INFO[index].FILE_INFO;
			video_count++;
		}

		try {
			rowJSON.push({cells:[
				{text:(index + 1), value:(index + 1)},
				{text:filename_todisplay, value:filename_todisplay},
				{text:videotype_todisplay, value:videotype_todisplay},
				{text:fileinfo_todisplay, value:fileinfo_todisplay}
			]});
		} catch (e) {
			alert(e);
		}
	}
	tblJSON.rows = rowJSON;
	tblVideo.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_VIDEO_RCRD_FILE_CNT") + "</strong>" + 
		video_count + eLang.getString("common", "STR_BLANK");
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function loadSOLVideoInfo() {
	var filename_todisplay;		//File name to display in List grid
	var fileinfo_todisplay;		//File name to display in List grid
	var videotype_todisplay;	//Video type to display in List grid
	var index;					//loop counter
	var rowJSON = [];			//Object of array of rows to load list grid
	var video_count = 0;		//Number of available video files

	tblVideo.clear();
	for (index = 0; index < VIDEO_INFO.length; index++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		filename_todisplay = "~";
		fileinfo_todisplay = "~";
		videotype_todisplay = "~";

		if ((VIDEO_INFO[index].FILE_NAME != "") && 
			(VIDEO_INFO[index].FILE_INFO != "")) {
			filename_todisplay = VIDEO_INFO[index].FILE_NAME;
			
			/*if (filename_todisplay.indexOf("video_dump") != -1) {
				videotype_todisplay = eLang.getString("common", "STR_VIDEO_RCRD_POST_EVENT");
			} else {
				videotype_todisplay = eLang.getString("common", "STR_VIDEO_RCRD_PRE_EVENT");
			}*/
			fileinfo_todisplay = VIDEO_INFO[index].FILE_INFO;
			video_count++;
		}

		try {
			rowJSON.push({cells:[
				{text:(index + 1), value:(index + 1)},
				{text:filename_todisplay, value:filename_todisplay},
				{text:fileinfo_todisplay, value:fileinfo_todisplay}
			]});
		} catch (e) {
			alert(e);
		}
	}
	tblJSON.rows = rowJSON;
	tblVideo.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_VIDEO_RCRD_FILE_CNT") + "</strong>" + 
		video_count + eLang.getString("common", "STR_BLANK");
}

/*
 * This will open a new window for launch that will download and open the passing 
 * JNLP file.
 */
function playVideo() {
	var filename;		//Selected file name
	filename = tblVideo.getRow(tblVideo.selected[0]).cells[1].innerHTML;
	filename.replace("&nbsp;", "").replace(" ", "");
	if (filename != "~") {
		xmit.get({url:"/rpc/WEBSES/validate.asp", onrcv:function(arg) {
			if(arg.HAPI_STATUS == 0) {
				if (top.user.isAdmin()) {
					window.open(top.gPageDir + "jviewer_launch.html?" + 
						"JNLPSTR=PlayVideo&JNLPNAME=" + top.gVideoJnlp + 
						"&FILENAME=" + filename, "PlayVideo", "toolbar=0," +
						" resizable=yes, width=400, height=110, left=350, top=300");
				} else {
					alert(eLang.getString("common","STR_CONF_ADMIN_PRIV"));
				}
			} else {
				parent.gLogout = 1;
				top.document.cookie = "SessionExpired=true;path=/";
				parent.location.href = "login.html";
			}
		},evalit:false});
	} else {
		alert(eLang.getString("common", "STR_VIDEO_RCRD_FILESEL_ERR"));
	}
}

/*
 * This will open a new window for launch that will download and open the passing 
 * JNLP file.
 */
function downloadVideo() {

	var filename;		//Selected file name
	filename = tblVideo.getRow(tblVideo.selected[0]).cells[1].innerHTML;
	filename.replace("&nbsp;", "").replace(" ", "");

    if(window.currentTab == "SOL" && filename != "~") {
        location.href = '/archive/'+filename;    
        return;
    }


	if (filename != "~") {
		xmit.get({url:"/rpc/WEBSES/validate.asp", onrcv:function(arg) {
			if(arg.HAPI_STATUS == 0) {
				if (top.user.isAdmin()) {
					window.open(top.gPageDir + "jviewer_launch.html?" + 
						"JNLPSTR=SaveVideo&JNLPNAME=" + top.gVideoJnlp +
						"&FILENAME=" + filename, "DownloadVideo", "toolbar=0," +
						" resizable=yes, width=400, height=110, left=350, top=300");
				} else {
					alert(eLang.getString("common","STR_CONF_ADMIN_PRIV"));
				}
			} else {
				parent.gLogout = 1;
				top.document.cookie = "SessionExpired=true;path=/";
				parent.location.href = "login.html";
			}
		},evalit:false});
	} else {
		alert(eLang.getString("common", "STR_VIDEO_RCRD_FILESEL_ERR"));
	}
}

/*
 * It will invoke the RPC method to delete the video file. Once we get response
 * from RPC request, response function will be called automatically.
 * Filename is passed as argument for RPC request.
 */
function deleteVideo() {
	var filename;		//Selected file name
	var req;			//xmit object to send RPC request with parameters

	filename = tblVideo.getRow(tblVideo.selected[0]).cells[1].innerHTML;
	filename.replace("&nbsp;", "").replace(" ", "");
	if (filename != "~") {
		if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {			
			if(tabAutoVideo.style.fontWeight=="bold") {
				req = new xmit.getset({url:"/rpc/deletevideo.asp", 
					onrcv:deleteVideoRes, status:""});
			} else if(tabSOLVideo.style.fontWeight=="bold") {
				req = new xmit.getset({url:"/rpc/deletesolvideo.asp", 
					onrcv:deleteSOLVideoRes, status:""});
			}
			req.add("FILE_NAME", filename);
			req.send();
			delete req;
		}
	} else {
		alert(eLang.getString("common", "STR_VIDEO_RCRD_FILESEL_ERR"));
	}
}

/*
 * This is the response function for deleteVideo RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then delete video is success, intimate proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function deleteVideoRes(arg) {
	var errstr;		//Error string
	switch(arg.HAPI_STATUS) {
		case 0:
			varVideoOper = top.CONSTANTS.DELETE;
			getVideoInfo();
			break;
		case -1:
		case -3:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_1"));
			break;
		case -2:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_2"));
			break;
		case -4:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_3"));
			break;
		default:
		errstr = eLang.getString("common", "STR_VIDEO_RCRD_DELVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

/*
 * This is the response function for deleteVideo RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then delete video is success, intimate proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function deleteSOLVideoRes(arg) {
	var errstr;		//Error string
	switch(arg.HAPI_STATUS) {
		case 0:
			varVideoOper = top.CONSTANTS.DELETE;
			getSOLVideoInfo();
			break;
		case -1:
		case -3:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_1"));
			break;
		case -2:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_2"));
			break;
		case -4:
			alert(eLang.getString("common", "STR_VIDEO_CFG_ERR_3"));
			break;
		default:
		errstr = eLang.getString("common", "STR_VIDEO_RCRD_DELVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

/*
 * This function will disable the buttons.
 * @param opt boolean, true-disable, false-enable.
 */
function disableButtons(opt) {
	btnPlay.disabled = opt;
	btnDownload.disabled = opt;
	btnDelete.disabled = opt;
}

/*
 * This will design the UI controls for Remote Video configuration form.
 */
function frmRemoteVideoCfg() {
	var frm = new form("advRemoteVideoFrm", "POST", "javascript://", "general");
	
	settings = frm.addCheckBox(eLang.getString("common",
		"STR_VIDEO_CFG_ENABLE"), "_chkRemoteVideo",
		{"_chkRemoteVideo":"Enable"}, false, [""]);
	chkRemoteVideo = settings._chkRemoteVideo;
	
	txtMaxDuration = frm.addTextField(eLang.getString("common",
		"STR_MAX_DURATION"), "_txtMaxDuration", REMOTEVIDEO_CFG.MAX_TIME_DURATION,
		{"maxLength":4}, "bigclassicTxtBox");
	
	txtMaxSize = frm.addTextField(eLang.getString("common",
		"STR_MAX_SIZE"), "_txtMaxSize", REMOTEVIDEO_CFG.MAXIMUM_SIZE,
		{"maxLength":3}, "bigclassicTxtBox");
	
	txtMaxDumps = frm.addTextField(eLang.getString("common",
		"STR_MAX_DUMPS"), "_txtMaxDumps", REMOTEVIDEO_CFG.MAX_DUMPS,
		{"maxLength":3}, "bigclassicTxtBox");

	txtServerIP = frm.addTextField(eLang.getString("common",
		"STR_SERVER_ADDRESS"), "_txtServerIP", REMOTEVIDEO_CFG.IP_ADDR,
		{"maxLength":256}, "bigclassicTxtBox");

	txtSrcPath = frm.addTextField(eLang.getString("common",
		"STR_SOURCE_PATH"), "_txtSrcPath", REMOTEVIDEO_CFG.REMOTE_PATH,
		{"maxLength":256}, "bigclassicTxtBox");

	var valShrType = {0:"NFS", 1:"Samba(CIFS)"};
	lstShrType = frm.addSelectBox(eLang.getString("common",
		"STR_SHARE_TYPE"), "_lstShrType", valShrType,
		REMOTEVIDEO_CFG.SHR_TYPE, "", "", "classicTxtBox");

	txtUname = frm.addTextField(eLang.getString("common", "STR_USERNAME"),
		"_txtUname", REMOTEVIDEO_CFG.UNAME, {"maxLength":256}, "classicTxtBox");

	txtPword = frm.addPasswordField(eLang.getString("common",
		"STR_PASSWORD"), "_txtPword", "", {"maxLength":32}, "classicTxtBox");

	txtDomainName = frm.addTextField(eLang.getString("common",
		"STR_DOMAINNAME"), "_txtDomainName", REMOTEVIDEO_CFG.DOMAIN_NAME,
		{"maxLength":256}, "bigclassicTxtBox");

	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common",
	"STR_SAVE"), validateRemoteVideoCfg));
	
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_VIDEO_CFG_ADV_TITLE"),
		frm.display(), btnAry);
	wnd.onclose = function() {
		doAutoRecordedVideo();
	};

	chkRemoteVideo.checked = REMOTEVIDEO_CFG.REMOTE_SUPPORT ? true : false;
	chkRemoteVideo.onclick = doRemoteVideo;
	lstShrType.onchange = doShareType;
	doRemoteVideo();
	

	if(!top.user.isAdmin()) {
		disableActions({id:["_btnAdvSettings", "_btnCancel"]});
	}
}

/*
 * This will design the UI controls for Remote Video configuration form.
 */
function frmSOLRemoteVideoCfg() {
	var frm = new form("advSOLRemoteVideoFrm", "POST", "javascript://", "general");	
	
	var valSOLStorageType = {0:"BMC", 1:"Remote"};
	
	txtSOLLogSize = frm.addTextField(eLang.getString("common",
	"STR_SOL_LOG_SIZE"), "_txtSOLLogSize", REMOTEVIDEO_CFG.LOG_SIZE,
	{"maxLength":10}, "classicTxtBox");
	
	if( REMOTEVIDEO_CFG.LOG_SIZE != 0) {
		txtSOLLogSize.value= (REMOTEVIDEO_CFG.LOG_SIZE/1024); //converts to KB's
	}
	
	txtSOLNoOfLogs = frm.addTextField(eLang.getString("common",
	"STR_SOL_NO_OF_LOGS"), "_txtSOLNoOfLogs", REMOTEVIDEO_CFG.NO_OF_LOGS,
	{"maxLength":3}, "classicTxtBox");
	
	txtSOLNoOfLogs.value=(txtSOLNoOfLogs.value)=="0"?"":txtSOLNoOfLogs.value;
	txtSOLLogSize.value=(txtSOLLogSize.value)=="0"?"":txtSOLLogSize.value;
	
	/*lstSOLStorageType = frm.addSelectBox(eLang.getString("common",
	"STR_SOL_STORAGE_TYPE"), "_lstSOLStorageType", valSOLStorageType,
	REMOTEVIDEO_CFG.REMOTE_SUPPORT, "", "", "classicTxtBox");*/
	
	/*if(tabAutoVideo.style.fontWeight == "bold") {
		settings = frm.addCheckBox(eLang.getString("common",
		"STR_VIDEO_CFG_ENABLE"), "_chkRemoteVideo",
		{"_chkRemoteVideo":"Enable"}, false, [""]);
	chkRemoteVideo = settings._chkRemoteVideo;
	}*/
	
	settings = frm.addCheckBox(eLang.getString("common",
	"STR_VIDEO_CFG_ENABLE"), "_chkRemoteVideo",
	{"_chkRemoteVideo":"Enable"}, false, [""]);
	chkRemoteVideo = settings._chkRemoteVideo;

	txtServerIP = frm.addTextField(eLang.getString("common",
		"STR_SERVER_ADDRESS"), "_txtServerIP", REMOTEVIDEO_CFG.IP_ADDR,
		{"maxLength":256}, "bigclassicTxtBox");

	txtSrcPath = frm.addTextField(eLang.getString("common",
		"STR_SOURCE_PATH"), "_txtSrcPath", REMOTEVIDEO_CFG.REMOTE_PATH,
		{"maxLength":256}, "bigclassicTxtBox");

	var valShrType = {0:"NFS", 1:"Samba(CIFS)"};
	lstShrType = frm.addSelectBox(eLang.getString("common",
		"STR_SHARE_TYPE"), "_lstShrType", valShrType,
		REMOTEVIDEO_CFG.SHR_TYPE, "", "", "classicTxtBox");

	txtUname = frm.addTextField(eLang.getString("common", "STR_USERNAME"),
		"_txtUname", REMOTEVIDEO_CFG.UNAME, {"maxLength":256}, "classicTxtBox");

	txtPword = frm.addPasswordField(eLang.getString("common",
		"STR_PASSWORD"), "_txtPword", "", {"maxLength":32}, "classicTxtBox");

	txtDomainName = frm.addTextField(eLang.getString("common",
		"STR_DOMAINNAME"), "_txtDomainName", REMOTEVIDEO_CFG.DOMAIN_NAME,
		{"maxLength":256}, "bigclassicTxtBox");

	var btnAry = [];
	
	btnAry.push(createButton("btnSave", eLang.getString("common",
	"STR_SAVE"), validateRemoteVideoCfg));
	
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_VIDEO_CFG_SOL_ADV_TITLE"),
		frm.display(), btnAry);
	wnd.onclose = function() {
		doSOLRecordedVideo();
	};

	chkRemoteVideo.checked = REMOTEVIDEO_CFG.REMOTE_SUPPORT ? true : false;
	chkRemoteVideo.onclick = doRemoteVideo;
	lstShrType.onchange = doShareType;
	
	if(!SOL_UART_REMOTE) {
		var fr= document.getElementById("advSOLRemoteVideoFrm");
		var tab= fr.getElementsByTagName("TABLE");
		for(i=2;i<9;i++){
		    tab[0].getElementsByTagName("TR")[i].className="hiddenRow";
		}
	}
	
	doRemoteVideo();
	
	if(!top.user.isAdmin()) {
		disableActions({id:["_btnAdvSettings", "_btnCancel"]});
	}
}

/*
 * This will enable or disable the Remote video UI controls based on remote 
 * video enable support check box value.
 */
function doRemoteVideo() {
	var opt;
	opt = !chkRemoteVideo.checked;
	if(tabAutoVideo.style.fontWeight=="bold") {
		txtMaxDuration.disabled = opt;
		txtMaxSize.disabled = opt;
		txtMaxDumps.disabled = opt;
	}
	txtServerIP.disabled = opt;
	txtSrcPath.disabled = opt;
	lstShrType.disabled = opt;
	doShareType();
}

/*
 * This will enable or disable the user authentication controls based on 
 * share type. Samba(CIFS) requires user authentication details.
 */
function doShareType() {
	var opt;
	opt = ((top.CONSTANTS.SHRTYPE_NFS == lstShrType.value) ||
		(lstShrType.disabled));
	txtUname.disabled = opt;
	txtPword.disabled = opt;
	txtDomainName.disabled = opt;
}

/*function doSOLStorageType() {
	var opt;
	opt = lstSOLStorageType.value;
	if(opt==0) { //BMC hide the panel
		doBMCStorageType();
	} else if(opt==1) { //Remote Show the panel
		//chkRemoteVideo.disabled=false;
		//chkRemoteVideo.checked=true;
		//doRemoteVideo();
		txtServerIP.disabled = false;
		txtSrcPath.disabled = false;
		lstShrType.disabled = false;
	}
	doShareType();
}*/

function doBMCStorageType() {
	//chkRemoteVideo.checked=false;
	//chkRemoteVideo.disabled=true;
	
	/*var opt;
	opt = (lstSOLStorageType.value == "1")?true:false;
	
	txtServerIP.disabled = opt;
	txtSrcPath.disabled = opt;
	lstShrType.disabled = opt;*/
	//doShareType();
}

/*
 * It will validate the Remote video configuration data before saving it.
 */
function validateSOLRemoteVideoCfg() {
	/*var valStorageType=lstSOLStorageType.value;
	if(valStorageType=="0") {
		//do validation for BMC
		alert("validation for BMC");
	} else if(valStorageType=="1") {
		if ((!eVal.ip(txtServerIP.value)) && 
				(!eVal.ipv6(txtServerIP.value, true, false)) &&
				(!eVal.domainname(txtServerIP.value,true))) {
				alert(eLang.getString("common", "STR_INVALID_SERVERADDR") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtServerIP.focus();
				return;
			}

			if ((eVal.isblank(txtSrcPath.value)) || 
				(!eVal.filePath(txtSrcPath.value))) {
				alert(eLang.getString("common", "STR_INVALID_SRC_PATH") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtSrcPath.focus();
				return;
			}

			if (top.CONSTANTS.SHRTYPE_CIFS == lstShrType.value) {
				if (!eVal.username(txtUname.value, "", 1, 256)) {
					alert(eLang.getString("common", "STR_INVALID_USERNAME") +
						eLang.getString("common", "STR_HELP_INFO"));
					txtUname.focus();
					return;
				}

				if (!eVal.password(txtPword.value, 1, 32)) {
					alert(eLang.getString("common", "STR_INVALID_PASSWORD") +
						eLang.getString("common", "STR_HELP_INFO"));
					txtPword.focus();
					return;
				}

				if (!(eVal.isblank(txtDomainName.value)) && 
					eVal.trim(txtDomainName.value)) {
					 if (!eVal.domainname(txtDomainName.value, true)) {
						alert (eLang.getString("common", "STR_INVALID_DOMAIN") +
							eLang.getString("common", "STR_HELP_INFO"));
						txtDomainName.focus();
						return;
					}
				}
			}
	}
	setSOLRemoteVideoCfg();*/
}

/*
 * It will validate the Remote video configuration data before saving it.
 */
function validateRemoteVideoCfg() {
	
	if(SOL_UART_LOG && tabSOLVideo.style.fontWeight == "bold") {
		
		if ((eVal.isblank(txtSOLLogSize.value))) {
			alert(eLang.getString("common", "STR_INVALID_LOG_SIZE") +
			eLang.getString("common", "STR_HELP_INFO"));
			txtSOLLogSize.focus();
			return;
		}
		
		if (!eVal.isnumstr(txtSOLNoOfLogs.value, 1, 10)) {
			alert(eLang.getString("common", "STR_INVALID_LOG_COUNT") +
			eLang.getString("common", "STR_HELP_INFO"));
			txtSOLNoOfLogs.focus();
			return;
		}
		
	}
	
	if (chkRemoteVideo.checked) {
		if(tabAutoVideo.style.fontWeight=="bold") {
			if (!eVal.isnumstr(txtMaxDuration.value, 1, 3600)){
				alert(eLang.getString("common", "STR_INVALID_MAXDURATION_ERROR") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtMaxDuration.focus();
				return;
			}
			
			if (!eVal.isnumstr(txtMaxSize.value, 1, 500)){
				alert(eLang.getString("common", "STR_INVALID_MAXSIZE_ERROR") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtMaxSize.focus();
				return;
			}
			
			if (!eVal.isnumstr(txtMaxDumps.value, 1, 100)){
				alert(eLang.getString("common", "STR_INVALID_MAXDUMPS_ERROR") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtMaxDumps.focus();
				return;
			}
		}
		
		if ((!eVal.ip(txtServerIP.value)) && 
			(!eVal.ipv6(txtServerIP.value, true, false)) &&
			(!eVal.domainname(txtServerIP.value,true))) {
			alert(eLang.getString("common", "STR_INVALID_SERVERADDR") +
				eLang.getString("common", "STR_HELP_INFO"));
			txtServerIP.focus();
			return;
		}

		if ((eVal.isblank(txtSrcPath.value)) || 
			(!eVal.filePath(txtSrcPath.value))) {
			alert(eLang.getString("common", "STR_INVALID_SRC_PATH") +
				eLang.getString("common", "STR_HELP_INFO"));
			txtSrcPath.focus();
			return;
		}

		if (top.CONSTANTS.SHRTYPE_CIFS == lstShrType.value) {
			if (!eVal.username(txtUname.value, "", 1, 256)) {
				alert(eLang.getString("common", "STR_INVALID_USERNAME") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtUname.focus();
				return;
			}

			if (!eVal.password(txtPword.value, 1, 32)) {
				alert(eLang.getString("common", "STR_INVALID_PASSWORD") +
					eLang.getString("common", "STR_HELP_INFO"));
				txtPword.focus();
				return;
			}

			if (!(eVal.isblank(txtDomainName.value)) && 
				eVal.trim(txtDomainName.value)) {
				 if (!eVal.domainname(txtDomainName.value, true)) {
					alert (eLang.getString("common", "STR_INVALID_DOMAIN") +
						eLang.getString("common", "STR_HELP_INFO"));
					txtDomainName.focus();
					return;
				}
			}
		}
	}
	if(tabAutoVideo.style.fontWeight == "bold") {
		setRemoteVideoCfg();
	} else if(tabSOLVideo.style.fontWeight == "bold"){
		setSOLRemoteVideoCfg();
	}
}

/*
 * It will invoke the RPC method to set the Remote video configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setSOLRemoteVideoCfg() {
	
	var req;	//xmit object to send RPC request with parameters

	var isValueChanged=false;
	
	if(SOL_UART_REMOTE) {
		if ((REMOTEVIDEO_CFG.REMOTE_SUPPORT == chkRemoteVideo.checked) &&
				(REMOTEVIDEO_CFG.IP_ADDR == txtServerIP.value) &&
				(REMOTEVIDEO_CFG.REMOTE_PATH == txtSrcPath.value) &&
				(REMOTEVIDEO_CFG.SHR_TYPE == lstShrType.value) &&
				(REMOTEVIDEO_CFG.UNAME == txtUname.value) &&
				(REMOTEVIDEO_CFG.PWORD == txtPword.value) &&
				(REMOTEVIDEO_CFG.DOMAIN_NAME == txtDomainName.value) &&
				(REMOTEVIDEO_CFG.LOG_SIZE == txtSOLLogSize.value) && 
				(REMOTEVIDEO_CFG.NO_OF_LOGS == txtSOLNoOfLogs.value)) {
				//isValueChanged=true;
				return false;
			}
	}
	
	/*if(isValueChanged==false) {
		if ((REMOTEVIDEO_CFG.LOG_SIZE == txtSOLLogSize.value) &&
				(REMOTEVIDEO_CFG.NO_OF_LOGS == txtSOLNoOfLogs.value)) {
				return false;
			}
	}*/
	
	
	if (confirm(eLang.getString("common", "STR_VIDEO_CFG_CONFIRM"))) {
		req = new xmit.getset({url:"/rpc/setsolvideoreccfg.asp", 
			onrcv:setSOLRemoteVideoCfgRes, status:""});
		var logSize=parseInt(txtSOLLogSize.value) * 1024;
		req.add("SOL_LOG_SIZE", logSize);
		req.add("SOL_NO_OF_LOGS", txtSOLNoOfLogs.value);
		
		if(SOL_UART_REMOTE) {
			req.add("REMOTE_SUPPORT", (chkRemoteVideo.checked) ? 1 : 0);
			req.add("IP_ADDR", txtServerIP.value);
			req.add("REMOTE_PATH", txtSrcPath.value);
			req.add("SHR_TYPE", lstShrType.value);
			if (lstShrType.value == top.CONSTANTS.SHRTYPE_CIFS) {
				req.add("UNAME", txtUname.value);
				req.add("PWORD", txtPword.value);
				req.add("DOMAIN_NAME", txtDomainName.value);
			}
		}
		req.send();
		delete req;
	}
	
	/*var req;	//xmit object to send RPC request with parameters
	var valStorageType=lstSOLStorageType.value;
	if(valStorageType==1) {
		if ((REMOTEVIDEO_CFG.IP_ADDR == txtServerIP.value) &&
			(REMOTEVIDEO_CFG.REMOTE_PATH == txtSrcPath.value) &&
			(REMOTEVIDEO_CFG.SHR_TYPE == lstShrType.value) &&
			(REMOTEVIDEO_CFG.UNAME == txtUname.value) &&
			(REMOTEVIDEO_CFG.PWORD == txtPword.value) &&
			(REMOTEVIDEO_CFG.DOMAIN_NAME == txtDomainName.value) &&
			(REMOTEVIDEO_CFG.STORAGE_TYPE == valStorageType) && 
			(REMOTEVIDEO_CFG.LOG_SIZE == txtSOLLogSize.value) &&
			(REMOTEVIDEO_CFG.NO_OF_LOGS == txtSOLNoOfLogs.value)) {
			return false;
		}
	} else if(valStorageType==0){
		if ((REMOTEVIDEO_CFG.STORAGE_TYPE == valStorageType) && 
				(REMOTEVIDEO_CFG.LOG_SIZE == txtSOLLogSize.value) &&
				(REMOTEVIDEO_CFG.NO_OF_LOGS == txtSOLNoOfLogs.value)) {
				return false;
		}
	}
	
	if(valStorageType==1) {
		if (confirm(eLang.getString("common", "STR_VIDEO_CFG_CONFIRM"))) {
			req = new xmit.getset({url:"/rpc/setsolvideoreccfg.asp", 
				onrcv:setSOLRemoteVideoCfgRes, status:""});
			//req.add("STORAGE_TYPE", lstSOLStorageType.value);
			req.add("SOL_LOG_SIZE", txtSOLLogSize.value);
			req.add("SOL_NO_OF_LOGS", txtSOLNoOfLogs.value);
			
			req.add("REMOTE_SUPPORT", lstSOLStorageType.value);
			req.add("IP_ADDR", txtServerIP.value);
			req.add("REMOTE_PATH", txtSrcPath.value);
			req.add("SHR_TYPE", lstShrType.value);
			if (lstShrType.value == top.CONSTANTS.SHRTYPE_CIFS) {
				req.add("UNAME", txtUname.value);
				req.add("PWORD", txtPword.value);
				req.add("DOMAIN_NAME", txtDomainName.value);
			}
			req.send();
			delete req;
		}
	} else {
		req = new xmit.getset({url:"/rpc/setsolvideoreccfg.asp", 
			onrcv:setSOLRemoteVideoCfgRes, status:""});
		//req.add("STORAGE_TYPE", lstSOLStorageType.value);
		req.add("SOL_LOG_SIZE", txtSOLLogSize.value);
		req.add("SOL_NO_OF_LOGS", txtSOLNoOfLogs.value);
		
		req.add("REMOTE_SUPPORT", lstSOLStorageType.value);
		req.add("IP_ADDR", txtServerIP.value);
		req.add("REMOTE_PATH", txtSrcPath.value);
		req.add("SHR_TYPE", lstShrType.value);
		if (lstShrType.value == top.CONSTANTS.SHRTYPE_CIFS) {
			req.add("UNAME", txtUname.value);
			req.add("PWORD", txtPword.value);
			req.add("DOMAIN_NAME", txtDomainName.value);
		}
		req.send();
		delete req;
	}*/
}

/*
 * This is the response function for setRemoteVideoCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set Remote video configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setSOLRemoteVideoCfgRes(arg) {
	if(arg.HAPI_STATUS != 0) {
		switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0xDF: case 0xE2: 
		case 0xE4: case 0x93:
			errstr = eLang.getString("common", "STR_INVALID_SERVERADDR");
			errstr += eLang.getString("common", "STR_HELP_INFO");
			alert(errstr);
			break;
		case 0x90: 
			alert(eLang.getString("common", "STR_INVALID_SERVICE"));
			break;
		case 0x92: 
			alert(eLang.getString("common", "STR_INVALID_SHARE_TYPE"));
			break;
		case 0x96: 
			alert(eLang.getString("common", "STR_INVALID_DOMAIN"));
			break;
		case 0x99: 
			alert(eLang.getString("common", "STR_INVALID_USERNAME"));
			break;
		case 0x9A: 
			alert(eLang.getString("common", "STR_INVALID_PASSWORD"));
			break;
		case 0xFC:
			alert(eLang.getString("common", "STR_VIDEO_CFG_MOUNT_ERROR"));
			break;
		default:
			errstr = eLang.getString("common", "STR_VIDEO_CFG_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
			break;
		}
	} else {
		alert (eLang.getString("common", "STR_SOL_VIDEO_CFG_SUCCESS"));
		closeForm();
	}
}

/*
 * It will invoke the RPC method to set the Remote video configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setRemoteVideoCfg() {
	var req;	//xmit object to send RPC request with parameters

	if ((REMOTEVIDEO_CFG.REMOTE_SUPPORT == chkRemoteVideo.checked) &&
		(REMOTEVIDEO_CFG.MAX_TIME_DURATION == txtMaxDuration.value) &&
		(REMOTEVIDEO_CFG.MAXIMUM_SIZE == txtMaxSize.value) &&
		(REMOTEVIDEO_CFG.MAX_DUMPS == txtMaxDumps.value) &&
		(REMOTEVIDEO_CFG.IP_ADDR == txtServerIP.value) &&
		(REMOTEVIDEO_CFG.REMOTE_PATH == txtSrcPath.value) &&
		(REMOTEVIDEO_CFG.SHR_TYPE == lstShrType.value) &&
		(REMOTEVIDEO_CFG.UNAME == txtUname.value) &&
		(REMOTEVIDEO_CFG.PWORD == txtPword.value) &&
		(REMOTEVIDEO_CFG.DOMAIN_NAME == txtDomainName.value)) {
		return false;
	}

	if (confirm(eLang.getString("common", "STR_VIDEO_CFG_CONFIRM"))) {
		req = new xmit.getset({url:"/rpc/setvideoreccfg.asp", 
			onrcv:setRemoteVideoCfgRes, status:""});
		req.add("MAX_TIME_DURATION", txtMaxDuration.value);
		req.add("MAXIMUM_SIZE", txtMaxSize.value);
		req.add("MAX_DUMPS", txtMaxDumps.value);
		req.add("SHR_TYPE", lstShrType.value);
		req.add("REMOTE_SUPPORT", (chkRemoteVideo.checked) ? 1 : 0);
		req.add("IP_ADDR", txtServerIP.value);
		req.add("REMOTE_PATH", txtSrcPath.value);
		req.add("SHR_TYPE", lstShrType.value);
		if (lstShrType.value == top.CONSTANTS.SHRTYPE_CIFS) {
			req.add("UNAME", txtUname.value);
			req.add("PWORD", txtPword.value);
			req.add("DOMAIN_NAME", txtDomainName.value);
		}
		req.send();
		delete req;
	}
}

/*
 * This is the response function for setRemoteVideoCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set Remote video configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setRemoteVideoCfgRes(arg) {
	if(arg.HAPI_STATUS != 0) {
		switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0xDF: case 0xE2: 
		case 0xE4: case 0x93:
			errstr = eLang.getString("common", "STR_INVALID_SERVERADDR");
			errstr += eLang.getString("common", "STR_HELP_INFO");
			alert(errstr);
			break;
		case 0x90: 
			alert(eLang.getString("common", "STR_INVALID_SERVICE"));
			break;
		case 0x92: 
			alert(eLang.getString("common", "STR_INVALID_SHARE_TYPE"));
			break;
		case 0x96: 
			alert(eLang.getString("common", "STR_INVALID_DOMAIN"));
			break;
		case 0x99: 
			alert(eLang.getString("common", "STR_INVALID_USERNAME"));
			break;
		case 0x9A: 
			alert(eLang.getString("common", "STR_INVALID_PASSWORD"));
			break;
		case 0xFC:
			alert(eLang.getString("common", "STR_VIDEO_CFG_MOUNT_ERROR"));
			break;
		default:
			errstr = eLang.getString("common", "STR_VIDEO_CFG_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
			break;
		}
	} else {
		alert (eLang.getString("common", "STR_VIDEO_CFG_SUCCESS"));
		closeForm();
	}
}

/*
 * Used to close the form which is used to configure the Remote video 
 * configuration settings. 
 */
function closeForm() {
	wnd.close();
}

/*
 * It will invoke the RPC method to get the Remote video configuration.
 * Once it get data from RPC, onrcv method will be called automatically. 
 */
function getRemoteVideoCfg() {
	xmit.get({url:"/rpc/getvideoreccfg.asp", onrcv:getRemoteVideoCfgRes,
		status:""});
}

/*
 * This is the response function for getRemoteVideoCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getRemoteVideoCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		btnAdvSettings.disabled = true;
		errstr = eLang.getString("common", "STR_VIDEO_CFG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		REMOTEVIDEO_CFG = WEBVAR_JSONVAR_GETVIDEORECCFG.WEBVAR_STRUCTNAME_GETVIDEORECCFG[0];
		lblRVideoDesc.innerHTML = eLang.getString("common", 
			"STR_VIDEO_CFG_DESC_" + REMOTEVIDEO_CFG.REMOTE_SUPPORT);

		divMountError.innerHTML = "";
		if (REMOTEVIDEO_CFG.MOUNT_STATUS == -1 && 
			REMOTEVIDEO_CFG.REMOTE_SUPPORT) {
			divMountError.innerHTML = eLang.getString("common", 
			"STR_VIDEO_CFG_MOUNT_ERROR");
		}
		else
		{
			if (REMOTEVIDEO_CFG.MOUNT_STATUS == 101 &&
					REMOTEVIDEO_CFG.REMOTE_SUPPORT) {
					divMountError.innerHTML = eLang.getString("common",
					"STR_VIDEO_CFG_MOUNT_STATUS_ERROR");
			}
		}
	}
}

/*
 * It will invoke the RPC method to get the Remote video configuration.
 * Once it get data from RPC, onrcv method will be called automatically. 
 */
function getSOLRemoteVideoCfg() {
	xmit.get({url:"/rpc/getsolvideoreccfg.asp", onrcv:getSOLRemoteVideoCfgRes,
		status:""});
}
/*
 * This is the response function for getRemoteVideoCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getSOLRemoteVideoCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		btnAdvSettings.disabled = true;
		errstr = eLang.getString("common", "STR_VIDEO_CFG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		REMOTEVIDEO_CFG = WEBVAR_JSONVAR_GETSOLCFG.WEBVAR_STRUCTNAME_GETSOLCFG[0];
		lblRVideoDesc.innerHTML = eLang.getString("common", 
			"STR_VIDEO_CFG_DESC_" + REMOTEVIDEO_CFG.REMOTE_SUPPORT);

		divMountError.innerHTML = "";
		if (REMOTEVIDEO_CFG.MOUNT_STATUS == -1 && 
			REMOTEVIDEO_CFG.REMOTE_SUPPORT) {
			divMountError.innerHTML = eLang.getString("common", 
			"STR_VIDEO_CFG_MOUNT_ERROR");
		}
		else
		{
			if (REMOTEVIDEO_CFG.MOUNT_STATUS == 101 &&
					REMOTEVIDEO_CFG.REMOTE_SUPPORT) {
					divMountError.innerHTML = eLang.getString("common",
					"STR_VIDEO_CFG_MOUNT_STATUS_ERROR");
			}
		}
	}
}
