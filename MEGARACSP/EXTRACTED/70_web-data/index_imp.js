//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2012        **;
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

var gConsoleOpen;
var gSSLCert = false;
var gMultiLAN = false;
//var gUserPressedF5 = false;
var gPEFInfo;
var gActiveBMCInst=1;
var PRJ_CFG;
var default_Lang;

function doInit()
{
	loadFrames();
	application_init();
}

function application_init()
{
	gLogout = false;
	//gUserPressedF5 = false;
	gConsoleOpen = false;
	var sessionexpire = fnCookie.read("SessionExpired");
	var sessionID = fnCookie.read("SessionID");
	var sessionterminate = 0;
	var req;                        //xmit object to send RPC request with parameters 

	if((fnCookie.read("SessionCookie") == "") && (sessionexpire != undefined && 
		sessionexpire != null && sessionexpire == "true")) {
		gLoggedOut = false;
	} else {
		 if ((fnCookie.read("SessionCookie") != undefined && 
                                fnCookie.read("SessionCookie") != null) && 
                                (sessionexpire == undefined || sessionexpire == null || 
                                sessionexpire == "false") && (top.user.CSRFtoken == null ||
                                top.user.CSRFtoken == undefined || top.user.CSRFtoken == "")) {
					alert("Already a session is running in this browser, so opening the same session");
	        			req = new xmit.getset({url:"/rpc/setsessioncfg.asp",
			                onrcv:setSessionCfgRes, status:""});
			        	req.add("SESSIONID", sessionID);
				        req.send();
			        	delete req;
					sessionterminate = 1;
			}
		 else {				
			clearCookies();		//Clear the cookies if its not logged in
			gLoggedOut = true;
		}
	}

	gFlashMode = false;
	if (sessionterminate == 0){
		window.onbeforeunload = application_exit;
		//events.register("beforeunload", application_exit, window);
		events.register("keydown", keyListener, document);
		events.register("mousedown", mouseListener, document);
	}
}

function $(id)
{
	return document.getElementById(id);
}

function getCurFile(lObj)
{
	var fileAry = lObj.pathname.split('/');
	var file = fileAry[fileAry.length-1];

	return	file.split('.')[0];
}

function toggleNodeSelect()
{
	if(!nodeSelectOpen)
	{
		openNodeSelect();
		nodeSelectOpen = true;
	}
}

nodeSelectOpen = false;
function closeNodeSelect()
{
	if(helpOpen)
		$('frmHolder').cols = '0, *, 250';
	else
		$('frmHolder').cols = '0, *, 0';
	nodeSelectOpen = false;
}

function openNodeSelect(target)
{
	if(!nodeSelectOpen && target==undefined)
	{
		nodeSelectFrame.location.href = top.gPageDir + "node_select.html";
	}
	if(target!=undefined)
	{
		helpFrame.location.href = target;
	}
	if(helpOpen)
		$('frmHolder').cols = '250, *, 250';
	else
		$('frmHolder').cols = '250, *, 0';
	nodeSelectOpen = true;
}

function toggleHelp()
{
	if(helpOpen)
		closeHelp();
	else
		openHelp();
}

helpOpen = false;
function closeHelp()
{
	if(nodeSelectOpen)
		$('frmHolder').cols = '250,*,0';
	else
		$('frmHolder').cols = '0,*,0';
	helpOpen = false;
}

function getActiveConsoleStatus()
{
	xmit.get({url:"/rpc/getactiveconsolestatus.asp",onrcv:function(arg)
	{
		if(arg.HAPI_STATUS==0)
		{
			gConsoleOpen = WEBVAR_JSONVAR_CONSOLE_STATUS.WEBVAR_STRUCTNAME_CONSOLE_STATUS[0].ConsoleStatus;
		}
		confirmLogout();
	}});
}

function logoutWeb()
{
	headerFrame.$("userDetails").innerHTML = "&nbsp;";
	xmit.get({url:"/rpc/WEBSES/logout.asp",onrcv:function(arg)
	{
		if (arg.HAPI_STATUS == 0) {
			clearCookies();
			top.mainFrame.location.href = "../page/login.html";
		}
	}});
}

function confirmLogout()
{
	if (gConsoleOpen || gSSLCert) {
		logoutstr = eLang.getString('common', "STR_GENERAL_LOGOUT");
		if (gConsoleOpen) {
			logoutstr += "\n" + eLang.getString('common', "STR_WARNING") + 
				eLang.getString('common', "STR_CONSOLE_CONNECTED");
			if (gSSLCert) {
				logoutstr += "\n" + eLang.getString('common', "STR_SSLCERT_ABORT");
			}
		} else if (gSSLCert) {
			logoutstr += "\n" + eLang.getString('common', "STR_WARNING") + 
				eLang.getString('common', "STR_SSLCERT_ABORT");
		}
		if (!confirm(logoutstr)) {
			return;
		} else {
			gSSLCert = false;
			gConsoleOpen = false;
		}
	}
	logoutWeb();
}

function openHelp(target)
{
	if(!helpOpen && target==undefined)
	{
		helpFrame.location.href = mainFrame.getCurPageSection(mainFrame.HELP);
	}
	if(target!=undefined)
	{
		helpFrame.location.href = target;
	}
	if(nodeSelectOpen)
		$('frmHolder').cols = '250,*,250';
	else
		$('frmHolder').cols = '0,*,250';
	helpOpen = true;
}

function getBrowserLang()
{
	var lang = CONSTANTS.DEFAULT_LANG;

	if(default_Lang == undefined)
	{
		lang = CONSTANTS.DEFAULT_LANG;
		return lang;  // default webui language support (EN)
	}
	else
	{
		lang = default_Lang[0].DEFAULTLANG;
		return lang;
	}	
	
}

/* quick logout preparation */
function getMethod()
{
	var req;
	if(window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	}else
	{
		if(window.ActiveXObject)
		{
			req = new ActiveXObject('Microsoft.XMLHTTP');
		}else
		{
			req = null;
		}
	}
	return req;
}

var greq = getMethod();
var flashreq = getMethod();

function unload_resp()
{
	if (greq.readyState == 4) {
		gLoggedOut = true;
	}
}

function unload_flash_resp()
{
	if (flashreq.readyState == 4)
		gLoggedOut = true;
}

if(greq)
{
	greq.open("get", "/rpc/WEBSES/logout.asp");
	greq.setRequestHeader("Content-type", "x-www-form-urlencoded");
	greq.onreadystatechange = unload_resp;
}

if(flashreq)
{
	flashreq.open("get", "/rpc/flash_browserclosed.asp");
	flashreq.setRequestHeader("Content-type", "x-www-form-urlencoded");
	flashreq.onreadystatechange = unload_flash_resp;
}

function application_exit()
{
	if (top.mainFrame.location.href.indexOf("login.html") == -1) {
	//Check if it is not login page, then clear the cache.
		if (!gFlashMode) {
			//greq.send(null);
			logoutWeb();		//Invoke logout to clear the session, if browser window closed abrubtly
			if ((navigator.userAgent.toLowerCase().indexOf('firefox')!= -1)) {	//Firefox need the return value for onbeforeunload event
				return eLang.getString("common", "STR_PROCESS_ABORT");
			}
			if (gConsoleOpen || gSSLCert) {
				alert(eLang.getString("common", "STR_PROCESS_ABORT"));
			} else if(!gLogout && !gLoggedOut && !gFlashMode) {
				alert(eLang.getString("common", "STR_LOGOUT_SUCCESS"));
			}
		} else {
			flashreq.send(null);
			alert(eLang.getString("common", "STR_FWFLASH_ABORT"));
		}
	}
}

/* end application close or refresh event */

CONSTANTS = {};

CONSTANTS.DEFAULT_LANG = "EN";
CONSTANTS.CALLBACK = 1;
CONSTANTS.USER = 2;
CONSTANTS.OPERATOR = 3;
CONSTANTS.ADMIN = 4;
CONSTANTS.OEM = 5;
CONSTANTS.NOACCESS = 0xf;
CONSTANTS.privilege = [];
CONSTANTS.privilege[0] = 'Reserved';
CONSTANTS.privilege[CONSTANTS.CALLBACK] = 'Callback';
CONSTANTS.privilege[CONSTANTS.USER] = 'User';
CONSTANTS.privilege[CONSTANTS.OPERATOR] = 'Operator';
CONSTANTS.privilege[CONSTANTS.ADMIN] = 'Administrator';
CONSTANTS.privilege[CONSTANTS.OEM] = 'OEM Proprietary';
CONSTANTS.privilege[CONSTANTS.NOACCESS] = 'No Access';
CONSTANTS.ERROR = {};
CONSTANTS.ERROR.SESSION_EXPIRED = 6;

CONSTANTS.IPSOURCE_DHCP = 0x02;
CONSTANTS.IPSOURCE_STATIC = 0x01;

CONSTANTS.ADD = 1;
CONSTANTS.MODIFY = 2;
CONSTANTS.DELETE = 3;
CONSTANTS.SUCCESS = 0;

CONSTANTS.SHRTYPE_NFS = 0;		//Constant for NFS share type
CONSTANTS.SHRTYPE_CIFS = 1;		//Constant for Samba (CIFS) share type

CONSTANTS.WEB_SERVICE_ID_BIT = 0;
CONSTANTS.KVM_SERVICE_ID_BIT = 1;
CONSTANTS.MEDIA_SERVICE_ID_BIT = 2;
CONSTANTS.SSH_SERVICE_ID_BIT = 3;
CONSTANTS.TELNET_SERVICE_ID_BIT = 4;
CONSTANTS.IPMI_SERVICE_ID_BIT = 5;

CONSTANTS.KVM_PRIVILEGE = 0x00000001;
CONSTANTS.MEDIA_PRIVILEGE = 0x00000002;

CONSTANTS.KVM = {};
CONSTANTS.KVM.WEBPREVIEW = "WebPreview";
CONSTANTS.KVM.BSODSCREEN = "BSODScreen";

IMG_RIGHT = "<img src='../res/ok.png' border='0'>";
IMG_WRONG = "<img src='../res/crit.png' border='0'>";
IMG_HELP = "<img src='../res/helpicon.png' title='Help' border='0'>";

var user =
{
	name:'',
	privilege:'',
	pno:CONSTANTS.NOACCESS,
	CSRFtoken:'',

	isAdmin: function()
	{
		return (user.pno==CONSTANTS.ADMIN);
	},

	isOperator: function()
	{
		return (user.pno==CONSTANTS.OPERATOR);
	},

	isUser: function()
	{
		return (user.pno==CONSTANTS.USER);
	},
	isKVM: function()
	{
		if (user.extendedpriv != undefined && user.extendedpriv != null) {
			return ((user.extendedpriv & CONSTANTS.KVM_PRIVILEGE) ? 
				true : false);
		} else {
			return (user.pno==CONSTANTS.ADMIN);
		}
	},
	isVMedia: function()
	{
		if (user.extendedpriv != undefined && user.extendedpriv != null) {
			return ((user.extendedpriv & CONSTANTS.MEDIA_PRIVILEGE) ? 
				true : false);
		}  else {
			return (user.pno==CONSTANTS.ADMIN);
		}
	}
};

var settings =
{
	lan_channel:'',
	console:''
};
var licensePages = {
	"KVM" : [
		"STR_LN_SERVER_HEALTH_BSOD_SCREEN",
		"STR_LN_REMOTE_CONTROL_CONSOLE_REDIRECTION",
		"STR_LN_REMOTE_CONTROL_JAVA_SOL",
		"STR_LN_CONFIG_REMOTE_SESSION",
		"STR_TOPNAV_AUTO_VIDEO_RECORDING"
	],
	"MEDIA" : [
		"STR_LN_CONFIG_VIRTUAL_MEDIA"
	],
	"LMEDIA" : [
	    "STR_LN_CONFIG_IMAGES_REDIRECTION"
	],
	"RMEDIA" : [
	    "STR_LN_CONFIG_IMAGES_REDIRECTION"
	]
	
};

var sharedMenu =
	["STR_TOPNAV_DASHBOARD",
	 "STR_TOPNAV_SERVER_HEALTH",
	 "STR_TOPNAV_CONFIGURATION",
	 "STR_TOPNAV_REMOTE_CONTROL",
	];

var nodePages = 
	["STR_TOPNAV_FRU_INFORMATION",
	 "STR_LN_SERVER_HEALTH_SENSOR_READINGS",
	 "STR_LN_SERVER_HEALTH_EVENT_LOG",
	 "STR_LN_SERVER_HEALTH_SYSTEM_AND_AUDIT_LOG",
	 "STR_LN_CONFIG_EVENT_LOG",
	 "STR_LN_CONFIG_PEF",
	 "STR_LN_REMOTE_CONTROL_SERVER_POWER_CONTROL",
	 "STR_LN_REMOTE_CONTROL_UID_CONTROL",
	];
	 
