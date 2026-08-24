/* BiosStateRollbackDxe
 *
 * DXE-side half of the "3 failed boots -> roll back to last known good
 * variables" scheme. Runs at DXE dispatch, which is only reached when the
 * memory reference code trained memory successfully on this boot.
 *
 * Entry point work:
 *   1. if the PEI watchdog set the RTC "rollback pending" flag, commit the
 *      snapshot variables back into NVRAM via SetVariable (this makes the
 *      rollback permanent - the PEI shadow PPI already made MRC use the good
 *      values this boot);
 *   2. snapshot the boot-critical variables into the golden variable
 *      (last known good state);
 *   3. set the RTC "boot completed" marker so the PEI watchdog resets its
 *      failure counter on the next boot.
 *
 * Build: clang + lld-link, see Makefile.
 */

#include "rollback.h"

#define GOLDEN_CAPACITY (32U * 1024U)

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

static CHAR16 gGoldenName[] = L"BslRollbackGolden";
static EFI_GUID gGoldenGuid = GOLDEN_VENDOR_GUID;

#if defined(DEBUG_POST)
static inline VOID PostCode(UINT8 Code) {
    __asm__ volatile ("outb %0, %1" : : "a"(Code), "Nd"((UINT16)0x80) : "memory");
}
#else
#define PostCode(Code) ((VOID)0)
#endif

static UINT8 gGolden[GOLDEN_CAPACITY];

static UINT8 RtcInit(VOID) {
    if (RtcRead(RTC_REG_MAGIC) != RTC_MAGIC_VALUE) {
        RtcWrite(RTC_REG_MAGIC, RTC_MAGIC_VALUE);
        RtcWrite(RTC_REG_COUNTER, 0);
        RtcWrite(RTC_REG_DONE, 0);
        RtcWrite(RTC_REG_PENDING, 0);
    }
    return 0;
}

/* Read the whole golden variable into gGolden. Returns payload size or 0. */
static UINTN ReadGolden(EFI_RUNTIME_SERVICES *RT) {
    UINTN DataSize = 0;
    UINT32 Attributes = 0;
    EFI_STATUS Status;

    Status = RT->GetVariable(gGoldenName, &gGoldenGuid, &Attributes, &DataSize, 0);
    if (Status != EFI_BUFFER_TOO_SMALL || DataSize > GOLDEN_CAPACITY) return 0;
    Status = RT->GetVariable(gGoldenName, &gGoldenGuid, &Attributes, &DataSize, gGolden);
    if (Status != EFI_SUCCESS) return 0;
    if (DataSize < sizeof(ROLLBACK_HEADER)) return 0;
    if (((ROLLBACK_HEADER *)gGolden)->Magic != ROLLBACK_MAGIC) return 0;
    return DataSize;
}

/* Restore every snapshot entry into NVRAM. */
static UINTN CommitGolden(EFI_RUNTIME_SERVICES *RT) {
    UINTN SnapshotSize = ReadGolden(RT);
    UINTN Offset;
    UINTN Restored = 0;
    if (SnapshotSize == 0) return 0;
    Offset = sizeof(ROLLBACK_HEADER);
    while (Offset < SnapshotSize) {
        ROLLBACK_ENTRY *Entry;
        CHAR16 *Name;
        UINT8 *Data;
        if (Offset + sizeof(*Entry) > SnapshotSize) break;
        Entry = (ROLLBACK_ENTRY *)(gGolden + Offset);
        Name = (CHAR16 *)(gGolden + Offset + sizeof(*Entry));
        if (Name + Entry->NameBytes / 2 > (CHAR16 *)(gGolden + SnapshotSize)) break;
        Data = (UINT8 *)Name + Entry->NameBytes;
        if (Data + Entry->DataBytes > gGolden + SnapshotSize) break;
        RT->SetVariable(Name, &Entry->Guid, Entry->Attributes, Entry->DataBytes, Data);
        Restored++;
        Offset += sizeof(*Entry) + Entry->NameBytes + Entry->DataBytes;
    }
    return Restored;
}

/* Serialize the boot-critical variables into gGolden and store it. */
static UINTN SnapshotToGolden(EFI_RUNTIME_SERVICES *RT) {
    ROLLBACK_HEADER *Header = (ROLLBACK_HEADER *)gGolden;
    UINTN Position = sizeof(*Header);
    UINTN Index;

    ZeroBytes(gGolden, sizeof(gGolden));
    Header->Magic = ROLLBACK_MAGIC;
    Header->Version = 1;

    for (Index = 0; Index < ARRAY_COUNT(gRollbackVars); Index++) {
        ROLLBACK_ENTRY *Entry;
        UINTN NameBytes = StringBytes(gRollbackVars[Index].Name);
        UINTN DataBytes = 0;
        UINT32 Attributes = 0;
        EFI_STATUS Status;

        Status = RT->GetVariable((CHAR16 *)gRollbackVars[Index].Name,
                                 (EFI_GUID *)&gRollbackVars[Index].Guid,
                                 &Attributes, &DataBytes, 0);
        if (Status != EFI_BUFFER_TOO_SMALL) continue;
        if (Position + sizeof(*Entry) + NameBytes + DataBytes > GOLDEN_CAPACITY) break;

        Status = RT->GetVariable((CHAR16 *)gRollbackVars[Index].Name,
                                 (EFI_GUID *)&gRollbackVars[Index].Guid,
                                 &Attributes, &DataBytes, gGolden + Position + sizeof(*Entry) + NameBytes);
        if (Status != EFI_SUCCESS) continue;

        Entry = (ROLLBACK_ENTRY *)(gGolden + Position);
        CopyBytes(&Entry->Guid, &gRollbackVars[Index].Guid, sizeof(Entry->Guid));
        Entry->Attributes = Attributes;
        Entry->NameBytes = (UINT32)NameBytes;
        Entry->DataBytes = (UINT32)DataBytes;
        CopyBytes(gGolden + Position + sizeof(*Entry), gRollbackVars[Index].Name, NameBytes);
        Position += sizeof(*Entry) + NameBytes + DataBytes;
        Header->EntryCount++;
    }

    Header->TotalSize = (UINT32)Position;
    return RT->SetVariable(gGoldenName, &gGoldenGuid,
                           EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS | EFI_VARIABLE_RUNTIME_ACCESS,
                           Position, gGolden);
}

EFI_STATUS EFIAPI RollbackDxeEntry(IN EFI_HANDLE ImageHandle, IN EFI_SYSTEM_TABLE *SystemTable) {
    EFI_RUNTIME_SERVICES *RT = SystemTable->RuntimeServices;

    (void)ImageHandle;
    PostCode(0xE3);
    RtcInit();

    if (RtcRead(RTC_REG_PENDING) == 1) {
        CommitGolden(RT);
        RtcWrite(RTC_REG_PENDING, 0);
        PostCode(0xE4);
    }

    SnapshotToGolden(RT);
    RtcWrite(RTC_REG_DONE, 1);
    PostCode(0xE5);

    return EFI_SUCCESS;
}
