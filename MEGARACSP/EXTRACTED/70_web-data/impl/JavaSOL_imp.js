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

// File Name  : JavaSOL
// Brief      : 
// Author Name:

var cell = 0;

function doInit()
{
	exposeElms(["_JavaSOL"]);
	_begin();
}

function _begin()
{	
    tcell = JavaSOL.insertCell(cell++);
	tcell.innerHTML = "<input type='button' id='_btnJavaSOL' value='" + eLang.getString("common", "STR_JAVA_SOL") +"' onclick='doLaunchJavaSOL()'/>";
	if(!top.user.isKVM()) {
		disableActions();
	}
}

doLaunchJavaSOL = function()
{
	window.open(top.gPageDir + "JavaSOL_launch.html","JavaSOL","toolbar=0, resizable=yes, " + "width=400, height=110, left=350, top=300");
}
