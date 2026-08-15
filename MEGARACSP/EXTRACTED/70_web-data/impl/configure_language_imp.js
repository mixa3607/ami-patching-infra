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

function doInit()
{
	exposeElms(['_lbllanguage',
		    '_lstlangSetting',
		       '_lbldefaultlanguage',
		    '_lstdefaultlangSetting',
				'_saveBtn']);

	if(top.user.isAdmin())
	{
		lstlangSetting.onchange = enableLang;
		lstdefaultlangSetting.onchange = enableLang;
		saveBtn.onclick = setLangCfg;
	}
	else
		disableActions();

	_begin();
}

function _begin()
{
	var lang_index = 0;
	var deflang_index = 0;
	var txt = " ";
	var def_txt = " ";
	var Lang_tmp = " ";

	getLangCfg();
        Lang_tmp = top.gLangSetting;
        lbllanguage.innerHTML = eLang.title_strings[Lang_tmp];
        Lang_tmp = top.default_Lang[0].DEFAULTLANG;
        lbldefaultlanguage.innerHTML = eLang.title_strings[Lang_tmp];

	txt = top.gLangSetting;
	lstlangSetting.add(new Option( eLang.title_strings[txt] , lang_index),
			isIE ? lang_index : null);
	for(lang_index = 1; lang_index < eLang.support.length; lang_index++)
	{
		txt = eLang.support[lang_index];
		if(txt != top.gLangSetting)
		{
			lstlangSetting.add(new Option( eLang.title_strings[txt] , lang_index),
				isIE ? lang_index : null);
		}
	}
	def_txt = top.default_Lang[0].DEFAULTLANG;
	lstdefaultlangSetting.add(new Option( eLang.title_strings[def_txt] , deflang_index),
                        isIE ? deflang_index : null);
	for(deflang_index = 1; deflang_index < eLang.support.length; deflang_index++)
	{	
		def_txt = eLang.support[deflang_index];	
		if(def_txt != top.default_Lang[0].DEFAULTLANG)
		{
			lstdefaultlangSetting.add(new Option( eLang.title_strings[def_txt] , deflang_index),
				isIE ? deflang_index : null);
		}
	}
		_saveBtn.disabled = true;
}

function getLangCfg()
{
	xmit.get({url:"/rpc/getdefaultlangcfg.asp", onrcv:getDefaultLangCfgRes,	//getdefaultlangcfg.asp
                status:""});
}

function getDefaultLangCfgRes(arg)
{
	if(arg.HAPI_STATUS != 0) {
		alert("There is an error occured when getting the web user interface default language setting");
	} else 	{
		top.default_Lang = WEBVAR_JSONVAR_GETDEFAULTLANG.WEBVAR_STRUCTNAME_GETDEFAULTLANG;
	}
}

function setLangCfg()
{
        var lang_index = 0;
	var defaultlang_index = 0;

        lang_index = lstlangSetting.value;
	defaultlang_index = lstdefaultlangSetting.value;
	top.gLangSettingSet = false;
	_saveBtn.disabled = false;
	
	//For web UI default language setting
        if((eLang.support[defaultlang_index] != top.default_Lang[0].DEFAULTLANG) && ( top.default_Lang[0].DEFAULTLANG != undefined))
        {
		// Check user set the default language value
		if(defaultlang_index != 0){
	                var req = new xmit.getset({url:"/rpc/setdefaultlangcfg.asp", onrcv:function(arg)
	                {
	                        if(arg.HAPI_STATUS == 0)
       	                 	{
					getLangCfg();
					setTimeout(function(){alert("Setting web user interface default language successful. Waiting for Setting default lang!");},500);
	                        }
	                        else
	                        {
	                                alert("Setting web user interface default language fail");
	                        } 
	                }});
			req.add("DEFAULTLANG" ,eLang.support[defaultlang_index]);
			req.send();
			delete req;
		}
        }

	if(eLang.support[lang_index] == top.gLangSetting)
	{
		_saveBtn.disabled = true;
	}


	/** Set global variable **/
	if (top.user.isAdmin()) {
		if((eLang.support[lang_index] == top.gLangSetting) && (eLang.support[defaultlang_index] == top.default_Lang[0].DEFAULTLANG))
		{
			alert("There is nothing changing");
		}else
		{
			if(lang_index != 0)					//lang_index is default value		case: User set the web ui language
			{
				top.gLangSetting = eLang.support[lang_index];
			}
			if(defaultlang_index != 0)				//defaultlang_index is default value 	case: User set the default language
			{
				top.default_Lang[0].DEFAULTLANG = eLang.support[defaultlang_index];
			}
		}
		top.gLangSetFlag = true;
		top.mainFrame.location.href = "../page/main.html";
	}
	top.gLangSettingSet = true;
}

function enableLang()
{
	var index;
	var defaultlang_index;
	index = lstlangSetting.value;
	defaultlang_index = lstdefaultlangSetting.value;

	if((top.gLangSetting == eLang.support[index]) && (eLang.support[defaultlang_index] == top.default_Lang[0].DEFAULTLANG))
	{
		_saveBtn.disabled = true;
	}
	else
		_saveBtn.disabled = false;

}



