#ifndef __UEFI_BASE_H__
#define __UEFI_BASE_H__

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
typedef UINTN              EFI_TPL;
typedef VOID*              EFI_HII_HANDLE;
typedef UINT16             EFI_STRING_ID;
typedef CHAR16*            EFI_STRING;

#define TRUE  1
#define FALSE 0
#define NULL  ((VOID *)0)

#define EFIAPI __attribute__((ms_abi))
#define IN
#define OUT
#define OPTIONAL
#define CONST const

// Status codes
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

// GUID structure
typedef struct {
    UINT32 Data1;
    UINT16 Data2;
    UINT16 Data3;
    UINT8  Data4[8];
} EFI_GUID;

#define EFI_GUID_INIT(a,b,c,d1,d2,d3,d4,d5,d6,d7,d8) \
    { (a), (b), (c), { (d1), (d2), (d3), (d4), (d5), (d6), (d7), (d8) } }

// Common GUIDs
#define EFI_HOB_LIST_GUID \
    EFI_GUID_INIT(0x7739f24c, 0x93d7, 0x11d4, 0x9a, 0x3a, 0x00, 0x90, 0x27, 0x3f, 0xc1, 0x4d)

// HOB Types
#define EFI_HOB_TYPE_HANDOFF              0x0001
#define EFI_HOB_TYPE_MEMORY_ALLOCATION    0x0002
#define EFI_HOB_TYPE_RESOURCE_DESCRIPTOR  0x0003
#define EFI_HOB_TYPE_GUID_EXTENSION       0x0004
#define EFI_HOB_TYPE_FV                   0x0005
#define EFI_HOB_TYPE_CPU                  0x0006
#define EFI_HOB_TYPE_MEMORY_POOL          0x0007
#define EFI_HOB_TYPE_FV2                  0x0009
#define EFI_HOB_TYPE_LOAD_PEIM_UNUSED     0x000A
#define EFI_HOB_TYPE_UEFI_CAPSULE         0x000B
#define EFI_HOB_TYPE_UNUSED               0xFFFE
#define EFI_HOB_TYPE_END_OF_HOB_LIST      0xFFFF

typedef struct {
    UINT16 HobType;
    UINT16 HobLength;
    UINT32 Reserved;
} EFI_HOB_GENERIC_HEADER;

typedef struct {
    EFI_HOB_GENERIC_HEADER Header;
    EFI_GUID               Name;
} EFI_HOB_GUID_TYPE;

// Table header
typedef struct {
    UINT64 Signature;
    UINT32 Revision;
    UINT32 HeaderSize;
    UINT32 CRC32;
    UINT32 Reserved;
} EFI_TABLE_HEADER;

typedef struct {
    EFI_GUID VendorGuid;
    VOID     *VendorTable;
} EFI_CONFIGURATION_TABLE;

// Memory types
typedef enum {
    EfiReservedMemoryType,
    EfiLoaderCode,
    EfiLoaderData,
    EfiBootServicesCode,
    EfiBootServicesData,
    EfiRuntimeServicesCode,
    EfiRuntimeServicesData,
    EfiConventionalMemory,
    EfiUnusableMemory,
    EfiACPIReclaimMemory,
    EfiACPIMemoryNVS,
    EfiMemoryMappedIO,
    EfiMemoryMappedIOPortSpace,
    EfiPalCode,
    EfiPersistentMemory,
    EfiMaxMemoryType
} EFI_MEMORY_TYPE;

typedef struct _EFI_BOOT_SERVICES EFI_BOOT_SERVICES;
typedef struct _EFI_RUNTIME_SERVICES EFI_RUNTIME_SERVICES;
typedef struct _EFI_SYSTEM_TABLE EFI_SYSTEM_TABLE;

typedef VOID (EFIAPI *EFI_EVENT_NOTIFY)(
    IN EFI_EVENT Event,
    IN VOID      *Context
);

typedef EFI_STATUS (EFIAPI *EFI_ALLOCATE_POOL)(
    IN  EFI_MEMORY_TYPE PoolType,
    IN  UINTN           Size,
    OUT VOID            **Buffer
);

typedef EFI_STATUS (EFIAPI *EFI_FREE_POOL)(
    IN VOID *Buffer
);

typedef EFI_STATUS (EFIAPI *EFI_LOCATE_PROTOCOL)(
    IN  EFI_GUID *Protocol,
    IN  VOID     *Registration OPTIONAL,
    OUT VOID     **Interface
);

typedef EFI_STATUS (EFIAPI *EFI_CLOSE_EVENT)(
    IN EFI_EVENT Event
);

typedef EFI_STATUS (EFIAPI *EFI_CREATE_EVENT_EX)(
    IN UINT32           Type,
    IN EFI_TPL          NotifyTpl,
    IN EFI_EVENT_NOTIFY NotifyFunction OPTIONAL,
    IN CONST VOID       *NotifyContext OPTIONAL,
    IN CONST EFI_GUID   *EventGroup OPTIONAL,
    OUT EFI_EVENT       *Event
);

struct _EFI_BOOT_SERVICES {
    EFI_TABLE_HEADER             Hdr;
    VOID                         *RaiseTPL;
    VOID                         *RestoreTPL;
    VOID                         *AllocatePages;
    VOID                         *FreePages;
    VOID                         *GetMemoryMap;
    EFI_ALLOCATE_POOL            AllocatePool;
    EFI_FREE_POOL                FreePool;
    VOID                         *CreateEvent;
    VOID                         *SetTimer;
    VOID                         *WaitForEvent;
    VOID                         *SignalEvent;
    EFI_CLOSE_EVENT              CloseEvent;
    VOID                         *CheckEvent;
    VOID                         *InstallProtocolInterface;
    VOID                         *ReinstallProtocolInterface;
    VOID                         *UninstallProtocolInterface;
    VOID                         *HandleProtocol;
    VOID                         *Reserved;
    VOID                         *RegisterProtocolNotify;
    VOID                         *LocateHandle;
    VOID                         *LocateDevicePath;
    VOID                         *InstallConfigurationTable;
    VOID                         *LoadImage;
    VOID                         *StartImage;
    VOID                         *Exit;
    VOID                         *UnloadImage;
    VOID                         *ExitBootServices;
    VOID                         *GetNextMonotonicCount;
    VOID                         *Stall;
    VOID                         *SetWatchdogTimer;
    VOID                         *ConnectController;
    VOID                         *DisconnectController;
    VOID                         *OpenProtocol;
    VOID                         *CloseProtocol;
    VOID                         *OpenProtocolInformation;
    VOID                         *ProtocolsPerHandle;
    VOID                         *LocateHandleBuffer;
    EFI_LOCATE_PROTOCOL          LocateProtocol;
    VOID                         *InstallMultipleProtocolInterfaces;
    VOID                         *UninstallMultipleProtocolInterfaces;
    VOID                         *CalculateCrc32;
    VOID                         *CopyMem;
    VOID                         *SetMem;
    EFI_CREATE_EVENT_EX          CreateEventEx;
};

struct _EFI_RUNTIME_SERVICES {
    EFI_TABLE_HEADER Hdr;
    VOID *GetTime;
    VOID *SetTime;
    VOID *GetWakeupTime;
    VOID *SetWakeupTime;
    VOID *SetVirtualAddressMap;
    VOID *ConvertPointer;
    VOID *GetVariable;
    VOID *GetNextVariableName;
    VOID *SetVariable;
    VOID *GetNextHighMonotonicCount;
    VOID *ResetSystem;
    VOID *UpdateCapsule;
    VOID *QueryCapsuleCapabilities;
    VOID *QueryVariableInfo;
};

struct _EFI_SYSTEM_TABLE {
    EFI_TABLE_HEADER               Hdr;
    CHAR16                         *FirmwareVendor;
    UINT32                         FirmwareRevision;
    EFI_HANDLE                     ConsoleInHandle;
    VOID                           *ConIn;
    EFI_HANDLE                     ConsoleOutHandle;
    VOID                           *ConOut;
    EFI_HANDLE                     StandardErrorHandle;
    VOID                           *StdErr;
    EFI_RUNTIME_SERVICES           *RuntimeServices;
    EFI_BOOT_SERVICES              *BootServices;
    UINTN                          NumberOfTableEntries;
    EFI_CONFIGURATION_TABLE        *ConfigurationTable;
};

// HII Database Protocol Definitions
#define EFI_HII_DATABASE_PROTOCOL_GUID \
    EFI_GUID_INIT(0xef9db973, 0x6edd, 0x4704, 0xab, 0x4e, 0x72, 0x76, 0xa4, 0x31, 0x86, 0xb4)

#define EFI_HII_STRING_PROTOCOL_GUID \
    EFI_GUID_INIT(0x0fd96974, 0x23aa, 0x4cdc, 0xb9, 0xcb, 0x98, 0xd1, 0x77, 0x50, 0x32, 0x2a)

// Package Types
#define EFI_HII_PACKAGE_TYPE_ALL          0x00
#define EFI_HII_PACKAGE_TYPE_GUID         0x01
#define EFI_HII_PACKAGE_FORMS             0x02
#define EFI_HII_PACKAGE_STRINGS           0x04
#define EFI_HII_PACKAGE_FONTS             0x05
#define EFI_HII_PACKAGE_IMAGES            0x06
#define EFI_HII_PACKAGE_SIMPLE_FONTS      0x07
#define EFI_HII_PACKAGE_DEVICE_PATH       0x08
#define EFI_HII_PACKAGE_KEYBOARD_LAYOUT   0x09
#define EFI_HII_PACKAGE_ANIMATIONS        0x0A
#define EFI_HII_PACKAGE_END               0xDF
#define EFI_HII_PACKAGE_TYPE_SYSTEM_BEGIN 0xE0
#define EFI_HII_PACKAGE_TYPE_SYSTEM_END   0xFF

#pragma pack(1)
typedef struct {
    UINT32 Length:24;
    UINT32 Type:8;
} EFI_HII_PACKAGE_HEADER;

typedef struct {
    EFI_GUID PackageListGuid;
    UINT32   PackageLength;
} EFI_HII_PACKAGE_LIST_HEADER;

typedef struct {
    EFI_HII_PACKAGE_HEADER Header;
    UINT32                 HdrSize;
    UINT32                 StringInfoOffset;
    CHAR16                 LanguageWindow[16];
    EFI_STRING_ID          LanguageName;
    CHAR8                  Language[1];
} EFI_HII_STRING_PACKAGE_HDR;
#pragma pack()

typedef struct _EFI_HII_DATABASE_PROTOCOL EFI_HII_DATABASE_PROTOCOL;
typedef struct _EFI_HII_STRING_PROTOCOL EFI_HII_STRING_PROTOCOL;

typedef EFI_STATUS (EFIAPI *EFI_HII_DATABASE_NEW_PACK) (
    IN CONST EFI_HII_DATABASE_PROTOCOL *This,
    IN CONST EFI_HII_PACKAGE_LIST_HEADER *PackageList,
    IN EFI_HANDLE DriverHandle OPTIONAL,
    OUT EFI_HII_HANDLE *Handle
);

typedef EFI_STATUS (EFIAPI *EFI_HII_DATABASE_REMOVE_PACK) (
    IN CONST EFI_HII_DATABASE_PROTOCOL *This,
    IN EFI_HII_HANDLE Handle
);

typedef EFI_STATUS (EFIAPI *EFI_HII_DATABASE_UPDATE_PACK) (
    IN CONST EFI_HII_DATABASE_PROTOCOL *This,
    IN EFI_HII_HANDLE Handle,
    IN CONST EFI_HII_PACKAGE_LIST_HEADER *PackageList
);

typedef EFI_STATUS (EFIAPI *EFI_HII_DATABASE_LIST_PACKS) (
    IN CONST EFI_HII_DATABASE_PROTOCOL *This,
    IN UINT8 PackageType,
    IN CONST EFI_GUID *PackageGuid OPTIONAL,
    IN OUT UINTN *HandleBufferLength,
    OUT EFI_HII_HANDLE *Handle
);

typedef EFI_STATUS (EFIAPI *EFI_HII_DATABASE_EXPORT_PACKS) (
    IN CONST EFI_HII_DATABASE_PROTOCOL *This,
    IN EFI_HII_HANDLE Handle,
    IN OUT UINTN *BufferSize,
    OUT EFI_HII_PACKAGE_LIST_HEADER *Buffer
);

struct _EFI_HII_DATABASE_PROTOCOL {
    EFI_HII_DATABASE_NEW_PACK        NewPackageList;
    EFI_HII_DATABASE_REMOVE_PACK     RemovePackageList;
    EFI_HII_DATABASE_UPDATE_PACK     UpdatePackageList;
    EFI_HII_DATABASE_LIST_PACKS      ListPackageLists;
    EFI_HII_DATABASE_EXPORT_PACKS    ExportPackageLists;
    VOID                            *RegisterPackageNotify;
    VOID                            *UnregisterPackageNotify;
    VOID                            *UpdateForm;
};

typedef EFI_STATUS (EFIAPI *EFI_HII_GET_STRING) (
    IN CONST EFI_HII_STRING_PROTOCOL *This,
    IN CONST CHAR8 *Language,
    IN EFI_HII_HANDLE PackageList,
    IN EFI_STRING_ID StringId,
    OUT EFI_STRING String,
    IN OUT UINTN *StringSize,
    OUT CHAR8 **MacroLanguage OPTIONAL
);

typedef EFI_STATUS (EFIAPI *EFI_HII_SET_STRING) (
    IN CONST EFI_HII_STRING_PROTOCOL *This,
    IN EFI_HII_HANDLE PackageList,
    IN EFI_STRING_ID StringId,
    IN CONST CHAR8 *Language,
    IN CONST EFI_STRING String,
    IN CONST CHAR8 *MacroLanguage OPTIONAL
);

typedef EFI_STATUS (EFIAPI *EFI_HII_NEW_STRING) (
    IN CONST EFI_HII_STRING_PROTOCOL *This,
    IN EFI_HII_HANDLE PackageList,
    OUT EFI_STRING_ID *StringId,
    IN CONST CHAR8 *Language,
    IN CONST CHAR8 *MacroLanguage OPTIONAL,
    IN CONST EFI_STRING String,
    IN CONST CHAR8 *MacroLanguage1 OPTIONAL
);

struct _EFI_HII_STRING_PROTOCOL {
    EFI_HII_NEW_STRING NewString;
    EFI_HII_GET_STRING GetString;
    EFI_HII_SET_STRING SetString;
    VOID              *GetLanguages;
    VOID              *GetSecondaryLanguages;
};

#endif // __UEFI_BASE_H__
