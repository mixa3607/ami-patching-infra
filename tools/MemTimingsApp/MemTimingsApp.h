#ifndef __MEM_TIMINGS_APP_H__
#define __MEM_TIMINGS_APP_H__

// Basic types
typedef unsigned char      UINT8;
typedef unsigned short     UINT16;
typedef unsigned int       UINT32;
typedef unsigned long long UINT64;

typedef char               INT8;
typedef short              INT16;
typedef int                INT32;
typedef long long          INT64;

typedef UINT8              BOOLEAN;
typedef UINT64             UINTN;
typedef INT64              INTN;

typedef void               VOID;
typedef UINT16             CHAR16;
typedef char               CHAR8;

typedef UINT64             EFI_STATUS;
typedef VOID*              EFI_HANDLE;
typedef VOID*              EFI_EVENT;

#define TRUE  1
#define FALSE 0
#define NULL  ((VOID *)0)

#define EFIAPI __attribute__((ms_abi))
#define IN
#define OUT
#define OPTIONAL
#define CONST const

#define EFI_SUCCESS               0x0000000000000000ULL
#define EFI_LOAD_ERROR            0x8000000000000001ULL
#define EFI_INVALID_PARAMETER     0x8000000000000002ULL
#define EFI_UNSUPPORTED           0x8000000000000003ULL
#define EFI_BAD_BUFFER_SIZE       0x8000000000000004ULL
#define EFI_BUFFER_TOO_SMALL      0x8000000000000005ULL
#define EFI_NOT_READY             0x8000000000000006ULL
#define EFI_DEVICE_ERROR          0x8000000000000007ULL
#define EFI_NOT_FOUND             0x800000000000000EULL

#define EFI_ERROR(status) (((INT64)(status)) < 0)


// Text Colors
#define EFI_BLACK                 0x00
#define EFI_BLUE                  0x01
#define EFI_GREEN                 0x02
#define EFI_CYAN                  0x03
#define EFI_RED                   0x04
#define EFI_MAGENTA               0x05
#define EFI_BROWN                 0x06
#define EFI_LIGHTGRAY             0x07
#define EFI_BRIGHT                0x08
#define EFI_DARKGRAY              0x08
#define EFI_LIGHTBLUE             0x09
#define EFI_LIGHTGREEN            0x0A
#define EFI_LIGHTCYAN             0x0B
#define EFI_LIGHTRED              0x0C
#define EFI_LIGHTMAGENTA          0x0D
#define EFI_YELLOW                0x0E
#define EFI_WHITE                 0x0F

#define EFI_TEXT_ATTR(f, b) ((f) | ((b) << 4))

typedef struct {
    UINT32 Data1;
    UINT16 Data2;
    UINT16 Data3;
    UINT8  Data4[8];
} EFI_GUID;

#define EFI_GUID_INIT(a,b,c,d1,d2,d3,d4,d5,d6,d7,d8) \
    { (a), (b), (c), { (d1), (d2), (d3), (d4), (d5), (d6), (d7), (d8) } }

#define SMBIOS_TABLE_GUID \
    EFI_GUID_INIT(0xeb9d2d31, 0x2d88, 0x11d3, 0x9a, 0x16, 0x00, 0x90, 0x27, 0x3f, 0xc1, 0x4d)

#define SMBIOS3_TABLE_GUID \
    EFI_GUID_INIT(0xf2fd1544, 0x9794, 0x4a2c, 0x99, 0x2e, 0xe5, 0xbb, 0xcf, 0x20, 0xe3, 0x94)

// Simple Text Output Protocol
typedef struct _EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL;

typedef EFI_STATUS (EFIAPI *EFI_TEXT_RESET) (
    IN EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *This,
    IN BOOLEAN ExtendedVerification
);

typedef EFI_STATUS (EFIAPI *EFI_TEXT_STRING) (
    IN EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *This,
    IN CONST CHAR16 *String
);

typedef EFI_STATUS (EFIAPI *EFI_TEXT_SET_ATTRIBUTE) (
    IN EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *This,
    IN UINTN Attribute
);

typedef EFI_STATUS (EFIAPI *EFI_TEXT_CLEAR_SCREEN) (
    IN EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *This
);

struct _EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL {
    EFI_TEXT_RESET         Reset;
    EFI_TEXT_STRING        OutputString;
    VOID                  *TestString;
    VOID                  *QueryMode;
    VOID                  *SetMode;
    EFI_TEXT_SET_ATTRIBUTE SetAttribute;
    EFI_TEXT_CLEAR_SCREEN  ClearScreen;
    VOID                  *SetCursorPosition;
    VOID                  *EnableCursor;
    VOID                  *Mode;
};

// Simple Text Input Protocol
typedef struct {
    UINT16 ScanCode;
    CHAR16 UnicodeChar;
} EFI_INPUT_KEY;

typedef struct _EFI_SIMPLE_TEXT_INPUT_PROTOCOL EFI_SIMPLE_TEXT_INPUT_PROTOCOL;

typedef EFI_STATUS (EFIAPI *EFI_INPUT_READ_KEY) (
    IN EFI_SIMPLE_TEXT_INPUT_PROTOCOL *This,
    OUT EFI_INPUT_KEY *Key
);

struct _EFI_SIMPLE_TEXT_INPUT_PROTOCOL {
    VOID               *Reset;
    EFI_INPUT_READ_KEY  ReadKeyStroke;
    EFI_EVENT           WaitForKey;
};

// Configuration Table
typedef struct {
    EFI_GUID VendorGuid;
    VOID     *VendorTable;
} EFI_CONFIGURATION_TABLE;

// Table header
typedef struct {
    UINT64 Signature;
    UINT32 Revision;
    UINT32 HeaderSize;
    UINT32 CRC32;
    UINT32 Reserved;
} EFI_TABLE_HEADER;

// Boot Services
typedef struct _EFI_BOOT_SERVICES EFI_BOOT_SERVICES;
struct _EFI_BOOT_SERVICES {
    EFI_TABLE_HEADER Hdr;
    VOID *RaiseTPL;
    VOID *RestoreTPL;
    VOID *AllocatePages;
    VOID *FreePages;
    VOID *GetMemoryMap;
    VOID *AllocatePool;
    VOID *FreePool;
    VOID *CreateEvent;
    VOID *SetTimer;
    EFI_STATUS (EFIAPI *WaitForEvent)(IN UINTN NumberOfEvents, IN EFI_EVENT *Event, OUT UINTN *Index);
    VOID *SignalEvent;
    VOID *CloseEvent;
    VOID *CheckEvent;
    VOID *InstallProtocolInterface;
    VOID *ReinstallProtocolInterface;
    VOID *UninstallProtocolInterface;
    VOID *HandleProtocol;
    VOID *Reserved;
    VOID *RegisterProtocolNotify;
    VOID *LocateHandle;
    VOID *LocateDevicePath;
    VOID *InstallConfigurationTable;
    VOID *LoadImage;
    VOID *StartImage;
    VOID *Exit;
    VOID *UnloadImage;
    VOID *ExitBootServices;
    VOID *GetNextMonotonicCount;
    EFI_STATUS (EFIAPI *Stall)(IN UINTN Microseconds);
};

// System Table
typedef struct {
    EFI_TABLE_HEADER                 Hdr;
    CHAR16                          *FirmwareVendor;
    UINT32                           FirmwareRevision;
    EFI_HANDLE                       ConsoleInHandle;
    EFI_SIMPLE_TEXT_INPUT_PROTOCOL  *ConIn;
    EFI_HANDLE                       ConsoleOutHandle;
    EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *ConOut;
    EFI_HANDLE                       StandardErrorHandle;
    EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *StdErr;
    VOID                            *RuntimeServices;
    EFI_BOOT_SERVICES               *BootServices;
    UINTN                            NumberOfTableEntries;
    EFI_CONFIGURATION_TABLE         *ConfigurationTable;
} EFI_SYSTEM_TABLE;

// SMBIOS Types
#pragma pack(1)
typedef struct {
    UINT8  AnchorString[4]; // "_SM_"
    UINT8  EntryPointStructureChecksum;
    UINT8  EntryPointLength;
    UINT8  MajorVersion;
    UINT8  MinorVersion;
    UINT16 MaxStructureSize;
    UINT8  EntryPointRevision;
    UINT8  FormattedArea[5];
    UINT8  IntermediateAnchorString[5]; // "_DMI_"
    UINT8  IntermediateChecksum;
    UINT16 TableLength;
    UINT32 TableAddress;
    UINT16 NumberOfSmbiosStructures;
    UINT8  SmbiosBcdRevision;
} SMBIOS_TABLE_ENTRY_POINT;

typedef struct {
    UINT8  AnchorString[5]; // "_SM3_"
    UINT8  EntryPointStructureChecksum;
    UINT8  EntryPointLength;
    UINT8  MajorVersion;
    UINT8  MinorVersion;
    UINT8  DocRev;
    UINT8  EntryPointRevision;
    UINT8  Reserved;
    UINT32 TableMaximumSize;
    UINT64 TableAddress;
} SMBIOS3_TABLE_ENTRY_POINT;

typedef struct {
    UINT8  Type;
    UINT8  Length;
    UINT16 Handle;
} SMBIOS_HEADER;

// SMBIOS Type 17: Memory Device
typedef struct {
    SMBIOS_HEADER Hdr;
    UINT16 PhysicalMemoryArrayHandle;
    UINT16 MemoryErrorInformationHandle;
    UINT16 TotalWidth;
    UINT16 DataWidth;
    UINT16 Size;
    UINT8  FormFactor;
    UINT8  DeviceSet;
    UINT8  DeviceLocator;
    UINT8  BankLocator;
    UINT8  MemoryType;
    UINT16 TypeDetail;
    UINT16 Speed;
    UINT8  Manufacturer;
    UINT8  SerialNumber;
    UINT8  AssetTag;
    UINT8  PartNumber;
    UINT8  Attributes;
    UINT32 ExtendedSize;
    UINT16 ConfiguredMemoryClockSpeed;
    UINT16 MinimumVoltage;
    UINT16 MaximumVoltage;
    UINT16 ConfiguredVoltage;
} SMBIOS_TYPE17;
#pragma pack()

#define MAX_CHANNELS     8
#define MAX_DIMMS_PER_CH 2
#define TOTAL_SLOTS      16

#endif // __MEM_TIMINGS_APP_H__
