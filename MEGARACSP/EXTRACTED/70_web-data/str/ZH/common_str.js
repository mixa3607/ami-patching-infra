//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2008-2013        **;
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

// File Name  : common_str.js
// Brief      : common page string table
// Author Name:

eLang.common_strings = {};

/*Dashboard*/
eLang.common_strings["STR_DASHBOARD_GETDEVICEID"] = "在取得裝置 ID 時發生了一個問題";
eLang.common_strings["STR_DASHBOARD_GETBUILDDATE"] = "在取得韌體產生日期和時間時發生了一個問題：";
eLang.common_strings["STR_DASHBOARD_NETWORK_EDIT"] = "編輯";
eLang.common_strings["STR_DASHBOARD_NETWORK_VIEW"] = "View";
eLang.common_strings["STR_WEBPREVIEW_KVM_DISABLE_1"] = "由於 KVM 停止服務，Web Preview 無法觀看";
eLang.common_strings["STR_WEBPREVIEW_KVM_DISABLE_2"] = "，由於 KVM 執照沒有取得，Web Preview 無法觀看";
eLang.common_strings["STR_NW_ADDR_MODE_0"] = "Unknown";
eLang.common_strings["STR_NW_ADDR_MODE_1"] = "Static";
eLang.common_strings["STR_NW_ADDR_MODE_2"] = "DOC7";

/*FRU Information*/
eLang.common_strings["STR_FRU_INFO_GETVAL"] = "在取得 FRU 資訊時發生了一個問題";

/*Configure Active Directory*/
eLang.common_strings["STR_CONF_AD_HEAD1"] = "分組 ID";
eLang.common_strings["STR_CONF_AD_HEAD2"] = "分組名稱";
eLang.common_strings["STR_CONF_AD_HEAD3"] = "分組網域";
eLang.common_strings["STR_CONF_AD_HEAD4"] = "分組權限";
eLang.common_strings["STR_CONF_AD_RG_CNT"] = "已設定的分組數：";
eLang.common_strings["STR_CONF_AD_ADENABLE_DESC"] = "要配置 Active Directory 伺服器的設定，按一下「進階設定」";
eLang.common_strings["STR_CONF_AD_ADDISABLE_DESC"] = "Active Directory 目前未啟用，請按「進階設定」來進行啟用並配置Active Directory的設定。";
eLang.common_strings["STR_CONF_AD_ADV_TITLE"] = "進階 Active Directory 設定";
eLang.common_strings["STR_CONF_AD_ADV_ENABLEAD"] = "Active Directory 認證";
eLang.common_strings["STR_CONF_AD_ADV_SECRETNAME"] = "使用者名稱";
eLang.common_strings["STR_CONF_AD_ADV_SECRETPASSWORD"] = "密碼";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINNAME"] = "使用者網域名稱";
eLang.common_strings["STR_CONF_AD_ADV_TIMEOUT"] = "逾時";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR1"] = "網域控制器伺服器 位址 1";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR2"] = "網域控制器伺服器 位址 2";
eLang.common_strings["STR_CONF_AD_ADV_DOMAINSRVR3"] = "網域控制器伺服器 位址 3";
eLang.common_strings["STR_CONF_AD_ADV_SAVE"] = "儲存";
eLang.common_strings["STR_CONF_AD_RG_ADD_TITLE"] = "新增分組";
eLang.common_strings["STR_CONF_AD_RG_MODIFY_TITLE"] = "修改分組";
eLang.common_strings["STR_CONF_AD_RG_NAME"] = "分組名稱";
eLang.common_strings["STR_CONF_AD_RG_DOMAIN"] = "分組網域";
eLang.common_strings["STR_CONF_AD_RG_PRIV"] = "分組權限";

/*Configure Active Directory Error Strings*/
eLang.common_strings["STR_CONF_AD_GETINFO"] = "在取得 Active Directory 資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_SETINFO"] = "在設定 Active Directory 資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_RG_GETINFO"] = "取得分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_RG_ADDINFO"] = "新增分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_RG_MODINFO"] = "修改分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_RG_DELINFO"] = "在刪除分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_AD_RG_ADMINPRIV"] = "您需要具有管理者權限來新增、 修改或刪除分組。";
eLang.common_strings["STR_CONF_AD_ADV_ADMINPRIV"] = "您需要有管理者權限來配置 Active Directory 設定。";
eLang.common_strings["STR_CONF_AD_RG_ERR1"] = "請在分組清單中選擇一個欄位";
eLang.common_strings["STR_CONF_AD_RG_ERR2"] = "在你選定的欄位中沒有已配置的分組。請選擇另外一個分組";
eLang.common_strings["STR_CONF_AD_RG_ERR3"] = "分組名稱已經存在此分組網域中";
eLang.common_strings["STR_CONF_AD_CONFIRM1"] = "在你選定的欄位中已經有分組配置的設定。請確認是否要修改並取代原本的分組配置設定？";
eLang.common_strings["STR_CONF_AD_CONFIRM2"] = "該欄位是目前是空欄位。請確認是否要新增新的分組配置？";
eLang.common_strings["STR_CONF_AD_RG_DELETE_SUCCESS"] = "分組已被刪除";
eLang.common_strings["STR_CONF_AD_RG_ADV_SAVE_SUCCESS"] = "Active Directory 配置已成功設定 ";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINNAME"] = "無效的使用者 Domain Name！";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR1"] = "無效的網域控制器伺服器 位址 1";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR2"] = "無效的網域控制器伺服器 位址 2";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR3"] = "無效的網域控制器伺服器 位址 3";
eLang.common_strings["STR_CONF_AD_ADV_INVALID_DOMAINSRVR"] = "請至少輸入一個 Domain Controller Server 位址";
eLang.common_strings["STR_CONF_AD_ADV_DIFF_DOMAINSRVR"] = "網域控制器伺服器 的位址不應該相同";
eLang.common_strings["STR_CONF_AD_RG_INVALID_RGNAME"] = "無效的分組名稱 ！";
eLang.common_strings["STR_CONF_AD_RG_INVALID_RGDOMAIN"] = "無效的分組網域名稱！";

/*Role Group Strings*/
eLang.common_strings["STR_CONF_RG_TITLE_1"] = "新增分組";
eLang.common_strings["STR_CONF_RG_TITLE_2"] = "修改分組";
eLang.common_strings["STR_CONF_RG_CNT"] = "已配置的分組數目：";
eLang.common_strings["STR_CONF_RG_HEAD1"] = "分組 ID";
eLang.common_strings["STR_CONF_RG_HEAD2"] = "組名稱";
eLang.common_strings["STR_CONF_RG_HEAD4"] = "組權限";
eLang.common_strings["STR_CONF_RG_NAME"] = "分組名稱";
eLang.common_strings["STR_CONF_RG_PRIV"] = "分組權限";
eLang.common_strings["STR_CONF_RG_SEARCHBASE"] = "分組搜索庫";
eLang.common_strings["STR_CONF_RG_GETINFO"] = "取得分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_RG_SETINFO"] = "配置分組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_RG_DELINFO"] = "在刪除角色組資訊時發生了一個問題";
eLang.common_strings["STR_CONF_RG_ERR1"] = "請選擇分組清單中的一個欄位";
eLang.common_strings["STR_CONF_RG_ERR2"] = "在你選定的欄位中沒有已配置的分組。請選擇另外一個分組";
eLang.common_strings["STR_CONF_RG_ERR3"] = "分組名稱已經存在與此分組搜索庫";
eLang.common_strings["STR_CONF_RG_CONFIRM1"] = "在你選定的欄位中已經有分組配置的設定。請確認是否要修改並取代原本的分組配置設定？";
eLang.common_strings["STR_CONF_RG_CONFIRM2"] = "該欄位是目前是空欄位。請確認是否要新增新的分組配置？";
eLang.common_strings["STR_CONF_RG_DELETE_SUCCESS"] = "分組已被刪除";
eLang.common_strings["STR_CONF_RG_SAVE_SUCCESS_1"] = "已成功新增分組";
eLang.common_strings["STR_CONF_RG_SAVE_SUCCESS_2"] = "已成功修改分組";

/*Configure Event Log*/
eLang.common_strings["STR_CONF_SEL_GETVAL"] = "取得系統事件日誌配置時發生了一個問題";
eLang.common_strings["STR_CONF_SEL_SETVAL"] = "設定系統事件日誌的配置時發生了一個問題";
eLang.common_strings["STR_CONF_SEL_POLICY_ERR"] = "請選擇事件日誌策略";
eLang.common_strings["STR_CONF_SEL_SAVE_SUCCESS"] = "已成功儲存的事件日誌策略";
eLang.common_strings["STR_CONF_SEL_POLICY_UNKNOWN"] = "未知的事件日誌策略";

/*Configure Image Transfer Protocol*/
eLang.common_strings["STR_CONF_FWIMG_GETVAL"] = "取得韌體映象檔配置時發生了問題";
eLang.common_strings["STR_CONF_FWIMG_SETVAL"] = "設定韌體映象檔配置時發生了問題";
eLang.common_strings["STR_CONF_FWIMG_SUCCESS"] = "韌體映象檔配置已成功儲存";
eLang.common_strings["STR_CONF_FWIMG_PROTO0"] = "HTTP/HTTPs";
eLang.common_strings["STR_CONF_FWIMG_PROTO1"] = "TFTP";
eLang.common_strings["STR_CONF_FWIMG_PROTO2"] = "FTP";
eLang.common_strings["STR_CONF_FWIMG_INVALID_RETRYCNT"] = "Invalid Retry Count.";

/*Images Redirection*/
eLang.common_strings["STR_MEDIA_CFG_GETVAL"] = "取得媒體配置時發生了一個問題";
eLang.common_strings["STR_MEDIA_CFG_SETVAL"] = "設定媒體配置時發生了一個問題";
eLang.common_strings["STR_MEDIA_DESC"] = "本頁藉由配置映象檔到 BMC 內來重定位。可以透過本地媒體來上傳映象檔到 BMC 中，也可以透過遠端媒體掛載映象檔。";
eLang.common_strings["STR_MEDIA_STATUS_0"] = "本地媒體目前被關閉。";
eLang.common_strings["STR_MEDIA_STATUS_1"] = "遠端媒體目前被關閉。";
eLang.common_strings["STR_MEDIA_STATUS_3"] = "本地和遠端媒體目前已關閉。";
eLang.common_strings["STR_MEDIA_STATUS_4"] = "本地和遠端媒體目前已啟動。";
eLang.common_strings["STR_MEDIA_ADV_DESC"] = "若要配置本地或遠端媒體設定。請按 「進階設定」 ";
eLang.common_strings["STR_LMEDIA_ENABLE"] = "本地媒體啟動";
eLang.common_strings["STR_RMEDIA_ENABLE"] = "遠端媒體啟動";
eLang.common_strings["STR_MEDIA_ADV_TITLE"] = "進階媒體設定";
eLang.common_strings["STR_MEDIA_CFG_CONFIRM"] = "更改媒體配置將會關閉目前現有的虛擬媒體重定向 Session，並重新啟動它們。按下確定來繼續。";
eLang.common_strings["STR_MEDIA_CFG_SUCCESS"] = "媒體配置已成功儲存";
eLang.common_strings["STR_MEDIA_IMGTYPE"] = "媒體類型";
eLang.common_strings["STR_MEDIA_IMGNAME"] = "映象檔名稱";
eLang.common_strings["STR_MEDIA_STATUS"] = "重定向狀態";
eLang.common_strings["STR_MEDIA_SERVER_INSTANCE"] = "Conneted Server Session";
eLang.common_strings["STR_MEDIA_STATUS_START"] = "已開始";
eLang.common_strings["STR_MEDIA_STATUS_PROGRESS"] = "進行中......";
eLang.common_strings["STR_MEDIA_STATUS_STOP"] = "停止";
eLang.common_strings["STR_MEDIA_START_REDIR"] = "啟動重定向";
eLang.common_strings["STR_MEDIA_STOP_REDIR"] = "停止重定向";
eLang.common_strings["STR_MEDIA_REDIR_ERROR_1"] = "無法取得已選的映象檔索引";
eLang.common_strings["STR_MEDIA_IMG_SETVAL_0"] = "設定本地媒體映象檔時發生問題";
eLang.common_strings["STR_MEDIA_IMG_SETVAL_1"] = "設定遠端媒體映象檔時發生問題";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS1"] = "已成功新增映象檔";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS2"] = "已成功清除映象檔";
eLang.common_strings["STR_MEDIA_IMG_SUCCESS3"] = "已成功刪除映象檔";
eLang.common_strings["STR_LMEDIA_IMG_GETVAL"] = "取得本地媒體區域內容時發生問題";
eLang.common_strings["STR_LMEDIA_IMG_SETVAL"] = "設定本地媒體領域內容時發生了問題";
eLang.common_strings["STR_RMEDIA_IMG_GETVAL"] = "取得遠端媒體映象檔配置時發生了問題";
eLang.common_strings["STR_RMEDIA_IMG_SETVAL"] = "設定遠端媒體映象檔配置時發生了一個問題";
eLang.common_strings["STR_MEDIA_CFG_SD_MOUNT_ERROR"] = "無法偵測到 SD 卡";
eLang.common_strings["STR_MEDIA_INVALID_OPERATION"] = "無效的操作處理";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_0"] = "-成功";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_1"] = "-接受連接";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_2"] = "-拒絕連接";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_3"] = "-登入失敗";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_4"] = "-連接正在使用中";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_5"] = "-權限不足";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_6"] = "-未知錯誤";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_7"] = "-媒體分離階段";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_8"] = "-達到使用者數目最大值";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_9"] = "-無法連接";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_10"] = "-無效的映象檔";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_11"] = "-掛載錯誤";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_12"] = "-無法打開";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_13"] = "-媒體執照過期";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_14"] = "-連接失敗";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_15"] = "-使用者取消掛載";
eLang.common_strings["STR_MEDIA_REDIR_STATUS_16"] = "-退出設備";
eLang.common_strings["STR_MEDIA_IMG_CNT"] = "可用的媒體類型數：";
eLang.common_strings["STR_LMEDIA_IMGFILE"] = "映象檔";
eLang.common_strings["STR_MEDIA_ADD_IMAGE"] = "新增映象檔";
eLang.common_strings["STR_MEDIA_INVALID_FILE1"] = "不正確映象檔名稱。";
eLang.common_strings["STR_MEDIA_INVALID_FILE2"] = "所選的映象檔已存在。請選擇另外一個映象檔......！";
eLang.common_strings["STR_LMEDIA_CNFM_UPLOAD1"] = "需要更多的時間來上傳映象檔。在此期間，沒有辦法處理所有送來的 rpc 請求。確定要繼續嗎？";
eLang.common_strings["STR_LMEDIA_UPLOAD_ERROR"] = "上傳檔案時發生一個問題。";
eLang.common_strings["STR_MEDIA_CFG_RMEDIA_MOUNT_ERROR"] = "遠端共用的臨時掛載失敗";
eLang.common_strings["STR_MEDIA_START_ERR"] = "初始化媒體重定向時發生一個問題";
eLang.common_strings["STR_MEDIA_REDIR_START_0"] = "本地媒體重定向開始初始化......！";
eLang.common_strings["STR_MEDIA_REDIR_START_1"] = "遠端媒體重定向開始初始化......！";
eLang.common_strings["STR_MEDIA_REDIR_STOP_0"] = "本地媒體重定向停止初始化......！";
eLang.common_strings["STR_MEDIA_REDIR_STOP_1"] = "遠端媒體重定向停止初始化......！";
eLang.common_strings["STR_MEDIA_INVALID_CDIMG"] = "CD/DVD映象檔應以.iso 結尾";
eLang.common_strings["STR_MEDIA_INVALID_FDIMG"] = "軟碟/硬碟映象檔應以.img 結束";
eLang.common_strings["STR_LMEDIA_DESC"] = "用本地媒體來將映象檔配置到 BMC 內。";
eLang.common_strings["STR_RMEDIA_DESC"] = "用遠端媒體來將這些映象檔掛載到遠端系統上並執行重定向。";
eLang.common_strings["STR_RMEDIA_ADV_DESC"] = "若要配置遠端媒體設定。按一下進階設定按鈕。";
eLang.common_strings["STR_LMEDIA_ADV_DESC"] = "若要配置本地媒體設定。按一下進階設定按鈕";
eLang.common_strings["STR_RMEDIA_STATUS_1"] = eLang.common_strings["STR_MEDIA_STATUS_1"];
eLang.common_strings["STR_LMEDIA_STATUS_1"] = eLang.common_strings["STR_MEDIA_STATUS_0"];
eLang.common_strings["STR_RMEDIA_IMG_NOT_AVAILABLE"] = "沒有可用的映象檔";
eLang.common_strings["STR_RMEDIA_APPLICATION_NOT_RUNNING"] = "應用程式沒有執行";
eLang.common_strings["STR_MOUNT_NOT_RESPONDING"] = "遠端共用路徑無法存取";
eLang.common_strings["STR_RMEDIA_TYPE"] = "啟用的媒體類型";
eLang.common_strings["STR_RMEDIA_ALL_TYPE"] = "所有的媒體設定";
eLang.common_strings["STR_RMEDIA_CD_TYPE"] = "CD/DVD 媒體設定";
eLang.common_strings["STR_RMEDIA_Floppy_TYPE"] = "Floppy 媒體設定";
eLang.common_strings["STR_RMEDIA_Harddisk_TYPE"] = "Harddisk 媒體設定";
eLang.common_strings["STR_RMEDIA_TYPE_SELECT"] = "配置最少需要一個 Remote Media 的支援";
eLang.common_strings["STR_MEDIA_CFG_CD_SUCCESS"] = "CD 媒體配置已成功儲存";
eLang.common_strings["STR_MEDIA_CFG_FD_SUCCESS"] = "FD 媒體配置已成功儲存";
eLang.common_strings["STR_MEDIA_CFG_HD_SUCCESS"] = "HD 媒體配置已成功儲存";
eLang.common_strings["STR_MEDIA_CFG_CLEAR_ERROR"] = "在清除遠端媒體類型時發生一個錯誤";
eLang.common_strings["STR_LMEDIA_DELETE_BUTTON"] = "刪除映象檔"; 
eLang.common_strings["STR_RMEDIA_CLEAR_BUTTON"] = "清除"; 
eLang.common_strings["STR_RMEDIA_LMEDIA_CONF_REDIRECT_STATUS_ERROR"] = "在重定位的過程中不允許啟用/停用 RMedia/LMedia 的選項。"; 

/*Configure LDAP*/
eLang.common_strings["STR_CONF_LDAP_DESC_1"] = "若要設定 LDAP/E-Directory 伺服器組態。按一下進階設定按鈕";
eLang.common_strings["STR_CONF_LDAP_DESC_0"] = " LDAP/E-Directory settings 預設為關閉。按一下「進階設定」啟用LDAP/ E-Directory settings。";
eLang.common_strings["STR_CONF_LDAP_GETINFO"] = "取得 LDAP/E-Directory 資訊時發生問題";
eLang.common_strings["STR_CONF_LDAP_SETINFO"] = "設定 LDAP/E-Directory 資訊時發生問題";
eLang.common_strings["STR_CONF_LDAP_SAVE_SUCCESS"] = "已成功儲存 LDAP/E-Directory 設定";
eLang.common_strings["STR_CONF_LDAP_RG_SEARCHBASE"] = "組搜尋庫";
eLang.common_strings["STR_CONF_LDAP_TITLE"] = "進階 LDAP/E-Directory 設定";
eLang.common_strings["STR_CONF_LDAP_ENABLE"] = " LDAP/E-Directory 認證";
eLang.common_strings["STR_CONF_LDAP_SSLENABLE"] = "SSL";
eLang.common_strings["STR_CONF_LDAP_TLSENABLE"] = "StartTLS";
eLang.common_strings["STR_CONF_LDAP_ENCRYPTEDTYPE"] = "加密類型";
eLang.common_strings["STR_CONF_LDAP_COMMONNAME"] = "通用名稱類型";
eLang.common_strings["STR_CONF_LDAP_IPADDRESS"] = "IP 位址";
eLang.common_strings["STR_CONF_LDAP_FQDN"] = "FQDN";
eLang.common_strings["STR_CONF_LDAP_NO_ENCRYPTED"] = "不加密";
eLang.common_strings["STR_CONF_LDAP_INVALID_SERVERADDR"] = "無效的伺服器位址格式。";
eLang.common_strings["STR_CONF_LDAP_ENCRYPTED_RESTART_WEBSERVER"] = "修改加密類型需要重啟 web 伺服器 ！！！請刷新網頁並重新登入";
eLang.common_strings["STR_CONF_LDAP_RESTART_WEBSERVER"] = "修改授權檔需要重啟 web 伺服器 ！！！請刷新網頁並重新登入";
eLang.common_strings["STR_CONF_LDAP_PORT"] = "Port";
eLang.common_strings["STR_CONF_LDAP_BINDDN"] = "Bind DN";
eLang.common_strings["STR_CONF_LDAP_SEARCHBASE"] = "搜索庫";
eLang.common_strings["STR_CONF_LDAP_ATTRIBUTE_OF_USER_LOGIN"] = "使用者的登入屬性";
eLang.common_strings["STR_CONF_LDAP_INVALID_BINDDN"] = "無效的 DN 綁定";
eLang.common_strings["STR_CONF_MOUSE_GETVAL"] = "取得滑鼠模式配置時出錯";
eLang.common_strings["STR_CONF_MOUSE_SETVAL"] = "設定滑鼠模式配置時出錯";
eLang.common_strings["STR_CONF_MOUSE_MODE_1"] = "相對";
eLang.common_strings["STR_CONF_MOUSE_MODE_2"] = "絕對";
eLang.common_strings["STR_CONF_MOUSE_MODE_3"] = "另一種模式";
eLang.common_strings["STR_CONF_MOUSE_UNKNOWN"] = "未知的滑鼠模式";
eLang.common_strings["STR_CONF_MOUSE_CONFIRM"] = "你確定要改變滑鼠模式？請關閉目前開啟的重定向主控台，然後重新開啟。";
eLang.common_strings["STR_CONF_MOUSE_ALERT1"] = "請選擇一種滑鼠模式";
eLang.common_strings["STR_CONF_MOUSE_ALERT2"] = "設定未變更。";
eLang.common_strings["STR_CONF_MOUSE_SUCCESS"] = "配置滑鼠模式成功。";
eLang.common_strings["STR_CONF_NCSI_GETVAL"] = "取得 NCSI 配置時發生一個問題";
eLang.common_strings["STR_CONF_NCSI_SETVAL"] = "配置 NCSI 資訊時出現了一個問題";
eLang.common_strings["STR_CONF_NCSI_SAVE_SUCCESS"] = "儲存NCSI 設定成功。";
eLang.common_strings["STR_CONF_NCSI_MODE_0"] = "手動切換";
eLang.common_strings["STR_CONF_NCSI_MODE_1"] = "自動容錯移轉";
eLang.common_strings["STR_CONF_NW_GETVAL"] = "取得網路設定時發生一個問題";
eLang.common_strings["STR_CONF_NW_SETVAL"] = "設定網路設定時發生一個問題。";
eLang.common_strings["STR_CONF_NW_GETERR1"] = "無法取得網路設定";
eLang.common_strings["STR_CONF_NW_SETERR1"] = "無法設定提供的網路參數";
eLang.common_strings["STR_CONF_NW_SAVE_CONFIRM"] = "此功能可能會更改設備的 IP 位址和失去與此瀏覽器的連接。請重啟一個瀏覽器來應用所做的更改。確定繼續？";
eLang.common_strings["STR_CONF_NW_RESET_TITLE"] = "網路設定已被重置";
eLang.common_strings["STR_CONF_NW_RESET_DESC"] = "網路設定已重置成功。它將花費幾秒來更動介面。請關閉目前的瀏覽器並用更新的ip來重啟瀏覽器。";
eLang.common_strings["STR_CONF_NW_ERR_222"] = "IP 位址或預設閘道 IP 值超出範圍。";
eLang.common_strings["STR_CONF_NW_ERR_223"] = "非法的 IPv4 的 IP 位址";
eLang.common_strings["STR_CONF_NW_ERR_224"] = "非法的 IPv4 預設閘道";
eLang.common_strings["STR_CONF_NW_ERR_225"] = "非法的 IPv4 子網路遮罩";
eLang.common_strings["STR_CONF_NW_ERR_226"] = "非法的 IPv6 IP 位址";
eLang.common_strings["STR_CONF_NW_ERR_227"] = "非法的 IPv6 預設閘道";
eLang.common_strings["STR_CONF_NW_ERR_387"] = "只要有任一介面目前處於啟用狀態即無法停止啟用網路介面。";
eLang.common_strings["STR_CONF_NW_ERR_469"] = "VLAN ID 不能直接更改。若要更改 VLAN ID 需先停用目前啟用的 VLAN 配置，然後用新的VLAN id 重啟 VLAN 配置。";
eLang.common_strings["STR_CONF_NW_INVALID_V6SUBNET"] = "無效的 IPv6 Subnet 前置長度。";
eLang.common_strings["STR_CONF_NW_INVALID_VLANID"] = "無效的 VLAN id。";
eLang.common_strings["STR_CONF_NW_INVALID_VLANPRIORITY"] = "無效的 VLAN 優先權。";
eLang.common_strings["STR_CONF_NW_SAVE_IE_ERROR"] = "如果主機名稱含底線 (_) 字元，IE 瀏覽器不能運作正常。確定繼續？";
eLang.common_strings["STR_CONF_NW_IP4_IP6_ENABLE"] = "應該啟用 IPv4 或 IPv6 其一";
eLang.common_strings["STR_CONF_NW_INTERFACE_DISABLE"] = "只有一個介面啟用，但無法停用介面。";

/*Configure Network Bonding*/
eLang.common_strings["STR_NW_BOND_IFC_1"] = "eth0";
eLang.common_strings["STR_NW_BOND_IFC_2"] = "eth1";
eLang.common_strings["STR_NW_BOND_IFC_3"] = "All";
eLang.common_strings["STR_NW_BOND_MODE_0"] = "balance-rr";
eLang.common_strings["STR_NW_BOND_MODE_1"] = "active-backup";
eLang.common_strings["STR_NW_BOND_MODE_2"] = "balance-xor";
eLang.common_strings["STR_NW_BOND_MODE_3"] = "broadcast";
eLang.common_strings["STR_NW_BOND_MODE_4"] = "802.3 ad";
eLang.common_strings["STR_NW_BOND_MODE_5"] = "balance-tlb";
eLang.common_strings["STR_NW_BOND_MODE_6"] = "balance-alb";
eLang.common_strings["STR_CONF_NW_BOND_GETVAL"] = "取得網路合併配置時發生一個問題。";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL"] = "設定網路合併配配置時發生一個問題。";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_128"] = "由於網路介面的數目不足,無法啟用網路合併。";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_129"] =
        eLang.common_strings["STR_CONF_NW_BOND_SETVAL_133"] = "網路合併" +
           "配置無法儲存，所選的介面目前未啟用。";
eLang.common_strings["STR_CONF_NW_BOND_SETVAL_130"] = "當 VLAN 啟用用來作為 Slave 介面時網路合併無法啟用。可以在設定下的網路選項中關閉 VLAN。";
eLang.common_strings["STR_CONF_NW_BOND_NOT_SUPPORT"] = "由於網路介面的數目不足，無法支援網路合併。";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_BOND"] = "關閉合併將會停止 合併 VLAN 的配置。";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_AUTO1"] = "自動設定被啟用，所有的服務將自動重新啟動。按 OK 後繼續。";
eLang.common_strings["STR_CONF_NW_BOND_CNFM_AUTO0"] = "自動設定被停用，服務需要透過 IPMI Command 來配置介面。按 OK 後繼續。";
eLang.common_strings["STR_CONF_NW_BOND_SAVE_SUCCESS"] = "網路合併配置已成功儲存。";

/*Configure Network Link*/
eLang.common_strings["STR_PHY_LINKSPEED_10"] = "10 Mbps";
eLang.common_strings["STR_PHY_LINKSPEED_100"] = "100 Mbps";
eLang.common_strings["STR_PHY_LINKSPEED_1000"] = "1000 Mbps";
eLang.common_strings["STR_PHY_DUPLEXMODE_HALF"] = "半雙工";
eLang.common_strings["STR_PHY_DUPLEXMODE_FULL"] = "全雙工";
eLang.common_strings["STR_CONF_PHY_GETVAL"] = "取得網路連結配置時發生一個問題。";
eLang.common_strings["STR_CONF_PHY_SETVAL"] = "設定網路連結配置時發生一個問題。";
eLang.common_strings["STR_CONF_PHY_SUPPORT_GETVAL"] = "無法為 LAN 介面取得支援的功能";
eLang.common_strings["STR_CONF_PHY_SAVE_SUCCESS"] = "網路連結配置已成功儲存。";
eLang.common_strings["STR_CONF_PHY_SAVE_ERROR"] = "所選的連結速度不支援。";

/*Configure DNS*/
eLang.common_strings["STR_CONF_DNS_INVALID_HOST"] = "無效的 Host Name";
eLang.common_strings["STR_CONF_DNS_INVALID_DOMAIN"] = "無效的 Domain Name";
eLang.common_strings["STR_CONF_DNS_INVALID_DNS"] = "無效的 DNS 伺服器位址";
eLang.common_strings["STR_CONF_DNS_V6DISABLE"] = "\\nNOTE： 在網路設定中關閉了 IPv6。";
eLang.common_strings["STR_CONF_DNS_BLANK"] = "DNS 伺服器位址不能為空。";
eLang.common_strings["STR_CONF_DNS_DIFF"] = "DNS 伺服器位址應該要不同。";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR1"] = "TSIG 私密檔案不存在";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR5"] = "TSIG 私密檔案的超過大小限制";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR6"] = "上傳 TSIG 私密檔案失敗。請再次嘗試上傳 TSIG 私密檔案。";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR9"] = "TSIG 私密金鑰演算法不是 HMAC-MD5。請上傳 TSIG 私密檔案支援 HMAC-MD5。";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR10"] = "請選擇一個 TSIG 私密檔";
eLang.common_strings["STR_CONF_DNS_TSIG_ERR11"] = "TSIG 私密檔案應以 .private 來作結尾";

/*Configure NTP*/
eLang.common_strings["STR_CONF_NTP_GETVAL"] = "取得 NTP 配置時發生一個問題";
eLang.common_strings["STR_CONF_NTP_SETVAL"] = "設定 NTP 配置時發生一個問題";
eLang.common_strings["STR_CONF_DATE_TIME_GETVAL"] = "取得日期和時間值時發生一個問題。";
eLang.common_strings["STR_CONF_DATE_TIME_SETVAL"] = "設定日期和時間值時發生一個問題。";
eLang.common_strings["STR_CONF_NTP_INVALID_HOUR"] = "無效的小時數。";
eLang.common_strings["STR_CONF_NTP_INVALID_MINS"] = "無效的分鐘數。";
eLang.common_strings["STR_CONF_NTP_INVALID_SECS"] = "無效的秒數。";
eLang.common_strings["STR_CONF_NTP_INVALID_DATE"] = "無效的日期，";
eLang.common_strings["STR_CONF_NTP_DATE_RANGE"] = "日期值超出範圍。請重新配置。";
eLang.common_strings["STR_CONF_NTP_INVALID_LEAP"] = "閏年 Feb 包含 29 天。";
eLang.common_strings["STR_CONF_NTP_INVALID_FEB"] = "Feb 包含 28 天。";
eLang.common_strings["STR_CONF_NTP_INVALID_MONTH"] = "選定一個月份只含 30 天。";
eLang.common_strings["STR_CONF_NTP_INVALID_PRIMARY_SERVER"] = "無效的 主要 NTP 伺服器";
eLang.common_strings["STR_CONF_NTP_INVALID_SECONDARY_SERVER"] = "無效的次要 NTP 伺服器";
eLang.common_strings["STR_CONF_NTP_INVALID_SERVERS"] = "無效的主要和次要 NTP 伺服器";
eLang.common_strings["STR_CONF_NTP_SERVER_FAIL"] = "NTP 伺服器在同步時發生臨時故障 ！";
eLang.common_strings["STR_CONF_NTP_CONFIRM"] = "配置已更改 ！你儲存這些更改嗎？";
eLang.common_strings["STR_CONF_NTP_SAVE"] = "已成功設定配置。";

/*Configure PAM Ordering*/
eLang.common_strings["STR_CONF_PAM_GETVAL"] = "取得 PAM 順序配置時發生一個問題。";
eLang.common_strings["STR_CONF_PAM_SETVAL"] = "設定 PAM 順序配置時發生一個問題。";
eLang.common_strings["STR_CONF_PAM_SUCCESS"] = "PAM 順序已成功配置。";
eLang.common_strings["STR_CONF_PAM_ERR"] = "還有 PAM 順序與現有的 PAM 順序沒有更動。";
eLang.common_strings["STR_CONF_PAM_CONFIRM"] = "Web 服務器將重啟，按下確定繼續？";
eLang.common_strings["STR_CONF_PAM__INTIALIZE_ERR"] = "初始化 PAM 模組時發生一個問題";
eLang.common_strings["STR_CONF_PAM__SELECT_ERR"] = "在選擇 PAM 模組時發生一個問題";

/*Configure PEF -> Event Filter*/
eLang.common_strings["STR_CONF_PEF_ID"] = "PEF ID";
eLang.common_strings["STR_CONF_PEF_CONFIGURATION"] = "篩選設定";
eLang.common_strings["STR_CONF_PEF_ACTION"] = "事件篩選器動作";
eLang.common_strings["STR_CONF_PEF_EVENT_SEVERITY"] = "事件嚴重度";
eLang.common_strings["STR_CONF_PEF_SENSOR_NAME"] = "感應器名稱";
eLang.common_strings["STR_CONF_PEF_CNT"] = "配置 PEF 數目：";
eLang.common_strings["STR_CONF_PEF_GETINFO"] = "取得所有 PEF 配置時發生一個問題";
eLang.common_strings["STR_CONF_PEF_DELINFO"] = "在刪除 PEF 配置時發生一個問題";
eLang.common_strings["STR_CONF_PEF_ERR1"] = "請在 PEF 清單中選擇一個欄位";
eLang.common_strings["STR_CONF_PEF_ERR2"] = "在您選定的欄位中沒有 PEF 的配置。";
eLang.common_strings["STR_CONF_PEF_DELETE_SUCCESS"] = "PEF 欄位已被刪除";
eLang.common_strings["STR_PEF_CFG"] = "PEF 配置";
eLang.common_strings["STR_PEF_ID"] = "PEF ID";
eLang.common_strings["STR_PEF_FILTER"] = "事件篩選器配置";
eLang.common_strings["STR_PEF_EVENT"] = "事件嚴重程度";
eLang.common_strings["STR_PEF_ACTION_CFG"] = "篩選器動作配置";
eLang.common_strings["STR_PEF_ACTION"] = "事件篩選器動作";
eLang.common_strings["STR_PEF_ALERT"] = "警報";
eLang.common_strings["STR_PEF_POWER"] = "電源操作";
eLang.common_strings["STR_PEF_POLICY"] = "警報策略編號";
eLang.common_strings["STR_PEF_GNTR_CFG"] = "Generator ID 配置";
eLang.common_strings["STR_PEF_GNTR_DATA"] = "Generaot ID Data";
eLang.common_strings["STR_PEF_GNTR_RAW"] = "Raw data";
eLang.common_strings["STR_PEF_GNTR_ID1"] = "Generator ID 1";
eLang.common_strings["STR_PEF_GNTR_ID2"] = "Generator ID 2";
eLang.common_strings["STR_PEF_GNTR_TYPE"] = "事件產生器";
eLang.common_strings["STR_PEF_GNTR_SLAVE"] = "Slave 類型";
eLang.common_strings["STR_PEF_GNTR_SOFTWARE"] = "Software 類型";
eLang.common_strings["STR_PEF_SLAVE_SW"] = "Slave 位址/Software ID";
eLang.common_strings["STR_PEF_CHANNEL_NO"] = "Channel 編號";
eLang.common_strings["STR_PEF_IPMB_DEVICE"] = "IPMB Device LUN";
eLang.common_strings["STR_PEF_SENSOR_CFG"] = "感應器配置";
eLang.common_strings["STR_PEF_SENSORTYPE"] = "感應器類型";
eLang.common_strings["STR_PEF_SENSORNAME"] = "感應器名稱";
eLang.common_strings["STR_PEF_EVENT_OPT"] = "事件選項";
eLang.common_strings["STR_PEF_SENSOREVENTS"] = "感應器事件";
eLang.common_strings["STR_PEF_EVT_DATA_CFG"] = "事件資料配置";
eLang.common_strings["STR_PEF_TRIGGER"] = "事件觸發器";
eLang.common_strings["STR_PEF_EVENT1_AND"] = "Event Data 1 AND Mask";
eLang.common_strings["STR_PEF_EVENT1_COMPARE1"] = "Event Data 1 Compare 1";
eLang.common_strings["STR_PEF_EVENT1_COMPARE2"] = "Event Data 1 Compare 2";
eLang.common_strings["STR_PEF_EVT_DATA2_CFG"] = "Event Data 2 配置";
eLang.common_strings["STR_PEF_EVENT2_AND"] = "Event Data 2 AND Mask";
eLang.common_strings["STR_PEF_EVENT2_COMPARE1"] = "Event Data 2 Compare 1";
eLang.common_strings["STR_PEF_EVENT2_COMPARE2"] = "Event Data 2 Compare 2";
eLang.common_strings["STR_PEF_EVT_DATA3_CFG"] = "Event Data 3 配置";
eLang.common_strings["STR_PEF_EVENT3_AND"] = "Event Data 3 AND Mask";
eLang.common_strings["STR_PEF_EVENT3_COMPARE1"] = "Event Data 3 Compare 1";
eLang.common_strings["STR_PEF_EVENT3_COMPARE2"] = "Event Data 3 Compare 2";
eLang.common_strings["STR_PEF_SEVERITY"] = "未指定";
eLang.common_strings["STR_PEF_SEVERITY_0"] = "監視器";
eLang.common_strings["STR_PEF_SEVERITY_1"] = "資訊";
eLang.common_strings["STR_PEF_SEVERITY_2"] = "正常";
eLang.common_strings["STR_PEF_SEVERITY_3"] = "非臨界";
eLang.common_strings["STR_PEF_SEVERITY_4"] = "臨界";
eLang.common_strings["STR_PEF_SEVERITY_5"] = "不可回復";
eLang.common_strings["STR_PEF_POWER_1"] = "關閉電源";
eLang.common_strings["STR_PEF_POWER_2"] = "電源重啟";
eLang.common_strings["STR_PEF_POWER_3"] = "電源週期";

/*Configure PEF -> Add or Modify Event Filter*/
eLang.common_strings["STR_PEF_TITLE_1"] = "新增事件篩選項目";
eLang.common_strings["STR_PEF_TITLE_2"] = "修改事件篩選項目";
eLang.common_strings["STR_ADD_PEF_DESC"] = "使用此頁面新增 PEF 欄位。按一下新增來儲存新配置的 PEF 。";
eLang.common_strings["STR_MODIFY_PEF_DESC"] = "使用此頁來修改現有的 PEF 欄位。按一下修改來進行修改。";
eLang.common_strings["STR_CONF_PEF_CFGINFO"] = "配置 PEF 時發生一個問題";
eLang.common_strings["STR_CONF_PEF_SUCCESS_1"] = "PEF 欄位新增成功 ！";
eLang.common_strings["STR_CONF_PEF_SUCCESS_2"] = "已成功修改 PEF 欄位";
eLang.common_strings["STR_CONF_PEF_CONFIRM1"] = "這個欄位已配置 PEF 欄位。確定要修改此欄位取代現有的 PEF欄位？";
eLang.common_strings["STR_CONF_PEF_CONFIRM2"] = "該欄位是目前為空欄位。確定要新增新的 PEF 欄位？";
eLang.common_strings["STR_PEF_EVENT_LOW"] = "Going Low";
eLang.common_strings["STR_PEF_EVENT_HIGH"] = "Going High";
eLang.common_strings["STR_PEF_ALL_EVENTS"] = "所有事件";
eLang.common_strings["STR_PEF_SENSOR_EVENTS"] = "感應器事件";
eLang.common_strings["STR_PEF_ALERT_ERR"] = "事件觸發器的動作，警報器必須要開啟 ！";
eLang.common_strings["STR_PEF_EVT_TRIG_ERR"] = "無效的事件觸發。";
eLang.common_strings["STR_PEF_EVT1_MASK_ERR"] = "Invalid Event Data 1 AND Mask。";
eLang.common_strings["STR_PEF_EVT1_CMP1_ERR"] = "Invalid Event Data 1 Compare 1。";
eLang.common_strings["STR_PEF_EVT1_CMP2_ERR"] = "Invalid Event Data 1 Compare 2。";
eLang.common_strings["STR_PEF_EVT2_MASK_ERR"] = "Invalid Event Data 2 AND Mask 。";
eLang.common_strings["STR_PEF_EVT2_CMP1_ERR"] = "Invalid Event Data 2 Compare 1。";
eLang.common_strings["STR_PEF_EVT2_CMP2_ERR"] = "Invalid Event Data 2 Compare 2。";
eLang.common_strings["STR_PEF_EVT3_MASK_ERR"] = "Invalid Event Data 3 AND Mask 。";
eLang.common_strings["STR_PEF_EVT3_CMP1_ERR"] = "Invalid Event Data 3 Compare 1。";
eLang.common_strings["STR_PEF_EVT3_CMP2_ERR"] = "Invalid Event Data 3 Compare 2。";

/*Configure PEF -> Alert Policy*/
eLang.common_strings["STR_POLICY_ENTRY"] = "策略項目 #";
eLang.common_strings["STR_POLICY_NO"] = "策略編號";
eLang.common_strings["STR_POLICY_SETTING"] = "策略配置";
eLang.common_strings["STR_POLICY_SET"] = "策略集合";
eLang.common_strings["STR_CHANNEL_NO"] = "Channel 編號";
eLang.common_strings["STR_DEST_SELECT"] = "目的地選擇器";
eLang.common_strings["STR_POLICY_CNT"] = "警報策略配置的數目：";
eLang.common_strings["STR_POLICY_GETVAL"] = "取得所有策略配置的資料時發生一個問題";
eLang.common_strings["STR_POLICY_DELETEVAL"] = "刪除警報策略配置時發生了一個問題";
eLang.common_strings["STR_CONF_POLICY_ERR1"] = "請在警報策略清單中選擇一個項目";
eLang.common_strings["STR_CONF_POLICY_ERR2"] = "沒有警報策略配置在您選定的項目中。";
eLang.common_strings["STR_CONF_POLICY_CONFIRM1"] = "此欄位已有警報策略配置。確定要修改此項目來取代現有的配置？";
eLang.common_strings["STR_CONF_POLICY_CONFIRM2"] = "該欄位是目前為空項目。確定要新增一個新的警報策略？";
eLang.common_strings["STR_CONF_POLICY_DELETE_SUCCESS"] = "警報策略項目已被刪除";

/*Configure PEF -> Add or Modify Alert Policy*/
eLang.common_strings["STR_ADD_ALERT_POLICY"] = "新增警報策略項目";
eLang.common_strings["STR_MODIFY_ALERT_POLICY"] = "修改警報策略項目";
eLang.common_strings["STR_CONF_POLICY_ADD_SUCCESS"] = "已成功新增警報策略項目 ！";
eLang.common_strings["STR_CONF_POLICY_MOD_SUCCESS"] = "已成功修改警報策略項目";
eLang.common_strings["STR_POLICY_SETVAL"] = "設定警報策略配置時發生一個問題";
eLang.common_strings["STR_ALERT_STRING"] = "警報字串";
eLang.common_strings["STR_ALERT_STRING_KEY"] = "警報字串金鑰";
eLang.common_strings["STR_EVENT_SPECIFIC"] = "特定事件";

eLang.common_strings["STR_POLICY_SET_STR_0"] = "總是將警報發送到此目的地";
eLang.common_strings["STR_POLICY_SET_STR_1"] = "如果成功警報上一個目的地，則不要向此目標發送警報。進入此策略集合中下一個欄位。";
eLang.common_strings["STR_POLICY_SET_STR_2"] = "如果成功警報上一個目的地，則不要向此目標發送警報。在此策略集合中不要處理任何一個欄位。";
eLang.common_strings["STR_POLICY_SET_STR_3"] = "如果成功警報上一個目的地，則不要向此目標發送警報。如果此策略集合中的下一個欄位會送到另外一個 Channel，則發送警報。";
eLang.common_strings["STR_POLICY_SET_STR_4"] = "如果成功警報上一個目的地，則不要向此目標發送警報。如果此策略集合中的下一個欄位會送到另外一個目標，則發送警報。";

/*Configure PEF -> LAN Destination*/
eLang.common_strings["STR_LAN_DEST_HEAD1"] = "LAN 目的地";
eLang.common_strings["STR_LAN_DEST_HEAD2"] = "目的地類型";
eLang.common_strings["STR_LAN_DEST_HEAD3"] = "目標位址";
eLang.common_strings["STR_LAN_DEST_CNT"] = "LAN 目的地配置的數目：";
eLang.common_strings["STR_LAN_DEST_GETVAL"] = "取得所有的 LAN 目的地時發生一個問題";
eLang.common_strings["STR_LAN_DEST_DELETEVAL"] = "在刪除 LAN 目的地時發生一個問題";
eLang.common_strings["STR_LAN_DEST_ALERT_FAILURE"] = "發送測試警報時發生一個問題。";
eLang.common_strings["STR_LAN_DEST_ERR1"] = "請在 LAN 目的地清單中選擇一個欄位";
eLang.common_strings["STR_LAN_DEST_ERR2"] = "沒有在您選定的欄位中配置 LAN 目的地。";
eLang.common_strings["STR_LAN_DEST_CONFIRM1"] = "此欄位已有 LAN 目的地配置。確定要修改此欄位來取代現有的配置？";
eLang.common_strings["STR_LAN_DEST_CONFIRM2"] = "該欄位是目前為空欄位。確定要新增一個 LAN 目的地欄位？";
eLang.common_strings["STR_LAN_DEST_DEL_SUCCESS"] = "LAN 目的地欄位已被刪除";
eLang.common_strings["STR_LAN_DEST_ALERT_SUCCESS"] = "一個測試警報已被發送到目的地。請檢查是否有收到此警報，系統並不會檢查警報發送是否成功";

/*Configure PEF -> Add or Modify LAN Destination*/
eLang.common_strings["STR_LAN_DEST_1"] = "新增 LAN 目的地欄位";
eLang.common_strings["STR_LAN_DEST_2"] = "修改 LAN 目的地欄位";
eLang.common_strings["STR_LAN_DEST_SETVAL"] = "設定 LAN 目的地時發生一個問題";
eLang.common_strings["STR_LAN_DEST_SUCCESS_1"] = "已成功新增 LAN 目的地！";
eLang.common_strings["STR_LAN_DEST_SUCCESS_2"] = "已成功修改 LAN 目的地";

eLang.common_strings["STR_DEST_TYPE_0"] = "Snmp Trap";
eLang.common_strings["STR_DEST_TYPE_6"] = "Email Alert";
eLang.common_strings["STR_EMAIL_SUBJECT"] = "主題";
eLang.common_strings["STR_EMAIL_MESSAGE"] = "訊息";
eLang.common_strings["STR_LAN_DEST_ADDR_ERR"] = "不正確目標位址。";
eLang.common_strings["STR_LAN_NO_EMAIL_CONFIRM"] = "此使用者未設定 Email Address。確定要繼續？";
eLang.common_strings["STR_LAN_EMAIL_SUB_ERR"] = "主題欄位不應為空。";
eLang.common_strings["STR_LAN_EMAIL_MSG_ERR"] = "訊息欄位不應為空。";

/*Configure RADIUS*/
eLang.common_strings["STR_CONF_RADIUS_DESC_0"] = "RADIUS 伺服器身份驗證預設關閉，輸入資訊存取RADIUS伺服器來啟動 RADIUS 伺服器身份驗證，按「儲存」可儲存變更。如要設定進階設定，請先開啟 RADIUS伺服器身份認證。";
eLang.common_strings["STR_CONF_RADIUS_DESC_1"] = "目前已啟用 RADIUS 身份驗證。輸入所需的資訊來存取 RADIUS 伺服器，按「儲存」可儲存變更。如要設定進階設定，請按一下進階設定的設定按鈕。";
eLang.common_strings["STR_CONF_RADIUS_SAVE_SUCCESS"] = "已成功設定 RADIUS 配置。";
eLang.common_strings["STR_CONF_RADIUS_PRIV_SAVE_SUCCESS"] = "已成功設定 RADIUS 權限配置。";
eLang.common_strings["STR_CONF_RADIUS_GETVAL"] = "取得 RADIUS 值時發生一個問題";
eLang.common_strings["STR_CONF_RADIUS_SETVAL"] = "設定 RADIUS 值時發生一個問題";
eLang.common_strings["STR_PRIVILEGE_NOACCESS"] = "沒有存取權限";
eLang.common_strings["STR_PRIVILEGE_OEM"] = "OEM 專屬";
eLang.common_strings["STR_PRIVILEGE_OPERATOR"] = "運算子";
eLang.common_strings["STR_PRIVILEGE_USER"] = "使用者";
eLang.common_strings["STR_PRIVILEGE_ADMIN"] = "管理者";
eLang.common_strings["STR_PRIVILEGE_ERR_1"] = "無效的供應商特定字串。";
eLang.common_strings["STR_CONF_RADIUS_TITLE"] = "RADIUS 授權";
eLang.common_strings["STR_CONF_RADIUS_NOT_ENABLED"] = "尚未啟用 RADIUS ，無法進行進階設定";

/*Configure Remote Session*/
eLang.common_strings["STR_CONF_REMOTE_SUPPORT_DESC"] = "此頁用於設定虛擬媒體裝置配置";
eLang.common_strings["STR_CONF_NO_REMOTE_SUPPORT_DESC"] = "目前沒有配置支援啟用";
eLang.common_strings["STR_CONF_RMT_SESS_GETVAL"] = "取得遠端會話配置時發生一個問題";
eLang.common_strings["STR_CONF_RMT_SESS_SETVAL"] = "設定遠端會話資訊時發生一個問題";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_1"] = "更改設定會自動關閉現有的遠端重定向 （KVM 或虛擬媒體）的 Session，確定要繼續？";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_2"] = "所有 KVM 和虛擬媒體 Session 現在可以使用 HTTP/HTTPS ports。安全的KVM 和虛擬媒體 Session會基於 HTTPS 建立。確定要繼續？";
eLang.common_strings["STR_CONF_RMT_SESS_CONFIRM_3"] = "當改變設定後, " + 
						      "只有在非安全 Ports 的情況下,所有的KVM 和 VMedia Sessions 才會變成可用 " +
						      "安全的 KVM 和 VMedia Sessions 可以透過啟用 KVM 或 VMedia 來達成 "+
						      "確定要繼續進行嗎?";
eLang.common_strings["STR_CONF_RMT_SESS_SAVE_SUCCESS"] = "遠端會話設定儲存成功。";
eLang.common_strings["STR_CONF_RMT_SESS_INVALID_RETRY_INTERVAL"] = "無效的重試時間間隔";
eLang.common_strings["STR_CONF_RMT_SESS_VMATTACH_0"] = "Attach";
eLang.common_strings["STR_CONF_RMT_SESS_VMATTACH_1"] = "Auto Attach";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_0"] = "自動檢測 (AD)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_1"] = "丹麥 (DA)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_2"] = "荷蘭 Dutch Belgium (NL-BE)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_3"] = "荷蘭 Dutch Netherlan (NL-NL)";
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_4"] = "英國 UK (GB)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_5"] = "美國 US (US)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_6"] = "芬蘭 (FI)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_7"] = "法國 French Belgium (FR-BE)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_8"] = "法國 French France (FR)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_9"] = "德國 German Germany (DE)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_10"] = "德國 German Switzerland (DE-CH)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_11"] = "義大利 Italian (IT)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_12"] = "日本 (JP)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_13"] = "挪威 (NO)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_14"] = "葡萄牙 (PT)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_15"] = "西班牙 (ES)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_16"] = "瑞典 (SV)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_17"] = "土耳其 Turkish F (TR_F)"; 
eLang.common_strings["STR_CONF_RMT_SESS_KEYLANG_18"] = "土耳其 Turkish Q (TR_Q)";

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
eLang.common_strings["STR_CONF_RMT_SESS_ERR_1"] = "無效的重試計數。";
eLang.common_strings["STR_CONF_RMT_SESS_ERR_2"] = "無效的重試時間間隔。";
eLang.common_strings["STR_RMT_SUPPORT_AUTO_LOCAL_MONITOR"] = "在選擇當 JViewer 啟動時,自動關閉伺服器監視器之前，請先啟用Local Monitor OFF";

/*Configure Services*/
eLang.common_strings["STR_CONF_SERVICES_GETVAL"] = "取得服務配置發生一個問題";
eLang.common_strings["STR_CONF_SERVICES_SETVAL"] = "設定服務配置發生一個問題";
eLang.common_strings["STR_CONF_SERVICES_NAME"] = "服務名稱";
eLang.common_strings["STR_CONF_SERVICES_STATE"] = "目前狀態";
eLang.common_strings["STR_CONF_SERVICES_IFC"] = "介面";
eLang.common_strings["STR_CONF_SERVICES_NSPORT"] = "不安全的埠號";
eLang.common_strings["STR_CONF_SERVICES_SECPORT"] = "安全的埠號";
eLang.common_strings["STR_CONF_SERVICES_TIMEOUT"] = "逾時";
eLang.common_strings["STR_CONF_SERVICES_MAXSESS"] = "最大 Session 數";
eLang.common_strings["STR_CONF_SERVICES_ACTIVESESS"] = "Active Sessions";
eLang.common_strings["STR_CONF_SERVICES_CNT"] = "服務的數目：";
eLang.common_strings["STR_CONF_SERVICES_ERR"] = "請在服務清單中選擇一個欄位";
eLang.common_strings["STR_CONF_SERVICES_MODIFY"] = "修改服務";
eLang.common_strings["STR_CONF_SERVICES_SUCCESS"] = "服務已成功配置";
eLang.common_strings["STR_CONF_SERVICES_SETERR_132"] = "Port 已正在使用";
eLang.common_strings["STR_CONF_SERVICES_SETERR_134"] = "無效的最大 Sessions 值或 Active Sessions";
eLang.common_strings["STR_CONF_SERVICES_CONFIRM"] = "在更改配置時，已經開啟服務的 Sessions 會受到影響，並且重啟服務。按一下 OK 繼續。";
eLang.common_strings["STR_CONF_SERVICES_CNFMWEB"] = "\\nNOTE： 已登入 Session 將會被登出。";
eLang.common_strings["STR_CONF_SERVICES_CNFMSSH"] = "\\nNOTE： 在配置的超時值也應用於 Telnet 服務。";
eLang.common_strings["STR_CONF_SERVICES_CNFMTELNET"] = "\\nNOTE： 在配置的 Timeout 值也應用到 SSH 服務中。";
eLang.common_strings["STR_CONF_SERVICES_CNFM_DIS_INTERFACE"] = "\\nNOTE： 介面目前被禁用，對應到的介面將不會運作。";

/*Session configuration strings*/
eLang.common_strings["STR_SERVICE_SESSION_IP"] = "IP 位址";
eLang.common_strings["STR_SERVICE_SESSION_UID"] = "使用者 ID";
eLang.common_strings["STR_SERVICE_SESSION_UNAME"] = "使用者名稱";
eLang.common_strings["STR_SERVICE_SESSION_ID"] = " Session  ID";
eLang.common_strings["STR_SERVICE_SESSION_STYPE"] = " Session 類型";
eLang.common_strings["STR_SERVICE_SESSION_UPRIV"] = "使用者權限";
eLang.common_strings["STR_SERVICE_SESSION_GETVAL"] = "取得服務資訊時發生一個問題";
eLang.common_strings["STR_SESSION_INFO_TITLE"] = "Active Session";
eLang.common_strings["STR_CONF_SESSION_CONFIRM"] = "選擇的 Session 將被終止。確定要繼續？";
eLang.common_strings["STR_CONF_SESSION_CONFIRM1"] = "你正在刪除目前登入的 web Session。刪除此 Session 會導致 web 登出。確定要繼續?";
eLang.common_strings["STR_CONF_SESSION_SUCCESS"] = "成功中止所選的 Session ";
eLang.common_strings["STR_CONF_SESSION_SETVAL"] = "在中止所選的 Session 時發生一個問題";
eLang.common_strings["STR_CONF_SESSION_ERR"] = "請選擇一個 Session 中止";
eLang.common_strings["STR_NO_SESSION_INFO"] = "沒有任何 Active Session";
eLang.common_strings["STR_CONF_SESSION_CNT"] = " Session 的數目：";
eLang.common_strings["STR_CONF_SESSION_ADMINPRIV"] = "需要具有管理者權限來查看 Session 的資訊。";

/*Configure SMTP*/
eLang.common_strings["STR_CONF_SMTP_GETVAL"] = "取得 SMTP 配置時發生一個問題。";
eLang.common_strings["STR_CONF_SMTP_SETVAL"] = "設定 SMTP 配置時發生一個問題。";
eLang.common_strings["STR_CONF_SMTP_SAVE_SUCCESS"] = "已成功修改 SMTP 伺服器配置。";
eLang.common_strings["STR_CONF_SMTP_SENDERADDR"] = "寄件者位址";
eLang.common_strings["STR_CONF_SMTP_INVALID_MACHINENAME"] = "無效的電腦名稱格式";
eLang.common_strings["STR_CONF_SMTP_PRIMARY"] = "主要 SMTP 伺服器-";
eLang.common_strings["STR_CONF_SMTP_SECONDARY"] = "次要 SMTP 伺服器-";
eLang.common_strings["STR_CONF_SMTP_DIFF_SMTPSRVR"] = "主要 SMTP 伺服器位址應該不同於次要的 SMTP 伺服器位址。";

/*SMTP Error Strings*/
eLang.common_strings["STR_SMTP_FAILURE1"] = "該身份驗證類型 SMTP 伺服器不支援";
eLang.common_strings["STR_SMTP_FAILURE2"] = "SMTP 伺服器身份驗證失敗";
eLang.common_strings["STR_SMTP_FAILURE3"] = "無法連結到 SMTP 伺服器";

/*EMail Error Strings*/
eLang.common_strings["STR_EMAIL_FAILURE1"] = "沒有這位使用者";
eLang.common_strings["STR_EMAIL_FAILURE2"] = "電子郵件 ID 不可由使用者配置";
eLang.common_strings["STR_EMAIL_TESTALERT"] = "無法發送測試警報到配置的電子郵件 ID";
eLang.common_strings["STR_EMAIL_USER_ACCESS"] = "無法發送測試警報，因為使用者存取被停用";
eLang.common_strings["STR_EMAIL_FRGT_PSWD"] = "無法將新產生的密碼發送到配置的電子郵件 ID";

/*Configure SSL*/
eLang.common_strings["STR_CONF_SSL_FILE_GETVAL"] = "取得 SSL 憑證狀態時發生一個問題。";
eLang.common_strings["STR_CONF_SSL_INVALID_CERT1"] = "請選擇一個 SSL 憑證檔案";
eLang.common_strings["STR_CONF_SSL_INVALID_CERT2"] = "SSL 憑證檔案應以 .pem 結尾";
eLang.common_strings["STR_CONF_SSL_INVALID_PRIVKEY1"] = "請選擇一個 SSL 私密金鑰檔案";
eLang.common_strings["STR_CONF_SSL_INVALID_PRIVKEY2"] = "SSL 私密金鑰檔案應該以 .pem 結尾";
eLang.common_strings["STR_CONF_SSL_UPLD_CONFIRM0"] = "上傳新的 SSL 憑證將重新啟動 HTTPs 服務。確定要繼續？";
eLang.common_strings["STR_CONF_SSL_UPLD_CONFIRM1"] = "SSL 憑證已經存在。上傳新的 SSL 憑證將會取代現有的憑證，並將重新啟動 HTTPs 服務。確定要繼續？";
eLang.common_strings["STR_CONF_SSL_SAVE_SUCCESS"] = "成功上傳的憑證和金鑰。";
eLang.common_strings["STR_CONF_SSL_CERT_ERR1"] = "SSL 憑證或金鑰檔案不存在";
eLang.common_strings["STR_CONF_SSL_CERT_ERR2"] = "SSL 憑證以被加密。請上傳尚未加密的憑證。";
eLang.common_strings["STR_CONF_SSL_CERT_ERR3"] = "SSL 憑證驗證失敗。請再次上傳憑證和金鑰。";
eLang.common_strings["STR_CONF_SSL_CERT_ERR4"] = "上傳 SSL 憑證失敗。請再次上傳憑證和金鑰。";
eLang.common_strings["STR_CONF_SSL_CERT_ERR5"] = "SSL 憑證或金鑰檔案超過大小";
eLang.common_strings["STR_CONF_SSL_CERT_ERR128"] = "SSL 憑證已經過期。請上傳有效的憑證。Note： 請在 NTP 配置功能選單中確認 BMC 的目前時間。";
eLang.common_strings["STR_CONF_SSL_CERT_ERR129"] = "不受信任的 SSL 憑證。請上傳受到信任的憑證。";
eLang.common_strings["STR_CONF_SSL_VALIDATE_ERR"] = "驗證 SSL 憑證和金鑰時發生一個問題";
eLang.common_strings["STR_CONF_SSLCERTUPLOAD_ABORT"] = "通過 Navigator 轉到其他頁面將導致 SSL 上傳過程被中止。確定要繼續？";
eLang.common_strings["STR_CONF_SSLCERTUPLOAD_ALERT"] = "關閉 web Session 將導致 SSL 上傳過程中止 ！";
eLang.common_strings["STR_CONF_SSL_GNRT_CERT"] = "產生 SSL 憑證時發生一個問題。";
eLang.common_strings["STR_CONF_SSL_GNRT_CONFIRM"] = "產生新的 SSL 憑證將重新啟動 HTTPs 服務。確定要繼續？";
eLang.common_strings["STR_CONF_SSL_COMMON_NAME_ERR"] = "通用名稱不正確。";
eLang.common_strings["STR_CONF_SSL_ORGANIZATION_ERR"] = "組織名稱不正確。";
eLang.common_strings["STR_CONF_SSL_ORG_UNIT_ERR"] = "組織或單位名稱不正確。";
eLang.common_strings["STR_CONF_SSL_CITY_ERR"] = "城市或地點不正確。";
eLang.common_strings["STR_CONF_SSL_STATE_ERR"] = "省或州的名稱不正確。";
eLang.common_strings["STR_CONF_SSL_COUNTRY_ERR"] = "國家名稱不正確。";
eLang.common_strings["STR_CONF_SSL_VALID_FOR_ERR"] = "無效的有效天數。";
eLang.common_strings["STR_CONF_SSL_GNRT_SUCCESS"] = "已成功產生 SSL 憑證。";
eLang.common_strings["STR_CONF_SSL_VIEW_CERT"] = "查看 SSL 憑證時發生一個問題。";

/* Configure Service License */
eLang.common_strings["STR_LICENSE_CFG_FEATURE_NAME"] = "功能名稱";
eLang.common_strings["STR_LICENSE_CFG_FEATURE_VALIDITY"] = "有效性";
eLang.common_strings["STR_LICENSE_CFG_GETVAL"] = "取得授權資訊時發生一個問題";
eLang.common_strings["STR_LICENSE_CFG_CNT"] = "已授權的功能數目：";
eLang.common_strings["STR_LICENSE_CFG_SETVAL"] = "設定授權金鑰資訊時發生一個問題";
eLang.common_strings["STR_LICENSE_CFG_INVALID_KEY"] = "無效的授權金鑰。";
eLang.common_strings["STR_LICENSE_CFG_SUCCESS"] = "授權金鑰上傳成功";
eLang.common_strings["STR_LICENSE_CFG_KEY"] = "授權金鑰";
eLang.common_strings["STR_LICENSE_CFG_ADV_TITLE"] = "上傳授權金鑰";
eLang.common_strings["STR_LICENSE_CFG_NO_LICENSE"] = "沒有授權";
eLang.common_strings["STR_LICENSE_CFG_LIFETIME"] = "授權期間";
eLang.common_strings["STR_LICENSE_CFG_DAYS"] = "天";
eLang.common_strings["STR_LICENSE_CONFIRM_UPDATE"] = "此操作可能會更改 web 介面的功能。為了使更改生效，目前的 Session 將會被登出。更改設定後將會自動關閉目前的遠端重定向 （KVM 或虛擬媒體）的  Sessions 。確定要繼續？";

/*Configure System and Audit Log*/
eLang.common_strings["STR_CONF_SYS_AUDIT_GETVAL"] = "取得審核和系統日誌值時發生一個問題";
eLang.common_strings["STR_CONF_SYS_AUDIT_SETVAL"] = "配置審核和系統日誌中的值時發生一個問題";
eLang.common_strings["STR_CONF_SYS_AUDIT_SAVE_SUCCESS"] = "已成功設定系統和稽核記錄的配置。";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_FILESIZE"] = "不正確的檔案大小。";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_ROTATECNT"] = "無效的 Rotate Count 數目。";
eLang.common_strings["STR_CONF_SYS_AUDIT_INVALID_LOGTYPE"] = "無效的日誌類型。選擇任何一種日誌類型";

/*Configure Users*/
eLang.common_strings["STR_CONF_USER_ID"] = "使用者 Id";
eLang.common_strings["STR_CONF_USER_NAME"] = "使用者名稱";
eLang.common_strings["STR_CONF_USER_PWORDSIZE"] = "密碼長度";
eLang.common_strings["STR_CONF_USER_CNFMPWORD"] = "確認密碼";
eLang.common_strings["STR_CONF_USER_ACCESS"] = "使用者存取權限";
eLang.common_strings["STR_CONF_USER_EMAIL"] = "電子郵件 ID";
eLang.common_strings["STR_CONF_USER_EMAIL_FORMAT"] = "電子郵件格式";
eLang.common_strings["STR_CONF_USER_NWPRIV"] = "Network 權限";
eLang.common_strings["STR_CONF_USER_SRLPRIV"] = "Serial 權限";
eLang.common_strings["STR_CONF_USER_UPLOADSSH"] = "已上傳 SSH 金鑰";
eLang.common_strings["STR_CONF_USER_NEWSSH"] = "新的 SSH 金鑰";
eLang.common_strings["STR_ADD_USER"] = "新增使用者";
eLang.common_strings["STR_MODIFY_USER"] = "修改使用者";

eLang.common_strings["STR_CONF_USER_CNT"] = "已配置的使用者數目:";
eLang.common_strings["STR_CONF_USER_GETINFO"] = "取得所有使用者資訊時發生一個問題";
eLang.common_strings["STR_CONF_USER_SETINFO"] = "配置使用者時的問題。";
eLang.common_strings["STR_CONF_USER_DELINFO"] = "刪除使用者資訊時發生一個問題";
eLang.common_strings["STR_CONF_EMAILFORMAT_GETINFO"] = "取得所有電子郵件的格式資訊時發生一個問題";
eLang.common_strings["STR_CONF_USER_CONFIRM1"] = "此使用者欄位已配置。確定是否要修改並替換掉此使用者欄位？";
eLang.common_strings["STR_CONF_USER_CONFIRM2"] = "欄位目前為空。是否新增一個使用者？";
eLang.common_strings["STR_CONF_USER_ERR1"] = "請在使用者清單中選擇一個使用者";
eLang.common_strings["STR_CONF_USER_ERR3"] = "在選定的欄位中沒有已配置的使用者。";
eLang.common_strings["STR_CONF_USER_ERR4"] = "此使用者名稱是目前登入的使用者，無法刪除。";
eLang.common_strings["STR_CONF_USER_ERR5"] = "使用者名稱已存在，請嘗試其他的使用者名稱";
eLang.common_strings["STR_CONF_USER_ERR6"] = "電子郵件 ID 已存在，配置不同的電子郵件 ID";
eLang.common_strings["STR_CONF_USER_ERR7"] = "保留的使用者名稱，請嘗試其他的使用者名稱";
eLang.common_strings["STR_CONF_USER_DELETE_SUCCESS"] = "使用者已被刪除";
eLang.common_strings["STR_CONF_USER_SUCCESS0"] = "使用者已成功新增了 ！";
eLang.common_strings["STR_CONF_USER_SUCCESS1"] = "已成功修改使用者";
eLang.common_strings["STR_CONF_SSH_VALIDATE_ERR"] = "驗證SSH 金鑰失敗。請再次上傳金鑰。";
eLang.common_strings["STR_CONF_SSH_ERR1"] = "SSH 金鑰檔案不存在。";
eLang.common_strings["STR_CONF_SSH_ERR4"] = "上傳 SSL 金鑰失敗。請再次上傳金鑰。";
eLang.common_strings["STR_CONF_SSH_ERR5"] = "SSH 金鑰檔案大小超過限制。";

/*Configure Users-SNMP*/
eLang.common_strings["STR_CONF_SNMP_STATUS"] = "SNMP 狀態";
eLang.common_strings["STR_CONF_SNMP_ACCESS"] = "SNMP 存取權限";
eLang.common_strings["STR_CONF_SNMP_AUTHPROT"] = "身份驗證協定";
eLang.common_strings["STR_CONF_SNMP_PRIVPROT"] = "私密協定";

eLang.common_strings["STR_CONF_SNMP_GETVAL"] = "取得 SNMP 配置時發生一個問題";
eLang.common_strings["STR_CONF_SNMP_SETVAL"] = "配置 SNMP 資訊時發生一個問題";
eLang.common_strings["STR_READ_ONLY"] = "唯讀";
eLang.common_strings["STR_READ_WRITE"] = "讀寫";
eLang.common_strings["STR_CONF_SNMP_INVALID_COMM_STR"] = "無效的 Community 字串";
eLang.common_strings["STR_CONF_SNMP_INVALID_USER_ACCOUNT"] = "無效的使用者帳戶";
eLang.common_strings["STR_CONF_SNMP_INVALID_AUTH_PASS"] = "無效的身份驗證 Passphrase";
eLang.common_strings["STR_CONF_SNMP_INVALID_PRIV_PASS"] = "無效的私密 Passphrase";
eLang.common_strings["STR_CONF_SNMP_SAVE_SUCCESS"] = "SNMP 配置已成功儲存。";

/*Configure Virtual Media Devices*/
eLang.common_strings["STR_CONF_VMEDIA_GETVAL"] = "取得虛擬媒體設備配置時發生一個問題";
eLang.common_strings["STR_CONF_VMEDIA_SETVAL"] = "設定虛擬媒體設備配置發生一個問題";
eLang.common_strings["STR_CONF_VMEDIA_CONFIRM"] = "更改虛擬媒體配置將會關閉目前存在的虛擬媒體重定向 Session 並重新啟動。按一下確定繼續。";
eLang.common_strings["STR_CONF_VMEDIA_SAVE_SUCCESS"] = "虛擬媒體裝置配置已成功儲存設定。";
eLang.common_strings["STR_CONF_KVM_VMEDIA_SETVAL"] = "遠端 KVM 裝置數目應小於或等於虛擬裝置數目";
eLang.common_strings["STR_CONF_KVM_VMEDIA_IN_PROGRESS"] = "正在進行虛擬媒體重定位，請於一段時間後再次重試。";

/*Configure Firewall*/
eLang.common_strings["STR_CONF_FWALL_BLOCK_ALL"] = "全部封鎖";
eLang.common_strings["STR_CONF_FWALL_ALLOW_ALL"] = "全部允許";
eLang.common_strings["STR_CONF_FWALL_FLUSH_ALL"] = "全部清除";
eLang.common_strings["STR_CONF_FWALL_ADV_TITLE"] = "進階防火牆設定";
eLang.common_strings["STR_CONF_FWALL_ALLOW"] = "允許";
eLang.common_strings["STR_CONF_FWALL_BLOCK"] = "封鎖";
eLang.common_strings["STR_CONF_FWALL_SAVE_SUCCESS"] = "已成功設定防火牆配置。";
eLang.common_strings["STR_CONF_FWALL_GETVAL"] = "取得防火牆配置時發生一個問題";
eLang.common_strings["STR_CONF_FWALL_SETVAL"] = "設定防火牆配置時發生一個問題";
eLang.common_strings["STR_CONF_FWALL_SAVE_FLUSH_RESULT_1"] = "已成功更新 Iptables";
eLang.common_strings["STR_CONF_FWALL_SAVE_RESULT_1"] = "已成功新增防火牆設定";
eLang.common_strings["STR_CONF_FWALL_SAVE_RESULT_3"] = "防火牆設定已成功刪除";
eLang.common_strings["STR_FWALL_SETTING"] = "設定";
eLang.common_strings["STR_CONF_SETTINGS_CNT"] = "已設定的配置規則數量：";
eLang.common_strings["STR_CONF_FWALL_TIMEOUT"] = "逾時";
eLang.common_strings["STR_CONF_FWALL_START_TIME"] = "開始時間";
eLang.common_strings["STR_CONF_FWALL_END_TIME"] = "結束時間";
eLang.common_strings["STR_CONF_FWALL_TIME_FORMAT"] = "[dd-mm-yy:hh-mm]";
eLang.common_strings["STR_CONF_FWALL_TIME_ERROR_1"] = "開始時間年份不應大於結束時間年份";
eLang.common_strings["STR_CONF_FWALL_TIME_ERROR_2"] = "結束時間應大於開始時間";
eLang.common_strings["STR_FWALL_SETTINGS_ERR1"] = "在設定規則清單中選擇一個欄位";
eLang.common_strings["STR_FWALL_BLOCKALL_1"] = "此設定將阻檔所有來自 BMC 的 IPv4 傳輸的方式。確定要繼續嗎。";
eLang.common_strings["STR_FWALL_BLOCKALL_2"] = "此設定將阻檔所有來自 BMC 的 IPv6 傳輸的方式。確定要繼續嗎。";
eLang.common_strings["STR_FWALL_BLOCKALL_3"] = "此設定將阻檔所有來自 BMC 的 IPv4 和 IPv6 傳輸的方式。確定要繼續嗎。";
eLang.common_strings["STR_FWALL_FLUSHALL"] = "此設定將會刪除所有配置的防火牆 iptables 規則。確定要繼續嗎。";
eLang.common_strings["STR_FWALL_TIMEOUT"] = "此設定將會禁止在特定的時間訪問 BMC 。確定要繼續嗎。";

/*Configure Firewall - IP Rule*/
eLang.common_strings["STR_FWALL_IP_SETTING"] = "IP 設定";
eLang.common_strings["STR_FWALL_IP_RANGE"] = "IP/IP 範圍";
eLang.common_strings["STR_FWALL_IP_CNT"] = "已配置的 IP 規則數目：";
eLang.common_strings["STR_FWALL_IP_RULE_RESULT_1"] = "成功新增防火牆的 IP 規則";
eLang.common_strings["STR_FWALL_IP_RULE_RESULT_3"] = "成功刪除防火牆的 IP 規則";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_1"] = "IP 位址欄位不應為空欄位";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_2"] = "無效的 IP 位址";
eLang.common_strings["STR_CONF_FWALL_INVALID_IP_3"] = "第一個欄位不應為空欄位";
eLang.common_strings["STR_FWALL_IP_ERR1"] = "請在 IP 規則清單中選擇一個欄位";
eLang.common_strings["STR_FWALL_ADD_IPRULE"] = "新增 IP 規則";
eLang.common_strings["STR_FWALL_IP_GETVAL"] = "取得 IP 規則配置時發生一個問題";
eLang.common_strings["STR_FWALL_IP_ERR_1"] = "新增 IP 規則時發生一個問題";
eLang.common_strings["STR_FWALL_IP_ERR_3"] = "刪除 IP 規則時發生一個問題";

/*Configure Firewall - Port Rule*/
eLang.common_strings["STR_FWALL_PORT_GETVAL"] = "取得 Port 規則配置時發生一個問題";
eLang.common_strings["STR_FWALL_PORT_SETTING"] = "Port 設定";
eLang.common_strings["STR_FWALL_PORT_RANGE"] = "Port/Port 範圍";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL"] = "協定";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL_0"] = "TCP";
eLang.common_strings["STR_FWALL_PORT_PROTOCOL_1"] = "UDP";
eLang.common_strings["STR_FWALL_PORT_RULE_RESULT_1"] = "成功新增防火牆 Port 規則";
eLang.common_strings["STR_FWALL_PORT_RULE_RESULT_3"] = "成功刪除防火牆 Port 規則";
eLang.common_strings["STR_FWALL_PORT_CNT"] = "已配置 Port 規則數目：";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_1"] = "Port 欄位不應為空";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_2"] = "無效的 Port";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_3"] = "第一個欄位不應為空欄位";
eLang.common_strings["STR_CONF_FWALL_INVALID_PORT_4"] = "Port 範圍無效";
eLang.common_strings["STR_FWALL_PORT_ERR1"] = "請在 Port 規則清單中選擇一個欄位";
eLang.common_strings["STR_FWALL_ADD_PORTRULE"] = "為 Port 新增新規則";
eLang.common_strings["STR_FWALL_PORT_SAVE_ERR_1"] = "新增 Port 規則時發生一個問題";
eLang.common_strings["STR_FWALL_PORT_SAVE_ERR_3"] = "刪除 Port 規則時發生一個問題";
eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE"] = "網路類型"; 
eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE_0"] = "IPv4"; 
eLang.common_strings["STR_FWALL_PORT_NETWORKTYPE_1"] = "IPv6";

/*Event Log*/
eLang.common_strings["STR_EVENT_LOG_CNT"] = "事件日誌中：";
eLang.common_strings["STR_EVENT_LOG_ENTRIES"] = "事件欄位";
eLang.common_strings["STR_EVENT_LOG_PAGES"] = "頁";
eLang.common_strings["STR_EVENT_LOG_HEAD1"] = "事件 ID";
eLang.common_strings["STR_EVENT_LOG_HEAD2"] = "時間戳記";
eLang.common_strings["STR_EVENT_LOG_HEAD3"] = "感測器名稱";
eLang.common_strings["STR_EVENT_LOG_HEAD4"] = "感測器類型";
eLang.common_strings["STR_EVENT_LOG_HEAD5"] = "敘述";
eLang.common_strings["STR_EVENT_LOG_TYPE0"] = "所有事件";
eLang.common_strings["STR_EVENT_LOG_TYPE1"] = "系統事件記錄";
eLang.common_strings["STR_EVENT_LOG_TYPE2"] = "OEM 事件記錄";
eLang.common_strings["STR_EVENT_LOG_TYPE3"] = "BIOS 產生的事件";
eLang.common_strings["STR_EVENT_LOG_TYPE4"] = "SMI 處理器的事件";
eLang.common_strings["STR_EVENT_LOG_TYPE5"] = "系統管理軟體事件";
eLang.common_strings["STR_EVENT_LOG_TYPE6"] = "系統軟體-OEM 事件";
eLang.common_strings["STR_EVENT_LOG_TYPE7"] = "遠端主控台軟體事件";
eLang.common_strings["STR_EVENT_LOG_TYPE8"] = "終端機模式遠端主控台軟體事件";
eLang.common_strings["STR_EVENT_LOG_CLEAR_SUCCESS"] = "SEL 已被清除";
eLang.common_strings["STR_EVENT_LOG_CLEAR_CONFIRM"] = "將清除日誌中的所有事件。確定要繼續請按一下 OK？";
eLang.common_strings["STR_EVENT_LOG_GETVAL"] = "取得事件日誌時發生一個問題";
eLang.common_strings["STR_EVENT_LOG_CLEARLOG"] = "清除事件日誌時發生了一個問題";
eLang.common_strings["STR_EVENT_LOG_ASSERT"] = "Asserted";
eLang.common_strings["STR_EVENT_LOG_DEASSERT"] = "Asserted";
eLang.common_strings["STR_UTC_OFFSET"] = "UTC 偏移值：";
eLang.common_strings["STR_GMT"] = "（格林威治標準時間";
eLang.common_strings["STR_PRE_INIT_TIMESTAMP"] = "預初始化的時間戳記";
eLang.common_strings["STR_SOFTWARE_ID"] = "系統軟體 ID";
eLang.common_strings["STR_EVENT_LOG_SAVEEVENTS_ERROR"] = "創建 SEL 日誌檔失敗。";

/*Web Alerts*/
eLang.common_strings["STR_WEB_ALERT_TITLE"] = "最近的事件";
eLang.common_strings["STR_WEB_ALERT_DESC"] = "最近由系統記錄的日誌在最新的事件欄位中。";
eLang.common_strings["STR_WEB_ALERT_LOG_TITLE"] = "日誌報告：";
eLang.common_strings["STR_WEB_ALERT_SEL_VIEW"] = "查看所有事件日誌";

/*Sensor Monitoring*/
eLang.common_strings["STR_SENSOR_GETVAL"] = "取得感應器值時發生一個問題";
eLang.common_strings["STR_SENSOR_CNT"] = "感測器總數:";
eLang.common_strings["STR_SENSOR_SENSORS"] = "感應器";
eLang.common_strings["STR_SENSOR_LNR_ERR"] = "Lower Non-Recoverable(LNR) 值不能大於Lower Critical(LC)";
eLang.common_strings["STR_SENSOR_LC_ERR"] = "Lower Critical(LC) 值不能大於 Lower Non-Cricical(LNC)";
eLang.common_strings["STR_SENSOR_LNC_ERR"] = "Lower Non-Critical(LNC) 值不能大於 Upper Non-Cricical(UNC)";
eLang.common_strings["STR_SENSOR_UNC_ERR"] = "Upper Non-Critical(UNC) 的上限值不能大於 Upper Cricical(UC)";
eLang.common_strings["STR_SENSOR_UC_ERR"] = "Upper Critical(UC) 的上限值不能大於 Upper Non-Cricical(UNC)";
eLang.common_strings["STR_SENSOR_SET_ERR"] = "設定感應器閾值時發生一個問題";
eLang.common_strings["STR_SENSOR_SET_SUCCESS"] = "已成功設定感應器閾值配置";
eLang.common_strings["STR_SENSOR_SET_INVALID_RANGE"] = "無效的感應器閾值";
eLang.common_strings["STR_SENSOR_THRESHOLD_SETTINGSSET_CONFIRM"] = "所有在文字方塊中的資料都將轉換成 IPMI 資料類型，確定要進行？";

/*Sensor Widgets Strings*/
eLang.common_strings["STR_WIDGET_MAX_COUNT"] = "已達到最大 Widget 限制。請關閉任何 Widge 來繼續。";
eLang.common_strings["STR_WIDGET_MAXIMIZE_SIZE"] = "到達最大 Widget 限制。請關閉任何 Widget 或 最大化 Widget 來最佳化瀏覽器的顯示區域。";

/*System and Audit Log*/
eLang.common_strings["STR_LOG_LEVEL_TYPE1"] = "警報 (Alert)";
eLang.common_strings["STR_LOG_LEVEL_TYPE2"] = "關鍵 (Critical)";
eLang.common_strings["STR_LOG_LEVEL_TYPE3"] = "錯誤 (Error)";
eLang.common_strings["STR_LOG_LEVEL_TYPE4"] = "通知 (Notification)";
eLang.common_strings["STR_LOG_LEVEL_TYPE5"] = "警告 (Warning)";
eLang.common_strings["STR_LOG_LEVEL_TYPE6"] = "偵錯 (Debug)";
eLang.common_strings["STR_LOG_LEVEL_TYPE7"] = "緊急 (Emergency)";
eLang.common_strings["STR_LOG_LEVEL_TYPE8"] = "資訊 (Information)";
eLang.common_strings["STR_SYSTEM_EVENT_GETINFO"] = "取得系統事件時發生一個問題";
eLang.common_strings["STR_LOG_EVENT_ID"] = "事件 ID";
eLang.common_strings["STR_LOG_TIMESTAMP"] = "時間戳記";
eLang.common_strings["STR_LOG_HOSTNAME"] = "主機名稱";
eLang.common_strings["STR_LOG_DESCRIPTION"] = "敘述";
eLang.common_strings["STR_SYSTEM_LOG_CNT"] = "此篩選器:";

/*BSOD Screen*/
eLang.common_strings["STR_BSOD_NOT_AVAIL"] = "沒有可用的藍屏畫面。";
eLang.common_strings["STR_ADVISER_GETVAL"] = "取得 Adviser 配置時發生問題。";

/* Tooltip Strings */
eLang.common_strings["STR_REFRESH_TOOLTIP"] = "重新載入目前頁面";
eLang.common_strings["STR_PRINT_TOOLTIP"] = "列印目前頁面";
eLang.common_strings["STR_LOGOUT_TOOLTIP"] = "登出";
eLang.common_strings["STR_HELP_TOOLTIP"] = "説明按鈕允許顯示該説明資訊。如果左側已開啟，它將自動對應成正在查看 UI 頁面的內容或是可以在對應的區域按一下來查詢問題。";
eLang.common_strings["STR_USER_TOOLTIP"] = "目前登入使用者的權限和名稱";

/*JAVA SOL*/
eLang.common_strings["STR_JAVA_SOL"] = "JAVA SOL";

/*Console Redirection*/
eLang.common_strings["STR_CONSOLE_JAVA"] = "JAVA 主控台";
eLang.common_strings["STR_CONSOLE_ACTIVEX"] = "ActiveX 主控台";
eLang.common_strings["STR_CONSOLE_ACTIVEX_GETVAL"] = "取得 ActiveX 配置時發生一個問題";
eLang.common_strings["STR_ACTIVEX_GETTOKEN_FAILURE"] = "Session token 產生失敗。可能達到最大的 Session 數量。請關閉其他的 Session，然後重試。";
eLang.common_strings["STR_ACTIVEX_ADVISER_GETVAL"] = "取得 Adviser 配置 ActiveX 主控台時發生一個問題";
eLang.common_strings["STR_ACTIVEX_VMEDIA_GETVAL"] = "取得虛擬媒體配置 ActiveX 主控台時發生一個問題";
eLang.common_strings["STR_ACTIVEX_FAILURE"] = "無法 invoke ActiveX 物件";

/*Server Power Control*/
eLang.common_strings["STR_SERVER_RETRYING"] = "正在重試......，請稍候。重試次數如左:";
eLang.common_strings["STR_SERVER_ERR1"] = "執行非強制關機失敗。可能是主機作業系統執行非強制關機時間過長。";
eLang.common_strings["STR_SERVER_ERR2"] = "執行電源操作失敗。";
eLang.common_strings["STR_SERVER_HOSTOFF"] = "主機目前為關機狀態";
eLang.common_strings["STR_SERVER_HOSTON"] = "主機目前執行中";
eLang.common_strings["STR_SERVER_GETSTATUS"] = "取得主機的目前狀態時發生一個問題";
eLang.common_strings["STR_SERVER_SETACTION"] = "設定對應的電源操作發生一個問題";
eLang.common_strings["STR_SERVER_STATE_NOTAVAIL"] = "目前狀態不可用";
eLang.common_strings["STR_SERVER_POWER_ACTION_WAIT"] = "執行電源操作。請稍候";
eLang.common_strings["STR_SERVER_EXTERNAL_BMC"] = "外部 BMC 的電源操作配置。";
eLang.common_strings["STR_SERVER_FEATURE_CABLE"] = "The feature connector cables.";

/*Configure Triggers*/
eLang.common_strings["STR_CONF_TRIG_GETVAL"] = "取得事件觸發器配置時發生一個問題";
eLang.common_strings["STR_CONF_TRIG_SETVAL"] = "設定事件觸發器配置時發生一個問題";
eLang.common_strings["STR_CONF_TRIG_EVT0"] = "溫度 — 電壓臨界事件";
eLang.common_strings["STR_CONF_TRIG_EVT1"] = "溫度 — 電壓非臨界事件";
eLang.common_strings["STR_CONF_TRIG_EVT2"] = "溫度 — 電壓不可回復事件";
eLang.common_strings["STR_CONF_TRIG_EVT3"] = "風扇狀態改變事件";
eLang.common_strings["STR_CONF_TRIG_EVT4"] = "Watch Dog 計時器事件";
eLang.common_strings["STR_CONF_TRIG_EVT5"] = "Chasis Power On 事件";
eLang.common_strings["STR_CONF_TRIG_EVT6"] = "Chasis Power Off 事件";
eLang.common_strings["STR_CONF_TRIG_EVT7"] = "Chasis 重置事件";
eLang.common_strings["STR_CONF_TRIG_EVT8"] = "特定的日期和時間事件";
eLang.common_strings["STR_CONF_TRIG_EVT9"] = "LPC 重置事件";
eLang.common_strings["STR_CONF_TRIG_EVT10"] = "Pre-Event 影像錄影";
eLang.common_strings["STR_CONF_TRIG_EVT_ERR8"] = "已運行時間";
eLang.common_strings["STR_CONF_TRIG_EVT_ERR9"] = "日期和時間設定應在系統日期和時間進階設定中。請確認系統日期和時間。";
eLang.common_strings["STR_CONF_TRIG_SUCCESS"] = "事件觸發器已成功配置。";
eLang.common_strings["STR_CONF_TRIG_KVMDISABLE"] = "\\nNOTE： 應啟用 KVM 服務來執行自動錄影。";
eLang.common_strings["STR_CONF_TRIG_YEAR2038"] = "\\nNOTE： 如果2038 年問題依然存在，可接受的最晚日期範圍為 2038/1/18。";
eLang.common_strings["STR_CONF_SOL_TRIG_GETVAL"] = "取得 SOL 事件觸發器配置時發生一個問題。"; 
eLang.common_strings["STR_CONF_SOL_TRIG_SETVAL"] = "設定 SOL 事件觸發器配置時發生一個問題,"; 
eLang.common_strings["STR_CONF_SOL_TRIG_SUCCESS"] = "SOL 事件觸發器配置成功。";


/*Recorded Video*/
eLang.common_strings["STR_VIDEO_RCRD_FILENAME"] = "檔案名稱";
eLang.common_strings["STR_VIDEO_RCRD_VIDEOTYPE"] = "影像類型";
eLang.common_strings["STR_VIDEO_RCRD_FILEINFO"] = "影像檔案資訊";
eLang.common_strings["STR_VIDEO_RCRD_PRE_EVENT"] = "Pre-Event";
eLang.common_strings["STR_VIDEO_RCRD_POST_EVENT"] = "Post-Event";
eLang.common_strings["STR_VIDEO_RCRD_GETVAL"] = "取得影像檔資訊時發生一個問題";
eLang.common_strings["STR_VIDEO_RCRD_DELVAL"] = "刪除影像檔資訊時發生一個問題";
eLang.common_strings["STR_VIDEO_RCRD_FILE_CNT"] = "可用的影像檔的數量:";
eLang.common_strings["STR_VIDEO_RCRD_CNT_ZERO"] = "沒有影像檔";
eLang.common_strings["STR_VIDEO_RCRD_FILESEL_ERR"] = "選擇一個影像檔欄位";
eLang.common_strings["STR_VIDEO_RCRD_DEL_SUCCESS"] = "影像檔被成功刪除。";
eLang.common_strings["STR_VIDEO_CFG_ENABLE"] = "遠端視訊支援";
eLang.common_strings["STR_VIDEO_CFG_ADV_TITLE"] = "進階遠端視訊設定";
eLang.common_strings["STR_VIDEO_CFG_SETVAL"] = "設定影像配置時發生一個問題";
eLang.common_strings["STR_VIDEO_CFG_GETVAL"] = "取得影像配置時發生一個問題";
eLang.common_strings["STR_VIDEO_CFG_SUCCESS"] = "遠端視訊配置已成功儲存。 設定會在下一次的影像錄影中反應。";
eLang.common_strings["STR_SOL_VIDEO_CFG_SUCCESS"] = "SOL 遠端視訊配置以成功儲存。設定會在下一次的影像錄影中反應。";
eLang.common_strings["STR_VIDEO_CFG_MOUNT_ERROR"] = "在掛載遠端共用時發生臨時錯誤 ！";
eLang.common_strings["STR_VIDEO_CFG_MOUNT_STATUS_ERROR"] = "掛載設定" + "會在下一次的影像錄影中反應";
eLang.common_strings["STR_VIDEO_CFG_CONFIRM"] = "更改遠端視訊配置需要關閉所有執行中的虛擬媒體重定向和 KVM  Session 。按一下確定後繼續。";
eLang.common_strings["STR_VIDEO_CFG_DESC_0"] = "目前已禁用遠端視訊分享。要啟用遠端視訊分享，並配置其設定。按一下進階設定按鈕。";
eLang.common_strings["STR_VIDEO_CFG_DESC_1"] = "按一下進階設定按鈕，配置遠端視訊共用設定。";
eLang.common_strings["STR_VIDEO_CFG_ERR_1"] = "檔案正在處理中，不能刪除此檔案。請稍後嘗試。";
eLang.common_strings["STR_VIDEO_CFG_ERR_2"] = "在給定的路徑中沒有可用的檔案。";
eLang.common_strings["STR_VIDEO_CFG_ERR_3"] = "臨時掛載遠端分享時發生問題。";

eLang.common_strings["STR_SOL_LOG_SIZE"] = "日誌大小 (KB)"; 
eLang.common_strings["STR_SOL_NO_OF_LOGS"] = "日誌檔數目"; 
eLang.common_strings["STR_VIDEO_CFG_SOL_ADV_TITLE"] = "進階 SOL 遠端視訊設定"; 
eLang.common_strings["STR_INVALID_LOG_COUNT"] = "無效的日誌數目。"; 
eLang.common_strings["STR_INVALID_LOG_SIZE"] = "無效的日誌大小。";

/*Pre-Event video recording*/
eLang.common_strings["STR_PRE_EVENT_DESC_1"] = eLang.common_strings["STR_PRE_EVENT_DESC_2"] =
           "此頁被用來設定 Pre-Event 影像錄影配置。";
eLang.common_strings["STR_PRE_EVENT_DESC_0"] = eLang.common_strings['STR_PRE_EVENT_DESC_1'] +
        "Pre-Event video recording is currently disabled. To enable the Pre-" +
        "Event video recording in <a href='configure_video_sol_recordings.html'><b>Triggers " +
        "Configuration</b></a> page and trigger the video."
eLang.common_strings["STR_PRE_EVENT_QUALITY_0"] = "非常低 (Very Low)";
eLang.common_strings["STR_PRE_EVENT_QUALITY_1"] = "低 (Low)";
eLang.common_strings["STR_PRE_EVENT_QUALITY_2"] = "平均水準 (Average)";
eLang.common_strings["STR_PRE_EVENT_QUALITY_3"] = "正常 (Normal)";
eLang.common_strings["STR_PRE_EVENT_QUALITY_4"] = "高 (High)";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_0"] = "高 (High)";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_1"] = "正常 (Normal)";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_2"] = "低 (Low)";
eLang.common_strings["STR_PRE_EVENT_COMPRESSION_3"] = "無 (No)";
eLang.common_strings["STR_PRE_EVENT_GETVAL"] = "取得 Pre-Event 影像錄影配置時發生一個問題。";
eLang.common_strings["STR_PRE_EVENT_SETVAL"] = "設定 Pre-Event 影像錄影配置時發生一個問題。";
eLang.common_strings["STR_PRE_EVENT_SUCCESS"] = "Pre-Event 影像錄影配置已成功儲存。";

/*Firmware Update*/
eLang.common_strings["STR_FW_UPDATE_CONFIRM0"] = "選擇不保留任何配置並在韌體更新完畢後需要重啟 BMC。";
eLang.common_strings["STR_FW_UPDATE_CONFIRM1"] = "你將不能執行任何其他任務，直到韌體更新完成之前。如果你確定要進入更新模式，請按一下 OK。";
eLang.common_strings["STR_FW_UPDATE_CONFIRM2"] = "你確定要中止韌體更新？";
eLang.common_strings["STR_FW_UPDATE_CONFIRM3"] = "新韌體映象檔的大小與現在韌體映象檔的大小不相同。這種情況下不會保留 \'配置\'。";
eLang.common_strings["STR_FW_UPDATE_CONFIRM4"] = "按一下 OK 將開始韌體更新，會將新的韌體映象檔寫到儲存的位置中。重要的是一旦開始更新操作就不能中斷。確定要繼續？";
eLang.common_strings["STR_FW_UPDATE_CONFIRM5"] = "覆寫檔案時發生錯誤，按下 OK 後會開始不藉由覆寫檔案來進行韌體更新操作，會將新的韌體映象檔寫入到儲存的位置中。重要的是一旦開始更新操作就不能中斷。確定要繼續？";
eLang.common_strings["STR_FW_UPDATE_CONFIRM6"] = "現有的韌體與上傳的韌體在版本、 大小和模組位置皆相同。選擇 Version Compare Flash 將重新啟動 BMC。確定要繼續？";
eLang.common_strings["STR_FW_UPDATE_ERR1"] = "請輸入一個有效的映象檔";
eLang.common_strings["STR_FW_UPDATE_ERR2"] = "映象檔驗證不成功。請檢查是否上傳了正確的映象檔。";
eLang.common_strings["STR_FW_UPDATE_ERR3"] = "映象檔Flashing 不成功。";
eLang.common_strings["STR_FW_UPDATE_ERR4"] = "映象檔驗證不成功。請檢查是否上傳了正確的 Sign映象檔公共金鑰。";
eLang.common_strings["STR_FW_UPDATE_ERR5"] = "映象檔驗證不成功。上傳的映象檔是給不同的 Platform 使用。請檢查是否上傳了正確的映象檔。";
eLang.common_strings["STR_FW_UPDATE_ERR6"] = "映象檔驗證不成功。上傳的 Sign映象檔公共金鑰已損壞。請上傳正確的 Sign映象檔金鑰。";
eLang.common_strings["STR_FW_UPDATE_ERR7"] = "映象檔驗證不成功。上傳的 Sign映象檔公共金鑰無效。請上傳正確的 Sign映象檔金鑰。";
eLang.common_strings["STR_FW_UPDATE_ERR8"] = "映象檔驗證不成功。現有映象檔是簽署支援的映象檔。所以請上傳有正確簽名的映象檔。";
eLang.common_strings["STR_FW_UPDATE_ERR9"] = "映象檔驗證不成功。現有映象檔是無簽署的映象檔。所以請上傳無簽名的映象檔。";
eLang.common_strings["STR_FW_UPDATE_ERR10"] = "不同版本的映象檔將無法更新。請使用 YAFU。";
eLang.common_strings["STR_FW_UPDATE_RESET"] = "為了再次嘗試更新，你需要重置設備。按一下Ok，來重置設備。";
eLang.common_strings["STR_FW_FLASH_PROGRESS"] = "Flash 正在進行中！請稍後再試";
eLang.common_strings["STR_FW_VERIFY_DIFFVERSION"] = "已驗證韌體映象檔。上傳的映象檔與現有的映象檔版本是不同的。";
eLang.common_strings["STR_FW_VERIFY_DIFFSIZE"] = "已驗證韌體映象檔。上傳的映象檔大小與現有的映象檔大小不同。";
eLang.common_strings["STR_FW_VERIFY_SAME"] = "已驗證韌體映象檔。上傳的映象檔與現有的映象檔相同。";
eLang.common_strings["STR_FW_PREPARE_FLASH"] = "準備裝置的韌體更新時發生一個問題。";
eLang.common_strings["STR_FW_DWLDIMG_ERR"] = "從遠端伺服器下載韌體映象檔時發生了一個問題。請檢查韌體映象檔傳輸協議的配置是否正確。";
eLang.common_strings["STR_FW_DWLDSTATUS_ERR"] = "取得下載的韌體映象檔狀態時發生一個問題。請檢查韌體映象檔傳輸協議的配置是否正確。";
eLang.common_strings["STR_FW_SECTION_UPDATE_HEAD"] = "Section Base 韌體更新";
eLang.common_strings["STR_FW_FULL_FLASH_HEAD"] = "韌體更新";
eLang.common_strings["STR_FW_SECTION_UPDATE_DESC"] = "之後一節允許使用者配置的 Section Based 韌體更新。";
eLang.common_strings["STR_FW_FULL_FLASH_DESC"] = "Section Based 韌體更新中發生一些問題。推薦使用 Full flash。";
eLang.common_strings["STR_FW_VERSION_FLASH_DESC_1"] = "上傳的映象檔與現有的映象檔中的所有 Section 版本都相同。";
eLang.common_strings["STR_FW_VERSION_FLASH_DESC_2"] = "上傳的映象檔模組大小與現有映象檔模組的大小部相同。所以\'Version Compare Flash\'無法使用。";
eLang.common_strings["STR_FW_VERSION_FLASH"] = "Version Compare Flash";
eLang.common_strings["STR_FW_FULL_FLASH"] = "Full Flash";
eLang.common_strings["STR_FW_SECTION_NAME"] = "Section Name";
eLang.common_strings["STR_FW_VERIFY_CURVERSION"] = "目前的映象檔版本";
eLang.common_strings["STR_FW_VERIFY_NEWVERSION"] = "新的映象檔版本";
eLang.common_strings["STR_FW_FIRMWARE_VERSION"] = "韌體版本";
eLang.common_strings["STR_FW_EXISTING_VERSION"] = "現有版本";
eLang.common_strings["STR_FW_IMAGE1_VERSION"] = "映象檔1 版本";
eLang.common_strings["STR_FW_IMAGE2_VERSION"] = "映象檔2 版本";
eLang.common_strings["STR_FW_UPLOADED_VERSION"] = "目前上傳的韌體版本";
eLang.common_strings["STR_FW_SEC_STATUS"] = "可更新/不可更新";
eLang.common_strings["STR_FW_UPDATE_SECTION_CONFIRM"] = "按一下確定將開始的執行 Section Based 韌體更新。將更新選定的韌體 Section。其他部分將被跳過。注意： 啟動 Flash 操作之前, 建議您驗證映象檔Section 之間的相容性。確定要繼續？";
eLang.common_strings["STR_FW_UPDATE_SECTION_ERROR"] = "請選擇任一選項來繼續 Flash";
eLang.common_strings["STR_FW_PROGRESS_GETVAL"] = "取得 Flash 狀態時發生一個問題。";
eLang.common_strings["STR_FW_SIGNKEY_GETVAL"] = "取得 Sign映象檔公共金鑰資訊時發生一個問題。";
eLang.common_strings["STR_FW_SIGNKEY_TITLE"] = "上傳 Sign映象檔公開金鑰";
eLang.common_strings["STR_FW_SIGNKEY_INFO"] = "已上傳的 Sign映象檔公開金鑰";
eLang.common_strings["STR_FW_NEW_SIGN_KEY"] = "新的 Sign映象檔公共金鑰";
eLang.common_strings["STR_FW_SIGNKEY_INVALID1"] = "請輸入 Sign映象檔公共金鑰檔案";
eLang.common_strings["STR_FW_SIGNKEY_INVALID2"] = "Sign映象檔公共金鑰檔案名稱應以.pem 結尾";
eLang.common_strings["STR_FW_SIGNKEY_SUCCESS"] = "Sign映象檔公共金鑰已成功上傳";
eLang.common_strings["STR_FW_SIGNKEY_ERR1"] = "Sign映象檔公共金鑰檔不存在";
eLang.common_strings["STR_FW_SIGNKEY_ERR3"] = "Sign映象檔公共金鑰驗證失敗。請再次上傳 Sign映象檔的公共金鑰。";
eLang.common_strings["STR_FW_SIGNKEY_ERR4"] = "上傳 Sign映象檔公共金鑰失敗。請再次上傳 Sign映象檔的公共金鑰。";
eLang.common_strings["STR_FW_SIGNKEY_ERR5"] = "Sign映象檔公共金鑰檔案大小超過限制";
eLang.common_strings["STR_FW_SIGNKEY_VALIDATE_ERR"] = "驗證 Sign映象檔公開金鑰時發生一個問題";
eLang.common_strings["STR_FW_PRSRV_CFG_DESC"] = "-不論各自的欄位被標記為保留/覆寫都如以下表格所示。";
eLang.common_strings["STR_FW_FLASH_IMAGE"] = "Flash 映象檔 ";
eLang.common_strings["STR_FW_BOOT_IMAGE"] = "Boot 映象檔 ";
eLang.common_strings["STR_FW_REBOOT_BMC"] = "Flash 韌體之後，重啟 BMC";

/*Configure Dual Image*/
eLang.common_strings["STR_CONF_DUAL_IMG_GETVAL"] = "取得 Dual 映象檔配置時發生一個問題";
eLang.common_strings["STR_CONF_DUAL_IMG_SETVAL"] = "設定 Dual 映象檔配置時發生一個問題";
eLang.common_strings["STR_CONF_DUAL_IMG_SUCCESS"] = "已成功儲存的映象檔更新配置";
eLang.common_strings["STR_CONF_DUAL_IMG0"] = "Inactive映象檔";
eLang.common_strings["STR_CONF_DUAL_IMG1"] = "映象檔1";
eLang.common_strings["STR_CONF_DUAL_IMG2"] = "映象檔2";
eLang.common_strings["STR_CONF_DUAL_IMG3"] = "Dual映象檔";

/*Preserve Configuration*/
eLang.common_strings["STR_PRSRV_GETVAL"] = "取得儲存配置資訊時發生一個問題。";
eLang.common_strings["STR_PRSRV_SETVAL"] = "設定儲存配置資訊時發生一個問題。";
eLang.common_strings["STR_PRSRV_SUCCESS"] = "保存的配置設定已成功儲存。";
eLang.common_strings["STR_PRSRV_CFG_ITEM"] = "保存配置欄位";
eLang.common_strings["STR_PRSRV_STATUS"] = "保存狀態";
eLang.common_strings["STR_PRSRV_CFG_CNT"] = "保存的配置數目:";
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
eLang.common_strings["STR_RSTR_CFG_CNFRM"] = "如果想要繼續回復配置，請按一下確定。警告: 回復配置將重新啟動設備。";

/*Restore Configuration*/
eLang.common_strings["STR_BACKUP_GETVAL"] = "取得備份配置資訊時發生一個問題。";
eLang.common_strings["STR_BACKUP_SETVAL"] = "設定備份配置資訊時發生一個問題。";
eLang.common_strings["STR_BACKUP_RESTORE_SETVAL"] = "設定配置時發生一個問題。";
eLang.common_strings["STR_BACKUP_SAVE_SUCCESS"] = "備份配置設定已成功儲存。";
eLang.common_strings["STR_BACKUP_CONFIRM"] = "請不要執行任何其他操作直到配置備份任務完成。如果你想要繼續，按一下 OK";
eLang.common_strings["STR_RESTORE_CONFIRM"] = "警告: 回復配置需要重啟 BMC 才會生效。請不要執行任何其他操作，直到完成回復過程結束。如果你想要繼續，按一下 OK";
eLang.common_strings["STR_BACKUP_CFG_ITEM"] = "備份設定欄位";
eLang.common_strings["STR_BACKUP_STATUS"] = "全選";
eLang.common_strings["STR_BACKUP_FILE"] = "設定檔";
eLang.common_strings["STR_SETCONFIG_ERROR_1"] = "在創造配置備份時發生一個問題";
eLang.common_strings["STR_SETCONFIG_ERROR_2"] = "回復配置備份時發生一個問題";
eLang.common_strings["STR_RESTORE_CFG_TITLE"] = "回復配置";
eLang.common_strings["STR_RESTORE_INVALID_FILE"] = "設定檔不正確。";
eLang.common_strings["STR_RESTORE_CFG_SUCCESS"] = "成功回復的設定檔。在 BMC 重新開機後生效。請關閉此瀏覽器並重新打開瀏覽器頁面來重新連接到設備上。";

/*System Administrator*/
eLang.common_strings["STR_CFG_ROOT_GETVAL"] = "取得 Root 使用者配置時發生一個問題。";
eLang.common_strings["STR_CFG_ROOT_SETVAL"] = "設定 Root 使用者配置時發生一個問題。";
eLang.common_strings["STR_CFG_ROOT_SUCCESS"] = "系統管理者配置已成功儲存。";

/*General Strings*/
eLang.common_strings["STR_PERMISSION_DENIED"] = "拒絕查看此內容的權限。";
eLang.common_strings["STR_CONF_ADMIN_PRIV"] = "您需要有管理者權限才能執行此操作。";
eLang.common_strings["STR_TIME_OUT"] = "BMC 長時間沒有回應。請重新檢查 Cable 和配置";
eLang.common_strings["STR_NOT_CONFIGURE"] = "未配置";
eLang.common_strings["STR_NOT_AVAILABLE"] = "Not Available";
eLang.common_strings["STR_DATA"] = "資料";
eLang.common_strings["STR_NOT_APPLICABLE"] = "N/A";
eLang.common_strings["STR_NOT_SUPPORT"] = "不支援";
eLang.common_strings["STR_NONE"] = "無";
eLang.common_strings["STR_MANUAL"] = "手動";
eLang.common_strings["STR_AUTO"] = "自動";
eLang.common_strings["STR_BLANK"] = "&nbsp;";
eLang.common_strings["STR_EMPTY"] = " ";
eLang.common_strings["STR_NEWLINE"] = "\n";
eLang.common_strings['STR_HELP'] = "説明";
eLang.common_strings['STR_NODE_SELECT'] = "節點選擇";
eLang.common_strings['STR_AND_ABOVE'] = "以及以上";
eLang.common_strings['STR_ANY'] = "任何";
eLang.common_strings['STR_PROCESS_ABORT'] = "目前進行的程序將被中止。";
eLang.common_strings['STR_FWFLASH_ABORT'] = "韌體 Flash 期間關閉 web Session 導致重啟設備。";
eLang.common_strings['STR_LOGOUT_SUCCESS'] = "您已成功登出。";
eLang.common_strings["STR_EVENT_ENTRIES"] = "事件欄位";
eLang.common_strings["STR_SAVE"] = "儲存";
eLang.common_strings["STR_ADD"] = "新增";
eLang.common_strings["STR_MODIFY"] = "修改";
eLang.common_strings["STR_REPLACE"] = "取代";
eLang.common_strings["STR_DELETE"] = "刪除";
eLang.common_strings["STR_CANCEL"] = "取消";
eLang.common_strings["STR_PROCEED"] = "繼續進行";
eLang.common_strings["STR_ENABLED"] = "啟用";
eLang.common_strings["STR_DISABLED"] = "已禁用";
eLang.common_strings["STR_HASH"] = "#";
eLang.common_strings["STR_USERNAME"] = "使用者名稱";
eLang.common_strings["STR_PASSWORD"] = "密碼";
eLang.common_strings["STR_DOMAINNAME"] = "網域名稱";
eLang.common_strings["STR_SERVER_ADDRESS"] = "伺服器位址";
eLang.common_strings["STR_SOURCE_PATH"] = "來源路徑";
eLang.common_strings["STR_SHARE_TYPE"] = "分享類型";
eLang.common_strings["STR_RETRY_COUNT"] = "重試次數";
eLang.common_strings["STR_PRESERVE"] = "保存";
eLang.common_strings["STR_OVERWRITE"] = "覆寫";
eLang.common_strings["STR_INACTIVE"] = "Inactive";
eLang.common_strings["STR_ACTIVE"] = "Active";
eLang.common_strings["STR_STAND_BY"] = "待命";
eLang.common_strings["STR_YES"] = "YES";
eLang.common_strings["STR_NO"] = "NO";
eLang.common_strings["STR_KVM_PRIV"] = "KVM";
eLang.common_strings["STR_VMEDIA_PRIV"] = "虛擬媒體";
eLang.common_strings["STR_EXTENDED_PRIV"] = "擴展的權限";
eLang.common_strings["STR_VIEW"] = "View";
eLang.common_strings["STR_DASH"] = "-";
eLang.common_strings["STR_TERMINATE_SESSION"] = "終止";
eLang.common_strings["STR_MAX_DURATION"] =  "最大期間(秒)";
eLang.common_strings["STR_MAX_SIZE"] =  "最大容量(MB)";
eLang.common_strings["STR_MAX_DUMPS"] =  "最大丟棄值";

/*General Error Strings*/
eLang.common_strings["STR_IPMI_ERROR"] = " IPMI 錯誤：";
eLang.common_strings["STR_ERROR_CODE"] = " 錯誤代碼：";
eLang.common_strings["STR_HELP_INFO"] = "請參閱詳細的説明資訊。";
eLang.common_strings["STR_INVALID_FIELDS"] = "下面是無效區域，";
eLang.common_strings["STR_INVALID_PORT"] = "無效的 Port Number";
eLang.common_strings["STR_INVALID_IP"] = "無效的 IP 位址格式。";
eLang.common_strings["STR_INVALID_TIMEOUT"] = "無效的 Time Out。";
eLang.common_strings["STR_INVALID_SERVERADDR"] = "無效的伺服器位址。";
eLang.common_strings["STR_INVALID_ADDR_FAMILY"] = "給定的 Address Family 未啟用。";
eLang.common_strings["STR_INVALID_USERNAME"] = "無效的使用者名稱。";
eLang.common_strings["STR_INVALID_PASSWORD"] = "無效的密碼。";
eLang.common_strings["STR_INVALID_SHARE_TYPE"] = "共享類型";
eLang.common_strings["STR_INVALID_SERVICE"] = "服務未啟用";
eLang.common_strings["STR_INVALID_CPWORD"] = "密碼和確認密碼不一致";
eLang.common_strings["STR_INVALID_UNAME_PWORD"] = "使用者名稱/密碼不能為空";
eLang.common_strings["STR_INVALID_EMAILADDR"] = "無效的電子郵件地址。";
eLang.common_strings["STR_INVALID_DOMAIN"] = "無效的網域名稱。";
eLang.common_strings["STR_INVALID_SEARCHBASE"] = "無效的搜索庫。";
eLang.common_strings["STR_INVALID_RGNAME"] = "無效的分組名稱。";
eLang.common_strings["STR_INVALID_PAGENO"] = "無效的頁碼。";
eLang.common_strings["STR_INVALID_SRC_PATH"] = "無效的來源路徑。";
eLang.common_strings["STR_NETWORK_ERROR"] = "網路連接發生了一些問題。";
eLang.common_strings["STR_LANG_NOT_FOUND"] = "未確定瀏覽器語言。預設情況使用 English(US)。";
eLang.common_strings["STR_NO_CONFIGURATION"] = "此頁中沒有可用的配置設定。";

eLang.common_strings["STR_APP_STR_ALL_DEASSERTED"] = "全部（信號）失效";
eLang.common_strings["STR_IPV4_ADDR0"] = "0.0.0.0";
eLang.common_strings["STR_IPV6_ADDR0"] = "::";
eLang.common_strings["STR_INVALID_MAXDURATION_ERROR"] = "無效的最大期間。"; 
eLang.common_strings["STR_INVALID_MAXSIZE_ERROR"] = "無效的最大容量。"; 
eLang.common_strings["STR_INVALID_MAXDUMPS_ERROR"] = "無效的最大丟棄值。"; 

eLang.common_strings["NO_SEL_STRING"] = "此時系統中沒有任何事件日誌欄位存在。";
eLang.common_strings["NO_SAL_STRING"] = "日誌中沒有任何欄位存在。";
eLang.common_strings["NO_FRU_STRING"] = "系統中沒有任何 FRU 設備存在。";
eLang.common_strings["NO_SENSOR_STRING"] = "系統中沒有任何感測器存在";
eLang.common_strings["NO_ALERTENTRY_STRING"] = "系統中沒有任何警報項目存在。";
eLang.common_strings["NO_PEFENTRY_STRING"] = "系統中沒有任何 PEF 欄位存在。";
eLang.common_strings["NO_LANALERTDESTS_STRING"] = "系統中沒有任何已配置的報警目的地存在。";
eLang.common_strings["INVALID_OFFSET"] = "<b>無效的 SensorType 偏移量</b>";
eLang.common_strings["EXTENDED_SEL"] = "<b>Extended SEL</b>";

/*General - Confirmation messages*/
eLang.common_strings["STR_CONFIRM_DELETE"] = "如果要繼續刪除此欄位，按一下確定來進行。";
eLang.common_strings["STR_GENERAL_COMMAND_CONFIRM"] = "確定要執行此命令?";
eLang.common_strings["STR_GENERAL_LOGOUT"] = "按一下確定來進行登出。";
eLang.common_strings["STR_GENERAL_DISCONNECT"] = "確定要與伺服器斷開連接?";
eLang.common_strings["STR_CONSOLE_CONNECTED"] = "活動主控台視窗將會封閉。";
eLang.common_strings["STR_SSLCERT_ABORT"] = "SSL 憑證上傳會被中止。";
eLang.common_strings["STR_IPMI_LIBRARY_ERROR"] = "IPMI library 沒有回應。請確認 IPMI 程序是否正在運行。";

/*General - Strings*/
eLang.common_strings["STR_OK"] = "好 (OK)";
eLang.common_strings["STR_WAIT"] = "載入 (Loading)";
eLang.common_strings["STR_WARNING"] = "警告 (Warning)：";
eLang.common_strings["STR_ON"] = "開 (On)";
eLang.common_strings["STR_OFF"] = "關閉 (Off)";
eLang.common_strings["STR_GO"] = "Go！";
eLang.common_strings["STR_LOGIN_BUTTON"] = "Log In";
eLang.common_strings["STR_LOGIN_NOSPACE"] = "登入 (Login)";
eLang.common_strings["STR_LOGIN_PLEASE"] = "請登入";
eLang.common_strings["STR_SIDEBAR_LOGOUT"] = "登出 (Log out)";
eLang.common_strings["STR_SIDEBAR_DISCONNECT"] = "斷開連接 (Disconnect)";
eLang.common_strings["STR_APPLYCHANGES"] = "應用更改 (Apply Changes)";
eLang.common_strings["STR_ENABLE"] = "啟用 (Enable)";
eLang.common_strings["STR_DISABLE"] = "禁用 (Disable)";
eLang.common_strings["STR_CONNECT"] = "連接 (Connect)";
eLang.common_strings["STR_DISCONNECT"] = "斷線 (Disconnect)";
eLang.common_strings["STR_UPLOAD"] = "上傳";
eLang.common_strings["STR_UNKNOWN"] = "未知";
eLang.common_strings["STR_RPC_WAIT"] = "正在載入資料。請稍候。。！";

/*Login Strings*/
eLang.common_strings["STR_LOGINWELCOME"] = "請輸入使用者名稱和密碼";
eLang.common_strings["STR_LOGINFAILED"] = "登入失敗。請再試一次";
eLang.common_strings["STR_LOGIN_ERROR"] = "身份驗證失敗";
eLang.common_strings["STR_LOGIN_NOACCESS"] = "沒有權限的使用者";
eLang.common_strings["STR_LOGIN_BWSRNOTSPRT"] = "瀏覽器不支援";
eLang.common_strings["STR_LOGIN_BWSRMSG"] = "此軟體不支援此瀏覽器版本。請確認使用者說明使用支援的瀏覽器。";
eLang.common_strings["STR_LOGIN_SESSION_EXPIRED"] = " Session Expired";
eLang.common_strings["STR_LOGIN"] = "需要身份驗證";
eLang.common_strings["STR_LOGIN_ERROR_3"] = "使用中的 Session 已達到最大值";
eLang.common_strings["STR_USER_REQUIRED"] = "使用者名稱是必需的";
eLang.common_strings["STR_PWD_REQUIRED"] = "密碼是必需的";
eLang.common_strings["STR_COOKIES_ENABLE"] = "請啟用 cookie 來登入系統";
eLang.common_strings["STR_FIRST_COOKIES_BLOCK"] = "啟用了 cookie，第一方 cookie 仍然被阻檔";
eLang.common_strings["STR_USER_ROLE_ERROR"] = "無法取得使用者規則";
eLang.common_strings["STR_LAN_CHANNEL_ERROR"] = "無法提取 LAN Channel 資訊";
eLang.common_strings["STR_PROJECT_CFG_ERROR"] = "無法提取 Project 配置";
eLang.common_strings["STR_USER_LENGTH"] = "使用者名稱長度不能超過超過 800 個字元";
eLang.common_strings["STR_PWD_LENGTH"] = "密碼長度不能超過超過 300 個字元";

/*Password Reset Strings*/
eLang.common_strings["STR_RESET_PSWD_CONFIRM"] = "請按一下 OK 繼續重置使用者密碼，。";
eLang.common_strings["STR_RESET_PSWD_SUCCESS"] = "新密碼已發送到配置的電子郵件中";
eLang.common_strings["STR_SMTP_SERVER_DISABLED"] = "此頻道禁用 SMTP 伺服器";
eLang.common_strings["STR_RESET_PSWD_FAILURE"] = "重新設定新密碼時發生一個問題";
eLang.common_strings["STR_RESET_PSWD_FAILURE1"] = "無法為使用者重置密碼";

/*Reset Strings*/
eLang.common_strings["STR_WEB_RESET_TITLE"] = "Web 伺服器已被重置";
eLang.common_strings["STR_WEB_RESET_DESC"] = "重置 Web 伺服器使更改生效。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到設備上。";
eLang.common_strings["STR_HTTPS_RESET_DESC"] = "重置 HTTPS 服務使更改生效。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。";
eLang.common_strings["STR_DEVICE_RESET_TITLE"] = "設備已被重置";
eLang.common_strings["STR_DEVICE_RESET_DESC"] = "該設備已重置。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。<br/> <br/>設備大約需要一分鐘來重啟。";
eLang.common_strings["STR_DEVICE_UPDATE_TITLE"] = "已更新設備";
eLang.common_strings["STR_DEVICE_UPDATE_DESC"] = "該設備已被更新。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。";
eLang.common_strings["STR_DEVICE_UPDATE_CANCEL_TITLE"] = "設備更新已取消";
eLang.common_strings["STR_DEVICE_UPDATE_CANCEL_DESC"] = "設備的更新已被取消。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。";
eLang.common_strings["STR_DEVICE_FLASHMODE_TITLE"] = "設備在 Flash 模式中";
eLang.common_strings["STR_DEVICE_FLASHMODE_DESC"] = "該設備在 Flash 模式中。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。<br/> <br/>設備大約需要幾分鐘來 flash 和重啟。";
eLang.common_strings["STR_FLASH_NETWORK_DISCONN_TITLE"] = "網路連線中斷";
eLang.common_strings["STR_FLASH_NETWORK_DISCONN_DESC"] = "該設備在 Flash 模式時網路連線中斷。請關閉此瀏覽器 Session 並打開新的瀏覽器 Session 來重新連接到該設備上。<br/> <br/>設備大約需要幾分鐘來 flash 和重啟。";

/*General Threshold Strings*/
eLang.common_strings["STR_SENSOR_THRESHOLD"] = new Array();
eLang.common_strings["STR_SENSOR_THRESHOLD"][0] = "低非臨界 (LNC)";
eLang.common_strings["STR_SENSOR_THRESHOLD"][1] = "低臨界 (LC)";
eLang.common_strings["STR_SENSOR_THRESHOLD"][2] = "低不可回復 (LNR)";
eLang.common_strings["STR_SENSOR_THRESHOLD"][3] = "高非臨界 (UNC)";
eLang.common_strings["STR_SENSOR_THRESHOLD"][4] = "高臨界 (UC)";
eLang.common_strings["STR_SENSOR_THRESHOLD"][5] = "高不可回復 (UNR)";

/*Sensor Type Strings*/
eLang.common_strings["STR_SENSOR_TYPES"] = new Array();
eLang.common_strings["STR_SENSOR_TYPES"][0x00] = "所有感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x01] = "溫度感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x02] = "電壓感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x03] = "電流感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x04] = "風扇感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x05] = "物理安全";
eLang.common_strings["STR_SENSOR_TYPES"][0x06] = "違反平台安全行的嘗試";
eLang.common_strings["STR_SENSOR_TYPES"][0x07] = "處理器";
eLang.common_strings["STR_SENSOR_TYPES"][0x08] = "電源";
eLang.common_strings["STR_SENSOR_TYPES"][0x09] = "電源單元";
eLang.common_strings["STR_SENSOR_TYPES"][0x0A] = "冷卻裝置";
eLang.common_strings["STR_SENSOR_TYPES"][0x0B] = "其它基於單位的感應器";
eLang.common_strings["STR_SENSOR_TYPES"][0x0C] = "記憶體";
eLang.common_strings["STR_SENSOR_TYPES"][0x0D] = "磁碟機插槽";
eLang.common_strings["STR_SENSOR_TYPES"][0x0E] = "POST Memory Resize";
eLang.common_strings["STR_SENSOR_TYPES"][0x0F] = "系統韌體進展";
eLang.common_strings["STR_SENSOR_TYPES"][0x10] = "禁用事件日誌";
eLang.common_strings["STR_SENSOR_TYPES"][0x11] = "Watchdog 1";
eLang.common_strings["STR_SENSOR_TYPES"][0x12] = "系統事件";
eLang.common_strings["STR_SENSOR_TYPES"][0x13] = "Critical Interrupt";
eLang.common_strings["STR_SENSOR_TYPES"][0x14] = "按鈕/開關";
eLang.common_strings["STR_SENSOR_TYPES"][0x15] = "Module/Board";
eLang.common_strings["STR_SENSOR_TYPES"][0x16] = "微控制器/副處理器";
eLang.common_strings["STR_SENSOR_TYPES"][0x17] = "附加卡";
eLang.common_strings["STR_SENSOR_TYPES"][0x18] = "Chassis";
eLang.common_strings["STR_SENSOR_TYPES"][0x19] = "晶片集";
eLang.common_strings["STR_SENSOR_TYPES"][0x1A] = "其他 FRU";
eLang.common_strings["STR_SENSOR_TYPES"][0x1B] = "Cable/Interconnect";
eLang.common_strings["STR_SENSOR_TYPES"][0x1C] = "Terminator";
eLang.common_strings["STR_SENSOR_TYPES"][0x1D] = "系統啟動/重新開始初始化";
eLang.common_strings["STR_SENSOR_TYPES"][0x1E] = "啟動錯誤";
eLang.common_strings["STR_SENSOR_TYPES"][0x1F] = "作業系統開啟";
eLang.common_strings["STR_SENSOR_TYPES"][0x20] = "作業系統停止 / 關機";
eLang.common_strings["STR_SENSOR_TYPES"][0x21] = "插槽 / 連接器";
eLang.common_strings["STR_SENSOR_TYPES"][0x22] = "系統 ACPI 電源狀態";
eLang.common_strings["STR_SENSOR_TYPES"][0x23] = "Watchdog 2";
eLang.common_strings["STR_SENSOR_TYPES"][0x24] = "平台警告";
eLang.common_strings["STR_SENSOR_TYPES"][0x25] = "實際存在";
eLang.common_strings["STR_SENSOR_TYPES"][0x26] = "Monitor ASIC / IC";
eLang.common_strings["STR_SENSOR_TYPES"][0x27] = "LAN";
eLang.common_strings["STR_SENSOR_TYPES"][0x28] = "管理子系統運行狀況";
eLang.common_strings["STR_SENSOR_TYPES"][0x29] = "電池";
eLang.common_strings["STR_SENSOR_TYPES"][0x2A] = "Session Audit";
eLang.common_strings["STR_SENSOR_TYPES"][0x2B] = "版本變更";
eLang.common_strings["STR_SENSOR_TYPES"][0x2C] = "FRU 狀態";

/* SMBMC */
eLang.common_strings["STR_MULTI_BMCINST_GETVAL"] = "取得 BMC Instance 時發生錯誤";
eLang.common_strings["STR_MULTI_BMCINST_SET_NODE_CONFIRM"] = "確定要更改 BMC 節點？";
eLang.common_strings["STR_MULTI_BMCINST_SETVAL"] = "設定 BMC Instance 時發生錯誤。";
eLang.common_strings["STR_MULTI_BMCINST_SET_NODE_SUCCESS"] = "BMC Instance 配置成功。";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_GETVAL"] = "取得 USB 交換器設定時發生錯誤。";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_CONFIRM"] = "確定要更改 USB 重定向節點？";
eLang.common_strings["STR_MULTI_BMCINST_USB_SWITCH_SETVAL"] = "設定 USB 交換器設定時發生錯誤。";
eLang.common_strings["STR_MULTI_BMCINST_SET_USB_SWITCH_SUCCESS"] = "USB 交換器設定成功 。";

/* RAID Controller */
eLang.common_strings["STR_RAID_GETINFO"] = "取得 RAID 控制器的資訊時發生錯誤。";
eLang.common_strings["STR_RAID_BBU_MISSING"] = "沒有電池備份子系統。";
eLang.common_strings["STR_RAID_BBU_INIT"] = "電池備份子系統目前正在初始化。";
eLang.common_strings["STR_RAID_BBU_READY"] = "電池備份子系統準備好了。";
eLang.common_strings["STR_RAID_BBU_LEARN"] = "電池備份子系統正在執行的 learning cycle。";
eLang.common_strings["STR_RAID_BBU_FATAL"] = "電池備份子系統失敗。";
eLang.common_strings["STR_RAID_BBU_OVER_TEMP"] = "Super capacitor pack 已超過最高溫度閾值。";
eLang.common_strings["STR_RAID_BBU_WARN_TEMP"] = "Super capacitor pack 已超出警告溫度閾值。";
eLang.common_strings["STR_RAID_BBU_OVER_VOLTAGE"] = "Super capacitor pack 電壓過高。";
eLang.common_strings["STR_RAID_BBU_OVER_CURRENT"] = "電池備份子系統已超出最大充電電流。";
eLang.common_strings["STR_RAID_BBU_LEARN_PASS"] = "電池備份子系統 learning cycle 通過";
eLang.common_strings["STR_RAID_BBU_LEARN_FAIL"] = "電池備份子系統 learning cycle 失敗。";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD1"] ="紀錄 Id";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD2"] ="時間戳記";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD3"] ="事件代碼";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD4"] ="事件類型";
eLang.common_strings["STR_RAID_EVENT_LOG_HEAD5"] ="事件類別";
//eLang.common_strings["STR_RAID_EVENT_LOG_HEAD6"] ="Event Desc";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE0"] ="所有事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE1"] ="LD 事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE2"] ="PD 事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE3"] ="Enclosure 事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE4"] ="BBU 事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE5"] ="SAS 事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE6"] ="控制器事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE7"] ="配置事件";
eLang.common_strings["STR_RAID_EVENT_LOG_TYPE8"] ="Cluster 事件";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD1"] ="裝置 Id";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD2"] ="媒體類型";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD3"] ="狀態";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD4"] ="插槽";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD5"] ="速度";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD6"] ="連結速度";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD7"] ="Size (GB)";
eLang.common_strings["STR_RAID_MAIN_PHYSICAL_HEAD8"] ="溫度 (°C)";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD1"] ="裝置 Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD2"] ="供應商 Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD3"] ="產品 Id";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD4"] ="序號";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD5"] ="電源狀態";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD6"] ="Drive Presence";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD7"] ="LED Status";
eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD8"] ="介面類型";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD9"] ="Drive Cache";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD10"] ="Block Size (GB)";
//eLang.common_strings["STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD11"] ="SMART";
eLang.common_strings["STR_RAID_LOGICAL_HEAD1"] ="LD 名稱";
eLang.common_strings["STR_RAID_LOGICAL_HEAD2"] ="類型";
eLang.common_strings["STR_RAID_LOGICAL_HEAD3"] ="狀態";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD4"] ="Stripe Size";
eLang.common_strings["STR_RAID_LOGICAL_HEAD5"] ="讀取機制";
eLang.common_strings["STR_RAID_LOGICAL_HEAD6"] ="寫入機制";
eLang.common_strings["STR_RAID_LOGICAL_HEAD7"] ="快取機制";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD8"] ="BGI";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD9"] ="SSD Caching";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD10"] ="Progress";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD11"] ="Bad Blocks Table";
//eLang.common_strings["STR_RAID_LOGICAL_HEAD12"] ="Size (GB)";
eLang.common_strings["STR_RAID_LOGICAL_HEAD13"] ="實體裝置的編號";
eLang.common_strings["STR_RAID_LOGICAL_HEAD14"] ="實體裝置的資訊";
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
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD3"] ="SSD 快取";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD4"] ="進度 (%)";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD5"] ="故障區塊表";
eLang.common_strings["STR_RAID_MAIN_POP_UP_LOGICAL_HEAD6"] ="Size (GB)";
eLang.common_strings["STR_RAID_EVENT_LOG_CLEAR_SUCCESS"] ="RAID 控制器事件紀錄將會被清除";
eLang.common_strings["NO_RAID_PHYSICAL_STRING"] = "現在沒有實體裝置資訊,偵測不到實體裝置";
eLang.common_strings["NO_RAID_LOGICAL_STRING"] = "現在沒有邏輯裝置資訊,偵測不到邏輯裝置";
eLang.common_strings["STR_RAID_INFO_LABEL0"] ="序號 :";
eLang.common_strings["STR_RAID_INFO_LABEL1"] ="軟體包 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL2"] ="BIOS 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL3"] ="UEFI 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL4"] ="Expander 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL5"] ="SEEPROM 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL6"] ="CPLD 版本:";
eLang.common_strings["STR_RAID_INFO_LABEL7"] = "PCI 供應商 Id:";
eLang.common_strings["STR_RAID_INFO_LABEL8"] = "PCI 裝置 Id:";
eLang.common_strings["STR_RAID_INFO_LABEL9"] = "PCI 附供應商 Id:";
eLang.common_strings["STR_RAID_INFO_LABEL10"] = "PCI 子系統 Id:";
eLang.common_strings["STR_RAID_INFO_LABEL11"] = "ROC 溫度 (°C):";
eLang.common_strings["STR_RAID_INFO_LABEL12"] = "陣列擴充卡溫度 (°C):";
eLang.common_strings["STR_RAID_INFO_LABEL13"] = "健康狀態:";
eLang.common_strings["STR_RAID_STORAGE_LABEL0"] = "實體裝置數目:";
eLang.common_strings["STR_RAID_STORAGE_LABEL1"] = "邏輯裝置數目:";
eLang.common_strings["STR_RAID_STORAGE_LABEL2"] = "熱備援數目:";
eLang.common_strings["STR_RAID_BBU_LABEL0"] = "類型:";
eLang.common_strings["STR_RAID_BBU_LABEL1"] = "狀態:";
eLang.common_strings["STR_RAID_BBU_LABEL2"] = "溫度 (°C):";
eLang.common_strings["STR_RAID_BBU_LABEL3"] = "電壓 (mV):";
eLang.common_strings["STR_RAID_BBU_LABEL4"] = "電流 (mA):";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE0"] = "HDD";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE1"] = "SSD";
eLang.common_strings["STR_RAID_PHYSICAL_TYPE2"] = "SSM";
eLang.common_strings["STR_RAID_PHYSICAL_STATE0"] = "UNCONFIGURED_GOOD";
eLang.common_strings["STR_RAID_PHYSICAL_STATE1"] = "UNCONFIGURED_BAD";
eLang.common_strings["STR_RAID_PHYSICAL_STATE2"] = "熱備援";
eLang.common_strings["STR_RAID_PHYSICAL_STATE3"] = "離線";
eLang.common_strings["STR_RAID_PHYSICAL_STATE4"] = "失敗";
eLang.common_strings["STR_RAID_PHYSICAL_STATE5"] = "重建";
eLang.common_strings["STR_RAID_PHYSICAL_STATE6"] = "上線";
eLang.common_strings["STR_RAID_TEMPRATURE_NOT_AVAILABLE"] = "N/A";
eLang.common_strings["STR_RAID_YES"] = "Yes";
eLang.common_strings["STR_RAID_NO"] = "No";
eLang.common_strings["STR_RAID_ON"] = "開";
eLang.common_strings["STR_RAID_OFF"] = "關";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE0"] = "未知";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE1"] = "SCSI";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE2"] = "SAS";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE3"] = "SATA";
eLang.common_strings["STR_RAID_PHYSICAL_INTERFACE_TYPE4"] = "FC";
eLang.common_strings["STR_RAID_DISBALED"] = "停用";
eLang.common_strings["STR_RAID_ENABLED"] = "啟用";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK0"] = "未定義";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK1"] = "1.5Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK2"] = "3.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK3"] = "6.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_SPEED_LINK4"] = "12.0Gb/s";
eLang.common_strings["STR_RAID_PHYSICAL_POWER_STATUS_UP"] = "Spun Up";
eLang.common_strings["STR_RAID_PHYSICAL_POWER_STATUS_DOWN"] = "Spun Down";
//eLang.common_strings["STR_RAID_PHYSICAL_SMART0"] = "N/A";
eLang.common_strings["STR_RAID_PHYSICAL_SMART1"] = "沒有錯誤";
eLang.common_strings["STR_RAID_PHYSICAL_SMART2"] = "偵測到錯誤";
eLang.common_strings["STR_RAID_LOGICAL_STATE0"] = "離線";
eLang.common_strings["STR_RAID_LOGICAL_STATE1"] = "降級";
eLang.common_strings["STR_RAID_LOGICAL_STATE2"] = "重建";
eLang.common_strings["STR_RAID_LOGICAL_STATE3"] = "最佳";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY0"] = "讀/寫";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY1"] = "只允許讀取";
eLang.common_strings["STR_RAID_LOGICAL_ACCESS_POLICY2"] = "被阻擋";
eLang.common_strings["STR_RAID_LOGICAL_READ_POLICY0"] = "不向前讀";
eLang.common_strings["STR_RAID_LOGICAL_READ_POLICY1"] = "向前讀";
eLang.common_strings["STR_RAID_LOGICAL_WRITE_POLICY0"] = "寫穿";
eLang.common_strings["STR_RAID_LOGICAL_WRITE_POLICY1"] = "寫回";
eLang.common_strings["STR_RAID_LOGICAL_CACHE_POLICY0"] = "Direct IO";
eLang.common_strings["STR_RAID_LOGICAL_CACHE_POLICY1"] = "快取 IO";
eLang.common_strings["STR_RAID_LOGICAL_BAD_BLOCKS0"] = "空";
eLang.common_strings["STR_RAID_LOGICAL_BAD_BLOCKS1"] = "非空";
eLang.common_strings["STR_RAID_BBU_TYPE0"] = "未知";
eLang.common_strings["STR_RAID_BBU_TYPE1"] = "SuperCap";
eLang.common_strings["STR_RAID_BBU_TYPE2"] = "BBU";
eLang.common_strings["STR_RAID_BBU_TYPE3"] = "TBBU";
eLang.common_strings["STR_RAID_BBU_TYPE4"] = "iBBU";
eLang.common_strings["STR_RAID_BBU_TYPE5"] = "iTBBU";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS0"] = "資訊事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS1"] = "警告事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS2"] = "關鍵事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS3"] = "致命事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS4"] = "Dead 事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS5"] = "進度事件";
eLang.common_strings["STR_RAID_LOGICAL_EVENT_CLASS6"] = "除錯事件";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE0"] = "N/A";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE1"] = "subarray";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE2"] = "data/parity";
eLang.common_strings["STR_RAID_LOGICAL_ELEMENT_TYPE3"] = "hotspare";
eLang.common_strings["STR_RAID_BBU_ERROR"] = "找不到 BBU 裝置";
eLang.common_strings["STR_RAID_NOT_AVAILABLE"] = "N/A";
eLang.common_strings["STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"] = "主機目前為電源關閉狀態";
eLang.common_strings["STR_RAID_INVALID_CONTROLLER_ID"] = "無效的 RAID 控制器 Id.";
eLang.common_strings["STR_RAID_INVALID_DEVICE_ID"] = "無效的 RAID 控制器裝置 Id.";

/*BMC Recovery*/ 
eLang.common_strings["STR_CONF_BMC_RECOVERY_GETVAL"] = "在取得 BMC 回復配置時發生了一個問題"; 
eLang.common_strings["STR_CONF_BMC_RECOVERY_SAVE_SUCCESS"] = "BMC 回復設定儲存成功。"; 
eLang.common_strings["STR_CONF_BMC_RECOVERY_SETVAL"] = "在配置 BMC 回復資訊時發生了一個問題"; 
eLang.common_strings["STR_INVALID_BMC_RECOVERY_IMAGE_NAME"] = "映象檔名稱是強制的。"; 
eLang.common_strings["STR_CONF_BMC_RECOVERY_BOOT_INVALID_RETRYCNT"] = "無效的 Boot 重試次數。"; 
eLang.common_strings["STR_CONF_BMC_RECOVERY_INVALID_RETRYCNT"] = "無效的 回復重試次數。"; 

