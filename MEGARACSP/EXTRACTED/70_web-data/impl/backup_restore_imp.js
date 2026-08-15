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

// File Name  : backup_restore_imp.js
// Brief      : This implementation is used for backup and restoring all the
//				Configuration details.
// Author Name: Sakthivel. R

var tblJSON;		//object to hold Backup configuration in JSON structure
var tblBackupCfg;	//List grid object to hold Backup configuration
var BACKUPCFG_DATA;	//It holds the get RPC Backup configuration response data
var tmpBackupCfg = []; //Holds Backup configuration checkboxes data
var configStatus;	//It hold the status of Restore  details.
var CONST_BACKUP = 0x1;	//It used to hold the Backup process status
var CONST_RESTORE = 0x2; //It used to hold the Restore process status
var timeoutID = -1; //Used to hold the setTimeout method timer id
var CONFIG_STATUS;  //Used to hold the RPC data for backup/restore process status

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method.
 */
function doInit() {		//Page initialization code
	exposeElms(["_lblbackupRestoreDesc",
		"_btnRestoreConfig",
		"_backupHolder",
		"_btnBackup",
		"_btnSave",
		"_btnReset"]);

	if(top.user.isAdmin()) {
		btnSave.onclick = setBackupCfg;
		btnReset.onclick = loadBackupStatusCfg;
		btnRestoreConfig.onclick = doRestoreCfg;
		btnBackup.onclick = doBackupCfg;
	} else {
		disableActions();
	}
	_begin();
}

/*
 * It will invoke the RPC method to get the backup configuration data for 
 * the page.
 */
function _begin() {
	loadCustomPageElements();
	getBackupCfg();
}

/*
 * It will invoke the RPC method to get all backup configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getBackupCfg() {
	xmit.get({url:"/rpc/getbackupcfg.asp", onrcv:getBackupCfgRes, status:""});
}

/*
 * This is the response function for getBackupCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getBackupCfgRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_BACKUP_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		BACKUPCFG_DATA = WEBVAR_JSONVAR_GETBACKUPCFG.WEBVAR_STRUCTNAME_GETBACKUPCFG;
		loadBackupCfg();
		loadBackupStatusCfg();
		disableButtons(false);
	}
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid before sort and after sort event handler.
 */
function loadCustomPageElements() {
	backupHolder.innerHTML = "";
	var selectAll = "<input type='checkbox' id='_chkSelectAll'>" + 
		eLang.getString("common", "STR_BACKUP_STATUS");
	tblBackupCfg = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	backupHolder.appendChild(tblBackupCfg.table);
	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_HASH"), w:"10%", fieldType:2,
			textAlign:"center"},
		{text:eLang.getString("common", "STR_BACKUP_CFG_ITEM"), w:"50%",
			textAlign:"center"},
		{text:selectAll, w:"40%",
			textAlign:"center", sort:false}
		]};
	tblBackupCfg.loadFromJson(tblJSON);

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting 
	 * listbox was reloaded without data. So to keep the data back, this 
	 * function will store the check boxes live data into the temp variable 
	 * before sorting takes place for the list grid.
	 */
	tblBackupCfg.onbeforesort = function () {
		var i;		//loop counter
		for(i = 0; i < BACKUPCFG_DATA.length; i++) {
			try {
				tmpBackupCfg[i] = $("_chkBackupStatus" + i).checked;
			} catch(e) {
				continue;
			}
		}
	};

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting 
	 * listbox was reloaded without data. So to keep the data back, this 
	 * function will load back the stored the check boxes live data  from 
	 * the temp variable into the appropriate check boxes. 
	 */
	tblBackupCfg.onaftersort = function () {
		var i;		//loop counter
		for(i = 0; i < BACKUPCFG_DATA.length; i++) {
			try {
				$("_chkBackupStatus" + i).checked = tmpBackupCfg[i];
			} catch(e) {
				continue;
			}
		}
	};
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function loadBackupStatusCfg() {
	var i;		//loop counter
	var index;
	var checkAllStatus = 0;
	chkSelectAll.checked = false;
	for(i = 0; i < BACKUPCFG_DATA.length; i++) {
		try {
			$("_chkBackupStatus" + i).checked = (BACKUPCFG_DATA[i].STATUS) ? 
				true : false;
			checkAllStatus += $("_chkBackupStatus" + i).checked ? 1 : 0;
		} catch(e) {
			continue;
		}
	}
	
	if (checkAllStatus == BACKUPCFG_DATA.length) {
		chkSelectAll.checked = true;
	}
}

/*
 * It will check or uncheck all the check boxes in UI, as per the checkAll 
 * checkbox status.
 */
function doCheckAllCfg() {
	var bopt = chkSelectAll.checked; //This will hold the checkAll checkbox value
	for(i = 0; i < BACKUPCFG_DATA.length; i++) {
		try {
			$("_chkBackupStatus" + i).checked = bopt;
		} catch(e) {
			continue;
		}
	}
}

/*
 * This function is used to load the rpc response from the global variable to 
 * list grid.
 */
function loadBackupCfg() {
	var rowIndex = 1;	//Row Index
	var rowJSON = [];	//Object of array of rows to load list grid
	var backupStatus;	//DOM Element to hold backup configuration status
	tblBackupCfg.clear();	//This will clear all the records in the table

	for(i = 0; i < BACKUPCFG_DATA.length; i++) {
		backupStatus = "<input type='checkbox' id='_chkBackupStatus" + i + "'>";
		try {
			rowJSON.push({cells:[
				{text:rowIndex, value:rowIndex},
				{text:BACKUPCFG_DATA[i].NAME, value:BACKUPCFG_DATA[i].NAME},
				{text:backupStatus, value:backupStatus}
			]});
			rowIndex++;
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = rowJSON;
	tblBackupCfg.loadFromJson(tblJSON);
	chkSelectAll = $("_chkSelectAll");
	chkSelectAll.onclick = doCheckAllCfg;
}

/*
 * It will invoke the RPC method to set all backup configuration details.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setBackupCfg() {
	var req;	//xmit object to send RPC request with parameters
	var i;		//loop counter
	var data;	//Used to hold the each configuration items status
	var backupCount = 0;	//Hold the number of configuration needs to backup
	var backupSelect = 0;	//Hold the selector value for the configuration
	var backupCfg = "";		//This holds all the configuration item backup status

	for(i = 0; i < BACKUPCFG_DATA.length; i++) {
		try {
			data = ($("_chkBackupStatus" + i).checked) ? 1 : 0;
			backupSelect = backupSelect | (data <<  BACKUPCFG_DATA[i].SELECTOR);
		} catch(e) {
			continue;
		}
	}

	req = new xmit.getset({url:"/rpc/setbackupcfg.asp", 
		onrcv:setBackupCfgRes, status:""});
	req.add("BACKUP_SELECTOR", backupSelect);
	req.send();
	delete req;
}

/*
 * This is the response function for setBackupCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then setting network bonding configuration is success, intimate 
 * proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setBackupCfgRes(arg) {
	var resStr = "";	//Response string
	if (arg.HAPI_STATUS != 0) {
		resStr = eLang.getString("common", "STR_BACKUP_SETVAL");
		resStr += eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS);
		alert(resStr);
	} else {
		if (!configStatus) {
			resStr = eLang.getString("common", "STR_BACKUP_SAVE_SUCCESS");
			alert(resStr);
			getBackupCfg();
		} else {
			if (confirm(eLang.getString("common", "STR_BACKUP_CONFIRM"))) {
				setBackupRestoreCfg();
			} else {
				return;
			}
		}
	}
}

/*
 * It will design the form, which contains UI controls to upload configuration file.
 */
function doRestoreCfg() {
	var frm = new form("restoreConfigFileForm", "POST","javascript://","general");
	var divFileupload = document.createElement("div");
	divFileupload.innerHTML = "<form name='frmImageUpload' " +
		"id='_frmImageUpload' method='POST' enctype='multipart/form-data' " +
		"action='file_upload.html?SOURCE=ConfigFile' " +
		" target='hiddenFrame' style='margin-bottom:0'>" +
		"<input type='file' name='restoreconf' id='_fleImageBrowse' size='35'/>" +
		"</form>";
	rowImageBrowse = frm.addRow(eLang.getString("common", "STR_BACKUP_FILE"),
		divFileupload);

	var btnAry = [];
	btnAry.push(createButton("btnUpload", eLang.getString("common", 
		"STR_UPLOAD"), validateImage));
	btnAry.push(createButton("btnCancel", eLang.getString("common", 
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_RESTORE_CFG_TITLE"),
		frm.display(), btnAry, false);

	wnd.onclose = getBackupCfg;
	btnCancel = $("_btnCancel");
	btnUpload = $("_btnUpload");
	fleImageBrowse = $("_fleImageBrowse");
}

/*
 * It will get the backup configuration file name from the control and invoke 
 * fileupload method to upload the configuration file.
 */
function validateImage() {
	var filename; 	//Used to hold the backup configuration filename.
	filename = fleImageBrowse.value.split("\\");
	if (filename.length) {
		filename = filename[filename.length - 1];
	} else {
		filename = filename[0];
	}
	if (eVal.isblank(filename)) {
		alert (eLang.getString("common", "STR_RESTORE_INVALID_FILE"));
		return;
	}
	fileUpload();
}

/*
 * It will upload the file to web server. Once upload was completed, it will
 * call the uploadComplete method automatically. 
 */
function fileUpload() {
	configStatus = CONST_RESTORE;
	if (confirm(eLang.getString("common", "STR_RESTORE_CONFIRM"))) {
		showWait(true, "Uploading");
		parent.web_alerts.stop();
		document.forms["frmImageUpload"].submit();
		showUploadButtons(true);
	} else {
		return;
	}
}

/*
 * Once the upload completed, the control comes to this method.
 * This will invoke the set the restore configuration.
 */
function uploadComplete() {
	showWait(false);
	setBackupRestoreCfg();
	parent.web_alerts.monitor();
}

/*
 * It will invoke the RPC method to set the backup/restore configuration task value.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setBackupRestoreCfg() {
	var req;	//xmit object to send RPC request with parameters
	disableButtons(true);
	req = new xmit.getset({url:"/rpc/setbackuprestorecfg.asp", 
		onrcv:backuprestoreCfgRes, status:""});
	req.add("CONFIG_STATUS", configStatus);
	req.send();
	delete req;
}

/*
 * This is the response function for setBackupRestoreCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then call the backup/restore status, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function backuprestoreCfgRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_BACKUP_RESTORE_SETVAL");
		errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS);
		alert(errstr);
	} else {
		getConfigStatus();
	}
}

/*
 * It will invoke the RPC method to get backup/restore status
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getConfigStatus() {
	showWait(true, "Requesting");
	xmit.get({url:"/rpc/backuprestorestatus.asp", 
		show_progress:false, onrcv:getConfigStatusRes, status:""});
}

/*
 * This is the response function for getConfigStatus RPC. 
 * Need to check HAPI_STATUS.
 * If 0xFF, then invoke time out function to get status again in a few seconds.
 * If zero, then backup/restore is success, intimate proper message to end user.
 * @param arg object, RPC response data from xmit library
 */
function getConfigStatusRes(arg) {
	var errstr;		//Error string
	if (arg.HAPI_STATUS != 0) {
		showWait(false);
		errstr = eLang.getString("common", "STR_SETCONFIG_ERROR_" + configStatus);
		errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS);
			alert(errstr);
	} else {
		CONFIG_STATUS = WEBVAR_JSONVAR_BACKUPRESTORESTATUS.WEBVAR_STRUCTNAME_BACKUPRESTORESTATUS[0];
		switch(CONFIG_STATUS.STATUS) {
		case 0x0F:
			timeoutID = setTimeout(getConfigStatus, 2000);
			return;
			break;
		case 0x0:
			showWait(false);
			if (timeoutID != -1) {
				clearTimeout(timeoutID);
			}
			if (configStatus == CONST_BACKUP) {
				configStatus = 0;
				window.location.href="/config.bak";
			} else {
				closeForm();
				prepareDeviceShutdown();
				MessageBox((eLang.getString("common", "STR_RESTORE_CFG_TITLE")),
					p(eLang.getString("common", "STR_RESTORE_CFG_SUCCESS")), [], true);
			}
			configStatus = 0;
			break;
		default:
			showWait(false);
			errstr = eLang.getString("common", "STR_SETCONFIG_ERROR_" + configStatus);
				errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(CONFIG_STATUS.STATUS);
				alert(errstr);
			configStatus = 0;
		}
	}
	if (configStatus == CONST_RESTORE) {
		configStatus = 0;
		showUploadButtons(false);
	}
	disableButtons(false);
}

/*
 * It will do the backup configuration operations.
 */
function doBackupCfg() {
	configStatus = CONST_BACKUP;
	setBackupCfg();
}

/*
 * It will enable/disable the UI buttons.
 */
function disableButtons(opt) {
	btnRestoreConfig.disabled = opt;
	btnBackup.disabled = opt;
	btnSave.disabled = opt;
	btnReset.disabled = opt;
}

/*
 * It will enable/disable the Upload window buttons.
 */
function showUploadButtons(opt) {
	btnCancel.disabled = opt;
	btnUpload.disabled = opt;
	fleImageBrowse.disabled = opt;
}

/*
 *  This method is used to close the popup window. 
 * 
 */
function closeForm() {
	wnd.close();
}