//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2012-2015        **;
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

// File Name  : capture_bsod_imp.js
// Brief      : This implementation is used to display the blue screen captured
// during failure happened in host system.
// Author Name: Arockia Selva Rani. A

var KVM_CFG;			//Holds RPC response data of adviser configuration

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_rowBSODScreen"]);
	if(top.user.isAdmin()) {
		_begin();
	} else {
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	}
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	if (checkProjectCfg("CAPTURE_BSOD_RAW")) {
		getAdviserCfg();
	} else if (checkProjectCfg("CAPTURE_BSOD_JPEG")) {
		getBSODJPEGImg();
	}
}

/*
 * It will invoke the RPC method to get the adviser configuration.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getAdviserCfg()
{
	xmit.get({url:"/rpc/getadvisercfg.asp", onrcv:getAdviserCfgRes, status:""});
}

/*
 * This is the response function for getAdviserCfg RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getAdviserCfgRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_ADVISER_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
	} else {
		KVM_CFG = WEBVAR_JSONVAR_GETADVISERCFG.WEBVAR_STRUCTNAME_GETADVISERCFG[0];
		loadBSODScreen();
	}
}

/*
 * This will display the captured BSOD screen in UI.
 */
function loadBSODScreen()
{
	var eltBSODScreen = "";	//Tag used to display screen content
	var windowURL;			//Window URL with full path
	var externalIP = "";	//External Client IP

	windowURL = window.location.href.split("/");
	windowURL = windowURL[2];
	if (windowURL.indexOf("]") != -1) {
		externalIP = windowURL.split("]");
		externalIP = externalIP[0] + "]";
	} else {
		externalIP = windowURL.split(":");
		externalIP = externalIP[0];
	}

	xmit.head("/bsod/crashscreen.cap", function(head){
		if (head.status == 200) {
			eltBSODScreen = document.createElement("applet");
			eltBSODScreen.code = "com.ami.kvm.jviewer.WebPreviewer";
			eltBSODScreen.archive = "JViewer.jar";
			eltBSODScreen.codeBase = "/Java/release";
			eltBSODScreen.width = "800px";
			eltBSODScreen.height = "600px";

			var prmAppType = document.createElement("param");
			prmAppType.setAttribute("name", "apptype");
			prmAppType.setAttribute("value", CONSTANTS.KVM.BSODSCREEN);
			eltBSODScreen.appendChild(prmAppType);

			var prmServerIP = document.createElement("param");
			prmServerIP.setAttribute("name", "serverip");
			prmServerIP.setAttribute("value", externalIP);
			eltBSODScreen.appendChild(prmServerIP);

			var prmWebPort = document.createElement("param");
			prmWebPort.setAttribute("name", "webport");
			prmWebPort.setAttribute("value", KVM_CFG.V_STR_WEB_PORT);
			eltBSODScreen.appendChild(prmWebPort);

			var prmWebSecure= document.createElement("param");
			prmWebSecure.setAttribute("name", "websecure");
			protocol = (document.location.protocol == "http:" ? 0 : 1);
			prmWebSecure.setAttribute("value", protocol);
			eltBSODScreen.appendChild(prmWebSecure);
			
		} else {
			eltBSODScreen = document.createElement("div");
			eltBSODScreen.className = "errorDisplay";
			eltBSODScreen.style.borderWidth = "1px";
			eltBSODScreen.innerHTML = eLang.getString("common",
				"STR_BSOD_NOT_AVAIL");
		}
		rowBSODScreen.appendChild(eltBSODScreen);
	});
}

/*
* This function used to display the JPEG image of BOSD Screen
*/
function getBSODJPEGImg() {
	var eltBSODJPEGScreen = "";	//Tag used to display the JPEG image of BSOD Screen

	xmit.head("/bsod/crashscreen.jpeg", function(head) {
		if (head.status == 200) {
			eltBSODJPEGScreen = document.createElement("img");
			eltBSODJPEGScreen.src = "/bsod/crashscreen.jpeg";
			eltBSODJPEGScreen.alt = CONSTANTS.KVM.BSODSCREEN;
		} else {
			eltBSODJPEGScreen = document.createElement("div");
			eltBSODJPEGScreen.className = "errorDisplay";
			eltBSODJPEGScreen.style.borderWidth = "1px";
			eltBSODJPEGScreen.innerHTML = eLang.getString("common",
				"STR_BSOD_NOT_AVAIL");
		}
			rowBSODScreen.appendChild(eltBSODJPEGScreen);
	});
}
