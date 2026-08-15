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

modulesLoaded = false;
pageLoaded = false;
CONST_RECORD_ID = 0 //Constant to hold the default record id
var widgetClose = [];

function doInit()
{
	exposeElms(['_menuHolder',
				'_breadScrumb',
				'_loader',
				'_loaderStatus']);
	liveUpdateTime = 10000;
	gAJAXAlertMissingASP = true;
	liveUpdateTimer = null;
	liveUpdates = null;
	SENSORINFO_DATA = null;

	if(top.user.pno>=2)
		_begin();
	 else
		document.body.innerHTML = '';
}

function _begin()
{
	top.headerFrame.onlogin();
	if(checkProjectCfg("SINGLE_NIC_BMC_INSTANCES"))
		top.toggleNodeSelect();
	oMenu.enableFeaturesList(TOPNAV);
	menuHolder.appendChild(oMenu.createMenuBar(TOPNAV,'rounded'));

	$('pageFrame').src = '..'+TOPNAV.items[0].page;
	oMenu.menuBar.firstChild.className = "hiLight";

	xmit.get({url:'/rpc/getmaxselentries.asp',onrcv:function(arg){
		if(arg.HAPI_STATUS)
		{
			errstr = eLang.getString('common',"STR_EVENT_LOG_GETVAL");
			errstr +=  (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}else
		{
			gMaxEventData = WEBVAR_JSONVAR_MAXSELENTRIES.WEBVAR_STRUCTNAME_MAXSELENTRIES[0].COUNT;
		}
	}});

	xmit.get({url:'/rpc/getallselentries.asp',onrcv:function(arg){
		if(arg.HAPI_STATUS)
		{
			errstr = eLang.getString('common',"STR_EVENT_LOG_GETVAL");
			errstr +=  (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}else
		{
			gEventData = WEBVAR_JSONVAR_HL_GETALLSELENTRIES.WEBVAR_STRUCTNAME_HL_GETALLSELENTRIES;
			if (gEventData.length > 0) {
				web_alerts.construct(30, gEventData[0].RecordID);
			} else {
				web_alerts.construct(30, CONST_RECORD_ID);
			}
		}
	}});


	//breadScrumb.innerHTML = "<div id='breadScrumb' class='breadScrumb'>"+eLang.getString('navobj',TOPNAV.items[0].label)+"</div>";
	initializeViewFrame();
	events.register('resize',initializeViewFrame,window);
	events.register('resize',reposition_all_widgets,window);
}

function initializeViewFrame()
{
	$('pageFrame').style.height = document.body.clientHeight - (menuHolder.offsetHeight);
}

function createWidget(id) {
	widgets[id] = new widget(id);
}

function loadAutomationEngine() {
	windowURL = window.location.href.split("/");
	windowURL = windowURL[2];

	if (windowURL.indexOf("]") != -1) {
		externalIP = windowURL.split("]");
		externalIP = externalIP[0] + "]";
	} else {
		externalIP = windowURL.split(":");
		externalIP = externalIP[0];
	}

	xmit.get({url:"/rpc/WEBSES/validate.asp",onrcv:function(arg){
		if(arg.HAPI_STATUS == 0) {
			if (top.user.isAdmin()) {
				window.open("http://" + externalIP + ":8090/launch?session=" + 
					fnCookie.read("SessionCookie"));
			} else {
				alert(eLang.getString('common',"STR_CONF_ADMIN_PRIV"));
			}
		} else {
			top.document.cookie = "SessionExpired=true;path=/";
			parent.location.href = "login.html";
		}
	},evalit:false});
}

