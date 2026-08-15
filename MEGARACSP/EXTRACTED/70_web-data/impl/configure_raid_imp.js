//;*****************************************************************;
//;*****************************************************************;
//;**                                                             **;
//;**     (C) COPYRIGHT American Megatrends Inc. 2010-2012        **;
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

// File Name  : configure_raid_imp.js
// Brief      : This implementation is to configure RAID entries.
// Author Name: Kirankumar B

var RPCStatus = false;		//It is used to hold the RPC request status
var gphSet={};


var strMainPhysicalFields= [{"Device Id":""},
		{"Media Type":""},
		{"State":""},
		{"Slot":""},
		{"Speed":""},
		{"Link Speed":""},
		{"Size (GB)":""},
		{"Temp (°C)":""}
		];

var strPopupPhysicalFields= [{"Vendor Id":""},
		{"Product Id":""},
		{"Serial Number":""},
		{"Power State":""},
		{"Drive Presense":""},
		{"LED Status":""},
		{"Interface Type":""},
		{"Drive Cache":""},
		{"Block Size (GB)":""},
		{"SMART":""}
		];

var strMainPhysicalLogicalFields= [{"Element Type":""},
		{"Device Id":""},
		{"Media Type":""},
		{"State":""},
		{"Slot":""},
		{"Speed":""},
		{"Link Speed":""},
		{"Size (GB)":""},
		{"Temp (°C)":""}
		];

var strVirtualFields= [{"LD Name":""},
		{"Type":""},
		{"State":""},
		{"Stripe Size":""},
		/*{"Access Policy":""},*/
		{"Read Policy":""},
		{"Write Policy":""},
		{"Cache Policy":""},
		{"BGI":""},
		{"SSD Caching":""},
		{"Progress":""},
		{"Bad Blocks Table":""},
		{"Size (GB)":""},
		{"No.of Physical Devices":""},
		{"Physical Device Info":""}
		];
var strBBUFields= [{"Type:":""},
		{"Status:":""},
		{"Temp (°C):":""},
		{"Voltage (mV):":""},
		{"Current (mA):":""}
		];

var temp_EventData=[{ 'CTRLID' : 259,'RECORDID' : 1,'TIMESTAMP' : '1412342374','EVENTCODE' : '1','EVENTTYPE' : '1','EVENTCLASS' : '1','EVENTDESC' : 'N/A' },
                    { 'CTRLID' : 259,'RECORDID' : 2,'TIMESTAMP' : '1412342374','EVENTCODE' : '1','EVENTTYPE' : '1','EVENTCLASS' : '1','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 3,'TIMESTAMP' : '1412342374','EVENTCODE' : '1','EVENTTYPE' : '1','EVENTCLASS' : '1','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 4,'TIMESTAMP' : '1412342374','EVENTCODE' : '2','EVENTTYPE' : '2','EVENTCLASS' : '2','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 5,'TIMESTAMP' : '1412342374','EVENTCODE' : '2','EVENTTYPE' : '2','EVENTCLASS' : '2','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 6,'TIMESTAMP' : '1412342374','EVENTCODE' : '2','EVENTTYPE' : '2','EVENTCLASS' : '2','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 7,'TIMESTAMP' : '1412342374','EVENTCODE' : '3','EVENTTYPE' : '3','EVENTCLASS' : '3','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 8,'TIMESTAMP' : '1412342374','EVENTCODE' : '3','EVENTTYPE' : '3','EVENTCLASS' : '3','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 259,'RECORDID' : 9,'TIMESTAMP' : '1412342374','EVENTCODE' : '3','EVENTTYPE' : '3','EVENTCLASS' : '3','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 200,'RECORDID' : 10,'TIMESTAMP' : '1412342374','EVENTCODE' : '4','EVENTTYPE' : '4','EVENTCLASS' : '4','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 200,'RECORDID' : 11,'TIMESTAMP' : '1412342374','EVENTCODE' : '4','EVENTTYPE' : '4','EVENTCLASS' : '4','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 200,'RECORDID' : 12,'TIMESTAMP' : '1412342374','EVENTCODE' : '4','EVENTTYPE' : '4','EVENTCLASS' : '4','EVENTDESC' : 'N/A'},
                    { 'CTRLID' : 200,'RECORDID' : 13,'TIMESTAMP' : '1412342374','EVENTCODE' : '4','EVENTTYPE' : '4','EVENTCLASS' : '4','EVENTDESC' : 'N/A'}];

var temp_eventData=[{ 'RECORDID' : 1,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 0,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Firmware initialization started (PCI ID 005d/1000/9361/1000)' },
                    { 'RECORDID' : 2,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 1,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Firmware version 4.230.20-3532' },  
                    { 'RECORDID' : 3,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 142,'EVENTTYPE' : 4,'EVENTCLASS' : 1,'EVENTDESC' : 'Battery Not Present' },  
                    { 'RECORDID' : 4,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 261,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Package version 24.3.0-0050' },  
                    { 'RECORDID' : 5,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 266,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Board Revision 01D' }, 
                    { 'RECORDID' : 6,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 08(e0xfc/s5)' },  
                    { 'RECORDID' : 7,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 08(e0xfc/s5) Info: enclPd=fc, scsiType=0, portMap=02, sasAddr=4433221105000000,0000000000000000' },  
                    { 'RECORDID' : 8,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 09(e0xfc/s7)' },  
                    { 'RECORDID' : 9,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 09(e0xfc/s7) Info: enclPd=fc, scsiType=0, portMap=01, sasAddr=4433221107000000,0000000000000000' },  
                    { 'RECORDID' : 10,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0a(e0xfc/s3)' },  
                    { 'RECORDID' : 11,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0a(e0xfc/s3) Info: enclPd=fc, scsiType=0, portMap=03, sasAddr=5000cca01d143101,0000000000000000' },  
                    { 'RECORDID' : 12,'CTRLID' : 259,'TIMESTAMP' : 1412748836,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0b(e0xfc/s2)' },  
                    { 'RECORDID' : 13,'CTRLID' : 259,'TIMESTAMP' : 1412748837,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0b(e0xfc/s2) Info: enclPd=fc, scsiType=0, portMap=00, sasAddr=5000c500569cde2d,0000000000000000' },  
                    { 'RECORDID' : 14,'CTRLID' : 259,'TIMESTAMP' : 1412748837,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0c(e0xfc/s4)' }, 
                    { 'RECORDID' : 15,'CTRLID' : 259,'TIMESTAMP' : 1412748837,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0c(e0xfc/s4) Info: enclPd=fc, scsiType=0, portMap=04, sasAddr=5000cca01d142be5,0000000000000000' },  
                    { 'RECORDID' : 16,'CTRLID' : 200,'TIMESTAMP' : 1412748837,'EVENTCODE' : 499,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Boot Device reset, setting target ID as invalid' }, 
                    { 'RECORDID' : 17,'CTRLID' : 259,'TIMESTAMP' : 1412748837,'EVENTCODE' : 195,'EVENTTYPE' : 4,'EVENTCLASS' : 1,'EVENTDESC' : 'BBU disabled; changing WB virtual disks to WT, Forced WB VDs are not affected' }, 
                    { 'RECORDID' : 18,'CTRLID' : 200,'TIMESTAMP' : 1412748837,'EVENTCODE' : 44,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Time established as 10/07/14 12:52:05; (364 seconds since power on)' },  
                    { 'RECORDID' : 19,'CTRLID' : 200,'TIMESTAMP' : 1412750158,'EVENTCODE' : 0,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Firmware initialization started (PCI ID 005d/1000/9361/1000)' },  
                    { 'RECORDID' : 20,'CTRLID' : 200,'TIMESTAMP' : 1412750158,'EVENTCODE' : 1,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Firmware version 4.230.20-3532' },  
                    { 'RECORDID' : 21,'CTRLID' : 259,'TIMESTAMP' : 1412750158,'EVENTCODE' : 142,'EVENTTYPE' : 4,'EVENTCLASS' : 1,'EVENTDESC' : 'Battery Not Present' },  
                    { 'RECORDID' : 22,'CTRLID' : 259,'TIMESTAMP' : 1412750158,'EVENTCODE' : 261,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Package version 24.3.0-0050' },  
                    { 'RECORDID' : 23,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 266,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Board Revision 01D' },  
                    { 'RECORDID' : 24,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 08(e0xfc/s5)' },  
                    { 'RECORDID' : 25,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 08(e0xfc/s5) Info: enclPd=fc, scsiType=0, portMap=04, sasAddr=4433221105000000,0000000000000000' },  
                    { 'RECORDID' : 26,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 09(e0xfc/s7)' },  
                    { 'RECORDID' : 27,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 09(e0xfc/s7) Info: enclPd=fc, scsiType=0, portMap=03, sasAddr=4433221107000000,0000000000000000' },  
                    { 'RECORDID' : 28,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0a(e0xfc/s3)' },  
                    { 'RECORDID' : 29,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0a(e0xfc/s3) Info: enclPd=fc, scsiType=0, portMap=01, sasAddr=5000cca01d143101,0000000000000000' }, 
                    { 'RECORDID' : 30,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0b(e0xfc/s2)' },  
                    { 'RECORDID' : 31,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0b(e0xfc/s2) Info: enclPd=fc, scsiType=0, portMap=00, sasAddr=5000c500569cde2d,0000000000000000' },  
                    { 'RECORDID' : 32,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 91,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0c(e0xfc/s4)' },  
                    { 'RECORDID' : 33,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 247,'EVENTTYPE' : 2,'EVENTCLASS' : 0,'EVENTDESC' : 'Inserted: PD 0c(e0xfc/s4) Info: enclPd=fc, scsiType=0, portMap=02, sasAddr=5000cca01d142be5,0000000000000000' },  
                    { 'RECORDID' : 34,'CTRLID' : 200,'TIMESTAMP' : 1412750159,'EVENTCODE' : 499,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Boot Device reset, setting target ID as invalid' },  
                    { 'RECORDID' : 35,'CTRLID' : 259,'TIMESTAMP' : 1412750159,'EVENTCODE' : 195,'EVENTTYPE' : 4,'EVENTCLASS' : 1,'EVENTDESC' : 'BBU disabled; changing WB virtual disks to WT, Forced WB VDs are not affected' },  
                    { 'RECORDID' : 36,'CTRLID' : 200,'TIMESTAMP' : 1412750159,'EVENTCODE' : 44,'EVENTTYPE' : 6,'EVENTCLASS' : 0,'EVENTDESC' : 'Time established as 10/07/14 13:31:16; (39 seconds since power on)' },  {} ];
var temp_physicalData=[
    { 'CtrlID' : 259,'DevID' : 9,'Type' : 0,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0007','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 2,'Cache' : 0,'Speed' : 3,'Size' : 4,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 52 },	
	{ 'CtrlID' : 259,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },
	{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008','SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,'PowerState' : 3,'Temperature' : 0,'Smart' : 1 }];
var RAID_INFO_DATA;
var RAID_STORAGE_INFO_DATA;
var RAID_PHYSICAL_INFO_DATA;
var RAID_LOGICAL_INFO_DATA;
var RAID_BBU_INFO_DATA;

var eventRAIDLogTable;//List grid object to hold event records.
var PhysicalRAIDLogTable;//List grid object to hold Physical records.
var PopupRAIDLogTable;//List grid object to hold pop up Physical/Logical records.
var LogicalRAIDLogTable;//List grid object to hold Physical records.

var RAID_EVENT_LOG_DATA;

var isFromGraph= false;
var FromGraphSelectedEventType=ALL_EVENTS;
//var gphSet = {};
/*
 * The following are the constants used in this implementation.
 * The below listed is for event type filters available.
 */
var EVENT_PAGE_SIZE = 50;	//Maximum no. of entries in one page.
var MAX_EVENT_TYPE = 9;		//0 to 8, Filter of Event type
var MAX_RAID_INFO_FIELDS = 13;		//0 to 13, fields of RAID Info //health status has been hidden
var MAX_RAID_STORAGE_INFO_FIELDS = 3;		//0 to 2, fields of RAID Storage Info
var MAX_RAID_BBU_INFO_FIELDS = 5;		//0 to 4, fields of RAID BBU Info

var ALL_EVENTS = 0;		//Filter for all events.
var LD_EVT = 1;		//System Event Record tye.
var PD_EVT = 2;		//OEM Event record type.
var ENCLOSURE_EVT = 3;		//BIOS generated events.
var BBU_EVT = 4;		//SMI Handler Events
var SAS_EVT = 5;		//System Management Software events
var CONTROLLER_EVT = 6;	//System Software - OEM Events
var CONFIGURATION_EVT = 7;		//Remote Console Software Events
var CLUSTER_EVT = 8;		//Terminal Mode RCS Events
var RAID_EVENT_LOG_CODE = [];

var clearlog = false;	//Flag to check for clear log event.
var bmcUTCString;		//BMC UTC Timestamp value in string
var clientUTCSeconds;	//Client UTC seconds in integer
//This constants used for page navigations.
var FIRSTPAGE = 1;
var MOVEFIRST = 1;
var MOVEPREVIOUS = 2;
var MOVENEXT = 3;
var MOVELAST = 4;

var sensorNameType = [];	//Array of Sensor Name Filter
var sensorNameCount = [];	//Array holds count of events in each Sensor Name
var sensorNamePage = [];	//Array holds object of event's index for each Sensors
var eventTypeCount = [];	//Array holds count of events in each Event type
var eventTypePage = [];		//Array holds object of event's index for each event type
var bkupPageNumber;		//Back up page number
var CONST_TIMEOUT = 2000;		//Constant to hold the timeout value


/* RAID Physical Information flags*/
var IsRAIDChanged=false;

var EventType={};
var strRADINames={};
var temp_raidInfoData;
var isEventsClear=false;

function doInit() {
	exposeElms([
	    "_storageSummary",
		"_raidInfo",
		"_physicalInfo",
		"_virtualInfo",
		"_raidEvents",
		"_BBUInfo",
		"_btnPopup",
		"_lstRAIDController",
		"_listGridRAIDHolder",
		"_lblHeader",
		"_btnFirst",
		"_btnPrevious",
		"_btnNext",
		"_btnLast",
		"_txtPage",
		"_rdoBMCTzone",
		"_rdoClientTzone",
		"_lblUTCOffset",
		"_btnClearLog",
		"_trEventLog",
		"_lstEventType",
		"_infoRAIDGraph",
		"_trbtnClearEvent",
		"_tabContainer"
		]);
	
	raidInfo.onclick = doRAIDInfo;
	storageSummary.onclick = doStorageSummary;
	physicalInfo.onclick = doPhysialInfo;
	virtualInfo.onclick = doVirtualInfo;
	BBUInfo.onclick = doBBUInfo;
	raidEvents.onclick = doEventLog;
	btnPopup.onclick=displayPhysicalPopup;
	lstRAIDController.onchange=changeRAIDData;
	
	btnClearLog.onclick = clearRAIDEvents;
	
	btnFirst.onclick = function () {
		movePage(MOVEFIRST);
	}
	btnPrevious.onclick = function () {
		movePage(MOVEPREVIOUS);
	}
	btnNext.onclick = function () {
		movePage(MOVENEXT);
	}
	btnLast.onclick = function () {
		movePage(MOVELAST);
	}

	txtPage.onkeydown = movePageNumber;
	rdoBMCTzone.onclick = refreshEventTzone;
	rdoClientTzone.onclick = refreshEventTzone;
	initialRAIDEventCodeValues();
	_begin();
	
}

function _begin() {
	
	gphSet.bgColor = "rgba(255,255,255,1)";
	gphSet.width = 150;
	gphSet.height = 150;
	gphSet.borderWidth = 0;
	gphSet._gX = 0;
	gphSet._gY = 0;
	gphSet.canvasName = "RAIDgraphCanvas";
	gphSet.radius = 90;
	gphSet.graphTitle = "";
	gphSet.IsRAID=true;
	//gphSet.left=canvasOffsetleft();
	//gphSet.top=canvasOffsettop();
	
	tabContainer.style.width = (screen.width-53)+"px";
	
	//loadRAIDControllers();
	var tabLastVisit = tabParser(top.mainFrame.pageFrame.location.hash);
	if (tabLastVisit != null) {
		doRAIDInfo();
		//$(tabLastVisit).onclick();
	} else {
		doRAIDInfo();
	}
}

function canvasOffsetleft(){
	
	var canId= document.getElementById("RAIDgraphCanvas");
	if(canId != null)
	return elmOffset(canId,'Left');
}
function canvasOffsettop(){
	
	var canId= document.getElementById("RAIDgraphCanvas");
	if(canId != null)
	return elmOffset(canId,'Top');
}

/*
 * This will fill all the event types in the list box, also initializes with 
 * zero for the count value of the event type records.
 */
function fillEventType()
{
	var i;	//loop counter
	lstEventType.innerHTML = "";
	for (i = 0; i < MAX_EVENT_TYPE; i++) {
		lstEventType.add(new Option(eLang.getString("common", 
			"STR_RAID_EVENT_LOG_TYPE" + i), i), isIE ? i : null);
		eventTypeCount[i] = 0;
	}
}

function GetPhysicalType(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_TYPE0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_TYPE1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_TYPE2");
		break;
	default:
		result=type;
		break;
	}
	return result;
}

function GetPhysicalState(status) {
	var result;
	switch	(GET_ERROR_CODE(status)) {
	case 0x00 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE0");
		break;
	case 0x01 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE1");
		break;
	case 0x02 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE2");
		break;
	case 0x04 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE3");
		break;
	case 0x08 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE4");
		break;
	case 0x10 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE5");
		break;
	case 0x20 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_STATE6");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetTemperature(status) {
	var result;
	switch	(GET_ERROR_CODE(status)) {
	case 0xFF:
		result=eLang.getString("common","STR_RAID_TEMPRATURE_NOT_AVAILABLE");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetPhysicalSlotPresent(status) {
	var result;
	switch	(status) {
	case 1 :
		result=eLang.getString("common","STR_RAID_YES");
		break;
	case 0 :
		result=eLang.getString("common","STR_RAID_NO");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetPhysicalLEDStatus(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_NOT_AVAILABLE");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_ON");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_OFF");
		break;
	
	default:
		result=status;
		break;
	}
	return result;
}
function GetPhysicalInterfaceType(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_INTERFACE_TYPE0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_INTERFACE_TYPE1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_INTERFACE_TYPE2");
		break;
	case 3 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_INTERFACE_TYPE3");
		break;
	case 4 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_INTERFACE_TYPE4");
		break;
	default:
		result=status;
		break;
		
	}
	return result;
}

function GetPhysicalCache(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_NOT_AVAILABLE");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_DISBALED");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_ENABLED");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetPhysicalSpeed(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SPEED_LINK0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SPEED_LINK1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SPEED_LINK2");
		break;
	case 3 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SPEED_LINK3");
		break;
	case 4 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SPEED_LINK4");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetPhysicalPowerStatus(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_POWER_STATUS_UP");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_POWER_STATUS_DOWN");
		break;
	default:
		result=status;
		break;
	}
	return result;
}
function GetPhysicalSmart(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_NOT_AVAILABLE");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SMART1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_PHYSICAL_SMART2");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetLogicalState(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_STATE0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_STATE1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_LOGICAL_STATE2");
		break;
	case 3 :
		result=eLang.getString("common","STR_RAID_LOGICAL_STATE3");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalAccessPolicy(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_ACCESS_POLICY0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_ACCESS_POLICY1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_LOGICAL_ACCESS_POLICY2");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalReadPolicy(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_READ_POLICY0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_READ_POLICY1");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalWritePolicy(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_WRITE_POLICY0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_WRITE_POLICY1");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalCachePolicy(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_CACHE_POLICY0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_CACHE_POLICY1");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalBGI(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_ENABLED");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_DISBALED");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalSSD(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_DISBALED");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_ENABLED");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalBadBlocks(type) {
	var result;
	switch	(type) {
	case 0 :
		result=eLang.getString("common","STR_RAID_LOGICAL_BAD_BLOCKS0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_LOGICAL_BAD_BLOCKS1");
		break;
	default:
		result=type;
		break;
	}
	return result;
}
function GetLogicalEncryptionType(type) {
	var result;
	switch	(type) {
	case 0 :
		result="None";
		break;
	case 1 :
		result="FDE";
		break;
	case 2 :
		result="Controller Based";
		break;
	default:
		result=type;
		break;
	}
	return result;
}

function GetBBUType(status) {
	var result;
	switch	(status) {
	case 0 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE0");
		break;
	case 1 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE1");
		break;
	case 2 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE2");
		break;
	case 3 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE3");
		break;
	case 4 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE4");
		break;
	case 5 :
		result=eLang.getString("common","STR_RAID_BBU_TYPE5");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetLogicalElementType(type) {
	var result;
	switch	(type) {
	case "0" :
		result=eLang.getString("common","STR_RAID_LOGICAL_ELEMENT_TYPE0");
		break;
	case "1" :
		result=eLang.getString("common","STR_RAID_LOGICAL_ELEMENT_TYPE1");
		break;
	case "2" :
		result=eLang.getString("common","STR_RAID_LOGICAL_ELEMENT_TYPE2");
		break;
	case "3" :
		result=eLang.getString("common","STR_RAID_LOGICAL_ELEMENT_TYPE3");
		break;
	default:
		result=status;
		break;
		
	}
	return result;
}


function GetRAIDEventType(code) {
	var result;
	switch	(GET_ERROR_CODE(code)) {
	case 0x00 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE0");
		break;
	case 0x01 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE1");
		break;
	case 0x02 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE2");
		break;
	case 0x03 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE3");
		break;
	case 0x04 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE4");
		break;
	case 0x05 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE5");
		break;
	case 0x06 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE6");
		break;
	case 0x07 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE7");
		break;
	case 0x08 :
		result=eLang.getString("common","STR_RAID_EVENT_LOG_TYPE8");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

function GetRAIDEventClass(code) {
	var result;
	switch	(GET_ERROR_CODE(code)) {
	case 0x00 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS0");
		break;
	case 0x01 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS1");
		break;
	case 0x02 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS2");
		break;
	case 0x03 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS3");
		break;
	case 0x04 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS4");
		break;
	case 0x05 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS5");
		break;
	case 0x06 :
		result=eLang.getString("common","STR_RAID_LOGICAL_EVENT_CLASS6");
		break;
	default:
		result=status;
		break;
	}
	return result;
}

/* For Converting StripeSize*/
function GetStripeSize(value) {
	var byteValue= (512 * (Math.pow(2,value)))/1024;
	var originalValue=parseFloat(byteValue/1024).toFixed(3);
	return originalValue;
}

function GetLogicalProgress(value) {
	var result;
	switch	(GET_ERROR_CODE(value)) {
	case 0xFF :
		result=eLang.getString("common","STR_RAID_NOT_AVAILABLE");
		break;
	default:
		result=value;
		break;
	}
	return result;
}

function getRAIDCtrlInformation() {
	//alert('in ctrl call');
	showWait(true, "Populating");
	xmit.get({url:"/rpc/getraidinfo.asp", onrcv:getRaidInfoRes, status:""});
}

function getRaidInfoRes(arg) {
	var errstr;
	listGridRAIDHolder.innerHTML = "";
	//arg.HAPI_STATUS=0;
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0xFF:
			disableControls();
			break;
		case 0x182:
		case 0x81:
		case 0x1D5:
			alert(eLang.getString("common", "STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"));
			break;
		case 0x82:
			alert(eLang.getString("common", "STR_RAID_INVALID_CONTROLLER_ID"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	}else {
		if(RPCStatus==true) {
			RAID_INFO_DATA= [{ 'CtrlID' : 259,'AdapterName' : 'LSI MegaRAID 9361-8i',
				'SerialNum' : 'SV43206585','PkgVersion' : '24.3.0-0050',
				'BIOSVersion' : '6.17.04.0_4.16.08.0','UEFIVersion' : 'N/A',
				'ExpanderVersion' : 'N/A','SEEPROMVersion' : '3.1403.00-0079',
				'CPLDVersion' : 'N/A','PCIVendorID' : 4096,'PCIDeviceID' : 93,
				'PCISubVendorID' : 4096,'PCISubSytemID' : 37729,'TmmStatus' : 0,
				'ROCTemp' : 46,'ExpanderTemp' : 255,'CtrlHealth' : 0 },{ 'CtrlID' : 200,'AdapterName' : 'LSI MegaRAID Testing',
					'SerialNum' : 'SV43206585','PkgVersion' : '24.3.0-0050',
					'BIOSVersion' : '6.17.04.0_4.16.08.0','UEFIVersion' : 'N/A',
					'ExpanderVersion' : 'N/A','SEEPROMVersion' : '3.1403.00-0079',
					'CPLDVersion' : 'N/A','PCIVendorID' : 4096,'PCIDeviceID' : 93,
					'PCISubVendorID' : 4096,'PCISubSytemID' : 37729,'TmmStatus' : 0,
					'ROCTemp' : 46,'ExpanderTemp' : 255,'CtrlHealth' : 0 }];
			
			getUTCOffset(getUTCOffsetRes);
			
		} else {
			
			RAID_INFO_DATA = WEBVAR_JSONVAR_GETRAIDCTRLINFO.WEBVAR_STRUCTNAME_GETRAIDCTRLINFO;
			temp_raidInfoData= RAID_INFO_DATA;
			getUTCOffset(getUTCOffsetRes);
			
			
			//drawRAIDEventsGraph();
			/*if(raidInfo.style.fontWeight == "bold" ) {
				getRAIDEventLog();	
			}*/
		}
		if(RAID_INFO_DATA.length==0) {
			lstRAIDController.disabled=true;
			btnPopup.disabled=true;
		} else {
			lstRAIDController.disabled=false;
			if(IsRAIDChanged==false) {
				loadRAIDControllers();
			}
			if(raidInfo.style.fontWeight == "bold" ) {
				/*if(gRAIDEventData != undefined) {
					gRAIDEventData= undefined;
					parent.gRAIDEventData= undefined;
					redrawGrpah(lstRAIDController.value);
				}*/
				
				buildRAIDInformation();
				
				//alert("IsRAIDChanged value " + IsRAIDChanged);
				//alert("isEventsClear clear "+ isEventsClear);
				if(isEventsClear==true) {
					//alert('inside isEventsClear');
					//alert(lstRAIDController.value);
					gRAIDEventData= undefined;
					parent.gRAIDEventData= undefined;
					redrawGrpah(lstRAIDController.value);
				}
				
				/*if(RAID_EVENT_LOG_DATA== null || RAID_EVENT_LOG_DATA == undefined) {
					alert('inside RAID_EVENT_LOG_DATA null of getRaidInfoRes');
					redrawGrpah(lstRAIDController.value);
				}*/
			}
		}
	}
}

function disableControls() {
	lstRAIDController.disabled=true;
}

function loadRAIDControllers(){
	lstRAIDController.innerHTML = "";
	
	//alert('insode loadRAIDControllers');
	//alert(RAID_INFO_DATA);
	//alert(RAID_INFO_DATA.length);
	/*if(RAID_INFO_DATA== undefined) {
		getRAIDCtrlInformation();
	}*/
	
	//if(RAID_INFO_DATA != null && RAID_INFO_DATA != undefined) {
		for (i = 0; i < RAID_INFO_DATA.length; i++) {
			var name= RAID_INFO_DATA[i].AdapterName + "  (" + RAID_INFO_DATA[i].CtrlID + ")";
			//alert("inside combo");
			//strRADINames.push({Name:name,value:RAID_INFO_DATA[i].CtrlID});
			lstRAIDController.add(new Option(name, 
					RAID_INFO_DATA[i].CtrlID), isIE ? i : null);
		}
	//}
}

function changeRAIDData() {
	IsRAIDChanged=true;
	if(raidInfo.style.fontWeight == "bold") {
		doRAIDInfo();
		//buildRAIDInformation();
		//drawRAIDEventsGraph();
		isEventsClear=false;
		gRAIDEventData= undefined;
		parent.gRAIDEventData= undefined;
		redrawGrpah(lstRAIDController.value);
	} else if(physicalInfo.style.fontWeight == "bold") {
		doPhysialInfo();
	}else if(virtualInfo.style.fontWeight == "bold") {
		doVirtualInfo();
	}else if(BBUInfo.style.fontWeight == "bold") {
		doBBUInfo();
	}else if(raidEvents.style.fontWeight == "bold") {
		doEventLog();
	}else if(storageSummary.style.fontWeight == "bold") {
		doStorageSummary();
	}
}

function clearRAIDUI() {
	storageSummary.style.fontWeight = "normal";
	raidInfo.style.fontWeight = "normal";
	physicalInfo.style.fontWeight = "normal";
	virtualInfo.style.fontWeight = "normal";
	BBUInfo.style.fontWeight = "normal";
	raidEvents.style.fontWeight = "normal";
	listGridRAIDHolder.innerHTML = "";
	btnPopup.className="hiddenRow";
	trEventLog.className="hiddenRow";
	//btnClearLog.className="hiddenRow";
	infoRAIDGraph.className="hiddenRow";
	trbtnClearEvent.className="hiddenRow";
	
	var raidcan= document.getElementsByTagName("CANVAS");
	
	if(raidcan != null && raidcan.length > 0) {
		if(raidcan[0]!= undefined)
		raidcan[0].className="hiddenRow";
		if(raidcan[1]!= undefined)
		raidcan[1].className="hiddenRow";
	}
	
	
	//isFromGraph=false;
}

function doStorageSummary() {
	clearRAIDUI();
	storageSummary.style.fontWeight = "bold";
	getStorageInformation();
	reloadHelp();
	/*loadPEFPageElements();
	initPEFAction();
	getAllPEFCfg();
	
	reloadHelp();*/
}

function doRAIDInfo() {
	clearRAIDUI();
	raidInfo.style.fontWeight = "bold";
	getRAIDCtrlInformation();
	reloadHelp();
	//buildRAIDInformation();
	/*loadAlertPolicyElements();
	getAllPolicyCfg();
	initPolicyAction();
	
	reloadHelp();*/
}

function doPhysialInfo() {
	clearRAIDUI();
	physicalInfo.style.fontWeight = "bold";
	//loadRAIDPhysicalCustomPageElements();
	getRAIDPhysicalInformation();
	//btnPopup.className="visibleRow";
	reloadHelp();
	/*loadLANDestElements();
	initLANDestAction();
	reloadHelp();*/
}

function doVirtualInfo() {
	
	clearRAIDUI();
	virtualInfo.style.fontWeight = "bold";
	//btnPopup.className="visibleRow";
	getRAIDLogicalInformation();
	reloadHelp();
	/*loadLANDestElements();
	initLANDestAction();
	reloadHelp();*/
}

function doEventLog() {
	
	clearRAIDUI();
	raidEvents.style.fontWeight = "bold";
	
	
	reloadHelp();
	trEventLog.className="visibleRow";
	//btnClearLog.className="visibleRow";
	trbtnClearEvent.className="visibleRow";
	
	
	fillEventType();
	
	if(isFromGraph) {
		lstEventType.value=FromGraphSelectedEventType;
	}
	
	//getUTCOffset(getUTCOffsetRes);
	
	loadRAIDEventCustomPageElements();
	
	lstEventType.onchange = comboRefresh;
	
	getRAIDEventLog();
	//displayRAIDEventLog();
	
	
	
	/*loadLANDestElements();
	initLANDestAction();
	reloadHelp();*/
}

function NavigateToEventLog(obj) {
	//var obj= this;
	if(obj != null)
	FromGraphSelectedEventType= obj.getAttribute("eventtype");
	//alert(obj.eventType);
	raidEvents.style.fontWeight = "bold";
	isFromGraph=true;
	//comboRefresh();
	doEventLog();
	
	//displayRAIDEventLog();
	//doEventLog();
}

/*
 * It will be invoked whenever the user filters the event records based on 
 * event type or sensor names.
 */
function comboRefresh()
{
	//alert('inside comborefresh');
	
	switch (parseInt(lstEventType.value)) {
	case ALL_EVENTS:
	default:
		//lstSensorName.disabled = true;
		//lstSensorName.value = 0;
		loadRAIDEventLogEntries(eventTypeCount, eventTypePage, lstEventType.value, FIRSTPAGE);
		break;
	}
}

function doBBUInfo() {
	
	clearRAIDUI();
	BBUInfo.style.fontWeight = "bold";
	getRAIDBBUInformation();
	reloadHelp();
	/*loadLANDestElements();
	initLANDestAction();
	reloadHelp();*/
}

/*
 * It will invoke the RPC method to clear the System Event entries.
 * Once it get response from RPC, on receive method will be called automatically.
 */
function clearRAIDEvents()
{
	//if (top.user.isAdmin()) {
		if (!RAID_EVENT_LOG_DATA.length) {
			alert(eLang.getString("common", "NO_SEL_STRING"));
			btnClearLog.disabled = true;
			return;
		}

		if (confirm(eLang.getString("common", "STR_EVENT_LOG_CLEAR_CONFIRM"))) {
			xmit.get({url:"/rpc/clearraidevents.asp", onrcv:clearRAIDEventsRes, status:"", 
				timeout:60});
		}
	//} else {
		//alert(eLang.getString("common","STR_CONF_ADMIN_PRIV"));
	//}
}
/*
*
* This is the response function for clearSEL RPC. 
* Need to check HAPI_STATUS, intimate end user if it returns non-zero value.
* If success, move the response data to the global variable and invoke the 
* method to load the data value in UI. 
* @param arg object, RPC response data from xmit library
*/
function clearRAIDEventsRes(arg)
{
	if (arg.HAPI_STATUS) {
		errstr = eLang.getString("common", "STR_EVENT_LOG_CLEARLOG");
		errstr +=  (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		clearlog = true;
		//parent.web_alerts.lastEventId = 0;
		alert(eLang.getString("common", "STR_RAID_EVENT_LOG_CLEAR_SUCCESS"));
		isEventsClear=true;
		//getRAIDEventLog();
		doEventLog();
	}
}
/*
 * This event is triggered whenever the user enters the page number to navigate.
 * @param e, keyboard event.
 */
function movePageNumber(e)
{
	var pageCount;
	var sensorIndex;
	var pageIndex;
	var keycode;

	if (window.event) { //IE
		keycode = window.event.keyCode;
	} else if (e.which) { //Netscape/Firefox/Opera
		keycode = e.which
	}

	if(keycode == 13) { //13-Enter keycode
		pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
		
		/*if (parseInt(lstSensorName.value) != ALL_SENSORS) {
			
			sensorIndex = parseInt(lstSensorName.value) - 1;
			pageCount = Math.ceil(sensorNameCount[sensorIndex] / EVENT_PAGE_SIZE);
		} else {
			pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
		}*/

		if (eVal.isnumstr(txtPage.value, FIRSTPAGE, pageCount)) {
			pageIndex = parseInt(txtPage.value);
			
			loadRAIDEventLogEntries(eventTypeCount, eventTypePage, 
					lstEventType.value, pageIndex);
			
			/*if (parseInt(lstSensorName.value) != ALL_SENSORS) {
				loadRAIDEventLogEntries(sensorNameCount, sensorNamePage, sensorIndex, 
					pageIndex);
			} else {
				loadRAIDEventLogEntries(eventTypeCount, eventTypePage, 
					lstEventType.value, pageIndex);
			}*/
		} else {
			alert (eLang.getString("common", "STR_INVALID_PAGENO") + 
				eLang.getString("common", "STR_HELP_INFO"));
			txtPage.value = bkupPageNumber;
		}
	}
}
/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDEventCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	eventRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_SEL_STRING"),
		doAllowNoSelect : false
	});

	//add the list grid to the body division
	listGridRAIDHolder.appendChild(eventRAIDLogTable.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD1"), fieldType:2, 
			w:"7%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD2"), w:"18%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD3"), w:"23%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD4"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD5"), w:"37%", textAlign:"center"}
		//{text:eLang.getString("common", "STR_RAID_EVENT_LOG_HEAD6"), w:"10%", textAlign:"center"}
		]};
	eventRAIDLogTable.loadFromJson(tblJSON);
	
	
	eventRAIDLogTable.ondblclick = function(selectedRow)
	{
		var eventId = getRAIDEventId(parseInt(selectedRow.cells[0].innerHTML));
		if(eventId != null) {
			var descFrame = getDescFrame();
			
			//var data = processEventRecordForGraph(RAID_EVENT_LOG_DATA[eventId]);
			
			var eventType=(RAID_EVENT_LOG_DATA[eventId].EVENTTYPE == 0x00) ? "Unknown" : GetRAIDEventType(RAID_EVENT_LOG_DATA[eventId].EVENTTYPE);
			var ctrlName= lstRAIDController.options[lstRAIDController.selectedIndex].text;

			
			var heading = document.createElement("h3");
			heading.innerHTML = ctrlName + "<font class='grey'> - " + eventType + "</font>";

			var description = document.createElement("p");
			
			description.innerHTML = RAID_EVENT_LOG_DATA[eventId].EVENTDESC;
			description.innerHTML += "<br/>";
			
			descFrame.appendChild(heading);
			descFrame.appendChild(description);
		}
	}
}

function getRAIDEventId(id)
{
	for(var eid=0; eid < RAID_EVENT_LOG_DATA.length; eid++) {
		if(RAID_EVENT_LOG_DATA[eid].RECORDID == id) {
			return eid;
		}
	}
	return null;
}
/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDPhysicalCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	PhysicalRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_RAID_PHYSICAL_STRING"),
		doAllowNoSelect : false
	});

	//add the list grid to the body division
	listGridRAIDHolder.appendChild(PhysicalRAIDLogTable.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD1"), fieldType:2, 
			w:"7%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD2"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD3"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD4"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD5"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD6"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD7"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD8"), w:"13%", textAlign:"center"}
		
		]};
	PhysicalRAIDLogTable.loadFromJson(tblJSON);
	
	PhysicalRAIDLogTable.ondblclick= function(){};
}


function loadRAIDPhysicalData() {
	
	var JSONRows = [];
	showWait(true, "Populating");
	PhysicalRAIDLogTable.clear();
	var l=0;
	for (j = 0; j < RAID_PHYSICAL_INFO_DATA.length; j++) {
		
		var data = RAID_PHYSICAL_INFO_DATA[j];
		
		if (j >= RAID_PHYSICAL_INFO_DATA.length) {
			break;
		}
		
		var mediaType=GetPhysicalType(data.Type);
		var state=GetPhysicalState(data.State);
		var slot=data.Slot;
		var speed=GetPhysicalSpeed(data.Speed);
		var linkspeed=GetPhysicalSpeed(data.LinkSpeed);
		var size=data.Size;
		var temp=GetTemperature(data.Temperature);
		
		if(lstRAIDController.value == data.CtrlID) {
		JSONRows.push({cells:[
			{text:parseInt(data.DevID), value:parseInt(data.DevID)},
			{text:mediaType, value:mediaType},
			{text:state, value:state},
			{text:slot, value:slot},
			{text:speed, value:speed},
			{text:linkspeed, value:linkspeed},
			{text:size, value:size},
			{text:temp, value:temp}
			]});
		}
	}

	tblJSON.rows = JSONRows;
	PhysicalRAIDLogTable.loadFromJson(tblJSON);
}


/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDPhysicalPopupCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	PopupRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_RAID_PHYSICAL_STRING"),
		doAllowNoSelect : false
	});

	
	var descFrame = getDescFrame();
	
	var heading = document.createElement("h3");
	heading.innerHTML ="Controller Name :"+ lstRAIDController.options[lstRAIDController.selectedIndex].text;	
	
	descFrame.appendChild(heading);
	descFrame.appendChild(PopupRAIDLogTable.table);
	
	descFrame.onclose= function() {
	    doPhysialInfo();
	}
	
	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD1"), fieldType:2, 
			w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD2"), fieldType:2, 
			w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD3"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD4"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD5"), w:"15%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD6"), w:"37%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD7"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD8"), w:"15%", textAlign:"center"}
		//{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD9"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD10"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_PHYSICAL_HEAD11"), w:"13%", textAlign:"center"}
		]};
	PopupRAIDLogTable.loadFromJson(tblJSON);
	
	PopupRAIDLogTable.ondblclick= function(){};
}


function loadRAIDPhysicalPopupData() {
	
	var JSONRows = [];
	//showWait(true, "Populating");
	PopupRAIDLogTable.clear();
	var l=0;
	for (j = 0; j < RAID_PHYSICAL_INFO_DATA.length; j++) {
		
		var data = RAID_PHYSICAL_INFO_DATA[j];
		
		if (j >= RAID_PHYSICAL_INFO_DATA.length) {
			break;
		}
		
		var state=GetPhysicalPowerStatus(data.PowerState);
		//var presence=GetPhysicalSlotPresent(data.Present);
		var ledstatus=GetPhysicalLEDStatus(data.LEDStatus);
		var speed=GetPhysicalSpeed(data.Speed);
		var interfacetype=GetPhysicalInterfaceType(data.InterfaceType);
		
		var cache=GetPhysicalCache(data.Cache);
		var smart=GetPhysicalSmart(data.Smart);
		
		if(lstRAIDController.value == data.CtrlID) {
		JSONRows.push({cells:[
			{text:parseInt(data.DevID), value:parseInt(data.DevID)},
			{text:data.VendorID, value:data.VendorID},
			{text:data.ProductID, value:data.ProductID},
			{text:data.SerialNum, value:data.SerialNum},
			{text:state, value:state},
			//{text:presence, value:presence},
			//{text:ledstatus, value:ledstatus},
			{text:interfacetype, value:interfacetype}
			//{text:cache, value:cache},
			//{text:data.BlockSize, value:data.BlockSize},
			//{text:smart, value:smart}
			]});
		}
	}

	tblJSON.rows = JSONRows;
	PopupRAIDLogTable.loadFromJson(tblJSON);
}


/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDLogicalPopupCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	PopupRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_RAID_PHYSICAL_STRING"),
		doAllowNoSelect : false
	});
	
	var descFrame = getDescFrame();
	
	var heading = document.createElement("h3");
	heading.innerHTML ="Controller Name :"+ lstRAIDController.options[lstRAIDController.selectedIndex].text;	
	
	descFrame.appendChild(heading);
	descFrame.appendChild(PopupRAIDLogTable.table);
	
	descFrame.onclose= function() {
		doVirtualInfo();
	}
	
	tblJSON = {cols:[
		/*{text:eLang.getString("common", "STR_RAID_LOGICAL_POP_UP_HEAD1"), fieldType:2, 
			w:"10%", textAlign:"center"},*/
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD1"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD2"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD3"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD4"), w:"17%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD5"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD6"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD7"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_PHYSICAL_HEAD8"), w:"13%", textAlign:"center"}
		]};
	PopupRAIDLogTable.loadFromJson(tblJSON);
	PopupRAIDLogTable.ondblclick= function(){};
}


/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDLogicalCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	LogicalRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_RAID_LOGICAL_STRING"),
		doAllowNoSelect : false
	});

	//add the list grid to the body division
	listGridRAIDHolder.appendChild(LogicalRAIDLogTable.table);

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD1"), fieldType:2, 
			w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD2"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD3"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD4"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD5"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD6"), w:"15%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD7"), w:"15%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD8"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD9"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD10"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD11"), w:"10%", textAlign:"center"},
		//{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD12"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD13"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_LOGICAL_HEAD14"), w:"10%", textAlign:"center"}
		]};
	LogicalRAIDLogTable.loadFromJson(tblJSON);
	LogicalRAIDLogTable.ondblclick= function(){};
}


function loadRAIDLogicalData() {
	var JSONRows = [];
	showWait(true, "Populating");
	LogicalRAIDLogTable.clear();
	var l=0;
	for (j = 0; j < RAID_LOGICAL_INFO_DATA.length; j++) {
		
		var data = RAID_LOGICAL_INFO_DATA[j];
		
		if (j >= RAID_LOGICAL_INFO_DATA.length) {
			break;
		}
		
		var ldname =(data.LDName=="")?"Not Available":data.LDName;
		
		var type=data.Type;
		var state=GetLogicalState(data.State);
		var stripesize=GetStripeSize(data.StripeSize);
		
		var rpolicy=GetLogicalReadPolicy(data.ReadPolicy);
		var wpolicy=GetLogicalWritePolicy(data.WritePolicy);
		var cpolicy=GetLogicalCachePolicy(data.CachePolicy);
		var bgi=GetLogicalBGI(data.BGI);
		var ssd=GetLogicalSSD(data.SSD_Caching);
		var progress=GetLogicalProgress(data.Progress);
		var badblocks=GetLogicalBadBlocks(data.BadBlocks);
		var size=data.Size;
		var elenum=data.ElementsNum;
		var elements=data.Elements;
		
		var elementsInfo = "<a href='#' ElementsData="+ elements +" onclick='DisplayLogicalPopUp(this);'>" + eLang.getString("common", "STR_VIEW") + "</a>";
		
		if(lstRAIDController.value == data.CtrlID) {
		JSONRows.push({cells:[
			{text:ldname, value:ldname},
			{text:type, value:type},
			{text:state, value:state},
			//{text:stripesize, value:stripesize},
			{text:rpolicy, value:rpolicy},
			{text:wpolicy, value:wpolicy},
			{text:cpolicy, value:cpolicy},
			//{text:bgi, value:bgi},
			//{text:ssd, value:ssd},
			//{text:progress, value:progress},
			//{text:badblocks, value:badblocks},
			//{text:size, value:size},
			{text:elenum, value:elenum},
			{text:elementsInfo, value:elementsInfo}
			]});
		}
	}

	tblJSON.rows = JSONRows;
	LogicalRAIDLogTable.loadFromJson(tblJSON);
}
/*function loadRAIDLogicalPopupData() {
	
	var JSONRows = [];
	//showWait(true, "Populating");
	PopupRAIDLogTable.clear();
	var l=0;
	for (j = 0; j < RAID_LOGICAL_INFO_DATA.length; j++) {
		
		var data = RAID_LOGICAL_INFO_DATA[j];
		
		if (j >= RAID_LOGICAL_INFO_DATA.length) {
			break;
		}
		
		var state=GetPhysicalPowerStatus(data.PowerState);
		var presence=GetPhysicalSlotPresent(data.Present);
		var ledstatus=GetPhysicalLEDStatus(data.LEDStatus);
		var speed=GetPhysicalSpeed(data.Speed);
		var interfacetype=GetPhysicalInterfaceType(data.InterfaceType);
		
		var cache=GetPhysicalCache(data.Cache);
		var smart=GetPhysicalSmart(data.Smart);
		
		if(lstRAIDController.value == data.CtrlID) {
		JSONRows.push({cells:[
			{text:data.VendorID, value:data.VendorID},
			{text:data.ProductID, value:data.ProductID},
			{text:data.SerialNum, value:data.SerialNum},
			{text:state, value:state},
			{text:presence, value:presence},
			{text:ledstatus, value:ledstatus},
			{text:interfacetype, value:interfacetype},
			{text:cache, value:cache},
			{text:data.BlockSize, value:data.BlockSize},
			{text:smart, value:smart}
			]});
		}
	}

	tblJSON.rows = JSONRows;
	PopupRAIDLogTable.loadFromJson(tblJSON);
}*/


/*
 * This function is used to load the list grid and its header information.
 */
function loadRAIDLogicalMainPopupCustomPageElements()
{
	var lgHeight = parent.$("pageFrame").offsetHeight - 270;
	if(lgHeight < 45)
		lgHeight = 45;
	PopupRAIDLogTable = listgrid({
		w : "100%",
		h : lgHeight + "px",
		msg : eLang.getString("common", "NO_RAID_LOGICAL_STRING"),
		doAllowNoSelect : false
	});

	
	var descFrame = getDescFrame();
	
	var heading = document.createElement("h3");
	heading.innerHTML ="Controller Name :"+ lstRAIDController.options[lstRAIDController.selectedIndex].text;	
	
	descFrame.appendChild(heading);
	descFrame.appendChild(PopupRAIDLogTable.table);
	
	descFrame.onclose= function() {
		doVirtualInfo();
	}

	tblJSON = {cols:[
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD1"), fieldType:2, 
			w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD2"), w:"10%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD3"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD4"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD5"), w:"20%", textAlign:"center"},
		{text:eLang.getString("common", "STR_RAID_MAIN_POP_UP_LOGICAL_HEAD6"), w:"20%", textAlign:"center"}
		]};
	PopupRAIDLogTable.loadFromJson(tblJSON);
	PopupRAIDLogTable.ondblclick= function(){};
}


function loadRAIDLogicalMainPopupData() {
	
	var JSONRows = [];
	
	PopupRAIDLogTable.clear();
	
	var l=0;
	for (j = 0; j < RAID_LOGICAL_INFO_DATA.length; j++) {
		
		var data = RAID_LOGICAL_INFO_DATA[j];
		
		if (j >= RAID_LOGICAL_INFO_DATA.length) {
			break;
		}
		
		//var type=data.Type;
		//var state=GetLogicalState(data.State);
		var stripesize=GetStripeSize(data.StripeSize);
		
		//var rpolicy=GetLogicalReadPolicy(data.ReadPolicy);
		//var wpolicy=GetLogicalWritePolicy(data.WritePolicy);
		//var cpolicy=GetLogicalCachePolicy(data.CachePolicy);
		var bgi=GetLogicalBGI(data.BGI);
		var ssd=GetLogicalSSD(data.SSD_Caching);
		var progress=GetLogicalProgress(data.Progress);
		var badblocks=GetLogicalBadBlocks(data.BadBlocks);
		var size=data.Size;
		//var elenum=data.ElementsNum;
		//var elements=data.Elements;
		
		if(lstRAIDController.value == data.CtrlID) {
		JSONRows.push({cells:[
			{text:stripesize, value:stripesize},
			{text:bgi, value:bgi},
			{text:ssd, value:ssd},
			{text:progress, value:progress},
			{text:badblocks, value:badblocks},
			{text:size, value:size}
			]});
		}
	}
	tblJSON.rows = JSONRows;
	PopupRAIDLogTable.loadFromJson(tblJSON);
}


function getRAIDEventLog() {
	disableRAIDPageButtons();
	xmit.get({url:"/rpc/getraidalleventlogs.asp", onrcv:getRaidEventLogRes,
		status:""});
	//var arg=[{HAPI_STATUS:0}];
	//getRaidEventLogRes(arg);
}

function getRaidEventLogRes(arg) {
	//arg.HAPI_STATUS=0;
	//listGridRAIDHolder.innerHTML = "";
	if (arg.HAPI_STATUS) {
		errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
		alert(errstr);
	} else {
		if(RPCStatus==true) {
			RAID_EVENT_LOG_DATA = temp_eventData;
		}
		else {
			RAID_EVENT_LOG_DATA = WEBVAR_JSONVAR_RAID_GETEVENTLOG.WEBVAR_STRUCTNAME_RAID_GETEVENTLOG;
		}
		displayRAIDEventLog();
	}
}

function displayRAIDEventLog() {
	if(raidEvents.style.fontWeight == "bold") {
		if(RAID_EVENT_LOG_DATA != null && RAID_EVENT_LOG_DATA != undefined) {
			if (!RAID_EVENT_LOG_DATA.length && !clearlog) {
				alert(eLang.getString("common", "NO_SEL_STRING"));
				loadEmptyRAIDEventLogEntries();
				return;
			}
			clearlog = false;
			if (RAID_EVENT_LOG_DATA.length != 0) {
				//alert('in true');
				initializeAllEvents();
				initializeRAIDPageRange();
			
				if(isFromGraph==true) {
					loadRAIDEventLogEntries(eventTypeCount, eventTypePage, lstEventType.value, FIRSTPAGE);
				} else {
					loadRAIDEventLogEntries(eventTypeCount, eventTypePage, ALL_EVENTS, FIRSTPAGE);
				}
				isFromGraph=false;
			} else {
				loadEmptyRAIDEventLogEntries();
			}
		}
	}
}

/*
 * This function will be invoked to fill the page index for various
 * event type.
 */
function initializeRAIDPageRange()
{
	var ctrlid=lstRAIDController.value;
	
	for (j = 0; j < RAID_EVENT_LOG_DATA.length; j++) {
		 if(ctrlid== RAID_EVENT_LOG_DATA[j].CTRLID) {
			 if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x01) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, LD_EVT, j);
				} else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x02) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, PD_EVT, j);
				} else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x03) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, ENCLOSURE_EVT, j);
				}else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x04) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, BBU_EVT, j);
				}else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x05) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, SAS_EVT, j);
				}else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x06) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, CONTROLLER_EVT, j);
				}else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x07) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, CONFIGURATION_EVT, j);
				}else if(RAID_EVENT_LOG_DATA[j].EVENTTYPE == 0x08) {
					initializeRAIDEventFilter(eventTypePage, eventTypeCount, CLUSTER_EVT, j);
				}
		 }
	}
}

/*
 * This function will initialize the SEL entries based on event type and 
 * sensor names.
 * @filterTypePage, Object of the event's index for event type or sensor name.
 * @filterTypeCount, Object of the record's count for event type or sensor name.
 * @lstIndex, Index of the event type of sensor name.
 * @eventIndex, Index of the event to be initialized.
 */
function initializeRAIDEventFilter(filterTypePage, filterTypeCount, lstIndex, eventIndex)
{
	var pageCount = 0;
	filterTypeCount[lstIndex] += 1;
	if (filterTypeCount[lstIndex] == 1) {
		filterTypePage[lstIndex] = [];
	}

	pageCount = Math.ceil(filterTypeCount[lstIndex] / EVENT_PAGE_SIZE);
	if ((filterTypeCount[lstIndex] % EVENT_PAGE_SIZE) == 1) {
		filterTypePage[lstIndex][pageCount] = {};
		filterTypePage[lstIndex][pageCount].startIndex = eventIndex;
		filterTypePage[lstIndex][pageCount].endIndex = eventIndex;
	} else {
		filterTypePage[lstIndex][pageCount].endIndex = eventIndex;
	}
}

/*
 * This function will be invoked when all the sel entries to be displayed for
 * the first time. It will fill the event type page index for all the records.
 */
function initializeAllEvents()
{
	if (RAID_EVENT_LOG_DATA.length != 0) {
		
		var temp=getTotalCtrlEventsCount();
		
		var pgcnt = Math.ceil(temp / EVENT_PAGE_SIZE);
		eventTypeCount[ALL_EVENTS] = temp;
		eventTypePage[ALL_EVENTS] = [];
		for (i = 0; i < pgcnt; i++) {
			eventTypePage[ALL_EVENTS][i+1] = {};
			eventTypePage[ALL_EVENTS][i+1].startIndex = (i * EVENT_PAGE_SIZE);
			eventTypePage[ALL_EVENTS][i+1].endIndex = (i * EVENT_PAGE_SIZE) + (EVENT_PAGE_SIZE - 1);
		}
	}
}

/*
 * This function will be called once we get response for the getUTCOffset RPC.
 * getUTCOffset will get the UTC offset value of the BMC.
 * @param utcOffsetMinutes, UTC offset value of the BMC in minutes.
 */
function getUTCOffsetRes(utcOffsetMinutes)
{
	var clientDate = new Date();
	bmcUTCString = getUTCString(utcOffsetMinutes * 60);
	clientUTCSeconds = -(clientDate.getTimezoneOffset() * 60);	//JS Date object method
	refreshEventTzone();
	//getRAIDEventLog();
}

/*
 * This function will be called whenever user switches between BMC and client
 * Timestamp option.
 */
function refreshEventTzone()
{
	lblUTCOffset.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_UTC_OFFSET") + "</strong>";
	lblUTCOffset.innerHTML += eLang.getString("common","STR_GMT");
	if (rdoBMCTzone.checked) {
		toggleBMCClient("toggleBMC", "toggleClient");
		lblUTCOffset.innerHTML += bmcUTCString;
	} else if (rdoClientTzone.checked) {
		toggleBMCClient("toggleClient", "toggleBMC");
		lblUTCOffset.innerHTML += getUTCString(clientUTCSeconds);
	}
	lblUTCOffset.innerHTML += ")" + eLang.getString("common","STR_BLANK");
}

/*
 * This function will toggle between the BMC and Client Timestamp display.
 * Based on the user selection, particular timestamp data will displayed in the
 * listgrid using css styles.
 * @param visibleStyle, cssStyle name to be displayed.
 * @param hiddenStyle, cssStyle name to be hided.
 */
function toggleBMCClient(visibleStyle, hiddenStyle)
{
	var theRules = [];
	var searchStyle = "";
	for (i=0;i<document.styleSheets.length;i++) {
		theRules = document.styleSheets[i].cssRules ? 
			document.styleSheets[i].cssRules : document.styleSheets[i].rules;
		for (j=0;j<theRules.length;j++) {
			searchStyle = theRules[j].cssText ? theRules[j].cssText : 
				theRules[j].selectorText;
			if (searchStyle.indexOf(visibleStyle) != -1) {
				theRules[j].style.display = "";
			}
			if (searchStyle.indexOf(hiddenStyle) != -1) {
				theRules[j].style.display = "none";
			}
		}
	}
}

/*
 * It will display the table with single record shows that the selected filter
 * has no records.
 */
function loadEmptyRAIDEventLogEntries()
{
	disableRAIDPageButtons();
	txtPage.value = "";
	tblJSON.rows = [];
	eventRAIDLogTable.loadFromJson(tblJSON);
	lblHeader.innerHTML = "<strong class='st'>" + 
		eLang.getString("common", "STR_EVENT_LOG_CNT") + "</strong>0" + 
		eLang.getString("common", "STR_EVENT_ENTRIES") + 
		eLang.getString("common", "STR_BLANK");
}

/*
 * This function will load the SEL entries based on the user filter option
 * @filterTypeCount, Total count of the records for the selected filter.
 * @filterTypePage, Object of the event's index for the selected filter.
 * @lstIndex, Index of the user selected filter.
 * @pageIndex, Which page of records to be displayed.
 */
function loadRAIDEventLogEntries(filterTypeCount, filterTypePage, lstIndex, pageIndex)
{
	//alert('in show wait');
	showWait(true, eLang.getString("common", "STR_WAIT"));
	if (filterTypeCount[lstIndex] != 0) {
		disableRAIDPageButtons();
		
		filterTypePage[lstIndex][pageIndex].startIndex = (pageIndex-1) * EVENT_PAGE_SIZE;
		filterTypePage[lstIndex][pageIndex].endIndex = (pageIndex * EVENT_PAGE_SIZE)-1;
		
		refreshEvents(filterTypePage[lstIndex][pageIndex].startIndex, 
			filterTypePage[lstIndex][pageIndex].endIndex,
			filterTypeCount[lstIndex]);
		bkupPageNumber = pageIndex
		txtPage.value = pageIndex;
		enableRAIDPageButtons(filterTypeCount[lstIndex]);
	} else {
		loadEmptyRAIDEventLogEntries();
	}
}

/*
 * It will enable the navigation controls based on the page index value.
 * @param count, total number of event entries for the filtered type.
 */
function enableRAIDPageButtons(count)
{
	var pgcnt = Math.ceil(count / EVENT_PAGE_SIZE);
	if (RAID_EVENT_LOG_DATA.length != 0) {
		if (parseInt(txtPage.value) != FIRSTPAGE) {
			btnFirst.disabled = false;
			btnPrevious.disabled = false;
		}
		if (parseInt(txtPage.value) != pgcnt) {
			btnNext.disabled = false;
			btnLast.disabled = false;
		}
		if (FIRSTPAGE != pgcnt) {
			txtPage.disabled = false;
		}
	}
}
/*
 * It will disable all the navigation controls.
 */
function disableRAIDPageButtons()
{
	btnFirst.disabled = true;
	btnPrevious.disabled = true;
	btnNext.disabled = true;
	btnLast.disabled = true;
	txtPage.disabled = true;
}

/*
 * It will reload the event entries in the list grid based on the index value.
 * @param startPos, index of the starting record.
 * @param endPos, index of the end record.
 * @param count, total count of the filtered option.
 */
function refreshEvents(startPos, endPos, count)
{
	//alert('in refreshEvents');
	var eventtype = 0;
	var eventcode = 0;
	var eventclass = 0;
	
	var eventdesc;
	var type;
	var offset;
	var JSONRows = [];
	var eventTimeStamp;		//Event TimeStamp in seconds
	var bmcUTCSeconds;		//BMC UTC Offset value in seconds
	var bmcTimestamp;		//BMC TimeStamp in string
	var clientTimestamp;	//Client TimeStamp in string
	
	var ctrlid=lstRAIDController.value;

	showWait(true, "Populating");
	eventRAIDLogTable.clear();
	
	var l;    
    var j=0;
	var logentriescount=0;
	
	l=0;
	
	var ctrleventcount=getTotalCtrlEventsCount();
	ctrleventcount = lstEventType.value!=0 ? count : ctrleventcount;
	
	//alert(temp);
		while(j < RAID_EVENT_LOG_DATA.length) {
			if(lstEventType.value== ALL_EVENTS) {
				if(ctrlid == RAID_EVENT_LOG_DATA[j].CTRLID) {
					if(l < startPos) {
					l++;
					j++;
					continue;
				} else if( l>=startPos && l<endPos+1) {
					l++;
					logentriescount++;
				eventcode= RAID_EVENT_LOG_CODE[RAID_EVENT_LOG_DATA[j].EVENTCODE];
				eventtype=(RAID_EVENT_LOG_DATA[j].EVENTTYPE== 0x00) ? "Unknown" :GetRAIDEventType(RAID_EVENT_LOG_DATA[j].EVENTTYPE);
				eventclass= GetRAIDEventClass(RAID_EVENT_LOG_DATA[j].EVENTCLASS);
				
				var eventTimeStamp = RAID_EVENT_LOG_DATA[j].TIMESTAMP;		//Event TimeStamp in Seconds
				var bmcUTCSeconds = getUTCSeconds(bmcUTCString);	//BMC UTC Offset value in seconds
				var strBmcTimeStamp=getTimeStamp(eventTimeStamp);
				if (strBmcTimeStamp.substring(6,10) == "1970") {
					var bmcTimestamp = "<span class='toggleBMC'>" + 
						eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
						"</span>";
				} else {
					var bmcTimestamp = "<span class='toggleBMC'>" + 
						strBmcTimeStamp + "</span>";
				}
				var strClientTimeStamp = getTimeStamp(eventTimeStamp - 
					bmcUTCSeconds + clientUTCSeconds);
				if (strClientTimeStamp.substring(6,10) == "1970") {
					var clientTimestamp = "<span class='toggleClient'>" + 
						eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
						"</span>";
				} else {
					var clientTimestamp = "<span class='toggleClient'>" + 
						getTimeStamp(eventTimeStamp - bmcUTCSeconds + 
						clientUTCSeconds) + "</span>";
				}

				JSONRows.push({cells:[
					{text:parseInt(RAID_EVENT_LOG_DATA[j].RECORDID), value:parseInt(RAID_EVENT_LOG_DATA[j].RECORDID)},
					{text:bmcTimestamp + clientTimestamp, value:bmcTimestamp + clientTimestamp},
					{text:eventcode, value:eventcode},
					{text:eventtype, value:eventtype},
					{text:eventclass, value:eventclass}
					//,
					//{text:RAID_EVENT_LOG_DATA[j].EVENTDESC, value:RAID_EVENT_LOG_DATA[j].EVENTDESC}
					]});
					j++;
                    continue;
                }
                else{
                    break;
                }
                
            }
        } else if(ctrlid == RAID_EVENT_LOG_DATA[j].CTRLID && lstEventType.value== RAID_EVENT_LOG_DATA[j].EVENTTYPE) {
        	if(l < startPos) {
        		l++;
				j++;
				continue;
        	} else if( l>=startPos && l<endPos+1) {
        		l++;
        		logentriescount++;
			eventcode= RAID_EVENT_LOG_CODE[RAID_EVENT_LOG_DATA[j].EVENTCODE];
			eventtype=(RAID_EVENT_LOG_DATA[j].EVENTTYPE== 0x00) ? "Unknown" :GetRAIDEventType(RAID_EVENT_LOG_DATA[j].EVENTTYPE);
			eventclass= GetRAIDEventClass(RAID_EVENT_LOG_DATA[j].EVENTCLASS);
			
			var eventTimeStamp = RAID_EVENT_LOG_DATA[j].TIMESTAMP;		//Event TimeStamp in Seconds
			var bmcUTCSeconds = getUTCSeconds(bmcUTCString);	//BMC UTC Offset value in seconds
			var strBmcTimeStamp=getTimeStamp(eventTimeStamp);
			if (strBmcTimeStamp.substring(6,10) == "1970") {
				var bmcTimestamp = "<span class='toggleBMC'>" + 
					eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
					"</span>";
			} else {
				var bmcTimestamp = "<span class='toggleBMC'>" + 
					strBmcTimeStamp + "</span>";
			}
			var strClientTimeStamp = getTimeStamp(eventTimeStamp - 
				bmcUTCSeconds + clientUTCSeconds);
			if (strClientTimeStamp.substring(6,10) == "1970") {
				var clientTimestamp = "<span class='toggleClient'>" + 
					eLang.getString("common", "STR_PRE_INIT_TIMESTAMP") + 
					"</span>";
			} else {
				var clientTimestamp = "<span class='toggleClient'>" + 
					getTimeStamp(eventTimeStamp - bmcUTCSeconds + 
					clientUTCSeconds) + "</span>";
			}

			JSONRows.push({cells:[
				{text:parseInt(RAID_EVENT_LOG_DATA[j].RECORDID), value:parseInt(RAID_EVENT_LOG_DATA[j].RECORDID)},
				{text:bmcTimestamp + clientTimestamp, value:bmcTimestamp + clientTimestamp},
				{text:eventcode, value:eventcode},
				{text:eventtype, value:eventtype},
				{text:eventclass, value:eventclass}
				//,
				//{text:RAID_EVENT_LOG_DATA[j].EVENTDESC, value:RAID_EVENT_LOG_DATA[j].EVENTDESC}
				]});
				j++;
                continue;
            }
            else{
                break;
            }
        }
        j++;
    }
	
	tblJSON.rows = JSONRows;
	eventRAIDLogTable.loadFromJson(tblJSON);
	
	//count=logentriescount;
	lblHeader.innerHTML = "<strong class='st'>" + eLang.getString("common", 
		"STR_EVENT_LOG_CNT") + "</strong>" + logentriescount + eLang.getString("common", 
		"STR_EVENT_ENTRIES") + ", " + Math.ceil(ctrleventcount / EVENT_PAGE_SIZE) + 
		eLang.getString("common", "STR_BLANK") + eLang.getString("common",
		"STR_EVENT_LOG_PAGES") + eLang.getString("common", "STR_BLANK");

	//if(top.user.isAdmin()) {
		btnClearLog.disabled = (RAID_EVENT_LOG_DATA.length) ? false : true;
	//}
}

function getTotalCtrlEventsCount() {
	var count=0;	
	if (RAID_EVENT_LOG_DATA.length != 0) {
		for(k=0;k<RAID_EVENT_LOG_DATA.length;k++) {
			if(lstRAIDController.value==RAID_EVENT_LOG_DATA[k].CTRLID) {
				count++;
			}
		}
	}
	return count;
}

/*
 * This function will be invoked whenever the user navigates the pages 
 * using navigation controls.
 * @param navCtrl, which navigation control is clicked.
 */
function movePage(navCtrl)
{
	var pageCount;
	var sensorIndex;
	var pageIndex;

	pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
	
	/*if (parseInt(lstSensorName.value) != ALL_SENSORS) {
		//sensorNameType array value starts with 0.
		sensorIndex = parseInt(lstSensorName.value) - 1;
		pageCount = Math.ceil(sensorNameCount[sensorIndex] / EVENT_PAGE_SIZE);
	} else {
		pageCount = Math.ceil(eventTypeCount[lstEventType.value] / EVENT_PAGE_SIZE);
	}*/

	switch (navCtrl) {
	case MOVEFIRST:
		pageIndex = FIRSTPAGE;
		break;
	case MOVEPREVIOUS:
		pageIndex = parseInt(bkupPageNumber) - 1;
		break;
	case MOVENEXT:
		pageIndex = parseInt(bkupPageNumber) + 1;
		break;
	case MOVELAST:
		pageIndex = pageCount;
	}

	loadRAIDEventLogEntries(eventTypeCount, eventTypePage, lstEventType.value, pageIndex);
	
	/*if (parseInt(lstSensorName.value) != ALL_SENSORS) {
		loadEventLogEntries(sensorNameCount, sensorNamePage, sensorIndex, pageIndex);
	} else {
		loadEventLogEntries(eventTypeCount, eventTypePage, lstEventType.value, pageIndex);
	}*/
}
function getRAIDBBUInformation() {
	//loadRAIDControllers();
	var req;	
	req=xmit.getset({url:"/rpc/getraidbbuinfo.asp", onrcv:getRaidBBUInfoRes, status:""});
	req.add("RAIDCTRLID", lstRAIDController.value);
	req.send();
	delete req;
}

function getRaidBBUInfoRes(arg) {
	listGridRAIDHolder.innerHTML = "";
	//arg.HAPI_STATUS=0;
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x83:
			buildBBUError();
			break;
		case 0x81:
		case 0x182:
			alert(eLang.getString("common", "STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"));
			break;
		case 0x82:
			alert(eLang.getString("common", "STR_RAID_INVALID_CONTROLLER_ID"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		if(RPCStatus==true) {
			RAID_BBU_INFO_DATA = [{ 'BBUTYPE' : 1,'STATUS' : 1,'TEMPERATURE' : 0,'VOLTAGE' : 32,
				'CURRENT' : 12 }];
		}
		else {
			RAID_BBU_INFO_DATA = WEBVAR_JSONVAR_GETRAIDBBUINFO.WEBVAR_STRUCTNAME_GETRAIDBBUINFO;	
		}
		buildBBU();
	}
}

function buildBBU() {
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 10;
	tbl.cellPadding = 2;
	tbl.border = 0;
	tbl.width = '40%';
	
	for(i=0;i<MAX_RAID_BBU_INFO_FIELDS;i++) {
		//var tddata= strBBUFields[i];
		var tr= document.createElement("TR");
		key=eLang.getString("common","STR_RAID_BBU_LABEL" + i);
		//for(key in tddata) {
			//if(tddata.hasOwnProperty(key)) {
				var td= document.createElement("TD");
				td.innerHTML="<strong>" + key + "</strong>";
				td.colSpan=3;
				td.style.width="20%";
				td.align="right";
				td.style.whiteSpace= 'nowrap';
				tr.appendChild(td);
				
				var td1= document.createElement("TD");
				td1.style.whiteSpace= 'nowrap';
				if(i==0) 
					td1.innerHTML=GetBBUType(RAID_BBU_INFO_DATA[0].BBUTYPE);
				else if(i==1)
					td1.innerHTML=changeBBUStatus(RAID_BBU_INFO_DATA[0].STATUS);
				else if(i==2)
					td1.innerHTML=RAID_BBU_INFO_DATA[0].TEMPERATURE;
				else if(i==3)
					td1.innerHTML=RAID_BBU_INFO_DATA[0].VOLTAGE;
				else if(i==4)
					td1.innerHTML=RAID_BBU_INFO_DATA[0].CURRENT;
				tr.appendChild(td1);
				
				/*var td2= document.createElement("TD");
				td2.innerHTML=tddata[key];
				tr.appendChild(td2);*/
			//}
		//}
		tbl.appendChild(tr);
	}
	listGridRAIDHolder.appendChild(tbl);
}

function buildBBUError(){
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 0;
	tbl.cellPadding = 0;
	tbl.border = 0;
	tbl.width = '100%';
	
	var tr= document.createElement("TR");
	var key=eLang.getString("common","STR_RAID_BBU_ERROR");
	
	var td= document.createElement("TD");
	td.innerHTML="<strong>" + key + "</strong>";
	td.colSpan=2;
	//td.style.width="20%";
	td.align="center";
	td.style.whiteSpace= 'nowrap';
	tr.appendChild(td);
	
	tbl.appendChild(tr);
	
	listGridRAIDHolder.appendChild(tbl);
}

function getStorageInformation() {
	
	/*if(lstRAIDController.value=="") {
		//loadRAIDControllers();
		for (i = 0; i < strRADINames.length; i++) {
			var name= strRADINames[i].Name;
			var value=strRADINames[i].value;
			//alert("inside combo");
			//strRADINames.push({Name:name,value:RAID_INFO_DATA[i].CtrlID});
			lstRAIDController.add(new Option(name, 
					value), isIE ? i : null);
		}
		
	}*/
	/*if(lstRAIDController.value=="")
	{
		//loadRAIDControllers();
		getRAIDCtrlInformation();
	}*/
	
	delayStorage();
	//setTimeout(delayStorage, CONST_TIMEOUT);
	
	/*var delay=2000;//2 seconds
	
	setTimeout(function(){
		delayStroage();
	},delay);*/
	
}

function delayStorage(){
	var req;	
	req=xmit.getset({url:"/rpc/getraidstorageinfo.asp", onrcv:getRaidStorageInfoRes, status:""});
	req.add("RAIDCTRLID", lstRAIDController.value);
	req.send();
	delete req;
 }
function getRaidStorageInfoRes(arg) {
	listGridRAIDHolder.innerHTML = "";
	//arg.HAPI_STATUS=0;
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x81:
			alert(eLang.getString("common", "STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"));
			break;
		case 0x82:
			alert(eLang.getString("common", "STR_RAID_INVALID_CONTROLLER_ID"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		if(RPCStatus==true) {
			RAID_STORAGE_INFO_DATA = [{ 'PHYSICALCOUNT' : 1,'LOGICALCOUNT' : 2,'HOTSPARECOUNT':0 }];
		}
		else {
			RAID_STORAGE_INFO_DATA = WEBVAR_JSONVAR_GETRAIDSTORAGEINFO.WEBVAR_STRUCTNAME_GETRAIDSTORAGEINFO;	
		}
		
		buildStorageSummary();
	}
}

function getRAIDPhysicalInformation() {
	//loadRAIDControllers();
	var req;	
	req=xmit.getset({url:"/rpc/getraidphysicalinfo.asp", onrcv:getRaidPhysicalInfoRes, status:""});
	req.add("RAIDCTRLID", lstRAIDController.value);
	req.send();
	delete req;
}

function getRaidPhysicalInfoRes(arg) {
	//arg.HAPI_STATUS=0;
	if(physicalInfo.style.fontWeight == "bold") {
		listGridRAIDHolder.innerHTML = "";	
	}
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x182:
		case 0x81:
			alert(eLang.getString("common", "STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"));
			break;
		case 0x82:
			alert(eLang.getString("common", "STR_RAID_INVALID_CONTROLLER_ID"));
			break;
		case 0x83:
			alert(eLang.getString("common", "STR_RAID_INVALID_DEVICE_ID"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}  
	} else {
		if(RPCStatus==true) {
			RAID_PHYSICAL_INFO_DATA =temp_physicalData;/* [{ 'CtrlID' : 259,'DevID' : 9,'Type' : 0,'State' : 32,
				'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0007',
				'SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 2,
				'Cache' : 0,'Speed' : 3,'Size' : 4,'BlockSize' : 0,'LinkSpeed' : 0,
				'PowerState' : 3,'Temperature' : 0,'Smart' : 52 },{ 'CtrlID' : 259,'DevID' : 10,'Type' : 1,'State' : 32,
					'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008',
					'SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,
					'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,
					'PowerState' : 3,'Temperature' : 0,'Smart' : 1 },{ 'CtrlID' : 200,'DevID' : 10,'Type' : 1,'State' : 32,
						'VendorID' : 'SEAGATE','ProductID' : 'ST1200MM0008',
						'SerialNum' : 'S3L03KKP','Slot' : 0,'Present' : 1,'LEDStatus' : 0,'InterfaceType' : 3,
						'Cache' : 0,'Speed' : 3,'Size' : 2,'BlockSize' : 0,'LinkSpeed' : 0,
						'PowerState' : 3,'Temperature' : 0,'Smart' : 1 }];*/
		}
		else {
			RAID_PHYSICAL_INFO_DATA = WEBVAR_JSONVAR_GETRAIDPHYDEVINFO.WEBVAR_STRUCTNAME_GETRAIDPHYDEVINFO;	
		}
		
		if(physicalInfo.style.fontWeight == "bold") {
			//buildPhysicalDeviceInformation();
			loadRAIDPhysicalCustomPageElements();
			loadRAIDPhysicalData();
			btnPopup.className="visibleRow";
		}
	}
}

function getRAIDLogicalInformation() {
	//loadRAIDControllers();
	var req;
	req=xmit.getset({url:"/rpc/getraidlogicalinfo.asp", onrcv:getRaidLogicalInfoRes, status:""});
	req.add("RAIDCTRLID", lstRAIDController.value);
	req.send();
	delete req;
}

function getRaidLogicalInfoRes(arg) {
	//arg.HAPI_STATUS=0;
	listGridRAIDHolder.innerHTML = "";
	if(arg.HAPI_STATUS != top.CONSTANTS.SUCCESS) {
		switch(GET_ERROR_CODE(arg.HAPI_STATUS)) {
		case 0x182:
		case 0x81:
			alert(eLang.getString("common", "STR_RAID_HOST_IS_IN_POWER_DOWN_STATE"));
			break;
		case 0x82:
			alert(eLang.getString("common", "STR_RAID_INVALID_CONTROLLER_ID"));
			break;
		case 0x83:
			alert(eLang.getString("common", "STR_RAID_INVALID_DEVICE_ID"));
			break;
		default:
			errstr =  eLang.getString("common", "STR_RAID_GETINFO");
		errstr += (eLang.getString("common", "STR_IPMI_ERROR") + 
			GET_ERROR_CODE(arg.HAPI_STATUS));
			alert(errstr);
		}
	} else {
		if(RPCStatus==true) {
			RAID_LOGICAL_INFO_DATA = [{ 'CtrlID' : 259,'DevID' : 1,'LDName' : '','Type' : 0,'State' : 0,
				'StripeSize' : 0,'AccessPolicy' : 0,'ReadPolicy' : 0,'WritePolicy' : 0,'CachePolicy' : 0,
				'BGI' : 0,'SSD_Caching' : 0,'Progress' : 0,'BadBlocks' : 0,'Size' : 1,'ElementsNum' : 1 ,'Elements' : "(9,0)~"},
				
				{ 'CtrlID' : 259,'DevID' : 21280,'LDName' : '','Type' : 1,'State' : 3,'StripeSize' : 7,'AccessPolicy' : 0,
				'ReadPolicy' : 0,'WritePolicy' : 0,'CachePolicy' : 0,'BGI' : 0,
				'SSD_Caching' : 0,'Progress' : 0,'BadBlocks' : 0,'Size' : 2,'ElementsNum' : 1, 'Elements' : "(9,0)~(10,0)~"},
				{ 'CtrlID' : 200,'DevID' : 9,'LDName' : 'Test LD Name','Type' : 0,'State' : 0,
					'StripeSize' : 0,'AccessPolicy' : 0,'ReadPolicy' : 0,'WritePolicy' : 0,'CachePolicy' : 0,
					'BGI' : 0,'SSD_Caching' : 0,'Progress' : 0,'BadBlocks' : 0,'Size' : 2,'ElementsNum' : 1 ,'Elements' : "(9,0)~(10,0)~(10,0)~"}, 
					{ 'CtrlID' : 259,'DevID' : 21280,'LDName' : '','Type' : 1,'State' : 3,'StripeSize' : 7,'AccessPolicy' : 0,
					'ReadPolicy' : 0,'WritePolicy' : 0,'CachePolicy' : 0,'BGI' : 0,
					'SSD_Caching' : 0,'Progress' : 0,'BadBlocks' : 0,'Size' : 2,'ElementsNum' : 0,'Elements' : "(6000,0)~(10,0)~" }];	
		} else {
			RAID_LOGICAL_INFO_DATA = WEBVAR_JSONVAR_GETRAIDLOGICALDEVINFO.WEBVAR_STRUCTNAME_GETRAIDLOGICALDEVINFO;
			
			//if(RAID_PHYSICAL_INFO_DATA == undefined) {
				getRAIDPhysicalInformation();	
			//}
		}
		//buildVirtualDeviceInformation();
		loadRAIDLogicalCustomPageElements();
		loadRAIDLogicalData();
		btnPopup.className="visibleRow";
	}
}

function buildStorageSummary() {
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 10;
	tbl.cellPadding = 2;
	tbl.border = 0;
	tbl.width = '60%';
	
	for(i=0;i<MAX_RAID_STORAGE_INFO_FIELDS;i++) {
		
		
		var tr= document.createElement("TR");
		
		key= eLang.getString("common","STR_RAID_STORAGE_LABEL" + i);
		//for(key in tddata) {
			//if(tddata.hasOwnProperty(key)) {
				var td= document.createElement("TD");
				td.innerHTML="<strong>" + key + "</strong>";
				td.colSpan=2;
				td.style.width="20%";
				td.align="right";
				td.style.whiteSpace= 'nowrap';
				tr.appendChild(td);
				
				var td1= document.createElement("TD");
				if(i==0)
					td1.innerHTML=RAID_STORAGE_INFO_DATA[0].PHYSICALCOUNT;
				else if(i==1)
					td1.innerHTML=RAID_STORAGE_INFO_DATA[0].LOGICALCOUNT;
				else
					td1.innerHTML=RAID_STORAGE_INFO_DATA[0].HOTSPARECOUNT;
				tr.appendChild(td1);
				
				/*var td2= document.createElement("TD");
				td2.innerHTML=tddata[key];
				tr.appendChild(td2);*/
			//}
		//}
		tbl.appendChild(tr);
	}
	listGridRAIDHolder.appendChild(tbl);
}

function buildRAIDInformation() {
	
	var tblouter= document.createElement("TABLE");
	var trtblouter= document.createElement("TR");
	var tdtblouter= document.createElement("TD");
	tdtblouter.colSpan=2;
	tdtblouter.style.width="30%";
	tdtblouter.align="left";
	
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 8;
	tbl.cellPadding = 2;
	tbl.border = 0;
	tbl.width = '30%';
	tbl.id="tblRAIDInfo";
	
	for(i=0;i<MAX_RAID_INFO_FIELDS;i++) {
		
		//var tddata= strRAIDFields[i];
		var tr= document.createElement("TR");
		
		var key= eLang.getString("common","STR_RAID_INFO_LABEL" + i);
		
		//for(key in tddata) {
			//if(tddata.hasOwnProperty(key)) {
				var td= document.createElement("TD");
				td.innerHTML="<strong>" + key + "</strong>";
				td.colSpan=2;
				td.style.width="20%";
				td.style.whiteSpace="nowrap";
				td.align="right";
				tr.appendChild(td);
				
				var td2= document.createElement("TD");
				td2.style.width="10%";
				tr.appendChild(td2);
			//}
		//}
		tbl.appendChild(tr);
	}
	
	
	infoRAIDGraph.className="visibleRow";
	
	/*tdtblouter.appendChild(tbl);
	
	
	
	var tdchart= document.createElement("TD");
	tdchart.align="left";
	

	
	var tblchart= document.createElement("TABLE");
	tblchart.style.width="50%";
	var tblcharttr= document.createElement("TR");
	
	

	var tdGraph= document.createElement("TD");
	tdGraph.id="_infoRAIDGraph";
	tdGraph.style.width="380";
	tdGraph.className="infoGraph";
	tdGraph.vAlign="top";
	
	var headerh4= document.createElement("H4");
	headerh4.align="center";
	headerh4.innerHTML="Event Logs";
	
	var spanchart= document.createElement("SPAN");
	spanchart.className="pieChartArea";
	
	var canvasChart=document.createElement("CANVAS");
	canvasChart.width="200";
	canvasChart.height="200";
	canvasChart.className="gCanvas";
	canvasChart.id="canvasChartRAID";
	
	
	tdGraph.appendChild(spanchart);
	tdGraph.appendChild(canvasChart);
	
	tblcharttr.appendChild(tdGraph);
	tblchart.appendChild(tblcharttr);
	tdchart.appendChild(tblchart);
	
	trtblouter.appendChild(tdtblouter);
	trtblouter.appendChild(tdchart);
	
	tblouter.appendChild(trtblouter);*/
	
	
	listGridRAIDHolder.appendChild(tbl);
	
	bindRAIDData();
	
	var raidcan= document.getElementsByTagName("CANVAS");
	if(raidcan != null && raidcan.length > 0) {
		
		if(raidcan[0]!= undefined)
		raidcan[0].className="visibleRow";
		if(raidcan[1]!= undefined)
		raidcan[1].className="visibleRow";
	}
	
	delayGraph();
	
	//setTimeout(delayGraph, CONST_TIMEOUT);
	
	//alert(graph.loaded);
	
	//alert('before graph load');
	
	//alert(IsRAIDChanged);
	
	//loadLibrary("graph","javascript",drawRAIDEventsGraph);
	
	/*if(IsRAIDChanged){
		
		drawRAIDEventsGraph1();
	} else {
		alert('in graph load');
		loadLibrary("graph","javascript",drawRAIDEventsGraph);	
	}*/
	
	/*if(graph.loaded==false){
		loadLibrary("graph","javascript",drawRAIDEventsGraph);	
	} else {
		drawRAIDEventsGraph1();
	}*/
	
	//drawRAIDEventsGraph();
	
	
}

function delayGraph(){	
	loadLibrary("graph","javascript",drawRAIDEventsGraph);
}

function bindRAIDData() {
	var crtlId= lstRAIDController.value;
	
	var tblinfo= document.getElementById("tblRAIDInfo");
	
	if(RAID_INFO_DATA.length > 0) {
		for(i=0;i<RAID_INFO_DATA.length;i++) {
			var data=RAID_INFO_DATA[i];
			var tr=tblinfo.getElementsByTagName("TR");
			if(crtlId==data.CtrlID) {
			tr[0].getElementsByTagName("TD")[1].innerHTML=data.SerialNum;
			tr[1].getElementsByTagName("TD")[1].innerHTML=data.PkgVersion;
			tr[2].getElementsByTagName("TD")[1].innerHTML=data.BIOSVersion;
			tr[3].getElementsByTagName("TD")[1].innerHTML=data.UEFIVersion;
			tr[4].getElementsByTagName("TD")[1].innerHTML=data.ExpanderVersion;
			tr[5].getElementsByTagName("TD")[1].innerHTML=data.SEEPROMVersion;
			tr[6].getElementsByTagName("TD")[1].innerHTML=data.CPLDVersion;
			tr[7].getElementsByTagName("TD")[1].innerHTML=data.PCIVendorID;
			tr[8].getElementsByTagName("TD")[1].innerHTML=data.PCIDeviceID;
			tr[9].getElementsByTagName("TD")[1].innerHTML=data.PCISubVendorID;
			tr[10].getElementsByTagName("TD")[1].innerHTML=data.PCISubSytemID;
			//tr[11].getElementsByTagName("TD")[1].innerHTML=data.TmmStatus;
			tr[11].getElementsByTagName("TD")[1].innerHTML=GetTemperature(data.ROCTemp);
			tr[12].getElementsByTagName("TD")[1].innerHTML=GetTemperature(data.ExpanderTemp);
			//tr[13].getElementsByTagName("TD")[1].innerHTML=data.CtrlHealth;
			}
		}
	}
}

function drawRAIDEventsGraph()
{
	//alert(graph.loaded);
	if(graph.loaded)
	{	
		//alert("after change drawRAIDEventsGraph");
		
		/*gphSet.bgColor = "rgba(255,255,255,1)";
		gphSet.width = 150;
		gphSet.height = 150;
		gphSet.borderWidth = 0;
		gphSet._gX = 0;
		gphSet._gY = 0;
		gphSet.canvasName = "RAIDgraphCanvas";
		gphSet.radius = 90;
		gphSet.graphTitle = "";
		gphSet.IsRAID=true;*/
		//gphSet.gData= null;
		
		//alert('in side drawRAIDEventsGraph');
		
		/*if(RAID_EVENT_LOG_DATA == null || RAID_EVENT_LOG_DATA== undefined) {
			getRAIDEventLog();
		}*/
		
		//graph._init(gphSet.canvasName,gphSet);
		//alert("inside drawRAIDEventsGraph");
		//alert(RAID_EVENT_LOG_DATA);
		//alert(lstRAIDController.value);
		createRAIDEventGraph(gphSet, true,lstRAIDController.value);
	}
}

function redrawGrpah(ctrlId)
{
	//alert("in redrawGrpah");
	
	if(graph.loaded) {
	
	//alert("in graph.loaded");
	
	//alert("in redrawGrpah createRAIDWebEventsRecord");
	//top.reloadValues is a global set to true when page refreshes. See header_imp.js - Manoj (Bug : 11734)
	if((gRAIDEventData = parent.gRAIDEventData)==undefined || top.reloadValues) 
	{
		//alert("in redrawGrpah gRAIDEventData = parent.gRAIDEventData");
		
		//alert(ctrlId);
		//Change top.reloadValues to false so that this doesn't become an infinite recursion - Manoj (Bug : 11734)
		try
		{
			graph.clearDataArea();
		}catch(e){
			
		}
		
		top.reloadValues = false;
		xmit.get({url:'/rpc/getraidalleventlogs.asp',
		onrcv:function(arg)
		{
			if(arg.HAPI_STATUS==0)
			{
				isEventsClear=true;
				//alert("in arg.HAPI_STATUS");
				gRAIDEventData = WEBVAR_JSONVAR_RAID_GETEVENTLOG.WEBVAR_STRUCTNAME_RAID_GETEVENTLOG;
				//gRAIDEventData = temp_eventData;
				//gEventData has not been passed by reference so we also need to
				//alter parent.gEventData so that the recursion is effective - Manoj (Bug : 11734)
				//alert(gRAIDEventData);
				parent.gRAIDEventData = gRAIDEventData;
				
				var ul=infoRAIDGraph.getElementsByTagName("UL")
				
				if(ul.length > 0) {
					for(m=0;m<ul.length;m++){
						infoRAIDGraph.removeChild(ul[m]);	
					}
				}
				
				//infoRAIDGraph.className="visibleRow";
				var cav= document.getElementsByTagName("CANVAS");
				if(cav != null && cav.length > 0) {
					cav[1].style.left=elmOffset(cav[0],'Left') + "px";
					cav[1].style.top =elmOffset(cav[0],'Top') + "px";	
				}

				try{
				if((gMaxEventData=parent.gMaxEventData)==undefined)
				{
					//assume 1024
					gMaxEventData = 1024;
				}
				}catch(e){gMaxEventData = 1024;};

				var graphData = [];

				var uniqueSensors = [];
				var alert_txt = [];
				for(var i=0; i<gRAIDEventData.length;i++)
				{
					var id=null;
					if(ctrlId==gRAIDEventData[i].CTRLID) {
						//alert("in  in redrawGrpah ctrlId==gRAIDEventData[i].CTRLID");
						if((id=uniqueSensors.indexOf(gRAIDEventData[i].EVENTTYPE))==-1)
						{
							uniqueSensors.push(gRAIDEventData[i].EVENTTYPE);
							var secName=(gRAIDEventData[i].EVENTTYPE == 0x00) ? "Unknown" :GetRAIDEventType(gRAIDEventData[i].EVENTTYPE);
							graphData.push({sector_name:secName,
				                            sector_type:gRAIDEventData[i].EVENTTYPE,
				                            sector_percentage:1,
											sector_link:gRAIDEventData[i].EVENTTYPE,
											sub_sectors:[]});
						}else
						{
							if(id==null){alert('No such RAID Event Type'); break};
							graphData[id].sector_percentage++;
						}
					}
				}

				delete uniqueSensors;

				//convert occurance to percentage and assign it's unique color
				var pieColor = '#000000';
				var totalEvent = 0; //Used to hold the total number of events at present.

				if (!M_CUSTOM_COLOR) {
					graphColors = new palette(graphData.length, 0, 255, true, false);
				}

				for (var i = 0; i < graphData.length; i++) {
					if (M_CUSTOM_COLOR) {
						pieColor = getSensorColor(graphData[i].sector_type,
								graphData[i].sector_name);
					} else {
						pieColor = graphColors.popColor();
					}
					totalEvent += graphData[i].sector_percentage;
					graphData[i].total_events = totalEvent;

					graphData[i].sector_color = pieColor;
					graphData[i].sector_percentage = 
						graphData[i].sector_percentage/gMaxEventData * 100;
				}

				//alert(graphData);
				gphSet.gData=graphData;

				graph.drawPieChart(gphSet.radius)
				//graph.reposition();
				
				
				//createRAIDWebEventsRecord(gphSet,ctrlId);
			}else
			{
				alert("Error getting events records");
			}
		}});
		//return;
	}

	}
}

/*function createRAIDWebEventsRecord(gSettings,raideventdata,ctrlId)
{
	//alert('in side createRAIDWebEventsRecord');
	
	//alert(raideventdata.length);
	if(raideventdata.length != 0) {
		top.reloadValues = false;
		parent.gEventData=raideventdata;
		gEventData =raideventdata;
	} else {
		alert("Error getting events records");
	}
	
	try{
	if((gMaxEventData=parent.gMaxEventData)==undefined)
	{	
		gMaxEventData = 1024;
	}
	}catch(e){gMaxEventData = 1024;};

	var graphData = [];

	var uniqueSensors = [];
	var alert_txt = [];
	for(var i=0; i<gEventData.length;i++)
	{
		//alert(raideventdata.length);
		if(ctrlId==gEventData[i].CTRLID) {
			var id=null;
			if((id=uniqueSensors.indexOf(gEventData[i].EVENTTYPE))==-1)
			{
				uniqueSensors.push(gEventData[i].EVENTTYPE);
				graphData.push({sector_name:GetRAIDEventType(gEventData[i].EVENTTYPE),
	                            sector_type:gEventData[i].EVENTTYPE,
	                            sector_percentage:1,
								sector_link:gEventData[i].EVENTTYPE,
								sub_sectors:[]});
			}else
			{
				if(id==null){alert('No such RAID Event Type'); break};
				graphData[id].sector_percentage++;
			}
		}
	}

	delete uniqueSensors;

	//convert occurance to percentage and assign it's unique color
	var pieColor = '#000000';
	var totalEvent = 0; //Used to hold the total number of events at present.

	if (!M_CUSTOM_COLOR) {
		graphColors = new palette(graphData.length, 0, 255, true, false);
	}

	for (var i = 0; i < graphData.length; i++) {
		if (M_CUSTOM_COLOR) {
			pieColor = getSensorColor(graphData[i].sector_type,
					graphData[i].sector_name);
		} else {
			pieColor = graphColors.popColor();
		}
		totalEvent += graphData[i].sector_percentage;
		graphData[i].total_events = totalEvent;

		graphData[i].sector_color = pieColor;
		graphData[i].sector_percentage = 
			graphData[i].sector_percentage/gMaxEventData * 100;
	}

	gSettings.gData=graphData;
	
	graph.drawPieChart(gSettings.radius);
}*/

function buildPhysicalDeviceInformation() {
	
	
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 10;
	tbl.cellPadding = 2;
	tbl.border = 0;
	tbl.width = '50%';
	
	var tbltr= document.createElement("TR");
	var tbltd= document.createElement("TD");
	
	var innertbl= document.createElement("TABLE");
	innertbl.cellSpacing = 0;
	innertbl.cellPadding = 0;
	innertbl.border = 0;
	innertbl.width = '100%';
	innertbl.id="tblRAIDInfo";
	innertbl.className="raidtable";

	var threadtr= document.createElement("thread");	
	var tr= document.createElement("TR");

	
	for(i=0;i<strMainPhysicalFields.length;i++) {
		
		var td= document.createElement("td");
		td.className="head";
		//td.style="white-space:nowrap;text-align:center";
		td.style.whiteSpace="nowrap";
		td.style.textAlign="center";
		var tddata= strMainPhysicalFields[i];
		for(key in tddata) {
			if(tddata.hasOwnProperty(key)) {
				td.innerHTML="<strong>" + key + "</strong>";
			}
		}
		tr.appendChild(td);
	}
	//threadtr.appendChild(tr);
	innertbl.appendChild(tr);

	var trtbody= document.createElement("TBODY");
	var crtlId= lstRAIDController.value;
	
	for(j=0;j<RAID_PHYSICAL_INFO_DATA.length;j++) {
		if(crtlId== RAID_PHYSICAL_INFO_DATA[j].CtrlID) {
			var tr1= document.createElement("TR");
			tr1.className="normal";
			for(i=0;i<strMainPhysicalFields.length;i++) {
				var td= document.createElement("TD");
				td.style.whiteSpace="nowrap";
				td.style.textAlign="center";
				tr1.appendChild(td);
			}
			innertbl.appendChild(tr1);
		}
	}
	
	//innertbl.appendChild(trtbody);
	tbltd.appendChild(innertbl);
	
	tbltr.appendChild(tbltd);
	tbl.appendChild(tbltr);
	
	listGridRAIDHolder.appendChild(tbl);
	
	bindRAIDPhysicalData();
}

function bindRAIDPhysicalData() {
	var crtlId= lstRAIDController.value;
	var tblinfo= document.getElementById("tblRAIDInfo");
	if(RAID_PHYSICAL_INFO_DATA.length==0) {
		btnPopup.disabled=true;
	}
	if(RAID_PHYSICAL_INFO_DATA.length > 0) {
		btnPopup.disabled=false;
		for(i=0;i< RAID_PHYSICAL_INFO_DATA.length;i++) {
			
			var data=RAID_PHYSICAL_INFO_DATA[i];
			var tr=tblinfo.getElementsByTagName("TR")[i+1];
			if(tr != null)
			var tds=tr.getElementsByTagName("TD");
			if(tds != null)
			if(crtlId==data.CtrlID) {			

			tds[0].innerHTML=data.DevID;		
			tds[1].innerHTML=GetPhysicalType(data.Type);
			tds[2].innerHTML=GetPhysicalState(data.State);
			//tds[2].innerHTML=data.VendorID;
			//tds[3].innerHTML=data.ProductID;
			//tds[4].innerHTML=data.SerialNum;
			tds[3].innerHTML=data.Slot;
			//tds[6].innerHTML=GetPhysicalSlotPresent(data.Present);
			//tds[7].innerHTML=GetPhysicalLEDStatus(data.LEDStatus);
			//tds[8].innerHTML=GetPhysicalInterfaceType(data.InterfaceType);
			//tds[9].innerHTML=GetPhysicalCache(data.Cache);
			tds[4].innerHTML=GetPhysicalSpeed(data.Speed);
			//tds[11].innerHTML=data.size64;
			//tds[12].innerHTML=data.BlockSize;
			tds[5].innerHTML=GetPhysicalSpeed(data.LinkSpeed);
			tds[6].innerHTML=data.Size;
			//tds[5].innerHTML=GetPhysicalPowerStatus(data.PowerState);
			tds[7].innerHTML=GetTemperature(data.Temperature);
			//tds[16].innerHTML=GetPhysicalSmart(data.Smart);
			}
		}
	}
}

function displayPhysicalPopup() {
	//buildAdvanceProperties();
	
	if(physicalInfo.style.fontWeight=='bold') {
		loadRAIDPhysicalPopupCustomPageElements();
		loadRAIDPhysicalPopupData();
	} else if(virtualInfo.style.fontWeight == "bold") {
		loadRAIDLogicalMainPopupCustomPageElements();
		loadRAIDLogicalMainPopupData();
	}
	reloadHelp();
}

function buildAdvanceProperties() {
	
	var descFrame = getDescFrame();
	var heading = document.createElement("h3");
	heading.innerHTML ="Controller Name :"+ lstRAIDController.options[lstRAIDController.selectedIndex].text;
	
	var innertbl= document.createElement("TABLE");
	innertbl.cellSpacing = 0;
	innertbl.cellPadding = 0;
	innertbl.border = 0;
	innertbl.width = '90%';
	innertbl.id="tblPhysicalPopup";
	innertbl.align="center";
	innertbl.className="raidtable";
	
	var trthread= document.createElement("THREAD");
	var tr= document.createElement("TR");
	
	for(i=0;i<strPopupPhysicalFields.length;i++) {
		
		var td= document.createElement("TD");
		//td.style="white-space:nowrap;text-align:center;";
		td.style.whiteSpace="nowrap";
		td.className="head";
		td.style.textAlign="center";
		var tddata= strPopupPhysicalFields[i];
		for(key in tddata) {
			if(tddata.hasOwnProperty(key)) {
				td.innerHTML="<strong>" + key + "</strong>";
			}
		}
		tr.appendChild(td);
	}
	//trthread.appendChild(tr);
	innertbl.appendChild(tr);
	
	var trtbody= document.createElement("TBODY");
	var crtlId= lstRAIDController.value;
	
	for(j=0;j<RAID_PHYSICAL_INFO_DATA.length;j++) {
		if(crtlId== RAID_PHYSICAL_INFO_DATA[j].CtrlID) {
			var tr1= document.createElement("TR");
			tr1.className="normal";
			//tr1.style="color:rgb(0,0,0);";
			for(i=0;i<strPopupPhysicalFields.length;i++) {
				var td= document.createElement("TD");
				td.style.textAlign="center";
				td.style.whiteSpace="nowrap";
				tr1.appendChild(td);
			}
			innertbl.appendChild(tr1);	
		}
	}
	//innertbl.appendChild(trtbody);

	var br=document.createElement("br");
	
	descFrame.appendChild(heading);
	descFrame.appendChild(innertbl);
	descFrame.appendChild(br);
	
	bindPhysicalPopupData();
}

function bindPhysicalPopupData() {
	var crtlId= lstRAIDController.value;
	var tblPhysicalPopup= document.getElementById("tblPhysicalPopup");
	
	if(RAID_PHYSICAL_INFO_DATA.length > 0) {
		
		for(i=0;i< RAID_PHYSICAL_INFO_DATA.length;i++) {
			
			var data=RAID_PHYSICAL_INFO_DATA[i];
			var tr=tblPhysicalPopup.getElementsByTagName("TR")[i+1];
			if(tr != null)
			var tds=tr.getElementsByTagName("TD");
			if(tds != null)
			if(crtlId==data.CtrlID) {
			
			//tds[0].innerHTML=GetPhysicalType(data.Type);
			//tds[1].innerHTML=GetPhysicalState(data.State);
			tds[0].innerHTML=data.VendorID;
			tds[1].innerHTML=data.ProductID;
			tds[2].innerHTML=data.SerialNum;
			//tds[2].innerHTML=data.Slot;
			tds[3].innerHTML=GetPhysicalPowerStatus(data.PowerState);
			tds[4].innerHTML=GetPhysicalSlotPresent(data.Present);
			tds[5].innerHTML=GetPhysicalLEDStatus(data.LEDStatus);
			tds[6].innerHTML=GetPhysicalInterfaceType(data.InterfaceType);
			tds[7].innerHTML=GetPhysicalCache(data.Cache);
			//tds[3].innerHTML=GetPhysicalSpeed(data.Speed);
			//tds[7].innerHTML=data.Size;
			tds[8].innerHTML=data.BlockSize;
			//tds[9].innerHTML=data.LinkSpeed;
			//tds[4].innerHTML=GetPhysicalPowerStatus(data.PowerState);
			//tds[5].innerHTML=GetTemperature(data.Temperature);
			tds[9].innerHTML=GetPhysicalSmart(data.Smart);
			}
		}
	}
}

function buildVirtualDeviceInformation() {
	var tbl= document.createElement("TABLE");
	tbl.cellSpacing = 10;
	tbl.cellPadding = 2;
	tbl.border = 0;
	tbl.width = '100%';
	
	var tbltr= document.createElement("TR");
	var tbltd= document.createElement("TD");
	
	var innertbl= document.createElement("TABLE");
	innertbl.cellSpacing = 0;
	innertbl.cellPadding = 0;
	innertbl.border = 0;
	innertbl.width = '100%';
	innertbl.id="tblRAIDInfo";
	innertbl.className="raidtable";
	
	var trthread= document.createElement("THREAD");
	var tr= document.createElement("TR");
	
	for(i=0;i<strVirtualFields.length;i++) {
		
		var td= document.createElement("TD");
		td.className="head";
		td.style.whiteSpace="nowrap";
		td.style.textAlign="center";
		var tddata= strVirtualFields[i];
		for(key in tddata) {
			if(tddata.hasOwnProperty(key)) {
				td.innerHTML="<strong>" + key + "</strong>";
			}
		}
		tr.appendChild(td);
	}
	//trthread.appendChild(tr);
	innertbl.appendChild(tr);
	
	var trtbody= document.createElement("TBODY");
	var crtlId= lstRAIDController.value;
	
	for(j=0;j<RAID_LOGICAL_INFO_DATA.length;j++) {
		var data= RAID_LOGICAL_INFO_DATA[j];
		if(crtlId==data.CtrlID) {
			var tr1= document.createElement("TR");
			tr1.className="normal";
			
			for(i=0;i<strVirtualFields.length;i++) {
				var td= document.createElement("TD");
				td.style.whiteSpace="nowrap";
				td.style.textAlign="center";
				
				if(i==13) {
					var atag=document.createElement("A");
					atag.innerHTML="View";
					atag.href="#";
					atag.elementdata=RAID_LOGICAL_INFO_DATA[j].Elements;
					atag.onclick=DisplayLogicalPopUp;
					td.appendChild(atag);
					tr1.appendChild(td);
				}
				else {
					tr1.appendChild(td);
				}
			}
			innertbl.appendChild(tr1);
		}
	}
	//innertbl.appendChild(trtbody);
	tbltd.appendChild(innertbl);
	
	tbltr.appendChild(tbltd);
	tbl.appendChild(tbltr);
	
	listGridRAIDHolder.appendChild(tbl);
	
	bindRAIDLogicalData();
}

function DisplayLogicalPopUp(obj) {
	var tag= obj; 
	if(tag!= null) {
		reloadHelp();
		
		var tagdata= tag.getAttribute("ElementsData").split('~');
		/*if(tagdata[1]=="") {
			buildLogicalPropertiesPopUp(1,null);	
		}
		else  {
			buildLogicalPropertiesPopUp(tagdata.length-1,tag);
		}*/
		
		/*if(RAID_PHYSICAL_INFO_DATA == undefined) {
			getRAIDPhysicalInformation();
		}*/
		
		loadRAIDLogicalPopupCustomPageElements();
		
		var JSONRows = [];
		
		PopupRAIDLogTable.clear();
		
		
		for(k=0;k<tagdata.length-1;k++) {
			if(tagdata[k] != "") {
				var elData=tagdata[k].split(',');			
				bindLogicalPhysicalPopupData(elData[0].replace("(",""),elData[1].replace(")",""),JSONRows);	
			}
		}
	}
	
}

function buildLogicalPropertiesPopUp(totalRows,elemData) {
	//var devId=devid;
	var descFrame = getDescFrame();
	
	var heading = document.createElement("h3");
	heading.innerHTML ="Controller Name :"+ lstRAIDController.options[lstRAIDController.selectedIndex].text;
	
	var innertbl= document.createElement("TABLE");
	innertbl.cellSpacing = 0;
	innertbl.cellPadding = 0;
	innertbl.border = 0;
	innertbl.width = '80%';
	innertbl.id="tblLogicalPopup";
	innertbl.align="center";
	innertbl.className="raidtable";
	
	var trthread= document.createElement("THREAD");
	
	var tr= document.createElement("TR");
	for(i=0;i<strMainPhysicalLogicalFields.length;i++) {
		
		var td= document.createElement("TD");
		td.style.whiteSpace="nowrap";
		td.className="head";
		td.style.textAlign="center";
		var tddata= strMainPhysicalLogicalFields[i];
		for(key in tddata) {
			if(tddata.hasOwnProperty(key)) {
				td.innerHTML="<strong>" + key + "</strong>";
			}
		}
		tr.appendChild(td);
	}
	//trthread.appendChild(tr);
	innertbl.appendChild(tr);
	
	
	var trtbody= document.createElement("TBODY");
	var crtlId= lstRAIDController.value;
	
	if(elemData == null) {
		for(j=0;j<totalRows;j++) {
			var tr1= document.createElement("TR");
			tr1.className="normal";
			for(i=0;i<strMainPhysicalLogicalFields.length;i++) {
				var td= document.createElement("TD");
				td.style.textAlign="center";
				td.style.whiteSpace="nowrap";
				tr1.appendChild(td);
			}
			innertbl.appendChild(tr1);	
		}
	} else {
		 
		for(j=0;j<RAID_PHYSICAL_INFO_DATA.length;j++) {
			var tData=elemData.split('~');
			for(k=0;k<totalRows;k++) {
				var devId= tData[k].split(',')[0].replace("(","");
				if(crtlId== RAID_PHYSICAL_INFO_DATA[j].CtrlID && devId == RAID_PHYSICAL_INFO_DATA[j].DevID) {
					//for(j=0;j<totalRows;j++) {
						var tr1= document.createElement("TR");
						tr1.className="normal";
						for(i=0;i<strMainPhysicalLogicalFields.length;i++) {
							var td= document.createElement("TD");
							td.style.textAlign="center";
							td.style.whiteSpace="nowrap";
							tr1.appendChild(td);
						}
						innertbl.appendChild(tr1);	
					//}
						
				}
			}
			
		}
	}
	

	var br=document.createElement("br");
	
	descFrame.appendChild(heading);
	
	descFrame.appendChild(innertbl);
	descFrame.appendChild(br);
}

function bindLogicalPhysicalPopupData(devId,elementType,JSONRows) {
	var crtlId= lstRAIDController.value;
	
	var l=0;
	for (j = 0; j < RAID_PHYSICAL_INFO_DATA.length; j++) {
		
		var data = RAID_PHYSICAL_INFO_DATA[j];
		
		if (j >= RAID_PHYSICAL_INFO_DATA.length) {
			break;
		}
		
		if(crtlId==data.CtrlID && devId==data.DevID) {
			
			var elemType=GetLogicalElementType(elementType);
			var devid=data.DevID;
			var type=GetPhysicalType(data.Type);
			var state=GetPhysicalState(data.State);
			var slot=data.Slot;
			var speed=GetPhysicalSpeed(data.Speed);
			var linkspeed=GetPhysicalSpeed(data.LinkSpeed);
			var size= data.Size;
			var temp=GetTemperature(data.Temperature);
			
			
			JSONRows.push({cells:[
				/*{text:elemType, value:elemType},*/
				{text:devid, value:devid},
				{text:type, value:type},
				{text:state, value:state},
				{text:slot, value:slot},
				{text:speed, value:speed},
				{text:linkspeed, value:linkspeed},
				{text:size, value:size},
				{text:temp, value:temp}
				]});
			
			tblJSON.rows = JSONRows;
		}
	}

	
	PopupRAIDLogTable.loadFromJson(tblJSON);
	
	
	/*if(RAID_PHYSICAL_INFO_DATA == undefined) return;
	if(RAID_PHYSICAL_INFO_DATA.length > 0) {
		
		for(i=0;i< RAID_PHYSICAL_INFO_DATA.length;i++) {
			
			var data=RAID_PHYSICAL_INFO_DATA[i];
			var tr=tblPhysicalPopup.getElementsByTagName("TR")[i+1];
			if(tr != null)
			var tds=tr.getElementsByTagName("TD");
			if(tds != null)
				
			if(crtlId==data.CtrlID && devId==data.DevID) {
			
			tds[0].innerHTML=GetLogicalElementType(elementType);
			tds[1].innerHTML=data.DevID;
			tds[2].innerHTML=GetPhysicalType(data.Type);
			tds[3].innerHTML=GetPhysicalState(data.State);
			//tds[0].innerHTML=data.VendorID;
			//tds[1].innerHTML=data.ProductID;
			//tds[2].innerHTML=data.SerialNum;
			tds[4].innerHTML=data.Slot;
			//tds[3].innerHTML=GetPhysicalSlotPresent(data.Present);
			//tds[4].innerHTML=GetPhysicalLEDStatus(data.LEDStatus);
			//tds[5].innerHTML=GetPhysicalInterfaceType(data.InterfaceType);
			//tds[6].innerHTML=GetPhysicalCache(data.Cache);
			tds[5].innerHTML=GetPhysicalSpeed(data.Speed);
			//tds[7].innerHTML=data.Size;
			//tds[8].innerHTML=data.BlockSize;
			tds[6].innerHTML=data.LinkSpeed;
			tds[7].innerHTML=data.Size;
			//tds[6].innerHTML=GetPhysicalPowerStatus(data.PowerState);
			tds[8].innerHTML=GetTemperature(data.Temperature);
			//tds[10].innerHTML=GetPhysicalSmart(data.Smart);
			} 
		}
	}*/
}

function bindRAIDLogicalData() {
	var crtlId= lstRAIDController.value;
	var tblinfo= document.getElementById("tblRAIDInfo");
	
	if(RAID_LOGICAL_INFO_DATA.length > 0) {
		
		for(i=0;i< RAID_LOGICAL_INFO_DATA.length;i++) {			
			var data=RAID_LOGICAL_INFO_DATA[i];
			var tr=tblinfo.getElementsByTagName("TR")[i+1];
			if(tr != null)
			var tds=tr.getElementsByTagName("TD");
			if(tds != null)
			if(crtlId==data.CtrlID) {
			tds[0].innerHTML=(data.LDName=="")?"Not Available":data.LDName;
			tds[1].innerHTML=data.Type;
			tds[2].innerHTML=GetLogicalState(data.State);
			tds[3].innerHTML=GetStripeSize(data.StripeSize);
			//tds[4].innerHTML=GetLogicalAccessPolicy(data.AccessPolicy);
			tds[4].innerHTML=GetLogicalReadPolicy(data.ReadPolicy);
			tds[5].innerHTML=GetLogicalWritePolicy(data.WritePolicy);
			tds[6].innerHTML=GetLogicalCachePolicy(data.CachePolicy);
			tds[7].innerHTML=GetLogicalBGI(data.BGI);
			tds[8].innerHTML=GetLogicalSSD(data.SSD_Caching);
			tds[9].innerHTML=GetLogicalProgress(data.Progress);
			tds[10].innerHTML=GetLogicalBadBlocks(data.BadBlocks);
			tds[11].innerHTML=data.Size;
			tds[12].innerHTML=data.ElementsNum;
			tds[13].getElementsByTagName("A")[0].elementData=data.Elements;
			}
		}
	}
}

function changeBBUStatus(statusCode) {
	var descText;
	switch(GET_ERROR_CODE(statusCode)) {
	case 0x00:
		descText=eLang.getString("common", "STR_RAID_BBU_MISSING");
		break;
	case 0x01:
		descText=eLang.getString("common", "STR_RAID_BBU_INIT");
		break;
	case 0x02:
		descText=eLang.getString("common", "STR_RAID_BBU_READY");
		break;
	case 0x04:
		descText=eLang.getString("common", "STR_RAID_BBU_LEARN");
		break;
	case 0x08:
		descText=eLang.getString("common", "STR_RAID_BBU_FATAL");
		break;
	case 0x10:
		descText=eLang.getString("common", "STR_RAID_BBU_OVER_TEMP");
		break;
	case 0x20:
		descText=eLang.getString("common", "STR_RAID_BBU_WARN_TEMP");
		break;
	case 0x40:
		descText=eLang.getString("common", "STR_RAID_BBU_OVER_VOLTAGE");
		break;
	case 0x80:
		descText=eLang.getString("common", "STR_RAID_BBU_OVER_CURRENT");
		break;
	case 0x100:
		descText=eLang.getString("common", "STR_RAID_BBU_LEARN_PASS");
		break;
	case 0x200:
		descText=eLang.getString("common", "STR_RAID_BBU_LEARN_FAIL");
		break;
	default:
		descText=eLang.getString("common", "STR_RAID_NOT_AVAILABLE");
		break;
	}
	return descText;
}


function initialRAIDEventCodeValues() {
	RAID_EVENT_LOG_CODE[0]="EVT_BOOT"
	RAID_EVENT_LOG_CODE[1]="EVT_VERSION"
	RAID_EVENT_LOG_CODE[2]="EVT_BBU_TBBU_DIRTY_CACHE_CONFIG_MISMATCH"
	RAID_EVENT_LOG_CODE[3]="EVT_BBU_TBBU_DIRTY_CACHE_PROCESSED"
	RAID_EVENT_LOG_CODE[4]="EVT_CFG_CLEARED"
	RAID_EVENT_LOG_CODE[5]="EVT_CLUST_DOWN"
	RAID_EVENT_LOG_CODE[6]="EVT_CLUST_OWNERSHIP_CHANGE"
	RAID_EVENT_LOG_CODE[7]="EVT_CTRL_ALARM_DISABLED"
	RAID_EVENT_LOG_CODE[8]="EVT_CTRL_ALARM_ENABLED"
	RAID_EVENT_LOG_CODE[9]="EVT_CTRL_BGI_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[10]="EVT_CTRL_CACHE_DISCARDED"
	RAID_EVENT_LOG_CODE[11]="EVT_CTRL_CACHE_REBOOT_CANT_RECOVER"
	RAID_EVENT_LOG_CODE[12]="EVT_CTRL_CACHE_REBOOT_RECOVER"
	RAID_EVENT_LOG_CODE[13]="EVT_CTRL_CACHE_VERSION_MISMATCH"
	RAID_EVENT_LOG_CODE[14]="EVT_CTRL_CC_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[15]="EVT_CTRL_CRASH"
	RAID_EVENT_LOG_CODE[16]="EVT_CTRL_FACTORY_DEFAULTS"
	RAID_EVENT_LOG_CODE[17]="EVT_CTRL_FLASH_BAD_IMAGE"
	RAID_EVENT_LOG_CODE[18]="EVT_CTRL_FLASH_ERASE_ERROR"
	RAID_EVENT_LOG_CODE[19]="EVT_CTRL_FLASH_ERASE_TIMEOUT"
	RAID_EVENT_LOG_CODE[20]="EVT_CTRL_FLASH_GENERAL_ERROR"
	RAID_EVENT_LOG_CODE[21]="EVT_CTRL_FLASH_IMAGE"
	RAID_EVENT_LOG_CODE[22]="EVT_CTRL_FLASH_OK"
	RAID_EVENT_LOG_CODE[23]="EVT_CTRL_FLASH_PROGRAM_ERROR"
	RAID_EVENT_LOG_CODE[24]="EVT_CTRL_FLASH_PROGRAM_TIMEOUT"
	RAID_EVENT_LOG_CODE[25]="EVT_CTRL_FLASH_UNKNOWN_CHIP_TYPE"
	RAID_EVENT_LOG_CODE[26]="EVT_CTRL_FLASH_UNKNOWN_CMD_SET"
	RAID_EVENT_LOG_CODE[27]="EVT_CTRL_FLASH_VERIFY_FAILURE"
	RAID_EVENT_LOG_CODE[28]="EVT_CTRL_FLUSH_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[29]="EVT_CTRL_HIBERNATE"
	RAID_EVENT_LOG_CODE[30]="EVT_CTRL_LOG_CLEARED"
	RAID_EVENT_LOG_CODE[31]="EVT_CTRL_LOG_WRAPPED"
	RAID_EVENT_LOG_CODE[32]="EVT_CTRL_MEM_ECC_MULTI_BIT"
	RAID_EVENT_LOG_CODE[33]="EVT_CTRL_MEM_ECC_SINGLE_BIT"
	RAID_EVENT_LOG_CODE[34]="EVT_CTRL_NOT_ENOUGH_MEMORY"
	RAID_EVENT_LOG_CODE[35]="EVT_CTRL_PR_DONE"
	RAID_EVENT_LOG_CODE[36]="EVT_CTRL_PR_PAUSE"
	RAID_EVENT_LOG_CODE[37]="EVT_CTRL_PR_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[38]="EVT_CTRL_PR_RESUME"
	RAID_EVENT_LOG_CODE[39]="EVT_CTRL_PR_START"
	RAID_EVENT_LOG_CODE[40]="EVT_CTRL_REBUILD_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[41]="EVT_CTRL_RECON_RATE_CHANGED"
	RAID_EVENT_LOG_CODE[42]="EVT_CTRL_SHUTDOWN"
	RAID_EVENT_LOG_CODE[43]="EVT_CTRL_TEST"
	RAID_EVENT_LOG_CODE[44]="EVT_CTRL_TIME_SET"
	RAID_EVENT_LOG_CODE[45]="EVT_CTRL_USER_ENTERED_DEBUGGER"
	RAID_EVENT_LOG_CODE[46]="EVT_LD_BGI_ABORTED"
	RAID_EVENT_LOG_CODE[47]="EVT_LD_BGI_CORRECTED_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[48]="EVT_LD_BGI_DONE"
	RAID_EVENT_LOG_CODE[49]="EVT_LD_BGI_DONE_ERRORS"
	RAID_EVENT_LOG_CODE[50]="EVT_LD_BGI_DOUBLE_MEDIUM_ERRORS"
	RAID_EVENT_LOG_CODE[51]="EVT_LD_BGI_FAILED"
	RAID_EVENT_LOG_CODE[52]="EVT_LD_BGI_PROGRESS"
	RAID_EVENT_LOG_CODE[53]="EVT_LD_BGI_START"
	RAID_EVENT_LOG_CODE[54]="EVT_LD_CACHE_POLICY_CHANGE"
	RAID_EVENT_LOG_CODE[55]="EVT_OBSOLETE_1"
	RAID_EVENT_LOG_CODE[56]="EVT_LD_CC_ABORTED"
	RAID_EVENT_LOG_CODE[57]="EVT_LD_CC_CORRECTED_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[58]="EVT_LD_CC_DONE"
	RAID_EVENT_LOG_CODE[59]="EVT_LD_CC_DONE_INCON"
	RAID_EVENT_LOG_CODE[60]="EVT_LD_CC_DOUBLE_MEDIUM_ERRORS"
	RAID_EVENT_LOG_CODE[61]="EVT_LD_CC_FAILED"
	RAID_EVENT_LOG_CODE[62]="EVT_LD_CC_FAILED_UNCOR"
	RAID_EVENT_LOG_CODE[63]="EVT_LD_CC_INCONSISTENT_PARITY"
	RAID_EVENT_LOG_CODE[64]="EVT_LD_CC_INCONSISTENT_PARITY_LOGGING_DISABLED"
	RAID_EVENT_LOG_CODE[65]="EVT_LD_CC_PROGRESS"
	RAID_EVENT_LOG_CODE[66]="EVT_LD_CC_START"
	RAID_EVENT_LOG_CODE[67]="EVT_LD_INIT_ABORTED"
	RAID_EVENT_LOG_CODE[68]="EVT_LD_INIT_FAILED"
	RAID_EVENT_LOG_CODE[69]="EVT_LD_INIT_PROGRESS"
	RAID_EVENT_LOG_CODE[70]="EVT_LD_INIT_START_FAST"
	RAID_EVENT_LOG_CODE[71]="EVT_LD_INIT_START_FULL"
	RAID_EVENT_LOG_CODE[72]="EVT_LD_INIT_SUCCESSFUL"
	RAID_EVENT_LOG_CODE[73]="EVT_LD_PROP_CHANGE"
	RAID_EVENT_LOG_CODE[74]="EVT_LD_RECON_DONE"
	RAID_EVENT_LOG_CODE[75]="EVT_LD_RECON_DONE_ERRORS"
	RAID_EVENT_LOG_CODE[76]="EVT_LD_RECON_DOUBLE_MEDIUM_ERRORS"
	RAID_EVENT_LOG_CODE[77]="EVT_LD_RECON_PROGRESS"
	RAID_EVENT_LOG_CODE[78]="EVT_LD_RECON_RESUME"
	RAID_EVENT_LOG_CODE[79]="EVT_LD_RECON_RESUME_FAILED"
	RAID_EVENT_LOG_CODE[80]="EVT_LD_RECON_START"
	RAID_EVENT_LOG_CODE[81]="EVT_LD_STATE_CHANGE"
	RAID_EVENT_LOG_CODE[82]="EVT_PD_CLEAR_ABORTED"
	RAID_EVENT_LOG_CODE[83]="EVT_PD_CLEAR_FAILED"
	RAID_EVENT_LOG_CODE[84]="EVT_PD_CLEAR_PROGRESS"
	RAID_EVENT_LOG_CODE[85]="EVT_PD_CLEAR_STARTED"
	RAID_EVENT_LOG_CODE[86]="EVT_PD_CLEAR_SUCCESSFUL"
	RAID_EVENT_LOG_CODE[87]="EVT_PD_ERR"
	RAID_EVENT_LOG_CODE[88]="EVT_PD_FORMAT_COMPLETE"
	RAID_EVENT_LOG_CODE[89]="EVT_PD_FORMAT_STARTED"
	RAID_EVENT_LOG_CODE[90]="EVT_PD_HS_SMART_POLL_FAILED"
	RAID_EVENT_LOG_CODE[91]="EVT_PD_INSERTED"
	RAID_EVENT_LOG_CODE[92]="EVT_PD_NOT_SUPPORTED"
	RAID_EVENT_LOG_CODE[93]="EVT_PD_PR_CORRECTED"
	RAID_EVENT_LOG_CODE[94]="EVT_PD_PR_PROGRESS"
	RAID_EVENT_LOG_CODE[95]="EVT_PD_PR_UNCORRECTABLE"
	RAID_EVENT_LOG_CODE[96]="EVT_PD_PREDICTIVE_THRESHOLD_EXCEEDED"
	RAID_EVENT_LOG_CODE[97]="EVT_PD_PUNCTURE"
	RAID_EVENT_LOG_CODE[98]="EVT_PD_RBLD_ABORT_BY_USER"
	RAID_EVENT_LOG_CODE[99]="EVT_PD_RBLD_DONE_LD"
	RAID_EVENT_LOG_CODE[100]="EVT_PD_RBLD_DONE_PD"
	RAID_EVENT_LOG_CODE[101]="EVT_PD_RBLD_FAILED_BAD_SOURCE"
	RAID_EVENT_LOG_CODE[102]="EVT_PD_RBLD_FAILED_BAD_TARGET"
	RAID_EVENT_LOG_CODE[103]="EVT_PD_RBLD_PROGRESS"
	RAID_EVENT_LOG_CODE[104]="EVT_PD_RBLD_RESUME"
	RAID_EVENT_LOG_CODE[105]="EVT_PD_RBLD_START"
	RAID_EVENT_LOG_CODE[106]="EVT_PD_RBLD_START_AUTO"
	RAID_EVENT_LOG_CODE[107]="EVT_PD_RBLD_STOP_BY_OWNERSHIP_LOSS"
	RAID_EVENT_LOG_CODE[108]="EVT_PD_REASSIGN_WRITE_FAILED"
	RAID_EVENT_LOG_CODE[109]="EVT_PD_REBUILD_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[110]="EVT_PD_REC_CORRECTING"
	RAID_EVENT_LOG_CODE[111]="EVT_PD_RECOVER_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[112]="EVT_PD_REMOVED"
	RAID_EVENT_LOG_CODE[113]="EVT_PD_SENSE"
	RAID_EVENT_LOG_CODE[114]="EVT_PD_STATE_CHANGE"
	RAID_EVENT_LOG_CODE[115]="EVT_PD_STATE_CHANGE_BY_USER"
	RAID_EVENT_LOG_CODE[116]="EVT_PD_REDUNDANT_PATH_BROKEN"
	RAID_EVENT_LOG_CODE[117]="EVT_PD_REDUNDANT_PATH_RESTORED"
	RAID_EVENT_LOG_CODE[118]="EVT_PD_DEDICATED_SPARE_NO_LONGER_USEFUL"
	RAID_EVENT_LOG_CODE[119]="EVT_SAS_TOPOLOGY_LOOP_DETECTED"
	RAID_EVENT_LOG_CODE[120]="EVT_SAS_TOPOLOGY_UNADDRESSABLE_DEVICE"
	RAID_EVENT_LOG_CODE[121]="EVT_SAS_TOPOLOGY_MULTIPLE_PORTS_TO_SAME_ADDR"
	RAID_EVENT_LOG_CODE[122]="EVT_SAS_TOPOLOGY_EXPANDER_ERR"
	RAID_EVENT_LOG_CODE[123]="EVT_SAS_TOPOLOGY_SMP_TIMEOUT"
	RAID_EVENT_LOG_CODE[124]="EVT_SAS_TOPOLOGY_OUT_OF_ROUTE_ENTRIES"
	RAID_EVENT_LOG_CODE[125]="EVT_SAS_TOPOLOGY_INDEX_NOT_FOUND"
	RAID_EVENT_LOG_CODE[126]="EVT_SAS_TOPOLOGY_SMP_FUNCTION_FAILED"
	RAID_EVENT_LOG_CODE[127]="EVT_SAS_TOPOLOGY_SMP_CRC_ERROR"
	RAID_EVENT_LOG_CODE[128]="EVT_SAS_TOPOLOGY_MULITPLE_SUBTRACTIVE"
	RAID_EVENT_LOG_CODE[129]="EVT_SAS_TOPOLOGY_TABLE_TO_TABLE"
	RAID_EVENT_LOG_CODE[130]="EVT_SAS_TOPOLOGY_MULTIPLE_PATHS"
	RAID_EVENT_LOG_CODE[131]="EVT_PD_UNUSABLE"
	RAID_EVENT_LOG_CODE[132]="EVT_PD_SPARE_DEDICATED_CREATED"
	RAID_EVENT_LOG_CODE[133]="EVT_PD_SPARE_DEDICATED_DISABLED"
	RAID_EVENT_LOG_CODE[134]="EVT_PD_SPARE_DEDICATED_NOT_USEFUL_FOR_ALL_ARRAYS"
	RAID_EVENT_LOG_CODE[135]="EVT_PD_SPARE_GLOBAL_CREATED"
	RAID_EVENT_LOG_CODE[136]="EVT_PD_SPARE_GLOBAL_DISABLED"
	RAID_EVENT_LOG_CODE[137]="EVT_PD_SPARE_GLOBAL_NOT_COVERING_ALL_ARRAYS"
	RAID_EVENT_LOG_CODE[138]="EVT_LD_CREATED"
	RAID_EVENT_LOG_CODE[139]="EVT_LD_DELETED"
	RAID_EVENT_LOG_CODE[140]="EVT_LD_INCONSISTENT_DUE_AT_STARTUP"
	RAID_EVENT_LOG_CODE[141]="EVT_BBU_PRESENT"
	RAID_EVENT_LOG_CODE[142]="EVT_BBU_NOT_PRESENT"
	RAID_EVENT_LOG_CODE[143]="EVT_BBU_NEW_BATTERY_DETECTED"
	RAID_EVENT_LOG_CODE[144]="EVT_BBU_REPLACED"
	RAID_EVENT_LOG_CODE[145]="EVT_BBU_TEMPERATURE_HIGH"
	RAID_EVENT_LOG_CODE[146]="EVT_BBU_VOLTAGE_LOW"
	RAID_EVENT_LOG_CODE[147]="EVT_BBU_CHARGING"
	RAID_EVENT_LOG_CODE[148]="EVT_BBU_DISCHARGING"
	RAID_EVENT_LOG_CODE[149]="EVT_BBU_TEMPERATURE_NORMAL"
	RAID_EVENT_LOG_CODE[150]="EVT_BBU_REPLACEMENT_NEEDED_SOH_BAD"
	RAID_EVENT_LOG_CODE[151]="EVT_BBU_RELEARN_STARTED"
	RAID_EVENT_LOG_CODE[152]="EVT_BBU_RELEARN_IN_PROGRESS"
	RAID_EVENT_LOG_CODE[153]="EVT_BBU_RELEARN_COMPLETE"
	RAID_EVENT_LOG_CODE[154]="EVT_BBU_RELEARN_TIMEOUT"
	RAID_EVENT_LOG_CODE[155]="EVT_BBU_RELEARN_PENDING"
	RAID_EVENT_LOG_CODE[156]="EVT_BBU_RELEARN_POSTPONED"
	RAID_EVENT_LOG_CODE[157]="EVT_BBU_RELEARN_WILL_START_IN_4_DAYS"
	RAID_EVENT_LOG_CODE[158]="EVT_BBU_RELEARN_WILL_START_IN_2_DAYS"
	RAID_EVENT_LOG_CODE[159]="EVT_BBU_RELEARN_WILL_START_IN_1_DAYS"
	RAID_EVENT_LOG_CODE[160]="EVT_BBU_RELEARN_WILL_START_IN_5_HOURS"
	RAID_EVENT_LOG_CODE[161]="EVT_BBU_BATTERY_REMOVED"
	RAID_EVENT_LOG_CODE[162]="EVT_BBU_BATTERY_CAP_BELOW_SOH_THRESHOLD"
	RAID_EVENT_LOG_CODE[163]="EVT_BBU_BATTERY_CAP_ABOVE_SOH_THRESHOLD"
	RAID_EVENT_LOG_CODE[164]="EVT_ENCL_DISCOVERED_SES"
	RAID_EVENT_LOG_CODE[165]="EVT_ENCL_DISCOVERED_SAFTE"
	RAID_EVENT_LOG_CODE[166]="EVT_ENCL_COMMUNICATION_LOST"
	RAID_EVENT_LOG_CODE[167]="EVT_ENCL_COMMUNICATION_RESTORED"
	RAID_EVENT_LOG_CODE[168]="EVT_ENCL_FAN_FAILED"
	RAID_EVENT_LOG_CODE[169]="EVT_ENCL_FAN_INSERTED"
	RAID_EVENT_LOG_CODE[170]="EVT_ENCL_FAN_REMOVED"
	RAID_EVENT_LOG_CODE[171]="EVT_ENCL_POWER_FAILED"
	RAID_EVENT_LOG_CODE[172]="EVT_ENCL_POWER_INSERTED"
	RAID_EVENT_LOG_CODE[173]="EVT_ENCL_POWER_REMOVED"
	RAID_EVENT_LOG_CODE[174]="EVT_ENCL_SIM_FAILED"
	RAID_EVENT_LOG_CODE[175]="EVT_ENCL_SIM_INSERTED"
	RAID_EVENT_LOG_CODE[176]="EVT_ENCL_SIM_REMOVED"
	RAID_EVENT_LOG_CODE[177]="EVT_ENCL_TEMPERATURE_BELOW_WARNING"
	RAID_EVENT_LOG_CODE[178]="EVT_ENCL_TEMPERATURE_BELOW_ERROR"
	RAID_EVENT_LOG_CODE[179]="EVT_ENCL_TEMPERATURE_ABOVE_WARNING"
	RAID_EVENT_LOG_CODE[180]="EVT_ENCL_TEMPERATURE_ABOVE_ERROR"
	RAID_EVENT_LOG_CODE[181]="EVT_ENCL_SHUTDOWN"
	RAID_EVENT_LOG_CODE[182]="EVT_ENCL_MAX_PER_PORT_EXCEEDED"
	RAID_EVENT_LOG_CODE[183]="EVT_ENCL_FIRMWARE_MISMATCH"
	RAID_EVENT_LOG_CODE[184]="EVT_ENCL_BAD_SENSOR"
	RAID_EVENT_LOG_CODE[185]="EVT_ENCL_BAD_PHY"
	RAID_EVENT_LOG_CODE[186]="EVT_ENCL_UNSTABLE"
	RAID_EVENT_LOG_CODE[187]="EVT_ENCL_HARDWARE_ERROR"
	RAID_EVENT_LOG_CODE[188]="EVT_ENCL_NOT_RESPONDING"
	RAID_EVENT_LOG_CODE[189]="EVT_ENCL_SAS_SATA_MIXING_DETECTED"
	RAID_EVENT_LOG_CODE[190]="EVT_ENCL_SES_HOTPLUG_DETECTED"
	RAID_EVENT_LOG_CODE[191]="EVT_CLUSTER_ENABLED"
	RAID_EVENT_LOG_CODE[192]="EVT_CLUSTER_DISABLED"
	RAID_EVENT_LOG_CODE[193]="EVT_PD_TOO_SMALL_FOR_AUTO_REBUILD"
	RAID_EVENT_LOG_CODE[194]="EVT_BBU_GOOD"
	RAID_EVENT_LOG_CODE[195]="EVT_BBU_BAD"
	RAID_EVENT_LOG_CODE[196]="EVT_PD_BBM_LOG_80_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[197]="EVT_PD_BBM_LOG_FULL"
	RAID_EVENT_LOG_CODE[198]="EVT_LD_CC_OWNERSHIP_LOSS_ABORT"
	RAID_EVENT_LOG_CODE[199]="EVT_LD_BGI_OWNERSHIP_LOSS_ABORT"
	RAID_EVENT_LOG_CODE[200]="EVT_BBU_BATTERY_SOH_INVALID"
	RAID_EVENT_LOG_CODE[201]="EVT_CTRL_MEM_ECC_SINGLE_BIT_WARNING"
	RAID_EVENT_LOG_CODE[202]="EVT_CTRL_MEM_ECC_SINGLE_BIT_CRITICAL"
	RAID_EVENT_LOG_CODE[203]="EVT_CTRL_MEM_ECC_SINGLE_BIT_DISABLED"
	RAID_EVENT_LOG_CODE[204]="EVT_ENCL_POWER_SUPPLY_OFF"
	RAID_EVENT_LOG_CODE[205]="EVT_ENCL_POWER_SUPPLY_ON"
	RAID_EVENT_LOG_CODE[206]="EVT_ENCL_POWER_SUPPLY_CABLE_REMOVED"
	RAID_EVENT_LOG_CODE[207]="EVT_ENCL_POWER_SUPPLY_CABLE_INSERTED"
	RAID_EVENT_LOG_CODE[208]="EVT_ENCL_FAN_RETURNED_TO_NORMAL"
	RAID_EVENT_LOG_CODE[209]="EVT_DIAG_BBU_RETENTION_TEST_STARTED_ON_PREV_BOOT"
	RAID_EVENT_LOG_CODE[210]="EVT_DIAG_BBU_RETENTION_PASSED"
	RAID_EVENT_LOG_CODE[211]="EVT_DIAG_BAT_RETENTION_TEST_FAILED"
	RAID_EVENT_LOG_CODE[212]="EVT_DIAG_NVRAM_RET_TEST_STARTED_ON_PREV_BOOT"
	RAID_EVENT_LOG_CODE[213]="EVT_DIAG_NVRAM_RENTION_TEST_SUCCESS"
	RAID_EVENT_LOG_CODE[214]="EVT_DIAG_NVRAM_RENTION_TEST_FAILED"
	RAID_EVENT_LOG_CODE[215]="EVT_DIAG_SELF_CHECK_TEST_PASS"
	RAID_EVENT_LOG_CODE[216]="EVT_DIAG_SELF_CHECK_TEST_FAIL"
	RAID_EVENT_LOG_CODE[217]="EVT_DIAG_SELF_CHECK_DONE"
	RAID_EVENT_LOG_CODE[218]="EVT_FOREIGN_CFG_DETECTED"
	RAID_EVENT_LOG_CODE[219]="EVT_FOREIGN_CFG_IMPORTED"
	RAID_EVENT_LOG_CODE[220]="EVT_FOREIGN_CFG_CLEARED"
	RAID_EVENT_LOG_CODE[221]="EVT_NVRAM_CORRUPT"
	RAID_EVENT_LOG_CODE[222]="EVT_NVRAM_MISMATCH"
	RAID_EVENT_LOG_CODE[223]="EVT_SAS_WIDE_PORT_LINK_LOST"
	RAID_EVENT_LOG_CODE[224]="EVT_SAS_WIDE_PORT_LINK_RESTORED"
	RAID_EVENT_LOG_CODE[225]="EVT_SAS_PHY_ERROR_RATE_EXCEEDED"
	RAID_EVENT_LOG_CODE[226]="EVT_SATA_BAD_BLOCK_REMAPED"
	RAID_EVENT_LOG_CODE[227]="EVT_CTRL_HOTPLUG_DETECTED"
	RAID_EVENT_LOG_CODE[228]="EVT_ENCL_TEMPERATURE_DIFFERENTIAL"
	RAID_EVENT_LOG_CODE[229]="EVT_DIAG_DISK_TEST_CANNOT_START"
	RAID_EVENT_LOG_CODE[230]="EVT_DIAG_TIME_NOT_SUFFICIENT"
	RAID_EVENT_LOG_CODE[231]="EVT_PD_MARK_MISSING"
	RAID_EVENT_LOG_CODE[232]="EVT_PD_REPLACE_MISSING"
	RAID_EVENT_LOG_CODE[233]="EVT_ENCL_TEMPERATURE_RETURNED_TO_NORMAL"
	RAID_EVENT_LOG_CODE[234]="EVT_ENCL_FIRMWARE_FLASH_IN_PROGRESS"
	RAID_EVENT_LOG_CODE[235]="EVT_ENCL_FIRMWARE_DOWNLOAD_FAILED"
	RAID_EVENT_LOG_CODE[236]="EVT_PD_NOT_CERTIFIED"
	RAID_EVENT_LOG_CODE[237]="EVT_CTRL_CACHE_DISCARD_BY_USER"
	RAID_EVENT_LOG_CODE[238]="EVT_CTRL_BOOT_MISSING_PDS"
	RAID_EVENT_LOG_CODE[239]="EVT_CTRL_BOOT_LDS_WILL_GO_OFFLINE"
	RAID_EVENT_LOG_CODE[240]="EVT_CTRL_BOOT_LDS_MISSING"
	RAID_EVENT_LOG_CODE[241]="EVT_CTRL_BOOT_CONFIG_MISSING"
	RAID_EVENT_LOG_CODE[242]="EVT_BBU_CHARGE_COMPLETE"
	RAID_EVENT_LOG_CODE[243]="EVT_ENCL_FAN_SPEED_CHANGED"
	RAID_EVENT_LOG_CODE[244]="EVT_PD_SPARE_DEDICATED_IMPORTED_AS_GLOBAL"
	RAID_EVENT_LOG_CODE[245]="EVT_PD_NO_REBUILD_SAS_SATA_MIX_NOT_ALLOWED_IN_LD"
	RAID_EVENT_LOG_CODE[246]="EVT_SEP_IS_BEING_REBOOTED"
	RAID_EVENT_LOG_CODE[247]="EVT_PD_INSERTED_EXT"
	RAID_EVENT_LOG_CODE[248]="EVT_PD_REMOVED_EXT"
	RAID_EVENT_LOG_CODE[249]="EVT_LD_OPTIMAL"
	RAID_EVENT_LOG_CODE[250]="EVT_LD_PARTIALLY_DEGRADED"
	RAID_EVENT_LOG_CODE[251]="EVT_LD_DEGRADED"
	RAID_EVENT_LOG_CODE[252]="EVT_LD_OFFLINE"
	RAID_EVENT_LOG_CODE[253]="EVT_BBU_RELEARN_REQUESTED"
	RAID_EVENT_LOG_CODE[254]="EVT_LD_DISABLED_NO_SUPPORT_FOR_RAID5"
	RAID_EVENT_LOG_CODE[255]="EVT_LD_DISABLED_NO_SUPPORT_FOR_RAID6"
	RAID_EVENT_LOG_CODE[256]="EVT_LD_DISABLED_NO_SUPPORT_FOR_SAS"
	RAID_EVENT_LOG_CODE[257]="EVT_CTRL_BOOT_MISSING_PDS_EXT"
	RAID_EVENT_LOG_CODE[258]="EVT_CTRL_PUNCTURE_ENABLED"
	RAID_EVENT_LOG_CODE[259]="EVT_CTRL_PUNCTURE_DISABLED"
	RAID_EVENT_LOG_CODE[260]="EVT_ENCL_SIM_NOT_INSTALLED"
	RAID_EVENT_LOG_CODE[261]="EVT_PACKAGE_VERSION"
	RAID_EVENT_LOG_CODE[262]="EVT_PD_SPARE_AFFINITY_IGNORED"
	RAID_EVENT_LOG_CODE[263]="EVT_FOREIGN_CFG_TABLE_OVERFLOW"
	RAID_EVENT_LOG_CODE[264]="EVT_FOREIGN_CFG_PARTIAL_IMPORT"
	RAID_EVENT_LOG_CODE[265]="EVT_SAS_MUX_ACTIVATED_CONNECTOR"
	RAID_EVENT_LOG_CODE[266]="EVT_CTRL_FRU"
	RAID_EVENT_LOG_CODE[267]="EVT_PD_COMMAND_TIMEOUT"
	RAID_EVENT_LOG_CODE[268]="EVT_PD_RESET"
	RAID_EVENT_LOG_CODE[269]="EVT_LD_BBM_LOG_80_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[270]="EVT_LD_BBM_LOG_FULL"
	RAID_EVENT_LOG_CODE[271]="EVT_LD_LOG_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[272]="EVT_LD_CORRECTED_MEDIUM_ERROR"
	RAID_EVENT_LOG_CODE[273]="EVT_PD_BBM_LOG_100_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[274]="EVT_LD_BBM_LOG_100_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[275]="EVT_DIAG_FAULTY_IOP_DETECTED"
	RAID_EVENT_LOG_CODE[276]="EVT_PD_COPYBACK_START"
	RAID_EVENT_LOG_CODE[277]="EVT_PD_COPYBACK_ABORT"
	RAID_EVENT_LOG_CODE[278]="EVT_PD_COPYBACK_DONE"
	RAID_EVENT_LOG_CODE[279]="EVT_PD_COPYBACK_PROGRESS"
	RAID_EVENT_LOG_CODE[280]="EVT_PD_COPYBACK_RESUME"
	RAID_EVENT_LOG_CODE[281]="EVT_PD_COPYBACK_AUTO"
	RAID_EVENT_LOG_CODE[282]="EVT_PD_COPYBACK_FAILED"
	RAID_EVENT_LOG_CODE[283]="EVT_CTRL_EPOW_UNSUCCESSFUL"
	RAID_EVENT_LOG_CODE[284]="EVT_BBU_FRU"
	RAID_EVENT_LOG_CODE[285]="EVT_PD_FRU"
	RAID_EVENT_LOG_CODE[286]="EVT_CTRL_HW_REVISION"
	RAID_EVENT_LOG_CODE[287]="EVT_FOREIGN_CFG_UPGRADE_REQUIRED"
	RAID_EVENT_LOG_CODE[288]="EVT_PD_SAS_REDUNDANT_PATH_RESTORED"
	RAID_EVENT_LOG_CODE[289]="EVT_PD_SAS_REDUNDANT_PATH_BROKEN"
	RAID_EVENT_LOG_CODE[290]="EVT_ENCL_REDUNDANT_ENCL_MODULE_INSERTED"
	RAID_EVENT_LOG_CODE[291]="EVT_ENCL_REDUNDANT_ENCL_MODULE_REMOVED"
	RAID_EVENT_LOG_CODE[292]="EVT_CTRL_PR_CANT_START"
	RAID_EVENT_LOG_CODE[293]="EVT_PD_COPYBACK_ABORT_BY_USER"
	RAID_EVENT_LOG_CODE[294]="EVT_PD_COPYBACK_ABORT_FOR_SPARE"
	RAID_EVENT_LOG_CODE[295]="EVT_PD_COPYBACK_ABORT_FOR_REBUILD"
	RAID_EVENT_LOG_CODE[296]="EVT_LD_CACHE_DISCARDED"
	RAID_EVENT_LOG_CODE[297]="EVT_PD_TOO_SMALL_FOR_COPYBACK"
	RAID_EVENT_LOG_CODE[298]="EVT_PD_NO_COPYBACK_SAS_SATA_MIX_NOT_ALLOWED_IN_LD"
	RAID_EVENT_LOG_CODE[299]="EVT_PD_FW_DOWNLOAD_START"
	RAID_EVENT_LOG_CODE[300]="EVT_PD_FW_DOWNLOAD_COMPLETE"
	RAID_EVENT_LOG_CODE[301]="EVT_PD_FW_DOWNLOAD_TIMEOUT"
	RAID_EVENT_LOG_CODE[302]="EVT_PD_FW_DOWNLOAD_FAILED"
	RAID_EVENT_LOG_CODE[303]="EVT_CTRL_PROP_CHANGED"
	RAID_EVENT_LOG_CODE[304]="EVT_CTRL_PR_PROP_CHANGED"
	RAID_EVENT_LOG_CODE[305]="EVT_CTRL_CC_SCHEDULE_PROP_CHANGED"
	RAID_EVENT_LOG_CODE[306]="EVT_BBU_PROP_CHANGED"
	RAID_EVENT_LOG_CODE[307]="EVT_BBU_PERIODIC_RELEARN_PENDING"
	RAID_EVENT_LOG_CODE[308]="EVT_CTRL_LOCK_KEY_CREATED"
	RAID_EVENT_LOG_CODE[309]="EVT_CTRL_LOCK_KEY_BACKEDUP"
	RAID_EVENT_LOG_CODE[310]="EVT_CTRL_LOCK_KEY_VERIFIED_ESCROW"
	RAID_EVENT_LOG_CODE[311]="EVT_CTRL_LOCK_KEY_REKEYED"
	RAID_EVENT_LOG_CODE[312]="EVT_CTRL_LOCK_KEY_REKEY_FAILED"
	RAID_EVENT_LOG_CODE[313]="EVT_CTRL_LOCK_KEY_INVALID"
	RAID_EVENT_LOG_CODE[314]="EVT_CTRL_LOCK_KEY_DESTROYED"
	RAID_EVENT_LOG_CODE[315]="EVT_CTRL_ESCROW_KEY_INVALID"
	RAID_EVENT_LOG_CODE[316]="EVT_LD_SECURED"
	RAID_EVENT_LOG_CODE[317]="EVT_LD_PARTIALLY_SECURED"
	RAID_EVENT_LOG_CODE[318]="EVT_PD_SECURED"
	RAID_EVENT_LOG_CODE[319]="EVT_PD_UNSECURED"
	RAID_EVENT_LOG_CODE[320]="EVT_PD_REPROVISIONED"
	RAID_EVENT_LOG_CODE[321]="EVT_PD_LOCK_KEY_REKEYED"
	RAID_EVENT_LOG_CODE[322]="EVT_PD_SECURITY_FAILURE"
	RAID_EVENT_LOG_CODE[323]="EVT_LD_CACHE_PINNED"
	RAID_EVENT_LOG_CODE[324]="EVT_CTRL_BOOT_LDS_CACHE_PINNED"
	RAID_EVENT_LOG_CODE[325]="EVT_CTRL_LDS_CACHE_DISCARDED_BY_USER"
	RAID_EVENT_LOG_CODE[326]="EVT_LD_CACHE_DESTAGED"
	RAID_EVENT_LOG_CODE[327]="EVT_LD_CC_STARTED_ON_INCONSISTENT_LD"
	RAID_EVENT_LOG_CODE[328]="EVT_CTRL_LOCK_KEY_FAILED"
	RAID_EVENT_LOG_CODE[329]="EVT_CTRL_SECRET_KEY_INVALID"
	RAID_EVENT_LOG_CODE[330]="EVT_BBU_REMOTE_CONNECTOR_ERROR"
	RAID_EVENT_LOG_CODE[331]="EVT_PD_POWER_STATE_CHANGE"
	RAID_EVENT_LOG_CODE[332]="EVT_ENCL_ELEMENT_STATUS_CHANGED"
	RAID_EVENT_LOG_CODE[333]="EVT_PD_NO_REBUILD_HDD_SSD_MIX_NOT_ALLOWED_IN_LD"
	RAID_EVENT_LOG_CODE[334]="EVT_PD_NO_COPYBACK_HDD_SSD_MIX_NOT_ALLOWED_IN_LD"
	RAID_EVENT_LOG_CODE[335]="EVT_LD_BBM_LOG_CLEARED"
	RAID_EVENT_LOG_CODE[336]="EVT_SAS_TOPOLOGY_ERROR"
	RAID_EVENT_LOG_CODE[337]="EVT_LD_CORRECTED_CLUSTER_OF_MEDIUM_ERRORS"
	RAID_EVENT_LOG_CODE[338]="EVT_CTRL_HOST_BUS_SCAN_REQUESTED"
	RAID_EVENT_LOG_CODE[339]="EVT_CTRL_FACTORY_REPURPOSED"
	RAID_EVENT_LOG_CODE[340]="EVT_CTRL_LOCK_KEY_BINDING_UPDATED"
	RAID_EVENT_LOG_CODE[341]="EVT_CTRL_LOCK_KEY_EKM_MODE"
	RAID_EVENT_LOG_CODE[342]="EVT_CTRL_LOCK_KEY_EKM_FAILURE"
	RAID_EVENT_LOG_CODE[343]="EVT_PD_LOCK_KEY_REQUIRED"
	RAID_EVENT_LOG_CODE[344]="EVT_LD_SECURE_FAILED"
	RAID_EVENT_LOG_CODE[345]="EVT_CTRL_ONLINE_RESET"
	RAID_EVENT_LOG_CODE[346]="EVT_LD_SNAPSHOT_ENABLED"
	RAID_EVENT_LOG_CODE[347]="EVT_LD_SNAPSHOT_DISABLED_BY_USER"
	RAID_EVENT_LOG_CODE[348]="EVT_LD_SNAPSHOT_DISABLED_INTERNALLY"
	RAID_EVENT_LOG_CODE[349]="EVT_LD_SNAPSHOT_PIT_CREATED"
	RAID_EVENT_LOG_CODE[350]="EVT_LD_SNAPSHOT_PIT_DELETED"
	RAID_EVENT_LOG_CODE[351]="EVT_LD_SNAPSHOT_VIEW_CREATED"
	RAID_EVENT_LOG_CODE[352]="EVT_LD_SNAPSHOT_VIEW_DELETED"
	RAID_EVENT_LOG_CODE[353]="EVT_LD_SNAPSHOT_ROLLBACK_STARTED"
	RAID_EVENT_LOG_CODE[354]="EVT_LD_SNAPSHOT_ROLLBACK_ABORTED"
	RAID_EVENT_LOG_CODE[355]="EVT_LD_SNAPSHOT_ROLLBACK_COMPLETED"
	RAID_EVENT_LOG_CODE[356]="EVT_LD_SNAPSHOT_ROLLBACK_PROGRESS"
	RAID_EVENT_LOG_CODE[357]="EVT_LD_SNAPSHOT_REPOSITORY_80_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[358]="EVT_LD_SNAPSHOT_REPOSITORY_FULL"
	RAID_EVENT_LOG_CODE[359]="EVT_LD_SNAPSHOT_VIEW_80_PERCENT_FULL"
	RAID_EVENT_LOG_CODE[360]="EVT_LD_SNAPSHOT_VIEW_FULL"
	RAID_EVENT_LOG_CODE[361]="EVT_LD_SNAPSHOT_REPOSITORY_LOST"
	RAID_EVENT_LOG_CODE[362]="EVT_LD_SNAPSHOT_REPOSITORY_RESTORED"
	RAID_EVENT_LOG_CODE[363]="EVT_LD_SNAPSHOT_INTERNAL_ERROR"
	RAID_EVENT_LOG_CODE[364]="EVT_LD_SNAPSHOT_AUTO_ENABLED"
	RAID_EVENT_LOG_CODE[365]="EVT_LD_SNAPSHOT_AUTO_DISABLED"
	RAID_EVENT_LOG_CODE[366]="EVT_CFG_CMD_LOST"
	RAID_EVENT_LOG_CODE[367]="EVT_PD_COD_STALE"
	RAID_EVENT_LOG_CODE[368]="EVT_PD_POWER_STATE_CHANGE_FAILED"
	RAID_EVENT_LOG_CODE[369]="EVT_LD_NOT_READY"
	RAID_EVENT_LOG_CODE[370]="EVT_LD_IS_READY"
	RAID_EVENT_LOG_CODE[371]="EVT_LD_IS_SSC"
	RAID_EVENT_LOG_CODE[372]="EVT_LD_IS_USING_SSC"
	RAID_EVENT_LOG_CODE[373]="EVT_LD_IS_NOT_USING_SSC"
	RAID_EVENT_LOG_CODE[374]="EVT_LD_SNAPSHOT_FREED_RESOURCE"
	RAID_EVENT_LOG_CODE[375]="EVT_LD_SNAPSHOT_AUTO_FAILED"
	RAID_EVENT_LOG_CODE[376]="EVT_CTRL_RESET_EXPANDER"
	RAID_EVENT_LOG_CODE[377]="EVT_LD_SSC_SIZE_CHANGED"
	RAID_EVENT_LOG_CODE[378]="EVT_BBU_CANNOT_DO_TRANSPARENT_LEARN"
	RAID_EVENT_LOG_CODE[379]="EVT_CTRL_PFK_APPLIED"
	RAID_EVENT_LOG_CODE[380]="EVT_LD_SNAPSHOT_SCHEDULE_PROP_CHANGE"
	RAID_EVENT_LOG_CODE[381]="EVT_LD_SNAPSHOT_SCHEDULED_ACTION_DUE"
	RAID_EVENT_LOG_CODE[382]="EVT_CTRL_PERF_COLLECTION"
	RAID_EVENT_LOG_CODE[383]="EVT_CTRL_PFK_TRANSFERRED"
	RAID_EVENT_LOG_CODE[384]="EVT_CTRL_PFK_SERIALNUM"
	RAID_EVENT_LOG_CODE[385]="EVT_CTRL_PFK_SERIALNUM_MISMATCH"
	RAID_EVENT_LOG_CODE[386]="EVT_BBU_REPLACEMENT_NEEDED_SOH_NOT_OPTIMAL"
	RAID_EVENT_LOG_CODE[387]="EVT_LD_POWER_STATE_CHANGE"
	RAID_EVENT_LOG_CODE[388]="EVT_LD_POWER_STATE_MAX_UNAVAILABLE"
	RAID_EVENT_LOG_CODE[389]="EVT_CTRL_HOST_DRIVER_LOADED"
	RAID_EVENT_LOG_CODE[390]="EVT_LD_MIRROR_BROKEN"
	RAID_EVENT_LOG_CODE[391]="EVT_LD_MIRROR_JOINED"
	RAID_EVENT_LOG_CODE[392]="EVT_PD_SAS_WIDE_PORT_LINK_FAILURE"
	RAID_EVENT_LOG_CODE[393]="EVT_PD_SAS_WIDE_PORT_LINK_RESTORED"
	RAID_EVENT_LOG_CODE[394]="EVT_TMM_FRU"
	RAID_EVENT_LOG_CODE[395]="EVT_BBU_REPLACEMENT_NEEDED"
	RAID_EVENT_LOG_CODE[396]="EVT_FOREIGN_CFG_AUTO_IMPORT_NONE"
	RAID_EVENT_LOG_CODE[397]="EVT_BBU_MICROCODE_UPDATE_REQUIRED"
	RAID_EVENT_LOG_CODE[398]="EVT_LD_SSC_SIZE_EXCEEDED"
	RAID_EVENT_LOG_CODE[399]="EVT_LD_PI_LOST"
	RAID_EVENT_LOG_CODE[400]="EVT_PD_SHIELD_DIAG_PASS"
	RAID_EVENT_LOG_CODE[401]="EVT_PD_SHIELD_DIAG_FAIL"
	RAID_EVENT_LOG_CODE[402]="EVT_CTRL_SERVER_POWER_DIAG_STARTED"
	RAID_EVENT_LOG_CODE[403]="EVT_PD_RBLD_DRIVE_CACHE_ENABLED"
	RAID_EVENT_LOG_CODE[404]="EVT_PD_RBLD_DRIVE_CACHE_RESTORED"
	RAID_EVENT_LOG_CODE[405]="EVT_PD_EMERGENCY_SPARE_COMMISSIONED"
	RAID_EVENT_LOG_CODE[406]="EVT_PD_EMERGENCY_SPARE_COMMISSIONED_REMINDER"
	RAID_EVENT_LOG_CODE[407]="EVT_LD_CC_SUSPENDED"
	RAID_EVENT_LOG_CODE[408]="EVT_LD_CC_RESUMED"
	RAID_EVENT_LOG_CODE[409]="EVT_LD_BGI_SUSPENDED"
	RAID_EVENT_LOG_CODE[410]="EVT_LD_BGI_RESUMED"
	RAID_EVENT_LOG_CODE[411]="EVT_LD_RECON_SUSPENDED"
	RAID_EVENT_LOG_CODE[412]="EVT_PD_RBLD_SUSPENDED"
	RAID_EVENT_LOG_CODE[413]="EVT_PD_COPYBACK_SUSPENDED"
	RAID_EVENT_LOG_CODE[414]="EVT_LD_CC_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[415]="EVT_LD_BGI_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[416]="EVT_LD_RECON_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[417]="EVT_PD_RBLD_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[418]="EVT_PD_COPYBACK_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[419]="EVT_CTRL_PR_SUSPENDED_REMINDER"
	RAID_EVENT_LOG_CODE[420]="EVT_PD_ERASE_ABORTED"
	RAID_EVENT_LOG_CODE[421]="EVT_PD_ERASE_FAILED"
	RAID_EVENT_LOG_CODE[422]="EVT_PD_ERASE_PROGRESS"
	RAID_EVENT_LOG_CODE[423]="EVT_PD_ERASE_STARTED"
	RAID_EVENT_LOG_CODE[424]="EVT_PD_ERASE_SUCCESSFUL"
	RAID_EVENT_LOG_CODE[425]="EVT_LD_ERASE_ABORTED"
	RAID_EVENT_LOG_CODE[426]="EVT_LD_ERASE_FAILED"
	RAID_EVENT_LOG_CODE[427]="EVT_LD_ERASE_PROGRESS"
	RAID_EVENT_LOG_CODE[428]="EVT_LD_ERASE_START"
	RAID_EVENT_LOG_CODE[429]="EVT_LD_ERASE_SUCCESSFUL"
	RAID_EVENT_LOG_CODE[430]="EVT_LD_ERASE_POTENTIAL_LEAKAGE"
	RAID_EVENT_LOG_CODE[431]="EVT_BBU_CHARGE_DISABLED_OTC"
	RAID_EVENT_LOG_CODE[432]="EVT_BBU_MICROCODE_UPDATED"
	RAID_EVENT_LOG_CODE[433]="EVT_BBU_MICROCODE_UPDATE_FAILED"
	RAID_EVENT_LOG_CODE[434]="EVT_LD_ACCESS_BLOCKED_SSC_OFFLINE"
	RAID_EVENT_LOG_CODE[435]="EVT_LD_SSC_DISASSOCIATE_START"
	RAID_EVENT_LOG_CODE[436]="EVT_LD_SSC_DISASSOCIATE_DONE"
	RAID_EVENT_LOG_CODE[437]="EVT_LD_SSC_DISASSOCIATE_FAILED"
	RAID_EVENT_LOG_CODE[438]="EVT_LD_SSC_DISASSOCIATE_PROGRESS"
	RAID_EVENT_LOG_CODE[439]="EVT_LD_SSC_DISASSOCIATE_ABORT_BY_USER"
	RAID_EVENT_LOG_CODE[440]="EVT_SAS_PHY_LINK_SPEED_UPDATED"
	RAID_EVENT_LOG_CODE[441]="EVT_CTRL_PFK_DEACTIVATED"
	RAID_EVENT_LOG_CODE[442]="EVT_LD_ACCESS_UNBLOCKED"
	RAID_EVENT_LOG_CODE[443]="EVT_LD_IS_USING_SSC_2"
	RAID_EVENT_LOG_CODE[444]="EVT_LD_IS_NOT_USING_SSC_2"
	RAID_EVENT_LOG_CODE[445]="EVT_PD_PR_ABORTED"
	RAID_EVENT_LOG_CODE[446]="EVT_PD_TRANSIENT_ERROR_DETECTED"
	RAID_EVENT_LOG_CODE[447]="EVT_LD_PI_ERR_IN_CACHE"
	RAID_EVENT_LOG_CODE[448]="EVT_CTRL_FLASH_IMAGE_UNSUPPORTED"
	RAID_EVENT_LOG_CODE[449]="EVT_BBU_MODE_SET"
	RAID_EVENT_LOG_CODE[450]="EVT_BBU_PERIODIC_RELEARN_RESCHEDULED"
	RAID_EVENT_LOG_CODE[451]="EVT_CTRL_RESETNOW_START"
	RAID_EVENT_LOG_CODE[452]="EVT_CTRL_RESETNOW_DONE"
	RAID_EVENT_LOG_CODE[453]="EVT_L3_CACHE_ERROR"
	RAID_EVENT_LOG_CODE[454]="EVT_L2_CACHE_ERROR"
	RAID_EVENT_LOG_CODE[455]="EVT_CTRL_BOOT_HEADLESS_MODE_HAD_ERRORS"
	RAID_EVENT_LOG_CODE[456]="EVT_CTRL_BOOT_SAFE_MODE_FOR_ERRORS"
	RAID_EVENT_LOG_CODE[457]="EVT_CTRL_BOOT_ERROR_WARNING"
	RAID_EVENT_LOG_CODE[458]="EVT_CTRL_BOOT_ERROR_CRITICAL"
	RAID_EVENT_LOG_CODE[459]="EVT_CTRL_BOOT_ERROR_FATAL"
	RAID_EVENT_LOG_CODE[460]="EVT_HA_NODE_JOIN"
	RAID_EVENT_LOG_CODE[461]="EVT_HA_NODE_BREAK"
	RAID_EVENT_LOG_CODE[462]="EVT_HA_PD_IS_REMOTE"
	RAID_EVENT_LOG_CODE[463]="EVT_HA_PD_IS_LOCAL"
	RAID_EVENT_LOG_CODE[464]="EVT_HA_LD_IS_REMOTE"
	RAID_EVENT_LOG_CODE[465]="EVT_HA_LD_IS_LOCAL"
	RAID_EVENT_LOG_CODE[466]="EVT_HA_LD_TARGET_ID_CONFLICT"
	RAID_EVENT_LOG_CODE[467]="EVT_HA_LD_ACCESS_IS_SHARED"
	RAID_EVENT_LOG_CODE[468]="EVT_HA_LD_ACCESS_IS_EXCLUSIVE"
	RAID_EVENT_LOG_CODE[469]="EVT_HA_LD_INCOMPATIBLE"
	RAID_EVENT_LOG_CODE[470]="EVT_HA_PEER_INCOMPATIBLE"
	RAID_EVENT_LOG_CODE[471]="EVT_HA_HW_INCOMPATIBLE"
	RAID_EVENT_LOG_CODE[472]="EVT_HA_CTRLPROP_INCOMPATIBLE"
	RAID_EVENT_LOG_CODE[473]="EVT_HA_FW_VERSION_MISMATCH"
	RAID_EVENT_LOG_CODE[474]="EVT_HA_FEATURES_MISMATCH"
	RAID_EVENT_LOG_CODE[475]="EVT_HA_CACHE_MIRROR_ONLINE"
	RAID_EVENT_LOG_CODE[476]="EVT_HA_CACHE_MIRROR_OFFLINE"
	RAID_EVENT_LOG_CODE[477]="EVT_LD_ACCESS_BLOCKED_PEER_UNAVAILABLE"
	RAID_EVENT_LOG_CODE[478]="EVT_BBU_UNSUPPORTED"
	RAID_EVENT_LOG_CODE[479]="EVT_PD_TEMP_HIGH"
	RAID_EVENT_LOG_CODE[480]="EVT_PD_TEMP_CRITICAL"
	RAID_EVENT_LOG_CODE[481]="EVT_PD_TEMP_NORMAL"
	RAID_EVENT_LOG_CODE[482]="EVT_PD_IO_THROTTLED"
	RAID_EVENT_LOG_CODE[483]="EVT_PD_IO_NOT_THROTTLED"
	RAID_EVENT_LOG_CODE[484]="EVT_PD_LIFE"
	RAID_EVENT_LOG_CODE[485]="EVT_PD_LIFE_NOT_OPTIMAL"
	RAID_EVENT_LOG_CODE[486]="EVT_PD_LIFE_CRITICAL"
	RAID_EVENT_LOG_CODE[487]="EVT_PD_FAILURE_LOCKEDUP"
	RAID_EVENT_LOG_CODE[488]="EVT_CTRL_HOST_DRIVER_UPDATE_NEEDED"
	RAID_EVENT_LOG_CODE[489]="EVT_HA_POSSIBLE_PEER_COMM_LOSS"
	RAID_EVENT_LOG_CODE[490]="EVT_CTRL_FLASH_SIGNED_COMPONENT_NOT_PRESENT"
	RAID_EVENT_LOG_CODE[491]="EVT_CTRL_FLASH_AUTHENTICATION_FAILURE"
	RAID_EVENT_LOG_CODE[492]="EVT_LD_SET_BOOT_DEVICE"
	RAID_EVENT_LOG_CODE[493]="EVT_PD_SET_BOOT_DEVICE"
	RAID_EVENT_LOG_CODE[494]="EVT_BBU_TEMPERATURE_CHANGED"
	RAID_EVENT_LOG_CODE[495]="EVT_CTRL_TEMPERATURE_CHANGED"
	RAID_EVENT_LOG_CODE[496]="EVT_NVCACHE_BACKUP_UNAVAILABLE"
	RAID_EVENT_LOG_CODE[497]="EVT_NVCACHE_CONSIDER_REPLACEMENT"
	RAID_EVENT_LOG_CODE[498]="EVT_NVCACHE_INVALID"
	RAID_EVENT_LOG_CODE[499]="EVT_BOOT_DEVICE_INVALID"
	RAID_EVENT_LOG_CODE[500]="EVT_HA_SSC_WB_POOL_SIZE_MISMATCH"
	RAID_EVENT_LOG_CODE[501]="EVT_HA_SSC_NONSHARED_VD_WB_ASSOCIATION"
	RAID_EVENT_LOG_CODE[502]="EVT_CTRL_POWER_IO_THROTTLE_START"
	RAID_EVENT_LOG_CODE[503]="EVT_CTRL_POWER_IO_THROTTLE_STOP"
	RAID_EVENT_LOG_CODE[504]="EVT_CTRL_TUNABLE_PARAMETERS_CHANGED"
	RAID_EVENT_LOG_CODE[505]="EVT_CTRL_TEMP_WITHIN_OPTIMAL_RANGE"
	RAID_EVENT_LOG_CODE[506]="EVT_CTRL_TEMP_ABOVE_OPTIMAL_RANGE"
	RAID_EVENT_LOG_CODE[507]="EVT_HA_MODE_HA_FEATURE_SET"
	RAID_EVENT_LOG_CODE[508]="EVT_HA_MODE_SC_FEATURE_SET"
}
