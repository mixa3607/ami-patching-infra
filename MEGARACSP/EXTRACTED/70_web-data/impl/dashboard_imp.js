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

var DUAL_IMAGE = false;			//It holds the dual image feature
modulesLoaded = false;
pageLoaded = false;
var colno = 1;
var protocol;
var state = "";


function doInit()
{
	var tmp;
	exposeElms(["_deviceAvailable",
		"_fwRev",
		"_buildTime",
		"_networkEditLink",
		"_tblNetworkInfo",
		"_lblMACAddr",
		"_lblIPv4Mode",
		"_rowIPv4Addr",
		"_lblIPv4Addr",
		"_lblIPv6Mode",
		"_rowIPv6Addr",
		"_lblIPv6Addr",
		"_tblPermissionDeny",
		"_permissionDeny",
		"_infoRight",
		"_infoLeft",
		"_remoteControl",
		"_rowWebPreview",
		"_rowActiveImage",
		"_activeImageId",
		]);

	_begin();
	if (top.user.isAdmin()) {
		networkEditLink.innerHTML = "(<a href='configure_network.html'>" +
			eLang.getString("common", "STR_DASHBOARD_NETWORK_EDIT") + "</a>)";
	} else if (top.user.isOperator()) {
		networkEditLink.innerHTML = "(<a href='configure_network.html'>" +
			eLang.getString("common", "STR_DASHBOARD_NETWORK_VIEW") + "</a>)";
	}
}

function _begin()
{
	top.reloadValues = true;	//To reload the pie chart
	$("dashboard").style.width = (screen.width-53)+"px";
	rowActiveImage.className = "hiddenRow";
	
	if( top.gActiveBMCInst == 1) {
		xmit.get({url:"/rpc/getfwinfo.asp", onrcv:getFWInfoRes, status:""});
		getNetworkInfo();
	}
	else {
		$("_infoLeft").className = "hiddenRow";
	}

	if( !checkProjectCfg("SINGLE_NIC_BMC_INSTANCES") || (checkProjectCfg("SINGLE_NIC_BMC_INSTANCES") && (top.gActiveBMCInst != 1)))
	{
		xmit.get({url:"/rpc/getallsensors.asp",onrcv:function(arg)
		{
			if (arg.HAPI_STATUS) {
				errstr = eLang.getString("common", "STR_SENSOR_GETVAL");
				errstr += eLang.getString("common", "STR_IPMI_ERROR") + 
					GET_ERROR_CODE(arg.HAPI_STATUS);
				alert(errstr);
			} else {
				buildDashboardTable();
			}
		}, status:""});
	} else if( checkProjectCfg("SINGLE_NIC_BMC_INSTANCES") && (top.gActiveBMCInst == 1)) {
		$("_infoRight").className = "hiddenRow";
		$("_infoGraph").className = "hiddenRow";
	} 

	getConsoles(javaAvailable, activeXAvailable);
}

function javaAvailable(bool)
{
	var tdConsole;
	if (bool) {
		tdConsole = remoteControl.insertCell(colno++);
		tdConsole.align = "right";
		tdConsole.innerHTML = "<button type='button' id='_btnJava' " +
			"onclick='doLaunchJava()' style='height:26px' title='Java Console" +
			" Launch'><img src='../res/java.png'/>&nbsp;Launch</button>";
		if(!top.user.isKVM()) {
			disableActions();
		}
	}
}

function activeXAvailable(bool)
{
	var tdConsole;
	if (bool) {
		tdConsole = remoteControl.insertCell(colno++);
		tdConsole.align = "right";
		tdConsole.innerHTML = "<button type='button' id='_btnActiveX' " +
			"onclick='doLaunchActiveX()' style='height:25px' title='" +
			"ActiveX Console Launch'><img src='../res/activex.png'/>&nbsp;" +
			"Launch</button>";
		if(!top.user.isKVM()) {
			disableActions();
		}
	}
	if (colno == 1) {
		tdConsole = remoteControl.insertCell(colno++);
		tdConsole.innerHTML = "Console not supported";
	} else {
		if(top.user.isKVM()) {
			xmit.get({url:"/rpc/getadvisercfg.asp", onrcv:loadKVMSupport, status:""});
		}
	}
}

function loadKVMSupport(arg)
{
	var KVM_CFG;
	var eltWebPreview = "";
	var windowURL;		//Window URL with full path
	var externalIP = "";		//External Client IP
	var singlePortSupport = false;
	var kvmReconnSupport = false;

	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_CONF_RMT_SESS_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
	} else {
		KVM_CFG = WEBVAR_JSONVAR_GETADVISERCFG.WEBVAR_STRUCTNAME_GETADVISERCFG[0];
		try {
			$("_btnJava").disabled = (KVM_CFG.V_STR_KVM_STATUS && 
				checkLicenseCfg("KVM")) ? false : true;
		} catch(e) {
		}
		try {
			$("_btnActiveX").disabled = (KVM_CFG.V_STR_KVM_STATUS && 
				checkLicenseCfg("KVM")) ? false : true;
		} catch(e) {
		}

		singlePortSupport = KVM_CFG.V_STR_SINGLEPORT_STATUS;
		if(((KVM_CFG.V_STR_OEM_FEATURE_STATUS) & (0x20)) == (0x20))
			kvmReconnSupport = true;

		if (checkProjectCfg("WEB_PREVIEW") && top.user.isKVM()) {
			rowWebPreview.className = "visibleRow";
			windowURL = window.location.href.split("/");
			windowURL = windowURL[2];
			if (windowURL.indexOf("]") != -1) {
				externalIP = windowURL.split("]");
				externalIP = externalIP[0] + "]";
			} else {
				externalIP = windowURL.split(":");
				externalIP = externalIP[0];
			}

			if (KVM_CFG.V_STR_KVM_STATUS && checkLicenseCfg("KVM")) {
				eltWebPreview = document.createElement("applet");
				eltWebPreview.code = "com.ami.kvm.jviewer.WebPreviewer";
				eltWebPreview.archive = "JViewer.jar";
				eltWebPreview.codeBase = "/Java/release";
				eltWebPreview.width = "300px";
				eltWebPreview.height = "200px";

				var prmAppType = document.createElement("param");
				prmAppType.setAttribute("name", "apptype");
				prmAppType.setAttribute("value", CONSTANTS.KVM.WEBPREVIEW);
				eltWebPreview.appendChild(prmAppType);

				var prmServerIP = document.createElement("param");
				prmServerIP.setAttribute("name", "serverip");
				prmServerIP.setAttribute("value", externalIP);
				eltWebPreview.appendChild(prmServerIP);

				var prmKVMSecure = document.createElement("param");
				prmKVMSecure.setAttribute("name", "kvmsecure");
				if (singlePortSupport) {
					protocol = (document.location.protocol == "http:" ? 0 : 1);
					prmKVMSecure.setAttribute("value", protocol);
				}else{	
					prmKVMSecure.setAttribute("value", KVM_CFG.V_STR_SECURE_CHANNEL);
				}
				eltWebPreview.appendChild(prmKVMSecure);

				//Need to pass web port value, when single port KVM support.
				var prmKVMPort = document.createElement("param");
				prmKVMPort.setAttribute("name", "kvmport");
				if (singlePortSupport) {
					prmKVMPort.setAttribute("value", KVM_CFG.V_STR_WEB_PORT);
				} else {
					prmKVMPort.setAttribute("value", KVM_CFG.V_STR_KVM_PORT);
				}
				eltWebPreview.appendChild(prmKVMPort);

				var prmWebPort = document.createElement("param");
				prmWebPort.setAttribute("name", "webport");
				prmWebPort.setAttribute("value", KVM_CFG.V_STR_WEB_PORT);
				eltWebPreview.appendChild(prmWebPort);

				var prmWebCookie = document.createElement("param");
				prmWebCookie.setAttribute("name", "webcookie");
				prmWebCookie.setAttribute("value", fnCookie.read("SessionCookie"));
				eltWebPreview.appendChild(prmWebCookie);

				var prmSinglePort = document.createElement("param");
				prmSinglePort.setAttribute("name", "singleport");
				prmSinglePort.setAttribute("value", singlePortSupport ? 1 : 0);
				eltWebPreview.appendChild(prmSinglePort);

				var prmKVMReconnect= document.createElement("param");
				prmKVMReconnect.setAttribute("name", "kvmreconnect");
				prmKVMReconnect.setAttribute("value", kvmReconnSupport ? 1 : 0);
				eltWebPreview.appendChild(prmKVMReconnect);

				var prmWebSecure= document.createElement("param");
				prmWebSecure.setAttribute("name", "websecure");
				protocol = (document.location.protocol == "http:" ? 0 : 1);
	                        prmWebSecure.setAttribute("value", protocol);
				eltWebPreview.appendChild(prmWebSecure);

			} else {
				eltWebPreview = document.createElement("div");
				eltWebPreview.className = "errorDisplay";
				eltWebPreview.style.borderWidth = "1px";
				eltWebPreview.innerHTML = (checkLicenseCfg("KVM") ? 
					eLang.getString("common", "STR_WEBPREVIEW_KVM_DISABLE_1") :
					eLang.getString("common", "STR_WEBPREVIEW_KVM_DISABLE_2"));
			}
			rowWebPreview.colSpan = colno;
			rowWebPreview.appendChild(eltWebPreview);
		} else {
			rowWebPreview.className = "hiddenRow";
		}
	}
}

function getFWInfoRes(arg)
{
	var FWINFO_DATA;
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_DASHBOARD_GETBUILDDATE");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert (errstr);
	} else {
		FWINFO_DATA = WEBVAR_JSONVAR_GETFWINFO.WEBVAR_STRUCTNAME_GETFWINFO[0];
		DUAL_IMAGE = checkProjectCfg("DUAL_IMAGE");
		if(DUAL_IMAGE){
			rowActiveImage.className = "visibleRow";
			activeImageId.innerHTML = "Image-"+FWINFO_DATA.ActiveImage;
		}
		
		buildTime.innerHTML = FWINFO_DATA.FirmwareBuildDate + " " +
			FWINFO_DATA.FirmwareBuildTime;

		if(bcd_to_decimal(FWINFO_DATA.FirmwareRevision2) < 10)
			fwRev.innerHTML = getbits(FWINFO_DATA.FirmwareRevision1,6,0) + ".0" + bcd_to_decimal(FWINFO_DATA.FirmwareRevision2) + "." + FWINFO_DATA.AuxFirmwareRevision;
		else
			fwRev.innerHTML = getbits(FWINFO_DATA.FirmwareRevision1,6,0) + "." + bcd_to_decimal(FWINFO_DATA.FirmwareRevision2) + "." + FWINFO_DATA.AuxFirmwareRevision;
	}
}

function bcd_to_decimal(bcd_value)
{
	var lsnibble = bcd_value % 16;
	var msnibble = (bcd_value - lsnibble) / 16;
	return ((msnibble * 10) + lsnibble);
}

function getNetworkInfo()
{
	xmit.get({url:"/rpc/getalllancfg.asp", onrcv:getNetworkInfoRes});
}

function getNetworkInfoRes (arg)
{
	var i;
	var varIPSource;
	switch (arg.HAPI_STATUS) {
	case 0:
		LANCFG_DATA = WEBVAR_JSONVAR_GETALLNETWORKCFG.WEBVAR_STRUCTNAME_GETALLNETWORKCFG;
		tblPermissionDeny.style.display = "none";
		tblNetworkInfo.style.display = "";

		IPAddr = top.fnCookie.read('BMC_IP_ADDR');
		for (i = 0; i < LANCFG_DATA.length; i++) {
			if(eVal.ip(IPAddr)) {
				if (((LANCFG_DATA[i].lanEnable == 1) || (LANCFG_DATA[i].v6Enable == 1)) && eVal.compareip(LANCFG_DATA[i].v4IPAddr,IPAddr)) {
					break;
				}
			} else {
				if (((LANCFG_DATA[i].lanEnable == 1) || (LANCFG_DATA[i].v6Enable == 1)) && (LANCFG_DATA[i].v6IPAddr == IPAddr)) {
					break;
				}
			} 
		}

		if (i == LANCFG_DATA.length) {
			i = 0;
		}

		lblMACAddr.innerHTML = LANCFG_DATA[i].macAddress;
		if (LANCFG_DATA[i].lanEnable)
		{
			if (LANCFG_DATA[i].v4Enable) {
				varIPSource = getbits(LANCFG_DATA[i].v4IPSource,3,0);
				switch (varIPSource) {
				case 0x0: case 0x1: case 0x2:
					lblIPv4Mode.innerHTML = eLang.getString("common",
						"STR_NW_ADDR_MODE_" + varIPSource);
				break;
				default:
					lblIPv4Mode.innerHTML = eLang.getString("common",
						"STR_NW_ADDR_MODE_0");
				}
				rowIPv4Addr.className = "visibleRow";
				lblIPv4Addr.innerHTML = LANCFG_DATA[i].v4IPAddr;
			} else {
				lblIPv4Mode.innerHTML = eLang.getString("common", "STR_DISABLE");
				rowIPv4Addr.className = "hiddenRow";
				lblIPv4Addr.innerHTML = "";
			}

			if (LANCFG_DATA[i].v6Enable) {
				varIPSource = getbits(LANCFG_DATA[i].v6IPSource,3,0);
				switch (varIPSource) {
				case 0x0: case 0x1: case 0x2:
					lblIPv6Mode.innerHTML = eLang.getString("common",
						"STR_NW_ADDR_MODE_" + varIPSource);
				break;
				default:
					lblIPv6Mode.innerHTML = eLang.getString("common",
						"STR_NW_ADDR_MODE_0");
				}
				rowIPv6Addr.className = "visibleRow";
				lblIPv6Addr.innerHTML = LANCFG_DATA[i].v6IPAddr;
			} else {
				lblIPv6Mode.innerHTML = eLang.getString("common", "STR_DISABLE");
				rowIPv6Addr.className = "hiddenRow";
				lblIPv6Addr.innerHTML = "";
			}
		}
	break;

	case 0x1D4:
		tblNetworkInfo.className = "hiddenRow";
		tblPermissionDeny.className = "visibleRow";
		permissionDeny.innerHTML = eLang.getString("common",
			"STR_PERMISSION_DENIED");
	break;

	case 0xE2:	case 0xE3:
		errstr = eLang.getString("common", "STR_CONF_NW_GETVAL");
		errstr += (eLang.getString("common", "STR_CONF_NW_ERR_" +
			arg.HAPI_STATUS));
		alert(errstr);
	break;
	case null:
	break;
	default:
		errstr = eLang.getString("common", "STR_CONF_NW_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			arg.HAPI_STATUS);
		alert(errstr);
	return;
	}
}

IMG_WARNING = "<img src='../res/status_warning.png' title='Warning' width='14' height='14' border='0'/>";
IMG_OK = "<img src='../res/status_ok.png' width='14' title='Normal' height='14' border='0'/>";
IMG_CRITICAL = "<img src='../res/status_critical.png' title='Critical' width='14' height='14' border='0'/>";
IMG_VIEW = "<img src='../res/view.gif' border='0'/>";
IMG_NOT_AVAILABLE = "<img src='../res/status_not_available.png' width='14' title='NotAvailable' height='14' border='0'/>";

function buildDashboardTable()
{
	SENSORINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSENSORS.WEBVAR_STRUCTNAME_HL_GETALLSENSORS;
	var tbl = document.createElement("table");
	tbl.className = "dashboard_tbl";

	var tbdy = document.createElement("tbody");
	tbl.appendChild(tbdy);

	cellspacing = document.createAttribute("cellspacing");
	cellspacing.nodeValue = 0;
	cellpadding = document.createAttribute("cellpadding");
	cellpadding.nodeValue = 6;
	tbl.setAttributeNode(cellspacing);
	tbl.setAttributeNode(cellpadding);
	tbl.border = "0";

	var thead = tbl.createTHead().insertRow(0);
	tbdy.appendChild(thead);
	var th = document.createElement("th");
	th.innerHTML = "Status";
	thead.appendChild(th);
	var th = document.createElement("th");
	th.innerHTML = "Sensor";
	thead.appendChild(th);
	var th = document.createElement("th");
	th.innerHTML = "Reading";
	thead.appendChild(th);
	var th = document.createElement("th");
	thead.appendChild(th);

	for(var i=0; i<SENSORINFO_DATA.length; i++)
	{
		var tr = document.createElement("tr");
		tbdy.appendChild(tr);

		ss = getStateAndUnit(i);

		var td = tr.insertCell(0);
		/*
		if(ss.img==IMG_OK) tr.className = "";
		else if(ss.img==IMG_CRITICAL) tr.className = "critical";
		else if(ss.img==IMG_WARNING) tr.className = "warning";
		*/
		td.align = "center";
		td.innerHTML = ss.img;
		td.className = "lastcell";
		var td = tr.insertCell(1);
		td.innerHTML = SENSORINFO_DATA[i].SensorName;
		td.className = "lastcell";
		var td = tr.insertCell(2);
		td.innerHTML = ss.SensorReading+" "+ss.unitstr;
		td.className = "lastcell";
		var td = tr.insertCell(3);
		td.innerHTML = "<a href='sensor_readings.html?id=" + i + "'>" + IMG_VIEW + "</a>";
		td.className = "lastcell";
	}

	infoRight.appendChild(packWithRoundedTable(tbl));

	loadLibrary("graph","javascript",drawEventsGraph);
}

function getStateAndUnit(j)
{
	if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
	{
		unitstr = "";
		SensorReading = eLang.getString("common","STR_NOT_AVAILABLE");
	}
	else
	{
		unitstr = eLang.getString("unittype",SENSORINFO_DATA[j].SensorUnit2);
		SensorReading = (SENSORINFO_DATA[j].SensorReading)/1000;
	}

	if(SENSORINFO_DATA[j].SensorState)
	{
		state = "";
		img = "";
		for (whichbit = 0; whichbit <= 7; ++whichbit)
		{
			if (SENSORINFO_DATA[j].SensorState & (0x01 << whichbit))
			{
				state = state + eLang.getString("threshstate",(0x01 << whichbit)) + " ";

				if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
					img = IMG_NOT_AVAILABLE;
				else if((0x01 << whichbit) == 0x01)
					img = IMG_OK;
				else if((0x01 << whichbit) == 0x00 || (0x01 << whichbit) == 0x02 || (0x01 << whichbit) == 0x08)
					img = IMG_WARNING;
				else
					img = IMG_CRITICAL;
			}
		}
	}
	else
	{
		img = IMG_OK; 
		state = "";
		DiscreteSensorReading = SensorReading;
		if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
			img = IMG_NOT_AVAILABLE;
		else if ((SENSORINFO_DATA[j].DiscreteState >= 0x02) && (SENSORINFO_DATA[j].DiscreteState <= 0x0C))
		{
			for(whichbit = 0;whichbit <= 7 && DiscreteSensorReading;whichbit++)
			{
				if(DiscreteSensorReading & 0x01)
				{
					state = state + eLang.getString("event",SENSORINFO_DATA[j].DiscreteState,whichbit) + " ";
					img = IMG_CRITICAL;
				}
				DiscreteSensorReading = DiscreteSensorReading >> 1;
			}
		}
		else if (0x6F == SENSORINFO_DATA[j].DiscreteState)
		{

			for(whichbit = 0;whichbit <= 7 && DiscreteSensorReading;whichbit++)
			{
				if(DiscreteSensorReading & 0x01)
				{
					state = state + eLang.getString("sensor_specific_event",SENSORINFO_DATA[j].SensorType,whichbit) + " ";
					img = IMG_CRITICAL;
				}
				DiscreteSensorReading = DiscreteSensorReading >> 1;
			}
		}

		
		SensorReading = ConvertDiscreteReading(SensorReading);
		unitstr = "";
		if (!state)
			state = eLang.getString("common","STR_APP_STR_ALL_DEASSERTED");
	}

	if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
	{
		unitstr = "";
		SensorReading = eLang.getString("common","STR_NOT_AVAILABLE");
	}
	else
	{
	}

	if(!state) state = eLang.getString("common","STR_NOT_AVAILABLE");

        if(img == IMG_CRITICAL)
        {
                ExceptionSensorEvent(state);
        }
	return {"state":state, "unitstr":unitstr, "SensorReading": SensorReading, "img":img};
}

function ExceptionSensorEvent(sensor_event)
{
        if(sensor_event == "Processor Presence Detected ")
        {
                img = IMG_OK;
        }
        if(sensor_event == "Presence Detected ")
        {
                img = IMG_OK;
        }
}

function drawEventsGraph()
{
	if(graph.loaded)
	{
		var gphSet = {};
		gphSet.bgColor = "rgba(255,255,255,1)";
		gphSet.width = 150;
		gphSet.height = 150;
		gphSet.borderWidth = 0;
		gphSet._gX = 0;
		gphSet._gY = 0;
		gphSet.canvasName = "graphCanvas";
		gphSet.radius = 90;
		gphSet.graphTitle = "";

		createEventGraph(gphSet, true);
	}
}
