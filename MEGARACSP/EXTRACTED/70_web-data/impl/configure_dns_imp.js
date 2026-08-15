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

// File Name  : configure_dns
// Brief      :
// Author Name:

var LANCFG_DATA;
var DNSCFG_DATA;
var timer = 0;
var varDHCP = [4];
var v6Enable = false;

var TSIG_SUPPORT = false;	//TSIG support in project configuration.
var TSIGUpload = 0;	//Flag to check whether TSIG file is uploaded or not.

var MDNS_SUPPORT = false; //MDNS support in project configuration.

var CONST_IPV4_PRIORITY = 1;
var CONST_IPV6_PRIORITY = 2;
var CONST_REG_NSUPDATE = 0;		//Constant to hold Nsupdate BMC Register method
var CONST_REG_DHCP = 1;		//Constant to hold DHCP Client FQDN BMC Register method
var CONST_REG_HOSTNAME = 2;		//Constant to hold Hostname BMC Register method
var CONST_REG_BMC = 1;			//Constant to hold BMC Register enable

function doInit()
{
	exposeElms([
		"_chkDNSStatus",
		"_divMDNS",
		"_chkMDNSEnable",
		"_lstHostSetting",
		"_txtHostName",
		"_rowRegisterBMC0",
		"_tdRegisterBMC0",
		"_chkRegisterBMC0",
		"_rdoRegisterDDNS0",
		"_rdoRegisterDHCP0",
		"_rdoRegisterHost0",
		"_rowRegisterBMC1",
		"_tdRegisterBMC1",
		"_chkRegisterBMC1",
		"_rdoRegisterDDNS1",
		"_rdoRegisterDHCP1",
		"_rdoRegisterHost1",
		"_rowRegisterBMC2",
		"_tdRegisterBMC2",
		"_chkRegisterBMC2",
		"_rdoRegisterDDNS2",
		"_rdoRegisterDHCP2",
		"_rdoRegisterHost2",
		"_rowRegisterBMC3",
		"_tdRegisterBMC3",
		"_chkRegisterBMC3",
		"_rdoRegisterDDNS3",
		"_rdoRegisterDHCP3",
		"_rdoRegisterHost3",
		"_divTSIG",
		"_chkTSIGEnable",
		"_txtTSIGPriv",
		"_fleTSIGPriv",
		"_lstDomainSetting",
		"_txtDomainName",
		"_lstDNSSetting",
		"_rdoV4Priority",
		"_rdoV6Priority",
		"_txtDNS0",
		"_txtDNS1",
		"_txtDNS2",
		"_btnSave",
		"_btnReset"]); 
	if (top.user.isAdmin()) {
		btnSave.onclick = validateDNSCfg;
		btnReset.onclick = reloadDNSCfg;
	} else if (top.user.isOperator()) {
		disableActions();
	} else {
		alert(eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
		return;
	}
	chkDNSStatus.onclick = enableDNSService;
	lstHostSetting.onchange = enableHost;
	chkRegisterBMC0.onclick = chkRegisterBMC1.onclick = checkRegisterBMC;
	chkRegisterBMC2.onclick = chkRegisterBMC3.onclick = checkRegisterBMC;

	lstDomainSetting.onchange = enableDomain;
	lstDNSSetting.onchange = enableDNS;

	_begin();
}

function _begin()
{
	var index = 0;

	/* Host Configuration */
	lstHostSetting.add(new Option(eLang.getString("common", "STR_MANUAL"), index),
		isIE ? index : null);
	index++;
	lstHostSetting.add(new Option(eLang.getString("common", "STR_AUTO"), index),
		isIE ? index : null);

	/* Register BMC Configuration */
	for (index = 0; index < top.settings.lan.length; index++) {
		$("_rowRegisterBMC" + top.settings.eth[index]).className = "visibleRow";
		$("_tdRegisterBMC" + top.settings.eth[index]).innerHTML = "<strong>" +
			top.settings.ethstr[index] + "</strong>";
	}

	/* TSIG Configuration */
	TSIG_SUPPORT = checkProjectCfg("TSIG");
	if (TSIG_SUPPORT) {
		divTSIG.className = "visibleRow";

		chkTSIGEnable.onclick = enableTSIG;
		rdoRegisterDDNS0.onclick = rdoRegisterDHCP0.onclick = enableTSIG;
		rdoRegisterDDNS1.onclick = rdoRegisterDHCP1.onclick = enableTSIG;
		rdoRegisterDDNS2.onclick = rdoRegisterDHCP2.onclick = enableTSIG;
		rdoRegisterDDNS3.onclick = rdoRegisterDHCP3.onclick = enableTSIG;
		
		fleTSIGPriv.setAttribute("NAME", "tsigprivkey");
		fleTSIGPriv.name = "tsigprivkey";
		fleTSIGPriv.onkeydown = function(e) {
			if (!e) {
				e = window.event;
			}
			if (e.keyCode != 13 && e.keyCode != 9) {
				return false;
			}
		}
	}
	/*MDNS Configuration */
	MDNS_SUPPORT = checkProjectCfg("MDNS");
	if(MDNS_SUPPORT){
		divMDNS.className = "visiblRow";
	}

	/* Domain Name and DNS Configuration */
	index = 0;
	lstDomainSetting.add(new Option(eLang.getString("common", "STR_MANUAL"),
		eLang.getString("common", "STR_MANUAL")), isIE ? index : null);
	lstDNSSetting.add(new Option(eLang.getString("common", "STR_MANUAL"),
		index), isIE ? index : null);

	getNetworkInfo();
}

function getNetworkInfo()
{
	xmit.get({url:"/rpc/getalllancfg.asp", onrcv:getAllLANCfgRes, status:""});
}

function getAllLANCfgRes(arg)
{
	switch (arg.HAPI_STATUS) {
	case 0x0:
		LANCFG_DATA = WEBVAR_JSONVAR_GETALLNETWORKCFG.WEBVAR_STRUCTNAME_GETALLNETWORKCFG;
		loadLANInfo();
		getDNSCfg();
	break;

	case 0x1D4:
		alert (eLang.getString("common", "STR_PERMISSION_DENIED"));
		location.href = "dashboard.html";
	break;

	case 0xE2:	case 0xE3:
		errstr = eLang.getString("common", "STR_CONF_NW_GETVAL");
		errstr += (eLang.getString("common", "STR_CONF_NW_ERR_" +
			arg.HAPI_STATUS));
		alert(errstr);
	break;

	default:
		errstr = eLang.getString("common", "STR_CONF_NW_GETVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	}
}

function getDNSCfg()
{
	xmit.get({url:"/rpc/getdnscfg.asp", onrcv:getDNSCfgRes, status:""});
}

function getDNSCfgRes(arg)
{
	if (arg.HAPI_STATUS != 0) {
		errstr = eLang.getString("common", "STR_CONF_NW_DNSVAL");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		DNSCFG_DATA = WEBVAR_JSONVAR_GETDNSCFG.WEBVAR_STRUCTNAME_GETDNSCFG;
		reloadDNSCfg();
	}
}

function loadLANInfo()
{
	var index = 0;
	var domainstr = "";
	var domainindex = 1;
	var dnsindex = 1;

	varDHCP[0] = false;
	varDHCP[1] = false;
	varDHCP[2] = false;
	varDHCP[3] = false;
	
	for (var i = 0; i<LANCFG_DATA.length; i++) {
		index = getIndexFromLANChannel(LANCFG_DATA[i].channelNum);
		if (getbits(LANCFG_DATA[i].v4IPSource,3,0) ==
			top.CONSTANTS.IPSOURCE_DHCP) {
			varDHCP[top.settings.eth[index]] = true;
			lstDNSSetting.add(new Option(top.settings.ethstr[index],
				top.settings.lan[index]), isIE ? dnsindex++ : null);
			domainstr = top.settings.ethstr[index] + "_v4";
			lstDomainSetting.add(new Option(domainstr, domainstr),
				isIE ? domainindex++ : null);
		}
		if ((getbits(LANCFG_DATA[i].v6IPSource,3,0) ==
			top.CONSTANTS.IPSOURCE_DHCP) && (LANCFG_DATA[i].v6Enable == 1)) {
			domainstr = top.settings.ethstr[index] + "_v6";
			lstDomainSetting.add(new Option(domainstr, domainstr),
				isIE ? domainindex++ : null);
		}
		if (LANCFG_DATA[i].v6Enable == 1) {
			v6Enable = true;
		}
	}
}

function reloadDNSCfg()
{
	var enable = false;
	var enable_mdns = false;
	/* Host Configuration */
	chkDNSStatus.checked = (DNSCFG_DATA[0].DNS_ENABLE) ? true : false;
	lstHostSetting.value = DNSCFG_DATA[0].HOST_CFG;
	txtHostName.value = DNSCFG_DATA[0].HOST_NAME;
	enableHost();

	/* Register BMC Configuration */
	for (i = 0; i < 4; i++) {
		$("_chkRegisterBMC" + i).checked = (DNSCFG_DATA[i].REG_BMC) ? true : false;
		enableRegisterBMC(i);

		if (i < 3) {
			$("_txtDNS" + i).value = DNSCFG_DATA[i].DNS_IP;
		}

		if (TSIG_SUPPORT) {
			if ($("_rowRegisterBMC" + i).className == "visibleRow") {
				enable = enable || ((DNSCFG_DATA[i].TSIG_ENABLE) ? true : false);
			}
		}
	}

	/* TSIG Configuration */
	if (TSIG_SUPPORT) {
		chkTSIGEnable.checked = enable;
		txtTSIGPriv.value = DNSCFG_DATA[0].TSIG_PRIVATE;
		fleTSIGPriv.value = "";
		enableTSIG();
	}
	/* mDNS Configuration */
	if(MDNS_SUPPORT)
	{
		for(i=0; i<3 ; i++)
		{
			enable_mdns = enable_mdns || ((DNSCFG_DATA[i].MDNS) ? true : false);	
		}
		chkMDNSEnable.checked = enable_mdns ;
 	
	}

	/* Domain Name Configuration */
	lstDomainSetting.value = DNSCFG_DATA[0].DOMAIN_CFG;
	txtDomainName.value = DNSCFG_DATA[0].DOMAIN_NAME;
	enableDomain();

	/* DNS Server Configuration */
	lstDNSSetting.value = DNSCFG_DATA[0].DNS_CFG;

	enableDNSService();
	rdoV4Priority.checked = (DNSCFG_DATA[0].DNS_PRIORITY == CONST_IPV4_PRIORITY) ?
		true : false;
	rdoV6Priority.checked = (DNSCFG_DATA[0].DNS_PRIORITY == CONST_IPV6_PRIORITY) ?
		true : false;
	lstHostSetting.focus();
}

function setDNSCfgRes(arg)
{
	btnSave.disabled = false;
	clearTimeout(timer);
	switch(arg.HAPI_STATUS)
	{
		case 0:
			resetWebUI();
		break;

		case 1: case 5:
		case 6: case 9:
			if (TSIG_SUPPORT) {
				errstr =  eLang.getString("common", "STR_CONF_NW_SETVAL");
				errstr += (eLang.getString("common", "STR_CONF_DNS_TSIG_ERR" +
					arg.HAPI_STATUS));
				alert(errstr);
			}
		break;

		case 0xDE: 	case 0xDF:
		case 0xE0:	case 0xE1:
		case 0xE2:	case 0xE3:
			errstr =  eLang.getString("common", "STR_CONF_NW_SETVAL");
			errstr += (eLang.getString("common", "STR_CONF_NW_ERR_" +
				arg.HAPI_STATUS));
			alert(errstr);
		break;

		default:
			errstr =  eLang.getString("common", "STR_CONF_NW_SETVAL");
			errstr += (eLang.getString("common", "STR_IPMI_ERROR") +
				GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
	}
}

function resetWebUI()
{
	btnSave.disabled = true;
	resetNetwork();
}

function Timedout()
{
	alert(eLang.getString("common", "STR_CONF_NW_SETERR1"));
	btnSave.disabled = false;
}

function setDNSCfg()
{
	var req;
	var index;
	var reg_bmc = "";
	var reg_dhcp = "";
	var dnsService;		//Integer to hold the DNS Service status
	if (confirm(eLang.getString("common", "STR_CONF_NW_SAVE_CONFIRM"))) {
		btnSave.disabled = true;
		req = new xmit.getset({url:"/rpc/setdnscfg.asp", onrcv:setDNSCfgRes,
			ontimeout:Timedout});
		dnsService = (chkDNSStatus.checked) ? 1 : 0;
		req.add("DNS_ENABLE", dnsService);
		if (dnsService) {
			/* Host Configuration */
			req.add("HOST_CFG", lstHostSetting.value);
			if (lstHostSetting.value == 0) {
				req.add("HOST_NAME", txtHostName.value);
			}

			/* Register BMC Configuration */
			for (i = 0; i < 4; i++) {
				if (($("_rowRegisterBMC" + i).className == "visibleRow") && 
						($("_chkRegisterBMC" + i).checked == true) &&
						!($("_chkRegisterBMC" + i).disabled)) {
					reg_bmc += CONST_REG_BMC;
					if ($("_rdoRegisterDDNS" + i).checked) {
						reg_dhcp += CONST_REG_NSUPDATE;
					} else if ($("_rdoRegisterDHCP" + i).checked) {
						reg_dhcp += CONST_REG_DHCP;
					} else if ($("_rdoRegisterHost" + i).checked) {
						reg_dhcp += CONST_REG_HOSTNAME;
					}
				} else {
					reg_bmc += 0;
					reg_dhcp += 0;
				}

				reg_bmc += ",";
				reg_dhcp += ",";
			}
			req.add("REG_BMC", reg_bmc);
			req.add("REG_DHCP", reg_dhcp);

			/* TSIG Configuration */
			if (TSIG_SUPPORT) {
				req.add("TSIG_ENABLE", chkTSIGEnable.checked ? 1 : 0);
				req.add("TSIG_UPLOAD", TSIGUpload);
			}
			/* Multicast DNS Configuration */
			if(MDNS_SUPPORT){
				req.add("MDNS", chkMDNSEnable.checked ? 1 : 0);
			}
			/* Domain Name Configuration */
			domaindata = lstDomainSetting.value.split("_");
			if (domaindata.length == 2) {
				req.add("DOMAIN_PRIORITY", domaindata[1]);
				//index = getIndexFromEthString(domaindata[0]);
				req.add("DOMAIN_ETH",top.settings.eth[getIndexFromEthString(domaindata[0])]);
			} else {
				//This variable holds 'Manual' setting for Domain Name
				req.add("DOMAIN_PRIORITY", lstDomainSetting.value);
				req.add("DOMAIN_NAME", txtDomainName.value);
			}

			/* DNS Server Configuration */
			if (lstDNSSetting.value == 0) {		//Manual configuration
				req.add("DNS_DHCP", 0);
				req.add("DNS_IP1",txtDNS0.value);
				req.add("DNS_IP2",txtDNS1.value);
				req.add("DNS_IP3",txtDNS2.value);
			} else {
				req.add("DNS_DHCP", 1);
				req.add("DNS_ETH", 
					top.settings.eth[getIndexFromLANChannel(lstDNSSetting.value)]);
				req.add("DNS_PRIORITY", rdoV4Priority.checked ?
					CONST_IPV4_PRIORITY : CONST_IPV6_PRIORITY);
			}
		}

		req.send();
		delete req;
		//timer = setTimeout("resetWebUI()",2000);
	}
}

function validateDNSCfg()
{
	if (top.user.isAdmin()) {
		if (chkDNSStatus.checked) {
			if (lstHostSetting.value == 0) {
				if ((!eVal.hostname(txtHostName.value)) ||
					(eVal.isblank(txtHostName.value))) {
					alert (eLang.getString("common", "STR_CONF_DNS_INVALID_HOST"));
					txtHostName.focus();
					return;
				}
				var filter = /_/g;
				if (filter.test(txtHostName.value)) {
					if (!confirm(eLang.getString("common", 
						"STR_CONF_NW_SAVE_IE_ERROR"))) {
						return;
					}
				}
			}

			if (TSIG_SUPPORT) {
				if (chkTSIGEnable.checked) {
					if (eVal.isblank(fleTSIGPriv.value)) {
						if (!DNSCFG_DATA[0].TSIG_EXISTS) {
							alert(eLang.getString("common",
								"STR_CONF_DNS_TSIG_ERR10"));
							fleTSIGPriv.focus();
							return;
						}
					} else {
						if (!eVal.endsWith(fleTSIGPriv.value, ".private")) {
							alert(eLang.getString("common",
								"STR_CONF_DNS_TSIG_ERR11"));
							fleTSIGPriv.focus();
							return;
						}
					}
				}
			}

			if (lstDomainSetting.value == eLang.getString("common", "STR_MANUAL")) {
				if ((!eVal.domainname(txtDomainName.value, true)) ||
					(eVal.isblank(txtDomainName.value))) {
					alert (eLang.getString("common", "STR_CONF_DNS_INVALID_DOMAIN"));
					txtDomainName.focus();
					return;
				}
			}

			if (lstDNSSetting.value == 0) {
				if ((eVal.isblank(txtDNS0.value)) &&
					(eVal.isblank(txtDNS1.value)) &&
					(eVal.isblank(txtDNS2.value))) {
					alert(eLang.getString("common", "STR_CONF_DNS_BLANK"));
					txtDNS0.focus();
					return false;
				}

				if (!validateServerAddress(txtDNS0)) {
					return false;
				}

				if (!validateServerAddress(txtDNS1)) {
					return false;
				}

				if (!validateServerAddress(txtDNS2)) {
					return false;
				}

				if ((eVal.compareip(txtDNS0.value, txtDNS1.value)) || 
					(eVal.compareip(txtDNS0.value, txtDNS2.value)) || 
					(eVal.compareip(txtDNS1.value, txtDNS2.value))) {
					alert(eLang.getString("common", "STR_CONF_DNS_DIFF"));
					return false;
				}

				if (v6Enable) {
					if ((eVal.comparev6ip(txtDNS0.value, txtDNS1.value)) || 
						(eVal.comparev6ip(txtDNS0.value, txtDNS2.value)) || 
						(eVal.comparev6ip(txtDNS1.value, txtDNS2.value))) {
						alert(eLang.getString("common", "STR_CONF_DNS_DIFF"));
						return false;
					}
				}
			}

			if (TSIG_SUPPORT) {
				if (chkTSIGEnable.checked && !eVal.isblank(fleTSIGPriv.value)) {
					uploadTSIGPrivate();
				} else {
					setDNSCfg();
				}
			} else {
				setDNSCfg();
			}
		} else {
			setDNSCfg();
		}
	} else {
		alert(eLang.getString("common", "STR_CONF_ADMIN_PRIV"));
	}
}

/*
 * This function is used to upload the TSIG private key file. Initiates the 
 * progress as Uploading.
 */
function uploadTSIGPrivate()
{
	if (TSIG_SUPPORT) {
		TSIGUpload = 1;
		btnSave.disabled = true;
		showWait(true, "Uploading");
		document.forms["frmTSIGPriv"].submit();
	}
}

/*
 * This function will be invoked once the upload completes. Need to invoke the 
 * setDNSCfg function to save the configuration.
 */
function uploadComplete()
{
	setDNSCfg();
}

function validateServerAddress(txtDNS)
{
	if (!eVal.isblank(txtDNS.value)) {
		if (!eVal.ip(txtDNS.value)) {
			if (v6Enable) {
				if (!eVal.ipv6(txtDNS.value)) {
					alert(eLang.getString("common",
						"STR_CONF_DNS_INVALID_DNS") +
						eLang.getString("common", "STR_HELP_INFO"));
					txtDNS.focus();
					return false;
				}
			} else {
				alert(eLang.getString("common", "STR_CONF_DNS_INVALID_DNS") +
					eLang.getString("common", "STR_CONF_DNS_V6DISABLE"));
				txtDNS.focus();
				return false;
			}
		}
	}
	return true;
}

function enableHost()
{
	txtHostName.disabled = (lstHostSetting.value == 0 && 
		!lstHostSetting.disabled) ? false : true;
}

function checkRegisterBMC()
{
	if (this.id.indexOf("0") != -1){
		enableRegisterBMC(0);
	}else if (this.id.indexOf("1") != -1){
		enableRegisterBMC(1);
	}else if (this.id.indexOf("2") != -1){
		enableRegisterBMC(2);
	}else if (this.id.indexOf("3") != -1){
		enableRegisterBMC(3);
	}
	if (TSIG_SUPPORT) {
		enableTSIG();
	}
}

function enableRegisterBMC(index)
{
	if ($("_chkRegisterBMC" + index).checked == true && 
		!$("_chkRegisterBMC" + index).disabled) {
		$("_rdoRegisterDDNS" + index).disabled = false;
		$("_rdoRegisterDHCP" + index).disabled = 
			$("_rdoRegisterHost" + index).disabled = !(varDHCP[index]);

		$("_rdoRegisterDDNS" + index).checked = (DNSCFG_DATA[index].REG_DHCP == 
			CONST_REG_NSUPDATE) ? true : false;
		$("_rdoRegisterDHCP" + index).checked = (DNSCFG_DATA[index].REG_DHCP == 
			CONST_REG_DHCP) ? true : false;
		$("_rdoRegisterHost" + index).checked = (DNSCFG_DATA[index].REG_DHCP == 
			CONST_REG_HOSTNAME) ? true : false;

		if ((!$("_rdoRegisterDDNS" + index).checked) && 
			(!$("_rdoRegisterDHCP" + index).checked) && 
			(!$("_rdoRegisterHost" + index).checked)) {
			$("_rdoRegisterDDNS" + index).checked = true;
		}
	} else {
		$("_rdoRegisterDDNS" + index).checked = false;
		$("_rdoRegisterDHCP" + index).checked = false;
		$("_rdoRegisterHost" + index).checked = false;
		$("_rdoRegisterDDNS" + index).disabled = true;
		$("_rdoRegisterDHCP" + index).disabled = true;
		$("_rdoRegisterHost" + index).disabled = true;
	}
}

/*
 * This function will enable the TSIG checkbox, whenever Dynamic Direct DNS 
 * checkbox is checked. Also enable/disable the TSIG configuration fields.
 */
function enableTSIG()
{
	if (TSIG_SUPPORT) {
		var enable = false;

		for (i = 0; i < 4; i++) {
			if (($("_rowRegisterBMC" + i).className == "visibleRow") &&
				($("_rdoRegisterDDNS" + i).checked) && !($("_rdoRegisterDDNS" + i).disabled)) {
				enable = true;
				break;
			}
		}

		chkTSIGEnable.disabled = !enable;
		if (chkTSIGEnable.disabled) {
			chkTSIGEnable.checked = false;
		}

		enable = ((!chkTSIGEnable.checked) || (chkTSIGEnable.disabled));
		txtTSIGPriv.disabled = enable;
		fleTSIGPriv.disabled = enable;
	}
}

function enableDomain()
{
	txtDomainName.disabled = (lstDomainSetting.value == "Manual" && 
		!lstDomainSetting.disabled) ? false : true;
}

function enableDNS()
{
	var index;
	var opt = (lstDNSSetting.value == 0 && !lstDNSSetting.disabled) ? false : true;

	if (opt && !lstDNSSetting.disabled) {
		index = getIndexFromLANChannel(lstDNSSetting.value);
		if (LANCFG_DATA[index].lanEnable && 
			(LANCFG_DATA[index].v4IPSource == top.CONSTANTS.IPSOURCE_DHCP)) {
			rdoV4Priority.checked = true;
			rdoV4Priority.disabled = false;
		} else {
			rdoV4Priority.checked = false;
			rdoV4Priority.disabled = true;
		}

		if (LANCFG_DATA[index].lanEnable && LANCFG_DATA[index].v6Enable &&
			(LANCFG_DATA[index].v6IPSource == top.CONSTANTS.IPSOURCE_DHCP)) {
			rdoV6Priority.disabled = false;
		} else {
			rdoV6Priority.checked = false;
			rdoV6Priority.disabled = true;
		}
	} else {
		rdoV4Priority.checked = false;
		rdoV4Priority.disabled = true;
		rdoV6Priority.checked = false;
		rdoV6Priority.disabled = true;
	}
	txtDNS0.disabled = opt;
	txtDNS1.disabled = opt;
	txtDNS2.disabled = opt;
}

/*
 * This method is used to enable/disable all the UI controls based on 
 * the DNS Service status.
 */
function enableDNSService() {
	var opt;	//Boolean variable to hold the DNS Service status
	opt = !chkDNSStatus.checked;
	lstHostSetting.disabled = opt;
	chkMDNSEnable.disabled = opt;
	enableHost();
	for (i = 0; i < 4; i++) {
		if ($("_rowRegisterBMC" + i).className == "visibleRow") {
			$("_chkRegisterBMC" + i).disabled = opt;
			enableRegisterBMC(i);
		}
	}
	enableTSIG();
	lstDomainSetting.disabled = opt;
	enableDomain();
	lstDNSSetting.disabled = opt;
	enableDNS();
}
