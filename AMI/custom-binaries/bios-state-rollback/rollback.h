#ifndef BIOS_STATE_ROLLBACK_H
#define BIOS_STATE_ROLLBACK_H

/* ------------------------------------------------------------------ */
/* Base types (freestanding, no EDK2 headers)                         */
/* ------------------------------------------------------------------ */

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
typedef UINTN EFI_PHYSICAL_ADDRESS;
typedef UINT32 EFI_MEMORY_TYPE;

#if defined(IA32)
#define EFIAPI
#else
#define EFIAPI __attribute__((ms_abi))
#endif

#define IN
#define OUT
#define CONST const

#define EFI_SUCCESS 0ULL
#define EFI_LOAD_ERROR 0x8000000000000001ULL
#define EFI_INVALID_PARAMETER 0x8000000000000002ULL
#define EFI_UNSUPPORTED 0x8000000000000003ULL
#define EFI_BAD_BUFFER_SIZE 0x8000000000000004ULL
#define EFI_BUFFER_TOO_SMALL 0x8000000000000005ULL
#define EFI_NOT_READY 0x8000000000000006ULL
#define EFI_DEVICE_ERROR 0x8000000000000007ULL
#define EFI_NOT_FOUND 0x800000000000000EULL
#define EFI_ACCESS_DENIED 0x800000000000000FULL
#define EFI_OUT_OF_RESOURCES 0x800000000000000DULL
#define EFI_VARIABLE_NON_VOLATILE 0x00000001U
#define EFI_VARIABLE_BOOTSERVICE_ACCESS 0x00000002U
#define EFI_VARIABLE_RUNTIME_ACCESS 0x00000004U

typedef struct {
    UINT64 Signature;
    UINT32 Revision;
    UINT32 HeaderSize;
    UINT32 CRC32;
    UINT32 Reserved;
} EFI_TABLE_HEADER;

typedef struct {
    UINT32 Data1;
    UINT16 Data2;
    UINT16 Data3;
    UINT8 Data4[8];
} EFI_GUID;

#define EFI_GUID_INIT(a, b, c, d1, d2, d3, d4, d5, d6, d7, d8) \
    { (a), (b), (c), { (d1), (d2), (d3), (d4), (d5), (d6), (d7), (d8) } }

/* ------------------------------------------------------------------ */
/* Rollback policy                                                     */
/* ------------------------------------------------------------------ */

/* RTC SRAM (battery-backed, survives warm/cold reset and AC loss).
   Bytes live in the PCH RTC NVRAM window 0x32-0x3F. Offsets are
   configurable; they must not collide with bytes used by AMI
   CmosManager / CmosPei / the BMC. */
#define RTC_INDEX_PORT 0x70
#define RTC_DATA_PORT 0x71
#define RTC_REG_MAGIC 0x34
#define RTC_REG_COUNTER 0x35
#define RTC_REG_DONE 0x36
#define RTC_REG_PENDING 0x37
#define RTC_MAGIC_VALUE 0xA5

/* Roll back after this many consecutive boots that never reached DXE. */
#define ROLLBACK_MAX_FAILS 3

/* Vendor GUID + variable name of the "last known good" snapshot. */
#define GOLDEN_VENDOR_GUID \
    { 0x2ad85717, 0x6422, 0x46e7, { 0x9d, 0x3f, 0xa4, 0xe2, 0xf8, 0xd2, 0x78, 0xd9 } }

/* ------------------------------------------------------------------ */
/* Snapshot payload format (packed TLV)                                */
/* ------------------------------------------------------------------ */

#define ROLLBACK_MAGIC 0x4C425242U /* 'BRLB' */

#pragma pack(push, 1)
typedef struct {
    UINT32 Magic;      /* ROLLBACK_MAGIC */
    UINT32 Version;    /* 1 */
    UINT32 EntryCount;
    UINT32 TotalSize;
} ROLLBACK_HEADER;

typedef struct {
    EFI_GUID Guid;
    UINT32 Attributes;
    UINT32 NameBytes;  /* UTF-16 bytes including the NUL terminator */
    UINT32 DataBytes;
} ROLLBACK_ENTRY;
#pragma pack(pop)

/* ------------------------------------------------------------------ */
/* Boot-critical variables captured in the snapshot                    */
/* ------------------------------------------------------------------ */

typedef struct {
    CONST CHAR16 *Name;
    EFI_GUID Guid;
} ROLLBACK_VAR;

#define ARRAY_COUNT(a) (sizeof(a) / sizeof((a)[0]))

static CONST ROLLBACK_VAR gRollbackVars[] = {
    { L"SocketMemoryConfig",
      EFI_GUID_INIT(0x98cf19ed, 0x4109, 0x4681, 0xb7, 0x9d, 0x91, 0x96, 0x75, 0x7c, 0x78, 0x24) },
    { L"MemBootHealthConfig",
      EFI_GUID_INIT(0xacd56900, 0xdefc, 0x4127, 0xde, 0x12, 0x32, 0xa0, 0xd2, 0x69, 0x46, 0x2f) },
    { L"SocketIioConfig",
      EFI_GUID_INIT(0xdd84017e, 0x7f52, 0x48f9, 0xb1, 0x6e, 0x50, 0xed, 0x9e, 0x0d, 0xbe, 0x27) },
    { L"SocketCommonRcConfig",
      EFI_GUID_INIT(0x4402ca38, 0x808f, 0x4279, 0xbc, 0xec, 0x5b, 0xaf, 0x8d, 0x59, 0x09, 0x2f) },
    { L"SocketMpLinkConfig",
      EFI_GUID_INIT(0x2b9b22de, 0x2ad4, 0x4abc, 0x95, 0x7d, 0x5f, 0x18, 0xc5, 0x04, 0xa0, 0x5c) },
    { L"SocketPowerManagementConfig",
      EFI_GUID_INIT(0xa1047342, 0xbdba, 0x4dae, 0xa6, 0x7a, 0x40, 0x97, 0x9b, 0x65, 0xc7, 0xf8) },
    { L"SocketProcessorCoreConfig",
      EFI_GUID_INIT(0x07013588, 0xc789, 0x4e12, 0xa7, 0xc3, 0x88, 0xfa, 0xfa, 0xe7, 0x9f, 0x7c) },
    { L"Setup",
      EFI_GUID_INIT(0xec87d643, 0xeba4, 0x4bb5, 0xa1, 0xe5, 0x3f, 0x3e, 0x36, 0xb2, 0x0d, 0xa9) },
    { L"IntelSetup",
      EFI_GUID_INIT(0xec87d643, 0xeba4, 0x4bb5, 0xa1, 0xe5, 0x3f, 0x3e, 0x36, 0xb2, 0x0d, 0xa9) },
    { L"ServerSetup",
      EFI_GUID_INIT(0x01239999, 0xfc0e, 0x4b6e, 0x9e, 0x79, 0xd5, 0x4d, 0x5d, 0xb6, 0xcd, 0x20) },
    { L"PchSetup",
      EFI_GUID_INIT(0x4570b7f1, 0xade8, 0x4943, 0x8d, 0xc3, 0x40, 0x64, 0x72, 0x84, 0x23, 0x84) },
};

/* ------------------------------------------------------------------ */
/* RTC SRAM helpers (I/O ports 0x70/0x71)                              */
/* ------------------------------------------------------------------ */

static inline UINT8 RtcRead(UINT8 Reg) {
    UINT8 Value;
    __asm__ volatile ("outb %0, %1" : : "a"(Reg), "Nd"((UINT16)RTC_INDEX_PORT) : "memory");
    __asm__ volatile ("inb %1, %0" : "=a"(Value) : "Nd"((UINT16)RTC_DATA_PORT) : "memory");
    return Value;
}

static inline VOID RtcWrite(UINT8 Reg, UINT8 Value) {
    __asm__ volatile ("outb %0, %1" : : "a"(Reg), "Nd"((UINT16)RTC_INDEX_PORT) : "memory");
    __asm__ volatile ("outb %0, %1" : : "a"(Value), "Nd"((UINT16)RTC_DATA_PORT) : "memory");
}

/* ------------------------------------------------------------------ */
/* Snapshot access helpers (shared between DXE and PEI)                */
/* ------------------------------------------------------------------ */

static inline UINTN StringBytes(CONST CHAR16 *String) {
    UINTN Length = 0;
    while (String[Length] != 0) Length++;
    return Length * sizeof(CHAR16);
}

static inline VOID CopyBytes(VOID *Destination, CONST VOID *Source, UINTN Count) {
    UINT8 *DestinationBytes = Destination;
    CONST UINT8 *SourceBytes = Source;
    while (Count-- != 0) *DestinationBytes++ = *SourceBytes++;
}

static inline VOID ZeroBytes(VOID *Destination, UINTN Count) {
    UINT8 *Bytes = Destination;
    while (Count-- != 0) *Bytes++ = 0;
}

static inline UINT8 EqualBytes(CONST VOID *Left, CONST VOID *Right, UINTN Count) {
    CONST UINT8 *LeftBytes = Left;
    CONST UINT8 *RightBytes = Right;
    while (Count-- != 0) {
        if (*LeftBytes++ != *RightBytes++) return 0;
    }
    return 1;
}

/* Locate the snapshot entry for (Guid, Name); returns the payload pointer
   and its byte length, or 0 when absent. */
static inline CONST VOID *FindSnapshotEntry(CONST UINT8 *Snapshot, UINTN SnapshotSize,
                                            CONST EFI_GUID *Guid, CONST UINT8 *Name, UINTN NameBytes,
                                            UINT32 *Attributes, UINTN *DataBytesOut) {
    UINTN Offset;
    if (Snapshot == 0 || SnapshotSize < sizeof(ROLLBACK_HEADER)) return 0;
    {
        CONST ROLLBACK_HEADER *Header = (CONST ROLLBACK_HEADER *)Snapshot;
        if (Header->Magic != ROLLBACK_MAGIC) return 0;
    }
    Offset = sizeof(ROLLBACK_HEADER);
    while (Offset < SnapshotSize) {
        CONST ROLLBACK_ENTRY *Entry;
        CONST UINT8 *EntryName;
        CONST UINT8 *EntryData;
        if (Offset + sizeof(*Entry) > SnapshotSize) break;
        Entry = (CONST ROLLBACK_ENTRY *)(Snapshot + Offset);
        EntryName = Snapshot + Offset + sizeof(*Entry);
        if (EntryName + Entry->NameBytes > Snapshot + SnapshotSize) break;
        EntryData = EntryName + Entry->NameBytes;
        if (EntryData + Entry->DataBytes > Snapshot + SnapshotSize) break;
        if (Entry->NameBytes == NameBytes &&
            EqualBytes(Guid, &Entry->Guid, sizeof(*Guid)) &&
            EqualBytes(EntryName, Name, NameBytes)) {
            if (Attributes) *Attributes = Entry->Attributes;
            if (DataBytesOut) *DataBytesOut = Entry->DataBytes;
            return EntryData;
        }
        Offset += sizeof(*Entry) + Entry->NameBytes + Entry->DataBytes;
    }
    return 0;
}

#endif /* BIOS_STATE_ROLLBACK_H */
