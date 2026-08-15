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

/*
File 		- widget.js
Module 		- IWISP Library
Author		- chandrasekarr@amiindia.co.in
*/

var widgets = [];

function widget(id, widget_width)
{
	var curWindow = window.frames[0].document.body;

	if (widget_width==undefined) {
		widget_width = 220;
	}

	//constrained by screensize for short time
	var max_widgets = Math.floor((curWindow.clientWidth - 50) / widget_width);
	if (widgets.nullLessLength() >= max_widgets) {
		alert(eLang.getString("common", "STR_WIDGET_MAX_COUNT"));
		return false;
	}

	if (widgets[id] != undefined && widgets[id] != null) {
		return document.getElementById("widget_" + id);
	}

	this.container = document.createElement("iframe");
	this.container.frameBorder = "0";
	this.container.id = "widget_" + id;
	this.container.className = "widget";

	this.container.src = "../page/widget_page.html?id=" + id;
	document.body.appendChild(this.container);
	this.autoPosition();
	widgets[id] = this;
	return this;
}

widget.prototype.isWidget = true;

widget.prototype.autoPosition = function()
{
	this.autoPositionLeft();
	this.autoPositionTop();
}

widget.prototype.autoPositionTop = function()
{
	var scrollbarHeight = 0;
	var curWindow = window.frames[0].document.body;

	if (curWindow.clientWidth != curWindow.scrollWidth) {
		scrollbarHeight = 18;
	}

	this.container.style.top = (document.body.clientHeight -
		this.container.offsetHeight - scrollbarHeight) + "px";
}

widget.prototype.autoPositionLeft = function()
{
	this.container.style.left = (widgets.nullLessLength() * (this.container.offsetWidth+10))+'px';
}

widget.prototype.close = function()
{
	document.body.removeChild(this.container);
	//force unload events;
	this.container.src = '../page/blank.html';


	for(var j=0; j<widgets.length; j++)
	{
		if(widgets[j]!=null && widgets[j]!="")
		{
			if(widgets[j]==this)
			{
				widgets[j] = null;
				break;
			}
		}
	}

	try{ pageFrame.widgetListener(j); }catch(e){}

	delete this.container;
	try{
		delete this;
	}catch(e){}
	reposition_all_widgets();
}

closeAllWidgets = function()
{
	for(var i=0; i<widgets.length; i++)
	{
		if(widgets[i]!=null && widgets[i]!="")
			widgets[i].close();
	}
}

function reposition_all_widgets()
{
	var count = 0;
	var scrollbarHeight = 0;
	var curWindow = window.frames[0].document.body;

	if (curWindow.clientWidth != curWindow.scrollWidth) {
		scrollbarHeight = 18;
	}

	for (var j=0; j<widgets.length; j++) {
		try {
			if(widgets[j] != null && widgets[j] != "") {
				widgets[j].container.style.left = ((count++) *
					(widgets[j].container.offsetWidth + 10)) + "px";
				widgets[j].container.style.top = (document.body.clientHeight -
					widgets[j].container.offsetHeight - scrollbarHeight) + "px";
			}
		} catch(e) {
			delete widgets[j];
		}
	}
	
/*
 * It will intimate user at the time of browser resize to optimize
 * the browser area, if maximum no.of widgets are opened.
 * To avoid firefox crash, added the 500 milliseconds while resize
 * the browser window.
 */	
	var max_widgets = Math.floor((curWindow.clientWidth - 50) / 220);
	if (widgets.nullLessLength() > max_widgets) {
		if (firefox) {
			setTimeout(function() {
				alert(eLang.getString("common", "STR_WIDGET_MAXIMIZE_SIZE"));
			}, 500);
		} else {
			alert(eLang.getString("common", "STR_WIDGET_MAXIMIZE_SIZE"));
		}
	}
}