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
var action;
var current_state;
//var MaxRetries = 3;
function doInit()
{
	exposeElms(['_statusMsg',
			'_turnOn',
			'_turnOff',
			'_prfmAction']);

	if(!top.user.isAdmin())
		disableActions();

	_begin();
}

function _begin()
{
	getUidStatus();

	if(top.user.isAdmin())
	{
		turnOn.onclick = function ()
		{
			action = 1;
			prfmAction.disabled = false;
//			alert(action);
		};
		turnOff.onclick = function ()
		{
			action = 0;
			prfmAction.disabled = false;
//			alert(action);
		};
		prfmAction.onclick = setUidAction;
	}
}

function getUidStatusRes(arg)
{
	
	if(arg.HAPI_STATUS)
	{
		errstr = eLang.getString('common','STR_UID_CONTROL_GETSTATUS')
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+ GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		var res = WEBVAR_JSONVAR_HL_UID_STATUS.WEBVAR_STRUCTNAME_HL_UID_STATUS;

		if(res.length)
			current_state = res[0].uid_status;
		else
		{
			prfmAction.disabled = true;
			return;
		}

		if(current_state == 0)
		{
			statusMsg.innerHTML = "OFF";
//			statusMsg.style.color = '#990000';

			turnOff.checked = true;
			if(top.user.isAdmin())
			{
				turnOn.disabled = false;
			}
			action = 0;
		}
		else
		{
			statusMsg.innerHTML = "ON";
//			statusMsg.style.color = '#009900';

			turnOn.checked = true;
			if(top.user.isAdmin())
			{
				turnOff.disabled = false;
			}
			action = 1;
		}
	}
}

function getUidStatus()
{
	xmit.get({url:"/rpc/uidstatus.asp",onrcv:getUidStatusRes, status:''});
}

function setUidStatusRes(arg)
{
	if(arg.HAPI_STATUS)
	{
		errstr = eLang.getString('common','STR_UID_CONTROL_SETACTION')
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+ GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
	else
	{
		showWait(true,eLang.getString('common','STR_UID_CONTROL_SET_WAIT'));
		//getUidStatus();
		setTimeout("getUidStatus()", 5000);
	}
}

function setUidAction()
{
	if (top.user.isAdmin())
	{
//		alert(action);
		var req = new xmit.getset({url:"/rpc/uidctl.asp",onrcv:setUidStatusRes});
		req.add("WEBVAR_UID_CMD", action);
		req.send();
		delete req;
	}
	else
		alert(eLang.getString('common','STR_CONF_ADMIN_PRIV'));
}
