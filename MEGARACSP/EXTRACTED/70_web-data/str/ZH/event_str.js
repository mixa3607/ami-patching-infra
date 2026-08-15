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

// File Name  : event_str.js
// Brief      : event page string table
// Author Name:

/******* Threshold Event Type Codes *********/
eLang.event_strings = new Array();
eLang.event_strings[1] = new Array();
eLang.event_strings[1][0] = "低非臨界 － 降低";
eLang.event_strings[1][1] = "低非臨界 － 升高";
eLang.event_strings[1][2] = "低臨界 － 降低";
eLang.event_strings[1][3] = "低臨界 － 升高";
eLang.event_strings[1][4] = "低不可恢復 － 降低";
eLang.event_strings[1][5] = "低不可恢復 － 升高";
eLang.event_strings[1][6] = "高非臨界 － 降低";
eLang.event_strings[1][7] = "高非臨界的 － 升高";
eLang.event_strings[1][8] = "高臨界 － 降低";
eLang.event_strings[1][9] = "高臨界 － 升高";
eLang.event_strings[1][10] = "高非恢復 － 降低";
eLang.event_strings[1][11] = "高非恢復 － 升高";

/******* Generic Discrete Event Type Codes *********/
eLang.event_strings[2] = new Array();
eLang.event_strings[2][0] = "轉成空閒";
eLang.event_strings[2][1] = "轉成活動";
eLang.event_strings[2][2] = "轉成忙碌";

/******* Digital Discrete Event Type Codes *********/
eLang.event_strings[3] = new Array();
eLang.event_strings[3][0] =      "State Deasserted";
eLang.event_strings[3][1] =      "State Asserted";

eLang.event_strings[4] = new Array();
eLang.event_strings[4][0] = "預測錯誤 Dessarted";
eLang.event_strings[4][1] = "預測故障 Asserted";

eLang.event_strings[5] = new Array();
eLang.event_strings[5][0] = "沒有超出限制";
eLang.event_strings[5][1] = "超過限制";

eLang.event_strings[6] = new Array();
eLang.event_strings[6][0] = "效能符合要求";
eLang.event_strings[6][1] = "效能落後";

eLang.event_strings[7] = new Array();
eLang.event_strings[7][0] = "轉到 OK";
eLang.event_strings[7][1] = "從 OK 轉至非臨界";
eLang.event_strings[7][2] = "從嚴重程度輕微轉至臨界";
eLang.event_strings[7][3] = "從嚴重程度輕微轉至不可恢復";
eLang.event_strings[7][4] = "從更嚴重轉至非臨界";
eLang.event_strings[7][5] = "從不可恢復轉至臨界";
eLang.event_strings[7][6] = "轉至不可恢復";
eLang.event_strings[7][7] = "監視器";
eLang.event_strings[7][8] = "資訊";

eLang.event_strings[8] = new Array();
eLang.event_strings[8][0] = "設備移除 / 設備缺席";
eLang.event_strings[8][1] = "插入設備 / 設備存在";

eLang.event_strings[9] = new Array();
eLang.event_strings[9][0] = "停用設備";
eLang.event_strings[9][1] = "啟用設備";

eLang.event_strings[10] = new Array();
eLang.event_strings[10][0] = "轉至運行";
eLang.event_strings[10][1] = "轉至測試";
eLang.event_strings[10][2] = "轉至關機";
eLang.event_strings[10][3] = "轉至上線";
eLang.event_strings[10][4] = "轉至下線";
eLang.event_strings[10][5] = "轉型上班";
eLang.event_strings[10][6] = "轉型降級";
eLang.event_strings[10][7] = "轉至節能";
eLang.event_strings[10][8] = "安裝錯誤";

eLang.event_strings[11] = new Array();
eLang.event_strings[11][0] =	     "Fully Redundant (Redundancy Regained)";
eLang.event_strings[11][1] =	     "Redundancy Lost";
eLang.event_strings[11][2] =	     "Redundancy Degraded";
eLang.event_strings[11][3] =	     "Non-redundant: Sufficient Resources from Redundant";
eLang.event_strings[11][4] =	     "Non-redundant: Sufficient Resources from Insufficient Resources";
eLang.event_strings[11][5] =	     "Non-redundant: Insufficient Resources";
eLang.event_strings[11][6] =	     "Redundancy Degraded From Fully Redundant";
eLang.event_strings[11][7] =	     "Redundancy Degraded From Non-redundant";

eLang.event_strings[12] = new Array();
eLang.event_strings[12][0] = "D0 電源狀態";
eLang.event_strings[12][1] = "D1 電源狀態";
eLang.event_strings[12][2] = "D2 電源狀態";
eLang.event_strings[12][3] = "D3 電源狀態";

eLang.event_strings["OEM_DISCRETE"] = "OEM Discrete";