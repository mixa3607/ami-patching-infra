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

var oper = 0;

var UPLOAD_IMAGE = 1;
var UPLOAD_SIGNKEY = 2;

var PRSRVCFG_DATA;
var FWIMGCFG_DATA;
var DUALIMGCFG_DATA;
var DWLDFWSTATUS;
var SECTIONFLASH_SUPPORT = false; // It holds the feature for Firmware section based update
var VERSION_CMP_FLASH = false;	//It holds feature for Firmware version compare flashing
var DUAL_IMAGE = false;			//It holds the dual image feature
var tblJSON;		//object to hold Preserve configuration in JSON structure
var tblPrsrvCfg;	//List grid object to hold Preserve configuration
var rowIndex = 1;

var FWIMG_SUPPORT = false;
var FW_HPM=false;

var CONST_PROTOTYPE_HTTP = 0; // Constant for HTTP Protocol
var CONST_PROTOTYPE_TFTP = 1; // Constant for TFTP Protocol
var CONST_PROTOTYPE_FTP = 2; // Constant for FTP Protocol
var CONST_FORCE_FLASH = 0x1;		//Constant to hold the Force full flash value
var CONST_SECTION_CMP_FLASH = 0x2;	//Constant to hold the Section compare flash value
var CONST_VERSION_CMP_FLASH = 0x4;	//Constant to hold the Version compare flash value

var VER_CMP_MODULE_VERSION_SAME = 0x20;	//Variable to hold the value of all module versions are same 
var VER_CMP_MODULE_SIZE_DIFF = 0x40;	//Variable to hold the value of module size is different 
var lgdSectionVerify; // Container used to hold the Section based firmware image data as listgrid table
var tblSectionJSON; // Object to hold Firmware image verification in JSON structure
var tblSectionCfg; // List grid object to hold Section based firmware image data
var FWVERIFYINFO_DATA; // It holds the RPC response data for firmware image verification
var tmpSecFlashCfg = []; // It holds the checkbox data for selected sections
var CONST_FULL_FLASH = 0x10; // Constant to hold the full firmware flash data
var CONST_FLASH_BOTH = 0x3; // Constant to hold the flash both image data
var flashImage2 = false; // Boolean to check the current flashing image in dual image


//Signature,Format Version,DeviceId,Manufacture Id,Product Id,Time,Definitaion,Components
//Self-Test time-out,Rollback time-out,inaccessability time-out,earlist compabile,Firmware revision,
//OEM data length,OEM data descriptor list,Header Checksum.
//HPM Flash changes
var HPM_HEADER= [];

var HPM_COMPONENT_DATA=[];

var headerStartOffBit=0;
var headerEndOffBit=34;
var sbit=0;
var oemlength=0;
var ebit=0;
var NoOfComponents=0;
var HPM_COMPONENT_DATA_NAME=[];
var HPM_COMPONENT_DATA_VERSION=[];
var HPM_COMPONENT_DATA_START_END=[];
var HPM_COMPONENT_DATA_ID=[];
var TOTAL_HPM_SIZE;
var HPM_FILE_OBJ;
var HPM_COMPONENT_COUNT=0;
var HPM_BIOS_COMP=4; // as per HPM spec
var HPM_BOOT_COMP=1;// as per HPM spec
var HPM_APP_COMP=2;// as per HPM spec
var HPM_UPLOAD_SIZE=10240;// Total length of conversion Hex format data and comes size as 20KB.
var HPM_COMPONENT_DATA_VERSION_ID=[];
var HPM_ORDER_COMPONENT=[];
var BIOS_FLASH=false;
var HPM_BMC_LENGTH=2; // developer check for validating HPM image
var HPM_MULTIPLE_FLASH=false;
var HPM_BIOS_UNIQUE_ID;
var HPM_BIOS_COMPONENT_LEN;
var HPM_SECTION_FLASH;

function doInit()
{
	exposeElms(["_wizard",
		"_clientRequests",
		"_prepareDevice",
		"_uploadImage",
		"_verifyImage",
		"_spnUploadStatus",
		"_flashImage",
		"_percentageFlashed",
		"_resetDevice",
		"_btnKeyUpload",
		"_btnFWUpdate",
		"_section",
		"_rowProtoCfg",
		"_tblFWCfg",
		"_lblProtoType",
		"_rowDualCfg",
		"_txtActiveImg",
		"_lstFlashImg",
		"_chkRebootBMC",
		"_divPrsrvAll",
		"_chkPrsrvAll",
		"_lblPrsrvAllDesc",
		"_divPrsrvCfg",
		"_lgdPrsrvCfg",
		"_btnPrsrvCfg",
		"_btnTray",
		"_rowHPM",
		"_rdoHPM",
		"_rdoAMI",
		"_chkBMCFirmwareUpdate",
		"_btnContinue",
		"_trHPMFWUpdateChk",
		"_lblFlashingType",
		"_parsingImage",
		"_uploadBOOTImage",
		"_uploadAPPImage",
		"_uploadBIOSImage",
		"_flashBIOSImage",
		"_flashBOOTImage",
		"_flashAPPImage",
		"_ulUploadHPM",
		"_ulFlashHPM",
		"_lblhpmPreserveDesc",
		"_spnBIOSUploadPercentage",
		"_spnBOOTUploadPercentage",
		"_spnAPPUploadPercentage",
		"_uploadBOOTAPPImage",
		"_spnBOOTAPPUploadPercentage",
		"_flashBOOTAPPImage",
		"_spnFlashBIOSPercentage",
		"_spnFlashBOOTAPPPercentage"
		]);
	clearSection();
	
	if(top.user.isAdmin()) {
		_begin();
	} else {
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}
}

function _begin()
{
	
	SECTIONFLASH_SUPPORT  = checkProjectCfg("SECTIONFLASH");
	VERSION_CMP_FLASH = checkProjectCfg("VERSION_CMP_FLASH");
	FWIMG_SUPPORT = checkProjectCfg("FW_IMAGE");
	DUAL_IMAGE = checkProjectCfg("DUAL_IMAGE");
	FW_HPM = checkProjectCfg("HPM_SUPPORT");
	
	if(FW_HPM) {
		rowHPM.className="visibleRow";
		divPrsrvAll.className = "hiddenRow";
		divPrsrvCfg.className = "hiddenRow";
		btnTray.className = "hiddenRow";
		rowProtoCfg.className = "visibleRow";
		getFWImageCfg();
		
		rdoHPM.onclick=doFirmwareOption;
		rdoAMI.onclick=doFirmwareOption;
		btnContinue.onclick=doContinue;
		lblFlashingType.innerHTML=eLang.getString("common", "STR_HPM_FW_TITLE");
		
	} else if (FWIMG_SUPPORT) {
		rowProtoCfg.className = "visibleRow";
		getFWImageCfg();
	} else {
		rowProtoCfg.className = "hiddenRow";
	}

	if (DUAL_IMAGE) {
		rowDualCfg.className = "visibleRow";
		btnFWUpdate.onclick = setDualImageCfg;
		getDualImageCfg();
	} else {
		rowDualCfg.className = "hiddenRow";
		btnFWUpdate.onclick = doEnterUpgrade;
	}

	fillFlashImage()
	doSignImageSupport();
	
	if(FW_HPM==false) {
		doPreserveCfg();
	}
}

function doFirmwareOption() {
	
}

function doContinue() {
	if(rdoHPM.checked) {
		if(confirm(eLang.getString("common", "STR_HPM_FW_CONFIRM0"))) {
			doHPMActions();
			if(DUAL_IMAGE){
				divPrsrvAll.className="visibleRow";
				btnPrsrvCfg.className = "visibleRow";
				lblhpmPreserveDesc.className="visibleRow";
				doPreserveCfg();
			} else {
				divPrsrvAll.className="hiddenRow";
				btnPrsrvCfg.className = "hiddenRow";
				lblhpmPreserveDesc.className="hiddenRow";
				
				loadCustomPageElements();
				getPreserveCfg();
			}
			//divPrsrvAll.className="hiddenRow";
			btnFWUpdate.value="Continue";
			//btnPrsrvCfg.className = "hiddenRow";
			//lblhpmPreserveDesc.className="hiddenRow";
		
			
			reloadHelp();
		}
	} else if(rdoAMI.checked) {
		doHPMActions();
		doPreserveCfg();
		divPrsrvAll.className="visibleRow";
		lblFlashingType.innerHTML=eLang.getString("common", "STR_FW_TITLE");
		reloadHelp();
	}
}

function doHPMActions() {
	
	rowHPM.className="hiddenRow";
	divPrsrvCfg.className = "visibleRow";
	btnTray.className = "visibleRow";
	btnTray.className = "btnTray";
}

function HPMCloseWindow(){
	alert (eLang.getString("common", "STR_HPM_FW_ERR01") + 
		eLang.getString("common", "STR_FW_UPDATE_RESET"));
	setFlashMode(false);
	rebootDevice(false, true, false);
}

function doEnterUpgrade()
{
	var errStr = "";
	
	//if((rdoAMI.checked==false && FW_HPM==false) || 
		//(rdoAMI.checked==true && FW_HPM==true)){
	if (DUAL_IMAGE && !chkPrsrvAll.checked && !chkRebootBMC.checked) {
		errStr = eLang.getString("common", "STR_FW_UPDATE_CONFIRM0");
	}
	errStr += eLang.getString("common", "STR_FW_UPDATE_CONFIRM1");
	if(!confirm(errStr)) {
		return;
	}	
	//}

	lstFlashImg.disabled = true;
	chkRebootBMC.disabled = true;
	btnFWUpdate.disabled = true;
	btnFWUpdate.onclick = function() {};
	btnKeyUpload.disabled = true;
	btnKeyUpload.onclick = function() {};

	divPrsrvAll.className = "hiddenRow";
	divPrsrvCfg.className = "hiddenRow";
	btnPrsrvCfg.disabled = true;
	btnPrsrvCfg.onclick = function() {};

	btnTray.className = "hiddenRow";
	wizard.className = "visibleRow";
	progressIcon = document.createElement("img");
	progressIcon.src = "../res/process.gif";

	setFlashMode(true);
	if(FW_HPM==true && rdoHPM.checked==true) {
		prepareHPMClient();
	} else {
		prepareClient();
	}
}

function prepareHPMClient()
{	
	//prepareDeviceShutdown();
	clientRequests.className="hiddenRow";
	parsingImage.className="visibleRow";
	verifyImage.className="hiddenRow";
	prepareDevice.className="visibleRow";
	resetDevice.className="visibleRow";
	
	with (parsingImage) {
		className = "normal";
		style.color = "#000";
	}
	loadHPMforRead();
}

function prepareHPMFlash(){
	
	xmit.get({url:"/rpc/hpmprepflash.asp", onrcv:onHPMReceive, timeout:180});
}

function onHPMReceive(arg)
{
	var HPM_ENTER_UPDATE_MODE=WEBVAR_JSONVAR_ENTERUPDATEMODE.WEBVAR_STRUCTNAME_ENTERUPDATEMODE[0];
	
	
	if (arg.HAPI_STATUS) {
		//Display the error code and proper message here...
		prepareDevice.firstChild.src = "../res/prg_failure.png";
		prepareDevice.removeChild(progressIcon);
		setFlashMode(false);
		if (!top.user.isAdmin()) {
			alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
			return;
		}
		switch (arg.HAPI_STATUS) {
		case 4:
			alert(eLang.getString("common", "STR_FW_FLASH_PROGRESS"));
		break;

		default:
			errstr =  eLang.getString("common", "STR_FW_PREPARE_FLASH");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		break;
		}
	} else {
		with (prepareDevice) {
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		prepareHPMComponent(HPM_ENTER_UPDATE_MODE.FWUPDATEID);
	}
}

function prepareHPMComponent(uId){
	if(HPM_COMPONENT_DATA_ID== null) return;
	
	var biosId=parseInt(HPM_COMPONENT_DATA_ID[0]);
	var len;
	for(i=0;i<HPM_COMPONENT_DATA_START_END.length;i++){
		var bid=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[0]);
		
		if(biosId==bid){
			var start=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
			var end= parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
			len= end - start;
		}
	}
	
	var req;
	req= new xmit.getset({url:"/rpc/hpmpreparecomponent.asp", onrcv:onHPMPrepareComponentRes, timeout:120});
	req.add("COMPONENT_ID", 2);
	req.add("COMPONENT_DATA_LEN", len);
	req.add("FWUPDATEID", uId);
	req.send();
	delete req;
}

function onHPMPrepareComponentRes(arg){
	var HPM_GETINITUPGACTIONRES=WEBVAR_JSONVAR_GETINITUPGACTIONRES.WEBVAR_STRUCTNAME_GETINITUPGACTIONRES[0];
	
	if (arg.HAPI_STATUS) {
		switch (arg.HAPI_STATUS) {
		default:
			errstr =  eLang.getString("common", "STR_FW_PREPARE_FLASH");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		break;
		}
	} else {
		
		doXMLHTTPRequest_HPM_BIOS(HPM_GETINITUPGACTIONRES.COMPONENT_ID,
				HPM_GETINITUPGACTIONRES.COMPONENT_DATA_LEN,
				HPM_GETINITUPGACTIONRES.FWUPDATEID);
		
		
	}
}
function doHPMStartFlash(cId,complen,uId){
	var req;
    var hpm_section_flash;
    for(i=0;i<HPM_SECTION_FLASH.length;i++){
        var compid=parseInt(HPM_SECTION_FLASH[i].split("-")[0]);
        if(compid == 4)
            hpm_section_flash = parseInt(HPM_SECTION_FLASH[i].split("-")[1]);
        else
            hpm_section_flash =0;
    }
	req= new xmit.getset({url:"/rpc/hpmstartflash.asp", onrcv:onHPMStartFlashRes, timeout:120});
	req.add("COMPONENT_ID", cId);
	req.add("COMPONENT_DATA_LEN", complen);
	req.add("FWUPDATEID", uId);
	req.add("SECTION_FLASH", hpm_section_flash);
	req.send();
	delete req;
}

function onHPMStartFlashRes(arg){
	
	var HPM_START_UPDATE=WEBVAR_JSONVAR_HPMSTARTUPDATE.WEBVAR_STRUCTNAME_HPMSTARTUPDATE[0];
	
	if (arg.HAPI_STATUS) {
		switch (arg.HAPI_STATUS) {
		default:
			errstr =  eLang.getString("common", "STR_FW_PREPARE_FLASH");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		break;
		}
	} else {
		HPM_BIOS_UNIQUE_ID=HPM_START_UPDATE.FWUPDATEID;
		HPM_BIOS_COMPONENT_LEN=HPM_START_UPDATE.COMPONENT_DATA_LEN;
		getHPMFlashStatus1(HPM_START_UPDATE.COMPONENT_ID);
	}
}

timerid = -1;
function getHPMFlashStatus1(cid)
{
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	
	var req;
	req= new xmit.getset({url:"/rpc/hpmflashstatus.asp", onrcv:getHPMFlashStatusRes1, timeout:120});
	req.add("COMPONENT_ID", cid);
	req.send();
	delete req;
	//xmit.get({url:"/rpc/hpmflashstatus.asp", onrcv:getHPMFlashStatusRes});
}

function getHPMFlashStatusRes1(arg)
{
	//var HPM_GETUPGRADESTATUSRES;
	var currentImage; // It will display the image which is presently flashing
	
	var HPM_GETUPGRADESTATUSRES = WEBVAR_JSONVAR_GETUPGRADESTATUSRES.WEBVAR_STRUCTNAME_GETUPGRADESTATUSRES[0];
	//console.log(arg.HAPI_STATUS);
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_FW_PROGRESS_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		//alert(errstr);
		closeForm();
		//timerid = setTimeout(getHPMFlashStatus, 2000);
	} else {
		//console.log(HPM_GETUPGRADESTATUSRES.COMPLETION_PERCENTAGE);
		
		if(HPM_COMPONENT_DATA_ID.length==1){
			flashImage.appendChild(progressIcon);
			flashImage.className = "hiLite";
			percentageFlashed.innerHTML = "(" + HPM_GETUPGRADESTATUSRES.COMPLETION_PERCENTAGE + "%)";
		} else {
			flashBIOSImage.appendChild(progressIcon);
			flashBIOSImage.className = "hiLite";
			spnFlashBIOSPercentage.innerHTML = "(" + HPM_GETUPGRADESTATUSRES.COMPLETION_PERCENTAGE + "%)";
		}
		
		if(parseInt(HPM_GETUPGRADESTATUSRES.COMPLETION_PERCENTAGE) == 100){
			//ActivateHPMComponents1(HPM_GETUPGRADESTATUSRES.COMPONENT_ID);
			verifyHPMStatus(HPM_GETUPGRADESTATUSRES.COMPONENT_ID);
		} else {
			timerid= setTimeout(function() {getHPMFlashStatus1(parseInt(HPM_GETUPGRADESTATUSRES.COMPONENT_ID));},2000);	
		}
	}
}

function verifyHPMStatus(cId){
	var req;
	req= new xmit.getset({url:"/rpc/hpmverifyflash.asp", onrcv:onHPMVerifyFlashRes, timeout:120});
	req.add("COMPONENT_ID", cId);
	req.add("COMPONENT_DATA_LEN", HPM_BIOS_COMPONENT_LEN);
	req.add("FWUPDATEID", HPM_BIOS_UNIQUE_ID);
	req.send();
	delete req;
}

function onHPMVerifyFlashRes(arg){
	
	var HPM_STARTVERIFY=WEBVAR_JSONVAR_HPMSTARTVERIFY.WEBVAR_STRUCTNAME_HPMSTARTVERIFY[0];
	
	if (arg.HAPI_STATUS) {
		switch (arg.HAPI_STATUS) {
		default:
			errstr =  eLang.getString("common", "STR_FW_PREPARE_FLASH");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		break;
		}
	} else {
		getHPMVerifyFlashStatus(HPM_STARTVERIFY.COMPONENT_ID);
	}
}

timerid=-1;
function getHPMVerifyFlashStatus(cid){
	
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	
	var req;
	req= new xmit.getset({url:"/rpc/hpmverifyflashstatus.asp", onrcv:getHPMVerifyFlashStatusRes, timeout:120});
	req.add("COMPONENT_ID", cid);
	req.send();
	delete req;
}

function getHPMVerifyFlashStatusRes(arg){
	
	var HPM_GETVERIFYSTATUSRES = WEBVAR_JSONVAR_GETVERIFYSTATUSRES.WEBVAR_STRUCTNAME_GETVERIFYSTATUSRES[0];
	//console.log(arg.HAPI_STATUS);
	if (timerid != -1) {
		clearTimeout(timerid);
	}
    if ((arg.HAPI_STATUS != 0) || (arg.COMPLETION_PERCENTAGE == -1)) {
		errstr = eLang.getString("common", "STR_FW_PROGRESS_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		//alert(errstr);
		closeForm();
		//timerid = setTimeout(getHPMFlashStatus, 2000);
	} else {
		//console.log(HPM_GETVERIFYSTATUSRES.COMPLETION_PERCENTAGE);
		
		/*if(HPM_COMPONENT_DATA_ID.length==1){
			flashImage.appendChild(progressIcon);
			flashImage.className = "hiLite";
			percentageFlashed.innerHTML = "(" + HPM_GETVERIFYSTATUSRES.COMPLETION_PERCENTAGE + "%)";
		} else {
			flashBIOSImage.appendChild(progressIcon);
			flashBIOSImage.className = "hiLite";
			spnFlashBIOSPercentage.innerHTML = "(" + HPM_GETVERIFYSTATUSRES.COMPLETION_PERCENTAGE + "%)";
		}*/
		
		if(parseInt(HPM_GETVERIFYSTATUSRES.COMPLETION_PERCENTAGE) == 100){
			ActivateHPMComponents1(HPM_GETVERIFYSTATUSRES.COMPONENT_ID);
			//verifyHPMStatus(HPM_GETUPGRADESTATUSRES.COMPONENT_ID);
		} else {
			timerid= setTimeout(function() {getHPMVerifyFlashStatus(parseInt(HPM_GETVERIFYSTATUSRES.COMPONENT_ID));},2000);	
		}
	}
}

function ActivateHPMComponents1(cId){
	var req;
	req=new xmit.getset({url:"/rpc/activatehpmcomponents.asp", onrcv:onHPMActivateComponenetsRes1, status:""});
	req.add("COMPONENT_ID",cId);
	req.send();
	delete req;
}

function onHPMActivateComponenetsRes1(arg){
	
	var HPM_GETUPGRADESTATUSRES = WEBVAR_JSONVAR_GETUPGRADESTATUSRES.WEBVAR_STRUCTNAME_GETUPGRADESTATUSRES[0];
	
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		default:
		errstr = eLang.getString("common", "STR_HPM_FW_ACTIVATE_ERROR");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
		GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		HPMCloseWindow();
		}
	} else {
		
		if(HPM_COMPONENT_DATA_ID.length==1){
			with (flashImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
		} else {
			with (flashBIOSImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
		}
		
		BIOS_FLASH=true;
		doExitComponent();
	}
}

function doExitComponent(){
	if(HPM_BIOS_UNIQUE_ID== null){
		alert("Not found");
		return;
	}
	var req;
	req=new xmit.getset({url:"/rpc/hpmexitmode.asp", onrcv:ondoExitComponentRes, status:""});
	req.add("FWUPDATEID",HPM_BIOS_UNIQUE_ID);
	req.send();
	delete req;
}

function ondoExitComponentRes(arg){
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		default:
		errstr = eLang.getString("common", "STR_HPM_FW_ACTIVATE_ERROR");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
		GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		HPMCloseWindow();
		}
	} else {
		if(HPM_MULTIPLE_FLASH==true){
			prepareFlash();
		} else {
			MessageBox(eLang.getString("common","STR_DEVICE_UPDATE_TITLE"), 
					p(eLang.getString("common","STR_DEVICE_UPDATE_DESC")), [], true);
			showWait(false);
		}
	}
}

function loadHPMforRead() {
	
	//var HPM_UPGRADE_STATUS;

	var p = document.createElement("p");
	p.innerHTML = "Please select the HPM firmware image to flash";
	p.innerHTML += "<br/>" +
		"<form enctype='multipart/form-data' name='fwHPMUpload' method='POST' " +
		"target='hiddenFrame'>" +
		"<input type='file' name='imageboot' id='brwsUpld' size='40'/>" +
		"</form>";

	var btnUpload = document.createElement("input");
	btnUpload.type = "button";
	btnUpload.value = "Ok";
	btnUpload.onclick = function()
	{
		var filepath = new String($("brwsUpld").value);
		var fileExtension;
		if(filepath != ""){
			fileExtension=filepath.match(/\.([^\.]+)$/)[1];	
		}
		if(filepath.length == 0 || fileExtension != "hpm")
		{
			alert(eLang.getString("common","STR_HPM_FW_UPDATE_VALID_IMAGE"));
			$("brwsUpld").focus();
			return;
		}
		doHPMFileRead(filepath);
	}
	
	var btnAry = [];
	btnAry.push(btnUpload);
	btnAry.push(createButton("_cancelUpload", (eLang.getString("common",
		"STR_CANCEL")), cancelHPMWizard));
	
	updateSection("HPM Firmware Image",p,btnAry);
}


function flashFileUploadStartRes1(arg){
	showWait(true,"Uploading");
	oper = UPLOAD_IMAGE;		//Used to indicate flash image is uploading.
	//document.forms["fwHPMUpload"].submit();
	doXMLHTTPRequest(1);
	
	/*var form = document.forms.namedItem("fwHPMUpload");
	
	form.addEventListener('submit', function(ev) {
		var files = $("brwsUpld").files;
		var file = files[0];
		
		
		
	
	  /*var oData = new FormData(document.forms.namedItem("fileinfo"));

	  oData.append("CustomField", "This is some extra data");

	  var oReq = new XMLHttpRequest();
	  oReq.open("POST", "file_upload.html?SOURCE=FirmwareImage", true);
	  oReq.onload = function(oEvent) {
	    if (oReq.status == 200) {
	      oOutput.innerHTML = "Uploaded!";
	    } else {
	      oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
	    }
	  };

	  oReq.send(oData);
	  ev.preventDefault();
	}, false);*/

	//document.forms["fwUpload"].submit();
	//clearSection();
}

function prepareClient()
{
	prepareDeviceShutdown();
	with (clientRequests) {
		className = "normal";
		style.color = "#000";
	}
	prepareFlash();
}

function prepareFlash()
{
	
	prepareDevice.appendChild(progressIcon);
	prepareDevice.className = "hiLite";
	xmit.get({url:"/rpc/prepflash.asp", onrcv:onReceive, timeout:120});
}

function onReceive(arg)
{
	if (arg.HAPI_STATUS) {
		//Display the error code and proper message here...
		prepareDevice.firstChild.src = "../res/prg_failure.png";
		prepareDevice.removeChild(progressIcon);
		setFlashMode(false);
		if (!top.user.isAdmin()) {
			alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
			return;
		}
		switch (arg.HAPI_STATUS) {
		case 4:
			alert(eLang.getString("common", "STR_FW_FLASH_PROGRESS"));
		break;

		default:
			errstr =  eLang.getString("common", "STR_FW_PREPARE_FLASH");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		break;
		}
	} else {
		with (prepareDevice) {
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		if(FW_HPM==true && rdoHPM.checked==true){
			xmit.get({url:"/rpc/getromfilesize.asp", status:"",
				onrcv:getHPMRomFileRes});
		} else
		if (FWIMG_SUPPORT) {
			if (CONST_PROTOTYPE_HTTP == FWIMGCFG_DATA.PROTO_TYPE) {
				xmit.get({url:"/rpc/getromfilesize.asp", status:"",
					onrcv:getRomFileRes});
			} else if ((CONST_PROTOTYPE_TFTP == FWIMGCFG_DATA.PROTO_TYPE) ||
				(CONST_PROTOTYPE_FTP == FWIMGCFG_DATA.PROTO_TYPE)) {
				downloadFWImage();
			}
		} else {
			xmit.get({url:"/rpc/getromfilesize.asp", status:"",
				onrcv:getRomFileRes});
		}
	}
}

function getHPMRomFileRes(arg){
	
	//uploadImage.className = "hiLite";
	//uploadImage.appendChild(progressIcon);
	//doHPMProcess();
	BIOS_FLASH=true;
	doXMLHTTPRequest(1)
}

function getRomFileRes(arg)
{	
	var ROMFILE_DATA;

	uploadImage.className = "hiLite";
	uploadImage.appendChild(progressIcon);

	if (arg.HAPI_STATUS == 0) {
		ROMFILE_DATA = WEBVAR_JSONVAR_GETROMFILESIZE.WEBVAR_STRUCTNAME_GETROMFILESIZE[0];
		filename = ROMFILE_DATA.V_FILE_LOCATION;
	}

	var p = document.createElement("p");
	p.innerHTML = "Please select the firmware image to flash";
	p.innerHTML += "<br/>" +
		"<form enctype='multipart/form-data' name='fwUpload' method='POST' " +
		"action='file_upload.html?SOURCE=FirmwareImage' target='hiddenFrame'>" +
		"<input type='file' name='image' id='brwsUpld' size='40'/>" +
		"</form>";

	var btnUpload = document.createElement("input");
	btnUpload.type = "button";
	btnUpload.value = "Upload";
	btnUpload.onclick = function()
	{
		var filepath = new String($("brwsUpld").value);
		if(filepath.length == 0)
		{
			alert(eLang.getString("common","STR_FW_UPDATE_ERR1"));
			$("brwsUpld").focus();
			return;
		}
		xmit.get({url:"/rpc/flashfile_upload_starts.asp", onrcv:flashFileUploadStartRes, status:""});
	}

	var btnAry = [];
	btnAry.push(btnUpload);
	btnAry.push(createButton("_cancelUpload", (eLang.getString("common",
		"STR_CANCEL")), cancelWizard));

	updateSection("Upload Firmware",p,btnAry);
}



function flashFileUploadStartRes()
{
	showWait(true,"Uploading");
	oper = UPLOAD_IMAGE;		//Used to indicate flash image is uploading.
	document.forms["fwUpload"].submit();
	clearSection();
}



function uploadComplete()
{
	showWait(false);

	if (oper == UPLOAD_IMAGE) {		//Flash image upload complete
		with(uploadImage) {
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		verifyFirmware();
	} else if (oper == UPLOAD_SIGNKEY){	//SignImage Key file upload complete
		validateSignImageKey();
	}
}

function verifyFirmware()
{
	if(BIOS_FLASH==true || HPM_COMPONENT_DATA_ID.length==2){
		verifyImage.className="hiddenRow";
	} else {
		if(verifyImage != null){
			verifyImage.appendChild(progressIcon);
			verifyImage.className = "hiLite";	
		}
	}
	var p = new xmit.getset({url:"/rpc/verifyimage.asp", onrcv:onReceiveVerify, timeout:120});
	p.send();
}

var ImageSizeChanged = 0; // It holds the image status

function onReceiveVerify (arg)
{
	if (arg.HAPI_STATUS == 0) {
		FWVERIFYINFO_DATA = WEBVAR_JSONVAR_VERIFYIMAGE.WEBVAR_STRUCTNAME_VERIFYIMAGE;
		if(FW_HPM==true && rdoHPM.checked==true){
			startFlashCfgHPM(0,"");
		} else {
			verifyFlashImage();
		}
	} else {
		verifyImage.firstChild.src = "../res/prg_failure.png";
		if(verifyImage.className=="hiLite"){
			verifyImage.removeChild(progressIcon);	
		}
		switch (arg.HAPI_STATUS) {
		case 48: case 40:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR4") +
				eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		case 43:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR5") +
				eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		case 49:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR6") +
				eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		case 51:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR7") +
				eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		case 52:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR8") +
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		case 53:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR9") +
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break; 
		case 55:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR10") +
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break; 
		default:
			alert(eLang.getString("common", "STR_FW_UPDATE_ERR2") +
				eLang.getString("common", "STR_FW_UPDATE_RESET"));
			break;
		}
		// Already the prepareDeviceShutddown was called in prepareClient,
		// So no need to call this again here.
		// prepareDeviceShutdown();
		setFlashMode(false);
		rebootDevice(false, true, false);
	}
}

function updateSection(title,content,btnAry)
{
	section.className = "wizardsection";
	section.style.display = "";
	var hldrTitle = document.createElement("h3");
	hldrTitle.className = "title";
	hldrTitle.innerHTML = title;
	var hldrBtn = document.createElement("div");
	hldrBtn.className = "btnTray";
	for(var i=0; i<btnAry.length; i++) {
		hldrBtn.appendChild(btnAry[i]);
	}
	section.appendChild(hldrTitle);
	section.appendChild(content);
	section.appendChild(hldrBtn);
}
/*
 * It will validate the flash image configuration data before saving it.
 */
function proceedFlash() {
	if (VERSION_CMP_FLASH && ($("_chkVersionFlash").checked) && 
		(FWVERIFYINFO_DATA[0].STATUS & VER_CMP_MODULE_VERSION_SAME)) {
		if (!confirm(eLang.getString("common", "STR_FW_UPDATE_CONFIRM6"))) {
			return;
		}
		verifyImage.removeChild(progressIcon);
		with(resetDevice) {
			resetDevice.style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		rebootDevice(true, true, false);
	} else {
		if (SECTIONFLASH_SUPPORT) {
			var i; // loop counter
			var section_count = 0; // It hold the total no of selected sections
			var section_name = []; // String array to hold the section names

			if ((!$("_chkFullFlash").checked && (VERSION_CMP_FLASH && 
				!$("_chkVersionFlash").checked)) || 
				(!$("_chkFullFlash").checked && !VERSION_CMP_FLASH)) {
				for (i = 0; i < FWVERIFYINFO_DATA.length; i++) {
					try {
						if ($("_chkSecStatus" + i).checked) {
							section_name[section_count++] =
								FWVERIFYINFO_DATA[i].SECTIONNAME;
						}
					} catch (e) {
						continue;
					}
				}
				if (section_count == 0) {
					alert(eLang.getString("common",
						"STR_FW_UPDATE_SECTION_ERROR"));
					return;
				}
				if (!confirm(eLang.getString("common",
					"STR_FW_UPDATE_SECTION_CONFIRM"))) {
					return;
				}
				startFlashCfg(section_count, section_name);
			} else {
			 	if (!confirm(eLang.getString("common", "STR_FW_UPDATE_CONFIRM4"))) {
					return;
				}
				startFlashCfg();
			}
		} else {
			if (VERSION_CMP_FLASH && ((!$("_chkFullFlash").checked) && 
				(!$("_chkVersionFlash").checked))) {
				alert(eLang.getString("common", "STR_FW_UPDATE_SECTION_ERROR"));
				return;
			}

			if (ImageSizeChanged) {
				if (!confirm(eLang.getString("common", "STR_FW_UPDATE_CONFIRM3") + 
					eLang.getString("common", "STR_FW_UPDATE_CONFIRM4"))) {
				return;
				}
			} else {
			 	if (!confirm(eLang.getString("common", "STR_FW_UPDATE_CONFIRM4"))) {
					return;
				}
			}	
			startFlashCfg();
		}
	}
	clearSection();
}


function doHPMFileRead(hpmfile) {
	showWait(false);
	readHPMComponentNames();
}

function readHPMComponentNames() {
	HPM_HEADER= new Array();
	HPM_COMPONENT_DATA_NAME= new Array();
	HPM_COMPONENT_DATA_VERSION= new Array();
	HPM_COMPONENT_DATA_START_END= new Array();
	HPM_COMPONENT_DATA_ID= new Array();
        HPM_SECTION_FLASH=new Array();
	readHPMHeaderBlob(headerStartOffBit,headerEndOffBit,1,0);
}

var MyBlobBuilder = function() {
	  this.parts = [];
	}

	MyBlobBuilder.prototype.append = function(part) {
	  this.parts.push(part);
	  this.blob = undefined; // Invalidate the blob
	};

	MyBlobBuilder.prototype.getBlob = function() {
	  if (!this.blob) {
	    this.blob = new Blob(this.parts);
	  }
	  return this.blob;
	};
	
function doXMLHTTPRequest(cid){
	
	var files =HPM_FILE_OBJ;// $("brwsUpld").files;
	var file = files[0];
	
	var start;
	var stop;
	var start1;
	var stop1;
	var i,j;
	if(HPM_COMPONENT_DATA_START_END.length ==2 || BIOS_FLASH==true){
		
		showWait(true,"Uploading");
		
		prepareDevice.removeChild(progressIcon);
		
		with (uploadImage) {
			className = "normal";
			style.color = "#000";
		}
		
		oper = UPLOAD_IMAGE;
		
		for(i=0;i<HPM_COMPONENT_DATA_START_END.length;i++){
			
			var compId=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[0]);
			
			if(HPM_BOOT_COMP==compId){
				start=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
				stop=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
				continue;
			}
			if(HPM_APP_COMP==compId){
				start1=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
				stop1=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
				continue;
			}
			
		}
		/*if(BIOS_FLASH){
			i=1;
			j=2;
		} else {
			i=0;
			j=1;
		}
		
		start=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
		stop=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
		
		start1=parseInt(HPM_COMPONENT_DATA_START_END[j].split("-")[1]);
		stop1=parseInt(HPM_COMPONENT_DATA_START_END[j].split("-")[2]);*/
		
		//var b = new Blob([blob1, blob], {type: 'application/octet-stream'});
		
		var blob = file.slice(start,stop);
		var blob1 = file.slice(start1, stop1);
		
		var myBlobBuilder = new MyBlobBuilder();
		myBlobBuilder.append(blob);
		myBlobBuilder.append(blob1);
		
		var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
		var string=myBlobBuilder.getBlob();
		if(typeof(FormData) == 'undefined'){
		    var boundary = '---------------------------' + (new Date).getTime(),//boundary is used to specify the encapsulation boundary of a parameter
		        data = "--" + boundary + "\r\n";
		        data += 'Content-Disposition: form-data; name="image"\r\n\r\n';//here we specify the name of the parameter name (data) sent to the server which can be retrieved by $_POST['data']
		        data += string + "\r\n";
		        data += "--" + boundary + "--\r\n";
		    xhr.open( 'post', 'file_upload.html?SOURCE=HPMBMCImage', true );
		    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		}else{
		    var data = new FormData();
		    data.append("image", string);
		    xhr.open( 'post', 'file_upload.html?SOURCE=HPMBMCImage', true );
		}
		xhr.send(data);
		xhr.onload = function(oEvent) {
		    if (xhr.status == 200) {
		    	showWait(false,"Uploading");
		    	
		    	if(BIOS_FLASH==true){
		    		with(uploadBOOTAPPImage) {
						className = "normal";
						style.color = "#000";
						firstChild.src = "../res/prg_success.png";
					}
		    		with(uploadImage) {
						className = "normal";
						style.color = "#000";
						firstChild.src = "../res/prg_success.png";
					}
		    		
		    	} else {
		    		with(uploadImage) {
						className = "normal";
						style.color = "#000";
						firstChild.src = "../res/prg_success.png";
					}
		    	}
		    	
				verifyFirmware();
		    } 
		};
		
		/*xhr.onprogress= function(oEvent){
			if(oEvent.lengthComputable){
				var percen= (oEvent.loaded / oEvent.total);
				spnUploadStatus.innerHTML="(" + percen + "%)";
			}
		};*/
	}
	else {
		
		for(i=0;i<HPM_COMPONENT_DATA_START_END.length;i++){
			
			var compId=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[0]);
			if(compId==4) {
				
			showWait(true,"Uploading");
			oper = UPLOAD_IMAGE;
			
			start=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
			stop=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
			
			var blob = file.slice(start, start);
			
			var myBlobBuilder = new MyBlobBuilder();
			myBlobBuilder.append(blob);
			//myBlobBuilder.append(blob1);
			
			var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
			var string=myBlobBuilder.getBlob();
			if(typeof(FormData) == 'undefined'){
			    var boundary = '---------------------------' + (new Date).getTime(),//boundary is used to specify the encapsulation boundary of a parameter
			        data = "--" + boundary + "\r\n";
			        data += 'Content-Disposition: form-data; name="hpmbios"\r\n\r\n';//here we specify the name of the parameter name (data) sent to the server which can be retrieved by $_POST['data']
			        data += string + "\r\n";
			        data += "--" + boundary + "--\r\n";
			    xhr.open( 'post', 'file_upload.html?SOURCE=BIOSImage', true );
			    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
			}else{
			    var data = new FormData();
			    data.append("hpmbios", string);
			    xhr.open( 'post', 'file_upload.html?SOURCE=BIOSImage', true );
			}
			xhr.send(data);
			xhr.onload = function(oEvent) {
			    if (xhr.status == 200) {
			    	showWait(false,"Uploading");
			    	startHPMFlashing(cid);
			    } 
			  };
			  
			}
		}	
	}
}

function doXMLHTTPRequest_HPM_BIOS(cid,len,uId){
	var start;
	var stop;
	
	var files =HPM_FILE_OBJ;// $("brwsUpld").files;
	var file = files[0];
	
	//var compId=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[0]);
	
	for(k=0;k<HPM_COMPONENT_DATA_START_END.length;k++){
		
		var copmId=parseInt(HPM_COMPONENT_DATA_START_END[k].split("-")[0]);
		if(copmId==HPM_BIOS_COMP){
			start=parseInt(HPM_COMPONENT_DATA_START_END[k].split("-")[1]);
			stop=parseInt(HPM_COMPONENT_DATA_START_END[k].split("-")[2]);
		}
	}
	
	//if(compId==4) {
		
	showWait(true,"Uploading");
	//oper = UPLOAD_IMAGE;
	
	
	
	var blob = file.slice(start, stop);
	
	var myBlobBuilder = new MyBlobBuilder();
	myBlobBuilder.append(blob);
	//myBlobBuilder.append(blob1);
	
	var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
	var string=myBlobBuilder.getBlob();
	if(typeof(FormData) == 'undefined'){
	    var boundary = '---------------------------' + (new Date).getTime(),//boundary is used to specify the encapsulation boundary of a parameter
	        data = "--" + boundary + "\r\n";
	        data += 'Content-Disposition: form-data; name="hpmbios"\r\n\r\n';//here we specify the name of the parameter name (data) sent to the server which can be retrieved by $_POST['data']
	        data += string + "\r\n";
	        data += "--" + boundary + "--\r\n";
	    xhr.open( 'post', 'file_upload.html?SOURCE=BIOSImage', true );
	    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
	}else{
	    var data = new FormData();
	    data.append("hpmbios", string);
	    xhr.open( 'post', 'file_upload.html?SOURCE=BIOSImage', true );
	}
	xhr.send(data);
	xhr.onload = function(oEvent) {
	    if (xhr.status == 200) {
	    	showWait(false,"Uploading");
	    	
	    	if(HPM_COMPONENT_DATA_ID.length==1){
	    		with(uploadImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
	    	} else {
	    		with(uploadBIOSImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
	    		with(flashBIOSImage) {
	    			className = "normal";
	    			style.color = "#000";
				}
	    	}
	    	
	    	doHPMStartFlash(cid,
	    			len,
	    			uId);
	    } 
	  };
	//}
}

function startHPMFlashing(compId){
	
}

function readHPMHeaderBlob(opt_startByte, opt_stopByte,type,i) {
	//try {
		var result;
		if (window.File && window.FileReader && window.FileList && window.Blob) {
	    } else {
	        alert('The File APIs are not fully supported in this browser.');
	    }
	    
		var files = $("brwsUpld").files;
		HPM_FILE_OBJ=$("brwsUpld").files;
		var file = files[0];
		
	    var start = parseInt(opt_startByte) || 0;
	    var stop = parseInt(opt_stopByte) || file.size - 1;
	    
	    TOTAL_HPM_SIZE=file.size - 16;
	    
	    var reader= new FileReader();
	    reader.onloadend = function (evt) {
	    	 if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	    		 
		    	//result=binaryToHex(ABC.toBinary(evt.target.result, 0)).result;
	    		result = base64ToHex(_arrayBufferToBase64(evt.target.result));
		    	
		    	HPM_HEADER.push(result);
		    	
		    	var totalSize=result.length;
		    	
		    	NoOfComponents=result.substring(40,42);// components
		    	
		    	var totalOEMLength=result.substring(64,68);//OEM Data Length
		    	
		    	sbit = 34 + parseInt(totalOEMLength,16) + 1;
		    	
		    	ebit=sbit+3;
		    	
		    	readHPMUpgradeAction(sbit,ebit,2,0);
	    	 }
	    };
	    var blob = file.slice(start, stop);
	    //reader.readAsBinaryString(blob);
	    reader.readAsArrayBuffer(blob);
	/*}
	catch(err) {
		alert(eLang.getString("common", "STR_HPM_FW_READING_ERROR"));
		return;
	}*/
}

function readHPMUpgradeAction(opt_startByte, opt_stopByte,type,i) {
	//try {
		
		var result;
		var files = HPM_FILE_OBJ;//$("brwsUpld").files;
		var file = files[0];
	    var start =parseInt(opt_startByte) || 0;
	    var stop = parseInt(opt_stopByte) || file.size - 1;
	    
	    if(!(TOTAL_HPM_SIZE > ebit)) {
	    	
	    	with (parsingImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
	    	
	    	with (prepareDevice) {
			className = "normal";
			style.color = "#000";
			}
	    	
	    	if(HPM_COMPONENT_DATA_ID.length > 2){ // ot three components.
	    		
	    		ulUploadHPM.className="visibleRow";
		    	ulFlashHPM.className="visibleRow";
		    	
		    	ulUploadHPM.className="wizard";
		    	ulFlashHPM.className="wizard";
		    	verifyImage.className="hiddenRow";
		    	
		    	//console.log(HPM_COMPONENT_DATA_ID);
	    		
	    		for(k=0;k<HPM_COMPONENT_DATA_ID.length;k++){
	    			if(parseInt(HPM_COMPONENT_DATA_ID[k])==HPM_BIOS_COMP){
	    				
	    				uploadBIOSImage.className="visibleRow";
	    				flashBIOSImage.className="visibleRow";
	    				
	    			} else if((parseInt(HPM_COMPONENT_DATA_ID[k])==HPM_BOOT_COMP) ||
	    					(parseInt(HPM_COMPONENT_DATA_ID[k])==HPM_APP_COMP)){
	    				 
	    				uploadBOOTAPPImage.className="visibleRow";
	    				flashBOOTAPPImage.className="visibleRow";
	    				
	    				//uploadBOOTImage.className="visibleRow";
	    				//flashBOOTImage.className="visibleRow";
	
	    			}/*else if(parseInt(HPM_COMPONENT_DATA_ID[k])==HPM_APP_COMP){
	    				
	    				uploadAPPImage.className="visibleRow";
	    				flashAPPImage.className="visibleRow";
	    			}*/
	    		}
	    	}
	    	
	    	clearSection();
	    	verifyHPMFlashImage();
	    }
	    
	    var reader= new FileReader(); 
	    reader.onloadend = function (evt) {
	    	if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	    		 
	    		//result=binaryToHex(ABC.toBinary(evt.target.result, 0)).result;
	    		result = base64ToHex(_arrayBufferToBase64(evt.target.result));
		    	
		    	HPM_HEADER.push(result);
		    	
		    	var Size=result.length;
		    	
		    	var startUpgrade=start * 2;
		    	
		    	var endUpgrade=startUpgrade + 2;
		    	
		    	var upgradeActionType=result.substring(0,2);// components
		    	
		    	startUpgrade=endUpgrade;
		    	endUpgrade=startUpgrade + 2;
		    	
		    	var componentId=parseInt(result.substring(2,4));
		    	
		    	if(upgradeActionType==0x00 || upgradeActionType==0x01) { //Backup components,Prepre compoents
		    		sbit=ebit;
		        	ebit=sbit+3;
		        	readHPMUpgradeAction(sbit,ebit,3,0);
		    	} else if(upgradeActionType==0x02) { //Upload image
		    		sbit=ebit;
                    		ebit=sbit + 31+16; //16 bytes added for OEM Header
		        	HPM_COMPONENT_DATA_ID.push(componentId);
		        	doComponentIdVersions(componentId);
		        	readHPMUpgradeComponentData(sbit,ebit,4,0,componentId);
		    	}
	    	 }
	    };
	    var blob = file.slice(start, stop);
	    //reader.readAsBinaryString(blob);
	    reader.readAsArrayBuffer(blob);
	/*}
    catch(err) {
		alert(eLang.getString("common", "STR_HPM_FW_READING_ERROR"));
		return;
	}*/
}

function doComponentIdVersions(cid){
	//var returnCId;
	switch(cid){
	case 1:
		HPM_COMPONENT_DATA_VERSION_ID.push(0);
		break;
	case 2: 
		HPM_COMPONENT_DATA_VERSION_ID.push(1);
		break;
	case 4:
		HPM_COMPONENT_DATA_VERSION_ID.push(2);
		break;
	}
	//return returnCId;
}

function readHPMUpgradeComponentData(opt_startByte, opt_stopByte,type,i,compId) {
	//try {
		
		var files =HPM_FILE_OBJ;// $("brwsUpld").files;
		var file = files[0];
	    var start = parseInt(opt_startByte) || 0;
	    var stop = parseInt(opt_stopByte) || file.size - 1;
	    
	    var reader= new FileReader();
	   
	    reader.onloadend = function (evt) {
	    	if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	    		
	    		//result=binaryToHex(ABC.toBinary(evt.target.result, 0)).result;
	    		result = base64ToHex(_arrayBufferToBase64(evt.target.result));
	    		
		    	startUpgrade=start * 2;
		    	endUpgrade=startUpgrade + (6*2);
		    	
		    	var component_version = "";
		    	var componentVersion=result.substring(0,12);
				
				component_version = component_version+parseInt(componentVersion.substring(0,2),16);
				component_version = component_version+"."+parseInt(componentVersion.substring(2,4),16);
		    	
				var aux_version = "";
				var auxVersion = componentVersion.substring(4,12);
				var j = 0;
				
				for(i=auxVersion.length-1;i>=0;i--){
		    		if(j%2==1){
		    			aux_version=aux_version + auxVersion[i] + auxVersion[i+1];
		    		}
		    		j++;
		    	}
				component_version = component_version+"."+parseInt(aux_version,16);
				
		    	HPM_COMPONENT_DATA_VERSION.push(component_version);
		    	
		    	startUpgrade=endUpgrade;
		    	endUpgrade=startUpgrade + (21*2);
		    	
		    	var componentName=hex2a(result.substring(12,54));//Component Desc/Name
		    	
		    	
		    	HPM_COMPONENT_DATA_NAME.push(componentName +"-"+compId);
		    	
		    	startUpgrade=endUpgrade;
		    	endUpgrade=startUpgrade + (4*2);
		    	
		    	var componentLength=result.substring(54,62);//Component length
		    	componentLength=componentLength.split("");
		    	
		    	var comLength='';
		    	var j=0;
		    	
		    	for(i=componentLength.length-1;i>=0;i--){
		    		if(j%2==1){
		    			comLength=comLength + componentLength[i] + componentLength[i+1];
		    		}
		    		j++;
		    	}
            var oemHeaderLength= result.substring(62,94);//OEM Header Length 16 bytes
            var oemsig= hex2a(result.substring(62,70));//OEM Signature; 4 bytes
            var oemsectionflashvalue=result.substring(70,78);//OEM Signature;  4 bytes
            oemsectionflashvalue=oemsectionflashvalue.split("");
                var sectionflashLength='';
                var j=0;
                for(i=oemsectionflashvalue.length-1;i>=0;i--){
                    if(j%2==1){
                        sectionflashLength=sectionflashLength + oemsectionflashvalue[i] + oemsectionflashvalue[i+1];
                    }
                    j++;
                }
            var sectionflash= parseInt(sectionflashLength,16);
            console.log(sectionflash);
		
            var comLen;
            if(oemsig=="OEM") {
		    	sbit=ebit;
                comLen= parseInt(comLength,16) - 16;
            } else {
                sbit=ebit -16;
                sectionflash =0;
                comLen= parseInt(comLength,16);
            }
                ebit=sbit + comLen;
		    	
		    	HPM_COMPONENT_DATA_START_END.push(compId+'-'+sbit+'-'+ebit);
            HPM_SECTION_FLASH.push(compId+'-'+sectionflash);
		    	sbit=ebit;
		    	ebit=sbit+3;
		    	readHPMUpgradeAction(sbit,ebit,3,0);
	    	}
	    };
	    
	    var blob = file.slice(start, stop);
	    //reader.readAsBinaryString(blob);
	    reader.readAsArrayBuffer(blob);
	/*}
    catch(err) {
		alert(eLang.getString("common", "STR_HPM_FW_READING_ERROR"));
		return;
	}*/
}


var ABC = {
        toAscii: function (bin) {
            return bin.replace(/\s*[01]{8}\s*/g, function (bin) {
                return String.fromCharCode(parseInt(bin, 2))
            })
        },
        toBinary: function (str, spaceSeparatedOctets) {
            return str.replace(/[\s\S]/g, function (str) {
                str = ABC.zeroPad(str.charCodeAt().toString(2));
                return !1 == spaceSeparatedOctets ? str : str + " "
            })
        },
        zeroPad: function (num) {
            return "00000000".slice(String(num).length) + num
        }
    };

// converts binary string to a hexadecimal string
function binaryToHex(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length - 1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i + 1 - 4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return { valid: true, result: ret };
}

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}
/*
 * It will validate the HPM flash image configuration data before saving it.
 */
function proceedHPMFlash() {
	
	//var	errStr = eLang.getString("common", "STR_FW_UPDATE_CONFIRM0"); 	
	
	
	if(HPM_COMPONENT_DATA_ID.length > 2 || HPM_COMPONENT_DATA_ID.length ==1) {
		var count=0;
		var ismultiple=0;
		for (i = 0; i < HPM_COMPONENT_DATA_ID.length; i++) {
			if($("_chkSecStatus" + i).checked==true){
				ismultiple=ismultiple +1;
			}
		}
		if(ismultiple==0){
			alert("Please select atlease one component to flash");
			return;
		}
		var errStr = eLang.getString("common", "STR_FW_UPDATE_CONFIRM1");
		
		if(!confirm(errStr)) {
			return;
		}
		prepareDeviceShutdown();
		if(ismultiple == 1) {
			prepareHPMFlash();
		} else if(ismultiple ==2) {
			prepareFlash();
		} else if(ismultiple > 2) {
			HPM_MULTIPLE_FLASH=true;
			prepareHPMFlash();
		}
		
	} else {
		if($("_chkFullFlash").checked==false){
			alert("Please select Update All");
			return;
		}
		var errStr = eLang.getString("common", "STR_FW_UPDATE_CONFIRM1");
		
		if(!confirm(errStr)) {
			return;
		}
		prepareDeviceShutdown();
		prepareFlash();	
	}
	clearSection();
}



function doHPMProcess(){
if(HPM_COMPONENT_DATA_ID== null) return;
	
	if(HPM_COMPONENT_DATA_ID.length > 0){
		
		if(HPM_COMPONENT_DATA_NAME.length==2){ //only BOOT and APP
			if($("_chkFullFlash").checked==false){
				alert("Please select Update All");
				return
			}
			doXMLHTTPRequest(1);
		} else if(HPM_COMPONENT_DATA_NAME.length > 2){
			var count=0;
			for (i = 0; i < HPM_COMPONENT_DATA_NAME.length; i++) {
				//var cid=HPM_COMPONENT_DATA_NAME[i].split("-")[1];
				if($("_chkSecStatus" + i).checked==false){
					count++;
				}
			}
			if(count==0){
				alert("Please select atlease one component to flash");
				return
			}
			
			for (i = 0; i < HPM_COMPONENT_DATA_NAME.length; i++) {
				//var cid=HPM_COMPONENT_DATA_NAME[i].split("-")[1];
				if($("_chkSecStatus" + i).checked==true){
						var cid=parseInt($("_chkSecStatus" + i).value);
						if(cid== HPM_BIOS_COMP){
							doXMLHTTPRequest(2);
							prepareHPMFlash();
							//startHPMFlashCfg(2);
						} else if(cid== HPM_APP_COMP){
						doXMLHTTPRequest(1);
					}
				}
			}
		}
	}
}

var initialCall = false;
function startHPMFlashCfg(compId) {
		initialCall = true;
		if(compId== HPM_BOOT_COMP || compId== HPM_APP_COMP) {
			with (uploadBOOTAPPImage) {
				className = "normal";
				style.color = "#000";
			}
			uploadBOOTAPPImage.className = "hiLite";
			uploadBOOTAPPImage.appendChild(progressIcon);
		}  else if(compId == 2) {
			with (uploadBIOSImage) {
				className = "normal";
				style.color = "#000";
			}
			uploadBIOSImage.className = "hiLite";
			uploadBIOSImage.appendChild(progressIcon);
		}
		
		if(compId== HPM_BOOT_COMP || compId== HPM_APP_COMP) {
			with (flashBOOTAPPImage) {
				className = "normal";
				style.color = "#000";
			}
		} else if(compId== 2) {
			with (flashBIOSImage) {
				className = "normal";
				style.color = "#000";
			}
		}
	
	var req;
	req=xmit.getset({url:"/rpc/sethpminitialupgrade.asp", onrcv:onHPMInitialUpgradation, status:"", timeout:180});
	req.add("COMPONENT_ID", compId);
	req.add("UPGR_ACTION", 0x02);
	req.send();
	delete req;	
	
	setFlashMode(false);
}

function onHPMInitialUpgradation(arg) {
	
	var HPM_INITIATE_STATUS = WEBVAR_JSONVAR_GETINITUPGACTIONRES.WEBVAR_STRUCTNAME_GETINITUPGACTIONRES[0];
	
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		/*case 0x80:
			setTimeout(function() {getHPMFWStatus(parseInt(HPM_INITIATE_STATUS.COMPONENT_ID));},10000);
			break;
		case 0x81:
			alert(eLang.getString("common", "STR_HPM_FW_INITIAL_ERR01"));
			HPMCloseWindow();
			break;*/
		default:
			errstr =  eLang.getString("common", "STR_HPM_FW_UPDATE_INIT_ERROR");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
			HPMCloseWindow();
		}
	} else {
		initialCall=false;
		/*with(verifyImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		flashImage.appendChild(progressIcon);
		flashImage.className = "hiLite";*/
		
		SendHPMUploadFWBlock(parseInt(HPM_INITIATE_STATUS.COMPONENT_ID));
	}
	
	/*if (arg.HAPI_STATUS == 0) {
		with(verifyImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		flashImage.appendChild(progressIcon);
		flashImage.className = "hiLite";
		getFlashStatus();
	} else {
		verifyImage.firstChild.src = "../res/prg_failure.png";
		verifyImage.removeChild(progressIcon);
		alert (eLang.getString("common", "STR_FW_UPDATE_ERR3") + 
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
		setFlashMode(false);
		rebootDevice(false, true, false);
	}*/
}

timerid=-1;
function getHPMFWStatus(compId) {
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	var req;
	req=xmit.getset({url:"/rpc/hpmflashstatus.asp", onrcv:getHPMFlashStatusRes, status:"", timeout:180});
	req.add("COMPONENT_ID", compId);
	//req.add("STATUS", compId);
	req.send();
	delete req;
}

function getHPMFlashStatusRes(arg)
{
	if(initialCall==true && (arg.status == 404 || arg.status == 503)){
		//alert("failed");
		setTimeout(function() {getHPMFWStatus(parseInt(HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]));},10000);
	}
	var HPM_FLASH_STATUS=WEBVAR_JSONVAR_GETUPGRADESTATUSRES.WEBVAR_STRUCTNAME_GETUPGRADESTATUSRES[0];
	
	var currentImage; // It will display the image which is presently flashing
	if (timerid != -1) {
		clearTimeout(timerid);
	}
    if((arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) || (arg.COMPLETION_PERCENTAGE == -1)) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x80:
			setTimeout(function() {getHPMFWStatus(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));},10000);
			break;
		default:
		errstr = eLang.getString("common", "STR_FW_PROGRESS_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
		GET_ERROR_CODE(arg.HAPI_STATUS));
		//alert(errstr);
		//HPMCloseWindow();
		}
	}
	else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x00 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x31){
		initialCall=false;
		SendHPMUploadFWBlock(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));
	} else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x80 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x31){
		setTimeout(function(){getHPMFWStatus(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));},10000);
	} else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x00 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x32){
		readHPMBlockComponentData(st,et,7,0,parseInt(HPM_FLASH_STATUS.COMPONENT_ID));
	}else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x80 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x32){
		getHPMFWStatus(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));
	}else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x00 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x33){ //Finish success and run for second component
		HPM_COMPONENT_COUNT++;
		if(HPM_COMPONENT_COUNT < HPM_COMPONENT_DATA_ID.length){
			
			var compId=parseInt(HPM_FLASH_STATUS.COMPONENT_ID);
			var cid;
			if(compId==0){
			    cid=HPM_BOOT_COMP;
			} else if(compId==1){
			 cid=HPM_APP_COMP;
			}else if(compId==2){
			 cid=HPM_BIOS_COMP;
			}
			
			if(cid== HPM_BOOT_COMP) {
				with (flashBOOTImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			} else if(cid== HPM_APP_COMP) {
				with (flashAPPImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}else if(cid== HPM_BIOS_COMP) {
				with (flashBIOSImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}
			
			//console.log("HPM_COMPONENT_COUNT"+ HPM_COMPONENT_COUNT);
			//console.log(" HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]" +HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]);
			
			startHPMFlashCfg(HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]);
		} else {
			ActivateHPMComponents();
		}
	}else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x80 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x33){
		getHPMFWStatus(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));
	}else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x00 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x35){ //Activate
		var compId=parseInt(HPM_FLASH_STATUS.COMPONENT_ID);
		var cid;
		if(compId==0){
		    cid=HPM_BOOT_COMP;
		} else if(compId==1){
		 cid=HPM_APP_COMP;
		}else if(compId==2){
		 cid=HPM_BIOS_COMP;
		}
		
		if(cid== HPM_BOOT_COMP) {
			with (flashBOOTImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
		} else if(cid== HPM_APP_COMP) {
			with (flashAPPImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
		}else if(cid== HPM_BIOS_COMP) {
			with (flashBIOSImage) {
				className = "normal";
				style.color = "#000";
				firstChild.src = "../res/prg_success.png";
			}
		}
		MessageBox(eLang.getString("common","STR_DEVICE_UPDATE_TITLE"), 
				p(eLang.getString("common","STR_DEVICE_UPDATE_DESC")), [], true);
		showWait(false);
	}else if(HPM_FLASH_STATUS.LAST_CMD_CC==0x80 && HPM_FLASH_STATUS.COMMAND_IN_PROGRESS==0x35){//Activate
		getHPMFWStatus(parseInt(HPM_FLASH_STATUS.COMPONENT_ID));
	}
}

var blk_no;
var st;
var et;
var endByte1;
var startByte1;
var componentSize;

function SendHPMUploadFWBlock(compId) {
	
	if(HPM_COMPONENT_DATA_START_END != null)
		
		if(HPM_COMPONENT_DATA_START_END.length > 0) {
			
			blk_no = 0;
			if(compId==1) { //BMC
				doXMLHTTPRequest(compId);
			} else if(compId==2) { //BIOS
				doXMLHTTPRequest(compId);
			}
			/*for(i=0;i < HPM_COMPONENT_DATA_START_END.length;i++) {
				
				var cId=parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[0]);
				
				if(parseInt(compId)==parseInt(cId)){
					
					startByte1= parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[1]);
					endByte1= parseInt(HPM_COMPONENT_DATA_START_END[i].split("-")[2]);
					componentSize = endByte1-startByte1;
					//alert("HPM_COMPONENT_DATA_START_END.length---"+HPM_COMPONENT_DATA_START_END.length);
					//alert(" inside HPM_COMPONENT_DATA_START_END.length---"+HPM_COMPONENT_DATA_START_END.length + "==SB==" + startByte1 + "==EB==" + endByte1);
					if(startByte1 < endByte1){
						st = startByte1;
						et = st + HPM_UPLOAD_SIZE;
						readHPMBlockComponentData(st,et,7,0,parseInt(compId));
						var uploadCompleted = (((et - startByte1)/componentSize)*100);
						//console.log("blkno---"+blk_no+"---endbyte--"+endByte1+"----startbyte----"+startByte1+"---st--"+st+"--et--"+et+"----uploadCompleted-----"+Math.round(uploadCompleted));
						st = et;
					}
				}
			}*/
		}
}

function readHPMBlockComponentData(opt_startByte, opt_stopByte,type,i,compId) {
	try{
	var files = HPM_FILE_OBJ;
	var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;
    
    var reader= new FileReader();
    
    var blockdataLength=stop-start;
   
    reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
    	//result= evt.target.result;
    	var totalImageDataOfComp=base64ToHex(_arrayBufferToBase64(evt.target.result));//binaryToHex(ABC.toBinary(evt.target.result, 0)).result;
    	var req;
    	req=xmit.getset({url:"/rpc/sethpmuploadfwblock.asp", onrcv:onHPMBlockUploadRes, status:""});
    	req.add("COMPONENT_ID", compId);
    	req.add("BLOCK_NUMBER",  blk_no);
    	req.add("BLOCK_LENGTH", blockdataLength);
    	req.add("FIRMWARE_DATA", totalImageDataOfComp);
    	req.send();
    	delete req;
    	}
    };
    var blob = file.slice(start, stop);
    //reader.readAsBinaryString(blob);
    reader.readAsArrayBuffer(blob);
    //reader.readAsText(blob,'IS0-8859-1');
	}
    catch(err){
    	alert(eLang.getString("common", "STR_HPM_FW_READING_ERROR"));
		return;
    }
}

function onHPMBlockUploadRes(arg)
{
	var HPM_BLOCK_UPLOAD_STATUS=WEBVAR_JSONVAR_SETUPLOADFIRMWAREBLKRES.WEBVAR_STRUCTNAME_SETUPLOADFIRMWAREBLKRES[0];
	
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x80:
			getHPMFWStatus(parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID));
			break;
		default:
		errstr = eLang.getString("common", "STR_HPM_FW_UPLOAD_ERROR");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
		GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		HPMCloseWindow();
		}
	} else {
		if(st<endByte1){
			st = st;
			et = st + HPM_UPLOAD_SIZE;
			if(et>endByte1){
				et = endByte1
			}
			blk_no++;
			readHPMBlockComponentData(st,et,7,0,parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID));
			var uploadCompleted =Math.round((((et - startByte1)/componentSize)*100));
			
			if(parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID)== HPM_BOOT_COMP){
				spnBOOTUploadPercentage.innerHTML = "(" + uploadCompleted + "% done)";
			} else if(parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID)== HPM_APP_COMP){
				spnAPPUploadPercentage.innerHTML = "(" + uploadCompleted + "% done)";
			} else if(parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID)== HPM_BIOS_COMP){
				spnBIOSUploadPercentage.innerHTML = "(" + uploadCompleted + "% done)";
			}
			//console.log("blkno---"+blk_no+"---endbyte--"+endByte1+"----startbyte----"+startByte1+"---st--"+st+"--et--"+et+"----uploadCompleted-----"+Math.round(uploadCompleted));
			st = et;
		} else {
			
			var cid=parseInt(HPM_BLOCK_UPLOAD_STATUS.COMPONENT_ID);
			
			if(cid== HPM_BOOT_COMP) {
				uploadBOOTImage.removeChild(progressIcon);
				with (uploadBOOTImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			} else if(cid== HPM_APP_COMP) {
				uploadAPPImage.removeChild(progressIcon);
				with (uploadAPPImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}else if(cid== HPM_BIOS_COMP) {
				uploadBIOSImage.removeChild(progressIcon);
				with (uploadBIOSImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}
			finishHPMUpload(cid);	
		}
	}
}

function finishHPMUpload(compId){
	
	var cid;
	if(compId==HPM_BOOT_COMP){
	    cid=0;
	} else if(compId==HPM_APP_COMP){
	 cid=1; 
	}else if(compId==HPM_BIOS_COMP){
	 cid=2;
	}
	
	var req;
	req=xmit.getset({url:"/rpc/finishhpmupload.asp", onrcv:onHPMFinishUploadRes, status:""});
	req.add("COMPONENT_ID", cid);
	req.add("COMPONENT_DATA_LEN", componentSize);
	req.send();
	delete req;
}

function onHPMFinishUploadRes(arg)
{
	var errstr;
	var HPM_FINISH_UPLOAD_STATUS=WEBVAR_JSONVAR_GETFINISHFWUPLOADRES.WEBVAR_STRUCTNAME_GETFINISHFWUPLOADRES[0];
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x80:
			getHPMFWStatus(parseInt(HPM_FINISH_UPLOAD_STATUS.COMPONENT_ID));
			break;
		case 0x81:
			alert(eLang.getString("common", "STR_HPM_FW_UPDATE_FINISH_ERROR"));
			HPMCloseWindow();
			break;
		default:
		errstr = eLang.getString("common", "STR_FW_PROGRESS_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
		GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		HPMCloseWindow();
		}
	} else {
		HPM_COMPONENT_COUNT++;
		if(HPM_COMPONENT_COUNT < HPM_COMPONENT_DATA_ID.length){
			if(compId== HPM_BOOT_COMP) {
				flashBOOTImage.removeChild(progressIcon);
				with (flashBOOTImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			} else if(compId== HPM_APP_COMP) {
				flashAPPImage.removeChild(progressIcon);
				with (flashAPPImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}else if(compId== HPM_BIOS_COMP) {
				flashBIOSImage.removeChild(progressIcon);
				with (flashBIOSImage) {
					className = "normal";
					style.color = "#000";
					firstChild.src = "../res/prg_success.png";
				}
			}
			//console.log("HPM_COMPONENT_COUNT"+ HPM_COMPONENT_COUNT);
			//console.log(" HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]" +HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]);
			startHPMFlashCfg(HPM_COMPONENT_DATA_ID[HPM_COMPONENT_COUNT]);
		} else {
			ActivateHPMComponents();
		}
	}
}



function verifyHPMFlashImage() {
	var strImgVerifyTitle = ""; // Title for Image Verification wizard
	var p = document.createElement("p");
	p.innerHTML = "";

	var divVerifyFlash = document.createElement("div");

	var chkVersionFlash = document.createElement("input");
	chkVersionFlash.type = "checkbox";
	chkVersionFlash.id = "_chkVersionFlash";

	var lblVersionFlash = document.createElement("label");
	lblVersionFlash.innerHTML = eLang.getString("common",
		"STR_FW_VERSION_FLASH");
	lblVersionFlash.htmlFor = "_chkVersionFlash";

	var chkFullFlash = document.createElement("input");
	chkFullFlash.type = "checkbox";
	chkFullFlash.id = "_chkFullFlash";

	var lblFullFlash = document.createElement("label");
	lblFullFlash.innerHTML =eLang.getString("common","STR_HPM_FW_UPDATE_ALL");
	lblFullFlash.htmlFor = "_chkFullFlash";

	
	strImgVerifyTitle = "List of Components";
	
	p.innerHTML = "The following section " +
		"is used to allow the user to configure the firmware image for flashing.";
	
	divVerifyFlash.id = "_wizardSectionFlash";
	

	divVerifyFlash.appendChild(chkFullFlash);
	divVerifyFlash.appendChild(lblFullFlash);
	p.appendChild(divVerifyFlash);

	lgdSectionVerify = document.createElement("div");
	lgdSectionVerify.className = "wizardSectionVerify";

	loadCustomPageElementsSectionsHPM();
	loadSectionCfgHPM();
	p.appendChild(lgdSectionVerify);
	 

	var btnAry = [];
	btnAry.push(createButton("_proceed", (eLang.getString("common",
		"STR_PROCEED")), proceedHPMFlash));
	btnAry.push(createButton("_cancelFlashing", (eLang.getString("common",
		"STR_CANCEL")), cancelHPMWizard));

	updateSection(strImgVerifyTitle, p, btnAry);
	reloadHelp();
	$("_chkFullFlash").onclick = doFirmwareHPMFlashCfg;
	sectionHPMStatusCfg(false);
}

function doFirmwareHPMFlashCfg() {
	var bopt = false; // boolean, hold the full firmware flash checkbox value
	bopt =  $("_chkFullFlash").checked;
	sectionHPMStatusCfg(bopt);
}

/*
 * It will invoke the RPC method to set the image verification configurations.
 * Once it get response from RPC, on receive method will be called automatically.
 * @param section_count - Total no.of selected sections count.
 * @param section_name - all selected section names.
 */
function startFlashCfg(section_count, section_name) {
	var flashStatus = CONST_FORCE_FLASH; //Integer to hold the Full image flash
	var req = new xmit.getset({url : "/rpc/startflash.asp",
		onrcv : startFlashRes}); // xmit object to sent RPC request with parameter
	req.add("PRESERVECFG", chkPrsrvAll.checked ? 1 : 0);
	if (VERSION_CMP_FLASH) {
		flashStatus = ($("_chkFullFlash").checked ? CONST_FORCE_FLASH : 
			$("_chkVersionFlash").checked ? CONST_VERSION_CMP_FLASH : CONST_SECTION_CMP_FLASH);
	} else if (SECTIONFLASH_SUPPORT) {
		flashStatus = ($("_chkFullFlash").checked ? CONST_FORCE_FLASH : CONST_SECTION_CMP_FLASH);
	}
	if (SECTIONFLASH_SUPPORT && (flashStatus == CONST_SECTION_CMP_FLASH)) {
		req.add("SECTIONCOUNT", section_count);
		req.add("SECTIONNAME", section_name);
	}
	req.add("FLASHSTATUS", flashStatus);
	req.send();
	delete req;
	setFlashMode(false);
}

/*
 * It will invoke the RPC method to set the image verification configurations.
 * Once it get response from RPC, on receive method will be called automatically.
 * @param section_count - Total no.of selected sections count.
 * @param section_name - all selected section names.
 */
function startFlashCfgHPM(section_count, section_name) {
	var flashStatus = CONST_FORCE_FLASH; //Integer to hold the Full image flash
	var req = new xmit.getset({url : "/rpc/startflash.asp",
		onrcv : startHPMFlashRes}); // xmit object to sent RPC request with parameter
	req.add("PRESERVECFG", 0);
	
	/*if (SECTIONFLASH_SUPPORT && (flashStatus == CONST_SECTION_CMP_FLASH)) {
		req.add("SECTIONCOUNT", section_count);
		req.add("SECTIONNAME", section_name);
	}*/
	req.add("FLASHSTATUS", flashStatus);
	req.send();
	delete req;
	setFlashMode(false);
}


/*
 * This is the response function for startFlashCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, then it will invoke the FlashStatus method and continue the flashing.
 * @param arg object, RPC response data from xmit library
 */
function startHPMFlashRes(arg)
{
	if (arg.HAPI_STATUS == 0) {
		
		flashBOOTAPPImage.appendChild(progressIcon);
		flashBOOTAPPImage.className = "hiLite";
		
		getFlashStatus();
	} else {
		//verifyImage.firstChild.src = "../res/prg_failure.png";
		//verifyImage.removeChild(progressIcon);
		alert (eLang.getString("common", "STR_FW_UPDATE_ERR3") + 
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
		setFlashMode(false);
		rebootDevice(false, true, false);
	}
}

/*
 * This is the response function for startFlashCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, then it will invoke the FlashStatus method and continue the flashing.
 * @param arg object, RPC response data from xmit library
 */
function startFlashRes(arg)
{
	if (arg.HAPI_STATUS == 0) {
		with(verifyImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		flashImage.appendChild(progressIcon);
		flashImage.className = "hiLite";
		getFlashStatus();
	} else {
		verifyImage.firstChild.src = "../res/prg_failure.png";
		verifyImage.removeChild(progressIcon);
		alert (eLang.getString("common", "STR_FW_UPDATE_ERR3") + 
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
		setFlashMode(false);
		rebootDevice(false, true, false);
	}
}

timerid = -1;
function getFlashStatus()
{
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	xmit.get({url:"/rpc/flashstatus.asp", onrcv:getFlashStatusRes});
}

function getFlashStatusRes(arg)
{
	var FLASH_STATUS;
	var currentImage; // It will display the image which is presently flashing
	if (timerid != -1) {
		clearTimeout(timerid);
	}

	if (arg.HAPI_STATUS == 0xFF) {
		fnResetDevice();
	} else if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_FW_PROGRESS_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		//alert(errstr);
		timerid = setTimeout(getFlashStatus, 2000);
	} else {
		FLASH_STATUS = WEBVAR_JSONVAR_FLASHPROGRESS.WEBVAR_STRUCTNAME_FLASHPROGRESS[0];
		if (lstFlashImg.value == CONST_FLASH_BOTH && DUAL_IMAGE) {
			currentImage = flashImage2 ? eLang.getString("common", "STR_CONF_DUAL_IMG2") :
				eLang.getString("common", "STR_CONF_DUAL_IMG1");
			if (FLASH_STATUS.FLASHPROGRESS.indexOf("100% done") != -1) {
				flashImage2 = true;
			}
			percentageFlashed.innerHTML = "(" + currentImage + " - " + 
				FLASH_STATUS.FLASHPROGRESS + ")";
		} else {
			if(BIOS_FLASH==true){
				spnFlashBOOTAPPPercentage.innerHTML = "(" + FLASH_STATUS.FLASHPROGRESS + ")";	
			} else {
				percentageFlashed.innerHTML = "(" + FLASH_STATUS.FLASHPROGRESS + ")";	
			}
		}
		timerid = setTimeout(getFlashStatus, 2000);
	}
}

function fnResetDevice()
{
	if(BIOS_FLASH==true){
		with(flashBOOTAPPImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		with(flashImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
	} else {
		with(flashImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
	}
	
	resetDevice.className = "hiLite";
	resetDevice.appendChild(progressIcon);
	setFlashMode(false);
	if (DUAL_IMAGE && chkPrsrvAll.checked && !chkRebootBMC.checked) {
		rebootDevice(false, false, false);
	} else {
		rebootDevice(true, true, false);
	}

	with(resetDevice)
	{
		//className = "normal"; nice without white
		style.color = "#000";
		firstChild.src = "../res/prg_success.png";
		removeChild(progressIcon);
	}
}

function cancelWizard()
{
	if(!confirm(eLang.getString("common","STR_FW_UPDATE_CONFIRM2"))) return;

	progressIcon.parentNode.removeChild(progressIcon);
	clearSection();
	setFlashMode(false);
	if (DUAL_IMAGE) {
		rebootDevice(false, false, true);
	} else {
		rebootDevice(false, true, true);
	}
}

function cancelHPMWizard()
{
	if(!confirm(eLang.getString("common","STR_HPM_FW_UPDATE_CONFIRM1"))) return;
	
	location.href="fw_update.html";
	
	//progressIcon.parentNode.removeChild(progressIcon);
	
	/*with (parsingImage) {
		className = "normal";
		style.color = "#000";
	}
	
	clearSection();
	
	if(document.getElementById("_wizardSectionFlash") != null ) {
	    document.getElementById("_wizardSectionFlash").innerHTML="";
	}
	
	setFlashMode(false);
	wizard.className="hiddenRow";
	rdoHPM.checked=false;
	btnFWUpdate.disabled=false;
	btnFWUpdate.onclick = doEnterUpgrade;
	
	rowHPM.className="visibleRow";
	divPrsrvAll.className = "hiddenRow";
	divPrsrvCfg.className = "hiddenRow";
	btnTray.className = "hiddenRow";
	rowProtoCfg.className = "visibleRow";
	getFWImageCfg();
	
	rdoHPM.onclick=doFirmwareOption;
	rdoAMI.onclick=doFirmwareOption;
	btnContinue.onclick=doContinue;
	lblFlashingType.innerHTML=eLang.getString("common", "STR_HPM_FW_TITLE");*/
	
}

function clearSection()
{
	section.className = "section";
	section.innerHTML = "";
	section.style.display = "none";
}

function doSignImageSupport()
{
	if(checkProjectCfg("ENC_IMAGE")) {
		btnKeyUpload.className = "visibleRow";
		btnKeyUpload.disabled = false;
		btnKeyUpload.onclick = getSignImageKey;
	} else {
		btnKeyUpload.className = "hiddenRow";
		btnKeyUpload.onclick = function() {};
	}
	btnFWUpdate.disabled = false;
}

function getSignImageKey()
{
	xmit.get({url:"/rpc/getsignimagekey.asp", onrcv:getSignImageKeyRes,
		status:""});
}

function getSignImageKeyRes(arg)
{
	if(arg.HAPI_STATUS != 0)
	{
		errstr = eLang.getString("common", "STR_FW_SIGNKEY_GETVAL");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		SIGNKEY_DATA = WEBVAR_JSONVAR_GETSIGNIMAGEKEYINFO.WEBVAR_STRUCTNAME_GETSIGNIMAGEKEYINFO[0];
	}
	frmUploadImageKey();
}

function frmUploadImageKey()
{
	var frm = new form("uploadSignImageKey", "POST", "javascript://",
		"general");

	signImageKeyInfo = frm.addTextField(eLang.getString("common",
		"STR_FW_SIGNKEY_INFO"), "_signImageKeyInfo",
		SIGNKEY_DATA.PublicKeyInfo, {"readOnly":true}, "bigclassicTxtBox");
	var fileUpload = document.createElement("div");
	fileUpload.innerHTML = "<form name='signImageKeyUpload' " +
		"id='_signImageKeyUpload' method='POST' " +
		"enctype='multipart/form-data' style='margin-bottom:0' " +
		"target='hiddenFrame' action='file_upload.html?SOURCE=SignImageKey'>" +
		"<input type='file' name='uploadSignImageKey' id='_signKeyBrowse' " +
		"size='35' />" +
		"</form>";

	fileBrowseRow = frm.addRow(eLang.getString("common",
		"STR_FW_NEW_SIGN_KEY"), fileUpload);

	var btnAry = [];
	btnAry.push(createButton("UploadBtn", eLang.getString("common",
		"STR_UPLOAD"), uploadSignImageKey));
	btnAry.push(createButton("cancelBtn", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_FW_SIGNKEY_TITLE"),
		frm.display(), btnAry);
	//Ignores backspace functionality
	signImageKeyInfo.onkeydown = checkBackspace;
	wnd.onclose = doSignImageSupport;
	signImageKeyInfo.focus();
}

function uploadSignImageKey()
{
	var signKeyBrowse = $("_signKeyBrowse");
	if (eVal.isblank(signKeyBrowse.value))
	{
		alert(eLang.getString("common","STR_FW_SIGNKEY_INVALID1"));
		return;
	}
	if( !eVal.endsWith(signKeyBrowse.value, ".pem") )
	{
		alert(eLang.getString("common","STR_FW_SIGNKEY_INVALID2"));
		return;
	}

	showWait(true,"Uploading");
	oper = UPLOAD_SIGNKEY;		//Used to indicate signImage public key file is uploading.
	document.forms["signImageKeyUpload"].submit();
}

function validateSignImageKey()
{
	xmit.get({url:"/rpc/validatesignkey.asp", onrcv:validateSignImageKeyRes,
		status:""});
}

function validateSignImageKeyRes(arg)
{
	var signImageValid = 0;
	if(arg.HAPI_STATUS == 0) {
		signImageValid = WEBVAR_JSONVAR_VALIDATESIGNIMGKEY.WEBVAR_STRUCTNAME_VALIDATESIGNIMGKEY[0].SIGNIMAGE_VALID;
		switch (signImageValid) {
		case 0:
			alert (eLang.getString("common", "STR_FW_SIGNKEY_SUCCESS"));
			closeForm();
			break;
		case 1: case 3: case 5:
			alert(eLang.getString("common", "STR_FW_SIGNKEY_ERR" +
				signImageValid));
			break;
		default:
			alert(eLang.getString("common", "STR_FW_SIGNKEY_ERR4"));
			break;
		}
	} else {
		errstr = eLang.getString("common", "STR_FW_SIGNKEY_VALIDATE_ERR");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

function closeForm()
{
	wnd.close();
	btnFWUpdate.disabled = false;
	chkPrsrvAll.disabled = false;
	btnPrsrvCfg.disabled = chkPrsrvAll.checked;
}

/*
 * It will check for the Preserve configuration support, If the user clicks the
 * button, then it will redirect to the Preserve Configuration page under
 * Maintenance.
 */
function doPreserveCfg()
{
	if(checkProjectCfg("PRESERVECONF") || (DUAL_IMAGE==true)) {
		lblPrsrvAllDesc.innerHTML = eLang.getString("common",
			"STR_FW_PRSRV_CFG_DESC");
		btnPrsrvCfg.className = "visibleRow";
		btnPrsrvCfg.disabled = false;
		btnPrsrvCfg.onclick = function () {
			location.href = "preserve_cfg.html";
		};
		divPrsrvCfg.className = "visibleRow";
		loadCustomPageElements();
		getPreserveCfg();
		chkPrsrvAll.onclick = enablePreserveAllCfg;
	} else {
		lblPrsrvAllDesc.innerHTML = "";
		btnPrsrvCfg.className = "hiddenRow";
		btnPrsrvCfg.onclick = function() {};
		divPrsrvCfg.className = "hiddenRow";
	}

}

/*
 * It will invoke the RPC method to get all preserve configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getPreserveCfg()
{
	xmit.get({url:"/rpc/getpreservecfg.asp", onrcv:getPreserveCfgRes, status:""});
}

/*
 * This is the response function for getPreserveCfg RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the
 * method to load the data value in UI.
 * @param arg object, RPC response data from xmit library
 */
function getPreserveCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_PRSRV_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		PRSRVCFG_DATA = WEBVAR_JSONVAR_GETPRESERVECFG.WEBVAR_STRUCTNAME_GETPRESERVECFG;
		loadPreserveCfg(false);
	}
}

/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select and double click event handler.
 */
function loadCustomPageElements()
{
	lgdPrsrvCfg.innerHTML = "";
	tblPrsrvCfg = listgrid({
		w : "100%",
		doAllowNoSelect : true
	});

	lgdPrsrvCfg.appendChild(tblPrsrvCfg.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_HASH"), w:"10%", fieldType:2,
		textAlign:"center"},
		{text:eLang.getString("common", "STR_PRSRV_CFG_ITEM"), w:"50%",
		textAlign:"center"},
		{text:eLang.getString("common","STR_PRSRV_STATUS"), w:"40%",
		textAlign:"center"}
		]};

	tblPrsrvCfg.loadFromJson(tblJSON);
}

/*
 * This function is used to load the rpc response from the global variable to
 * list grid. Also it will pass the disabled argument to listgrid, which will
 * load data in disabled/enabled format based on the argument value.
 * @param bopt boolean, true-enabled, false-disabled the listgrid data.
 */
function loadPreserveCfg(bopt)
{
	var rowIndex = 1;	//Row Index
	var rowJSON = [];	//Object of array of rows to load list grid
	var prsrvStatus;	//String of the Preserve status
	var prsrvName = ""; //String to hold the preserve configuration item names

	tblPrsrvCfg.clear();
	for(i = 0; i < PRSRVCFG_DATA.length; i++) {
		prsrvStatus = (PRSRVCFG_DATA[i].STATUS == 0) ?
			eLang.getString("common", "STR_OVERWRITE") :
			eLang.getString("common", "STR_PRESERVE");
		prsrvName = eLang.getString("common","STR_PRSRV_NAME_" + 
			PRSRVCFG_DATA[i].SELECTOR);
		try {
			rowJSON.push({cells:[
				{text:rowIndex, value:rowIndex},
				{text:prsrvName, value:prsrvName},
				{text:prsrvStatus, value:prsrvStatus}
			], disabled:bopt});
			rowIndex++;
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = rowJSON;
	tblPrsrvCfg.loadFromJson(tblJSON);
}

/*
 * This will enable or disable the Preserve configuration controls, based on
 * the Preserve All check box value.
 */
function enablePreserveAllCfg()
{
	var bopt;	//boolean, checkbox value
	bopt = chkPrsrvAll.checked;
	btnPrsrvCfg.disabled = bopt;;
	loadPreserveCfg(bopt);
}

/*
 * It will invoke the RPC method to get the firmware image configuration.
 * Once it get response from RPC, on receive method will be called
 * automatically.
 */
function getFWImageCfg()
{
	xmit.get({url:"/rpc/getfwimgcfg.asp", onrcv:getFWImageCfgRes, status:""});
}

/*
 * This is the response function for getFWImageCfg RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the
 * method to load the data value in UI.
 * @param arg object, RPC response data from xmit library
 */
function getFWImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_FWIMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		FWIMGCFG_DATA = WEBVAR_JSONVAR_GETFWIMGCFG.WEBVAR_STRUCTNAME_GETFWIMGCFG[0];
		lblProtoType.innerHTML = ":  " + eLang.getString("common",
			"STR_CONF_FWIMG_PROTO" + FWIMGCFG_DATA.PROTO_TYPE);
		if (CONST_PROTOTYPE_HTTP != FWIMGCFG_DATA.PROTO_TYPE) {
			addFWCfgRow(rowIndex++, "STR_SERVER_ADDRESS", FWIMGCFG_DATA.IP_ADDR);
			addFWCfgRow(rowIndex++, "STR_SOURCE_PATH", FWIMGCFG_DATA.SHARE_PATH);
			addFWCfgRow(rowIndex++, "STR_RETRY_COUNT", FWIMGCFG_DATA.RETRY_CNT);
		}
	}
}

/*
 * It will invoke the RPC method to get the dual image configuration.
 * Once it get response from RPC, on receive method will be called
 * automatically.
 */
function getDualImageCfg()
{
	xmit.get({url:"/rpc/getdualimgcfg.asp", onrcv:getDualImageCfgRes,
		status:""});
}

/*
 * This is the response function for getDualImageCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getDualImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DUAL_IMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DUALIMGCFG_DATA = WEBVAR_JSONVAR_GETDUALIMGCFG.WEBVAR_STRUCTNAME_GETDUALIMGCFG[0];
		txtActiveImg.value = eLang.getString("common", "STR_CONF_DUAL_IMG" +
			DUALIMGCFG_DATA.ACTIVE_IMAGE);
		lstFlashImg.value = DUALIMGCFG_DATA.UPLOAD_IMAGE;
		chkRebootBMC.checked = (DUALIMGCFG_DATA.REBOOT_BMC == 1) ? true : false;
	}
}

function fillFlashImage()
{
	var index = 0;				//loop counter
	for (index = 0; index <= 3; index++) {
		lstFlashImg.add(new Option(eLang.getString("common",
			"STR_CONF_DUAL_IMG" + index), index), isIE ? index : null);
	}
}

function setDualImageCfg()
{
	var req;			//xmit object to send RPC request with parameters
	req = xmit.getset({url:"/rpc/setflashimgcfg.asp", onrcv:setDualImageCfgRes,
		status:""});
	req.add("FLASH_IMAGE", lstFlashImg.value);
	req.add("REBOOT_BMC", chkRebootBMC.checked ? 1 : 0);
	req.send();
	delete req;
}

function setDualImageCfgRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_DUAL_IMG_SETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		doEnterUpgrade();
	}
}

function addFWCfgRow(index, name, value)
{
	var rowFWCfg;	//row in the table
	var lblFWCfg;	//label for the row
	var valFWCfg;	//value for the row
	rowFWCfg = tblFWCfg.insertRow(index);
	lblFWCfg = rowFWCfg.insertCell(0);
	valFWCfg = rowFWCfg.insertCell(1);
	lblFWCfg.style.fontWeight = "bold";
	lblFWCfg.innerHTML = eLang.getString("common", name);
	valFWCfg.innerHTML = ":  " + value;
}

function downloadFWImage()
{
	uploadImage.className = "hiLite";
	uploadImage.appendChild(progressIcon);
	var req = new xmit.getset({url:"/rpc/dwldfwimg.asp",
		onrcv:downloadFWImageRes, status: ""});
	req.add("PROTO_TYPE", FWIMGCFG_DATA.PROTO_TYPE);
	req.send();
}

function downloadFWImageRes(arg)
{
	if(arg.HAPI_STATUS == 0) {
		with(uploadImage)
		{
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		uploadImage.className = "hiLite";
		uploadImage.appendChild(progressIcon);
		spnUploadStatus.innerHTML = "(0%)";
		downloadFWStatus();
	} else {
		uploadImage.firstChild.src = "../res/prg_failure.png";
		uploadImage.removeChild(progressIcon);
		alert (eLang.getString("common", "STR_FW_DWLDIMG_ERR") + 
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
		setFlashMode(false);
		rebootDevice(false, true, false);
	}
}

function downloadFWStatus()
{
	if(timerid != -1) {
		clearTimeout(timerid);
	}
	xmit.get({url:"/rpc/dwldfwstatus.asp", onrcv:downloadFWStatusRes, status:""});
}

function downloadFWStatusRes(arg)
{
	if (timerid != -1) {
		clearTimeout(timerid);
	}
	if(arg.HAPI_STATUS == 0) {
		DWLDFWSTATUS = WEBVAR_JSONVAR_DWLDFWSTATUS.WEBVAR_STRUCTNAME_DWLDFWSTATUS[0];
		if (DWLDFWSTATUS.STATE >= 0x1 && DWLDFWSTATUS.STATE <= 0x5) {
			spnUploadStatus.innerHTML = "(" + DWLDFWSTATUS.PROGRESS + ")";
		}
		timerid = setTimeout("downloadFWStatus()", 2000);
	} else if (arg.HAPI_STATUS == 0xFF) {
		spnUploadStatus.innerHTML = "(100% done)";
		with (uploadImage) {
			className = "normal";
			style.color = "#000";
			firstChild.src = "../res/prg_success.png";
		}
		verifyFirmware();
	} else {
		uploadImage.firstChild.src = "../res/prg_failure.png";
		uploadImage.removeChild(progressIcon);
		alert (eLang.getString("common", "STR_FW_DWLDSTATUS_ERR") + 
			eLang.getString("common", "STR_FW_UPDATE_RESET"));
		setFlashMode(false);
		rebootDevice(false, true, false);
	}
}

function verifyFlashImage() {
	var strImgVerifyTitle = ""; // Title for Image Verification wizard
	var p = document.createElement("p");
	p.innerHTML = "";

	var divVerifyFlash = document.createElement("div");

	var chkVersionFlash = document.createElement("input");
	chkVersionFlash.type = "checkbox";
	chkVersionFlash.id = "_chkVersionFlash";

	var lblVersionFlash = document.createElement("label");
	lblVersionFlash.innerHTML = eLang.getString("common",
		"STR_FW_VERSION_FLASH");
	lblVersionFlash.htmlFor = "_chkVersionFlash";

	var chkFullFlash = document.createElement("input");
	chkFullFlash.type = "checkbox";
	chkFullFlash.id = "_chkFullFlash";

	var lblFullFlash = document.createElement("label");
	lblFullFlash.innerHTML = eLang.getString("common",
		"STR_FW_FULL_FLASH");
	lblFullFlash.htmlFor = "_chkFullFlash";

	if (SECTIONFLASH_SUPPORT) {
		strImgVerifyTitle = eLang.getString("common",
			"STR_FW_SECTION_UPDATE_HEAD");
		if (FWVERIFYINFO_DATA[0].STATUS & CONST_FULL_FLASH) {
			p.innerHTML = eLang.getString("common",
				"STR_FW_FULL_FLASH_DESC");
		} else if (VERSION_CMP_FLASH && (FWVERIFYINFO_DATA[0].STATUS & 
			VER_CMP_MODULE_VERSION_SAME)) {
			p.innerHTML = eLang.getString("common",
				"STR_FW_VERSION_FLASH_DESC_1");
		} else if (VERSION_CMP_FLASH && (FWVERIFYINFO_DATA[0].STATUS & 
			VER_CMP_MODULE_SIZE_DIFF)) {
			p.innerHTML = eLang.getString("common",
				"STR_FW_VERSION_FLASH_DESC_2");
		} else {
			p.innerHTML = eLang.getString("common",
				"STR_FW_SECTION_UPDATE_DESC");
		}

		divVerifyFlash.id = "_wizardSectionFlash";
		if (VERSION_CMP_FLASH) {
			divVerifyFlash.appendChild(chkVersionFlash);
			divVerifyFlash.appendChild(lblVersionFlash);
		}

		divVerifyFlash.appendChild(chkFullFlash);
		divVerifyFlash.appendChild(lblFullFlash);
		p.appendChild(divVerifyFlash);

		lgdSectionVerify = document.createElement("div");
		lgdSectionVerify.className = "wizardSectionVerify";

		loadCustomPageElementsSections();
		loadSectionCfg();
		p.appendChild(lgdSectionVerify);
	} else {
		var status = FWVERIFYINFO_DATA[0].STATUS;
		strImgVerifyTitle = eLang.getString("common",
			"STR_FW_FULL_FLASH_HEAD");

		if (lstFlashImg.value == CONST_FLASH_BOTH && DUAL_IMAGE) {
			p.innerHTML += "<strong>" + eLang.getString("common",
				"STR_FW_IMAGE1_VERSION") + ":</strong>" + 
				FWVERIFYINFO_DATA[0].CURVERSION1 + "<br/><strong>" + 
				eLang.getString("common", "STR_FW_IMAGE2_VERSION") + 
				":</strong>" + FWVERIFYINFO_DATA[0].CURVERSION2 + "<br/><strong>" + 
				eLang.getString("common", "STR_FW_UPLOADED_VERSION") + 
				":</strong>" + FWVERIFYINFO_DATA[0].NEWVERSION;
		} else {
			p.innerHTML += "<strong>" + eLang.getString("common",
				"STR_FW_VERIFY_CURVERSION") + ":</strong>" + 
				FWVERIFYINFO_DATA[0].CURVERSION1 + "<br/><strong>" + 
				eLang.getString("common", "STR_FW_VERIFY_NEWVERSION") + 
				":</strong>" + FWVERIFYINFO_DATA[0].NEWVERSION;
		}
		if(getbits(status, 0, 0)) {
			if(getbits(status, 2, 2)) {
				p.innerHTML += "<br/><br/>" + (eLang.getString("common",
					"STR_FW_VERIFY_DIFFVERSION"));
			} else if(getbits(status, 1, 1)) {
				ImageSizeChanged = 1;
				p.innerHTML += "<br/><br/>" + (eLang.getString("common",
					"STR_FW_VERIFY_DIFFSIZE"));
			}
		} else {
			p.innerHTML += "<br/><br/>" + (eLang.getString("common",
				"STR_FW_VERIFY_SAME"));
		}

		if (VERSION_CMP_FLASH) {
			divVerifyFlash.id = "_wizardFullFlash";
			divVerifyFlash.appendChild(chkVersionFlash);
			divVerifyFlash.appendChild(lblVersionFlash);
			divVerifyFlash.appendChild(chkFullFlash);
			divVerifyFlash.appendChild(lblFullFlash);
			p.appendChild(divVerifyFlash);
		}
	}

	var btnAry = [];
	btnAry.push(createButton("_proceed", (eLang.getString("common",
		"STR_PROCEED")), proceedFlash));
	btnAry.push(createButton("_cancelFlashing", (eLang.getString("common",
		"STR_CANCEL")), cancelWizard));

	updateSection(strImgVerifyTitle, p, btnAry);
	reloadHelp();

	var boolFullFlash = (FWVERIFYINFO_DATA[0].STATUS & CONST_FULL_FLASH) ? true :
		false;
	if (!boolFullFlash) {
		if (VERSION_CMP_FLASH) {
			$("_chkVersionFlash").disabled = (FWVERIFYINFO_DATA[0].STATUS &
				VER_CMP_MODULE_SIZE_DIFF) ? true : false;
			$("_chkFullFlash").onclick = doFirmwareFlashCfg;
			$("_chkVersionFlash").onclick = doFirmwareFlashCfg;
		}
		if (SECTIONFLASH_SUPPORT) {
			$("_chkFullFlash").onclick = doFirmwareFlashCfg;
		}
	} else {
		$("_chkFullFlash").checked = boolFullFlash;
		$("_chkFullFlash").disabled = boolFullFlash;
		if (VERSION_CMP_FLASH) {
			$("_chkVersionFlash").disabled = boolFullFlash;
		}
	}	
	sectionStatusCfg(boolFullFlash);
	
}

function doFirmwareFlashCfg() {
	var bopt = false; // boolean, hold the full firmware flash checkbox value
	if (VERSION_CMP_FLASH) {
		bopt =  $("_chkFullFlash").checked || $("_chkVersionFlash").checked;
		$("_chkVersionFlash").disabled = ((FWVERIFYINFO_DATA[0].STATUS & 
			VER_CMP_MODULE_SIZE_DIFF) ? true : $("_chkFullFlash").checked);
		$("_chkFullFlash").disabled = $("_chkVersionFlash").checked;
	} else if (SECTIONFLASH_SUPPORT) {
		bopt =  $("_chkFullFlash").checked;
	}
	if (SECTIONFLASH_SUPPORT) {
		backupSectionCfg(bopt);
		sectionStatusCfg(bopt);
	}
}

/*
 * In this case, checkboxes were loaded in listgrid, the listgrid was loaded
 * without data after enable or disable the full flash option.
 * @param bool = true, this will store the check boxes live data into the temp
 * variable before enable the full flash option and checked all checkbox will
 * be changed as unchecked.
 * @param bool = false, this will load back the stored the check boxes live
 * data from the temp variable into the appropriate check boxes.
 */
function backupSectionCfg(bool) {
	var i; // loop counter
	for (i = 0; i < FWVERIFYINFO_DATA.length; i++) {
		if (bool) {
			tmpSecFlashCfg[i] = $("_chkSecStatus" + i).checked;
			$("_chkSecStatus" + i).checked = false;
		} else {
			$("_chkSecStatus" + i).checked = tmpSecFlashCfg[i];
		}
	}
}

/*
 * This function is used to load the list grid and its header information. Also
 * initializes the list grid before sort and after sort event handler.
 */
function loadCustomPageElementsSections() {
	tblSectionCfg = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	lgdSectionVerify.appendChild(tblSectionCfg.table);

	try {
		if (lstFlashImg.value == CONST_FLASH_BOTH && DUAL_IMAGE) {
			tblSectionJSON = {cols : [
				{text : eLang.getString("common", "STR_HASH"), w : "5%", fieldType : 2,
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_SECTION_NAME"), w : "20%",
					fieldType : 2, textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_IMAGE1_VERSION"), w : "15%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_IMAGE2_VERSION"), w : "15%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_UPLOADED_VERSION"), w : "20%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_SEC_STATUS"), w : "25%",
					textAlign : "center", sort : false}
				]};
		} else {
			 tblSectionJSON = {cols : [
				{text : eLang.getString("common", "STR_HASH"), w : "15%", fieldType : 2,
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_SECTION_NAME"), w : "20%",
					fieldType : 2, textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_EXISTING_VERSION"), w : "20%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_UPLOADED_VERSION"), w : "20%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_SEC_STATUS"), w : "25%",
					textAlign : "center", sort : false}
				]};
		}
		tblSectionCfg.loadFromJson(tblSectionJSON);
	} catch(e) {
		alert(e);
	}

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting
	 * listbox was reloaded without data. This function will backup all checked
	 * checkbox data.
	 */
	tblSectionCfg.onbeforesort = function() {
		backupSectionCfg(true);
	};

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting
	 * listbox was reloaded without data. This function will restore all backup
	 * data to corresponding checkbox.
	 */
	tblSectionCfg.onaftersort = function() {
		backupSectionCfg(false);
	};
}

/*
 * This function is used to load the list grid and its header information. Also
 * initializes the list grid before sort and after sort event handler.
 */
function loadCustomPageElementsSectionsHPM() {
	tblSectionCfg = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	lgdSectionVerify.appendChild(tblSectionCfg.table);

	try {
		 tblSectionJSON = {cols : [
				{text : eLang.getString("common", "STR_HASH"), w : "15%", fieldType : 2,
					textAlign : "center"},
				{text : "Component Name", w : "20%",
					fieldType : 2, textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_EXISTING_VERSION"), w : "20%",
					textAlign : "center"},
				{text : eLang.getString("common", "STR_FW_UPLOADED_VERSION"), w : "20%",
					textAlign : "center"},
				{text : "Update", w : "25%",
					textAlign : "center", sort : false}
				]};
		
		tblSectionCfg.loadFromJson(tblSectionJSON);
	} catch(e) {
		alert(e);
	}

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting
	 * listbox was reloaded without data. This function will backup all checked
	 * checkbox data.
	 */
	tblSectionCfg.onbeforesort = function() {
		backupSectionCfg(true);
	};

	/*
	 * In this case, checkboxes were loaded in listgrid, so after sorting
	 * listbox was reloaded without data. This function will restore all backup
	 * data to corresponding checkbox.
	 */
	tblSectionCfg.onaftersort = function() {
		backupSectionCfg(false);
	};
}

/*
 * This function is used to load the rpc response from the global variable to
 * list grid.
 */
function loadSectionCfg() {
	var rowIndex = 1; // Row Index
	var rowJSON = []; // Object of array of rows to load list grid
	tblSectionCfg.clear();
	for (i = 0; i < FWVERIFYINFO_DATA.length; i++) {
		varSecStatus = "<input type='checkbox' id='_chkSecStatus" + i + "'>";
		try {
			if (lstFlashImg.value == CONST_FLASH_BOTH && DUAL_IMAGE) {
				// This is used to display the existing and uploaded image details in dual image case
				rowJSON.push({cells : [
					{text : rowIndex, value : rowIndex},
					{text : FWVERIFYINFO_DATA[i].SECTIONNAME,
					value : FWVERIFYINFO_DATA[i].SECTIONNAME},
					{text : FWVERIFYINFO_DATA[i].CURVERSION1,
					value : FWVERIFYINFO_DATA[i].CURVERSION1},
					{text : FWVERIFYINFO_DATA[i].CURVERSION2,
					value : FWVERIFYINFO_DATA[i].CURVERSION2},
					{text : FWVERIFYINFO_DATA[i].NEWVERSION,
					value : FWVERIFYINFO_DATA[i].NEWVERSION},
					{text : varSecStatus, value : varSecStatus}
					]});
				rowIndex++;
			} else {
				rowJSON.push({cells : [
					{text : rowIndex, value : rowIndex},
					{text : FWVERIFYINFO_DATA[i].SECTIONNAME,
					value : FWVERIFYINFO_DATA[i].SECTIONNAME},
					{text : FWVERIFYINFO_DATA[i].CURVERSION1,
					value : FWVERIFYINFO_DATA[i].CURVERSION1},
					{text : FWVERIFYINFO_DATA[i].NEWVERSION,
					value : FWVERIFYINFO_DATA[i].NEWVERSION},
					{text : varSecStatus, value : varSecStatus}
					]});
				rowIndex++;
			}
		} catch (e) {
			alert(e);
		}
	}
	tblSectionJSON.rows = rowJSON;
	tblSectionCfg.loadFromJson(tblSectionJSON);
}

/*
 * This function is used to load the rpc response from the global variable to
 * list grid.
 */
function loadSectionCfgHPM() {
	
	//if(HPM_COMPONENT_DATA_ID == null) return;
	if(HPM_COMPONENT_DATA_VERSION_ID == null) return;
	
	var req;	//xmit object to send RPC request with parameters
	req = xmit.getset({url:"/rpc/gethpmcurrentcompversion.asp", onrcv:getHPMCurrentVerionsRes,
		status:""});
	req.add("COMPONENT_ID", HPM_COMPONENT_DATA_VERSION_ID.join(","));
	req.send();
	delete req;
}

function getHPMCurrentVerionsRes(arg) {
	//arg.HAPI_STATUS=0;
	if(arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_FWIMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		var HPM_COMP_CURRENT_VERSIONS = WEBVAR_JSONVAR_GETHPMCOMPCURRENTVERSION.WEBVAR_STRUCTNAME_GETHPMCOMPCURRENTVERSION;
		
		var rowIndex = 1; // Row Index
		var rowJSON = []; // Object of array of rows to load list grid
		tblSectionCfg.clear();
		var isDisabled=false;
		if(HPM_COMPONENT_DATA_ID.length==2){
			isDisabled=true;
		}
		if(HPM_COMPONENT_DATA_VERSION== null) return;
		reorderHPMComponents();
		for (i = 0; i < HPM_COMP_CURRENT_VERSIONS.length; i++) {
			varSecStatus = "<input type='checkbox' onclick='doComponentCheck(this);' id='_chkSecStatus" + i + "' value="+ HPM_COMPONENT_DATA_ID[i] +">";
			try {
				rowJSON.push({cells : [
					{text : rowIndex, value : rowIndex},
					{text : HPM_ORDER_COMPONENT[i],value : HPM_ORDER_COMPONENT[i]},
					{text : HPM_COMP_CURRENT_VERSIONS[i].CURRENT_VERSION,value : HPM_COMP_CURRENT_VERSIONS[i].CURRENT_VERSION},
					{text : HPM_COMPONENT_DATA_VERSION[i],value : HPM_COMPONENT_DATA_VERSION[i]},
					{text : varSecStatus, value : varSecStatus}
					]});
				rowIndex++;
				
			} catch (e) {
				alert(e);
			}
		}
		tblSectionJSON.rows = rowJSON;
		tblSectionCfg.loadFromJson(tblSectionJSON);
	}
}

function doComponentCheck(obj){
	if(HPM_COMPONENT_DATA_ID.length > 2){
		var cid=parseInt(obj.value);
		//var id=parseInt(obj.index);
		
		if(cid== HPM_APP_COMP && obj.checked==true) {
			$("_chkSecStatus" + 1).checked=true;
		} else if(cid== HPM_APP_COMP && obj.checked==false) {
			$("_chkSecStatus" + 1).checked=false;
		}
		
		if(cid== HPM_BOOT_COMP && obj.checked==true) {
			$("_chkSecStatus" + 2).checked=true;
		} else if(cid== HPM_APP_COMP && obj.checked==false) {
			$("_chkSecStatus" + 2).checked=false;
		}
	}	
}

function reorderHPMComponents(){
	
	//console.log(HPM_COMPONENT_DATA_NAME);
	
	if(HPM_COMPONENT_DATA_NAME.length > 0){
		HPM_COMPONENT_DATA_ID.length=0;
		for(i=0;i<HPM_COMPONENT_DATA_NAME.length;i++){
			var name=parseInt(HPM_COMPONENT_DATA_NAME[i].split("-")[1]);
			if(name== HPM_BIOS_COMP) {
				HPM_ORDER_COMPONENT.push(HPM_COMPONENT_DATA_NAME[i].split("-")[0]);
				//console.log("HPM_BIOS_COMP "+name);
				HPM_COMPONENT_DATA_ID.push(name);
			}
		}
		for(i=0;i<HPM_COMPONENT_DATA_NAME.length;i++){
			var name=parseInt(HPM_COMPONENT_DATA_NAME[i].split("-")[1]);
			if(name== HPM_BOOT_COMP) {
				HPM_ORDER_COMPONENT.push(HPM_COMPONENT_DATA_NAME[i].split("-")[0]);
				//console.log("HPM_BOOT_COMP "+name);
				HPM_COMPONENT_DATA_ID.push(name);
			}
		}
		for(i=0;i<HPM_COMPONENT_DATA_NAME.length;i++){
			var name=parseInt(HPM_COMPONENT_DATA_NAME[i].split("-")[1]);
			if(name== HPM_APP_COMP) {
				HPM_ORDER_COMPONENT.push(HPM_COMPONENT_DATA_NAME[i].split("-")[0]);
				//console.log("HPM_APP_COMP "+name);
				HPM_COMPONENT_DATA_ID.push(name);
			}
		}
		//console.log(HPM_COMPONENT_DATA_ID)
	}
}

function returnOrderComponents(compId){
	var result;
	for(i=0;i<HPM_COMPONENT_DATA_NAME.length;i++){
		var cid=parseInt(HPM_COMPONENT_DATA_NAME[i].split("-")[1]);
		if(cid== compId){
			
			switch(compId){
				case compId:
				result="BIOS"
					break;
				case compId:
				result="BOOT"
						break;
				case compId:
				result="APP"
					break;
			}
		}
	}
	return result;
}
/*
 * It will load response data from global variable to respective controls in UI.
 * @param bopt = true, then the entire listgrid will be grayed out.
 * @param bopt = false, then the each row will be set as enable or disable
 * based on the section updated status.
 */
function sectionStatusCfg(bopt) {
	var i; // loop counter
	for (i = 0; i < FWVERIFYINFO_DATA.length; i++) {
		try {
			if (bopt) {
				tblSectionCfg.container.rows[i+1].setEnabled(!bopt); // This will grayed out all the rows
				$("_chkSecStatus" + i).disabled = bopt; // This will grayed out all checkbox
			} else {
				tblSectionCfg.container.rows[i+1].setEnabled
					(!FWVERIFYINFO_DATA[i].SECTIONSTATUS);
				$("_chkSecStatus" + i).disabled =
					FWVERIFYINFO_DATA[i].SECTIONSTATUS;
			}
		} catch (e) {
			continue;
		}
	}
}

/*
 * It will load response data from global variable to respective controls in UI.
 * @param bopt = true, then the entire listgrid will be grayed out.
 * @param bopt = false, then the each row will be set as enable or disable
 * based on the section updated status.
 */
function sectionHPMStatusCfg(bopt) {
	var i; // loop counter
	if(HPM_COMPONENT_DATA_NAME == null) return;
	//console.log("sectionHPMStatusCfg " + HPM_COMPONENT_DATA_NAME);
	for (i = 0; i < HPM_COMPONENT_DATA_NAME.length; i++) {
		
		var cid=parseInt(HPM_COMPONENT_DATA_NAME[i].split("-")[1]);
		if((cid== HPM_APP_COMP) || (cid== HPM_BOOT_COMP)){
			//tblSectionCfg.container.rows[i+1].setEnabled(false);	
			//$("_chkSecStatus" + i).disabled = true;
		}
		
		try {
			if (bopt) {
				//tblSectionCfg.container.rows[i+1].setEnabled(!bopt); // This will grayed out all the rows
				//$("_chkSecStatus" + i).disabled = bopt; // This will grayed out all checkbox
				$("_chkSecStatus" + i).checked = bopt; // This will grayed out all checkbox
			} else {
				//tblSectionCfg.container.rows[i+1].setEnabled(bopt);
				//$("_chkSecStatus" + i).disabled =bopt;
				$("_chkSecStatus" + i).checked =bopt;
			}
		} catch (e) {
			continue;
		}
	}
}

//HPM related functions.
if (!window.atob) {
    var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var table = tableStr.split("");

    window.atob = function (base64) {
        if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
        base64 = base64.replace(/=/g, "");
        var n = base64.length & 3;
        if (n === 1) throw new Error("String contains an invalid character");
        for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
            var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
            var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
            if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
            bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
            bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
            bin[bin.length] = ((c << 6) | d) & 255;
        };
        return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
    };

    window.btoa = function (bin) {
        for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
            var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
            if ((a | b | c) > 255) throw new Error("String contains an invalid character");
            base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                      (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                      (isNaN(b + c) ? "=" : table[c & 63]);
        }
        return base64.join("");
    };

}

function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
);
}

function base64ToHex(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
