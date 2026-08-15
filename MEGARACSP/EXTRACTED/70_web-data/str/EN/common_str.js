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

eLang.common_strings = {};

/*Dashboard*/
eLang.common_strings["STR_DASHBOARD_GETDEVICEID"] = "There was a problem while getting device ID";
eLang.common_strings["STR_DASHBOARD_GETBUILDDATE"] = "There was a problem while getting Firmware build date and time : ";
eLang.common_strings["STR_DASHBOARD_SETGPIO"] = "There was a problem while setting GPIO Status"
eLang.common_strings["STR_DASHBOARD_NETWORK_EDIT"] = "Edit";
eLang.common_strings["STR_DASHBOARD_NETWORK_VIEW"] = "View";
eLang.common_strings["STR_WEBPREVIEW_KVM_DISABLE_1"] = "Web Preview is not " +
	"available, due to KVM service is disabled";
eLang.common_strings["STR_WEBPREVIEW_KVM_DISABLE_2"] = "Web Preview is not " +
	"available, due to KVM License unavailable";
eLang.common_strings["STR_NW_ADDR_MODE_0"] = "Unknown";
eLang.common_strings["STR_NW_ADDR_MODE_1"] = "Static";
eLang.common_strings["STR_NW_ADDR_MODE_2"] = "DHCP";

/*FRU Information*/
eLang.common_strings["STR_FRU_INFO_GETVAL"] = "There was a problem while getting FRU Information";

/*Configure Active Directory*/
eLang.common_strings["STR_CONF_AD_HEAD1"] = "Role Group ID";
eLang.common_strings["STR_CONF_AD_HEAD2"] = "Group Name";
eLang.common_strings["STR_CONF_AD_HEAD3"] = "Group Domain";
eLang.common_strings["STR_CONF_AD_HEAD4"] = "Group Privilege";
eLang.common_strings["STR_CONF_AD_RG_CNT"] = "Number of configured Role groups: ";
eLang.common_strings["STR_CONF_AD_ADENABLE_DESC"] = "To Configure Active Directory Server Settings, click 'Advanced Settings'";
eLang.common_strings["STR_CONF_AD_ADDISABLE_DESC"] = "The 'Active Directory' is currently disabled. To enable Active Directory and configure its settings. Click on 'Advanced Settings' button.";
eLang.common_strings["STR_CONF_AD_ADV_TITLE"] = "Advanced Active Directory Settings";
eLang.common_strings["STR_CONF_AD_ADV_ENABLEAD"] = "Active Directory Authentication";
eLang.common_strings["STR_CONF_AD_ADV_SECRETNAME"] = "Secret Username";
eLang.common_strings["STR_CONF_AD_ADV_SECRETPASSWORD"] = "Secret Password";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINNAME"] = "User Domain Name";
eLang.common_strings["STR_CONF_AD_ADV_TIMEOUT"] ="Time Out";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR1"] = "Domain Controller Server Address1";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR2"] = "Domain Controller Server Address2";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR3"] = "Domain Controller Server Address3";
eLang.common_strings["STR_CONF_AD_ADV_SAVE"] = "Save";
eLang.common_strings["STR_CONF_AD_RG_ADD_TITLE"] = "Add Role Group";
eLang.common_strings["STR_CONF_AD_RG_MODIFY_TITLE"] = "Modify Role Group";
eLang.common_strings["STR_CONF_AD_RG_NAME"] = "Role Group Name";
eLang.common_strings["STR_CONF_AD_RG_DOMAIN"] = "Role Group Domain";
eLang.common_strings["STR_CONF_AD_RG_PRIV"] = "Role Group Privilege";

/*Configure Active Directory Error Strings*/
eLang.common_strings["STR_CONF_AD_GETINFO"] = " There was a problem while getting Active Directory information";
eLang.common_strings["STR_CONF_AD_SETINFO"] = " There was a problem while setting Active Directory information";
eLang.common_strings["STR_CONF_AD_RG_GETINFO"] = "There was a problem while getting role group information";
eLang.common_strings["STR_CONF_AD_RG_ADDINFO"] = "There was a problem while adding role group information";
eLang.common_strings["STR_CONF_AD_RG_MODINFO"] = "There was a problem while modifying role group information";
eLang.common_strings["STR_CONF_AD_RG_DELINFO"] = "There was a problem while deleting role group information";
eLang.common_strings["STR_CONF_AD_RG_ADMINPRIV"] ="You need to have administrator privileges to add/modify/delete role groups.";
eLang.common_strings["STR_CONF_AD_ADV_ADMINPRIV"] ="You need to have administrator privileges to configure Active Directory settings.";
eLang.common_strings["STR_CONF_AD_RG_ERR1"] ="Please select a slot in the Role Group list";
eLang.common_strings["STR_CONF_AD_RG_ERR2"] ="There is no role group configured in the slot you selected. Please select a different role group";
eLang.common_strings["STR_CONF_AD_RG_ERR3"] ="The Role Group Name already exists with this Role Group Domain";
eLang.common_strings["STR_CONF_AD_CONFIRM1"] ="This slot has already been configured with a role group. Would you like to modify that role group instead?";
eLang.common_strings["STR_CONF_AD_CONFIRM2"] ="This slot is currently empty. Would you like to add a new role group?";
eLang.common_strings["STR_CONF_AD_RG_DELETE_SUCCESS"] ="The Role Group has been deleted";
eLang.common_strings["STR_CONF_AD_RG_ADV_SAVE_SUCCESS"] ="The Active Directory configuration has been successfully set";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINNAME"] ="Invalid User Domain Name!";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR1"] ="Invalid Domain Controller Server Address1";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR2"] ="Invalid Domain Controller Server Address2";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR3"] ="Invalid Domain Controller Server Address3";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR"] ="Please enter at least one Domain controller server address";
eLang.common_strings["STR_CONF_AD_ADV_DIFF_DOMAINSRVR"] = "The Domain Controller Server's address should be different for the three servers";
eLang.common_strings["STR_CONF_AD_RG_INVALID_RGNAME"] ="Invalid Role Group Name!";
eLang.common_strings["STR_CONF_AD_RG_INVALID_RGDOMAIN"] ="Invalid Role Group Domain Name!";

/*Role Group Strings*/
eLang.common_strings["STR_CONF_RG_TITLE_1"] = "Add Role Group";
eLang.common_strings["STR_CONF_RG_TITLE_2"] = "Modify Role Group";
eLang.common_strings["STR_CONF_RG_CNT"] = "Number of configured Role groups: ";
eLang.common_strings["STR_CONF_RG_HEAD1"] = "Role Group ID";
eLang.common_strings["STR_CONF_RG_HEAD2"] = "Group Name";
eLang.common_strings["STR_CONF_RG_HEAD4"] = "Group Privilege";
eLang.common_strings["STR_CONF_RG_NAME"] = "Role Group Name";
eLang.common_strings["STR_CONF_RG_PRIV"] = "Role Group Privilege";
eLang.common_strings["STR_CONF_RG_SEARCHBASE"] = "Role Group Search Base";
eLang.common_strings["STR_CONF_RG_GETINFO"] = "There was a problem while getting role group information";
eLang.common_strings["STR_CONF_RG_SETINFO"] = "There was a problem while configuring role group information";
eLang.common_strings["STR_CONF_RG_DELINFO"] = "There was a problem while deleting role group information";
eLang.common_strings["STR_CONF_RG_ERR1"] ="Please select a slot in the Role Group list";
eLang.common_strings["STR_CONF_RG_ERR2"] ="There is no role group configured in the slot you selected. Please select a different role group";
eLang.common_strings["STR_CONF_RG_ERR3"] ="Role Group Name already exists with this Role Group Search Base";
eLang.common_strings["STR_CONF_RG_CONFIRM1"] ="This slot has already been configured with a role group. Would you like to modify that role group instead?";
eLang.common_strings["STR_CONF_RG_CONFIRM2"] ="This slot is currently empty. Would you like to add a new role group?";
eLang.common_strings["STR_CONF_RG_DELETE_SUCCESS"] ="Role Group has been deleted";
eLang.common_strings["STR_CONF_RG_SAVE_SUCCESS_1"] ="Role Group was added successfully";
eLang.common_strings["STR_CONF_RG_SAVE_SUCCESS_2"] ="Role Group was modified successfully";

/*Configure Event Log*/
eLang.common_strings["STR_CONF_SEL_GETVAL"] = "There was a problem while getting System Event Log configuration";
eLang.common_strings["STR_CONF_SEL_SETVAL"] = "There was a problem while setting System Event Log configuration";
eLang.common_strings["STR_CONF_SEL_POLICY_ERR"] = "Please select a Event log Policy";
eLang.common_strings["STR_CONF_SEL_SAVE_SUCCESS"] = "Event log Policy saved successfully";
eLang.common_strings["STR_CONF_SEL_POLICY_UNKNOWN"] = "Unknown Event log Policy";

/*Configure Image Transfer Protocol*/
eLang.common_strings["STR_CONF_FWIMG_GETVAL"] = "There was a problem while getting Firmware Image configuration";
eLang.common_strings["STR_CONF_FWIMG_SETVAL"] = "There was a problem while setting Firmware Image configuration";
eLang.common_strings["STR_CONF_FWIMG_SUCCESS"] = "Firmware image configuration saved successfully";
eLang.common_strings["STR_CONF_FWIMG_PROTO0"] = "HTTP/HTTPs";
eLang.common_strings["STR_CONF_FWIMG_PROTO1"] = "TFTP";
eLang.common_strings["STR_CONF_FWIMG_PROTO2"] = "FTP";
eLang.common_strings["STR_CONF_FWIMG_INVALID_RETRYCNT"] = "Invalid Retry Count.";

/*Images Redirection*/
eLang.common_strings["STR_MEDIA_CFG_GETVAL"] = "There was a problem while getting media configuration";
eLang.common_strings["STR_MEDIA_CFG_SETVAL"] = "There was a problem while setting media configuration";
eLang.common_strings["STR_MEDIA_DESC"] = "The page is used to configure the images into the BMC for redirection. This can be done either by uploading a image into BMC as 'Local Media' or mounting the image from the remote system as 'Remote Media'.";
eLang.common_strings["STR_MEDIA_STATUS_0"] = " Local Media is currently disabled.";
eLang.common_strings["STR_MEDIA_STATUS_1"] = " Remote Media is currently disabled.";
eLang.common_strings["STR_MEDIA_STATUS_3"] = " Local and Remote Media are currently disabled.";
eLang.common_strings["STR_MEDIA_STATUS_4"] = " Local and Remote Media are currently enabled.";
eLang.common_strings["STR_MEDIA_ADV_DESC"] = " To configure Local or Remote Media Settings. Click the 'Advanced Settings' button";
eLang.common_strings["STR_LMEDIA_ENABLE"] = "Local Media Support";
eLang.common_strings["STR_RMEDIA_ENABLE"] = "Remote Media Support";
eLang.common_strings["STR_MEDIA_ADV_TITLE"] = "Advanced Media Settings";
eLang.common_strings["STR_MEDIA_CFG_CONFIRM"] = "Changing the media configuration would require to close all the existing virtual media redirection session and restarting them. Click OK to proceed.";
eLang.common_strings["STR_MEDIA_CFG_SUCCESS"] = "Media configuration was saved successfully";
eLang.common_strings["STR_MEDIA_IMGTYPE"] = "Media Type";
eLang.common_strings["STR_MEDIA_IMGNAME"] = "Image Name";
eLang.common_strings["STR_MEDIA_STATUS"] = "Redirection Status";
eLang.common_strings["STR_MEDIA_SERVER_INSTANCE"] = "Connected Server Session";
eLang.common_strings["STR_MEDIA_STATUS_START"] = "Started";
eLang.common_strings["STR_MEDIA_STATUS_PROGRESS"] = "In Progress...";
eLang.common_strings["STR_MEDIA_STATUS_STOP"] = "Stopped";
eLang.common_strings["STR_MEDIA_START_REDIR"] = "Start Redirection";
eLang.common_strings["STR_MEDIA_STOP_REDIR"] = "Stop Redirection";
eLang.common_strings["STR_MEDIA_REDIR_ERROR_1"] = "Unable to get the selected image index";
eLang.common_strings["STR_MEDIA_IMG_SETVAL_0"] = "There was a problem while setting local media image";
eLang.common_strings["STR_MEDIA_IMG_SETVAL_1"] = "There was a problem while setting remote media image";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS1"] = "Image was added successfully";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS2"] = "The image is cleared successfully";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS3"] = "The image has been deleted successfully";
eLang.common_strings["STR_LMEDIA_IMG_GETVAL"] = "There was a problem while getting local media area contents";
eLang.common_strings["STR_LMEDIA_IMG_SETVAL"] = "There was a problem while setting local media area contents";
eLang.common_strings["STR_RMEDIA_IMG_GETVAL"] = "There was a problem while getting remote media image configuration";
eLang.common_strings["STR_RMEDIA_IMG_SETVAL"] = "There was a problem while setting remote media image configuration";
eLang.common_strings["STR_MEDIA_CFG_SD_MOUNT_ERROR"] = "Unable to detect SD Card";
eLang.common_strings["STR_MEDIA_CFG_MEDIA_LICENSE_ERROR"] = "Media License Required.";
eLang.common_strings["STR_MEDIA_CFG_LMEDIA_LICENSE_ERROR"] = "Local Media License Required.";
eLang.common_strings["STR_MEDIA_CFG_RMEDIA_LICENSE_ERROR"] = "Remote Media License Required.";
eLang.common_strings["STR_MEDIA_INVALID_OPERATION"] = " Invalid operation to process";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_0"] = " - Success";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_1"] = " - Connection Accepted";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_2"] = " - Connection Denied";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_3"] = " - Login Failed";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_4"] = " - Connection in Use";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_5"] = " - Permission Denied";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_6"] = " - Unknown Error";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_7"] = " - Media Detach Stage";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_8"] = " - Maximum User Reached";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_9"] = " - Unable to Connect";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_10"] = " - Invalid Image";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_11"] = " - Mount Error";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_12"] = " - Unable to Open";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_13"] = " - Media License Expired";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_14"] = " - Connection Lost";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_15"] = " - Mount Cancelled By User";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_16"] = " - Device Ejected";
eLang.common_strings["STR_MEDIA_IMG_CNT"] = "Number of Available Media Types: ";
eLang.common_strings["STR_LMEDIA_IMGFILE"] = "Image File";
eLang.common_strings["STR_MEDIA_ADD_IMAGE"] = "Add Image";
eLang.common_strings["STR_MEDIA_INVALID_FILE1"] = "Invalid Image file name.";
eLang.common_strings["STR_MEDIA_INVALID_FILE2"] = "Selected Image is already exist. Please choose different image..!";
eLang.common_strings["STR_LMEDIA_CNFM_UPLOAD1"] = "More time will be taken to upload the image. In the meantime, no other rpc request will be served. \nDo you want to continue?";
eLang.common_strings["STR_LMEDIA_UPLOAD_ERROR"] = "There was a problem while uploading file.";
eLang.common_strings["STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR"] = "Temporary mount failure in remote share or Media Type in Disable.";
eLang.common_strings["STR_MEDIA_START_ERR"] = "There was a problem while initiating media redirection";
eLang.common_strings["STR_MEDIA_REDIR_START_0"] = "Local Media redirection start initiated..!";
eLang.common_strings["STR_MEDIA_REDIR_START_1"] = "Remote Media redirection start initiated..!";
eLang.common_strings["STR_MEDIA_REDIR_STOP_0"] = "Local Media redirection stop initiated..!";
eLang.common_strings["STR_MEDIA_REDIR_STOP_1"] = "Remote Media redirection stop initiated..!";
eLang.common_strings["STR_MEDIA_INVALID_CDIMG"] = "CD/DVD Image file should end with .iso";
eLang.common_strings["STR_MEDIA_INVALID_FDIMG"] = "Floppy/Harddisk Image file should end with .img";
eLang.common_strings["STR_LMEDIA_DESC"] = "Local Media is used to configure the images into BMC.";
eLang.common_strings["STR_RMEDIA_DESC"] = "Remote Media is used to mount the images from remote system and perform redirection.";
eLang.common_strings["STR_RMEDIA_ADV_DESC"] = " To configure Remote Media Settings. Click on 'Advanced Settings' button.";
eLang.common_strings["STR_LMEDIA_ADV_DESC"] = " To configure Local Media Settings. Click on 'Advanced Settings' button";
eLang.common_strings["STR_RMEDIA_STATUS_1"] = eLang.common_strings["STR_MEDIA_STATUS_1"];
eLang.common_strings["STR_LMEDIA_STATUS_1"] = eLang.common_strings["STR_MEDIA_STATUS_0"];
eLang.common_strings["STR_RMEDIA_IMG_NOT_AVAILABLE"] = "Image not Available";
eLang.common_strings["STR_RMEDIA_APPLICATION_NOT_RUNNING"] = "Application not running";
eLang.common_strings["STR_MOUNT_NOT_RESPONDING"] = "Remote share path is not accessible";
eLang.common_strings["STR_RMEDIA_TYPE"] = "Enable Media Types";
eLang.common_strings["STR_RMEDIA_ALL_TYPE"] = "All Media Settings";
eLang.common_strings["STR_RMEDIA_CD_TYPE"] = "CD/DVD Media Settings";
eLang.common_strings["STR_RMEDIA_Floppy_TYPE"] = "Floppy Media Settings";
eLang.common_strings["STR_RMEDIA_Harddisk_TYPE"] = "Harddisk Media Settings";
eLang.common_strings["STR_RMEDIA_TYPE_SELECT"] = "Configure atleast one Remote Media support";
eLang.common_strings["STR_MEDIA_CFG_CD_SUCCESS"] = "CD Media configuration was saved successfully";
eLang.common_strings["STR_MEDIA_CFG_FD_SUCCESS"] = "FD Media configuration was saved successfully";
eLang.common_strings["STR_MEDIA_CFG_HD_SUCCESS"] = "HD Media configuration was saved successfully";
eLang.common_strings["STR_MEDIA_CFG_CLEAR_ERROR"] = "There was a problem while clearning Remote Media Types";
eLang.common_strings["STR_LMEDIA_DELETE_BUTTON"] = "Delete Image";
eLang.common_strings["STR_RMEDIA_CLEAR_BUTTON"] = "Clear";
eLang.common_strings["STR_RMEDIA_LMEDIA_CONF_REDIRECT_STATUS_ERROR"] = "Enabling/Disabling RMedia/LMedia options will not be allowed when media redirection is in progress.";




/*Configure LDAP*/
eLang.common_strings["STR_CONF_LDAP_DESC_1"] = "To Configure LDAP/E-Directory Server Settings. Click on 'Advanced Settings' button";
eLang.common_strings["STR_CONF_LDAP_DESC_0"] = "LDAP/E-Directory is currently disabled. To enable LDAP/E-Directory and configure its settings. Click on 'Advanced Settings' button.";
eLang.common_strings["STR_CONF_LDAP_GETINFO"] = " There was a problem while getting LDAP/E-Directory information";
eLang.common_strings["STR_CONF_LDAP_SETINFO"] = " There was a problem while setting LDAP/E-Directory information";
eLang.common_strings["STR_CONF_LDAP_SAVE_SUCCESS"] ="LDAP/E-Directory configuration has been successfully set";
eLang.common_strings["STR_CONF_LDAP_RG_SEARCHBASE"] = "Group Search Base";
eLang.common_strings["STR_CONF_LDAP_TITLE"] = "Advanced LDAP/E-Directory Settings";
eLang.common_strings["STR_CONF_LDAP_ENABLE"] = "LDAP/E-Directory Authentication";
eLang.common_strings["STR_CONF_LDAP_SSLENABLE"] = "SSL";
eLang.common_strings["STR_CONF_LDAP_TLSENABLE"] = "StartTLS";
eLang.common_strings["STR_CONF_LDAP_ENCRYPTEDTYPE"] = "Encrypted Type";
eLang.common_strings["STR_CONF_LDAP_COMMONNAME"] = "Common Name Type";
eLang.common_strings["STR_CONF_LDAP_IPADDRESS"] = "IP Address";
eLang.common_strings["STR_CONF_LDAP_FQDN"] = "FQDN";
eLang.common_strings["STR_CONF_LDAP_NO_ENCRYPTED"] = "No Encrypted";
eLang.common_strings["STR_CONF_LDAP_INVALID_SERVERADDR"] = "Invalid Server Address format.";
eLang.common_strings["STR_CONF_LDAP_ENCRYPTED_RESTART_WEBSERVER"] = "Modify Encrypted type need to restart web server!!! \n Please Refresh web and re-login";
eLang.common_strings["STR_CONF_LDAP_RESTART_WEBSERVER"] = "Modify Authorization File need to restart web server!!! \n Please Refresh web and re-login";
eLang.common_strings["STR_CONF_LDAP_PORT"] ="Port";
eLang.common_strings["STR_CONF_LDAP_BINDDN"] ="Bind DN";
eLang.common_strings["STR_CONF_LDAP_SEARCHBASE"] ="Search Base";
eLang.common_strings["STR_CONF_LDAP_ATTRIBUTE_OF_USER_LOGIN"] ="Attribute of User Login"
eLang.common_strings["STR_CONF_LDAP_INVALID_BINDDN"] ="Invalid Bind DN";

/*Configure Mouse Mode*/
eLang.common_strings["STR_CONF_MOUSE_GETVAL"] ="Error in getting Mouse mode configuration";
eLang.common_strings["STR_CONF_MOUSE_SETVAL"] ="Error in setting Mouse Mode configuration";
eLang.common_strings["STR_CONF_MOUSE_MODE_1"] ="Relative";
eLang.common_strings["STR_CONF_MOUSE_MODE_2"] ="Absolute";
eLang.common_strings["STR_CONF_MOUSE_MODE_3"] ="Other mode";
eLang.common_strings["STR_CONF_MOUSE_UNKNOWN"] ="Unknown Mouse Mode";
eLang.common_strings["STR_CONF_MOUSE_CONFIRM"] ="Are you sure you want to change the mouse mode? Please close any currently open redirection console, and then reopen for the change to be seen.";
eLang.common_strings["STR_CONF_MOUSE_ALERT1"] ="Please select a mouse mode";
eLang.common_strings["STR_CONF_MOUSE_ALERT2"] ="There is no change in the setting.";
eLang.common_strings["STR_CONF_MOUSE_SUCCESS"] ="Mouse mode configured successfully.";

/*Configure NCSI*/
eLang.common_strings["STR_CONF_NCSI_GETVAL"] = "There was a problem while getting NCSI configuration";
eLang.common_strings["STR_CONF_NCSI_SETVAL"] = "There was a problem while configuring NCSI Information";
eLang.common_strings["STR_CONF_NCSI_SAVE_SUCCESS"] = "The NCSI settings are saved successfully.";
eLang.common_strings["STR_CONF_NCSI_MODE_0"] = "Manual Switch";
eLang.common_strings["STR_CONF_NCSI_MODE_1"] = "Auto Failover";

/*Configure Network*/
eLang.common_strings["STR_CONF_NW_GETVAL"] = "There was a problem while getting Network configuration";
eLang.common_strings["STR_CONF_NW_SETVAL"] = "There was a problem while setting Network configuration.\n";
eLang.common_strings["STR_CONF_NW_GETERR1"] = "Could not get network settings";
eLang.common_strings["STR_CONF_NW_SETERR1"] = "Unable to set the supplied network parameters ";
eLang.common_strings["STR_CONF_NW_SAVE_CONFIRM"] = "This function may change the IP address of the device, and you may lose connectivity in this browser session.\nPlease reconnect using a new browser session after applying the changes.\nDo you want to proceed?";
eLang.common_strings["STR_CONF_NW_RESET_TITLE"] = "Network configuration has been reset";
eLang.common_strings["STR_CONF_NW_RESET_DESC"] = "Network configuration has been reset successfully. It will take few seconds to bring up the interface again. Please close this browser session and open a new browser session to connect to the device with new IP. ";
eLang.common_strings["STR_CONF_NW_ERR_222"] = "Either IP Address or Default Gateway IP is out of range.";
eLang.common_strings["STR_CONF_NW_ERR_223"] = "Invalid IPv4 IP Address";
eLang.common_strings["STR_CONF_NW_ERR_224"] = "Invalid IPv4 Default Gateway";
eLang.common_strings["STR_CONF_NW_ERR_225"] = "Invalid IPv4 Subnet mask";
eLang.common_strings["STR_CONF_NW_ERR_226"] = "Invalid IPv6 IP Address";
eLang.common_strings["STR_CONF_NW_ERR_227"] = "Invalid IPv6 Default Gateway";
eLang.common_strings["STR_CONF_NW_ERR_387"] = "Network interface cannot be disabled, as only one interface is currently enabled.";
eLang.common_strings["STR_CONF_NW_ERR_469"] = "VLAN ID cannot be changed " +
	"directly. To change the VLAN ID, disable the already enabled VLAN " +
	"configuration, then try enabling the VLAN configuration with the " +
	"new VLAN ID.";
eLang.common_strings["STR_CONF_NW_INVALID_V6SUBNET"] = "Invalid IPv6 Subnet prefix length.";
eLang.common_strings["STR_CONF_NW_INVALID_VLANID"] = "Invalid VLAN ID.";
eLang.common_strings["STR_CONF_NW_INVALID_VLANPRIORITY"] = "Invalid VLAN Priority.";
eLang.common_strings["STR_CONF_NW_SAVE_IE_ERROR"] = "IE browsers won\'t work " +
	"correctly if any part of the hostname contain underscore (_) character. " +
	"\nDo you want to proceed?";
eLang.common_strings["STR_CONF_NW_IP4_IP6_ENABLE"] = "Either IPv4 or IPv6 should be enabled";
eLang.common_strings["STR_CONF_NW_INTERFACE_DISABLE"] = "Only one interface is enabled and Interface can not be disabled.";

/*Configure Network Bonding*/
eLang.common_strings["STR_NW_BOND_IFC_1"] = "eth0";
eLang.common_strings["STR_NW_BOND_IFC_2"] = "eth1";
eLang.common_strings["STR_NW_BOND_IFC_3"] = "All";
eLang.common_strings["STR_NW_BOND_MODE_0"] = "balance-rr";
eLang.common_strings["STR_NW_BOND_MODE_1"] = "active-backup";
eLang.common_strings["STR_NW_BOND_MODE_2"] = "balance-xor";
eLang.common_strings["STR_NW_BOND_MODE_3"] = "broadcast";
eLang.common_strings["STR_NW_BOND_MODE_4"] = "802.3ad";
eLang.common_strings["STR_NW_BOND_MODE_5"] = "balance-tlb";
eLang.common_strings["STR_NW_BOND_MODE_6"] = "balance-alb";
eLang.common_strings["STR_CONF_NW_BOND_GETVAL"] = "There was a problem while getting Network Bond configuration.";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL"] = "There was a problem while setting Network Bond configuration.";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_128"] = "Network bonding cannot " +
	"be enabled, due to insufficient number of network interfaces.";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_129"] = 
	eLang.common_strings["STR_CONF_NW_BOND_SETVAL_133"] = "Network bonding " +
	"configurations cannot be saved. The selected interface is presently down.";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_130"] = "Bond cannot be enabled," +
	" As VLAN is enabled for Slave interfaces. \nVLAN can be disabled, " +
	"Network under Configuration menu.";
eLang.common_strings["STR_CONF_NW_BOND_NOT_SUPPORT"] = "Network bonding cannot be supported, due to insufficient number of network interfaces.";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_BOND"] = "Disabling bond will disable the Bonding VLAN configuration.\n";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_AUTO1"] = "Auto configuration is" +
	" enabled, So all the services will be restarted automatically. Click OK" +
	" to proceed.";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_AUTO0"] = "Auto configuration is" +
	" disabled, So the interfaces for services can be configured via IPMI " +
	"command. Click OK to proceed.";
eLang.common_strings["STR_CONF_NW_BOND_SAVE_SUCCESS"] = "The Network Bonding configuration are saved successfully.";

/*Configure Network Link*/
eLang.common_strings["STR_PHY_LINKSPEED_10"] = "10 Mbps";
eLang.common_strings["STR_PHY_LINKSPEED_100"] = "100 Mbps";
eLang.common_strings["STR_PHY_LINKSPEED_1000"] = "1000 Mbps";
eLang.common_strings["STR_PHY_DUPLEXMODE_HALF"] = "Half Duplex";
eLang.common_strings["STR_PHY_DUPLEXMODE_FULL"] = "Full Duplex";
eLang.common_strings["STR_CONF_PHY_GETVAL"] = "There was a problem while getting Network Link configuration.";
eLang.common_strings["STR_CONF_PHY_SETVAL"] = "There was a problem while setting Network Link configuration.";
eLang.common_strings["STR_CONF_PHY_SUPPORT_GETVAL"] = "Unable to get the supported capabilities for the LAN interface";
eLang.common_strings["STR_CONF_PHY_SAVE_SUCCESS"] = "The Network Link configuration has been saved successfully.";
eLang.common_strings["STR_CONF_PHY_SAVE_ERROR"] = "Selected Link speed is not supported.";

/*Configure DNS*/
eLang.common_strings["STR_CONF_DNS_INVALID_HOST"] = "Invalid Host Name";
eLang.common_strings["STR_CONF_DNS_INVALID_DOMAIN"] = "Invalid Domain Name";
eLang.common_strings["STR_CONF_DNS_INVALID_DNS"] = "Invalid DNS Server Address";
eLang.common_strings["STR_CONF_DNS_V6DISABLE"] = "\nNOTE: IPv6 is disabled in network configuration.";
eLang.common_strings["STR_CONF_DNS_BLANK"] = "DNS Server addresses cannot be blank.";
eLang.common_strings["STR_CONF_DNS_DIFF"] = "DNS Server addresses should be different.";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR1"] = "The TSIG private file does not exists";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR5"] = "The TSIG private file size exceeds";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR6"] = "Uploading TSIG private file failed. Please try uploading the TSIG private file again.";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR9"] = "TSIG private key's algorithm is not HMAC-MD5. Please upload a HMAC-MD5 supported TSIG private file.";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR10"] = "Please select a TSIG Private file";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR11"] = "TSIG Private file should end with .private";

/*Configure NTP*/
eLang.common_strings["STR_CONF_NTP_GETVAL"] = "There was a problem while getting NTP configuration";
eLang.common_strings["STR_CONF_NTP_SETVAL"] = "There was a problem while setting NTP configuration";
eLang.common_strings["STR_CONF_DATE_TIME_GETVAL"] = "There was a problem while getting Date and Time values.";
eLang.common_strings["STR_CONF_DATE_TIME_SETVAL"] = "There was a problem while setting Date and Time values.";
eLang.common_strings["STR_CONF_NTP_INVALID_HOUR"] = "Invalid Hour.";
eLang.common_strings["STR_CONF_NTP_INVALID_MINS"] = "Invalid Minutes.";
eLang.common_strings["STR_CONF_NTP_INVALID_SECS"] = "Invalid Seconds.";
eLang.common_strings["STR_CONF_NTP_INVALID_DATE"] = "Invalid Date, ";
eLang.common_strings["STR_CONF_NTP_DATE_RANGE"] = "Date is out of range. Please configure.";
eLang.common_strings["STR_CONF_NTP_INVALID_LEAP"] = "LEAP Year Feb contains only 29 days.";
eLang.common_strings["STR_CONF_NTP_INVALID_FEB"] = "Feb contains only 28 days.";
eLang.common_strings["STR_CONF_NTP_INVALID_MONTH"] = "Selected month contains only 30 days.";
eLang.common_strings["STR_CONF_NTP_INVALID_PRIMARY_SERVER"] = "Invalid Primary NTP Server";
eLang.common_strings["STR_CONF_NTP_INVALID_SECONDARY_SERVER"] = "Invalid Secondary NTP Server";
eLang.common_strings["STR_CONF_NTP_INVALID_SERVERS"] = "Both Primary and Secondary NTP Servers are Invalid";
eLang.common_strings["STR_CONF_NTP_SERVER_FAIL"] = "Temporary failure in synchronizing with NTP Server!";
eLang.common_strings["STR_CONF_NTP_CONFIRM"] = "The configuration changed! Do you want to save those changes?";
eLang.common_strings["STR_CONF_NTP_SAVE"] = "Configuration has been successfully set.";

/*Configure PAM Ordering*/
eLang.common_strings["STR_CONF_PAM_GETVAL"] = "There was a problem while getting PAM order configuration.";
eLang.common_strings["STR_CONF_PAM_SETVAL"] = "There was a problem while setting PAM order configuration.";
eLang.common_strings["STR_CONF_PAM_SUCCESS"] = "PAM Order was configured successfully.";
eLang.common_strings["STR_CONF_PAM_ERR"] = "There is no change in PAM Order with existing PAM Order.";
eLang.common_strings["STR_CONF_PAM_CONFIRM"] = "Web server will be restarted, Click OK to continue?";
eLang.common_strings["STR_CONF_PAM__INTIALIZE_ERR"] = "There is problem while initializing PAM Module";
eLang.common_strings["STR_CONF_PAM__SELECT_ERR"] = "There is problem while selecting PAM Module";

/*Configure PEF -> Event Filter*/
eLang.common_strings["STR_CONF_PEF_ID"] = "PEF ID";
eLang.common_strings["STR_CONF_PEF_CONFIGURATION"] = "Filter Configuration";
eLang.common_strings["STR_CONF_PEF_ACTION"] = "Event Filter Action";
eLang.common_strings["STR_CONF_PEF_EVENT_SEVERITY"] = "Event Severity";
eLang.common_strings["STR_CONF_PEF_SENSOR_NAME"] = "Sensor Name";
eLang.common_strings["STR_CONF_PEF_CNT"] = "Configured Event Filter count: ";
eLang.common_strings["STR_CONF_PEF_GETINFO"] = "There was a problem while " +
	"getting all PEF configuration";
eLang.common_strings["STR_CONF_PEF_DELINFO"] = "There was a problem in " +
	"deleting the PEF configuration";
eLang.common_strings["STR_CONF_PEF_ERR1"] = "Please select a slot in the " +
	"PEF list";
eLang.common_strings["STR_CONF_PEF_ERR2"] = "There is no PEF configured in " +
	"the slot you selected.";
eLang.common_strings["STR_CONF_PEF_CONFIRM1"] = "This slot has already been " +
	"configured with a PEF. Would you like to modify this PEF instead?";
eLang.common_strings["STR_CONF_PEF_CONFIRM2"] = "This slot is currently " +
	"empty. Would you like to add a new PEF?";
eLang.common_strings["STR_CONF_PEF_DELETE_SUCCESS"] = "PEF entry has been " +
	"deleted";

eLang.common_strings["STR_PEF_CFG"] = "Event Filter Configuration";
eLang.common_strings["STR_PEF_ID"] = "PEF ID";
eLang.common_strings["STR_PEF_FILTER"] = "Filter Configuration";
eLang.common_strings["STR_PEF_EVENT"] = "Event Severity";
eLang.common_strings["STR_PEF_ACTION_CFG"] = "Filter Action configuration";
eLang.common_strings["STR_PEF_ACTION"] = "Event Filter Action";
eLang.common_strings["STR_PEF_ALERT"] = "Alert";
eLang.common_strings["STR_PEF_POWER"] = "Power Action";
eLang.common_strings["STR_PEF_POLICY"] = "Alert Policy Number";
eLang.common_strings["STR_PEF_GNTR_CFG"] = "Generator ID configuration";
eLang.common_strings["STR_PEF_GNTR_DATA"] = "Generator ID Data";
eLang.common_strings["STR_PEF_GNTR_RAW"] = "Raw Data";
eLang.common_strings["STR_PEF_GNTR_ID1"] = "Generator ID 1";
eLang.common_strings["STR_PEF_GNTR_ID2"] = "Generator ID 2";
eLang.common_strings["STR_PEF_GNTR_TYPE"] = "Event Generator";
eLang.common_strings["STR_PEF_GNTR_SLAVE"] = "Slave type";
eLang.common_strings["STR_PEF_GNTR_SOFTWARE"] = "Software type";
eLang.common_strings["STR_PEF_SLAVE_SW"] = "Slave Address/Software ID";
eLang.common_strings["STR_PEF_CHANNEL_NO"] = "Channel Number";
eLang.common_strings["STR_PEF_IPMB_DEVICE"] = "IPMB Device LUN";
eLang.common_strings["STR_PEF_SENSOR_CFG"] = "Sensor configuration";
eLang.common_strings["STR_PEF_SENSORTYPE"] = "Sensor Type";
eLang.common_strings["STR_PEF_SENSORNAME"] = "Sensor Name";
eLang.common_strings["STR_PEF_EVENT_OPT"] = "Event Options";
eLang.common_strings["STR_PEF_SENSOREVENTS"] = "Sensor Events";
eLang.common_strings["STR_PEF_EVT_DATA_CFG"] = "Event Data configuration";
eLang.common_strings["STR_PEF_TRIGGER"] = "Event Trigger";
eLang.common_strings["STR_PEF_EVENT1_AND"] = "Event Data 1 AND Mask";
eLang.common_strings["STR_PEF_EVENT1_COMPARE1"] = "Event Data 1 Compare 1";
eLang.common_strings["STR_PEF_EVENT1_COMPARE2"] = "Event Data 1 Compare 2";
eLang.common_strings["STR_PEF_EVT_DATA2_CFG"] = "Event Data 2 configuration";
eLang.common_strings["STR_PEF_EVENT2_AND"] = "Event Data 2 AND Mask";
eLang.common_strings["STR_PEF_EVENT2_COMPARE1"] = "Event Data 2 Compare 1";
eLang.common_strings["STR_PEF_EVENT2_COMPARE2"] = "Event Data 2 Compare 2";
eLang.common_strings["STR_PEF_EVT_DATA3_CFG"] = "Event Data 3 configuration";
eLang.common_strings["STR_PEF_EVENT3_AND"] = "Event Data 3 AND Mask";
eLang.common_strings["STR_PEF_EVENT3_COMPARE1"] = "Event Data 3 Compare 1";
eLang.common_strings["STR_PEF_EVENT3_COMPARE2"] = "Event Data 3 Compare 2";

eLang.common_strings["STR_PEF_SEVERITY"] = "Unspecified";
eLang.common_strings["STR_PEF_SEVERITY_0"] = "Monitor";
eLang.common_strings["STR_PEF_SEVERITY_1"] = "Information";
eLang.common_strings["STR_PEF_SEVERITY_2"] = "Normal";
eLang.common_strings["STR_PEF_SEVERITY_3"] = "Non-Critical";
eLang.common_strings["STR_PEF_SEVERITY_4"] = "Critical";
eLang.common_strings["STR_PEF_SEVERITY_5"] = "Non-Recoverable";
eLang.common_strings["STR_PEF_POWER_1"] = "Power Down";
eLang.common_strings["STR_PEF_POWER_2"] = "Power Reset";
eLang.common_strings["STR_PEF_POWER_3"] = "Power Cycle";

/*Configure PEF -> Add or Modify Event Filter*/
eLang.common_strings["STR_PEF_TITLE_1"] = "Add Event Filter entry";
eLang.common_strings["STR_PEF_TITLE_2"] = "Modify Event Filter entry";
eLang.common_strings["STR_ADD_PEF_DESC"] = "Use this page to add new Event " +
	"Filter entry. Click 'Add' to save the newly configured event filter.";
eLang.common_strings["STR_MODIFY_PEF_DESC"] = "Use this page to modify the " +
	"existing Event Filter entry. Click 'Modify' to accept the modification.";
eLang.common_strings["STR_CONF_PEF_CFGINFO"] = "There was a problem while " +
	"configuring PEF";
eLang.common_strings["STR_CONF_PEF_SUCCESS_1"] = "The PEF entry is added " +
	"successfully!";
eLang.common_strings["STR_CONF_PEF_SUCCESS_2"] = "The PEF entry has been " +
	"modified successfully";
eLang.common_strings["STR_CONF_PEF_CONFIRM1"] = "This slot has already been " +
	"configured with a Event Filter entry. Would you like to modify this " +
	"entry instead?";
eLang.common_strings["STR_CONF_PEF_CONFIRM2"] = "This slot is currently empty. " +
	"Would you like to add a new Event Filter entry?";
eLang.common_strings["STR_PEF_EVENT_LOW"] = "Going Low";
eLang.common_strings["STR_PEF_EVENT_HIGH"] = "Going High";
eLang.common_strings["STR_PEF_ALL_EVENTS"] = "All Events";
eLang.common_strings["STR_PEF_SENSOR_EVENTS"] = "Sensor Events";
eLang.common_strings["STR_PEF_ALERT_ERR"] = "Event Filter Action, Alert must " +
	"be enabled!";
eLang.common_strings["STR_PEF_EVT_TRIG_ERR"] = "Invalid Event Trigger.";
eLang.common_strings["STR_PEF_EVT1_MASK_ERR"] = "Invalid Event data 1 AND " +
	"Mask.";
eLang.common_strings["STR_PEF_EVT1_CMP1_ERR"] = "Invalid Event Data 1 " +
	"Compare 1.";
eLang.common_strings["STR_PEF_EVT1_CMP2_ERR"] = "Invalid Event Data 1 " +
	"Compare 2.";
eLang.common_strings["STR_PEF_EVT2_MASK_ERR"] = "Invalid Event data 2 AND " +
	"Mask.";
eLang.common_strings["STR_PEF_EVT2_CMP1_ERR"] = "Invalid Event Data 2 " +
	"Compare 1.";
eLang.common_strings["STR_PEF_EVT2_CMP2_ERR"] = "Invalid Event Data 2 " +
	"Compare 2.";
eLang.common_strings["STR_PEF_EVT3_MASK_ERR"] = "Invalid Event data 3 AND " +
	"Mask.";
eLang.common_strings["STR_PEF_EVT3_CMP1_ERR"] = "Invalid Event Data 3 " +
	"Compare 1.";
eLang.common_strings["STR_PEF_EVT3_CMP2_ERR"] = "Invalid Event Data 3 " +
	"Compare 2.";

/*Configure PEF -> Alert Policy*/
eLang.common_strings["STR_POLICY_ENTRY"] = "Policy Entry #";
eLang.common_strings["STR_POLICY_NO"] = "Policy Number";
eLang.common_strings["STR_POLICY_SETTING"] = "Policy Configuration";
eLang.common_strings["STR_POLICY_SET"] = "Policy Set";
eLang.common_strings["STR_CHANNEL_NO"] = "Channel Number";
eLang.common_strings["STR_DEST_SELECT"] = "Destination Selector";
eLang.common_strings["STR_POLICY_CNT"] = "Configured Alert Policy count: ";
eLang.common_strings["STR_POLICY_GETVAL"] = "There was a problem while getting all Policy configuration";
eLang.common_strings["STR_POLICY_DELETEVAL"] = "There was a problem while deleting Alert Policy configuration";
eLang.common_strings["STR_CONF_POLICY_ERR1"] = "Please select a slot in the Alert Policy list";
eLang.common_strings["STR_CONF_POLICY_ERR2"] = "There is no alert policy configured in the slot you selected.";
eLang.common_strings["STR_CONF_POLICY_CONFIRM1"] = "This slot has already been configured with a Alert Policy. Would you like to modify this entry instead?";
eLang.common_strings["STR_CONF_POLICY_CONFIRM2"] = "This slot is currently empty. Would you like to add a new alert policy?";
eLang.common_strings["STR_CONF_POLICY_DELETE_SUCCESS"] = "Alert Policy entry has been deleted";

/*Configure PEF -> Add or Modify Alert Policy*/
eLang.common_strings["STR_ADD_ALERT_POLICY"] = "Add Alert Policy entry";
eLang.common_strings["STR_MODIFY_ALERT_POLICY"] = "Modify Alert Policy entry";
eLang.common_strings["STR_CONF_POLICY_ADD_SUCCESS"] = "The Alert Policy entry was added successfully!";
eLang.common_strings["STR_CONF_POLICY_MOD_SUCCESS"] = "The Alert Policy was modified successfully";
eLang.common_strings["STR_POLICY_SETVAL"] = "There was a problem while setting Alert Policy configuration";
eLang.common_strings["STR_ALERT_STRING"] = "Alert String";
eLang.common_strings["STR_ALERT_STRING_KEY"] = "Alert String Key";
eLang.common_strings["STR_EVENT_SPECIFIC"] = "Event Specific";

eLang.common_strings["STR_POLICY_SET_STR_0"] = "Always send alert to this destination";
eLang.common_strings["STR_POLICY_SET_STR_1"] = "If alert to previous destination was successful, do not send alert to this destination. Proceed to next entry in this policy set.";
eLang.common_strings["STR_POLICY_SET_STR_2"] = "If alert to previous destination was successful, do not send alert to this destination. Do not process any more entries in this policy set.";
eLang.common_strings["STR_POLICY_SET_STR_3"] = "If alert to previous destination was successful, do not send alert to this destination. Proceed to next entry in this policy set that is to a different channel.";
eLang.common_strings["STR_POLICY_SET_STR_4"] = "If alert to previous destination was successful, do not send alert to this destination. Proceed to next entry in this policy set that is to a different destination type.";

/*Configure PEF -> LAN Destination*/
eLang.common_strings["STR_LAN_DEST_HEAD1"] = "LAN Destination";
eLang.common_strings["STR_LAN_DEST_HEAD2"] = "Destination Type";
eLang.common_strings["STR_LAN_DEST_HEAD3"] = "Destination Address";
eLang.common_strings["STR_LAN_DEST_CNT"] = "Configured LAN Destination count: ";
eLang.common_strings["STR_LAN_DEST_GETVAL"] = "There was a problem while getting all LAN Destination";
eLang.common_strings["STR_LAN_DEST_DELETEVAL"] = "There was a problem while deleting LAN Destination";
eLang.common_strings["STR_LAN_DEST_ALERT_FAILURE"] ="There was a problem while sending test alerts.";
eLang.common_strings["STR_LAN_DEST_ERR1"] = "Please select a slot in the LAN destination list";
eLang.common_strings["STR_LAN_DEST_ERR2"] = "There is no LAN destination configured in the slot you selected.";
eLang.common_strings["STR_LAN_DEST_CONFIRM1"] = "This slot has already been configured with a LAN destination. Would you like to modify this entry instead?";
eLang.common_strings["STR_LAN_DEST_CONFIRM2"] = "This slot is currently empty. Would you like to add a new LAN destination entry?";
eLang.common_strings["STR_LAN_DEST_DEL_SUCCESS"] = "The LAN destination entry has been deleted";
eLang.common_strings["STR_LAN_DEST_ALERT_SUCCESS"] ="A test alert has been "+
	"sent to the destination. Please check to see if you have received " +
	"the alert, the system doesn't check the alert is successful "+
	"or not";

/*Configure PEF -> Add or Modify LAN Destination*/
eLang.common_strings["STR_LAN_DEST_1"] = "Add LAN Destination entry";
eLang.common_strings["STR_LAN_DEST_2"] = "Modify LAN Destination entry";
eLang.common_strings["STR_LAN_DEST_SETVAL"] = "There was a problem while setting LAN Destination";
eLang.common_strings["STR_LAN_DEST_SUCCESS_1"] = "The LAN destination entry was added successfully!";
eLang.common_strings["STR_LAN_DEST_SUCCESS_2"] = "The LAN Destination entry was modified successfully";

eLang.common_strings["STR_DEST_TYPE_0"] = "Snmp Trap";
eLang.common_strings["STR_DEST_TYPE_6"] = "Email Alert";
eLang.common_strings["STR_EMAIL_SUBJECT"] = "Subject";
eLang.common_strings["STR_EMAIL_MESSAGE"] = "Message";
eLang.common_strings["STR_LAN_DEST_ADDR_ERR"] = "Invalid Destination Address.";
eLang.common_strings["STR_LAN_NO_EMAIL_CONFIRM"] = "Email address is not configured for this User. Do you want to continue anyway?";
eLang.common_strings["STR_LAN_EMAIL_SUB_ERR"] = "The subject field should not be blank.";
eLang.common_strings["STR_LAN_EMAIL_MSG_ERR"] = "The message field should not be blank.";

/*Configure RADIUS*/
eLang.common_strings["STR_CONF_RADIUS_DESC_0"] = "The RADIUS Authentication is " + 
	"currently disabled. To enable RADIUS Authentication and enter the required " + 
	"information to access the RADIUS server. Press the Save button to save your " +
	"changes. To configure the Advanced settings, RADIUS Server authentication " +
	"should be enabled.";
eLang.common_strings["STR_CONF_RADIUS_DESC_1"] = "The RADIUS Authentication is " + 
	"currently enabled. Enter the required information to access the RADIUS server " + 
	"and Click the Save button to save your changes. To configure Advanced " +
	"settings click Advanced settings button.";
eLang.common_strings["STR_CONF_RADIUS_SAVE_SUCCESS"] = "The RADIUS configuration has been successfully set.";
eLang.common_strings["STR_CONF_RADIUS_PRIV_SAVE_SUCCESS"] = "The RADIUS privilege configuration has been successfully set.";
eLang.common_strings["STR_CONF_RADIUS_GETVAL"] = "There was a problem while getting RADIUS values";
eLang.common_strings["STR_CONF_RADIUS_SETVAL"] = "There was a problem while configuring RADIUS values";
eLang.common_strings["STR_PRIVILEGE_NOACCESS"] = "No Access";
eLang.common_strings["STR_PRIVILEGE_OEM"] = "OEM Proprietary";
eLang.common_strings["STR_PRIVILEGE_OPERATOR"] = "Operator";
eLang.common_strings["STR_PRIVILEGE_USER"] = "User";
eLang.common_strings["STR_PRIVILEGE_ADMIN"] = "Administator";
eLang.common_strings["STR_PRIVILEGE_ERR_1"] = "Invalid vendor specific string.\n";
eLang.common_strings["STR_CONF_RADIUS_TITLE"] = "Radius Authorization";
eLang.common_strings["STR_CONF_RADIUS_NOT_ENABLED"] = "Radius is not enabled you can not set Advanced Setting";


/*Configure Remote Session*/
eLang.common_strings["STR_CONF_REMOTE_SUPPORT_DESC"] = "This page is used to configure Remote Session settings";
eLang.common_strings["STR_CONF_NO_REMOTE_SUPPORT_DESC"] = "There is no configuaration support enable presently";
eLang.common_strings["STR_CONF_RMT_SESS_GETVAL"] = "There was a problem while getting Remote Session configuration";
eLang.common_strings["STR_CONF_RMT_SESS_SETVAL"] = "There was a problem while configuring Remote Session Information";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_1"] = "On changing the settings, " +
		"It will automatically close the existing remote redirection(KVM or " +
		"Virtual Media) sessions, if needed. Do you want to proceed further?";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_2"] = "On changing the settings, " +
		"All KVM and VMedia sessions will now be available using HTTP/HTTPS ports. " +
		"Secured KVM and VMedia sessions can be established using HTTPS based " +
		"sessions. Do you want to proceed further?";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_3"] = "On changing the settings, " +
"All KVM and VMedia sessions will now be available only on non secure ports. " +
"Secured KVM and VMedia sessions can be achieved by enabling KVM encryption. " +
"Do you want to proceed further?";
eLang.common_strings["STR_CONF_RMT_SESS_SAVE_SUCCESS"] = "The Remote Session settings are saved successfully.";
eLang.common_strings["STR_CONF_RMT_SESS_INVALID_RETRY_INTERVAL"] = "Invalid Retry Time Interval.";
eLang.common_strings["STR_CONF_RMT_SESS_VMATTACH_0"] = "Attach";
eLang.common_strings["STR_CONF_RMT_SESS_VMATTACH_1"] = "Auto Attach";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_0"] = "Auto Detect (AD)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_1"] = "Danish (DA)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_2"] = "Dutch Belgium (NL-BE)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_3"] = "Dutch Netherland (NL-NL)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_4"] = "English UK (GB)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_5"] = "English US (US)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_6"] = "Finnish (FI)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_7"] = "French Belgium (FR-BE)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_8"] = "French France (FR)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_9"] = "German Germany (DE)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_10"] = "German Switzerland (DE-CH)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_11"] = "Italian (IT)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_12"] = "Japanese (JP)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_13"] = "Norwegian (NO)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_14"] = "Portuguese (PT)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_15"] = "Spanish (ES)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_16"] = "Swedish (SV)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_17"] = "Turkish F (TR_F)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_18"] = "Turkish Q (TR_Q)";

eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_0"] = "AD";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_1"] = "DA";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_2"] = "NL-BE";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_3"] = "NL-NL";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_4"] = "GB";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_5"] = "US";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_6"] = "FI";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_7"] = "FR-BE";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_8"] = "FR";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_9"] = "DE";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_10"] = "DE-CH";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_11"] = "IT";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_12"] = "JP";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_13"] = "NO";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_14"] = "PT";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_15"] = "ES";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_16"] = "SV";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_17"] = "TR_F";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_INDEX_18"] = "TR_Q";
eLang.common_strings["STR_CONF_RMT_SESS_ERR_1"] = "Invalid Retry Count.\n";
eLang.common_strings["STR_CONF_RMT_SESS_ERR_2"] = "Invalid Retry Time Interval.\n";
eLang.common_strings["STR_RMT_SUPPORT_AUTO_LOCAL_MONITOR"] = "Select Local Monitor OFF if Automatically OFF Local Monitor Checked";

/*Configure Services*/
eLang.common_strings["STR_CONF_SERVICES_GETVAL"] = "There was a problem while getting services configuration";
eLang.common_strings["STR_CONF_SERVICES_SETVAL"] = "There was a problem while setting services configuration";
eLang.common_strings["STR_CONF_SERVICES_NAME"] = "Service Name";
eLang.common_strings["STR_CONF_SERVICES_STATE"] = "Current State";
eLang.common_strings["STR_CONF_SERVICES_IFC"] = "Interfaces";
eLang.common_strings["STR_CONF_SERVICES_NSPORT"] = "Nonsecure Port";
eLang.common_strings["STR_CONF_SERVICES_SECPORT"] = "Secure Port";
eLang.common_strings["STR_CONF_SERVICES_TIMEOUT"] = "Timeout";
eLang.common_strings["STR_CONF_SERVICES_MAXSESS"] = "Maximum Sessions";
eLang.common_strings["STR_CONF_SERVICES_ACTIVESESS"] = "Active Sessions";
eLang.common_strings["STR_CONF_SERVICES_CNT"] = "Number of Services: ";
eLang.common_strings["STR_CONF_SERVICES_ERR"] = "Please select a slot in the Services list";
eLang.common_strings["STR_CONF_SERVICES_MODIFY"] = "Modify Service";
eLang.common_strings["STR_CONF_SERVICES_SUCCESS"] = "Service was configured successfully";
eLang.common_strings["STR_CONF_SERVICES_SETERR_132"] = "Port value is already in use";
eLang.common_strings["STR_CONF_SERVICES_SETERR_134"] = "Invalid Maximum sessions or Active sessions";
eLang.common_strings["STR_CONF_SERVICES_CONFIRM"] = "On changing the configuration, already opened sessions for the service will be affected, also the service will be restarted. Click OK to continue?";
eLang.common_strings["STR_CONF_SERVICES_CNFMWEB"] = "\nNOTE: Login session will be logged out.";
eLang.common_strings["STR_CONF_SERVICES_CNFMSSH"] = "\nNOTE: Configured timeout value is applied to Telnet service also.";
eLang.common_strings["STR_CONF_SERVICES_CNFMTELNET"] = "\nNOTE: Configured timeout value is applied to SSH service also.";
eLang.common_strings["STR_CONF_SERVICES_CNFM_DIS_INTERFACE"] = "\nNOTE: " +
	"Interface is currently disabled, Services mapping to disabled interface " +
	"will not work.";
/*Session configuration strings*/
eLang.common_strings["STR_SERVICE_SESSION_IP"] = "IP Address";
eLang.common_strings["STR_SERVICE_SESSION_UID"] = "User ID";
eLang.common_strings["STR_SERVICE_SESSION_UNAME"] = "User Name";
eLang.common_strings["STR_SERVICE_SESSION_ID"] = "Session ID";
eLang.common_strings["STR_SERVICE_SESSION_STYPE"] = "Session Type";
eLang.common_strings["STR_SERVICE_SESSION_UPRIV"] = "User Privillege";
eLang.common_strings["STR_SERVICE_SESSION_GETVAL"] = "There was a problem " +
	"while getting services information";
eLang.common_strings["STR_SESSION_INFO_TITLE"] = "Active Session";
eLang.common_strings["STR_CONF_SESSION_CONFIRM"] = "The selected session will " +
	"be terminated. Do you want to continue?";
eLang.common_strings["STR_CONF_SESSION_CONFIRM1"] = "This operation will terminate " +
	"your currently logged-in web session. Do you want to continue?";
eLang.common_strings["STR_CONF_SESSION_SUCCESS"] = "The selected session is " +
	"terminated successfully";
eLang.common_strings["STR_CONF_SESSION_SETVAL"] = "There was a problem while " +
	"terminating the selected session";
eLang.common_strings["STR_CONF_SESSION_ERR"] = "Please select a session and " +
	"terminate";
eLang.common_strings["STR_NO_SESSION_INFO"] = "There is No Active Session";
eLang.common_strings["STR_CONF_SESSION_CNT"] = "Number of Sessions: ";
eLang.common_strings["STR_CONF_SESSION_ADMINPRIV"] ="You need to have " +
	"administrator privileges to view session informations.";

/*Configure SMTP*/
eLang.common_strings["STR_CONF_SMTP_GETVAL"] = "There was a problem while getting SMTP configuration.";
eLang.common_strings["STR_CONF_SMTP_SETVAL"] = "There was a problem while setting SMTP configuration.";
eLang.common_strings["STR_CONF_SMTP_SAVE_SUCCESS"] ="SMTP Server configuration has been modified successfully.";
eLang.common_strings["STR_CONF_SMTP_SENDERADDR"] = "Sender Address";
eLang.common_strings["STR_CONF_SMTP_INVALID_MACHINENAME"] = "Invalid Machine Name format";
eLang.common_strings["STR_CONF_SMTP_PRIMARY"] = "Primary SMTP Server - ";
eLang.common_strings["STR_CONF_SMTP_SECONDARY"] = "Secondary SMTP Server - ";
eLang.common_strings["STR_CONF_SMTP_DIFF_SMTPSRVR"] = "The Primary SMTP Server address should be different from Secondary SMTP Server address.";

/*SMTP Error Strings*/
eLang.common_strings["STR_SMTP_FAILURE1"] = "The Authentication type is not supported by SMTP Server";
eLang.common_strings["STR_SMTP_FAILURE2"] = "The SMTP Server Authentication Failure";
eLang.common_strings["STR_SMTP_FAILURE3"] = "Unable to connect to SMTP Server";

/*EMail Error Strings*/
eLang.common_strings["STR_EMAIL_FAILURE1"] = "No such user exists";
eLang.common_strings["STR_EMAIL_FAILURE2"] = "Email ID is not configured for the User";
eLang.common_strings["STR_EMAIL_TESTALERT"] = "Unable to send test alert to the configured email ID";
eLang.common_strings["STR_EMAIL_USER_ACCESS"] = "Unable to send test alert, since the user access is disabled";
eLang.common_strings["STR_EMAIL_FRGT_PSWD"] = "Unable to send newly generated password to the configured email ID";

/*Configure SSL*/
eLang.common_strings["STR_CONF_SSL_FILE_GETVAL"] = "There was a problem while getting SSL certificate status.";
eLang.common_strings["STR_CONF_SSL_INVALID_CERT1"] = "Please select a SSL Certificate file";
eLang.common_strings["STR_CONF_SSL_INVALID_CERT2"] = "SSL Certificate file should end with .pem";
eLang.common_strings["STR_CONF_SSL_INVALID_PRIVKEY1"] = "Please select a SSL Privacy key file";
eLang.common_strings["STR_CONF_SSL_INVALID_PRIVKEY2"] = "SSL Privacy key file should end with .pem";
eLang.common_strings["STR_CONF_SSL_UPLD_CONFIRM0"] = "Uploading a  new SSL "+
	"certificate will restart the HTTPs Service.\nDo you want to continue?";
eLang.common_strings["STR_CONF_SSL_UPLD_CONFIRM1"] = "A SSL Certificate already " +
	"exists. Loading a new SSL certificate will replace the existing " +
	"certificate and will restart the HTTPs Service. \nClick OK to continue?";
eLang.common_strings["STR_CONF_SSL_SAVE_SUCCESS"] = "The Certificate and Key are uploaded successfully.";
eLang.common_strings["STR_CONF_SSL_CERT_ERR1"] = "The SSL Certificate or key file does not exists";
eLang.common_strings["STR_CONF_SSL_CERT_ERR2"] = "The SSL Certificate is encrypted. Please upload unencrypted certificate.";
eLang.common_strings["STR_CONF_SSL_CERT_ERR3"] = "The SSL certificate validation failed. Please try to upload the certificate and key again.";
eLang.common_strings["STR_CONF_SSL_CERT_ERR4"] = "Uploading SSL certificate failed. Please try uploading the certificate and key again.";
eLang.common_strings["STR_CONF_SSL_CERT_ERR5"] = "The SSL certificate or key file size exceeds";
eLang.common_strings["STR_CONF_SSL_CERT_ERR128"] = "The SSL Certificate is " +
	"expired. Please upload valid certificate.\nNOTE: Please check the BMC " +
	"current time in NTP under Configuration menu.";
eLang.common_strings["STR_CONF_SSL_CERT_ERR129"] = "The SSL Certificate is " +
	"untrusted. Please upload trusted certificate.";
eLang.common_strings["STR_CONF_SSL_VALIDATE_ERR"] = "There was a problem while validating SSL Certificate and Key";
eLang.common_strings["STR_CONF_SSLCERTUPLOAD_ABORT"] = "By navigating to other pages the SSL upload process will be aborted.\nDo you want to continue?";
eLang.common_strings["STR_CONF_SSLCERTUPLOAD_ALERT"] = "Closing the web session causes the SSL upload process to be aborted!"
eLang.common_strings["STR_CONF_SSL_GNRT_CERT"] = "There was a problem while generating SSL certificate.";
eLang.common_strings["STR_CONF_SSL_GNRT_CONFIRM"] = "Generating a new SSL "+
	"certificate will restart the HTTPs service. \nClick 'OK' to continue?";
eLang.common_strings["STR_CONF_SSL_COMMON_NAME_ERR"] = "Invalid Common Name.";
eLang.common_strings["STR_CONF_SSL_ORGANIZATION_ERR"] = "Invalid Organization.";
eLang.common_strings["STR_CONF_SSL_ORG_UNIT_ERR"] = "Invalid Organization Unit.";
eLang.common_strings["STR_CONF_SSL_CITY_ERR"] = "Invalid City or Locality.";
eLang.common_strings["STR_CONF_SSL_STATE_ERR"] = "Invalid State or Province.";
eLang.common_strings["STR_CONF_SSL_COUNTRY_ERR"] = "Invalid Country.";
eLang.common_strings["STR_CONF_SSL_VALID_FOR_ERR"] = "Invalid Valid count of days.";
eLang.common_strings["STR_CONF_SSL_GNRT_SUCCESS"] = "The SSL Certificate was generated successfully.";
eLang.common_strings["STR_CONF_SSL_VIEW_CERT"] = "There was a problem while viewing SSL certificate.";

/* Configure Service License */
eLang.common_strings["STR_LICENSE_CFG_FEATURE_NAME"] = "Feature Name";
eLang.common_strings["STR_LICENSE_CFG_FEATURE_VALIDITY"] = "Validity";
eLang.common_strings["STR_LICENSE_CFG_GETVAL"] = "There was a problem while getting license information";
eLang.common_strings["STR_LICENSE_CFG_CNT"] = "Number of Licensed Features: ";
eLang.common_strings["STR_LICENSE_CFG_SETVAL"] = "There was a problem while setting license key information";
eLang.common_strings["STR_LICENSE_CFG_INVALID_KEY"] = "Invalid License Key.";
eLang.common_strings["STR_LICENSE_CFG_SUCCESS"] = "License Key Uploaded successfully";
eLang.common_strings["STR_LICENSE_CFG_KEY"] = "License Key";
eLang.common_strings["STR_LICENSE_CFG_ADV_TITLE"] = "Upload License Key";
eLang.common_strings["STR_LICENSE_CFG_NO_LICENSE"] = "No License";
eLang.common_strings["STR_LICENSE_CFG_LIFETIME"] = "Full";
eLang.common_strings["STR_LICENSE_CFG_DAYS"] = "Day(s)";
eLang.common_strings["STR_LICENSE_CONFIRM_UPDATE"] = "This operation might " +
	"change the functionality of the web interface. So, in order for the " +
	"changes to take effect, the current session will be logged out. " +
	"On changing the settings will automatically close the existing " +
	"remote redirection(KVM or Virtual Media) sessions. " +
	"\nDo you want to proceed?";

/*Configure System and Audit Log*/
eLang.common_strings["STR_CONF_SYS_AUDIT_GETVAL"] = "There was a problem while getting Audit and System Log values";
eLang.common_strings["STR_CONF_SYS_AUDIT_SETVAL"] = "There was a problem while configuring Audit and System Log values";
eLang.common_strings["STR_CONF_SYS_AUDIT_SAVE_SUCCESS"] = "The System and Audit Log configuration has been successfully set.";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_FILESIZE"] = "Invalid File Size.";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_ROTATECNT"] = "Invalid Rotate Count value.";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_LOGTYPE"] = "Invalid Log Type. Choose any one of the log type";

/*Configure Users*/
eLang.common_strings["STR_CONF_USER_ID"] = "UserID";
eLang.common_strings["STR_CONF_USER_NAME"] = "Username";
eLang.common_strings["STR_CONF_USER_PWORDSIZE"] = "Password Size";
eLang.common_strings["STR_CONF_USER_CNFMPWORD"] = "Confirm Password";
eLang.common_strings["STR_CONF_USER_ACCESS"] = "User Access";
eLang.common_strings["STR_CONF_USER_EMAIL"] = "Email ID";
eLang.common_strings["STR_CONF_USER_EMAIL_FORMAT"] = "Email Format";
eLang.common_strings["STR_CONF_USER_NWPRIV"] = "Network Privilege";
eLang.common_strings["STR_CONF_USER_SRLPRIV"] = "Serial Privilege";
eLang.common_strings["STR_CONF_USER_UPLOADSSH"] = "Uploaded SSH Key";
eLang.common_strings["STR_CONF_USER_NEWSSH"] = "New SSH Key";
eLang.common_strings["STR_ADD_USER"] = "Add User";
eLang.common_strings["STR_MODIFY_USER"] = "Modify User";

eLang.common_strings["STR_CONF_USER_CNT"] = "Number of configured users: ";
eLang.common_strings["STR_CONF_USER_GETINFO"] = " There was a problem while getting all the user information";
eLang.common_strings["STR_CONF_USER_SETINFO"] = "There was a problem while configuring a user. ";
eLang.common_strings["STR_CONF_USER_DELINFO"] = "There was a problem while deleting the user information";
eLang.common_strings["STR_CONF_EMAILFORMAT_GETINFO"] = " There was a problem while getting all email format information";
eLang.common_strings["STR_CONF_USER_CONFIRM1"] = "This slot has already been configured with an user. Would you like to modify this user instead?";
eLang.common_strings["STR_CONF_USER_CONFIRM2"] = "This slot is currently empty. Would you like to add a new user?";
eLang.common_strings["STR_CONF_USER_ERR1"] = "Please select a user in the user list";
eLang.common_strings["STR_CONF_USER_ERR3"] = "There is no user configured in the slot you selected.";
eLang.common_strings["STR_CONF_USER_ERR4"] = "This user is a logged in user and cannot be deleted.";
eLang.common_strings["STR_CONF_USER_ERR5"] = "Username already exists, please try with some other username";
eLang.common_strings["STR_CONF_USER_ERR6"] = "Email ID already exists, configure different Email ID";
eLang.common_strings["STR_CONF_USER_ERR7"] = "Reserved username, please try with some other username";
eLang.common_strings["STR_CONF_USER_DELETE_SUCCESS"] = "User has been deleted";
eLang.common_strings["STR_CONF_USER_SUCCESS0"] = "The user was added successfully!";
eLang.common_strings["STR_CONF_USER_SUCCESS1"] = "Modified user successfully";
eLang.common_strings["STR_CONF_SSH_VALIDATE_ERR"] = "The SSH key validation failed. Please try to upload the key again.";
eLang.common_strings["STR_CONF_SSH_ERR1"] = "The SSH key file does not exists.";
eLang.common_strings["STR_CONF_SSH_ERR4"] = "Uploading SSL key failed. Please try uploading the key again.";
eLang.common_strings["STR_CONF_SSH_ERR5"] = "The SSH key file size exceeds.";

/*Configure Users-SNMP*/
eLang.common_strings["STR_CONF_SNMP_STATUS"] = "SNMP Status";
eLang.common_strings["STR_CONF_SNMP_ACCESS"] = "SNMP Access";
eLang.common_strings["STR_CONF_SNMP_AUTHPROT"] = "Authentication Protocol";
eLang.common_strings["STR_CONF_SNMP_PRIVPROT"] = "Privacy Protocol";

eLang.common_strings["STR_CONF_SNMP_GETVAL"] = "There was a problem while getting SNMP configuration";
eLang.common_strings["STR_CONF_SNMP_SETVAL"] = "There was a problem while configuring SNMP Information";
eLang.common_strings["STR_READ_ONLY"] = "Read Only";
eLang.common_strings["STR_READ_WRITE"] = "Read Write";
eLang.common_strings["STR_CONF_SNMP_INVALID_COMM_STR"] = "Invalid Community String";
eLang.common_strings["STR_CONF_SNMP_INVALID_USER_ACCOUNT"] = "Invalid User Account";
eLang.common_strings["STR_CONF_SNMP_INVALID_AUTH_PASS"] = "Invalid Authentication Passphrase";
eLang.common_strings["STR_CONF_SNMP_INVALID_PRIV_PASS"] = "Invalid Privacy Passphrase";
eLang.common_strings["STR_CONF_SNMP_SAVE_SUCCESS"] ="SNMP configuration has been saved successfully.";

/*Configure Virtual Media Devices*/
eLang.common_strings["STR_CONF_VMEDIA_GETVAL"] = "There was a problem while getting virtual media device configuration";
eLang.common_strings["STR_CONF_VMEDIA_SETVAL"] = "There was a problem while setting virtual media device configuration";
eLang.common_strings["STR_CONF_VMEDIA_CONFIRM"] = "Changing the Virtual media configuration would require to close all the existing virtual media redirection session and restarting them. Click OK to proceed.";
eLang.common_strings["STR_CONF_VMEDIA_SAVE_SUCCESS"] = "The Virtual Media device configuration settings have been saved successfully.";
eLang.common_strings["STR_CONF_KVM_VMEDIA_SETVAL"] = "Remote KVM Device count values should be less than or equal to Virtual Device Count";
eLang.common_strings["STR_CONF_KVM_VMEDIA_IN_PROGRESS"] = "Media redirection in progress,Please try after some time.";


/*Configure Firewall*/
eLang.common_strings["STR_CONF_FWALL_BLOCK_ALL"] = "Block All";
eLang.common_strings["STR_CONF_FWALL_ALLOW_ALL"] = "Allow All";
eLang.common_strings["STR_CONF_FWALL_FLUSH_ALL"] = "Flush All";
eLang.common_strings["STR_CONF_FWALL_ADV_TITLE"] = "Advanced Firewall Settings";
eLang.common_strings["STR_CONF_FWALL_ALLOW"] = "Allow";
eLang.common_strings["STR_CONF_FWALL_BLOCK"] = "Block";
eLang.common_strings["STR_CONF_FWALL_SAVE_SUCCESS"] = "The Firewall configuration has been successfully set.";
eLang.common_strings["STR_CONF_FWALL_GETVAL"] = "There was a problem while getting Firewall configuration";
eLang.common_strings["STR_CONF_FWALL_SETVAL"] = "There was a problem while setting Firewall configuration";
eLang.common_strings["STR_CONF_FWALL_SAVE_FLUSH_RESULT_1"] = "Iptables has been flushed successfully";
eLang.common_strings["STR_CONF_FWALL_SAVE_RESULT_1"] = "Firewall settings was added successfully";
eLang.common_strings["STR_CONF_FWALL_SAVE_RESULT_3"] = "Firewall settings was deleted successfully";
eLang.common_strings["STR_FWALL_SETTING"] = "Settings";
eLang.common_strings["STR_CONF_SETTINGS_CNT"] = "Configured settings rule count: ";
eLang.common_strings["STR_CONF_FWALL_TIMEOUT"] = "Timeout";
eLang.common_strings["STR_CONF_FWALL_START_TIME"] = "Start Time";
eLang.common_strings["STR_CONF_FWALL_END_TIME"] = "End Time";
eLang.common_strings["STR_CONF_FWALL_TIME_FORMAT"] = "[dd-mm-yy:hh-mm]";
eLang.common_strings["STR_CONF_FWALL_TIME_ERROR_1"] = "Start Time year should not be greater than the end time year";
eLang.common_strings["STR_CONF_FWALL_TIME_ERROR_2"] = "End Time should be greater than start time";
eLang.common_strings["STR_FWALL_SETTINGS_ERR1"] = "Please select a slot in the Settings rule list";
eLang.common_strings["STR_FWALL_BLOCKALL_1"] = "This settings will block all way of IPv4 communication from BMC.\nDo you want to continue?.";
eLang.common_strings["STR_FWALL_BLOCKALL_2"] = "This settings will block all way of IPv6 communication from BMC.\nDo you want to continue?.";
eLang.common_strings["STR_FWALL_BLOCKALL_3"] = "This settings will block all way of IPv4 and IPv6 communication from BMC.\nDo you want to continue?.";
eLang.common_strings["STR_FWALL_FLUSHALL"] = "This settings will delete all the configured firewall iptables rules.\nDo you want to continue?.";
eLang.common_strings["STR_FWALL_TIMEOUT"] = "This settings will block the BMC access for the given time.\nDo you want to continue?.";

/*Configure Firewall - IP Rule*/
eLang.common_strings["STR_FWALL_IP_SETTING"] = "IP Settings";
eLang.common_strings["STR_FWALL_IP_RANGE"] = "IP/IP Range";
eLang.common_strings["STR_FWALL_IP_CNT"] = "Configured IP rule count: ";
eLang.common_strings["STR_FWALL_IP_RULE_RESULT_1"] = "Firewall IP rule was added successfully";
eLang.common_strings["STR_FWALL_IP_RULE_RESULT_3"] = "Firewall IP rule has been deleted";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_1"] = "IP Address fields should not be empty";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_2"] = "Not a valid IP Address";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_3"] = "First field should not be empty";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_4"] = "Invalid IP Range";
eLang.common_strings["STR_FWALL_IP_ERR1"] = "Please select a slot in the IP rule list";
eLang.common_strings["STR_FWALL_ADD_IPRULE"] = "Add new rule for IP";
eLang.common_strings["STR_FWALL_IP_GETVAL"] = "There was a problem while getting IP rule configuration";
eLang.common_strings["STR_FWALL_IP_ERR_1"] = "There was a problem while adding a new IP rule";
eLang.common_strings["STR_FWALL_IP_ERR_3"] = "There was a problem while deleting the IP rule";

/*Configure Firewall - Port Rule*/
eLang.common_strings["STR_FWALL_PORT_GETVAL"] = "There was a problem while getting Port rule configuration";
eLang.common_strings["STR_FWALL_PORT_SETTING"] = "Port Settings";
eLang.common_strings["STR_FWALL_PORT_RANGE"] = "Port/Port Range";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL"] = "Protocol";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL_0"] = "TCP";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL_1"] = "UDP";
eLang.common_strings["STR_FWALL_PORT_RULE_RESULT_1"] = "Firewall Port rule was added successfully";
eLang.common_strings["STR_FWALL_PORT_RULE_RESULT_3"] = "Firewall Port rule has been deleted";
eLang.common_strings["STR_FWALL_PORT_CNT"] = "Configured Port rule count: ";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_1"] = "Port fields should not be empty";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_2"] = "Not a valid port";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_3"] = "First field should not be empty";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_4"] = "Port range is not valid";
eLang.common_strings["STR_FWALL_PORT_ERR1"] = "Please select a slot in the Port rule list";
eLang.common_strings["STR_FWALL_ADD_PORTRULE"] = "Add new rule for Port";
eLang.common_strings["STR_FWALL_PORT_SAVE_ERR_1"] = "There was a problem while adding a new Port rule";
eLang.common_strings["STR_FWALL_PORT_SAVE_ERR_3"] = "There was a problem while deleting the Port rule";

eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE"] = "Network Type";
eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE_0"] = "IPv4";
eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE_1"] = "IPv6";

/*Event Log*/
eLang.common_strings["STR_EVENT_LOG_CNT"] ="Event Log: ";
eLang.common_strings["STR_EVENT_LOG_ENTRIES"] =" event entries";
eLang.common_strings["STR_EVENT_LOG_PAGES"] ="page(s)";
eLang.common_strings["STR_EVENT_LOG_HEAD1"] ="Event ID";
eLang.common_strings["STR_EVENT_LOG_HEAD2"] ="Time Stamp";
eLang.common_strings["STR_EVENT_LOG_HEAD3"] ="Sensor Name";
eLang.common_strings["STR_EVENT_LOG_HEAD4"] ="Sensor Type";
eLang.common_strings["STR_EVENT_LOG_HEAD5"] ="Description";
eLang.common_strings["STR_EVENT_LOG_TYPE0"] ="All Events";
eLang.common_strings["STR_EVENT_LOG_TYPE1"] ="System Event Records";
eLang.common_strings["STR_EVENT_LOG_TYPE2"] ="OEM Event Records";
eLang.common_strings["STR_EVENT_LOG_TYPE3"] ="BIOS Generated Events";
eLang.common_strings["STR_EVENT_LOG_TYPE4"] ="SMI Handler Events";
eLang.common_strings["STR_EVENT_LOG_TYPE5"] ="System Management Software Events";
eLang.common_strings["STR_EVENT_LOG_TYPE6"] ="System Software - OEM Events";
eLang.common_strings["STR_EVENT_LOG_TYPE7"] ="Remote Console software Events";
eLang.common_strings["STR_EVENT_LOG_TYPE8"] ="Terminal Mode Remote Console software Events";
eLang.common_strings["STR_EVENT_LOG_CLEAR_SUCCESS"] ="Sensor Event Log has been cleared";
eLang.common_strings["STR_EVENT_LOG_CLEAR_CONFIRM"] ="This will clear all the events in the log. Click Ok if you want to proceed?";
eLang.common_strings["STR_EVENT_LOG_GETVAL"] = "There was a problem while getting event logs";
eLang.common_strings["STR_EVENT_LOG_CLEARLOG"] = "There was a problem while clearing event logs";
eLang.common_strings["STR_EVENT_LOG_ASSERT"] ="Asserted";
eLang.common_strings["STR_EVENT_LOG_DEASSERT"] ="Deasserted";
eLang.common_strings["STR_UTC_OFFSET"] ="UTC Offset: ";
eLang.common_strings["STR_GMT"] ="(GMT";
eLang.common_strings["STR_GMT_ETC"] ="Etc/(GMT";
eLang.common_strings["STR_PRE_INIT_TIMESTAMP"] = "Pre-init Timestamp";
eLang.common_strings["STR_SOFTWARE_ID"] = "System Software ID";
eLang.common_strings["STR_EVENT_LOG_SAVEEVENTS_ERROR"] = "Create SEL Logs File Failure.";

/*Web Alerts*/
eLang.common_strings["STR_WEB_ALERT_TITLE"] = "Recent Events";
eLang.common_strings["STR_WEB_ALERT_DESC"] = "New event entries were logged by the system recently.";
eLang.common_strings["STR_WEB_ALERT_LOG_TITLE"] = "Log Report:";
eLang.common_strings["STR_WEB_ALERT_SEL_VIEW"] = "View All Event Logs";

/*Sensor Monitoring*/
eLang.common_strings["STR_SENSOR_GETVAL"] = "There was a problem while getting sensor values";
eLang.common_strings["STR_SENSOR_CNT"] ="Sensor Count: ";
eLang.common_strings["STR_SENSOR_SENSORS"] =" sensors";
eLang.common_strings["STR_SENSOR_LNR_ERR"] ="Lower Non-Recoverable(LNR) value can not be bigger than Lower Critical(LC)";
eLang.common_strings["STR_SENSOR_LC_ERR"] ="Lower Critical(LC) value can not be bigger than Lower Non-Cricical(LNC)";
eLang.common_strings["STR_SENSOR_LNC_ERR"] ="Lower Non-Critical(LNC) value can not be bigger than Upper Non-Cricical(UNC)";
eLang.common_strings["STR_SENSOR_UNC_ERR"] ="Upper Non-Critical(UNC) value can not be bigger than Upper Cricical(UC)";
eLang.common_strings["STR_SENSOR_UC_ERR"] ="Upper Critical(UC) value can not be bigger than Upper Non-Cricical(UNC)";
eLang.common_strings["STR_SENSOR_SET_ERR"] ="There was a problem while setting sensor threshold";
eLang.common_strings["STR_SENSOR_SET_SUCCESS"] ="Sensor Threshold configuration has been successfully set";
eLang.common_strings["STR_SENSOR_SET_INVALID_RANGE"] ="Sensor Threshold values are invalid";
eLang.common_strings["STR_SENSOR_THRESHOLD_SETTINGSSET_CONFIRM"] ="All data in the text box will be converted into IPMI data type, are you sure?";

/*Sensor Widgets Strings*/
eLang.common_strings["STR_WIDGET_MAX_COUNT"] = "Max widget limit reached." +
	"Please close any widget to continue.";
eLang.common_strings["STR_WIDGET_MAXIMIZE_SIZE"] = "Max widget limit crossed." +
	" Please close any widget or maximize the browser area for optimized " +
	"widget display.";

/*System and Audit Log*/
eLang.common_strings["STR_LOG_LEVEL_TYPE1"] = "Alert";
eLang.common_strings["STR_LOG_LEVEL_TYPE2"] = "Critical";
eLang.common_strings["STR_LOG_LEVEL_TYPE3"] = "Error";
eLang.common_strings["STR_LOG_LEVEL_TYPE4"] = "Notification";
eLang.common_strings["STR_LOG_LEVEL_TYPE5"] = "Warning";
eLang.common_strings["STR_LOG_LEVEL_TYPE6"] = "Debug";
eLang.common_strings["STR_LOG_LEVEL_TYPE7"] = "Emergency";
eLang.common_strings["STR_LOG_LEVEL_TYPE8"] = "Information";
eLang.common_strings["STR_SYSTEM_EVENT_GETINFO"] = "There was a problem while getting System Events";
eLang.common_strings["STR_LOG_EVENT_ID"] = "Event ID";
eLang.common_strings["STR_LOG_TIMESTAMP"] = "Time Stamp";
eLang.common_strings["STR_LOG_HOSTNAME"] = "HostName";
eLang.common_strings["STR_LOG_DESCRIPTION"] = "Description";
eLang.common_strings["STR_SYSTEM_LOG_CNT"] ="This Filter: ";

/*BSOD Screen*/
eLang.common_strings["STR_BSOD_NOT_AVAIL"] = "BSOD Screen is not available.";
eLang.common_strings["STR_ADVISER_GETVAL"] = "There was a problem while " +
	"getting adviser configuration.";

/* Tooltip Strings */
eLang.common_strings["STR_REFRESH_TOOLTIP"] = "Reloads the current page";
eLang.common_strings["STR_LANGUAGE_TOOLTIP"] = "Reloads the current page and language will be changed after reload";
eLang.common_strings["STR_PRINT_TOOLTIP"] = "Prints the current page";
eLang.common_strings["STR_LOGOUT_TOOLTIP"] = "Logout";
eLang.common_strings["STR_HELP_TOOLTIP"] = "The Help button allows the Help information to be displayed. If left open, it will automatically refresh to the appropriate contents for each UI page being viewed or it can be clicked whenever the user has a question regarding the page being viewed.";
eLang.common_strings["STR_USER_TOOLTIP"] = "Name and privileges of currently logged user";

/*JAVA SOL*/
eLang.common_strings["STR_JAVA_SOL"] = "Java SOL";

/*Console Redirection*/
eLang.common_strings["STR_CONSOLE_JAVA"] = "Java Console";
eLang.common_strings["STR_CONSOLE_ACTIVEX"] = "ActiveX Console";
eLang.common_strings["STR_CONSOLE_ACTIVEX_GETVAL"] = "There was a problem while getting ActiveX configuration";
eLang.common_strings["STR_ACTIVEX_GETTOKEN_FAILURE"] = "Session token generation failed. Maximum session limit might have reached. Please close other sessions and try again.";
eLang.common_strings["STR_ACTIVEX_ADVISER_GETVAL"] = "There was a problem while getting Adviser configuration for ActiveX console";
eLang.common_strings["STR_ACTIVEX_VMEDIA_GETVAL"] = "There was a problem while getting VMedia configuration for ActiveX console";
eLang.common_strings["STR_ACTIVEX_FAILURE"] = "Unable to invoke the ActiveX object";

/*Server Power Control*/
eLang.common_strings["STR_SERVER_RETRYING"] ="Retrying...please wait. Retries Left : ";
eLang.common_strings["STR_SERVER_ERR1"] ="Performing soft power off failed. This may be because the host OS is taking unusual long time to gracefully shut down.";
eLang.common_strings["STR_SERVER_ERR2"] ="Performing power action failed.";
eLang.common_strings["STR_SERVER_HOSTOFF"] ="Host is currently off";
eLang.common_strings["STR_SERVER_HOSTON"] ="Host is currently on";
eLang.common_strings["STR_SERVER_GETSTATUS"] ="There was a problem while receiving current status of host";
eLang.common_strings["STR_SERVER_SETACTION"] ="There was a problem while receiving response for power action";
eLang.common_strings["STR_SERVER_STATE_NOTAVAIL"] ="Current state not available";
eLang.common_strings["STR_SERVER_POWER_ACTION_WAIT"] ="Performing Power Action..Please Wait";
eLang.common_strings["STR_SERVER_EXTERNAL_BMC"] ="Your external BMC configuration for power control.";
eLang.common_strings["STR_SERVER_FEATURE_CABLE"] ="The feature connector cables.";

/*UID Control*/
eLang.common_strings["STR_UID_CONTROL_GETSTATUS"] = "There was a problem while receiving current status of uid status";
eLang.common_strings["STR_UID_CONTROL_SETACTION"] = "There was a problem while setting uid status";
eLang.common_strings["STR_UID_CONTROL_SET_WAIT"] = "Setting uid status..Please Wait";

/*Configure Triggers*/
eLang.common_strings["STR_CONF_TRIG_GETVAL"] = "There was a problem while " +
	"getting Event Trigger configuration";
eLang.common_strings["STR_CONF_TRIG_SETVAL"] = "There was a problem while " +
	"setting Event Trigger configuration for,";
eLang.common_strings["STR_CONF_TRIG_EVT0"] = "Temperature/Voltage Critical Events";
eLang.common_strings["STR_CONF_TRIG_EVT1"] = "Temperature/Voltage Non Critical Events";
eLang.common_strings["STR_CONF_TRIG_EVT2"] = "Temperature/Voltage Non Recoverable Events";
eLang.common_strings["STR_CONF_TRIG_EVT3"] = "Fan state changed Events";
eLang.common_strings["STR_CONF_TRIG_EVT4"] = "Watchdog Timer Events";
eLang.common_strings["STR_CONF_TRIG_EVT5"] = "Chassis Power on Event";
eLang.common_strings["STR_CONF_TRIG_EVT6"] = "Chassis Power off Event";
eLang.common_strings["STR_CONF_TRIG_EVT7"] = "Chassis Reset Event";
eLang.common_strings["STR_CONF_TRIG_EVT8"] = "Particular Date and Time Event";
eLang.common_strings["STR_CONF_TRIG_EVT9"] = "LPC Reset Event";
eLang.common_strings["STR_CONF_TRIG_EVT10"] = "Pre-Event Video Recording";
eLang.common_strings["STR_CONF_TRIG_EVT_ERR8"] = "Elapsed time value";
eLang.common_strings["STR_CONF_TRIG_EVT_ERR9"] = "The date and time " +
	"should be in advance to the system date and time.\n Please check the " +
	"system date and time.";
eLang.common_strings["STR_CONF_TRIG_SUCCESS"] = "Event Trigger was configured successfully.";
eLang.common_strings["STR_CONF_TRIG_KVMDISABLE"] = "\nNOTE: KVM Service should be enabled to perform auto-video recording.";
eLang.common_strings["STR_CONF_TRIG_YEAR2038"] = "\nNOTE: As a year 2038 problem exists, the acceptable maximum date range is 01-18-2038.";
eLang.common_strings["STR_CONF_SOL_TRIG_GETVAL"] = "There was a problem while " +
"getting SOL Event Trigger configuration";
eLang.common_strings["STR_CONF_SOL_TRIG_SETVAL"] = "There was a problem while " +
"setting SOL Event Trigger configuration for,";
eLang.common_strings["STR_CONF_SOL_TRIG_SUCCESS"] = "SOL Event Trigger was configured successfully.";

/*Recorded Video*/
eLang.common_strings["STR_VIDEO_RCRD_FILENAME"] = "File Name";
eLang.common_strings["STR_VIDEO_RCRD_VIDEOTYPE"] = "Video Type";
eLang.common_strings["STR_VIDEO_RCRD_FILEINFO"] = "File Information";
eLang.common_strings["STR_VIDEO_RCRD_PRE_EVENT"] = "Pre-Event";
eLang.common_strings["STR_VIDEO_RCRD_POST_EVENT"] = "Post-Event";
eLang.common_strings["STR_VIDEO_RCRD_GETVAL"] = "There was a problem while " +
	"getting Video file Information";
eLang.common_strings["STR_VIDEO_RCRD_DELVAL"] = "There was a problem while " +
	"deleting Video file Information";
eLang.common_strings["STR_VIDEO_RCRD_FILE_CNT"] = "Number of available Video " +
	"files : ";
eLang.common_strings["STR_VIDEO_RCRD_CNT_ZERO"] = "There are no recorded " +
	"video files";
eLang.common_strings["STR_VIDEO_RCRD_FILESEL_ERR"] = "Select a video file " +
	"entry";
eLang.common_strings["STR_VIDEO_RCRD_DEL_SUCCESS"] = "Video file is deleted " +
	"successfully.";
eLang.common_strings["STR_VIDEO_CFG_ENABLE"] = "Remote Video Support";
eLang.common_strings["STR_VIDEO_CFG_ADV_TITLE"] = "Advanced Remote Video " +
	"Settings";
eLang.common_strings["STR_VIDEO_CFG_SETVAL"] = "There was a problem while " +
	"setting video configuration";
eLang.common_strings["STR_VIDEO_CFG_GETVAL"] = "There was a problem while " +
	"getting video configuration";
eLang.common_strings["STR_VIDEO_CFG_SUCCESS"] = "Remote video configuration " +
	"was saved successfully and settings will reflect only on next video recording.";
eLang.common_strings["STR_SOL_VIDEO_CFG_SUCCESS"] = "SOL Remote video configuration " +
    "was saved successfully and settings will reflect only on next video recording.";
eLang.common_strings["STR_VIDEO_CFG_MOUNT_ERROR"] = "Temporary failure in " +
	"mounting remote share!";
eLang.common_strings["STR_VIDEO_CFG_MOUNT_STATUS_ERROR"] = "Mount settings " +
	"will be reflected during next video recording.";
eLang.common_strings["STR_VIDEO_CFG_CONFIRM"] = "Changing the Remote video " +
	"configuration would require to close all the existing virtual media " +
	"redirection and KVM session. Click OK to proceed.";
eLang.common_strings["STR_VIDEO_CFG_DESC_0"] = "Remote Video share is " +
	"currently disabled. To enable Remote Video share and configure its " +
	"settings. Click on 'Advanced Settings' button.";
eLang.common_strings["STR_VIDEO_CFG_DESC_1"] = "Click on 'Advanced Settings' " +
	"button, to Configure Remote Video share Settings.";
eLang.common_strings["STR_VIDEO_CFG_ERR_1"] = "The file is in progress, " +
	"so you can not delete the file. \n You can try later.";
eLang.common_strings["STR_VIDEO_CFG_ERR_2"] = "File not available in the " +
	"given path.";
eLang.common_strings["STR_VIDEO_CFG_ERR_3"] = "Temporary mount failure in " +
	"Remote share.";
eLang.common_strings["STR_SOL_LOG_SIZE"] = "Log Size (KB)";
eLang.common_strings["STR_SOL_NO_OF_LOGS"] = "Log File Count";
eLang.common_strings["STR_VIDEO_CFG_SOL_ADV_TITLE"] = "Advanced SOL Remote Video " +
"Settings";
eLang.common_strings["STR_INVALID_LOG_COUNT"] = "In Valid Log File Count.";
eLang.common_strings["STR_INVALID_LOG_SIZE"] = "In Valid Log Size.";

/*Pre-Event video recording*/
eLang.common_strings["STR_PRE_EVENT_DESC_1"] = eLang.common_strings["STR_PRE_EVENT_DESC_2"] = 
	"This page used to configure the Pre-Event video recording configurations.";
eLang.common_strings["STR_PRE_EVENT_DESC_0"] = eLang.common_strings['STR_PRE_EVENT_DESC_1'] +
	"Pre-Event video recording is currently disabled. To enable the Pre-" +
	"Event video recording in <a href='configure_video_sol_recordings.html'><b>Triggers " +
	"Configuration</b></a> page and trigger the video.";
eLang.common_strings["STR_PRE_EVENT_QUALITY_0"] = "Very Low";
eLang.common_strings["STR_PRE_EVENT_QUALITY_1"] = "Low";
eLang.common_strings["STR_PRE_EVENT_QUALITY_2"] = "Average";
eLang.common_strings["STR_PRE_EVENT_QUALITY_3"] = "Normal";
eLang.common_strings["STR_PRE_EVENT_QUALITY_4"] = "High";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_0"] = "High";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_1"] = "Normal";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_2"] = "Low";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_3"] = "No";
eLang.common_strings["STR_PRE_EVENT_GETVAL"] = "There was a problem while " +
	"getting Pre-Event video recording configurations.";
eLang.common_strings["STR_PRE_EVENT_SETVAL"] = "There was a problem while " +
	"setting Pre-Event video recording configurations.";
eLang.common_strings["STR_PRE_EVENT_SUCCESS"] = "Pre-Event video recording " +
	"configurations saved successfully.";

/*Firmware Update*/
eLang.common_strings["STR_FW_UPDATE_CONFIRM0"] ="Selection of not preserving the configuration requires to reboot the BMC after the firmware update is completed.\n";
eLang.common_strings["STR_FW_UPDATE_CONFIRM1"] ="You will not be able to perform any other tasks until firmware upgrade is complete. Click Ok if you want to enter the update mode?";
eLang.common_strings["STR_FW_UPDATE_CONFIRM2"] ="Are you sure to abort the firmware upgrade process?";
eLang.common_strings["STR_FW_UPDATE_CONFIRM3"] ="New firmware image size is different from the existing firmware image size. 'Configuration' can not be preserved in this situation.\n";
eLang.common_strings["STR_FW_UPDATE_CONFIRM4"] ="Clicking 'OK' will start the actual upgrade operation, where the storage is written with the new firmware image.\nIt is essential that the upgrade operation is not interrupted once it starts.\nDo you wish to proceed?";
eLang.common_strings["STR_FW_UPDATE_CONFIRM5"] ="Error in overwriting the files, Clicking 'OK' will start the actual upgrade operation without overwrite the files, where the storage is written with the new firmware image. It is essential that the upgrade operation is not interrupted once it starts. Do you wish to proceed?";
eLang.common_strings["STR_FW_UPDATE_CONFIRM6"] ="All the version, size and module locations are same in existing and uploaded image.\nBy selecting the version compare flash will reboot the BMC.\nDo you wish to proceed?";
eLang.common_strings["STR_FW_UPDATE_ERR1"] = "Please enter a valid image file";
eLang.common_strings["STR_FW_UPDATE_ERR2"] = "Image Verification unsuccessful. Please check if you uploaded the correct Image.";
eLang.common_strings["STR_FW_UPDATE_ERR3"] = "Image Flashing unsuccessful.";
eLang.common_strings["STR_FW_UPDATE_ERR4"] = "Image Verification unsuccessful. Please check if you uploaded the correct SignImage Public Key.";
eLang.common_strings["STR_FW_UPDATE_ERR5"] = "Image Verification unsuccessful. " +
	"The image uploaded is for different platform. " +
	"Please check if you uploaded the correct Image.";
eLang.common_strings["STR_FW_UPDATE_ERR6"] = "Image Verification unsuccessful. " +
	"Uploaded SignImage Public Key is corrupted. Please upload the correct " +
	"SignImage Key.";
eLang.common_strings["STR_FW_UPDATE_ERR7"] = "Image Verification unsuccessful. " +
	"Uploaded SignImage Public Key is invalid. Please upload the correct " +
	"SignImage Key.";
eLang.common_strings["STR_FW_UPDATE_ERR8"] = "Image Verification unsuccessful. " +
	"The exisiting image is signed supported image. So please upload the correct " +
	"signed image.";
eLang.common_strings["STR_FW_UPDATE_ERR9"] = "Image Verification unsuccessful. " +
	"The exisiting image is unsigned image. So please upload the correct " +
	"unsigned image.";
eLang.common_strings["STR_FW_UPDATE_ERR10"] = "Image of different code base version cannot be flashed. Please use YAFU."
eLang.common_strings["STR_FW_UPDATE_RESET"] = " In order to try upgrading again you need to reset the device. Press OK to reset the device now.";
eLang.common_strings["STR_FW_FLASH_PROGRESS"] = "Flash is in Progress! Please try later";
eLang.common_strings["STR_FW_VERIFY_DIFFVERSION"] = "The firmware image has been verified. The uploaded image is a different version of the existing device firmware.";
eLang.common_strings["STR_FW_VERIFY_DIFFSIZE"] = "The firmware image has been verified. The uploaded image size is different from the existing device firmware.";
eLang.common_strings["STR_FW_VERIFY_SAME"] = "The firmware image has been verified. The uploaded image appears to be the same as the existing device firmware.";
eLang.common_strings["STR_FW_PREPARE_FLASH"] = "There was a problem while preparing device for firmware upgrade.";
eLang.common_strings["STR_FW_DWLDIMG_ERR"] = "There was a problem while " +
	"downloading firmware image from remote server. Please check if you have " +
	"given the correct 'Firmware Image Transfer Protocol' configuration.";
eLang.common_strings["STR_FW_DWLDSTATUS_ERR"] = "There was a problem while " +
	"getting download status of firmware image. Please check if you have " +
	"given the correct 'Firmware Image Transfer Protocol' configuration.";
eLang.common_strings["STR_FW_SECTION_UPDATE_HEAD"] = "Section Based Firmware "+
	"Update";
eLang.common_strings["STR_FW_FULL_FLASH_HEAD"] = "Firmware Update";
eLang.common_strings["STR_FW_SECTION_UPDATE_DESC"] = "The following section " +
	"is used to allow the user to configure the firmware image for section "+
	"based flashing.";
eLang.common_strings["STR_FW_FULL_FLASH_DESC"] = "Some problem occurred in "+
	"the section based firmware update. It is recommended to do full flash of "+
	"the firmware.";
eLang.common_strings["STR_FW_VERSION_FLASH_DESC_1"] = "All the module section " +
	"versions in the existing image and uploaded image is same.";
eLang.common_strings["STR_FW_VERSION_FLASH_DESC_2"] = "The uploaded image " +
	"module size is not match with the existing image module size. So " +
	"version compare flash is not available.";
eLang.common_strings["STR_FW_VERSION_FLASH"] = "Version Compare Flash";
eLang.common_strings["STR_FW_FULL_FLASH"] = "Full Flash";

eLang.common_strings["STR_FW_SECTION_NAME"] = "Section Name";
eLang.common_strings["STR_FW_VERIFY_CURVERSION"] = "Current Image Version";
eLang.common_strings["STR_FW_VERIFY_NEWVERSION"] = "New Image Version";
eLang.common_strings["STR_FW_FIRMWARE_VERSION"] = "Firmware Version";
eLang.common_strings["STR_FW_EXISTING_VERSION"] = "Existing Version";
eLang.common_strings["STR_FW_IMAGE1_VERSION"] = "Image1 Version";
eLang.common_strings["STR_FW_IMAGE2_VERSION"] = "Image2 Version";
eLang.common_strings["STR_FW_UPLOADED_VERSION"] = "Uploaded Version";
eLang.common_strings["STR_FW_SEC_STATUS"] ="Upgradable/Non-Upgradable";
eLang.common_strings["STR_FW_UPDATE_SECTION_CONFIRM"] ="Clicking 'OK' will "+
	"start the section based upgrade operation of the firmware. Only selected "+
	"sections of the firmware will be updated. Other sections are skipped. "+
	"\nNOTE: Before starting flash operation, you are advised to verify the "+
	"compatibility between image sections. Do you wish to proceed?";
eLang.common_strings["STR_FW_UPDATE_SECTION_ERROR"] ="Please select any option "+
	"and proceed to flash";
eLang.common_strings["STR_FW_PROGRESS_GETVAL"] = "There was a problem while getting flash status.";

eLang.common_strings["STR_FW_SIGNKEY_GETVAL"] = "There was a problem while getting SignImage public key information.";
eLang.common_strings["STR_FW_SIGNKEY_TITLE"] = "Upload  SignImage Public Key";
eLang.common_strings["STR_FW_SIGNKEY_INFO"] = "Uploaded  SignImage Public Key";
eLang.common_strings["STR_FW_NEW_SIGN_KEY"] = "New SignImage Public Key";
eLang.common_strings["STR_FW_SIGNKEY_INVALID1"] = "Please enter a SignImage Public key file";
eLang.common_strings["STR_FW_SIGNKEY_INVALID2"] = "SignImage Public key file name should end with .pem";
eLang.common_strings["STR_FW_SIGNKEY_SUCCESS"] = "SignImage Public Key uploaded successfully";
eLang.common_strings["STR_FW_SIGNKEY_ERR1"] = "The SignImage Public Key file does not exists";
eLang.common_strings["STR_FW_SIGNKEY_ERR3"] = "The SignImage Public Key validation failed. Please try to upload the SignImage Public Key again.";
eLang.common_strings["STR_FW_SIGNKEY_ERR4"] = "Uploading SignImage Public Key failed. Please try uploading the SignImage Public Key again.";
eLang.common_strings["STR_FW_SIGNKEY_ERR5"] = "The SignImage Public Key file size exceeds";
eLang.common_strings["STR_FW_SIGNKEY_VALIDATE_ERR"] = "There was a problem while validating SignImage Public Key";
eLang.common_strings["STR_FW_PRSRV_CFG_DESC"] = " - irrespective of the " +
	"individual items marked as preserve/overwrite in the table below.";

eLang.common_strings["STR_FW_FLASH_IMAGE"] = "Flash Image";
eLang.common_strings["STR_FW_BOOT_IMAGE"] = "Boot Image";
eLang.common_strings["STR_FW_REBOOT_BMC"] = "Reboot BMC after Firmware flash";

/*Configure Dual Image*/
eLang.common_strings["STR_CONF_DUAL_IMG_GETVAL"] = "There was a problem while getting Dual Image configuration";
eLang.common_strings["STR_CONF_DUAL_IMG_SETVAL"] = "There was a problem while setting Dual Image configuration";
eLang.common_strings["STR_CONF_DUAL_IMG_SUCCESS"] = "Image Update configuration saved successfully";
eLang.common_strings["STR_CONF_DUAL_IMG0"] = "Inactive Image";
eLang.common_strings["STR_CONF_DUAL_IMG1"] = "Image 1";
eLang.common_strings["STR_CONF_DUAL_IMG2"] = "Image 2";
eLang.common_strings["STR_CONF_DUAL_IMG3"] = "Both Images";

/*Preserve Configuration*/
eLang.common_strings["STR_PRSRV_GETVAL"] = "There was a problem while getting Preserve configuration information.";
eLang.common_strings["STR_PRSRV_SETVAL"] = "There was a problem while setting Preserve configuration information.";
eLang.common_strings["STR_PRSRV_SUCCESS"] = "Preserve configuration settings have been saved successfully.";
eLang.common_strings["STR_PRSRV_CFG_ITEM"] = "Preserve Configuration Item";
eLang.common_strings["STR_PRSRV_STATUS"] = "Preserve Status";
eLang.common_strings["STR_PRSRV_CFG_CNT"] = "Number of Preserved Items: ";
eLang.common_strings["STR_PRSRV_NAME_0"] = "SDR";
eLang.common_strings["STR_PRSRV_NAME_1"] = "FRU";
eLang.common_strings["STR_PRSRV_NAME_2"] = "SEL";
eLang.common_strings["STR_PRSRV_NAME_3"] = "IPMI";
eLang.common_strings["STR_PRSRV_NAME_4"] = "Network";
eLang.common_strings["STR_PRSRV_NAME_5"] = "NTP";
eLang.common_strings["STR_PRSRV_NAME_6"] = "SNMP";
eLang.common_strings["STR_PRSRV_NAME_7"] = "SSH";
eLang.common_strings["STR_PRSRV_NAME_8"] = "KVM";
eLang.common_strings["STR_PRSRV_NAME_9"] = "Authentication";
eLang.common_strings["STR_PRSRV_NAME_10"] = "Syslog";

/*Restore Configuration*/
eLang.common_strings["STR_RSTR_CFG_CNFRM"] = "Click OK if you want to continue restoring configurations.\n WARNING: Restoring configurations will restart the device.";

/*Backup and Restore Configuration*/
eLang.common_strings["STR_BACKUP_GETVAL"] = "There was a problem while getting Backup configuration information.";
eLang.common_strings["STR_BACKUP_SETVAL"] = "There was a problem while setting Backup configuration information.";
eLang.common_strings["STR_BACKUP_RESTORE_SETVAL"] = "There was a problem while setting configuration.";
eLang.common_strings["STR_BACKUP_SAVE_SUCCESS"] = "Backup configuration settings have been saved successfully.";
eLang.common_strings["STR_BACKUP_CONFIRM"] = "Please do not perform any other " +
		"operation until the backup task has completed. \nClick OK if "+
		"you want to proceed.";
eLang.common_strings["STR_RESTORE_CONFIRM"] = "WARNING: Restoring " +
	"configuration needs to reboot the BMC to take the effect. \nPlease do not " +
	"perform any other operation until the restore process has complete.\nClick OK if " +
	"you want to proceed";
eLang.common_strings["STR_BACKUP_CFG_ITEM"] = "Backup Configuration Item";
eLang.common_strings["STR_BACKUP_STATUS"] = "Select All";
eLang.common_strings["STR_BACKUP_FILE"] = "Configuration File";
eLang.common_strings["STR_SETCONFIG_ERROR_1"] = "There was a problem while creating backup configurations";
eLang.common_strings["STR_SETCONFIG_ERROR_2"] = "There was a problem while restoring backup configurations";
eLang.common_strings["STR_RESTORE_CFG_TITLE"] = "Restore Configuration";
eLang.common_strings["STR_RESTORE_INVALID_FILE"] = "Configuration file is invalid.";
eLang.common_strings["STR_RESTORE_CFG_SUCCESS"] = "Configuration file restored successfully. " +
	"BMC has been restarted for the changes to take effect. Please close " +
	"this browser session and open a new browser session to reconnect to " +
	"the device.";

/*System Administrator*/
eLang.common_strings["STR_CFG_ROOT_GETVAL"] ="There was a problem while getting Root user configuration.";
eLang.common_strings["STR_CFG_ROOT_SETVAL"] ="There was a problem while setting Root user configuration.";
eLang.common_strings["STR_CFG_ROOT_SUCCESS"] ="System Administrator configuration saved successfully.";

/*General Strings*/
eLang.common_strings["STR_PERMISSION_DENIED"] = "Permission denied to view this content.";
eLang.common_strings["STR_CONF_ADMIN_PRIV"] = "You need to have either administrator or operator privilege to perform this action.";
eLang.common_strings["STR_TIME_OUT"] = "The BMC seems to be taking too long to respond. Please check the cables and configuration";
eLang.common_strings["STR_NOT_CONFIGURE"] = "Not Configured";
eLang.common_strings["STR_NOT_AVAILABLE"] = "Not Available";
eLang.common_strings["STR_DATA"] = "Data ";
eLang.common_strings["STR_NOT_APPLICABLE"] = "N/A";
eLang.common_strings["STR_NOT_SUPPORT"] ="Not Supported";
eLang.common_strings["STR_NONE"] = "None";
eLang.common_strings["STR_MANUAL"] = "Manual";
eLang.common_strings["STR_AUTO"] = "Automatic";
eLang.common_strings["STR_BLANK"] = "&nbsp;";			// Empty string
eLang.common_strings["STR_EMPTY"] = " ";			// Empty string
eLang.common_strings["STR_NEWLINE"] = "\n";
eLang.common_strings['STR_HELP'] = 'HELP';
eLang.common_strings['STR_NODE_SELECT'] = "Node Select";
eLang.common_strings['STR_AND_ABOVE'] = ' and Above';
eLang.common_strings['STR_ANY'] = 'Any';
eLang.common_strings['STR_PROCESS_ABORT'] = "Ongoing process will be aborted.";
eLang.common_strings['STR_FWFLASH_ABORT'] = "Closing the web session during firmware flash causes device to be restarted.";
eLang.common_strings['STR_LOGOUT_SUCCESS'] = "You have been logged out successfully.";
eLang.common_strings["STR_EVENT_ENTRIES"] =" event entries";
eLang.common_strings["STR_SAVE"] = "Save";
eLang.common_strings["STR_ADD"] = "Add";
eLang.common_strings["STR_MODIFY"] = "Modify";
eLang.common_strings["STR_REPLACE"] = "Replace";
eLang.common_strings["STR_DELETE"] = "Delete";
eLang.common_strings["STR_CANCEL"] = "Cancel";
eLang.common_strings["STR_PROCEED"] = "Proceed";
eLang.common_strings["STR_ENABLED"] = "Enabled";
eLang.common_strings["STR_DISABLED"] = "Disabled";
eLang.common_strings["STR_HASH"] = "#";
eLang.common_strings["STR_USERNAME"] = "Username";
eLang.common_strings["STR_PASSWORD"] = "Password";
eLang.common_strings["STR_DOMAINNAME"] = "Domain Name";
eLang.common_strings["STR_SERVER_ADDRESS"] = "Server Address";
eLang.common_strings["STR_SOURCE_PATH"] = "Source Path";
eLang.common_strings["STR_SHARE_TYPE"] = "Share Type";
eLang.common_strings["STR_RETRY_COUNT"] = "Retry Count";
eLang.common_strings["STR_PRESERVE"] = "Preserve";
eLang.common_strings["STR_OVERWRITE"] = "Overwrite";
eLang.common_strings["STR_INACTIVE"] = "Inactive";
eLang.common_strings["STR_ACTIVE"] = "Active";
eLang.common_strings["STR_STAND_BY"] = "Stand-by";
eLang.common_strings["STR_YES"] = "Yes";
eLang.common_strings["STR_NO"] = "No";
eLang.common_strings["STR_KVM_PRIV"] = "KVM";
eLang.common_strings["STR_VMEDIA_PRIV"] = "VMedia";
eLang.common_strings["STR_EXTENDED_PRIV"] = "Extended Privileges";
eLang.common_strings["STR_VIEW"] =  "View";
eLang.common_strings["STR_DASH"] =  " - ";
eLang.common_strings["STR_TERMINATE_SESSION"] =  "Terminate";
eLang.common_strings["STR_MAX_DURATION"] =  "Maximum Duration(Sec)";
eLang.common_strings["STR_MAX_SIZE"] =  "Maximum Size(MB)";
eLang.common_strings["STR_MAX_DUMPS"] =  "Maximum Dumps";

/*General Error Strings*/
eLang.common_strings["STR_IPMI_ERROR"] = "  IPMI ERROR:";
eLang.common_strings["STR_ERROR_CODE"] = "  Error Code : ";
eLang.common_strings["STR_HELP_INFO"] = " Refer 'Help' for more Information.";
eLang.common_strings["STR_INVALID_FIELDS"] = "Following are the Invalid field(s),\n";
eLang.common_strings["STR_INVALID_PORT"] = "Invalid Port Number";
eLang.common_strings["STR_INVALID_IP"] = "Invalid IP Address format.";
eLang.common_strings["STR_INVALID_TIMEOUT"] = "Invalid Time Out.";
eLang.common_strings["STR_INVALID_SERVERADDR"] = "Invalid Server Address.";
eLang.common_strings["STR_INVALID_ADDR_FAMILY"] = "Given Address Family is not enabled.";
eLang.common_strings["STR_INVALID_USERNAME"] = "Invalid Username.";
eLang.common_strings["STR_INVALID_PASSWORD"] = "Invalid Password.";
eLang.common_strings["STR_INVALID_SHARE_TYPE"] = "Share Type";
eLang.common_strings["STR_INVALID_SERVICE"] = "Service Not Enabled";
eLang.common_strings["STR_INVALID_CPWORD"] = "Password and confirmation password do not match";
eLang.common_strings["STR_INVALID_UNAME_PWORD"] = "Username/Password cannot be blank";
eLang.common_strings["STR_INVALID_EMAILADDR"] = "Invalid Email Address.";
eLang.common_strings["STR_INVALID_DOMAIN"] ="Invalid Domain Name.";
eLang.common_strings["STR_INVALID_SEARCHBASE"] = "Invalid Search base.";
eLang.common_strings["STR_INVALID_RGNAME"] ="Invalid Role Group Name.";
eLang.common_strings["STR_INVALID_PAGENO"] ="Invalid Page Number.";
eLang.common_strings["STR_INVALID_SRC_PATH"] = "Invalid Source Path.";
eLang.common_strings["STR_NETWORK_ERROR"] ="There is some problem in network connection.";
eLang.common_strings["STR_LANG_NOT_FOUND"] = "Browser language could not be " +
	"determined. Using English(US) by default.";
eLang.common_strings["STR_NO_CONFIGURATION"] = "There is no configuration settings available in this page.";

eLang.common_strings["STR_APP_STR_ALL_DEASSERTED"] = "All deasserted";
eLang.common_strings["STR_IPV4_ADDR0"] = "0.0.0.0";
eLang.common_strings["STR_IPV6_ADDR0"] = "::";
eLang.common_strings["STR_INVALID_MAXDURATION_ERROR"] = "Invalid Maximum Duration.";
eLang.common_strings["STR_INVALID_MAXSIZE_ERROR"] = "Invalid Maximum Size.";
eLang.common_strings["STR_INVALID_MAXDUMPS_ERROR"] = "Invalid Maximum Dumps.";


eLang.common_strings["NO_SEL_STRING"] = "There are no event log entries present at this time.";
eLang.common_strings["NO_SAL_STRING"] = "There are no entries in this log.";
eLang.common_strings["NO_FRU_STRING"] = "There are no FRU devices present in the system.";
eLang.common_strings["NO_SENSOR_STRING"] = "There are no sensors present in the system.";
eLang.common_strings["NO_ALERTENTRY_STRING"] = "There are no alert entries present in the system.";
eLang.common_strings["NO_PEFENTRY_STRING"] = "There are no event filter entries present in the system.";
eLang.common_strings["NO_LANALERTDESTS_STRING"] = "There are no LAN Alert destinations configured in the system.";
eLang.common_strings["INVALID_OFFSET"]= "<b>Invalid Offset for this SensorType</b>";
eLang.common_strings["EXTENDED_SEL"]= "<b>Extended SEL</b>";

/*General - Confirmation messages*/
eLang.common_strings["STR_CONFIRM_DELETE"] = "Click OK if you want to continue deleting this entry.";
eLang.common_strings["STR_GENERAL_COMMAND_CONFIRM"] = "Are you sure to execute this command";
eLang.common_strings["STR_GENERAL_LOGOUT"] = "Click OK if you want to continue logging out.";
eLang.common_strings["STR_GENERAL_DISCONNECT"] = "Are you sure to disconnect from this server";
eLang.common_strings["STR_CONSOLE_CONNECTED"] = "The Active console window will be closed.";
eLang.common_strings["STR_SSLCERT_ABORT"] = "SSL certificate upload will be aborted.";
eLang.common_strings["STR_IPMI_LIBRARY_ERROR"] = "IPMI library not responding. Please check if the IPMI process is running.";

/*General - Strings*/
eLang.common_strings["STR_OK"] = "OK";
eLang.common_strings["STR_WAIT"] = "Loading";
eLang.common_strings["STR_WARNING"] = "Warning: ";
eLang.common_strings["STR_ON"] = "On";
eLang.common_strings["STR_OFF"] = "Off";
eLang.common_strings["STR_GO"] = "Go!";
eLang.common_strings["STR_LOGIN_BUTTON"]="Log In";
eLang.common_strings["STR_LOGIN_NOSPACE"]="Login";
eLang.common_strings["STR_LOGIN_PLEASE"]="Please Login";
eLang.common_strings["STR_SIDEBAR_LOGOUT"]   = "Log out";
eLang.common_strings["STR_SIDEBAR_DISCONNECT"]   = "Disconnect";
eLang.common_strings["STR_APPLYCHANGES"]      = "Apply Changes";
eLang.common_strings["STR_ENABLE"]      = "Enable";
eLang.common_strings["STR_DISABLE"]      = "Disable";
eLang.common_strings["STR_CONNECT"]      = "Connect";
eLang.common_strings["STR_DISCONNECT"]      = "Disconnect";
eLang.common_strings["STR_UPLOAD"]      = "Upload";
eLang.common_strings["STR_UNKNOWN"] ="Unknown";
eLang.common_strings["STR_RPC_WAIT"] ="Data is loading. Please wait..!";

/*Login Strings*/
eLang.common_strings["STR_LOGINWELCOME"]="Please type your user name and password";
eLang.common_strings["STR_LOGINFAILED"]="Login failed. Please try again";
eLang.common_strings["STR_LOGIN_ERROR"]="Invalid Authentication";
eLang.common_strings["STR_LOGIN_NOACCESS"]="No Privilege user";
eLang.common_strings["STR_LOGIN_BWSRNOTSPRT"]="NOT SUPPORTED BROWSER";
eLang.common_strings["STR_LOGIN_BWSRMSG"]="This software does not support this browser version." +
	"Please check User's Guide for supported browsers."
eLang.common_strings["STR_LOGIN_SESSION_EXPIRED"]="Session Expired";
eLang.common_strings["STR_LOGIN"]="Authentication Required";
eLang.common_strings["STR_LOGIN_ERROR_3"]="Maximum number of sessions already in use";
eLang.common_strings["STR_USER_REQUIRED"] = "Username is required";
eLang.common_strings["STR_PWD_REQUIRED"] = "Password is required";
eLang.common_strings["STR_COOKIES_ENABLE"] = "Please enable the cookies in order to log into the system";
eLang.common_strings["STR_FIRST_COOKIES_BLOCK"] = "Cookies are enabled, First party cookies are still blocked";
eLang.common_strings["STR_USER_ROLE_ERROR"] = "Couldn't get role for the user";
eLang.common_strings["STR_LAN_CHANNEL_ERROR"] = "Couldn't retrieve lan channel information";
eLang.common_strings["STR_PROJECT_CFG_ERROR"] = "Couldn't retrieve project configuration";
eLang.common_strings["STR_USER_LENGTH"] = "Username length cannot exceed more than 800 characters";
eLang.common_strings["STR_PWD_LENGTH"] = "Password length cannot exceed more than 300 characters";

/*Password Reset Strings*/
eLang.common_strings["STR_RESET_PSWD_CONFIRM"] = "Click OK if you want to continue resetting the User's password.";
eLang.common_strings["STR_RESET_PSWD_SUCCESS"] = "New password has been sent to the configured Email";
eLang.common_strings["STR_SMTP_SERVER_DISABLED"] = "SMTP Server is disabled for this channel";
eLang.common_strings["STR_RESET_PSWD_FAILURE"] = "There was a problem while resetting new password";
eLang.common_strings["STR_RESET_PSWD_FAILURE1"] = "Unable to reset the Password for the User";

/*Reset Strings*/
eLang.common_strings["STR_WEB_RESET_TITLE"] = "Web Server has been Reset";
eLang.common_strings["STR_WEB_RESET_DESC"] = "The web server has been restarted for the changes to take effect. Please close this browser session and open a new browser session to reconnect to the device.";
eLang.common_strings["STR_HTTPS_RESET_DESC"] = "The HTTPS Service has been restarted for the changes to take effect. Please close this browser session and open a new browser session to reconnect to the device.";
eLang.common_strings["STR_DEVICE_RESET_TITLE"] = "Device has been reset";
eLang.common_strings["STR_DEVICE_RESET_DESC"] = "The device has been reset. Please close this browser session and open a new browser session to reconnect to the device. <br/><br/>The device may take about a minute to boot up.";
eLang.common_strings["STR_DEVICE_UPDATE_TITLE"] = "Device has been updated";
eLang.common_strings["STR_DEVICE_UPDATE_DESC"] = "The device has been updated. " +
	"Please close this browser session and open a new browser session to " +
	"reconnect to the device.";
eLang.common_strings["STR_DEVICE_UPDATE_CANCEL_TITLE"] = "Device update cancelled";
eLang.common_strings["STR_DEVICE_UPDATE_CANCEL_DESC"] = "The device update has " +
	"been cancelled. Please close this browser session and open a new browser " +
	"session to reconnect to the device.";
eLang.common_strings["STR_DEVICE_FLASHMODE_TITLE"] = "Device in Flash mode";
eLang.common_strings["STR_DEVICE_FLASHMODE_DESC"] = "The device is in Flash mode. Please close this browser session and open a new browser session to reconnect to the device. <br/><br/>The device may take few minutes to flash and boot up.";
eLang.common_strings["STR_FLASH_NETWORK_DISCONN_TITLE"] = "Network Connection is disconnected";
eLang.common_strings["STR_FLASH_NETWORK_DISCONN_DESC"] = "Network Connection is disconnected during Flash mode. Please close this browser session and open a new browser session to reconnect to the device. <br/><br/>The device may take few minutes to flash and boot up.";

/*General Threshold Strings*/
eLang.common_strings["STR_SENSOR_THRESHOLD"] = [];
eLang.common_strings["STR_SENSOR_THRESHOLD"][0] = "Lower Non-Critical";
eLang.common_strings["STR_SENSOR_THRESHOLD"][1] = "Lower Critical";
eLang.common_strings["STR_SENSOR_THRESHOLD"][2] = "Lower Non-Recoverable";
eLang.common_strings["STR_SENSOR_THRESHOLD"][3] = "Upper Non-Critical";
eLang.common_strings["STR_SENSOR_THRESHOLD"][4] = "Upper Critical";
eLang.common_strings["STR_SENSOR_THRESHOLD"][5] = "Upper Non-Recoverable";

/*Sensor Type Strings*/
eLang.common_strings["STR_SENSOR_TYPES"] = [];
eLang.common_strings["STR_SENSOR_TYPES"][0x00] = "All Sensors";
eLang.common_strings["STR_SENSOR_TYPES"][0x01] = "Temperature Sensors";
eLang.common_strings["STR_SENSOR_TYPES"][0x02] = "Voltage Sensors";
eLang.common_strings["STR_SENSOR_TYPES"][0x03] = "Current Sensors";
eLang.common_strings["STR_SENSOR_TYPES"][0x04] = "Fan Sensors";
eLang.common_strings["STR_SENSOR_TYPES"][0x05] = "Physical Security";
eLang.common_strings["STR_SENSOR_TYPES"][0x06] = "Platform Security Violation Attempt";
eLang.common_strings["STR_SENSOR_TYPES"][0x07] = "Processor";
eLang.common_strings["STR_SENSOR_TYPES"][0x08] = "Power Supply";
eLang.common_strings["STR_SENSOR_TYPES"][0x09] = "Power Unit";
eLang.common_strings["STR_SENSOR_TYPES"][0x0A] = "Cooling Device";
eLang.common_strings["STR_SENSOR_TYPES"][0x0B] = "Other Units-based Sensor";
eLang.common_strings["STR_SENSOR_TYPES"][0x0C] = "Memory";
eLang.common_strings["STR_SENSOR_TYPES"][0x0D] = "Drive Slot";
eLang.common_strings["STR_SENSOR_TYPES"][0x0E] = "POST Memory Resize";
eLang.common_strings["STR_SENSOR_TYPES"][0x0F] = "System Firmware Progress";
eLang.common_strings["STR_SENSOR_TYPES"][0x10] = "Event Logging Disabled";
eLang.common_strings["STR_SENSOR_TYPES"][0x11] = "Watchdog 1";
eLang.common_strings["STR_SENSOR_TYPES"][0x12] = "System Event";
eLang.common_strings["STR_SENSOR_TYPES"][0x13] = "Critical Interrupt";
eLang.common_strings["STR_SENSOR_TYPES"][0x14] = "Button / Switch";
eLang.common_strings["STR_SENSOR_TYPES"][0x15] = "Module / Board";
eLang.common_strings["STR_SENSOR_TYPES"][0x16] = "Microcontroller / Coprocessor";
eLang.common_strings["STR_SENSOR_TYPES"][0x17] = "Add-in Card";
eLang.common_strings["STR_SENSOR_TYPES"][0x18] = "Chassis";
eLang.common_strings["STR_SENSOR_TYPES"][0x19] = "Chip Set";
eLang.common_strings["STR_SENSOR_TYPES"][0x1A] = "Other FRU";
eLang.common_strings["STR_SENSOR_TYPES"][0x1B] = "Cable / Interconnect";
eLang.common_strings["STR_SENSOR_TYPES"][0x1C] = "Terminator";
eLang.common_strings["STR_SENSOR_TYPES"][0x1D] = "System Boot / Restart Initiated";
eLang.common_strings["STR_SENSOR_TYPES"][0x1E] = "Boot Error";
eLang.common_strings["STR_SENSOR_TYPES"][0x1F] = "OS Boot";
eLang.common_strings["STR_SENSOR_TYPES"][0x20] = "OS Stop / Shutdown";
eLang.common_strings["STR_SENSOR_TYPES"][0x21] = "Slot / Connector";
eLang.common_strings["STR_SENSOR_TYPES"][0x22] = "System ACPI Power State";
eLang.common_strings["STR_SENSOR_TYPES"][0x23] = "Watchdog 2";
eLang.common_strings["STR_SENSOR_TYPES"][0x24] = "Platform Alert";
eLang.common_strings["STR_SENSOR_TYPES"][0x25] = "Entity Presence";
eLang.common_strings["STR_SENSOR_TYPES"][0x26] = "Monitor ASIC / IC";
eLang.common_strings["STR_SENSOR_TYPES"][0x27] = "LAN";
eLang.common_strings["STR_SENSOR_TYPES"][0x28] = "Management Subsystem Health";
eLang.common_strings["STR_SENSOR_TYPES"][0x29] = "Battery";
eLang.common_strings["STR_SENSOR_TYPES"][0x2A] = "Session Audit";
eLang.common_strings["STR_SENSOR_TYPES"][0x2B] = "Version Change";
eLang.common_strings["STR_SENSOR_TYPES"][0x2C] = "FRU State";

/* SMBMC */
eLang.common_strings["STR_MULTI_BMCINST_GETVAL"] ="Error in getting number of BMC Inst.";
eLang.common_strings["STR_MULTI_BMCINST_SET_NODE_CONFIRM"] ="Are you sure you want to change the BMC node?";
eLang.common_strings["STR_MULTI_BMCINST_SETVAL"] ="Error in setting BMC Instance.";
eLang.common_strings["STR_MULTI_BMCINST_SET_NODE_SUCCESS"] ="BMC Instance configured successfully.";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_GETVAL"] ="Error in getting USB Switch Setting.";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_CONFIRM"] ="Are you sure you want to change the USB redirection node?";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_SETVAL"] ="Error in setting USB Switch Setting.";
eLang.common_strings["STR_MULTI_BMCINST_SET_USB_SWITCH_SUCCESS"] ="Setting USB Switch Setting successfully.";
/* RAID Controller */
eLang.common_strings["STR_RAID_GETINFO"] ="Error in getting RAID Controller Information.";
eLang.common_strings["STR_RAID_BBU_MISSING"] ="Battery Backup subsystem is missing.";
eLang.common_strings["STR_RAID_BBU_INIT"] ="Battery Backup subsystem is currently initializing.";
eLang.common_strings["STR_RAID_BBU_READY"] ="Battery Backup subsystem is ready.";
eLang.common_strings["STR_RAID_BBU_LEARN"] ="Battery Backup subsystem is executing a learning cycle.";
eLang.common_strings["STR_RAID_BBU_FATAL"] ="Battery Backup subsystem has failed.";
eLang.common_strings["STR_RAID_BBU_OVER_TEMP"] ="Super capacitor pack has exceeded the maximum temperature threshold.";
eLang.common_strings["STR_RAID_BBU_WARN_TEMP"] ="Super capacitor pack has exceeded the warning temperature threshold.";
eLang.common_strings["STR_RAID_BBU_OVER_VOLTAGE"] ="Super capacitor pack is over voltage.";
eLang.common_strings["STR_RAID_BBU_OVER_CURRENT"] ="Battery Backup subsystem has exceeded the maximum charging current.";
eLang.common_strings["STR_RAID_BBU_LEARN_PASS"] ="Battery Backup subsystem learning cycle has passed.";
eLang.common_strings["STR_RAID_BBU_LEARN_FAIL"] ="Battery Backup subsystem learning cycle has failed.";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD1"] ="Record Id";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD2"] ="Time Stamp";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD3"] ="Event Code";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD4"] ="Event Type";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD5"] ="Event Class";
//eLang.common_strings["STR_RAID_EVENT_LOG_HEAD6"] ="Event Desc";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE0"] ="All Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE1"] ="LD Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE2"] ="PD Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE3"] ="Enclosure Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE4"] ="BBU Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE5"] ="SAS Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE6"] ="Controller Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE7"] ="Configuration Events";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE8"] ="Cluster Events";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD1"] ="Device Id";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD2"] ="Media Type";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD3"] ="State";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD4"] ="Slot";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD5"] ="Speed";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD6"] ="Link Speed";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD7"] ="Size (GB)";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD8"] ="Temp (°C)";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD1"] ="Device Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD2"] ="Vendor Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD3"] ="Product Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD4"] ="Serial Number";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD5"] ="Power State";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD6"] ="Drive Presence";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD7"] ="LED Status";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD8"] ="Interface Type";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD9"] ="Drive Cache";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD10"] ="Block Size (GB)";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD11"] ="SMART";
eLang.common_strings["STR_RAID_LOGICAL_HEAD1"] ="LD Name";
eLang.common_strings["STR_RAID_LOGICAL_HEAD2"] ="Type";
eLang.common_strings["STR_RAID_LOGICAL_HEAD3"] ="State";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD4"] ="Stripe Size";
eLang.common_strings["STR_RAID_LOGICAL_HEAD5"] ="Read Policy";
eLang.common_strings["STR_RAID_LOGICAL_HEAD6"] ="Write Policy";
eLang.common_strings["STR_RAID_LOGICAL_HEAD7"] ="Cache Policy";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD8"] ="BGI";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD9"] ="SSD Caching";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD10"] ="Progress";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD11"] ="Bad Blocks Table";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD12"] ="Size (GB)";
eLang.common_strings["STR_RAID_LOGICAL_HEAD13"] ="No.of Phy Devices";
eLang.common_strings["STR_RAID_LOGICAL_HEAD14"] ="Phy Device Info";
//eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD1"] ="Element Type";
/*eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD2"] ="Device Id";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD3"] ="Media Type";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD4"] ="State";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD5"] ="Slot";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD6"] ="Speed";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD7"] ="Link Speed";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD8"] ="Size (GB)";
eLang.common_strings["STR_RAID_LOGICAL_POP_UP_HEAD9"] ="Temp (°C)";*/
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD1"] ="Stripe Size (MB)";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD2"] ="BGI";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD3"] ="SSD Caching";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD4"] ="Progress (%)";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD5"] ="Bad Blocks Table";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD6"] ="Size (GB)";
eLang.common_strings["STR_RAID_EVENT_LOG_CLEAR_SUCCESS"] ="RAID Controller Event Log has been cleared";
eLang.common_strings["NO_RAID_PHYSICAL_STRING"] = "There are no Physical Device information present at this time.";
eLang.common_strings["NO_RAID_LOGICAL_STRING"] = "There are no Logical Device information present at this time.";
eLang.common_strings["STR_RAID_INFO_LABEL0"] ="Serial Number:";
eLang.common_strings["STR_RAID_INFO_LABEL1"] ="Package Version:";
eLang.common_strings["STR_RAID_INFO_LABEL2"] ="BIOS Version:";
eLang.common_strings["STR_RAID_INFO_LABEL3"] ="UEFI Version:";
eLang.common_strings["STR_RAID_INFO_LABEL4"] ="Expander Version:";
eLang.common_strings["STR_RAID_INFO_LABEL5"] ="SEEPROM Version:";
eLang.common_strings["STR_RAID_INFO_LABEL6"] ="CPLD Version:";
eLang.common_strings["STR_RAID_INFO_LABEL7"] = "PCI Vendor Id:";
eLang.common_strings["STR_RAID_INFO_LABEL8"] = "PCI Device Id:";
eLang.common_strings["STR_RAID_INFO_LABEL9"] = "PCI SubVendor Id:";
eLang.common_strings["STR_RAID_INFO_LABEL10"] = "PCI SubSytem Id:";
eLang.common_strings["STR_RAID_INFO_LABEL11"] = "ROC Temp (°C):";
eLang.common_strings["STR_RAID_INFO_LABEL12"] = "Expander Temp (°C):";
eLang.common_strings["STR_RAID_INFO_LABEL13"] = "Health Status:";
eLang.common_strings["STR_RAID_STORAGE_LABEL0"] = "Physical Devices Count:";
eLang.common_strings["STR_RAID_STORAGE_LABEL1"] = "Logical Devices Count:";
eLang.common_strings["STR_RAID_STORAGE_LABEL2"] = "Hot Spares Count:";
eLang.common_strings["STR_RAID_BBU_LABEL0"] = "Type:";
eLang.common_strings["STR_RAID_BBU_LABEL1"] = "Status:";
eLang.common_strings["STR_RAID_BBU_LABEL2"] = "Temp (°C):";
eLang.common_strings["STR_RAID_BBU_LABEL3"] = "Voltage (mV):";
eLang.common_strings["STR_RAID_BBU_LABEL4"] = "Current (mA):";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE0"] = "HDD";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE1"] = "SSD";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE2"] = "SSM";
eLang.common_strings["STR_RAID_PHYSICAL_STATE0"] = "UNCONFIGURED_GOOD";
eLang.common_strings["STR_RAID_PHYSICAL_STATE1"] = "UNCONFIGURED_BAD";
eLang.common_strings["STR_RAID_PHYSICAL_STATE2"] = "HOT_SPARE";
eLang.common_strings["STR_RAID_PHYSICAL_STATE3"] = "Offline";
eLang.common_strings["STR_RAID_PHYSICAL_STATE4"] = "Failed";
eLang.common_strings["STR_RAID_PHYSICAL_STATE5"] = "Rebuild";
eLang.common_strings["STR_RAID_PHYSICAL_STATE6"] = "Online";
eLang.common_strings["STR_RAID_TEMPRATURE_NOT_AVAILABLE"] = "N/A";
eLang.common_strings["STR_RAID_YES"] = "Yes";
eLang.common_strings["STR_RAID_NO"] = "No";
eLang.common_strings["STR_RAID_ON"] = "On";
eLang.common_strings["STR_RAID_OFF"] = "Off";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE0"] = "Unknown";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE1"] = "SCSI";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE2"] = "SAS";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE3"] = "SATA";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE4"] = "FC";
eLang.common_strings["STR_RAID_DISBALED"] = "Disabled";
eLang.common_strings["STR_RAID_ENABLED"] = "Enabled";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK0"] = "Not Defined";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK1"] = "1.5Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK2"] = "3.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK3"] = "6.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK4"] = "12.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_POWER_STATUS_UP"] = "Spun Up";
eLang.common_strings["STR_RAID_PHYSICAL_POWER_STATUS_DOWN"] = "Spun Down";
//eLang.common_strings["STR_RAID_PHYSICAL_SMART0"] = "N/A";
eLang.common_strings["STR_RAID_PHYSICAL_SMART1"] = "No Errors";
eLang.common_strings["STR_RAID_PHYSICAL_SMART2"] = "Errors Detected";
eLang.common_strings["STR_RAID_LOGICAL_STATE0"] = "Offline";
eLang.common_strings["STR_RAID_LOGICAL_STATE1"] = "Degraded";
eLang.common_strings["STR_RAID_LOGICAL_STATE2"] = "Rebuild";
eLang.common_strings["STR_RAID_LOGICAL_STATE3"] = "Optimal";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY0"] = "Read/Write";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY1"] = "Read Only";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY2"] = "Blocked";
eLang.common_strings["STR_RAID_LOGICAL_READ_POLICY0"] = "No Read Ahead";
eLang.common_strings["STR_RAID_LOGICAL_READ_POLICY1"] = "Read Ahead";
eLang.common_strings["STR_RAID_LOGICAL_WRITE_POLICY0"] = "Write Through";
eLang.common_strings["STR_RAID_LOGICAL_WRITE_POLICY1"] = "Write Back";
eLang.common_strings["STR_RAID_LOGICAL_CACHE_POLICY0"] = "Direct IO";
eLang.common_strings["STR_RAID_LOGICAL_CACHE_POLICY1"] = "Cache IO";
eLang.common_strings["STR_RAID_LOGICAL_BAD_BLOCKS0"] = "Empty";
eLang.common_strings["STR_RAID_LOGICAL_BAD_BLOCKS1"] = "Not Empty";
eLang.common_strings["STR_RAID_BBU_TYPE0"] = "Unknown";
eLang.common_strings["STR_RAID_BBU_TYPE1"] = "SuperCap";
eLang.common_strings["STR_RAID_BBU_TYPE2"] = "BBU";
eLang.common_strings["STR_RAID_BBU_TYPE3"] = "TBBU";
eLang.common_strings["STR_RAID_BBU_TYPE4"] = "iBBU";
eLang.common_strings["STR_RAID_BBU_TYPE5"] = "iTBBU";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS0"] = "Info Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS1"] = "Warning Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS2"] = "Critical Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS3"] = "Fatal Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS4"] = "Dead Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS5"] = "Progress Events";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS6"] = "Debug Events";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE0"] = "N/A";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE1"] = "subarray";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE2"] = "data/parity";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE3"] = "hotspare";
eLang.common_strings["STR_RAID_BBU_ERROR"] = "BBU Device not found.";
eLang.common_strings["STR_RAID_NOT_AVAILABLE"] = "N/A";
eLang.common_strings["STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"] = "Host is in power down state";
eLang.common_strings["STR_RAID_INVALID_CONTROLLER_ID"] = "Invalid RAID Controller Id.";
eLang.common_strings["STR_RAID_INVALID_DEVICE_ID"] = "Invalid RAID Controller Device Id.";
/*BMC Recovery*/
eLang.common_strings["STR_CONF_BMC_RECOVERY_GETVAL"] = "There was a problem while getting BMC Recovery configuration";
eLang.common_strings["STR_CONF_BMC_RECOVERY_SAVE_SUCCESS"] = "The BMC Recovery settings are saved successfully.";
eLang.common_strings["STR_CONF_BMC_RECOVERY_SETVAL"] = "There was a problem while configuring BMC Recovery Information";
eLang.common_strings["STR_INVALID_BMC_RECOVERY_IMAGE_NAME"] = "Image Name is mandatory.";
eLang.common_strings["STR_CONF_BMC_RECOVERY_BOOT_INVALID_RETRYCNT"] = "Invalid Boot Retry Count.";
eLang.common_strings["STR_CONF_BMC_RECOVERY_INVALID_RETRYCNT"] = "Invalid Recovery Retry Count.";

eLang.common_strings["STR_CONF_BMC_RECOVERY_CHARACTER_LIMIT"] = "Maximum 5 Characters only allowed.";
eLang.common_strings["STR_CONF_BMC_RECOVERY_ALPHANUM_ALERT"] = "Enter alphanumeric characters only.";




/*HPM Firmware Update*/
eLang.common_strings["STR_HPM_FW_UPDATE_INIT_ERROR"] = "There was a problem while doing HPM Initial Action";
eLang.common_strings["STR_HPM_FW_UPDATE_FINISH_ERROR"] = "There was a problem while doing HPM Finish Action";
eLang.common_strings["STR_HPM_FW_UPLOAD_ERROR"] = "There was a problem while doing HPM Upload.";
eLang.common_strings["STR_HPM_FW_INITIAL_ERR01"] = "In valid Component Id.";
eLang.common_strings["STR_HPM_FW_ERR01"] = "HPM image flash unsucessfully";
eLang.common_strings["STR_HPM_FW_ACTIVATE_ERROR"] = "There was a problem while doing HPM Activate Components.";
eLang.common_strings["STR_HPM_FW_TITLE"] = "<b>HPM Firmware Update";
eLang.common_strings["STR_FW_TITLE"] = "Press 'Enter Update Mode' to put the device in update mode.";
eLang.common_strings["STR_HPM_FW_CONFIRM0"] = "Do you wish to upgrade HPM Image?";
eLang.common_strings["STR_HPM_FW_UPDATE_ALL"] = "Update All";
eLang.common_strings["STR_HPM_FW_UPDATE_VALID_IMAGE"] = "Please enter valid HPM image";
eLang.common_strings["STR_HPM_FW_READING_ERROR"] = "There was a problem while reading HPM image,Please try another HPM Image";
eLang.common_strings["STR_HPM_FW_UPDATE_CONFIRM1"] ="Are you sure to cancel the firmware upgrade process? if so, the page will be reloaded.";
