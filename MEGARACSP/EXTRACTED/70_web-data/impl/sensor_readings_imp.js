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

var sensorResultsTable;
var showThresholds;
var SENSORINFO_DATA;
var SELINFO_DATA;
var tblJSON;
var gCurSensor = 0x00;
var firstTime = true;
var gCurId = 0x00;
var setID = 0x00;
var CONST_SETTABLE_FLAG = {
		UNR : 0x2000,
		UC : 0x1000,
		UNC : 0x0800,
		LNR : 0x0400,
		LC : 0x0200,
		LNC : 0x0100
	};

function doInit()
{
	 // TODO: add page initialization code
	 exposeElms(['_infoLeft',
	 			'_infoRight',
	 			'_sensorType',
	 			'_sensorState',
	 			'_sensorName',
	 			'_lowerNR',
	 			'_lowerC',
	 			'_lowerNC',
	 			'_lowerNR',
	 			'_upperC',
	 			'_upperNC',
	 			'_upperNR',
	 			'_lblHeader',
	 			'_widgetStatus',
	 			'_toggleWidget',
	 			'_btnThresholdSettings',
	 			'_showEventLog']);

	gSensorTypeCodes = eLang.getString('common',"STR_SENSOR_TYPES");
	 
	if (top.user.pno > top.CONSTANTS.USER) {
		if (checkProjectCfg("SET_SENSOR_THRESHOLDS")) {
			btnThresholdSettings.className = "visibleRow";
			btnThresholdSettings.onclick = doAdvancedThreshold;
		}	
	 }
	 
	 _begin();
}

function _begin()
{
	sensorResultsTable = listgrid({
		w				: '100%',

		doAllowNoSelect : false
	});

	infoLeft.appendChild(sensorResultsTable.table);
	loadCustomPageElements();
	getSELInfo();
}

function getSELInfo()
{
	sensorType.disabled = false;
	btnThresholdSettings.disabled = false;
	showEventLog.disabled = false;
	xmit.get({url:'/rpc/getallselentries.asp', onrcv:function(arg)
	{
		if(arg.HAPI_STATUS)
		{
			errstr = eLang.getString('common',"STR_EVENT_LOG_GETVAL");
			errstr +=  (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}else
		{
			SELINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSELENTRIES.WEBVAR_STRUCTNAME_HL_GETALLSELENTRIES;
		}
		getSensorsInfo();
	}});
}

function loadCustomPageElements()
{
	sensorResultsTable.clear();

	tblJSON = {
				cols:[
					{text:"Sensor Name", fieldName:'name', w:'35%'},
					{text:"Status", fieldName:'status', w:'35%'},
					{text:"Current Reading", fieldName:'reading', w:'30%'}
					]
					};

	sensorResultsTable.loadFromJson(tblJSON);
	sensorResultsTable.table.style.width = "100%";
	sensorResultsTable.onrowselect = showSensorDetails;
	sensorResultsTable.ondblclick = doToggleWidget;

	sensorType.onchange = function()
	{
		gCurSensor = sensorType.options.selectedIndex;
		updateSensors();
		graph.reposition();
	}
}

function updateSensors()
{
	var count = 0;
	var j = 0;
	var unitstr;
	var state;
	var SensorReading;

	var JSONRows = new Array();
	tblJSON.rows = new Array();

	sensorResultsTable.clear();
	for(j=0;j<SENSORINFO_DATA.length;j++)
	{
		if((SENSORINFO_DATA[j].SensorType == sensorType.value) || (sensorType.value == 0))
		{
			var suo = getStateAndUnit(j);

			state = suo.state;
			unitstr = suo.unitstr;
			SensorReading = suo.SensorReading;
			JSONRows.push({cells:[
						{text:SENSORINFO_DATA[j].SensorName, value:SENSORINFO_DATA[j].SensorName},
						{text:state, value:state},
						{text:(SensorReading)+" "+unitstr, value:(SensorReading)+" "+unitstr}
						]});
			count++;
		}
	}

	tblJSON.rows = JSONRows;

	sensorResultsTable.loadFromJson(tblJSON);

	lblHeader.innerHTML = "<strong class='st'>"+eLang.getString('common',"STR_SENSOR_CNT")+"</strong>"+
							count+eLang.getString('common',"STR_SENSOR_SENSORS");

	var r=1;
	if(firstTime && HTTP_GET_VARS['id'])
	{
		gCurId = HTTP_GET_VARS['id'];

		while(sensorResultsTable.container.rows[r])
		{
			if(sensorResultsTable.container.rows[r].cells[0].innerHTML.replace('&nbsp;','')==SENSORINFO_DATA[gCurId].SensorName)
			{
				break;
			}
			r++;
		}
	}
	
    /*  
     * This will let sensorResultsTable state still stay on before selected.
     * After launch Threshold Setting.
    */                                                                                                                                                                                                                                       
	if (setID) {
		r = setID+1;
		setID = 0x00;
	}
	
	sensorResultsTable.container.rows[r].onclick();
}

function widgetListener(rid)
{
	if(rid==gCurId)
	{
		widgetStatus.innerHTML = "Off";
		toggleWidget.innerHTML = "On";
	}
}

function doToggleWidget()
{
	var sname = sensorResultsTable.getRow(sensorResultsTable.selected[0]).cells[0].innerHTML.replace('&nbsp;','');
	var id = getSensorID(sname);

	if(SENSORINFO_DATA[id].SensorState)		//doToggleWidget for Threshold sensors.
	{
		wStatus = (parent.widgets[id]==null || parent.widgets[id]=="");
		if(wStatus)
		{
			parent.createWidget(id);
			if(parent.widgets[id].container!=undefined)
			{
				widgetStatus.innerHTML = "On";
				toggleWidget.innerHTML = "Off";
			}
			else
			{
				delete parent.widgets[id]; //clear mem leak
				widgetStatus.innerHTML = "Off";
				toggleWidget.innerHTML = "On";
			}
		}else
		{
			parent.widgetClose[id]();
			parent.widgets[id].close();
			delete parent.widgets[id]; //clear mem leak
			delete parent.widgetClose[id]; //clear mem leak
			widgetStatus.innerHTML = "Off";
			toggleWidget.innerHTML = "On";
		}
	}
}

function doAdvancedThreshold()
{
	var sname = sensorResultsTable.getRow(sensorResultsTable.selected[0]).
		cells[0].innerHTML.replace('&nbsp;','');
	setID = getSensorID(sname);
	frmAdvancedThreshold();
	loadAdvancedThreshold();
}

/*
 * This will design the UI controls for Advanced Threshold configuration form.
 */
function frmAdvancedThreshold()
{
	var frm = new form("advancedThresholdFrm", "POST", "javascript://", "general");
	txtLNR = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_LNR"),"_txtLNR", "", {"maxLength":10}, "classicTxtBox");
	txtLC  = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_LC") ,"_txtLC" , "", {"maxLength":10}, "classicTxtBox");
	txtLNC = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_LNC"),"_txtLNC", "", {"maxLength":10}, "classicTxtBox");
	txtUNR = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_UNR"),"_txtUNR", "", {"maxLength":10}, "classicTxtBox");
	txtUC  = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_UC") ,"_txtUC" , "", {"maxLength":10}, "classicTxtBox");
	txtUNC = frm.addTextField(eLang.getString("sensor_readings", 
		"SENSOR_READ_UNC"),"_txtUNC", "", {"maxLength":10}, "classicTxtBox");
	
	var btnAry = [];
	btnAry.push(createButton("btnSave", eLang.getString("common","STR_SAVE"), isThresholdCfgChange));
	btnAry.push(createButton("btnCancel", eLang.getString("common","STR_CANCEL"), closeForm));
	wnd = MessageBox(eLang.getString("sensor_readings", "SENSOR_READ_THRESHOLD_SETTINGS")
		+" : "+ SENSORINFO_DATA[setID].SensorName, frm.display(), btnAry);
	wnd.onclose = getSELInfo;
}

/*
 * It will load response data from global variable to respective controls in UI.
 */
function loadAdvancedThreshold()
{
	/*
	txtLNR.value = SENSORINFO_DATA[setID].LowNRThresh/1000;
	txtLC.value  = SENSORINFO_DATA[setID].LowCTThresh/1000;
	txtLNC.value = SENSORINFO_DATA[setID].LowNCThresh/1000;
	txtUNR.value = SENSORINFO_DATA[setID].HighNRThresh/1000;
	txtUC.value  = SENSORINFO_DATA[setID].HighCTThresh/1000;
	txtUNC.value = SENSORINFO_DATA[setID].HighNCThresh/1000;
	*/
        var setfocus = true;

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.LNR)) {
                txtLNR.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtLNR.disabled = true;
        } else {
                txtLNR.focus();
                setfocus = false;
        }

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.LC)) {
                txtLC.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtLC.disabled = true;
        } else if (setfocus) {
                txtLC.focus();
                setfocus = false;
        }

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.LNC)) {
                txtLNC.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtLNC.disabled = true;
        } else if (setfocus) {
                txtLNC.focus();
                setfocus = false;
        }

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.UNR)) {
                txtUNR.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtUNR.disabled = true;
        } else if (setfocus) {
                 txtUNR.focus();
                 setfocus = false;
        }

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.UC)) {
                txtUC.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtUC.disabled = true;
        } else if (setfocus) {
                txtUC.focus();
                setfocus = false;
        }

        if (!(SENSORINFO_DATA[setID].SettableReadableFlags & CONST_SETTABLE_FLAG.UNC)) {
                txtUNC.value = eLang.getString("sensor_readings", "SENSOR_READ_NOT_SETTABLE");
                txtUNC.disabled = true;
        } else if (setfocus) {
                txtUNC.focus();
                setfocus = false;
        }
}

/*
 * This function is used to compare the configuration values with the data in 
 * the controls.
 */
function isThresholdCfgChange()
{
	if (txtLNR.value == (SENSORINFO_DATA[setID].LowNRThresh/1000)  &&
		txtLC.value  == (SENSORINFO_DATA[setID].LowCTThresh/1000)  &&
		txtLNC.value == (SENSORINFO_DATA[setID].LowNCThresh/1000)  &&
		txtUNR.value == (SENSORINFO_DATA[setID].HighNRThresh/1000) &&
		txtUC.value  == (SENSORINFO_DATA[setID].HighCTThresh/1000) &&
		txtUNC.value == (SENSORINFO_DATA[setID].HighNCThresh/1000) ) 
	{
			return;
	}
	validateThresholdCfg();
}

/*
 * This will validate all the UI controls value of Threshold configuration before 
 * saving it.
 */
function validateThresholdCfg()
{
	if (parseInt(txtLNR.value) > parseInt(txtLC.value)) {
		alert(eLang.getString("common", "STR_SENSOR_LNR_ERR"));
		txtLNR.focus();
		return false;
	}
	if (parseInt(txtLC.value) > parseInt(txtLNC.value)) {
		alert(eLang.getString("common", "STR_SENSOR_LC_ERR"));
		txtLC.focus();
		return false;
	}
	if (parseInt(txtLNC.value) > parseInt(txtUNC.value)) {
		alert(eLang.getString("common", "STR_SENSOR_LNC_ERR"));
		txtLNC.focus();
		return false;
	}
	if (parseInt(txtUNC.value) > parseInt(txtUC.value)) {
		alert(eLang.getString("common", "STR_SENSOR_UNC_ERR"));
		txtUNC.focus();
		return false;
	}
	if (parseInt(txtUC.value) > parseInt(txtUNR.value)) {
		alert(eLang.getString("common", "STR_SENSOR_UC_ERR"));
		txtUC.focus();
		return false;
	}
	
	setThresholdCfg();
	return true;
}

function setThresholdCfg()
{
	if (top.user.isAdmin() || top.user.isOperator()) {
		if(!confirm(eLang.getString("common", "STR_SENSOR_THRESHOLD_SETTINGSSET_CONFIRM")))
		{
			closeForm();
			return;
		}

		var req = new xmit.getset({url:"/rpc/setthreshold.asp", 
			onrcv:setThresholdCfgRes, status:""});
		req.add("SensorNumber", SENSORINFO_DATA[setID].SensorNumber);
		req.add("OwnerLUN", SENSORINFO_DATA[setID].OwnerLUN);
		req.add("SensorType", SENSORINFO_DATA[setID].SensorType);
		req.add("SettableReadableFlags", SENSORINFO_DATA[setID].SettableReadableFlags);
		req.add("LNR", txtLNR.value);
		req.add("LC" , txtLC.value );
		req.add("LNC", txtLNC.value);
		req.add("UNR", txtUNR.value);
		req.add("UC" , txtUC.value );
		req.add("UNC", txtUNC.value);
		req.send();
		delete req;
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setThresholdCfgRes(arg)
{
	var errstr;     //Error string
	switch(arg.HAPI_STATUS) {
	case 0xCC:
		errstr =  eLang.getString("common", "STR_SENSOR_SET_INVALID_RANGE");
		alert(errstr);
		break;
	case 0x0:
		alert(eLang.getString("common", "STR_SENSOR_SET_SUCCESS"));
                closeForm();
                break;
	default:
		errstr =  eLang.getString("common", "STR_SENSOR_SET_ERR");
                errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
                                GET_ERROR_CODE(arg.HAPI_STATUS));
                alert(errstr);            	

	}
}

function showSensorDetails(selectedRow)
{
	var id = getSensorID(selectedRow.cells[0].innerHTML.replace('&nbsp;',''));
	gCurId = id;

	var suo = getStateAndUnit(id);
	stateClass  = 'normal';

	sensorName.innerHTML = SENSORINFO_DATA[id].SensorName+": <font class='"+stateClass+"'>"+suo.SensorReading+" "+suo.unitstr+"</font>";
	sensorState.innerHTML =  suo.state;

	if(SENSORINFO_DATA[id].SensorState)
	{
		lowerNR.innerHTML = SENSORINFO_DATA[id].LowNRThresh/1000 +" "+ suo.unitstr;
		lowerC.innerHTML = SENSORINFO_DATA[id].LowCTThresh/1000 +" "+ suo.unitstr;
		lowerNC.innerHTML = SENSORINFO_DATA[id].LowNCThresh/1000 +" "+ suo.unitstr;
		upperNR.innerHTML = SENSORINFO_DATA[id].HighNRThresh/1000 +" "+ suo.unitstr;
		upperC.innerHTML = SENSORINFO_DATA[id].HighCTThresh/1000 +" "+ suo.unitstr;
		upperNC.innerHTML = SENSORINFO_DATA[id].HighNCThresh/1000 +" "+ suo.unitstr;

		//Widget Listener for threshold sensors.
		wStatus = (parent.widgets[id]==null || parent.widgets[id]=="");
		widgetStatus.innerHTML = !wStatus?"On":"Off";

		toggleWidget.innerHTML = !wStatus?"Off":"On";
		toggleWidget.onclick = doToggleWidget;
		if(top.user.pno == top.CONSTANTS.USER) { //displaying button in disabled mode for USER.
			btnThresholdSettings.disabled = true;
			btnThresholdSettings.className = "visibleRow";
		} else {
			btnThresholdSettings.disabled = false;
		}
	}
	else
	{
		lowerNR.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		lowerC.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		lowerNC.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		upperNR.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		upperC.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		upperNC.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");

		widgetStatus.innerHTML = eLang.getString('common',"STR_NOT_APPLICABLE");
		toggleWidget.innerHTML = '';
		btnThresholdSettings.disabled = true;
	}
	showEventLog.onclick = function()
	{
		location.href = "event_log.html?sid="+id;
	}

	try
	{
		graph.clearDataArea();
	}catch(e){
		gphSet = {};
		gphSet.bgColor = "rgba(255,255,255,1)";
		gphSet.width = 500;
		gphSet.height = 250;
		gphSet.borderWidth = 1;
		gphSet._gX = 50;
		gphSet._gY = 10;
		gphSet.canvasName = 'graphCanvas';
		gphSet.barHeight = 20;
		gphSet.barOffset = 10;
		gphSet.graphTitle = '';
		graph._init(gphSet.canvasName, gphSet);
		var diff=SELINFO_DATA.length/4;
		var scale=new Array();
		scale[0]=0;
		for(var i=0;i<4;i++)
			scale[i+1]=Math.round(diff+scale[i]);
		
		graph.drawXScale([scale[0],scale[1],scale[2],scale[3],SELINFO_DATA.length],'Number of Entries');
	
	}

	drawEventsGraph(SENSORINFO_DATA[id].SensorName);
}


function drawEventsGraph(name)
{
	//var sensor_specific=0;
	var discrete = 0;
	var other_events=0;
	var lnr=0;
	var lc=0;
	var lnc=0;
	var hnr=0;
	var hc=0;
	var hnc=0;

	var uniqueSensors = [];
	var uniqueEvents = [];

	for(i=0; i<SELINFO_DATA.length;i++)
	{
		if((id=uniqueSensors.indexOf(SELINFO_DATA[i].SensorName))==-1)
		{
			uniqueSensors.push(SELINFO_DATA[i].SensorName);
			uniqueEvents.push(1);
		}else
		{
			uniqueEvents[id]++;
		}

		if(SELINFO_DATA[i].SensorName==name)
		{
			var res = processEventRecordForGraph(SELINFO_DATA[i]);
			//sensor_specific += res.sensor_specific;
			discrete += res.discrete;
			other_events += res.other_events;
			lnr += res.lnr;
			lc += res.lc;
			lnc += res.lnc;
			hnr += res.hnr;
			hc += res.hc;
			hnc += res.hnc;
		}
	}

	delete uniqueSensors;

	gData = [];
	//gData.push({type:'SS',count:sensor_specific,color:'rgba(0,180,0,.7)'});
	gData.push({type:'Discrete',count:discrete,color:'rgba(0,180,0,.7)'});
	gData.push({type:'Other',count:other_events,color:'rgba(0,140,200,.7)'});
	gData.push({type:'UNC',count:hnc,color:'rgba(255,255,0,.7)'});
	gData.push({type:'UC',count:hc,color:'rgba(255,150,0,.7)'});
	gData.push({type:'UNR',count:hnr,color:'rgba(255,0,0,.7)'});
	gData.push({type:'LNC',count:lnc,color:'rgba(255,255,0,.7)'});
	gData.push({type:'LC',count:lc,color:'rgba(255,150,0,.7)'});
	gData.push({type:'LNR',count:lnr,color:'rgba(255,0,0,.7)'});

	graph.drawBarChart(gData,SELINFO_DATA.length);
}


function getSensorsInfoRes(arg)
{
	if (arg.HAPI_STATUS)
	{
		errstr = eLang.getString('common',"STR_SENSOR_GETVAL")
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}else
	{
		SENSORINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSENSORS.WEBVAR_STRUCTNAME_HL_GETALLSENSORS;
		if (!SENSORINFO_DATA.length)
		{
			alert(eLang.getString('common',"NO_SENSOR_STRING"));
			lblHeader.innerHTML = eLang.getString('common',"STR_SENSOR_CNT") + 
				(SENSORINFO_DATA.length) + eLang.getString('common',"STR_SENSOR_SENSORS");
			return;
		}

		optind = 0;
		sensorType.innerHTML = '';
		for(var i=0; i<gSensorTypeCodes.length; i++)
			if(sensorExists(i) || i==0x00)
				sensorType.add(new Option(gSensorTypeCodes[i],i),isIE?optind++:null);

		sensorType.options[gCurSensor].selected = true;
		if (top.mainFrame.pageFrame.location.hash)
			sensorType.value = comboParser(top.mainFrame.pageFrame.location.hash,sensorType.id);	//id->id of the selection box,0->2nd selectionbox id
		updateSensors();
	}
}

function getSensorsInfo()
{
	xmit.get({url:"/rpc/getallsensors.asp",onrcv:getSensorsInfoRes, status:'',timeout:120,ontimeout:timedOut});
}

function sensorExists(i)
{
	for(_ex=0; _ex<SENSORINFO_DATA.length; _ex++)
		if(SENSORINFO_DATA[_ex].SensorType == i)
			return true;

	return false;
}

function timedOut()
{
	alert(eLang.getString('common', "STR_TIME_OUT"));
}

function doSort(i,dir)
{
	sensorResultsTable.sortCol(i,dir);
}

/*
 * Used to close the form which is used to add or modify the role group and                                                                                                                                                                  
 * used to configure the Threshold information.
 */
function closeForm()
{
    wnd.close();
}

