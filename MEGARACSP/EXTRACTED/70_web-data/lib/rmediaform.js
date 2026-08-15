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

/* Module: Dynamic Table Form for Remote Media
 * Version: 1.0
 * Author	: Kirankumar B
 * Email 	: kirankumarb@amiindia.co.in
 * Filename: ./lib/rmediaform.js   Comments: Contains logic for Table based HTML Form of Remote Media
 */

// javascript class form
var DataModified=false;
function mediaform(name,method,action,className)        // main paramter name,method,action,className
{
	this.frmObj = document.createElement('form');
	this.tblObj = document.createElement('table');
	this.tblObj.cellSpacing = 0;
	this.tblObj.cellPadding = 0;
	this.tblObj.border = 0;
	this.tblObj.width = '100%';
	this.tBdyObj = document.createElement('tbody');
	this.tBdyObj.className = className;

	this.frmObj.id = name;
	this.frmObj.name = name;
	this.frmObj.method = method;
	this.frmObj.action = action;
	this.frmObj.className = className;
	
}

mediaform.prototype.addRow = function(tag,content,desc)
{
	var tr = document.createElement('tr');
	tr.style.height = "25px";
	tr.className = this.className;

	//left side
	var td1 = document.createElement('td');
	td1.style.width = "40%"
	td1.className = this.className+'_left';
	td1.innerHTML = tag;
	td1.style.padding = "5px";
	//right side
	var td2 = document.createElement('td');
	td2.className = this.className+'_right';
	if(typeof content=='string' || typeof content=='number')
		td2.innerHTML = content;
	else
		td2.appendChild(content);

	if(desc!='' && desc!=undefined)
	{
		var small = document.createElement('label');
		small.className = this.className;
		small.innerHTML = "&nbsp;" + desc;
		td2.appendChild(small);
	}

	tr.appendChild(td1);
	tr.appendChild(td2);

	return tr;
}
isIE = (navigator.appName.indexOf('Microsoft')!=-1);
mediaform.prototype.addCheckBox = function(tag,name,valueary,linebreak,chkedary,param,extra)
{
	var checkBoxes={};
	var span = document.createElement('span');
	var chked = false;
	span.id = name + 'Span';

	for(j in valueary)
	{
		var input = document.createElement('input');
		input.name = j;
		input.type = 'checkbox';
		input.id = j;
		input.value = valueary[j];
		input.className = this.className;

		if (chkedary != undefined || chkedary != null){
			chked = ((chkedary.indexOf(j) != -1) ? true : false);
		}
		if(chked == true)
		{
			input.checked = true;
		}			// end checks

		for(i in param)		// add all param
		{
			input[i] = param[i];
		}
		var lbl = document.createElement('label');
		lbl.innerHTML = valueary[j];
		lbl.htmlFor = j;

		span.appendChild(input);
		span.appendChild(lbl);
		if(linebreak)
		{
			var br = document.createElement('br');
			span.appendChild(br);
		}

		checkBoxes[input.name] = input;
	}	
	
	tbl=this.addTableBody();
	
	var tabtr = document.createElement('tr');
	//tabtr.style.backgroundColor="Grey";
	//tabtr.className="tabHeader";
	var tabtd = document.createElement('td');
	tabtd.colSpan=2;	
	var label = document.createElement('label');
	label.innerHTML="<h3>Local Media</h3>";
	
	tabtd.appendChild(label);
	tabtr.appendChild(tabtd);
	
	tbl.appendChild(tabtr);
	
	tbl.appendChild(this.addRow(tag,span,extra));
	return checkBoxes;
}

mediaform.prototype.addTableBody= function() {
	
	var tr = document.createElement('tr');
	//left side
	var td = document.createElement('td');
	td.colSpan = 2;

	var innerTbl=document.createElement('table');
	innerTbl.cellSpacing = 0;
	innerTbl.cellPadding = 0;
	innerTbl.border = 0;
	innerTbl.width = '100%';
	td.appendChild(innerTbl);
	tr.appendChild(td);

	this.tBdyObj.appendChild(tr);

	return innerTbl;
}

mediaform.prototype.display = function()
{
	this.tblObj.appendChild(this.tBdyObj);
	this.frmObj.appendChild(this.tblObj);
	return this.frmObj;
}

mediaform.prototype.createinputcontrol=function(itype,i,txtValue,maxlength,isDisabled) {
		var td = document.createElement('td');
		var sinput = document.createElement('input');
		sinput.type = itype;
		sinput.name = "txtinput" + i;
		sinput.id = "txtinput" + i;
		sinput.disabled=isDisabled;
		sinput.value=txtValue;
		sinput.className="TxtBox";
		sinput.maxlength=maxlength;
		//if(itype=="password"){
		sinput.onchange=CheckDataModified;
		//}
		td.style.padding = "5px";
		td.appendChild(sinput);
		return td;
}
mediaform.prototype.createselectcontrol=function(i,txtValue) {
		var td = document.createElement('td');
		var stype = document.createElement('select');
		var valShrType = {0:"NFS", 1:"Samba(CIFS)"};
		
		for(j in valShrType) {
			var option = document.createElement("option");
			option.text = valShrType[j];
			option.value = j;
			stype.appendChild(option);
		}
		stype.onchange = ChangeShareType;
		stype.name = "sinput2" + i;
		stype.id = "sinput2" + i;
		stype.value=txtValue;
		stype.className="TxtBox";
		td.appendChild(stype);
		return td;
}
mediaform.prototype.createsettingHeader=function(header) {
	var trheadermtype = document.createElement('tr');
	//trheadermtype.className="tabHeader";
	var td = document.createElement('td');
	td.innerHTML="<h3>" + header + "</h3>";
	td.colSpan = 6;
	trheadermtype.appendChild(td);
	return trheadermtype;
}
mediaform.prototype.SettingColumnHeader=function(colheader) {
	var trconfigheaders = document.createElement('tr');
	for (j = 0; j < colheader.length; j++) {
		var tdheader = document.createElement('td');
		tdheader.innerHTML = colheader[j];
		tdheader.style.width = "50%";
		tdheader.style.padding = "5px";
		trconfigheaders.appendChild(tdheader);
	}
	return trconfigheaders;
}
mediaform.prototype.isDataModified= function () {
	DataModified=true;
	return DataModified;
}
