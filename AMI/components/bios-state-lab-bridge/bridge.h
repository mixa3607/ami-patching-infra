#ifndef BIOS_STATE_LAB_BRIDGE_H
#define BIOS_STATE_LAB_BRIDGE_H

typedef unsigned char UINT8;
typedef unsigned short UINT16;
typedef unsigned int UINT32;
typedef unsigned long long UINT64;
typedef unsigned long long UINTN;
typedef signed long long INT64;
typedef void VOID;
typedef UINT16 CHAR16;
typedef UINT64 EFI_STATUS;
typedef VOID *EFI_HANDLE;
typedef VOID *EFI_EVENT;

#define EFIAPI __attribute__((ms_abi))
#define IN
#define OUT
#define CONST const

#define EFI_SUCCESS 0ULL
#define EFI_INVALID_PARAMETER 0x8000000000000002ULL
#define EFI_BAD_BUFFER_SIZE 0x8000000000000004ULL
#define EFI_BUFFER_TOO_SMALL 0x8000000000000005ULL
#define EFI_NOT_FOUND 0x800000000000000EULL
#define EFI_ACCESS_DENIED 0x800000000000000FULL
#define EFI_VARIABLE_NON_VOLATILE 0x00000001U
#define EFI_VARIABLE_BOOTSERVICE_ACCESS 0x00000002U
#define EFI_VARIABLE_RUNTIME_ACCESS 0x00000004U

typedef struct {
    UINT32 Data1;
    UINT16 Data2;
    UINT16 Data3;
    UINT8 Data4[8];
} EFI_GUID;

#define EFI_GUID_INIT(a,b,c,d1,d2,d3,d4,d5,d6,d7,d8) \
    { (a), (b), (c), { (d1), (d2), (d3), (d4), (d5), (d6), (d7), (d8) } }

typedef struct {
    UINT64 Signature;
    UINT32 Revision;
    UINT32 HeaderSize;
    UINT32 CRC32;
    UINT32 Reserved;
} EFI_TABLE_HEADER;

typedef EFI_STATUS (EFIAPI *EFI_GET_VARIABLE)(
    IN CHAR16 *VariableName,
    IN EFI_GUID *VendorGuid,
    OUT UINT32 *Attributes,
    IN OUT UINTN *DataSize,
    OUT VOID *Data
);

typedef EFI_STATUS (EFIAPI *EFI_SET_VARIABLE)(
    IN CHAR16 *VariableName,
    IN EFI_GUID *VendorGuid,
    IN UINT32 Attributes,
    IN UINTN DataSize,
    IN VOID *Data
);

typedef struct {
    EFI_TABLE_HEADER Hdr;
    VOID *GetTime;
    VOID *SetTime;
    VOID *GetWakeupTime;
    VOID *SetWakeupTime;
    VOID *SetVirtualAddressMap;
    VOID *ConvertPointer;
    EFI_GET_VARIABLE GetVariable;
    VOID *GetNextVariableName;
    EFI_SET_VARIABLE SetVariable;
} EFI_RUNTIME_SERVICES;

typedef struct {
    EFI_TABLE_HEADER Hdr;
    CHAR16 *FirmwareVendor;
    UINT32 FirmwareRevision;
    EFI_HANDLE ConsoleInHandle;
    VOID *ConIn;
    EFI_HANDLE ConsoleOutHandle;
    VOID *ConOut;
    EFI_HANDLE StandardErrorHandle;
    VOID *StdErr;
    EFI_RUNTIME_SERVICES *RuntimeServices;
    VOID *BootServices;
} EFI_SYSTEM_TABLE;

#pragma pack(push, 1)
typedef struct {
    UINT8 Magic[8];
    UINT32 Version;
    UINT32 EntryCount;
    UINT32 TotalSize;
    UINT32 Reserved;
} BSL_STATE_HEADER;

typedef struct {
    EFI_GUID Guid;
    UINT32 Attributes;
    UINT32 NameBytes;
    UINT32 DataBytes;
    EFI_STATUS Status;
} BSL_STATE_ENTRY;

typedef struct {
    UINT8 Magic[8];
    UINT32 Version;
    UINT32 EntryCount;
    UINT32 TotalSize;
    UINT32 Reserved;
} BSL_REQUEST_HEADER;

typedef struct {
    EFI_GUID Guid;
    UINT32 NameBytes;
    UINT32 Offset;
    UINT32 DataBytes;
} BSL_REQUEST_ENTRY;

typedef struct {
    UINT8 Magic[8];
    UINT32 Version;
    UINT32 EntryCount;
    UINT32 TotalSize;
    UINT32 Reserved;
    EFI_STATUS OverallStatus;
} BSL_RESULT_HEADER;

typedef struct {
    UINT32 RequestIndex;
    EFI_STATUS Status;
} BSL_RESULT_ENTRY;
#pragma pack(pop)

#endif
