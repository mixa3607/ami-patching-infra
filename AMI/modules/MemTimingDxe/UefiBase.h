#ifndef __UEFI_BASE_H__
#define __UEFI_BASE_H__

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

// UEFI Data Types
typedef uint8_t   BOOLEAN;
typedef int64_t   INTN;
typedef uint64_t  UINTN;
typedef int8_t    INT8;
typedef uint8_t   UINT8;
typedef int16_t   INT16;
typedef uint16_t  UINT16;
typedef int32_t   INT32;
typedef uint32_t  UINT32;
typedef int64_t   INT64;
typedef uint64_t  UINT64;
typedef uint8_t   CHAR8;
typedef uint16_t  CHAR16;
typedef void      VOID;
typedef UINTN     EFI_STATUS;
typedef VOID*     EFI_HANDLE;
typedef VOID*     EFI_EVENT;
typedef UINT64    EFI_LBA;
typedef UINTN     EFI_TPL;
typedef UINT64    EFI_PHYSICAL_ADDRESS;
typedef UINT64    EFI_VIRTUAL_ADDRESS;

typedef UINT16    EFI_STRING_ID;
typedef UINT16    EFI_FORM_ID;
typedef UINT16    EFI_QUESTION_ID;
typedef UINT16    EFI_DEFAULT_ID;
typedef UINT16    EFI_ANIMATION_ID;
typedef VOID*     EFI_HII_HANDLE;
typedef CHAR16*   EFI_STRING;

#define EFIAPI __attribute__((ms_abi))
#define IN
#define OUT
#define OPTIONAL
#define CONST const
#define TRUE  ((BOOLEAN)1)
#define FALSE ((BOOLEAN)0)
#ifndef NULL
#define NULL  ((VOID *)0)
#endif

// Status Codes
#define EFI_SUCCESS               0ULL
#define EFI_LOAD_ERROR            (1ULL  | (1ULL << 63))
#define EFI_INVALID_PARAMETER     (2ULL  | (1ULL << 63))
#define EFI_UNSUPPORTED           (3ULL  | (1ULL << 63))
#define EFI_BAD_BUFFER_SIZE       (4ULL  | (1ULL << 63))
#define EFI_BUFFER_TOO_SMALL      (5ULL  | (1ULL << 63))
#define EFI_NOT_READY             (6ULL  | (1ULL << 63))
#define EFI_DEVICE_ERROR          (7ULL  | (1ULL << 63))
#define EFI_WRITE_PROTECTED       (8ULL  | (1ULL << 63))
#define EFI_OUT_OF_RESOURCES      (9ULL  | (1ULL << 63))
#define EFI_VOLUME_CORRUPTED      (10ULL | (1ULL << 63))
#define EFI_VOLUME_FULL           (11ULL | (1ULL << 63))
#define EFI_NO_MEDIA              (12ULL | (1ULL << 63))
#define EFI_MEDIA_CHANGED         (13ULL | (1ULL << 63))
#define EFI_NOT_FOUND             (14ULL | (1ULL << 63))
#define EFI_ACCESS_DENIED         (15ULL | (1ULL << 63))
#define EFI_NO_RESPONSE           (16ULL | (1ULL << 63))
#define EFI_NO_MAPPING            (17ULL | (1ULL << 63))
#define EFI_TIMEOUT               (18ULL | (1ULL << 63))
#define EFI_NOT_STARTED           (19ULL | (1ULL << 63))
#define EFI_ALREADY_STARTED       (20ULL | (1ULL << 63))
#define EFI_ABORTED               (21ULL | (1ULL << 63))
#define EFI_ICMP_ERROR            (22ULL | (1ULL << 63))
#define EFI_TFTP_ERROR            (23ULL | (1ULL << 63))
#define EFI_PROTOCOL_ERROR        (24ULL | (1ULL << 63))

#define EFI_ERROR(status) (((INTN)(UINTN)(status)) < 0)

// GUID Structure
typedef struct {
    UINT32 Data1;
    UINT16 Data2;
    UINT16 Data3;
    UINT8  Data4[8];
} EFI_GUID;

#define EFI_GUID_INIT(a, b, c, d0, d1, d2, d3, d4, d5, d6, d7) \
    { (a), (b), (c), { (d0), (d1), (d2), (d3), (d4), (d5), (d6), (d7) } }

// Memory Types
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

typedef enum {
    AllocateAnyPages,
    AllocateMaxAddress,
    AllocateAddress,
    MaxAllocateType
} EFI_ALLOCATE_TYPE;

// Table Header
typedef struct {
    UINT64 Signature;
    UINT32 Revision;
    UINT32 HeaderSize;
    UINT32 CRC32;
    UINT32 Reserved;
} EFI_TABLE_HEADER;

// Configuration Table
typedef struct {
    EFI_GUID VendorGuid;
    VOID     *VendorTable;
} EFI_CONFIGURATION_TABLE;

// HOB Structures
#define EFI_HOB_TYPE_HANDOFF              0x0001
#define EFI_HOB_TYPE_MEMORY_ALLOCATION    0x0002
#define EFI_HOB_TYPE_RESOURCE_DESCRIPTOR  0x0003
#define EFI_HOB_TYPE_GUID_EXTENSION       0x0004
#define EFI_HOB_TYPE_FV                   0x0005
#define EFI_HOB_TYPE_CPU                  0x0006
#define EFI_HOB_TYPE_MEMORY_POOL          0x0007
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

// Forward declarations
typedef struct _EFI_BOOT_SERVICES EFI_BOOT_SERVICES;
typedef struct _EFI_RUNTIME_SERVICES EFI_RUNTIME_SERVICES;
typedef struct _EFI_SYSTEM_TABLE EFI_SYSTEM_TABLE;

// Boot Services function pointer types
typedef EFI_STATUS (EFIAPI *EFI_ALLOCATE_POOL)(
    IN EFI_MEMORY_TYPE PoolType,
    IN UINTN           Size,
    OUT VOID           **Buffer
);

typedef EFI_STATUS (EFIAPI *EFI_FREE_POOL)(
    IN VOID *Buffer
);

typedef EFI_STATUS (EFIAPI *EFI_LOCATE_PROTOCOL)(
    IN EFI_GUID *Protocol,
    IN VOID     *Registration OPTIONAL,
    OUT VOID    **Interface
);

typedef EFI_STATUS (EFIAPI *EFI_INSTALL_PROTOCOL_INTERFACE)(
    IN OUT EFI_HANDLE     *Handle,
    IN     EFI_GUID       *Protocol,
    IN     INT32          InterfaceType,
    IN     VOID           *Interface
);

typedef EFI_STATUS (EFIAPI *EFI_UNINSTALL_PROTOCOL_INTERFACE)(
    IN EFI_HANDLE Handle,
    IN EFI_GUID   *Protocol,
    IN VOID       *Interface
);

typedef EFI_STATUS (EFIAPI *EFI_HANDLE_PROTOCOL)(
    IN EFI_HANDLE Handle,
    IN EFI_GUID   *Protocol,
    OUT VOID      **Interface
);

typedef VOID (EFIAPI *EFI_COPY_MEM)(
    IN VOID  *Destination,
    IN CONST VOID *Source,
    IN UINTN Length
);

typedef VOID (EFIAPI *EFI_SET_MEM)(
    IN VOID  *Buffer,
    IN UINTN Size,
    IN UINT8 Value
);

struct _EFI_BOOT_SERVICES {
    EFI_TABLE_HEADER Hdr;
    VOID *RaiseTPL;
    VOID *RestoreTPL;
    VOID *AllocatePages;
    VOID *FreePages;
    VOID *GetMemoryMap;
    EFI_ALLOCATE_POOL AllocatePool;
    EFI_FREE_POOL FreePool;
    VOID *CreateEvent;
    VOID *SetTimer;
    VOID *WaitForEvent;
    VOID *SignalEvent;
    VOID *CloseEvent;
    VOID *CheckEvent;
    EFI_INSTALL_PROTOCOL_INTERFACE InstallProtocolInterface;
    VOID *ReinstallProtocolInterface;
    EFI_UNINSTALL_PROTOCOL_INTERFACE UninstallProtocolInterface;
    EFI_HANDLE_PROTOCOL HandleProtocol;
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
    VOID *Stall;
    VOID *SetWatchdogTimer;
    VOID *ConnectController;
    VOID *DisconnectController;
    VOID *OpenProtocol;
    VOID *CloseProtocol;
    VOID *OpenProtocolInformation;
    VOID *ProtocolsPerHandle;
    VOID *LocateHandleBuffer;
    EFI_LOCATE_PROTOCOL LocateProtocol;
    VOID *InstallMultipleProtocolInterfaces;
    VOID *UninstallMultipleProtocolInterfaces;
    VOID *CalculateCrc32;
    EFI_COPY_MEM CopyMem;
    EFI_SET_MEM SetMem;
    VOID *CreateEventEx;
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
    EFI_GUID_INIT(0xef9c6e3d, 0xdc8a, 0x41d1, 0xb5, 0x02, 0x11, 0x09, 0xcd, 0x80, 0xb2, 0x17)

#define EFI_HII_STRING_PROTOCOL_GUID \
    EFI_GUID_INIT(0x0fd96974, 0x23aa, 0x4cdc, 0xb9, 0xcb, 0x98, 0xd1, 0x77, 0x50, 0x32, 0x2a)

#define EFI_HOB_LIST_GUID \
    EFI_GUID_INIT(0x7739f24c, 0x93d7, 0x11d4, 0x9a, 0x3a, 0x00, 0x90, 0x27, 0x3f, 0xc1, 0x4d)

#define EFI_FORM_BROWSER2_PROTOCOL_GUID \
    EFI_GUID_INIT(0xb9d4c360, 0xbfe7, 0x4d4f, 0xb8, 0x5d, 0x4d, 0xdd, 0x45, 0xdb, 0x7c, 0x46)

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

struct _EFI_HII_DATABASE_PROTOCOL {
    EFI_HII_DATABASE_NEW_PACK      NewPackageList;
    EFI_HII_DATABASE_REMOVE_PACK   RemovePackageList;
    EFI_HII_DATABASE_UPDATE_PACK   UpdatePackageList;
    VOID                          *ListPackageLists;
    VOID                          *ExportPackageLists;
    VOID                          *RegisterPackageNotify;
    VOID                          *UnregisterPackageNotify;
    VOID                          *UpdateForm;
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
