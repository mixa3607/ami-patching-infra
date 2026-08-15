//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2011        **;
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

var BMCCOUNT;			//It holds the get RPC number of BMC Inst response data
var SELECTEDNODE;

/*
 * This function will be called when its corresponding page gets loaded.
 * It will expose all the user controls and checks for user privilege.
 * Finally it will invoke the begin method. 
 */
function doInit()
{
	exposeElms(["_tblNode",
		"_lblCurNode"]);
	_begin();
}

/*
 * It will invoke the RPC method to get the data for the page.
 */
function _begin()
{
	getNumOfBMCInst();
}

/*
 * It will invoke the RPC method to get the number of BMC Inst.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function getNumOfBMCInst()
{
	xmit.get({url:"/rpc/getnumofbmcinst.asp", onrcv:getNumOfBMCInstRes, status:""});
}

/*
 * This is the response function for getnumofbmcinst RPC. 
 * Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
 * If success, move the response data to the global variable and invoke the 
 * method to load the data value in UI. 
 * @param arg object, RPC response data from xmit library
 */
function getNumOfBMCInstRes(arg)
{
	var errstr;		//Error string
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_MULTI_BMCINST_GETVAL");
		errstr +=(eLang.getString("common", "STR_ERROR_CODE") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
		return;
	}
	BMCCOUNT = WEBVAR_JSONVAR_GETNUMOFBMCINST.WEBVAR_STRUCTNAME_GETNUMOFBMCINST[0].BMC_INST_COUNT;
	lblCurNode.innerHTML= top.gActiveBMCInst;

	createNodeTable();
}

function createNodeTable()
{
	var nodeTable = document.getElementById("_tblNode");
	for(var count=1;count<=BMCCOUNT;count++)
	{
        var row = nodeTable.insertRow(-1);

        var cell = row.insertCell(-1);
		var element='<input type ="radio" name="rdoNodeSelect" id="rdoNodeSelect' + count + '"';
		element += 'onclick="validateNodeSelected()" />';
		if( 1 == count )
			element +="System";
		else
			element +="Node " + (count-1);
		cell.innerHTML=element;
	}
	setCurNodeName();
}

function validateNodeSelected()
{
	for(var count=1;count<=BMCCOUNT;count++)
	{
		node="rdoNodeSelect"+count;
		if( (document.getElementById(node).checked==true) && (count != top.gActiveBMCInst))
		{
			SELECTEDNODE=count;
			setNode();
			break;
		}
	}
}

function setCurNodeName()
{
	var node="rdoNodeSelect"+top.gActiveBMCInst;
	document.getElementById(node).checked=true;
	if( 1 == top.gActiveBMCInst )
		lblCurNode.innerHTML = "System";
	else
		lblCurNode.innerHTML = (top.gActiveBMCInst -1);
}

function setNode()
{
	if (top.user.isAdmin()) {
		if(confirm(eLang.getString("common", "STR_MULTI_BMCINST_SET_NODE_CONFIRM"))) {
			var req = new xmit.getset({url:"/rpc/setbmcinst.asp", 
				onrcv:setNodeRes, status:""});
			req.add("SELECTED_NODE", SELECTEDNODE);
			req.send();
			delete req;
		} else {
			setCurNodeName();
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

function setNodeRes(arg)
{
	var errstr;		//Error string
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		errstr = eLang.getString("common", "STR_MULTI_BMCINST_SETVAL");
		errstr += eLang.getString("common", "STR_ERROR_CODE") + 
				GET_ERROR_CODE(arg.HAPI_STATUS);
		top.gActiveBMCInst=1;
		setCurNodeName();
		top.mainFrame.location.href = "../page/main.html";
		alert(errstr);
	} else {
		top.gActiveBMCInst=SELECTEDNODE;
		setCurNodeName();
		top.mainFrame.location.href = "../page/main.html";
		alert(eLang.getString("common", "STR_MULTI_BMCINST_SET_NODE_SUCCESS"));
	}
}

