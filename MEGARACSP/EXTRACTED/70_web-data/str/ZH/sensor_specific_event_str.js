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

// File Name  : sensor_specific_event_str.js
// Brief      : sensor_specific_event page string table
// Author Name:

eLang.sensor_specific_event_strings = new Array();
eLang.sensor_specific_event_strings[0] = "保留 (Reserved)";
eLang.sensor_specific_event_strings[1] = "溫度 (Temperature)";
eLang.sensor_specific_event_strings[2] = "電壓 (Voltage)";
eLang.sensor_specific_event_strings[3] = "當前 (Current)";
eLang.sensor_specific_event_strings[4] = "風扇 (Fan)";

eLang.sensor_specific_event_strings[5] = new Array();
eLang.sensor_specific_event_strings[5][0] = "一般機台指令";
eLang.sensor_specific_event_strings[5][1] = "磁碟機托盤指令(Drive Bay Intrusion)";
eLang.sensor_specific_event_strings[5][2] = "I/O卡區域指令 (I/O Card Area Intrusion)";
eLang.sensor_specific_event_strings[5][3] = "處理器區域指令 (Processor Area Intrusion)";
eLang.sensor_specific_event_strings[5][4] = "LAN Leash Lost (System unplugged from LAN)";
eLang.sensor_specific_event_strings[5][5] = "未認證的 Dock";
eLang.sensor_specific_event_strings[5][6] = "風扇區域指令（Fan Area Intrusion)";

eLang.sensor_specific_event_strings[6] = new Array();
eLang.sensor_specific_event_strings[6][0] = "安全模式的違規嘗試";
eLang.sensor_specific_event_strings[6][1] = "Pre-boot 違規的密碼 -使用者密碼";
eLang.sensor_specific_event_strings[6][2] = "Pre-boot 違規的密碼嘗試 -設定密碼";
eLang.sensor_specific_event_strings[6][3] = "Pre-boot 違規的密碼 -網路 boot 密碼";
eLang.sensor_specific_event_strings[6][4] = "其它 Pre-boot 密碼違規";
eLang.sensor_specific_event_strings[6][5] = "Out-of-Band 存取密碼違規";

eLang.sensor_specific_event_strings[7] = new Array();
eLang.sensor_specific_event_strings[7][0] = "IERR";
eLang.sensor_specific_event_strings[7][1] = "極限溫度";
eLang.sensor_specific_event_strings[7][2] = "FRB1/BIST 故障";
eLang.sensor_specific_event_strings[7][3] = "FRB2/Hang in Post 故障";
eLang.sensor_specific_event_strings[7][4] = "FRB3/處理器啟動/初始化失敗";
eLang.sensor_specific_event_strings[7][5] = "配置錯誤 (DMI)";
eLang.sensor_specific_event_strings[7][6] = "SM BIOS \'無法更正的 CPU 複雜錯誤";
eLang.sensor_specific_event_strings[7][7] = "偵測到處理器存在";
eLang.sensor_specific_event_strings[7][8] = "處理器被禁用";
eLang.sensor_specific_event_strings[7][9] = "檢測到 Terminator";
eLang.sensor_specific_event_strings[7][10] = "處理器自動調節";
eLang.sensor_specific_event_strings[7][11] = "電腦偵測到例外狀況";
eLang.sensor_specific_event_strings[7][12] = "可更正的機器檢查錯誤";

eLang.sensor_specific_event_strings[8] = new Array();
eLang.sensor_specific_event_strings[8][0] = "偵測到存在";
eLang.sensor_specific_event_strings[8][1] = "偵測到電源故障";
eLang.sensor_specific_event_strings[8][2] = "Predictive Failure Asserted";
eLang.sensor_specific_event_strings[8][3] = "失去電源輸入 （AC/DC）";
eLang.sensor_specific_event_strings[8][4] = "失去電源輸入或超出範圍";
eLang.sensor_specific_event_strings[8][5] = "存在電源輸入但超出範圍";
eLang.sensor_specific_event_strings[8][6] = "配置錯誤";

eLang.sensor_specific_event_strings[9] = new Array();
eLang.sensor_specific_event_strings[9][0] = "關機/電源關閉";
eLang.sensor_specific_event_strings[9][1] = "電源週期";
eLang.sensor_specific_event_strings[9][2] = "240 伏安 電源關閉";
eLang.sensor_specific_event_strings[9][3] = "Interlock 電源關閉";
eLang.sensor_specific_event_strings[9][4] = "失去 AC 電源輸入/失去電源輸入";
eLang.sensor_specific_event_strings[9][5] = "Soft Power Control Failure";
eLang.sensor_specific_event_strings[9][6] = "偵測到電源單元故障";
eLang.sensor_specific_event_strings[9][7] = "可預測的故障";

eLang.sensor_specific_event_strings[12] = new Array();
eLang.sensor_specific_event_strings[12][0] = "可修正的 ECC";
eLang.sensor_specific_event_strings[12][1] = "不可修正的 ECC";
eLang.sensor_specific_event_strings[12][2] = "Parity";
eLang.sensor_specific_event_strings[12][3] = "記憶體清除失敗";
eLang.sensor_specific_event_strings[12][4] = "記憶體設備停用";
eLang.sensor_specific_event_strings[12][5] = "達到可修正的 ECC 日誌記錄限制";
eLang.sensor_specific_event_strings[12][6] = "偵測到存在";
eLang.sensor_specific_event_strings[12][7] = "配置錯誤";
eLang.sensor_specific_event_strings[12][8] = "Spare";
eLang.sensor_specific_event_strings[12][9] = "記憶體自動調節";
eLang.sensor_specific_event_strings[12][10] = "關鍵過熱";

eLang.sensor_specific_event_strings[13] = new Array();
eLang.sensor_specific_event_strings[13][0] = "磁碟機存在";
eLang.sensor_specific_event_strings[13][1] = "磁碟機故障";
eLang.sensor_specific_event_strings[13][2] = "預測到的故障";
eLang.sensor_specific_event_strings[13][3] = "熱備援";
eLang.sensor_specific_event_strings[13][4] = "一致性檢查 / Parity 偵測進行中";
eLang.sensor_specific_event_strings[13][5] = "在關鍵陣列";
eLang.sensor_specific_event_strings[13][6] = "在故障陣列";
eLang.sensor_specific_event_strings[13][7] = "重新建立/重新對應 進行中";
eLang.sensor_specific_event_strings[13][8] = "重新建立/重新對應 已中止";

eLang.sensor_specific_event_strings[15] = new Array();
eLang.sensor_specific_event_strings[15][0] = "錯誤";
eLang.sensor_specific_event_strings[15][1] = "當機";
eLang.sensor_specific_event_strings[15][2] = "進行中";

eLang.sensor_specific_event_strings[16] = new Array();
eLang.sensor_specific_event_strings[16][0] = "停用可修正的記憶體錯誤日誌記錄";
eLang.sensor_specific_event_strings[16][1] = "停用事件 \"類型\" 日誌 ";
eLang.sensor_specific_event_strings[16][2] = "日誌區重置/清除";
eLang.sensor_specific_event_strings[16][3] = "停用所有事件日誌";
eLang.sensor_specific_event_strings[16][4] = "SEL 欄位已滿";
eLang.sensor_specific_event_strings[16][5] = "SEL 欄位幾乎要滿了";
eLang.sensor_specific_event_strings[16][6] = "停用可修正機器檢查錯誤日誌";

eLang.sensor_specific_event_strings[17] = new Array();
eLang.sensor_specific_event_strings[17][0] = "BIOS Watchdog 重啟";
eLang.sensor_specific_event_strings[17][1] = "OS Watchdog 重啟";
eLang.sensor_specific_event_strings[17][2] = "OS Watchdog 關閉";
eLang.sensor_specific_event_strings[17][3] = "OS Watchdog 電源關閉";
eLang.sensor_specific_event_strings[17][4] = "OS Watchdog 電源週期";
eLang.sensor_specific_event_strings[17][5] = "OS Watchdog NMI";
eLang.sensor_specific_event_strings[17][6] = "OS Watchdog 過期";
eLang.sensor_specific_event_strings[17][7] = "OS Watchdog Pre-timeout Interrupt，非 NMI";

eLang.sensor_specific_event_strings[18] = new Array();
eLang.sensor_specific_event_strings[18][0] = "系統重新配置";
eLang.sensor_specific_event_strings[18][1] = "OEM 系統 Boot 事件";
eLang.sensor_specific_event_strings[18][2] = "未確認的系統硬體故障";
eLang.sensor_specific_event_strings[18][3] = "新增欄位到輔助日誌";
eLang.sensor_specific_event_strings[18][4] = "PEF 動作";
eLang.sensor_specific_event_strings[18][5] = "時間戳記的時間進行同步";

eLang.sensor_specific_event_strings[19] = new Array();
eLang.sensor_specific_event_strings[19][0] = "前面板 NMI";
eLang.sensor_specific_event_strings[19][1] = "匯流排時";
eLang.sensor_specific_event_strings[19][2] = "I/O Channel Check NMI";
eLang.sensor_specific_event_strings[19][3] = "軟體 NMI";
eLang.sensor_specific_event_strings[19][4] = "PCI PERR";
eLang.sensor_specific_event_strings[19][5] = "PCI SERR";
eLang.sensor_specific_event_strings[19][6] = "EISA Fail Safe 逾時";
eLang.sensor_specific_event_strings[19][7] = "匯流排可修正的錯誤";
eLang.sensor_specific_event_strings[19][8] = "匯流排無法修正的錯誤";
eLang.sensor_specific_event_strings[19][9] = "Fetal NMI";
eLang.sensor_specific_event_strings[19][10] = "匯流排發生致命性錯誤";
eLang.sensor_specific_event_strings[19][11] = "Bus Degraded";

eLang.sensor_specific_event_strings[20] = new Array();
eLang.sensor_specific_event_strings[20][0] = "按下電源按鈕";
eLang.sensor_specific_event_strings[20][1] = "按下睡眠按鈕";
eLang.sensor_specific_event_strings[20][2] = "按下重新開機按鈕";
eLang.sensor_specific_event_strings[20][3] = "FRU Latch 打開";
eLang.sensor_specific_event_strings[20][4] = "FRU 請求服務按鈕";

eLang.sensor_specific_event_strings[25] = new Array();
eLang.sensor_specific_event_strings[25][0] = "Soft Power Control 錯誤";
eLang.sensor_specific_event_strings[25][1] = "極限溫度";

eLang.sensor_specific_event_strings[27] = new Array();
eLang.sensor_specific_event_strings[27][0] = "Cable/Interconnect 已連接";
eLang.sensor_specific_event_strings[27][1] = "配置錯誤";

eLang.sensor_specific_event_strings[29] = new Array();
eLang.sensor_specific_event_strings[29][0] = "Initiated By Power Up";
eLang.sensor_specific_event_strings[29][1] = "Initiated By Hard Reset";
eLang.sensor_specific_event_strings[29][2] = "Initiated By Warm Reset";
eLang.sensor_specific_event_strings[29][3] = "User Requested PXE Boot";
eLang.sensor_specific_event_strings[29][4] = "Automatic Boot to Diagnostic";
eLang.sensor_specific_event_strings[29][5] = "OS / run-time software initiated hard reset";
eLang.sensor_specific_event_strings[29][6] = "OS / run-time software initiated warm reset";
eLang.sensor_specific_event_strings[29][7] = "重開機";

eLang.sensor_specific_event_strings[30] = new Array();
eLang.sensor_specific_event_strings[30][0] = "不可開機的媒體";
eLang.sensor_specific_event_strings[30][1] = "不可開機的 碟片留在磁碟機中";
eLang.sensor_specific_event_strings[30][2] = "找不到 PXE 伺服器";
eLang.sensor_specific_event_strings[30][3] = "無效的開機區段";
eLang.sensor_specific_event_strings[30][4] = "暫停等使用者選取完開機的資源";

eLang.sensor_specific_event_strings[31] = new Array();
eLang.sensor_specific_event_strings[31][0] = "A：Boot 已完成 ";
eLang.sensor_specific_event_strings[31][1] = "C：Boot 已完成";
eLang.sensor_specific_event_strings[31][2] = "PXE Boot 已完成";
eLang.sensor_specific_event_strings[31][3] = "Diagnostic Boot 已完成";
eLang.sensor_specific_event_strings[31][4] = "CD-ROM Boot 已完成";
eLang.sensor_specific_event_strings[31][5] = "ROM Boot 已完成";
eLang.sensor_specific_event_strings[31][6] = "Boot Completed - 沒有指定 Boot 設備";

eLang.sensor_specific_event_strings[32] = new Array();
eLang.sensor_specific_event_strings[32][0] = "當 作業系統載入/初始化 時關鍵性停止";
eLang.sensor_specific_event_strings[32][1] = "Run-time 關鍵性停止";
eLang.sensor_specific_event_strings[32][2] = "OS 正常停止";
eLang.sensor_specific_event_strings[32][3] = "OS 正常關機";
eLang.sensor_specific_event_strings[32][4] = "Soft Shutdown initiated by PEF";
eLang.sensor_specific_event_strings[32][5] = "代理 (Agent) 沒有回應";

eLang.sensor_specific_event_strings[33] = new Array();
eLang.sensor_specific_event_strings[33][0] = "Fault Status Asserted";
eLang.sensor_specific_event_strings[33][1] = "Identify Status Asserted";
eLang.sensor_specific_event_strings[33][2] = "Slot/Connector 裝置 已安裝/連接上";
eLang.sensor_specific_event_strings[33][3] = "Slot/Connector 安裝裝置準備就緒";
eLang.sensor_specific_event_strings[33][4] = "Slot/Connector 移除裝置準備就緒";
eLang.sensor_specific_event_strings[33][5] = "Slot 電源已關閉";
eLang.sensor_specific_event_strings[33][6] = "Slot/Connector 設備卸載請求";
eLang.sensor_specific_event_strings[33][7] = "Interlock Asserted";
eLang.sensor_specific_event_strings[33][8] = "Slod 停用";
eLang.sensor_specific_event_strings[33][9] = "Slot Holds Spare Device";

eLang.sensor_specific_event_strings[34] = new Array();
eLang.sensor_specific_event_strings[34][0] = "S0/G0 正在工作";
eLang.sensor_specific_event_strings[34][1] = "S1 '系統硬體休眠中 & 處理器文件已維護'";
eLang.sensor_specific_event_strings[34][2] = "S2 '休眠, 處理器文件遺失'";
eLang.sensor_specific_event_strings[34][3] = "S3 '休眠, 處理器 & 硬體 文件遺失, 記憶體中已保留'";
eLang.sensor_specific_event_strings[34][4] = "S4 'Non-Volatile Sleeping/中止並存到硬碟中'";
eLang.sensor_specific_event_strings[34][5] = "S5/G2 'Soft Off'";
eLang.sensor_specific_event_strings[34][6] = "S4/S5 Soft Off, 特別的是 S4/S5 狀態無法決定";
eLang.sensor_specific_event_strings[34][7] = "G3 / 機器關閉";
eLang.sensor_specific_event_strings[34][8] = "Sleeping in S1、 S2 or S3";
eLang.sensor_specific_event_strings[34][9] = "G1 休眠";
eLang.sensor_specific_event_strings[34][10] = "S5 Entered By Override";
eLang.sensor_specific_event_strings[34][11] = "Legacy ON 狀態";
eLang.sensor_specific_event_strings[34][12] = "Legacy OFF 狀態";
eLang.sensor_specific_event_strings[34][13] = "未知";

eLang.sensor_specific_event_strings[35] = new Array();
eLang.sensor_specific_event_strings[35][0] = "計時器逾期";
eLang.sensor_specific_event_strings[35][1] = "Hard Reset";
eLang.sensor_specific_event_strings[35][2] = "關閉電源";
eLang.sensor_specific_event_strings[35][3] = "電源週期";
eLang.sensor_specific_event_strings[35][4] = "保留";
eLang.sensor_specific_event_strings[35][5] = "保留";
eLang.sensor_specific_event_strings[35][6] = "保留";
eLang.sensor_specific_event_strings[35][7] = "保留";
eLang.sensor_specific_event_strings[35][8] = "計時器中斷";

eLang.sensor_specific_event_strings[36] = new Array();
eLang.sensor_specific_event_strings[36][0] = "平臺產生的頁面";
eLang.sensor_specific_event_strings[36][1] = "平臺產生的 LAN Alert";
eLang.sensor_specific_event_strings[36][2] = "平臺產生的 Event Trap";
eLang.sensor_specific_event_strings[36][3] = "平臺產生 SNMP Trap，OEM 格式";

eLang.sensor_specific_event_strings[37] = new Array();
eLang.sensor_specific_event_strings[37][0] = "實體存在";
eLang.sensor_specific_event_strings[37][1] = "實體不存在";
eLang.sensor_specific_event_strings[37][2] = "實體被停用";

eLang.sensor_specific_event_strings[39] = new Array();
eLang.sensor_specific_event_strings[39][0] = "LAN Heartbeat Lost";
eLang.sensor_specific_event_strings[39][1] = "LAN Heartbeat";

eLang.sensor_specific_event_strings[40] = new Array();
eLang.sensor_specific_event_strings[40][0] = "感應器存取 已被降級或不可用";
eLang.sensor_specific_event_strings[40][1] = "控制器存取 已降級或不可用";
eLang.sensor_specific_event_strings[40][2] = "管理控制器離線";
eLang.sensor_specific_event_strings[40][3] = "管理控制器不可用";
eLang.sensor_specific_event_strings[40][4] = "感應器故障";
eLang.sensor_specific_event_strings[40][5] = "FRU 故障";

eLang.sensor_specific_event_strings[41] = new Array();
eLang.sensor_specific_event_strings[41][0] = "電量不足";
eLang.sensor_specific_event_strings[41][1] = "電池故障";
eLang.sensor_specific_event_strings[41][2] = "探測到電池存在";

eLang.sensor_specific_event_strings[42] = new Array();
eLang.sensor_specific_event_strings[42][0] = "Session Activated";
eLang.sensor_specific_event_strings[42][1] = "Session Deactivated";
eLang.sensor_specific_event_strings[42][2] = "Invalid Username or Password";
eLang.sensor_specific_event_strings[42][3] = "Invalid password disable";

eLang.sensor_specific_event_strings[43] = new Array();
eLang.sensor_specific_event_strings[43][0] = "偵測到硬體更改";
eLang.sensor_specific_event_strings[43][1] = "偵測到韌體 / 軟體更改";
eLang.sensor_specific_event_strings[43][2] = "偵測到硬體不相容";
eLang.sensor_specific_event_strings[43][3] = "偵測到韌體 / 軟體不相容";
eLang.sensor_specific_event_strings[43][4] = "無效或不支援的硬體版本";
eLang.sensor_specific_event_strings[43][5] = "無效或不支援的韌體 / 軟體版本";
eLang.sensor_specific_event_strings[43][6] = "偵測到硬體更改成功";
eLang.sensor_specific_event_strings[43][7] = "偵測到韌體 / 軟體更改成功";

eLang.sensor_specific_event_strings[44] = new Array();
eLang.sensor_specific_event_strings[44][0] = "FRU 未安裝";
eLang.sensor_specific_event_strings[44][1] = "FRU 處於非活動狀態";
eLang.sensor_specific_event_strings[44][2] = "FRU 啟動要求";
eLang.sensor_specific_event_strings[44][3] = "FRU 啟動進行中";
eLang.sensor_specific_event_strings[44][4] = "FRU 已啟動";
eLang.sensor_specific_event_strings[44][5] = "FRU 停用要求";
eLang.sensor_specific_event_strings[44][6] = "FRU 停用進行中";
eLang.sensor_specific_event_strings[44][7] = "FRU 失去連線";

eLang.sensor_specific_event_strings[240] = new Array();
eLang.sensor_specific_event_strings[240][0] = "過渡到 M0";
eLang.sensor_specific_event_strings[240][1] = "過渡到 M1";
eLang.sensor_specific_event_strings[240][2] = "過渡到 M2";
eLang.sensor_specific_event_strings[240][3] = "過渡到 M3";
eLang.sensor_specific_event_strings[240][4] = "過渡到 M4";
eLang.sensor_specific_event_strings[240][5] = "過渡到 M5";
eLang.sensor_specific_event_strings[240][6] = "過渡到 M6";
eLang.sensor_specific_event_strings[240][7] = "過渡到 M7";

eLang.sensor_specific_event_strings[241] = new Array();
eLang.sensor_specific_event_strings[241][0] = "IPMB A 停用、 IPMB B 停用";
eLang.sensor_specific_event_strings[241][1] = "IPMB A 啟用、 IPMB B 停用";
eLang.sensor_specific_event_strings[241][2] = "IPMB A 停用、 IPMB B 啟用";
eLang.sensor_specific_event_strings[241][3] = "IPMB A 啟用、 IPMP B 啟用";

eLang.sensor_specific_event_strings[242] = new Array();
eLang.sensor_specific_event_strings[242][0] = "Module Handle Closed";
eLang.sensor_specific_event_strings[242][1] = "Module Handle Opened";
eLang.sensor_specific_event_strings[242][2] = "Quiesced";

eLang.sensor_specific_event_strings[192] = new Array();
eLang.sensor_specific_event_strings[192][0] = "OEM 指定";
