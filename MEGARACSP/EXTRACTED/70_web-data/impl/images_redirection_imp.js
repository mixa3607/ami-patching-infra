//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2011-2014        **;
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

// File Name  : configure_lmedia_imp.js
// Brief      : This implementation is to display the image files in list grid. 
// It contains implementation to add, replace and delete the image files.
// Author Name: Arockia Selva Rani. A

var LMEDIA_DATA;	//Holds RPC response data of local media images
var RMEDIA_DATA;	//Holds RPC response data of remote media images
var MEDIA_DATA;		//Hold the RPC response data of local/remote media image informations
var MEDIA_CFG;		//Holds RPC response data of remote media configuration
var LMEDIA_IMAGES;	//Holds RPC response data of all local media image informations
var RMEDIA_IMAGES;	//Holds RPC response data of all remote media image informations
var LMEDIA_ENABLE;	//Holds RPC response data of local media enable
var RMEDIA_ENABLE;	//Holds RPC response data of remote media enable

var LMEDIA_SUPPORT = false;
var RMEDIA_SUPPORT = false;
var MEDIA_LICENSE_SUPPORT = false;
var LMEDIA_LICENSE_SUPPORT = false;
var RMEDIA_LICENSE_SUPPORT = false;
var initMediaRedirection = false;	//boolean to hold image redirection staus
var CONST_TIMEOUT = 2000;		//Constant to hold the timeout value
var loopCounter = 0;			//Var used to hold the loop counter
var SDCardStatus  = true;		//Holds the SD Card status
var RemoteMount = true;

var tblJSON;		//Object to hold image information in JSON structure
var tblImage;		//List grid object to hold image information

var varMediaType;	//Integer to hold media type (local or remote media)
var varImageOper;	//Integer to hold Image operation (add, clear or delete)
var varImageType;	//Integer to hold Image type (Floppy, CD or Harddisk)
var varImageIndex;	//Integer used to hold the image index
var varImageName;	//String to hold Image file name
var varAdvMediaFrm = false;	//Boolean to check for advanced settings form
var varFilePath = "";	//String to hold Image file path
/*
 * The following are the constants used in this implementation.
 * The below listed is for media types available.
 */
var CONST_LMEDIA = 0x0;	//Constant for Local Media
var CONST_RMEDIA = 0x1;	//Constant for Remote Media
var CONST_MEDIA_DISABLE = 3;	//Constant for both LMedia and Rmedia disable
var CONST_MEDIA_ENABLE = 4;		//Constant for both LMedia and Rmedia enable
var CONST_REDIR_START = 1;		//Constant for Redirection start status
var CONST_REDIR_STOP = 0;		//Constant for Redirection stop status
var CONST_REDIR_PROGRESS = 100;		//Constant for Redirection progress status
var CONST_REDIR_STATUS_ERR_MIN = 0;	//Constant for Redirection status error minimum
var CONST_REDIR_STATUS_ERR_MAX = 16;//Constant for Redirection status error maximum
var CONST_CD_MEDIA_TYPE = 0x1;		//Constant to hold the CD Media type
var CONST_FD_MEDIA_TYPE = 0x2;		//Constant to hold the FD Media type
var CONST_HD_MEDIA_TYPE = 0x4;		//Constant to hold the HD Media type
var CONST_SD_MOUNT_ERROR = -1;	//Used to hold the SD Card Mount error
var CONST_REMOTE_MOUNT_ERROR = -1;
var CONST_CLEAR_DATA = 0x2;		//Used to hold the clear image data

var IMAGE_TYPE_STR_FD = "Floppy";	//Constant for Floppy Image type
var IMAGE_TYPE_STR_CD = "CD/DVD";	//Constant for CD/DVD Image type
var IMAGE_TYPE_STR_HD = "Harddisk";	//Constant for Harddisk Image type
//var LMEDIA_FILE_PATH = "/usr/local/lmedia/"; //Constant lmedia upload path
var LMEDIA_FILE_PATH = "uploadlmediaimg";	//Constant lmedia upload path
var timeoutID;						//The numerical ID of the timeout function
var strRMediaType = [IMAGE_TYPE_STR_CD,IMAGE_TYPE_STR_FD,IMAGE_TYPE_STR_HD,"All"];
var RMediaTypeStatus = {
						IMAGE_TYPE_STR_CD:1,
						IMAGE_TYPE_STR_FD:2,
						IMAGE_TYPE_STR_HD:4,
						"All":16
						};
var MEDIA_CFG_CD;//Holds RPC response data of CD Media Data
var MEDIA_CFG_Floppy;//Holds RPC response data of Floppy Media Data
var MEDIA_CFG_HD;//Holds RPC response data of HD Media Data
var AllMode=false;
var responseCount=0;
var responseCD=[];
var responseFD=[];
var responseHD=[];
var responseSuccess=[];
var IsDataModified=false;
var rmediarestart=0;
var IsCD=false;IsFD=false;IsHD=false;
var mStatus;
var MOUNT_STATUS_CD="";
var MOUNT_STATUS_FD="";
var MOUNT_STATUS_HD="";

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit() {
	exposeElms(["_lblMediaDesc",
		"_divMountError",
		"_tblTab",
		"_tabLMedia",
		"_tabRMedia",
		"_divMediaTab",
		"_btnAdvSettings",
		"_parImageDesc",
		"_lblHeader",
		"_lgdImage",
		"_btnStart",
		"_btnAdd",
		"_btnDelete"]);

	if(top.user.isAdmin()) {
		btnAdd.onclick = function() {
			doProcessImage(top.CONSTANTS.ADD);
		}
		btnDelete.onclick = function() {
			doProcessImage(top.CONSTANTS.DELETE);
		}
	} else {
		//disableActions();
		//btnAdvSettings.disabled = true;
		btnAdvSettings.disabled = changeButtonState(true);
		disableButtons();
	}

	btnAdvSettings.onclick = doMediaCfg;
	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 * Also initiate the local media tab as default tab.
 */
function _begin() {
	LMEDIA_SUPPORT = checkProjectCfg("LMEDIA");
	RMEDIA_SUPPORT = checkProjectCfg("RMEDIA");
	MEDIA_LICENSE_SUPPORT = (top.fnCookie.read("License").indexOf(","+"MEDIA"+",") == -1)? true : false;
	LMEDIA_LICENSE_SUPPORT = (top.fnCookie.read("License").indexOf(""+"LMEDIA"+"") == -1)? true : false;
	RMEDIA_LICENSE_SUPPORT = (top.fnCookie.read("License").indexOf(""+"RMEDIA"+"") == -1)? true : false;
	
	if(MEDIA_LICENSE_SUPPORT){
		getMediaCfg();
		if (LMEDIA_SUPPORT && RMEDIA_SUPPORT) {
			tblTab.className = "visibleRow";
			tabLMedia.onclick = doLocalMedia;
			tabRMedia.onclick = doRemoteMedia;
			divMediaTab.className = "classicTabContent";
	
			var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
			if (tabLastVisit != null) {
				$(tabLastVisit).onclick();
			} else {
				doLocalMedia();
			}
		} else if (LMEDIA_SUPPORT) {
			doLocalMedia();
		} else if (RMEDIA_SUPPORT) {
			doRemoteMedia();
		}
		loadCustomPageElements();
	}
	else{
		btnAdvSettings.disabled = changeButtonState(false);
		divMountError.innerHTML = "";
		divMountError.innerHTML =  eLang.getString("common", 
					"STR_MEDIA_CFG_MEDIA_LICENSE_ERROR");
	}
}

/*
 * This will toggle the flag to true for advanced settings form.
 * Also invoke the RPC method to get the remote media configuration.
 */
function doMediaCfg() {
	varAdvMediaFrm = true;
	if (((RMEDIA_SUPPORT && RMEDIA_LICENSE_SUPPORT) || (LMEDIA_SUPPORT && LMEDIA_LICENSE_SUPPORT)) && MEDIA_LICENSE_SUPPORT) {
		frmAdvMediaCfg();
	}
}

/*
 * It will invoke the RPC method to get the local media and remote media enable 
 * configuration. Once it get data from RPC, response function will be called 
 * automatically.
 */
function getMediaCfg() {
	varAdvMediaFrm = false;
	//btnAdvSettings.disabled = false;
	btnAdvSettings.disabled = changeButtonState(false);
	xmit.get({url:"/rpc/getmediacfg.asp", onrcv:getMediaCfgRes, 
		status:""});
}

/*
 * This is the response function for getMediaCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and load the output
 * data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getMediaCfgRes(arg) {
	var errstr;		//Error string
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		errstr = eLang.getString("common", "STR_MEDIA_CFG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		MEDIA_CFG = WEBVAR_JSONVAR_GETMEDIACFG.WEBVAR_STRUCTNAME_GETMEDIACFG;
		MEDIA_CFG_CD= MEDIA_CFG[0];//CD Index
		MEDIA_CFG_Floppy= MEDIA_CFG[1];//Floppy Index
		MEDIA_CFG_HD= MEDIA_CFG[2];//HD Index
		if (LMEDIA_SUPPORT) {
			LMEDIA_ENABLE = MEDIA_CFG_CD.LMEDIAENABLE;
		}

		if (RMEDIA_SUPPORT) {
			RMEDIA_ENABLE = MEDIA_CFG_CD.RMEDIAENABLE;
		}

		if (LMEDIA_SUPPORT && RMEDIA_SUPPORT) {
			if (!LMEDIA_ENABLE && !RMEDIA_ENABLE) {
				addMediaDesc("MEDIA", CONST_MEDIA_DISABLE);
			} else if (!LMEDIA_ENABLE) {
				addMediaDesc("MEDIA", CONST_LMEDIA);
			} else if (!RMEDIA_ENABLE) {
				addMediaDesc("MEDIA", CONST_RMEDIA);
			} else {
				addMediaDesc("MEDIA", CONST_MEDIA_ENABLE);
			}
		} else if (LMEDIA_SUPPORT) {
			addMediaDesc("LMEDIA", LMEDIA_ENABLE ? 0 : 1);
		} else if (RMEDIA_SUPPORT) {
			addMediaDesc("RMEDIA", RMEDIA_ENABLE ? 0 : 1);
		}
	}
}

/*
 * This will used to show the LMedia and RMedia status in the page.
 */
function addMediaDesc(strMedia, status) {
	lblMediaDesc.innerHTML = eLang.getString("common",
		"STR_" + strMedia + "_DESC");
	if (status) {
		lblMediaDesc.innerHTML += eLang.getString("common",
			"STR_" + strMedia + "_STATUS_" + status);
	}
	lblMediaDesc.innerHTML += eLang.getString("common",
		"STR_" + strMedia + "_ADV_DESC");
}

/*
 * This will design the UI controls for Advanced Media configuration form.
 */
function frmAdvMediaCfg() {
	var frm = new mediaform("advancedMediaFrm", "POST", "javascript://", "general");

	if (LMEDIA_SUPPORT && LMEDIA_LICENSE_SUPPORT) {
		settings = frm.addCheckBox(eLang.getString("common",
			"STR_LMEDIA_ENABLE"), "chkLMediaEnable",
			{"chkLMediaEnable":"Enable"}, false, ["chkLMediaEnable"]);
		chkLMediaEnable = settings.chkLMediaEnable;
	}

	if (RMEDIA_SUPPORT && RMEDIA_LICENSE_SUPPORT) {
		/*settings = frm.addCheckBox(eLang.getString("common",
			"STR_RMEDIA_ENABLE"), "chkRMediaEnable",
			{"chkRMediaEnable":"Enable"}, false, ["chkRMediaEnable"]);
		chkRMediaEnable = settings.chkRMediaEnable;*/

		//template for table structure has been mentioned in below of this page.
		var tran= document.createElement('tr');
		var trantd= document.createElement('td');

		var tdbr= document.createElement('br');
		//trantd.appendChild(tdbr);

		var maintblrmedia= document.createElement('table');
		maintblrmedia.id="rmediaheadertab";
		maintblrmedia.width="100%";
		maintblrmedia.cellSpacing=0;
		maintblrmedia.cellPadding=0;
		maintblrmedia.className="general";
		maintblrmedia.border=0;

		var rmediaheader= document.createElement('tr');
			//rmediaheader.className="tabHeader";
		var rmediaheadertd= document.createElement('td');
			rmediaheadertd.colSpan=2;
		var lblrmedia= document.createElement('label');
			lblrmedia.innerHTML="<h3>Remote Media</h3>";

		rmediaheadertd.appendChild(lblrmedia);
		rmediaheader.appendChild(rmediaheadertd);
		maintblrmedia.appendChild(rmediaheader);//first row of rmediaheadertab


		var trtab= document.createElement('tr');
		var trtabtd= document.createElement('td');
		trtabtd.colSpan=6;

		var tblMediaTypes= document.createElement('table');
			tblMediaTypes.width="100%";
			tblMediaTypes.id="rmediatypestab";
			tblMediaTypes.border=0;
			tblMediaTypes.cellSpacing=0;
			tblMediaTypes.cellPadding=0;

		var trtblMediaTypes= document.createElement('tr');
			var tdtblMediaTypes= document.createElement('td');
			tdtblMediaTypes.colSpan=2;

		trtblMediaTypes.appendChild(tdtblMediaTypes);
		tblMediaTypes.appendChild(trtblMediaTypes);

		trtabtd.appendChild(tblMediaTypes);// tab solpspan -6

		trtab.appendChild(trtabtd);

		var rmediatable= document.createElement('table');
			rmediatable.width="100%";
			rmediatable.cellSpacing=0;
			rmediatable.cellPadding=0;
			rmediatable.className="general";

		trantd.appendChild(maintblrmedia);

		maintblrmedia.appendChild(trtab);//second row of rmediaheadertab

		tran.appendChild(trantd);


		//row for RMedia
		var trrmediaenable = document.createElement('tr');
			var tdtrrmediacheck = document.createElement('td');
			var lblrmediaenable = document.createElement('label');
			lblrmediaenable.innerHTML=eLang.getString("common","STR_RMEDIA_ENABLE");

		tdtrrmediacheck.appendChild(lblrmediaenable);
		trrmediaenable.appendChild(tdtrrmediacheck);



		var tdrmediacheckbox = document.createElement('td');
			var incheck= document.createElement('INPUT');
			incheck.type="checkbox";
			incheck.id="chkRMediaEnable";
		tdrmediacheckbox.appendChild(incheck);
			var lblenable = document.createElement('label');
			lblenable.innerHTML="Enable";
		tdrmediacheckbox.appendChild(lblenable);


		trrmediaenable.appendChild(tdrmediacheckbox);
		rmediatable.appendChild(trrmediaenable);

		var trrmediacheckbox = document.createElement('tr');
			trrmediacheckbox.id = "trMtypeChecks";

		var td = document.createElement('td');
			td.width = "40%";
			td.className = "undefined_left";
			var lbl2 = document.createElement('label');
			lbl2.innerHTML = eLang.getString("common","STR_RMEDIA_TYPE");

		td.appendChild(lbl2);
		trrmediacheckbox.appendChild(td);

		var td1 = document.createElement('td');
		for (i = 0; i < strRMediaType.length; i++) {
			var sinput = document.createElement('input');
			sinput.type = "checkbox";
			sinput.disabled = true;
			sinput.id ="chk"+ strRMediaType[i];
			sinput.onclick = EnableMediaTypes;
			var lbl = document.createElement('label');
			lbl.innerHTML = strRMediaType[i];
			td1.appendChild(sinput);
			td1.appendChild(lbl);
		}

		trrmediacheckbox.appendChild(td1);
		rmediatable.appendChild(trrmediacheckbox);
		tdtblMediaTypes.appendChild(rmediatable);

		frm.tBdyObj.appendChild(tran);

		var configheaders = [
							eLang.getString("common","STR_SERVER_ADDRESS"),
							eLang.getString("common","STR_SOURCE_PATH"),
							eLang.getString("common","STR_SHARE_TYPE"),
							eLang.getString("common", "STR_USERNAME"),
							eLang.getString("common","STR_PASSWORD"),
							eLang.getString("common","STR_DOMAINNAME")
							 ];

		var allSettings=false;
		for (i = 0; i < strRMediaType.length; i++) {
			var trtype = document.createElement('tr');
			trtype.id ="trchk"+ strRMediaType[i];
			trtype.style.display = "none";

			var txtboxes=trrmediacheckbox.getElementsByTagName("INPUT");
			if(txtboxes.length > 0) txtboxes[i].disabled=false;

			if(MEDIA_CFG_CD.IP_ADDR == "" && 
					MEDIA_CFG_Floppy.IP_ADDR== "" && 
					MEDIA_CFG_HD.IP_ADDR == "" && allSettings==false) {
			trtype.style.display = "none";
			txtboxes[i].checked= false;
			txtboxes[i].disabled= true;
			}else if(MEDIA_CFG_CD.START_MOUNT ==0 && MEDIA_CFG_Floppy.START_MOUNT ==0 && MEDIA_CFG_HD.START_MOUNT ==0){
				//do nothing
			}
			else if(CheckIsCDFloppySame() && CheckIsCDHDSame() && MEDIA_CFG_CD.RMEDIAENABLE==true){
				if(i==3) {
					trtype.style.display = "block";	
					AllMode=true;
				} else {
					trtype.style.display = "none";
				}
				txtboxes[0].checked= true;
				txtboxes[1].checked= true;
				txtboxes[2].checked= true;
				txtboxes[3].checked= true;
				
				txtboxes[0].disabled= true;
				txtboxes[1].disabled= true;
				txtboxes[2].disabled= true;
				txtboxes[3].disabled= false;
				allSettings=true;
			}else if(MEDIA_CFG_CD.RMEDIAENABLE==0 && allSettings==false) {
				trtype.style.display = "none";
				txtboxes[i].checked= false;
				txtboxes[i].disabled= true;
			} else if(MEDIA_CFG_CD.START_MOUNT ==1 && i==0 && allSettings==false) {
				trtype.style.display = "block";
				txtboxes[i].checked= true;
				txtboxes[i].disabled= false;
			}else if(MEDIA_CFG_Floppy.START_MOUNT ==1 && i==1 && allSettings==false) {
				trtype.style.display = "block";
				txtboxes[i].checked= true;
				txtboxes[i].disabled= false;
			}else if(MEDIA_CFG_HD.START_MOUNT ==1 && i==2 && allSettings==false) {
				trtype.style.display = "block";
				txtboxes[i].checked= true;
				txtboxes[i].disabled= false;
			}
			
			var tdm = document.createElement('td');
			var tblmediatype = document.createElement('table');
				tblmediatype.className="general";
				tblmediatype.width = "100%";
				tblmediatype.cellSpacing = 0;
				tblmediatype.cellPadding = 1;
				tblmediatype.border = 0;
            //media type headers
			var header="";
			if(i==0) header= eLang.getString("common","STR_RMEDIA_CD_TYPE");
			else if(i==1)  header= eLang.getString("common","STR_RMEDIA_Floppy_TYPE");
			else if(i==2)  header= eLang.getString("common","STR_RMEDIA_Harddisk_TYPE");
			else if(i==3)  header= eLang.getString("common","STR_RMEDIA_ALL_TYPE");

			tblmediatype.appendChild(frm.createsettingHeader(header));

			//media type column headers
			tblmediatype.appendChild(frm.SettingColumnHeader(configheaders));

			//media type column controls
			var trcontrols = document.createElement('tr');

			var txtIPAddValue= (MEDIA_CFG[i] == undefined) ?
					((allSettings==false) ? "":MEDIA_CFG[0].IP_ADDR) 
					:(allSettings==true)? "": MEDIA_CFG[i].IP_ADDR;
			trcontrols.appendChild(frm.createinputcontrol("text", i, txtIPAddValue,"39",false));

			var txtSourcePath=(MEDIA_CFG[i] == undefined) ? 
					((allSettings==false) ? "" :MEDIA_CFG[0].SRC_PATH)
					:(allSettings==true)? "": MEDIA_CFG[i].SRC_PATH;
			trcontrols.appendChild(frm.createinputcontrol("text", i, txtSourcePath,"256",false));

			var SelShareType=(MEDIA_CFG[i] == undefined) ? 
					((allSettings==false) ? "" :MEDIA_CFG[0].SHR_TYPE)
					:(allSettings==true)? "": MEDIA_CFG[i].SHR_TYPE;
			trcontrols.appendChild(frm.createselectcontrol(i, SelShareType));
			
			var flag = (SelShareType == 1) ? false : true;

			var txtUName= (MEDIA_CFG[i] == undefined) ? 
					((allSettings==false) ? "" : MEDIA_CFG[0].UNAME):
					(allSettings==true)? "": MEDIA_CFG[i].UNAME;
			trcontrols.appendChild(frm.createinputcontrol("text", i, txtUName,"256",flag));

			trcontrols.appendChild(frm.createinputcontrol("password", i, "","32",flag));

			var txtDomainName=(MEDIA_CFG[i] == undefined) ? 
					((allSettings==false) ? "" : MEDIA_CFG[0].DOMAIN_NAME):
					(allSettings==true)? "": MEDIA_CFG[i].DOMAIN_NAME;
			trcontrols.appendChild(frm.createinputcontrol("text", i, txtDomainName,"256",flag));

			tblmediatype.appendChild(trcontrols);

			tdm.appendChild(tblmediatype);
			trtype.appendChild(tdm);
			tblMediaTypes.appendChild(trtype);
		}
	}

	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common",
		"STR_SAVE"), validateMediaCfg));
	btnAry.push(createButton("btnCancel", eLang.getString("common",
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", "STR_MEDIA_ADV_TITLE"),
		frm.display(), btnAry);
	wnd.onclose = function (){
		getMediaCfg();
		AllMode=false;
		responseCount=0;
		responseSuccess=[];
		responseCD=[];
		responseFD=[];
		responseHD=[];
		IsDataModified=false;
		rmediarestart=0;
		IsCD=false;IsFD=false;IsHD=false;
		mStatus="0";
		if (varMediaType == CONST_LMEDIA) {
			getLMediaImages();
		}
		if (varMediaType == CONST_RMEDIA) {
			MOUNT_STATUS_CD="";
            MOUNT_STATUS_FD="";
            MOUNT_STATUS_HD="";
			getRMediaImages();
		}
	};

	chkRMediaEnable= document.getElementById("chkRMediaEnable");

	if (LMEDIA_SUPPORT && LMEDIA_LICENSE_SUPPORT) {
		chkLMediaEnable.checked = LMEDIA_ENABLE ? true : false;
	}

	if (RMEDIA_SUPPORT && RMEDIA_LICENSE_SUPPORT) {
		chkRMediaEnable.onclick = enableRMedia;
		//lstShrType.onchange = doShareType;
		chkRMediaEnable.checked = RMEDIA_ENABLE ? true : false;
		//enableRMedia();
	}

	if (LMEDIA_SUPPORT && !RMEDIA_ENABLE && LMEDIA_LICENSE_SUPPORT) {
		chkLMediaEnable.focus();
	} else {
		if(RMEDIA_LICENSE_SUPPORT){
			chkRMediaEnable.focus();
		}
	}
	if(!top.user.isAdmin()) {
		disableActions({id:["_btnAdvSettings", "_btnCancel"]});
	}

	if(RMEDIA_LICENSE_SUPPORT){
		var trcheckes = document.getElementById("trMtypeChecks");
		var checkboxes = trcheckes.getElementsByTagName("INPUT");

		for(i=0;i< checkboxes.length;i++) {
			var rowname = "tr" + checkboxes[i].id;
			if(checkboxes[i].checked==true) {
				var rowid = document.getElementById(rowname);
				if(rowid.style.display=="block") {
					var selShareType = rowid.getElementsByTagName("SELECT")[0];
					var td = selShareType.parentNode.parentNode;
					var txt = td.getElementsByTagName("INPUT");
					doShareType(txt,selShareType);
				}
			}
		}
	}	
}

function CheckIsCDFloppySame() {
	var isFound=false;
	if ((MEDIA_CFG_CD.IP_ADDR == MEDIA_CFG_Floppy.IP_ADDR) &&
			(MEDIA_CFG_CD.SRC_PATH == MEDIA_CFG_Floppy.SRC_PATH) &&
			(MEDIA_CFG_CD.SHR_TYPE == MEDIA_CFG_Floppy.SHR_TYPE) &&
			(MEDIA_CFG_CD.UNAME == MEDIA_CFG_Floppy.UNAME) &&
			(MEDIA_CFG_CD.PWORD == MEDIA_CFG_Floppy.PWORD) &&
			(MEDIA_CFG_CD.DOMAIN_NAME == MEDIA_CFG_Floppy.DOMAIN_NAME)&&
			(MEDIA_CFG_CD.START_MOUNT == MEDIA_CFG_Floppy.START_MOUNT)) {
		isFound=true;
	}
	return isFound;
}

function CheckIsCDHDSame() {
	var isFound=false;
	if ((MEDIA_CFG_CD.IP_ADDR == MEDIA_CFG_HD.IP_ADDR) &&
			(MEDIA_CFG_CD.SRC_PATH == MEDIA_CFG_HD.SRC_PATH) &&
			(MEDIA_CFG_CD.SHR_TYPE == MEDIA_CFG_HD.SHR_TYPE) &&
			(MEDIA_CFG_CD.UNAME == MEDIA_CFG_HD.UNAME) &&
			(MEDIA_CFG_CD.PWORD == MEDIA_CFG_HD.PWORD) &&
			(MEDIA_CFG_CD.DOMAIN_NAME == MEDIA_CFG_HD.DOMAIN_NAME) &&
			(MEDIA_CFG_CD.START_MOUNT == MEDIA_CFG_HD.START_MOUNT)) {
		isFound=true;
	}
	return isFound;
}


function EnableMediaTypes() {
	var chk = this;
	if(chk.id == undefined) return;
	var trname = "tr" + chk.id;

	var rowdata = document.getElementById(trname);
	var txt=rowdata.getElementsByTagName("INPUT");
	var selshareType=rowdata.getElementsByTagName("SELECT")[0];

	if (chk.checked == true) {
		document.getElementById(trname).style.display = "block";
	} else {
		document.getElementById(trname).style.display = "none";
	}

	if (chk.checked == true && chk.id.replace("chk","") == strRMediaType[3]) {
		document.getElementById("chk" + strRMediaType[0]).checked = true;
		document.getElementById("chk" + strRMediaType[1]).checked = true;
		document.getElementById("chk" + strRMediaType[2]).checked = true;

		document.getElementById("chk" + strRMediaType[0]).disabled = true;
		document.getElementById("chk" + strRMediaType[1]).disabled = true;
		document.getElementById("chk" + strRMediaType[2]).disabled = true;

		var trcheckes = document.getElementById("trMtypeChecks");
		var checkboxes= trcheckes.getElementsByTagName("INPUT");
		for(i=0;i<checkboxes.length-1;i++) {
			var rowname= "tr"+ trcheckes.getElementsByTagName("INPUT")[i].id;
			document.getElementById(rowname).style.display="none";
		}

		if(CheckIsCDFloppySame() && CheckIsCDHDSame()) {
			if(txt.length > 0) {
				txt[0].value= MEDIA_CFG_CD.IP_ADDR;
				txt[1].value= MEDIA_CFG_CD.SRC_PATH;
				selshareType.value = MEDIA_CFG_CD.SHR_TYPE;
				txt[2].value= MEDIA_CFG_CD.UNAME;
				txt[4].value= MEDIA_CFG_CD.DOMAIN_NAME;
				doShareType(txt,selshareType);
			}
		}
		
	}else if(chk.checked == false && chk.id.replace("chk","") == strRMediaType[3]) {
		
		document.getElementById("chk" + strRMediaType[0]).checked = false;
		document.getElementById("chk" + strRMediaType[1]).checked = false;
		document.getElementById("chk" + strRMediaType[2]).checked = false;

		document.getElementById("chk" + strRMediaType[0]).disabled = false;
		document.getElementById("chk" + strRMediaType[1]).disabled = false;
		document.getElementById("chk" + strRMediaType[2]).disabled = false;
	}

	if(AllMode==true) {
		if(txt.length > 0) {
			txt[0].value= MEDIA_CFG_CD.IP_ADDR;
			txt[1].value= MEDIA_CFG_CD.SRC_PATH;
			selshareType.value = MEDIA_CFG_CD.SHR_TYPE;
			txt[2].value= MEDIA_CFG_CD.UNAME;
			txt[4].value= MEDIA_CFG_CD.DOMAIN_NAME;
			doShareType(txt,selshareType);
		}
	}
	IsDataModified=true;
}

function CheckDataModified() {
IsDataModified=true;	
}

function ChangeShareType() {
	var sharetypeselect = this;
	if(sharetypeselect== undefined) return;
	var td = sharetypeselect.parentNode.parentNode;
	var txt = td.getElementsByTagName("INPUT");
	doShareType(txt,sharetypeselect);
	IsDataModified=true;
}

/*
 * This will enable or disable the user authentication controls based on 
 * share type. Samba(CIFS) requires user authentication details.
 */
function doShareType(txt,sel) {
	var opt;
	opt = ((top.CONSTANTS.SHRTYPE_NFS == sel.value) ||
		(sel.disabled));
	txt[2].disabled = opt;
	txt[3].disabled = opt;
	txt[4].disabled = opt;
}

/*
 * This will enable or disable the remote media UI controls based on local 
 * media enable support check box value.
 */
function enableRMedia() {
	var trcheckes = document.getElementById("trMtypeChecks");
	var count = trcheckes.getElementsByTagName("INPUT");

	if (chkRMediaEnable.checked == true) {
		for (i = 0; i < count.length; i++) {
			trcheckes.getElementsByTagName("INPUT")[i].disabled = false;
		}
	}else {
		for (i = 0; i < count.length; i++) {
			trcheckes.getElementsByTagName("INPUT")[i].disabled = true;
			trcheckes.getElementsByTagName("INPUT")[i].checked = false;
			var rowname= "tr"+ trcheckes.getElementsByTagName("INPUT")[i].id;
			document.getElementById(rowname).style.display="none";
		}
	}
	IsDataModified=true;
}
/*
 * It will validate the advanced media configuration data before saving it.
 */
function validateMediaCfg() {
	if(IsDataModified && RMEDIA_LICENSE_SUPPORT) {
		if (chkRMediaEnable.checked == true) {
			var tcheckes = document.getElementById("trMtypeChecks");
			var checkboxes = tcheckes.getElementsByTagName("INPUT");
			var rowname;
			var allRow;
			if(checkboxes[0].checked== false && checkboxes[1].checked==false && checkboxes[2].checked== false) {
				alert(eLang.getString("common", "STR_RMEDIA_TYPE_SELECT"));
				return;
			}
			for(i=0;i< checkboxes.length;i++) {
				var changeFlag = "false";
				if(checkboxes[3].checked == true && checkboxes[3].disabled == false){
					rowname = "tr" + checkboxes[3].id;
					allRow = document.getElementById(rowname);
					var txt = allRow.getElementsByTagName("INPUT");
					var selShareType = allRow.getElementsByTagName("SELECT")[0];
					var txtServerIP = txt[0];
					var txtSrcPath = txt[1];
					var txtUname = txt[2];
					var txtPword = txt[3];
					var txtDomainName = txt[4];
					if ((!eVal.ip(txtServerIP.value)) &&
							(!eVal.ipv6(txtServerIP.value, true, false))) {
						alert(eLang.getString("common", "STR_INVALID_SERVERADDR") +
								eLang.getString("common", "STR_HELP_INFO"));
						txtServerIP.focus();
						return;
					}
					if (!eVal.isblank(txtServerIP.value)) {
						if(txtServerIP.value != MEDIA_CFG_CD.IP_ADDR && changeFlag == "false" ){
							changeFlag = "true";
						}
					}
					if (eVal.isblank(txtSrcPath.value)) {
						alert(eLang.getString("common", "STR_INVALID_SRC_PATH") +
								eLang.getString("common", "STR_HELP_INFO"));
						txtSrcPath.focus();
						return;
					}
					if(!eVal.isblank(txtSrcPath.value)){
						if(txtSrcPath.value != MEDIA_CFG_CD.SRC_PATH && changeFlag == "false" ){
							changeFlag = "true";
						}
					}
					if (top.CONSTANTS.SHRTYPE_CIFS == selShareType.value) {
						if (!eVal.username(txtUname.value, "", 1, 256)) {
							alert(eLang.getString("common", "STR_INVALID_USERNAME") +
									eLang.getString("common", "STR_HELP_INFO"));
							txtUname.focus();
							return;
						}
						if (!eVal.isblank(txtUname.value)) {
							if(txtUname.value != MEDIA_CFG_CD.UNAME && changeFlag == "false" ){
								changeFlag = "true";
							}
						}
						
						if (!(eVal.isblank(txtDomainName.value)) && 
								eVal.trim(txtDomainName.value)) {
							if (!eVal.domainname(txtDomainName.value, true)) {
								alert (eLang.getString("common", "STR_INVALID_DOMAIN") +
										eLang.getString("common", "STR_HELP_INFO"));
								txtDomainName.focus();
								return;
							}
							if(MEDIA_CFG_CD.DOMAIN_NAME  !=  txtDomainName.value && changeFlag == "false" ){
								changeFlag = "true";
							}
						}
						
						if(changeFlag == "true"){
							if (!eVal.password(txtPword.value, 1, 32)) {
								alert(eLang.getString("common", "STR_INVALID_PASSWORD") +
										eLang.getString("common", "STR_HELP_INFO"));
								txtPword.focus();
								return;
							}
						}
					}
				}else if (checkboxes[i].checked == true && checkboxes[i].disabled == false) {
					rowname = "tr" + checkboxes[i].id;
					allRow = document.getElementById(rowname);

					var txt = allRow.getElementsByTagName("INPUT");
					var selShareType = allRow.getElementsByTagName("SELECT")[0];

					var txtServerIP = txt[0];
					var txtSrcPath = txt[1];
					var txtUname = txt[2];
					var txtPword = txt[3];
					var txtDomainName = txt[4];
					
					if ((!eVal.ip(txtServerIP.value)) &&
							(!eVal.ipv6(txtServerIP.value, true, false))) {
						alert(eLang.getString("common", "STR_INVALID_SERVERADDR") +
								eLang.getString("common", "STR_HELP_INFO"));
						txtServerIP.focus();
						return;
					}
					if (!eVal.isblank(txtServerIP.value)) {
						if(txtServerIP.value != MEDIA_CFG[i].IP_ADDR && changeFlag == "false" ){
							changeFlag = "true";
						}
					}
					if (eVal.isblank(txtSrcPath.value)) {
						alert(eLang.getString("common", "STR_INVALID_SRC_PATH") +
								eLang.getString("common", "STR_HELP_INFO"));
						txtSrcPath.focus();
						return;
					}
					if(!eVal.isblank(txtSrcPath.value)){
						if(txtSrcPath.value != MEDIA_CFG[i].SRC_PATH && changeFlag == "false" ){
							changeFlag = "true";
						}
					}
					if (top.CONSTANTS.SHRTYPE_CIFS == selShareType.value) {
						if (!eVal.username(txtUname.value, "", 1, 256)) {
							alert(eLang.getString("common", "STR_INVALID_USERNAME") +
									eLang.getString("common", "STR_HELP_INFO"));
							txtUname.focus();
							return;
						}
						if (!eVal.isblank(txtUname.value)) {
							if(txtUname.value != MEDIA_CFG[i].UNAME && changeFlag == "false" ){
								changeFlag = "true";
							}
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
						
						if(MEDIA_CFG[i].DOMAIN_NAME  !=  txtDomainName.value && changeFlag == "false" ){
							changeFlag = "true";
						}
						
						if(changeFlag == "true"){
							if (!eVal.password(txtPword.value, 1, 32)) {
								alert(eLang.getString("common", "STR_INVALID_PASSWORD") +
										eLang.getString("common", "STR_HELP_INFO"));
								txtPword.focus();
								return;
							}
						}
					}
				}
			}
		}
	}
	setMediaCfg();
}


var mediaValues;
var clearCallStatus = '';
function isRedirectRMediaImages() {
	xmit.get({url:"/rpc/getrmediacfg.asp", onrcv:isRedirectRMediaImagesRes, status:""});
}

function isRedirectRMediaImagesRes(){
	var lMedia_check = '0';
	if(LMEDIA_LICENSE_SUPPORT){
		lMedia_check = chkLMediaEnable.checked ? '1' : '0';
	}
	mediaValues = WEBVAR_JSONVAR_GETRMEDIACFG.WEBVAR_STRUCTNAME_GETRMEDIACFG;
	
	if(mediaValues.length > 0)
	{
		if(lMedia_check != LMEDIA_ENABLE) {
			var i=0;
			for(i=0;i<mediaValues.length;i++){
				if(mediaValues[i].IMAGE_REDIRECT == 1) {
					clearCallStatus = false;
					break;
				}
				else{
					clearCallStatus = true;
					continue;
				}
			}
			
			if(clearCallStatus == true) {
				clearCallStatus = '';
				setRMediasTypeConfig();
			}
			else{
				clearCallStatus = '';
				alert (eLang.getString("common", "STR_RMEDIA_LMEDIA_CONF_REDIRECT_STATUS_ERROR"));
				closeForm();
			}
		}
		else
		{
			setRMediasTypeConfig();
		}
	}
	else
	{
		setRMediasTypeConfig();
	}
} 

function setRMediasTypeConfig()
{
	var trcheckes = document.getElementById("trMtypeChecks");
	var checkboxes = trcheckes.getElementsByTagName("INPUT");
	if(checkboxes[3].checked==true) {
		mStatus= RMediaTypeStatus.All;
		rmediarestart=1;
		/*if (validateDataChanges(checkboxes[3], MEDIA_CFG_CD)){
			SetMediaConfigurations(checkboxes[3],mStatus,rmediarestart);	
		} else
    {
       SetMediaConfigurations(chkLMediaEnable,"0",2);
    }*/
		SetMediaConfigurations(checkboxes[3],mStatus,rmediarestart);
	}else	
	if(checkboxes[0].checked==false && (MEDIA_CFG_CD.START_MOUNT==1 || MEDIA_CFG_CD.START_MOUNT==0)){
		callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 0);
	} else if(checkboxes[0].checked==true && MEDIA_CFG_CD.START_MOUNT==0){
		IsCD=true;
		callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 1);
	}else if (validateDataChanges(checkboxes[0], MEDIA_CFG_CD)){
		IsCD=true;
		callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 1);
	} else
	if(checkboxes[1].checked==false && (MEDIA_CFG_Floppy.START_MOUNT==1 || MEDIA_CFG_Floppy.START_MOUNT==0)){
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 0);
	}else if(checkboxes[1].checked==true && MEDIA_CFG_Floppy.START_MOUNT==0){
		IsFD=true;
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD,1);
	}else if (validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)) {
		IsFD=true;
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD,1);
  	}else
	 if(checkboxes[2].checked==false && (MEDIA_CFG_HD.START_MOUNT==1 || MEDIA_CFG_HD.START_MOUNT==0)){
		 callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0);
	} else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
	}else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
  	}else {
	   SetMediaConfigurations(chkLMediaEnable,"0",2);
    }
	
	/*if(checkboxes[0].checked==true){
		IsCD=true;
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_CD;
		if(checkboxes[0].checked==true && MEDIA_CFG_CD.START_MOUNT==0){
			callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 1);
		}else if (validateDataChanges(checkboxes[0], MEDIA_CFG_CD)) {
  			rmediarestart = 1;
  			callCD(checkboxes[0], mStatus, rmediarestart);
  		} else if(checkboxes[1].checked==false && MEDIA_CFG_Floppy.START_MOUNT==1){
			callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 0)
		} else if(checkboxes[1].checked==true && MEDIA_CFG_Floppy.START_MOUNT==0){
			callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 1)
		}else if(validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)){
			callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 1)
		}else if(validateDataChanges(checkboxes[2], MEDIA_CFG_HD)){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1)
		}else if(checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0)
		} else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1)
		}else {
	       SetMediaConfigurations(chkLMediaEnable,"0",2);
	    }
	} else if(checkboxes[1].checked==true){
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_FD;
		if(checkboxes[0].checked==false && MEDIA_CFG_CD.START_MOUNT==1){
			callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 0)
		}  else if (validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)) {
  			rmediarestart = 1;
  			callFD(checkboxes[1], mStatus, rmediarestart);
  		} else if (checkboxes[1].checked==true && MEDIA_CFG_Floppy.START_MOUNT==0) {
  			rmediarestart = 1;
  			callFD(checkboxes[1], mStatus, rmediarestart);
  		} else if(checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0)
		}else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
		}else {
	       SetMediaConfigurations(chkLMediaEnable,"0",2);
	    }
	} else if(checkboxes[2].checked==true){
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_HD;
		if(checkboxes[0].checked==false && MEDIA_CFG_CD.START_MOUNT==1){
			callCD(checkboxes[0], RMediaTypeStatus.IMAGE_TYPE_STR_CD, 0)
		} else if(checkboxes[1].checked==false && MEDIA_CFG_Floppy.START_MOUNT==1){
			callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 0)
		} else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
  			rmediarestart = 1;
  			callHD(checkboxes[2], mStatus, rmediarestart);
  		} /*else {
  			callHD(checkboxes[2], mStatus, 0);
  		}
		else {
	       SetMediaConfigurations(chkLMediaEnable,"0",2);
	    }

	}*/
	
	
	
	/*else if(checkboxes[0].checked==true && checkboxes[1].checked==true){
		clearRMediaRes();
		//xmit.get({url:"/rpc/clearrmedia.asp", onrcv:clearRMediaRes, status:"" });	
	}else if(checkboxes[1].checked==true && checkboxes[2].checked==true){
		clearRMediaRes();
		//xmit.get({url:"/rpc/clearrmedia.asp", onrcv:clearRMediaRes, status:"" });	
	}else if(checkboxes[0].checked==true && checkboxes[2].checked==true){
		clearRMediaRes();
		//xmit.get({url:"/rpc/clearrmedia.asp", onrcv:clearRMediaRes, status:"" });	
	}else if(checkboxes[0].checked==true && checkboxes[1].checked==true && checkboxes[2].checked==true){
		IsCD=true;
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_CD;
		rmediarestart=0;
		if (validateDataChanges(checkboxes[0], MEDIA_CFG_CD)) {
  			rmediarestart = 1;
  			callCD(checkboxes[0], mStatus, rmediarestart);
  		} /*else {
  			callCD(checkboxes[0], mStatus, 2);
  		}
		//callCD(checkboxes[0],mStatus,rmediarestart);
	}else if(checkboxes[0].checked==true || checkboxes[1].checked==true || checkboxes[2].checked==true){
		clearRMediaRes();
		//xmit.get({url:"/rpc/clearrmedia.asp", onrcv:clearRMediaRes, status:"" });
	}*/
} 

/*
 * It will invoke the RPC method to set the advanced media configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setMediaCfg() {
	if (confirm(eLang.getString("common", "STR_MEDIA_CFG_CONFIRM"))) {
		/*var trcheckes = document.getElementById("trMtypeChecks");
		var checkboxes = trcheckes.getElementsByTagName("INPUT");*/

		if(LMEDIA_LICENSE_SUPPORT && RMEDIA_LICENSE_SUPPORT){
			if(chkLMediaEnable.checked==true && chkRMediaEnable.checked==false) {
				SetMediaConfigurations(chkLMediaEnable,"0",0);
			}else if(chkLMediaEnable.checked==false && chkRMediaEnable.checked==false) {
				SetMediaConfigurations(chkLMediaEnable,"0",0);
			} else if(chkRMediaEnable.checked==true) {
				isRedirectRMediaImages();
			}
		}
		else if(LMEDIA_LICENSE_SUPPORT){
			SetMediaConfigurations(chkLMediaEnable,"0",0);
		}
		else{
			if(RMEDIA_LICENSE_SUPPORT){
				if(chkRMediaEnable.checked==true){ 
					isRedirectRMediaImages();
				}
			}
		}
		
	}
}

function clearRMediaRes()
{	
	var trcheckes = document.getElementById("trMtypeChecks");
	var checkboxes = trcheckes.getElementsByTagName("INPUT");

	/*if (arg.HAPI_STATUS) {
		alert(eLang.getString("common", "STR_MEDIA_CFG_CLEAR_ERROR"));
	} else*/
	
	if(checkboxes[0].checked==true) {
			IsCD=true;
			mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_CD;
			if(checkboxes[1].checked == false && checkboxes[2].checked == false) 
				rmediarestart=1;
			else 
				rmediarestart=0;
			if (validateDataChanges(checkboxes[0], MEDIA_CFG_CD)) {
	  			rmediarestart = 1;
	  			callCD(checkboxes[0], mStatus, rmediarestart);
	  		} /*else {
	  			callCD(checkboxes[0], mStatus, 2);
	  		}*/
	}  if(checkboxes[1].checked==true) {
			mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_FD;

			if(checkboxes[0].checked == false && checkboxes[2].checked == false) 
				rmediarestart=1;
			else if(IsCD==true && checkboxes[2].checked==false) 
				rmediarestart=1;
			else 
				rmediarestart=0;
			IsFD=true;
			if (validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)) {
	  			rmediarestart = 1;
	  			callFD(checkboxes[1], mStatus, rmediarestart);
	  		} /*else {
	  			callFD(checkboxes[1], mStatus, 2);
	  		}*/
	}  if(checkboxes[2].checked==true) {
			mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_HD;

			if(checkboxes[0].checked == false && checkboxes[1].checked == false) 
				rmediarestart=1;
			else if(IsCD==true && IsFD==true)
				rmediarestart=1;
			else if(IsCD==true && checkboxes[1].checked==false)
				rmediarestart=1;
			else if(IsFD==true && checkboxes[0].checked==false)
				rmediarestart=1;
			else
				rmediarestart=0;
			IsHD=true;
			if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
	  			rmediarestart = 1;
	  			callHD(checkboxes[2], mStatus, rmediarestart);
	  		} /*else {
	  			callFD(checkboxes[2], mStatus, 2);
	  		}*/
	}
}


function validateDataChanges(chkbox, obj) {
  	var rowname = "tr" + chkbox.id;
  	var isFound = true;
  	var allRow = document.getElementById(rowname);
  	var txt = allRow.getElementsByTagName("INPUT");
  	var sele = allRow.getElementsByTagName("SELECT");
  	txtipAddress = txt[0].value;
  	txtSrcPath = txt[1].value;
  	txtShareType = sele[0].value;
  	txtUname = txt[2].value;
  	txtPword = txt[3].value;
  	txtDName = txt[4].value;

  	if ((obj.IP_ADDR == txtipAddress) &&
  		(obj.SRC_PATH == txtSrcPath) &&
  		(obj.SHR_TYPE == txtShareType) &&
  		(obj.UNAME == txtUname) &&
  		(obj.PWORD == txtPword) &&
  		(obj.DOMAIN_NAME == txtDName)) {
  		isFound = false;
  }
  return isFound;
}

function callCD(chkbox,rmediaStatus,rmediarestart) {
	var req;//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setmediacfg.asp", 
		onrcv:setMediaCfgCDRes, status:""});
	setMediaCfgData(req,chkbox,rmediaStatus,rmediarestart);
}

function setMediaCfgCDRes(arg) {
	var trcheckes = document.getElementById("trMtypeChecks");
	var checkboxes = trcheckes.getElementsByTagName("INPUT");

	/*if(IsCD==true && arg.HAPI_STATUS !=0 && responseCount==1) {
		setMediaResponse(arg,responseCD);
	} else*/
	if(arg.HAPI_STATUS==0) {
		responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_CD_SUCCESS"));
	}
	
	/*if(checkboxes[1].checked==true || (checkboxes[1].checked==false && MEDIA_CFG_Floppy.START_MOUNT==1)) {
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_FD;

		/*if(checkboxes[0].checked == false && checkboxes[2].checked == false) 
			rmediarestart=1;
		else if(IsCD==true && checkboxes[2].checked==false) 
			rmediarestart=1;
		else 
			rmediarestart=0;
		IsFD=true;
		if((checkboxes[1].checked==false && MEDIA_CFG_Floppy.START_MOUNT==1)){
 			callFD(checkboxes[1], mStatus, 0);
 		}else if (validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)) {
 			rmediarestart=1;
 			callFD(checkboxes[1], mStatus, rmediarestart);
 		} else if(validateDataChanges(checkboxes[2], MEDIA_CFG_HD)){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1)
		} else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1)
		} else if(checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1){
			callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0)
		} else{
 			alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
 			closeForm();
 		}
	} else if(checkboxes[2].checked==true || (checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1)) {
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_HD;

		if(checkboxes[0].checked == false && checkboxes[1].checked == false) 
			rmediarestart=1;
		else if(IsCD==true && IsFD==true)
			rmediarestart=1;
		else if(IsCD==true && checkboxes[1].checked==false) 
			rmediarestart=1;
		else if(IsFD==true && checkboxes[0].checked==false)
			rmediarestart=1;
		else
			rmediarestart=0;
		if((checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1)){
			callHD(checkboxes[2], mStatus, 0);
 		}else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
 			rmediarestart=1;
 			callHD(checkboxes[2], mStatus, rmediarestart);
 		} else{
 			alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
 			closeForm();
 		}
		//callHD(checkboxes[2],mStatus,rmediarestart);
	}*/
	if(checkboxes[1].checked==false && (MEDIA_CFG_Floppy.START_MOUNT==1 || MEDIA_CFG_Floppy.START_MOUNT==0)){
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD, 0);
	}else if(checkboxes[1].checked==true && MEDIA_CFG_Floppy.START_MOUNT==0){
		IsFD=true;
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD,1);
	}else if (validateDataChanges(checkboxes[1], MEDIA_CFG_Floppy)) {
		IsFD=true;
		callFD(checkboxes[1], RMediaTypeStatus.IMAGE_TYPE_STR_FD,1);
 	}else
	if(checkboxes[2].checked==false && (MEDIA_CFG_HD.START_MOUNT==1 || MEDIA_CFG_HD.START_MOUNT==0)){
		 callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0);
	} else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
	}else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
 	}
	else	 
	if(IsCD==true){
		alert(eLang.getString("common", "STR_MEDIA_CFG_CD_SUCCESS"));
		closeForm();
	}
}

function callFD(chkbox,rmediaStatus,rmediarestart) {
	var req;//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setmediacfg.asp", 
		onrcv:setMediaCfgFDRes, status:""});
	setMediaCfgData(req,chkbox,rmediaStatus,rmediarestart);
}

function setMediaCfgFDRes(arg) {
	var trcheckes = document.getElementById("trMtypeChecks");
	var checkboxes = trcheckes.getElementsByTagName("INPUT");

	/*if(IsFD==true && arg.HAPI_STATUS !=0 && responseCount==1) {
		setMediaResponse(arg,responseFD);
	} else*/
	if(arg.HAPI_STATUS==0) {
		responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_FD_SUCCESS"));
	}

	/*if(checkboxes[2].checked==true || (checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1)) {
		mStatus= RMediaTypeStatus.IMAGE_TYPE_STR_HD;

		/*if(checkboxes[0].checked == false && checkboxes[1].checked == false) 
			rmediarestart=1;
		else if(IsCD==true && IsFD==true)
			rmediarestart=1;
		else if(IsCD==true && checkboxes[1].checked==false) 
			rmediarestart=1;
		else if(IsFD==true && checkboxes[0].checked==false)
			rmediarestart=1;
		else
			rmediarestart=0;
		if((checkboxes[2].checked==false && MEDIA_CFG_HD.START_MOUNT==1)){
			callHD(checkboxes[2], mStatus, 0);
 		}else if((checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0)){
			callHD(checkboxes[2], mStatus, 1);
 		}else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
 			rmediarestart=1;
 			callHD(checkboxes[2], mStatus, rmediarestart);
 		} else{
 			alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
 			closeForm();
 		}
	}*/
	if(checkboxes[2].checked==false && (MEDIA_CFG_HD.START_MOUNT==1 || MEDIA_CFG_HD.START_MOUNT==0)){
		 callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 0);
	} else if(checkboxes[2].checked==true && MEDIA_CFG_HD.START_MOUNT==0){
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
	}else if (validateDataChanges(checkboxes[2], MEDIA_CFG_HD)) {
		IsHD=true;
		callHD(checkboxes[2], RMediaTypeStatus.IMAGE_TYPE_STR_HD, 1);
 	}else
	if(IsFD==true && IsCD==true){
		alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
		closeForm();
	}else if(IsFD==true){
		alert(eLang.getString("common", "STR_MEDIA_CFG_FD_SUCCESS"));
		closeForm();
	} else 	if(responseCount==1) {
			var res="";
			if(responseSuccess.length > 0) {
				res=responseSuccess.pop();
			}
			if(responseCD.length > 0) {
				res+=strRMediaType[0] +" - "+ responseCD.pop() + "\n"; 
			}
			if(responseFD.length > 0) {
				res+= strRMediaType[1] +" - "+ responseFD.pop() + "\n"; 
			} if(responseHD.length > 0) {
				res+= strRMediaType[2] +" - "+ responseHD.pop();
			}
			alert(res);
			closeForm();
	}else{
 		alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
 		closeForm();
 	}
}

function callHD(chkbox,rmediaStatus,rmediarestart) {
	var req;//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setmediacfg.asp", 
		onrcv:setMediaCfgFinalRes, status:""});
	setMediaCfgData(req,chkbox,rmediaStatus,rmediarestart);
}

function setMediaCfgFinalRes(arg) {
	//call final response
	/*if(IsHD==true && arg.HAPI_STATUS !=0 && responseCount==1) {
		setMediaResponse(arg,responseHD);
	} else*/
	if(arg.HAPI_STATUS==0) {
		if(IsCD==true && IsFD==true)
			responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
		if(IsFD==true && IsHD==true)
			responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
		if(IsHD==true)
			responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_HD_SUCCESS"));
		else
			responseSuccess.push(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
	}
	if(responseCount==1) {
		var res="";
		if(responseSuccess.length > 0) {
			res=responseSuccess.pop();
		} 
		if(responseCD.length > 0) {
			res+=strRMediaType[0] +" - "+ responseCD.pop() + "\n"; 
		}
		if(responseFD.length > 0) {
			res+= strRMediaType[1] +" - "+ responseFD.pop() + "\n"; 
		} if(responseHD.length > 0) {
			res+= strRMediaType[2] +" - "+ responseHD.pop();
		}
		alert(res);
		closeForm();
	} else {
		alert(eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
		closeForm();
	}
}

function SetMediaConfigurations(chkbox,rmediaStatus,rmediarestart) {
	
	var req;//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setmediacfg.asp", 
		onrcv:setMediaCfgRes, status:""});
	setMediaCfgData(req,chkbox,rmediaStatus,rmediarestart);
}

function setMediaCfgData(req,chkbox,rmediaStatus,rmediarestart) {
	if (LMEDIA_SUPPORT && LMEDIA_LICENSE_SUPPORT) {
		req.add("LMEDIAENABLE", (chkLMediaEnable.checked) ? 1 : 0);
	}else {
		req.add("LMEDIAENABLE", 2);
	}

 if(rmediarestart !=2){
	if (RMEDIA_SUPPORT && RMEDIA_LICENSE_SUPPORT) {

		responseCount=rmediarestart;
		var txtipAddress="";txtSrcPath="";txtShareType="";
		var txtUname="";txtPword="";txtDName="";

		if(chkRMediaEnable.checked) {
			var rowname = "tr" + chkbox.id;

			var allRow = document.getElementById(rowname);
			var txt = allRow.getElementsByTagName("INPUT");
			var sele = allRow.getElementsByTagName("SELECT");
			txtipAddress=txt[0].value;
			txtSrcPath=txt[1].value;
			txtShareType=sele[0].value;
			txtUname=txt[2].value;
			txtPword=txt[3].value;
			txtDName=txt[4].value;
			
			if(AllMode==true && rmediarestart==0){
				txtipAddress=MEDIA_CFG_CD.IP_ADDR;
				txtSrcPath=MEDIA_CFG_CD.SRC_PATH;
				txtShareType=MEDIA_CFG_CD.SHR_TYPE;
				txtUname=MEDIA_CFG_CD.UNAME;
				//txtPword=MEDIA_CFG_CD.PWORD;
				txtDName=MEDIA_CFG_CD.DOMAIN_NAME;
			}
		}

		req.add("RMEDIAENABLE", (chkRMediaEnable.checked) ? 1 : 0);
		req.add("RMEDIA_TYPE",rmediaStatus);
		req.add("IP_ADDR", txtipAddress);
		req.add("SRC_PATH", txtSrcPath);
		req.add("SHR_TYPE", txtShareType);
		req.add("UNAME", txtUname);
		req.add("PWORD", txtPword);
		req.add("DOMAIN_NAME", txtDName);
		req.add("RMEDIARESTART", rmediarestart);
		}else {
     req.add("RMEDIAENABLE", 2);
    }
   }
 else{
		 req.add("RMEDIAENABLE", 2);
     }
	/*}else {
		req.add("RMEDIAENABLE", 2);
	}*/
		
	req.send();
	delete req;
}

/*
 * This is the response function for setMediaCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then set advanced media configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setMediaCfgRes(arg) {
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
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
		case 0X83:
			alert (eLang.getString("common", "STR_RMEDIA_LMEDIA_CONF_REDIRECT_STATUS_ERROR"));
			closeForm();
			break;
		default:
			errstr = eLang.getString("common", "STR_MEDIA_CFG_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
			break;
		}
	} else {
		alert (eLang.getString("common", "STR_MEDIA_CFG_SUCCESS"));
		closeForm();
	}
}

function setMediaResponse(arg,resType) {
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch (GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0xDF: case 0xE2: 
		case 0xE4: case 0x93:
			errstr = eLang.getString("common", "STR_INVALID_SERVERADDR");
			errstr += eLang.getString("common", "STR_HELP_INFO");
			resType.push(errstr);
		case 0x90:
			resType.push(eLang.getString("common", "STR_INVALID_SERVICE"));
		case 0x92: 
			resType.push(eLang.getString("common", "STR_INVALID_SHARE_TYPE"));
		case 0x96:
			resType.push(eLang.getString("common", "STR_INVALID_DOMAIN"));
		case 0x99:
			resType.push(eLang.getString("common", "STR_INVALID_USERNAME"));
		case 0x9A: 
			resType.push(eLang.getString("common", "STR_INVALID_PASSWORD"));			
		case 0xFC:
			resType.push(eLang.getString("common", "STR_VIDEO_CFG_MOUNT_ERROR"));
		case 0X83:
			alert (eLang.getString("common", "STR_RMEDIA_LMEDIA_CONF_REDIRECT_STATUS_ERROR"));
			closeForm();
			break;
		default:
			errstr = eLang.getString("common", "STR_MEDIA_CFG_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS));
			resType.push(errstr);
		}
	}
}
/*
 * This function is used to load the list grid and its header information.
 * Also initializes the list grid select and double click event handler.
 */
function loadCustomPageElements() {
	lgdImage.innerHTML = "";
	tblImage = listgrid({
		w : "100%",
		doAllowNoSelect : false
	});

	lgdImage.appendChild(tblImage.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_HASH"), fieldType:2, w:"5%",
			textAlign:"center"},
		{text:eLang.getString("common", "STR_MEDIA_IMGTYPE"), w:"15%",
			textAlign:"center"},
		{text:eLang.getString("common", "STR_MEDIA_IMGNAME"), w:"30%",
			textAlign:"center"},
		{text:eLang.getString("common", "STR_MEDIA_STATUS"), w:"30%",
			textAlign:"center"},
		{text:eLang.getString("common", "STR_MEDIA_SERVER_INSTANCE"), w:"20%",
			textAlign:"center"}
		]};

	tblImage.loadFromJson(tblJSON);

	/*
	 * This event handler will be invoked when the list grid row is selected.
	 */
	tblImage.ontableselect = function() {
		var imgname = "";		//Selected image name
		var mediaEnable;	//Used to hold the Lmedia/Rmedia enable status
		var redir_status;	//String to hold the media redirection status
		var redirectFlag = false;

		disableButtons();
		var rmediaTypeSelected = tblImage.getRow(tblImage.selected[0]).cells[1].innerHTML;
		if(rmediaTypeSelected.indexOf(IMAGE_TYPE_STR_CD) != -1){
			redirectFlag = MOUNT_STATUS_CD != "false" ? true : false;
		}else if(rmediaTypeSelected.indexOf(IMAGE_TYPE_STR_FD) != -1){
			redirectFlag = MOUNT_STATUS_FD != "false" ? true : false;
		}else if(rmediaTypeSelected.indexOf(IMAGE_TYPE_STR_HD) != -1){
			redirectFlag = MOUNT_STATUS_HD != "false" ? true : false;
		}
		
		if (varMediaType == CONST_LMEDIA) {
			mediaEnable = (LMEDIA_ENABLE && SDCardStatus);
		} else if (varMediaType == CONST_RMEDIA) {
			mediaEnable = (RMEDIA_ENABLE && redirectFlag);
		}

		if (mediaEnable && this.selected.length) {
			imgname = tblImage.getRow(tblImage.selected[0]).cells[2].innerHTML;
			imgname.replace("&nbsp;","").replace(" ","");
			redir_status = tblImage.getRow(tblImage.selected[0]).cells[3].innerHTML;
			redir_status.replace("&nbsp;","").replace(" ","");

			//btnAdd.disabled = false;
			btnAdd.disabled = changeButtonState(false); 
			if ((imgname != "~") && (redir_status == "~")) {
				btnStart.value = eLang.getString("common",
					"STR_MEDIA_START_REDIR");
				if (top.user.isVMedia()) {
					//btnStart.disabled = false;
					btnStart.disabled = changeButtonState(false);
					if (varMediaType == CONST_LMEDIA) {
						//btnDelete.disabled = false;
						btnDelete.disabled = changeButtonState(false);
					}
					btnStart.onclick = function (){ doStartRedirection(1);}
				}
			} else if ((imgname != "~") && (redir_status.indexOf(eLang.getString("common", 
				"STR_MEDIA_STATUS_STOP")) != -1)) {
				if (top.user.isVMedia()) {
					//btnDelete.disabled = false;
					btnDelete.disabled = changeButtonState(false);
					btnStart.onclick = function (){};
				}
			} else if (redir_status.indexOf(eLang.getString("common", 
				"STR_MEDIA_STATUS_START")) != -1) {
				btnStart.value = eLang.getString("common",
					"STR_MEDIA_STOP_REDIR");
				if (top.user.isVMedia()) {
					//btnStart.disabled = false;
					btnStart.disabled = changeButtonState(false);
					btnStart.onclick = function (){ doStartRedirection(0);}
				}
			} else {
				//btnStart.disabled = true;
				btnStart.disabled = changeButtonState(true);
				btnStart.value = eLang.getString("common",
					"STR_MEDIA_START_REDIR");
				btnStart.onclick = function (){};
			}
		}
	}
}

/*
 * This function is used to get the selected row index from the listgrid.
 * @Return index number, Selected row index.
 */
function getSelectedRowIndex() {
	var index;			//Index of the list grid

	index = tblImage.getRow(tblImage.selected[0]).cells[0].innerHTML;
	index.replace("&nbsp;","").replace(" ","");
	return index - 1;	//Selection starts from 0
}

/*
 * This function is used to assign the global RPC lmedia/rmedia data into global variable.
 */
function doMediaData() {
	if (varMediaType == CONST_LMEDIA) {
		MEDIA_DATA = LMEDIA_DATA; 
	} else if (varMediaType == CONST_RMEDIA) {
		MEDIA_DATA = RMEDIA_DATA;
	}
}

/*
 * It will used to get the selected image index from the listgrid.
 * @return imageIndex number, image index for the selected image
 */
function getSelectedImageIndex(index) {
	var imageIndex = "";	//Used to hold the selected image index
	var mediaType;			//Used to hold the media type
	var i;					//Loop counter

	doMediaData();
	for (i = 0; i < MEDIA_DATA.length; i++) {
		if (i == index) {
			if (MEDIA_DATA[i].IMAGE_REDIRECT) {
				imageIndex = MEDIA_DATA[i].IMAGE_TYPE_INDEX;
				} else {
				try {
					mediaType = getMediaTypeStr(MEDIA_DATA[i].IMAGE_TYPE);
					imageIndex = $("_lst" + mediaType + MEDIA_DATA[i].IMAGE_TYPE_INDEX).value;
				} catch(e) {
					alert(eLang.getString("common", "STR_MEDIA_REDIR_ERROR_1"));
				}
			}
			break;
		}
	}
	return imageIndex;
}

/*
 * It will used to get the selected image name from the listbox.
 * @param imageIndex number, selected image index.
 * @return imagename, selected image name from listbox.
 */
function getImageNameFromIndex(imageIndex) {
	var i = 0; //Loop counter
	var MEDIA_IMAGES;	//Variable to hold the Lmedia/Rmedia images names
	if (varMediaType == CONST_LMEDIA) {
		MEDIA_IMAGES = LMEDIA_IMAGES;
	} else if (varMediaType == CONST_RMEDIA) {
		MEDIA_IMAGES = RMEDIA_IMAGES;
	}

	for (i = 0 ; i < MEDIA_IMAGES.length; i++) {
		if (MEDIA_IMAGES[i].IMAGE_INDEX == imageIndex) {
			return MEDIA_IMAGES[i].IMAGE_NAME;
		}
	}
}

/*
 * It will used to delete/clear the selected image from the listbox.
 */
function fnMediaDeleteImage() {
	var redir_status = "";	//Used to hold the redirection field status	
	var index;				//Used to hold the selected row index

	redir_status = tblImage.getRow(tblImage.selected[0]).cells[3].innerHTML;
	redir_status.replace("&nbsp;","").replace(" ","");
	doMediaData();
	index = getSelectedRowIndex();

	if (redir_status != "~") {
		varImageOper = CONST_CLEAR_DATA;
		varImageType = MEDIA_DATA[index].IMAGE_TYPE;
		varImageIndex = MEDIA_DATA[index].IMAGE_TYPE_INDEX;
		varImageName = MEDIA_DATA[index].IMAGE_NAME;
	} else {
		if (varMediaType == CONST_LMEDIA) {
			varImageOper = top.CONSTANTS.DELETE;
			varImageType = MEDIA_DATA[index].IMAGE_TYPE;
			varImageIndex = getSelectedImageIndex(index);
			varImageName = getImageNameFromIndex(varImageIndex);
		} else {
			alert(eLang.getString("common", "STR_MEDIA_INVALID_OPERATION"));
			return;
		}
	}
	setMediaImage();
}

/*
 * It will invoke the RPC method to set the Media configurations.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function setMediaImage() {
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/setmediaimage.asp", 
		onrcv:setMediaImageRes, status:""});
	req.add("MEDIA_TYPE", varMediaType);
	req.add("IMAGE_OPER", varImageOper);
	req.add("IMAGE_TYPE", varImageType);
	if (varImageOper == top.CONSTANTS.ADD) {
		req.add("IMAGE_NAME", varImageName);
	} else {
		req.add("IMAGE_INDEX", varImageIndex);
		req.add("IMAGE_NAME", varImageName);
	}
	req.send();
	delete req;
}

/*
 * This is the response function for setMediaImage RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then Add/Delete Media configuration is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library
 */
function setMediaImageRes(arg) {
	var resStr;		//Response string

	if (arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		resStr = eLang.getString("common", "STR_MEDIA_IMG_SETVAL_" + varMediaType);
		resStr += eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS);
		alert(resStr);
	} else {
		resStr = eLang.getString("common", "STR_MEDIA_IMG_SUCCESS" + 
			varImageOper);
		alert(resStr);
		if (varMediaType == CONST_LMEDIA) {
			if (varImageOper == top.CONSTANTS.ADD) {
				closeForm();
			}
			getLMediaImages();
		} else {
			getRMediaImages();
		}
	}
}

/*
 * This will invoke either add or delete image method.
 * @param imageoper integer, Image operation. 1-Add, 3-Delete.
 */
function doProcessImage(imageoper) {
	var redir_status = "";		//Used to hold the redirection field status

	varImageOper = imageoper;
	switch(imageoper) {
		case top.CONSTANTS.ADD:
			if (varMediaType == CONST_LMEDIA) {
				frmLMediaAddImage();
			} else if (varMediaType == CONST_RMEDIA) {
				alert(eLang.getString("common", 
					"STR_MEDIA_INVALID_OPERATION"));
				return;
			}
			break;
		case top.CONSTANTS.DELETE:
			if (confirm(eLang.getString("common", "STR_CONFIRM_DELETE"))) {
				fnMediaDeleteImage();
			}
			break;
	}
}

/*
 * It will disable the buttons.
 */
function disableButtons() {
	/*btnAdd.disabled = true;
	btnStart.disabled = true;
	btnDelete.disabled = true;*/
	btnAdd.disabled = changeButtonState(true);
	btnStart.disabled = changeButtonState(true);
	btnDelete.disabled = changeButtonState(true);
		
}

/*
 * Used to close the form which is used to add or replace the image
 */
function closeForm() {
	if (varMediaType == CONST_LMEDIA) {
		setTimeout(getLMediaImages, (2*CONST_TIMEOUT));
	} else if(varMediaType == CONST_RMEDIA) {
		setTimeout(getRMediaImages, (2*CONST_TIMEOUT));
	}
	wnd.close();
}

/*
 * It will invoke the RPC method to get the All media image names.
 * Once it get data from RPC, response function will be called automatically.
 */
function getLMediaImages() {
	xmit.get({url:"/rpc/getlmediaimages.asp", onrcv:getLMediaImageRes, status:""});
}

/*
 * This is the response function for getLMediaImages RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getLMediaImageRes(arg) {
	var errstr;		//Error string
	SDCardStatus = true;
	divMountError.innerHTML = "";
	if (arg.HAPI_STATUS == CONST_SD_MOUNT_ERROR) {
		//This block will used to disable the  Add button when SD Card Mount fails
		divMountError.innerHTML =  eLang.getString("common", 
			"STR_MEDIA_CFG_SD_MOUNT_ERROR");
		SDCardStatus = false;
	} else if (arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		errstr = eLang.getString("common", "STR_LMEDIA_IMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		LMEDIA_IMAGES = WEBVAR_JSONVAR_GETLMEDIAIMAGES.WEBVAR_STRUCTNAME_GETLMEDIAIMAGES;
	}
	if (LMEDIA_ENABLE && SDCardStatus) {
		//btnAdd.disabled = false;
		btnAdd.disabled = changeButtonState(false);
	}
	getLMediaArea();
}

/*
 * It will invoke the RPC method to get the All media image names.
 * Once it get data from RPC, response function will be called automatically.
 */
function getRMediaImages() {
	xmit.get({url:"/rpc/getrmediaimages.asp", onrcv:getRMediaImageRes, status:""});
}

/*
 * This is the response function for getLMediaImages RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getRMediaImageRes(arg) {
	var errstr;		//Error string
	RemoteMount = true;
	divMountError.innerHTML = "";
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
			case CONST_REMOTE_MOUNT_ERROR:
				divMountError.innerHTML =  eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - " + strRMediaType[0] + " & " + strRMediaType[1] + " & " + strRMediaType[2];
				MOUNT_STATUS_CD="false";
				MOUNT_STATUS_FD="false";
				MOUNT_STATUS_HD="false";
				RemoteMount = false;
				break;
			case 0x01:
				divMountError.innerHTML = eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - " + strRMediaType[0];
				MOUNT_STATUS_CD="false";
				RemoteMount = false;
				break;
			case 0x02:
				divMountError.innerHTML = eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") +" - "+ strRMediaType[1];
				MOUNT_STATUS_FD="false";
				RemoteMount = false;
				break;
			case 0x03:
				divMountError.innerHTML =eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - "+ strRMediaType[0] +" & "+ strRMediaType[1];
				MOUNT_STATUS_CD="false";
				MOUNT_STATUS_FD="false";
				RemoteMount = false;
				break;
			case 0x04:
				divMountError.innerHTML =  eLang.getString("common", 
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + "-" + strRMediaType[2];
				MOUNT_STATUS_HD="false";
				RemoteMount = false;
				break;
			case 0x05:
				divMountError.innerHTML =  eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - "+ strRMediaType[0] + " & " +  strRMediaType[2];
				MOUNT_STATUS_CD="false";
				MOUNT_STATUS_HD="false";
				RemoteMount = false;
				break;
			case 0x06:
				divMountError.innerHTML =  eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - "+  strRMediaType[1] + " & " + strRMediaType[2];
				MOUNT_STATUS_FD="false";
				MOUNT_STATUS_HD="false";
				RemoteMount = false;
				break;
			case 0x07:
				divMountError.innerHTML =  eLang.getString("common",
				"STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR") + " - " + strRMediaType[0] + " & " + strRMediaType[1] + " & " + strRMediaType[2];
				MOUNT_STATUS_CD="false";
				MOUNT_STATUS_FD="false";
				MOUNT_STATUS_HD="false";
				RemoteMount = false;
				break;
			default:
				errstr = eLang.getString("common", "STR_RMEDIA_IMG_GETVAL");
					errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
					GET_ERROR_CODE(arg.HAPI_STATUS);
				alert(errstr);
		}
	}
	RMEDIA_IMAGES = WEBVAR_JSONVAR_GETRMEDIAIMAGES.WEBVAR_STRUCTNAME_GETRMEDIAIMAGES;
	getRMediaCfg();
}
/*
 * It will highlight the Local Media tab and do local media operations.
 */
function doLocalMedia() {
	tabLMedia.style.fontWeight = "bold";
	tabRMedia.style.fontWeight = "normal";
	if(MEDIA_LICENSE_SUPPORT && LMEDIA_LICENSE_SUPPORT){
		if (LMEDIA_SUPPORT && RMEDIA_SUPPORT) {
			reloadHelp();
		}
		varMediaType = CONST_LMEDIA;
		initMediaRedirection = false;
		divMountError.innerHTML = "";
		btnAdd.className = "visibleRow";
		btnDelete.value = eLang.getString("common", "STR_LMEDIA_DELETE_BUTTON");
		disableButtons();
		getLMediaImages();
	}
	else{
		divMountError.innerHTML = "";
		divMountError.innerHTML =  eLang.getString("common", 
					"STR_MEDIA_CFG_LMEDIA_LICENSE_ERROR");
	}
}

/*
 * It will return the media type string to UI controls.
 * @Param type number, hold the media type value
 * @return media type string, corresponding media type string
 */
function getMediaTypeStr(type) {
	var mediaType = "";		//Used to hold the media type string

	if (type == CONST_CD_MEDIA_TYPE) {
		mediaType = IMAGE_TYPE_STR_CD;
	} else if (type == CONST_FD_MEDIA_TYPE) {
		mediaType = IMAGE_TYPE_STR_FD;
	} else if (type == CONST_HD_MEDIA_TYPE) {
		mediaType = IMAGE_TYPE_STR_HD;
	}
	return mediaType;
}

/*
 * It will load all local media images in the list grid control in UI.
 */
function loadLMediaImage(MEDIA_DATA, index) {
	var imageName = "";			//Variable to hold the image name
	var ImageExist = false;		//It is used to hold the image status
	var i = 0;					//Loop counter
	var mediaTypeStr = ""		//Used to hold the media type string

	if (MEDIA_DATA[index].IMAGE_REDIRECT && (MEDIA_DATA[index].IMAGE_NAME != "")) {
		imageName = MEDIA_DATA[index].IMAGE_NAME;
		return imageName;
	}

	for (i = 0; i < LMEDIA_IMAGES.length; i++) {
		if (MEDIA_DATA[index].IMAGE_TYPE == CONST_CD_MEDIA_TYPE) {
			if ((LMEDIA_IMAGES[i].IMAGE_NAME.indexOf(".iso") != -1) ||
				(LMEDIA_IMAGES[i].IMAGE_NAME.indexOf(".nrg") != -1)){
				ImageExist = true;
				break;
			}
		} else if ((MEDIA_DATA[index].IMAGE_TYPE == CONST_FD_MEDIA_TYPE) || 
			(MEDIA_DATA[index].IMAGE_TYPE == CONST_HD_MEDIA_TYPE)) {
			if ((LMEDIA_IMAGES[i].IMAGE_NAME.indexOf(".img") != -1) ||
				(LMEDIA_IMAGES[i].IMAGE_NAME.indexOf(".ima") != -1)){
				ImageExist = true;
				break;
			}
		}
	}

	if (ImageExist) {
		mediaTypeStr = getMediaTypeStr(MEDIA_DATA[index].IMAGE_TYPE);
		imageName = "<select id='_lst" + mediaTypeStr + 
			MEDIA_DATA[index].IMAGE_TYPE_INDEX + "'style='width:200px'>";
	} else {
		imageName = "~";
	}
	return imageName;
}

/*
 * It will load all the local media images into listgrid select box in UI.
 */
function reloadLMediaImages() {
	var mediaTypeStr = "";		//Used to hold the Media type string
	var lstMediaType;			//Used to list all the images
	var index;					//Loop counter
	var j;						//Loop counter

	for (index = 0; index < LMEDIA_DATA.length; index++) {
		if ((!LMEDIA_DATA[index].IMAGE_REDIRECT) && (LMEDIA_DATA[index].IMAGE_NAME == "")) {
			mediaTypeStr = getMediaTypeStr(LMEDIA_DATA[index].IMAGE_TYPE);
			for (j = 0; j < LMEDIA_IMAGES.length; j++) {
				if (LMEDIA_DATA[index].IMAGE_TYPE == CONST_CD_MEDIA_TYPE) {
					if ((LMEDIA_IMAGES[j].IMAGE_NAME.indexOf(".iso") != -1) ||
						(LMEDIA_IMAGES[j].IMAGE_NAME.indexOf(".nrg") != -1)) {
						lstMediaType = $("_lst" + mediaTypeStr + LMEDIA_DATA[index].IMAGE_TYPE_INDEX);
						lstMediaType.add(new Option(LMEDIA_IMAGES[j].IMAGE_NAME, 
							LMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));
					}
				} else if ((LMEDIA_DATA[index].IMAGE_TYPE == CONST_FD_MEDIA_TYPE) || 
					(LMEDIA_DATA[index].IMAGE_TYPE == CONST_HD_MEDIA_TYPE)) {
					if ((LMEDIA_IMAGES[j].IMAGE_NAME.indexOf(".img") != -1) ||
						(LMEDIA_IMAGES[j].IMAGE_NAME.indexOf(".ima") != -1)){
						lstMediaType = $("_lst" + mediaTypeStr + LMEDIA_DATA[index].IMAGE_TYPE_INDEX);
						lstMediaType.add(new Option(LMEDIA_IMAGES[j].IMAGE_NAME, 
							LMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));
					}
				}
			}
		}
	}
}

/*
 * It will invoke the RPC method to get the local media image configuration.
 * Once it get data from RPC, response function will be called automatically.
 */
startLMediaTimer = -1;
function getLMediaArea() {
	xmit.get({url:"/rpc/getlmediacfg.asp", onrcv:getLMediaAreaRes, show_progress: !loopCounter, status:""});
}

/*
 * This is the response function for getLMediaArea RPC.
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getLMediaAreaRes(arg) {
	var errstr;		//Error string
	var index;		//loop counter
	if (arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		errstr = eLang.getString("common", "STR_LMEDIA_IMG_GETVAL");
		errstr += (eLang.getString("common","STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		LMEDIA_DATA = WEBVAR_JSONVAR_GETLMEDIACFG.WEBVAR_STRUCTNAME_GETLMEDIACFG;

		if (initMediaRedirection) {
			var imgProgress = false;
			for (index = 0; index < LMEDIA_DATA.length; index++) {
				if (LMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_PROGRESS) {
					if (loopCounter == 0) {
						loadLMediaImageTable();
						//btnAdvSettings.disabled = false;
						btnAdvSettings.disabled = changeButtonState(false);
						loopCounter++;
					}
					imgProgress = true;
					break;
				}
			}
			if (imgProgress) {
				startLMediaTimer = setTimeout(getLMediaArea, CONST_TIMEOUT);
				return;
			} else {
				clearTimeout(startLMediaTimer);
				initMediaRedirection = false;
			}
		}
		loadLMediaImageTable();
		//btnAdvSettings.disabled = false;
		btnAdvSettings.disabled = changeButtonState(false);
	}
}

/*
 * It will load response local media data from global variable to list grid 
 * control in UI.
 */
function loadLMediaImageTable() {
	var imagename_todisplay;	//File name of image to display in List grid
	var imagetype_todisplay;	//Image type to display in List grid
	var redirstatus_todisplay;	//Local media redirection status to display in List grid
	var server_session_index;	//Local media redirection status to display in List grid
	var mediaTypeStr;			//Used to hold the media type string
	var index;					//loop counter
	var rowJSON = [];			//Object of array of rows to load list grid

	tblImage.clear();
	for (index = 0; index < LMEDIA_DATA.length; index++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		redirstatus_todisplay = "~";
		mediaTypeStr = "";
		server_session_index = "~";
		mediaTypeStr = getMediaTypeStr(LMEDIA_DATA[index].IMAGE_TYPE);
		imagetype_todisplay = mediaTypeStr + "_" + LMEDIA_DATA[index].IMAGE_TYPE_INDEX;
		imagename_todisplay = loadLMediaImage(LMEDIA_DATA, index);

		if (LMEDIA_DATA[index].SESSION_INDEX != 0xFF) {
			server_session_index = LMEDIA_DATA[index].SESSION_INDEX;
		}

		if (LMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_PROGRESS) {
			redirstatus_todisplay = "<label class='classicLabel'>" +
				eLang.getString("common", "STR_MEDIA_STATUS_PROGRESS") +
				"</label>";
		} else if (LMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_START) {
			redirstatus_todisplay = "<label class='classicLabel'>" +
				eLang.getString("common", "STR_MEDIA_STATUS_START") +
				"</label>";
		}  else if (LMEDIA_DATA[index].IMAGE_REDIRECT != "") {
				redirstatus_todisplay = "<label class='classicLabel'>" +
					eLang.getString("common", "STR_MEDIA_STATUS_STOP") + 
					(((LMEDIA_DATA[index].IMAGE_REDIRECT >= CONST_REDIR_STATUS_ERR_MIN) && 
						(LMEDIA_DATA[index].IMAGE_REDIRECT <= CONST_REDIR_STATUS_ERR_MAX)) ?
					eLang.getString("common", "STR_MEDIA_REDIR_STATUS_" + LMEDIA_DATA[index].IMAGE_REDIRECT) :
					eLang.getString("common", "STR_MEDIA_REDIR_STATUS_6")) +
					"</label>";
		}
		try {
			rowJSON.push({cells:[
				{text:(index+1), value:(index+1)},
				{text:imagetype_todisplay, value:imagetype_todisplay},
				{text:imagename_todisplay, value:imagename_todisplay},
				{text:redirstatus_todisplay, value:redirstatus_todisplay},
				{text:server_session_index, value:server_session_index}
			]});
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = rowJSON;
	tblImage.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_MEDIA_IMG_CNT") + "</strong>" + 
		index + eLang.getString("common", "STR_BLANK");
	reloadLMediaImages();
}

/*
 * It will design the form, which contains UI controls to add or replace image
 * for local media configuration, based on the argument value.
 * @param arg object, contains basic details of the selected slot in list 
 * grid and also details to load the form for add or replace image.
 */
function frmLMediaProcessImage(arg) {
	var frm = new form(arg.frmName,"POST","javascript://","general");

	var divFileupload = document.createElement("div");
	divFileupload.innerHTML = "<form name='frmImageUpload' " +
		"id='_frmImageUpload' method='POST' enctype='multipart/form-data' " +
		" target='hiddenFrame' style='margin-bottom:0'>" +
		"<input type='file' id='_fleImageBrowse' size='35'/>" +
		"</form>";
	rowImageBrowse = frm.addRow(eLang.getString("common", "STR_LMEDIA_IMGFILE"),
		divFileupload);

	var btnAry = [];
	btnAry.push(createButton(arg.btnName, eLang.getString("common", 
		arg.btnValue), validateLMediaImage));
	btnAry.push(createButton("btnCancel", eLang.getString("common", 
		"STR_CANCEL"), closeForm));

	wnd = MessageBox(eLang.getString("common", arg.wndTitle),
		frm.display(), btnAry);
	wnd.onclose = function() {
		getLMediaImages();
	}
}

/*
 * It will display a form, which contains UI controls to add a new image to
 * local media.
 * @param index number, index of the selected slot in list grid.
 */
function frmLMediaAddImage() {
	frmLMediaProcessImage ({
		"frmName" : "addLMediaImageForm",
		"btnValue" : "STR_UPLOAD",
		"btnName" : "btnAddImage",
		"wndTitle" : "STR_MEDIA_ADD_IMAGE"
	});
}

/*
 * It will get the local media image file name from the control and invoke 
 * validation method to validate it.
 */
function validateLMediaImage() {
	var fleImageBrowse;		//File Image Browse control
	var filename;			//variable used to hold the filename
	var index1;
	var SelImageType;
	
	fleImageBrowse = $("_fleImageBrowse");
	filename = fleImageBrowse.value.split("\\");
	if (filename.length) {
		filename = filename[filename.length - 1];
	} else {
		filename = filename[0];
	}

	if (eVal.isblank(filename)) {
		alert (eLang.getString("common", "STR_MEDIA_INVALID_FILE1"));
		return;
	}

	doMediaData();
	index1 = getSelectedRowIndex();
	SelImageType = MEDIA_DATA[index1].IMAGE_TYPE;
	
	//Image type is Floppy or Harddisk should have extension of .img or ima
	 if ((SelImageType == CONST_HD_MEDIA_TYPE)||(SelImageType == CONST_FD_MEDIA_TYPE))
	 {
		 if (eVal.endsWith(filename,".img") ||
		     eVal.endsWith(filename,".ima"))
	     {
	           varImageType = IMAGE_TYPE_STR_HD;
	     }
	     else
	     {
	             alert (eLang.getString("common", "STR_MEDIA_INVALID_FILE1"));
	             return;
	     }
	 }
	 //Image type is CD/DVD should have extension of .iso or nrg
	 else if( SelImageType == CONST_CD_MEDIA_TYPE)
	 {
	     if(eVal.endsWith(filename, ".iso") ||
	         eVal.endsWith(filename,".nrg"))
	     {
	            varImageType = IMAGE_TYPE_STR_CD;
	     }
	     else
	     {
	            alert (eLang.getString("common", "STR_MEDIA_INVALID_FILE1"));
	            return;
	     }
	 }
	 else
	 {
           alert (eLang.getString("common", "STR_MEDIA_INVALID_FILE1"));
	       return;
	 }


	for (i = 0; i < LMEDIA_IMAGES.length; i++) {
		if (LMEDIA_IMAGES[i].IMAGE_NAME == filename) {
			alert (eLang.getString("common", "STR_MEDIA_INVALID_FILE2"));
			return;
		}
	}
	
	varImageName = filename;
	//varFilePath = LMEDIA_FILE_PATH + filename;
	varFilePath = LMEDIA_FILE_PATH;
	uploadImage();
}

/*
 * It will upload the file to web server. Once upload was completed, it will
 * call the uploadComplete method automatically. 
 */
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
	
function uploadImage() {
	var fleImageBrowse;	//File Image Browse control

	if (confirm(eLang.getString("common", "STR_LMEDIA_CNFM_UPLOAD" 
			+ varImageOper))) {
		
		showWait(true,"Uploading");
		$("_btnAddImage").disabled = true;
		$("_btnCancel").disabled = false;
		
		fleImageBrowse = $("_fleImageBrowse").files;
		var file = fleImageBrowse[0];
		
	    var start = parseInt(0);
	    var stop = parseInt(file.size) - 1;
	    
	    var blob = file.slice(start, stop);
		
		var myBlobBuilder = new MyBlobBuilder();
		myBlobBuilder.append(blob);
		//myBlobBuilder.append(blob1);
		
		var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
		var string=myBlobBuilder.getBlob();
		if(typeof(FormData) == 'undefined'){
		    var boundary = '---------------------------' + (new Date).getTime(),//boundary is used to specify the encapsulation boundary of a parameter
		        data = "--" + boundary + "\r\n";
		        data += 'Content-Disposition: form-data; name="'+varFilePath+'"\r\n\r\n';//here we specify the name of the parameter name (data) sent to the server which can be retrieved by $_POST['data']
		        data += string + "\r\n";
		        data += "--" + boundary + "--\r\n";
		    xhr.open( 'post', 'file_upload.html?SOURCE=LMedia_'+ varImageType, true );
		    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		}else{
		    var data = new FormData();
		    data.append(varFilePath, string, varImageName);
		    xhr.open( 'post', 'file_upload.html?SOURCE=LMedia_'+ varImageType, true );
		}
		xhr.send(data);
		xhr.onload = function(oEvent) {
		    if (xhr.status == 200) {
		    	showWait(false,"Uploading");
		    	initTimeout();
				fleImageBrowse.disabled = true;
		    } 
		  };
		  
		}

		/*fleImageBrowse = $("_fleImageBrowse");
		fleImageBrowse.name = varFilePath;

		showWait(true, "Uploading");
		parent.web_alerts.stop();
		$("_frmImageUpload").action = "file_upload.html?SOURCE=LMedia_" + varImageType;
		document.forms["frmImageUpload"].submit();
		initTimeout();
		fleImageBrowse.disabled = true;*/
	//}
}
/*function uploadImage() {
	var fleImageBrowse;	//File Image Browse control

	if (confirm(eLang.getString("common", "STR_LMEDIA_CNFM_UPLOAD" 
			+ varImageOper))) {
		$("_btnAddImage").disabled = true;
		$("_btnCancel").disabled = false;

		fleImageBrowse = $("_fleImageBrowse");
		fleImageBrowse.name = varFilePath;

		showWait(true, "Uploading");
		parent.web_alerts.stop();
		$("_frmImageUpload").action = "file_upload.html?SOURCE=LMedia_" + varImageType;
		document.forms["frmImageUpload"].submit();
		initTimeout();
		fleImageBrowse.disabled = true;
	}
}*/
function initTimeout() {
	timeoutID = setTimeout(getUploadStatus, CONST_TIMEOUT);
}

/*
 * It will invoke the RPC method to get the adding image status for local media
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getUploadStatus() {
	var req;			//xmit object to send RPC request with parameters
	req = new xmit.getset({url:"/rpc/getlmediaimgstatus.asp", 
		onrcv:getUploadStatusRes, show_progress: false, status:""});
	req.add("FILE_NAME", varImageName);
	req.send();
	delete req;
}
function getUploadStatusRes(arg) {
	clearTimeout(timeoutID);
	switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x0:
			uploadComplete();
			break;
		case 0x0F:
			showWait(true, "Uploading");
			break;
		case 0xFF:
			uploadError();
			break;
		default:
			errstr = eLang.getString("common", "STR_LMEDIA_IMG_SETVAL");
				errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
				GET_ERROR_CODE(arg.HAPI_STATUS);
			alert(errstr);
	}
}
function uploadError() {
	showWait(false);
	alert(eLang.getString("common", "STR_LMEDIA_UPLOAD_ERROR"));
	$("_btnAddImage").disabled = false;
	$("_btnCancel").disabled = false;
	$("_fleImageBrowse").disabled = false;
	parent.web_alerts.monitor();
}

/*
 * Once the upload completed, the control comes to this method.
 * This will invoke the set media image configuration.
 */
function uploadComplete() {
	setMediaImage();
	showWait(false);
	parent.web_alerts.monitor();
}

/*
 * It will load all local media images in the list grid control in UI.
 */
function loadRMediaImage(MEDIA_DATA, index) {
	var imageName = "";			//Variable to hold the image name
	var ImageExist = false;		//It is used to hold the image status
	var i = 0;					//Loop counter
	var mediaTypeStr = ""		//Used to hold the media type string

	if (MEDIA_DATA[index].IMAGE_REDIRECT && (MEDIA_DATA[index].IMAGE_NAME != "")) {
		imageName = MEDIA_DATA[index].IMAGE_NAME;
		return imageName;
	}

	for (i = 0; i < RMEDIA_IMAGES.length; i++) {
		if (MEDIA_DATA[index].IMAGE_TYPE == RMEDIA_IMAGES[i].IMAGE_TYPE) {
			/*ImageExist = true;
			break;*/
			if(MEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_CD.RMEDIA_TYPE){
			 	if(MEDIA_CFG_CD.START_MOUNT!=0){
			  		ImageExist = true;
			  		break;
			 	} 
			}
			if(MEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_Floppy.RMEDIA_TYPE){
			 	if(MEDIA_CFG_Floppy.START_MOUNT!=0){
			  		ImageExist = true;
			  		break;
			 	} 
			}
			if(MEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_HD.RMEDIA_TYPE){
			 	if(MEDIA_CFG_HD.START_MOUNT!=0){
			  		ImageExist = true;
			  		break;
			 	} 
			}
		}
	}

	if (ImageExist) {
		mediaTypeStr = getMediaTypeStr(MEDIA_DATA[index].IMAGE_TYPE);
		imageName = "<select id='_lst" + mediaTypeStr + 
			MEDIA_DATA[index].IMAGE_TYPE_INDEX + "'style='width:200px'>";
	} else {
		imageName = "~";
	}
	return imageName;
}

/*
 * It will load all the local media images into listgrid select box in UI.
 */
function reloadRMediaImages() {
	var mediaTypeStr = "";		//Used to hold the Media type string
	var lstMediaType;			//Used to list all the images
	var index;					//Loop counter
	var j;						//Loop counter

	for (index = 0; index < RMEDIA_DATA.length; index++) {
		if ((!RMEDIA_DATA[index].IMAGE_REDIRECT) && (RMEDIA_DATA[index].IMAGE_NAME == "")) {
			mediaTypeStr = getMediaTypeStr(RMEDIA_DATA[index].IMAGE_TYPE);
			for (j = 0; j < RMEDIA_IMAGES.length; j++) {
				if (RMEDIA_DATA[index].IMAGE_TYPE == RMEDIA_IMAGES[j].IMAGE_TYPE) {
					/*lstMediaType = $("_lst" + mediaTypeStr + RMEDIA_DATA[index].IMAGE_TYPE_INDEX);
					lstMediaType.add(new Option(RMEDIA_IMAGES[j].IMAGE_NAME, 
						RMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));*/
						
					if(RMEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_CD.RMEDIA_TYPE){
						lstMediaType = $("_lst" + mediaTypeStr + RMEDIA_DATA[index].IMAGE_TYPE_INDEX);
						if(MEDIA_CFG_CD.START_MOUNT!=0){
										lstMediaType.add(new Option(RMEDIA_IMAGES[j].IMAGE_NAME, 
										RMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));              
						}              
					}
					if(RMEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_Floppy.RMEDIA_TYPE){
						lstMediaType = $("_lst" + mediaTypeStr + RMEDIA_DATA[index].IMAGE_TYPE_INDEX);
						if(MEDIA_CFG_Floppy.START_MOUNT!=0){
										lstMediaType.add(new Option(RMEDIA_IMAGES[j].IMAGE_NAME, 
										RMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));              
						}              
					}
					if(RMEDIA_DATA[index].IMAGE_TYPE== MEDIA_CFG_HD.RMEDIA_TYPE){
						lstMediaType = $("_lst" + mediaTypeStr + RMEDIA_DATA[index].IMAGE_TYPE_INDEX);
						if(MEDIA_CFG_HD.START_MOUNT!=0){
										lstMediaType.add(new Option(RMEDIA_IMAGES[j].IMAGE_NAME, 
										RMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));              
						}              
					}
				}
			}
		}
	}
}
 
/*function reloadRMediaImages() {
	var mediaTypeStr = "";		//Used to hold the Media type string
	var lstMediaType;			//Used to list all the images
	var index;					//Loop counter
	var j;						//Loop counter

	for (index = 0; index < RMEDIA_DATA.length; index++) {
		if ((!RMEDIA_DATA[index].IMAGE_REDIRECT) && (RMEDIA_DATA[index].IMAGE_NAME == "")) {
			mediaTypeStr = getMediaTypeStr(RMEDIA_DATA[index].IMAGE_TYPE);
			for (j = 0; j < RMEDIA_IMAGES.length; j++) {
				if (RMEDIA_DATA[index].IMAGE_TYPE == RMEDIA_IMAGES[j].IMAGE_TYPE) {
					lstMediaType = $("_lst" + mediaTypeStr + RMEDIA_DATA[index].IMAGE_TYPE_INDEX);
					lstMediaType.add(new Option(RMEDIA_IMAGES[j].IMAGE_NAME, 
						RMEDIA_IMAGES[j].IMAGE_INDEX, isIE?j:null));
				}
			}
		}
	}
}*/

/*
 * It will highlight the remote media tab and do remote media operations.
 */
function doRemoteMedia() {
	tabLMedia.style.fontWeight = "normal";
	tabRMedia.style.fontWeight = "bold";
	if(MEDIA_LICENSE_SUPPORT && RMEDIA_LICENSE_SUPPORT){
		if (LMEDIA_SUPPORT && RMEDIA_SUPPORT) {
			reloadHelp();
		}
		varMediaType = CONST_RMEDIA;
		initMediaRedirection = false;
		divMountError.innerHTML = "";
		btnAdd.className = "hiddenRow";
		btnDelete.value = eLang.getString("common", "STR_RMEDIA_CLEAR_BUTTON");
		disableButtons();
		getRMediaImages();
	}
	else{
		divMountError.innerHTML = "";
		divMountError.innerHTML =  eLang.getString("common", 
					"STR_MEDIA_CFG_RMEDIA_LICENSE_ERROR");
	}
}

/*
 * It will invoke the RPC method to get the remote media image configuration.
 * Once it get data from RPC, response function will be called automatically.
 */
startRMediaTimer = -1;
function getRMediaCfg() {
	xmit.get({url:"/rpc/getrmediacfg.asp", onrcv:getRMediaCfgRes, 
		show_progress: !loopCounter, status:""});
}

/*
 * This is the response function for getRMediaCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getRMediaCfgRes(arg) {
	var errstr;		//Error string
	var index;		//loop counter
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		errstr = eLang.getString("common", "STR_RMEDIA_IMG_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		RMEDIA_DATA = WEBVAR_JSONVAR_GETRMEDIACFG.WEBVAR_STRUCTNAME_GETRMEDIACFG;
		if (initMediaRedirection) {
			var imgProgress = false;
			for (index = 0; index < RMEDIA_DATA.length; index++) {
				if (RMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_PROGRESS) {
					if (loopCounter == 0) {
						loadRMediaImageTable();
						//btnAdvSettings.disabled = false;
						btnAdvSettings.disabled = changeButtonState(false);
						loopCounter++;
					}
					imgProgress = true;
					break;
				}
			}
			if (imgProgress) {
				startRMediaTimer = setTimeout(getRMediaCfg, CONST_TIMEOUT);
				return;
			} else {
				initMediaRedirection = false;
				clearTimeout(startRMediaTimer);
			}
		}
		loadRMediaImageTable();
		//btnAdvSettings.disabled = false;
		btnAdvSettings.disabled = changeButtonState(false);
	}
}

/*
 * It will load response remote media data from global variable to list grid 
 * control in UI.
 */
function loadRMediaImageTable() {
	var imagetype_todisplay;	//Image type to display in List grid
	var imagename_todisplay;	//File name of image to display in List grid
	var redirstatus_todisplay;	//Remote media redirection status to display in List grid
	var mediaTypeStr;			//Used to hold the media type string
	var server_session_index;	//Used to hold the server connected session index
	var index;					//loop counter
	var rowJSON = [];			//Object of array of rows to load list grid

	tblImage.clear();
	for (index = 0; index < RMEDIA_DATA.length; index++) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		mediaTypeStr = "~";
		redirstatus_todisplay = "~";
		server_session_index = "~";

		mediaTypeStr = getMediaTypeStr(RMEDIA_DATA[index].IMAGE_TYPE);
		imagetype_todisplay = mediaTypeStr + "_" + RMEDIA_DATA[index].IMAGE_TYPE_INDEX;
		imagename_todisplay = loadRMediaImage(RMEDIA_DATA, index);

		if (RMEDIA_DATA[index].SESSION_INDEX != 0xFF) {
			server_session_index = RMEDIA_DATA[index].SESSION_INDEX;
		}

		if (RMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_PROGRESS) {
			redirstatus_todisplay = "<label class='classicLabel'>" +
				eLang.getString("common", "STR_MEDIA_STATUS_PROGRESS") +
				"</label>";
		} else if (RMEDIA_DATA[index].IMAGE_REDIRECT == CONST_REDIR_START) {
			redirstatus_todisplay = "<label class='classicLabel'>" +
				eLang.getString("common", "STR_MEDIA_STATUS_START") +
				"</label>";
		} else if (RMEDIA_DATA[index].IMAGE_REDIRECT != "") {
			redirstatus_todisplay = "<label class='classicLabel'>" +
				eLang.getString("common", "STR_MEDIA_STATUS_STOP") + 
				(((RMEDIA_DATA[index].IMAGE_REDIRECT >= CONST_REDIR_STATUS_ERR_MIN) && 
					(RMEDIA_DATA[index].IMAGE_REDIRECT <= CONST_REDIR_STATUS_ERR_MAX)) ?
				eLang.getString("common", "STR_MEDIA_REDIR_STATUS_" + RMEDIA_DATA[index].IMAGE_REDIRECT) :
				eLang.getString("common", "STR_MEDIA_REDIR_STATUS_6")) +
				"</label>";
		}
		try {
			rowJSON.push({cells:[
				{text:(index+1), value:(index+1)},
				{text:imagetype_todisplay, value:imagetype_todisplay},
				{text:imagename_todisplay, value:imagename_todisplay},
				{text:redirstatus_todisplay, value:redirstatus_todisplay},
				{text:server_session_index, value:server_session_index}
			]});
		} catch(e) {
			alert(e);
		}
	}

	tblJSON.rows = rowJSON;
	tblImage.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_MEDIA_IMG_CNT") + "</strong>" + 
		index + eLang.getString("common", "STR_BLANK");
	reloadRMediaImages();
}

/*
 * It will invoke the RPC method to start the media redirection.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function doStartRedirection(bitStart) {
	var req;			//xmit object to send RPC request with parameters
	var index;			//Used to get the selected row index

	//btnStart.disabled = true;
	btnStart.disabled = changeButtonState(true);
	index = getSelectedRowIndex();
	doMediaData();

	req = new xmit.getset({url:"/rpc/startredirection.asp", 
		onrcv:startRedirectionRes, status:""});
	req.add("MEDIA_TYPE", varMediaType);
	req.add("IMAGE_TYPE", MEDIA_DATA[index].IMAGE_TYPE);
	req.add("IMAGE_INDEX", getSelectedImageIndex(index));
	req.add("START_BIT", bitStart);
	req.send();
	delete req;
}

/*
 * This is the response function for startRedirection RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If zero, then remote media  image redirection is success, intimate proper 
 * message to end user.
 * @param arg object, RPC response data from xmit library.
 */
function startRedirectionRes(arg) {
	var resStr;		//response string
	if (arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {	
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x99:
			alert(eLang.getString("common", "STR_RMEDIA_IMG_NOT_AVAILABLE"));
			break;
		case 0x92:
			alert(eLang.getString("common", "STR_RMEDIA_APPLICATION_NOT_RUNNING"));
			break;
		case 0x9E: 
			alert(eLang.getString("common", "STR_MOUNT_NOT_RESPONDING"));
			break;
		default:
		resStr = eLang.getString("common", "STR_MEDIA_START_ERR");
		resStr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(resStr);
			}
		} else {
		if (btnStart.value == eLang.getString("common",
			"STR_MEDIA_START_REDIR")) {
			resStr = eLang.getString("common", 
				"STR_MEDIA_REDIR_START_" + varMediaType);
		} else if (btnStart.value == eLang.getString("common",
			"STR_MEDIA_STOP_REDIR")) {
			resStr = eLang.getString("common", 
				"STR_MEDIA_REDIR_STOP_" + varMediaType);
		}
		alert(resStr);
	}

	loopCounter = 0;
	initMediaRedirection = true;
	if (varMediaType == CONST_LMEDIA) {
		getLMediaImages();
	} else if(varMediaType == CONST_RMEDIA) {
		getRMediaImages();
	}
}

/*
 * This is the response function for change the button state as  disabled or enabled 
 * Need a Params as state true or false
 * It returns true for other than admin  
 * and returns the request state for admin
 * @param arg as boolean, response as boolean.
 */
function changeButtonState(state){
	if(!top.user.isAdmin()) {
		return true;
	}
	else
	{
		return state;
	}
} 

/*<table>
<tr>
	 <td>
	 	<table>Local media table</table>
	 </td>
</tr>
<tr>
<td>
	<table>
	<tr>RMedia Header</tr>
	<tr><td colSpan="6">
	<table>
		<tr>
			<td>
			<table>
				<tr>RMedia support checkbox</tr>
				<tr>RMedia Type checkbox</tr>
			</table>
			</td>
		</tr>
		<tr id="trCD" style="display:none";>
		<td>
			<table>
				<tr>CD Header</tr>
				<tr>Headers</tr>
				<tr>input controls</tr>
			</table>
		</td>
		</tr>
		<tr id="trFloppy" style="display:none";>
		<td>
			<table>
				<tr>Floppy Header</tr>
				<tr>Headers</tr>
				<tr>input controls</tr>
			</table>
		</td>
		</tr>
		<tr id="trHD" style="display:none";>
		<td>
			<table>
				<tr>HD Header</tr>
				<tr>Headers</tr>
				<tr>input controls</tr>
			</table>
		</td>
		</tr>
		<tr id="trAll" style="display:none";>
		<td>
			<table>
				<tr>All Header</tr>
				<tr>Headers</tr>
				<tr>input controls</tr>
			</table>
		</td>
		</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>*/
