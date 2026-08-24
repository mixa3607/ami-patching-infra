/* BiosStateRollbackPei
 *
 * PEI-side half of the "3 failed boots -> roll back to last known good
 * variables" scheme. This module runs before the memory reference code
 * (UncoreInitPeim) and implements the recovery decision entirely from RTC
 * SRAM + a PPI shadow:
 *
 *   - each boot it bumps a battery-backed failure counter when the previous
 *     boot never reached DXE (RTC "done" marker stays clear);
 *   - after ROLLBACK_MAX_FAILS consecutive failed boots it installs a shadow
 *     of EFI_PEI_READ_ONLY_VARIABLE2_PPI that returns the last-known-good
 *     values for the boot-critical variables, so MRC trains memory with the
 *     good settings on this very boot;
 *   - the DXE driver (BiosStateRollbackDxe) then commits those values into
 *     NVRAM permanently and arms the "done" marker.
 *
 * Dispatch: the module is injected by replacing the PE32 of a sacrificial
 * early PEIM (PeiInterposerToSvidMap). Its single-PPI depex dispatches it
 * before NvramPei, and the ReadOnlyVariable2 notify below fires exactly when
 * the pre-memory variable service appears, i.e. after NvramPei but before
 * MRC (MRC's own depex depends on that same PPI).
 *
 * Build: clang + lld-link, IA32, see Makefile.
 */

#include "rollback.h"

#define GOLDEN_CAPACITY (32U * 1024U)

/* ------------------------------------------------------------------ */
/* PI / PEI types (IA32, EFIAPI = cdecl)                              */
/* ------------------------------------------------------------------ */

typedef struct _EFI_PEI_SERVICES EFI_PEI_SERVICES;
typedef VOID *EFI_PEI_FILE_HANDLE;
typedef VOID *EFI_PEI_FV_HANDLE;

typedef struct _EFI_PEI_PPI_DESCRIPTOR {
    UINTN Flags;
    EFI_GUID *Guid;
    VOID *Ppi;
} EFI_PEI_PPI_DESCRIPTOR;

#define EFI_PEI_PPI_DESCRIPTOR_PPI 0x10
#define EFI_PEI_PPI_DESCRIPTOR_NOTIFY_TYPES 0x20
#define EFI_PEI_PPI_DESCRIPTOR_TERMINATE_LIST 0x40
#define EFI_PEI_PPI_DESCRIPTOR_NOTIFY_DISPATCH 0x01

typedef EFI_STATUS (EFIAPI *PEI_INSTALL_PPI)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN OUT EFI_PEI_PPI_DESCRIPTOR *PpiList
);
typedef EFI_STATUS (EFIAPI *PEI_REINSTALL_PPI)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN OUT EFI_PEI_PPI_DESCRIPTOR *OldPpiList,
    IN OUT EFI_PEI_PPI_DESCRIPTOR *NewPpiList
);
typedef EFI_STATUS (EFIAPI *PEI_LOCATE_PPI)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_GUID *Guid,
    IN UINTN Instance,
    OUT EFI_PEI_PPI_DESCRIPTOR **PpiDescriptor,
    IN OUT VOID **Ppi
);
typedef EFI_STATUS (EFIAPI *PEI_NOTIFY_PPI)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_PPI_DESCRIPTOR *NotifyList
);
typedef EFI_STATUS (EFIAPI *PEI_GET_BOOT_MODE)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    OUT UINT32 *BootMode
);
typedef EFI_STATUS (EFIAPI *PEI_SET_BOOT_MODE)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINT32 BootMode
);
typedef EFI_STATUS (EFIAPI *PEI_GET_HOB_LIST)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    OUT VOID **HobList
);
typedef EFI_STATUS (EFIAPI *PEI_CREATE_HOB)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINT16 Type,
    IN UINT16 Length,
    OUT VOID **Hob
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_FIND_NEXT_VOLUME)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINTN Instance,
    OUT EFI_PEI_FV_HANDLE *VolumeHandle
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_FIND_NEXT_FILE)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINT8 SearchType,
    IN EFI_PEI_FV_HANDLE VolumeHandle,
    OUT EFI_PEI_FILE_HANDLE *FileHandle
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_FIND_SECTION_DATA)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINT8 SectionType,
    IN EFI_PEI_FILE_HANDLE FileHandle,
    OUT VOID **SectionData
);
typedef EFI_STATUS (EFIAPI *PEI_INSTALL_PEI_MEMORY)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PHYSICAL_ADDRESS MemoryBegin,
    IN UINT64 MemoryLength
);
typedef EFI_STATUS (EFIAPI *PEI_ALLOCATE_PAGES)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_MEMORY_TYPE MemoryType,
    IN UINTN Pages,
    OUT EFI_PHYSICAL_ADDRESS *Memory
);
typedef EFI_STATUS (EFIAPI *PEI_ALLOCATE_POOL)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINTN Size,
    OUT VOID **Buffer
);
typedef VOID (EFIAPI *PEI_COPY_MEM)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN VOID *Destination,
    IN CONST VOID *Source,
    IN UINTN Length
);
typedef VOID (EFIAPI *PEI_SET_MEM)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN VOID *Buffer,
    IN UINTN Size,
    IN UINT8 Value
);
typedef EFI_STATUS (EFIAPI *PEI_RESET_SYSTEM)(
    IN CONST EFI_PEI_SERVICES **PeiServices
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_FIND_FILE_BY_NAME)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN CONST EFI_GUID *FileName,
    IN EFI_PEI_FV_HANDLE VolumeHandle,
    OUT EFI_PEI_FILE_HANDLE *FileHandle
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_GET_FILE_INFO)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_FILE_HANDLE FileHandle,
    OUT VOID *FileInfo
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_GET_VOLUME_INFO)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_FV_HANDLE VolumeHandle,
    OUT VOID *VolumeInfo
);
typedef EFI_STATUS (EFIAPI *PEI_REGISTER_FOR_SHADOW)(
    IN EFI_PEI_FILE_HANDLE FileHandle
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_FIND_SECTION_DATA3)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN UINT8 SectionType,
    IN UINTN SectionInstance,
    IN EFI_PEI_FILE_HANDLE FileHandle,
    OUT VOID **SectionData,
    OUT UINT32 *AuthenticationStatus
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_GET_FILE_INFO2)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_FILE_HANDLE FileHandle,
    OUT VOID *FileInfo
);
typedef EFI_STATUS (EFIAPI *PEI_FFS_GET_VOLUME_INFO2)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_FV_HANDLE VolumeHandle,
    OUT VOID *VolumeInfo
);
typedef EFI_STATUS (EFIAPI *PEI_REGISTER_FOR_SHADOW2)(
    IN EFI_PEI_FILE_HANDLE FileHandle
);

struct _EFI_PEI_SERVICES {
    EFI_TABLE_HEADER Hdr;
    PEI_INSTALL_PPI InstallPpi;
    PEI_REINSTALL_PPI ReInstallPpi;
    PEI_LOCATE_PPI LocatePpi;
    PEI_NOTIFY_PPI NotifyPpi;
    PEI_GET_BOOT_MODE GetBootMode;
    PEI_SET_BOOT_MODE SetBootMode;
    PEI_GET_HOB_LIST GetHobList;
    PEI_CREATE_HOB CreateHob;
    PEI_FFS_FIND_NEXT_VOLUME FfsFindNextVolume;
    PEI_FFS_FIND_NEXT_FILE FfsFindNextFile;
    PEI_FFS_FIND_SECTION_DATA FfsFindSectionData;
    PEI_INSTALL_PEI_MEMORY InstallPeiMemory;
    PEI_ALLOCATE_PAGES AllocatePages;
    PEI_ALLOCATE_POOL AllocatePool;
    PEI_COPY_MEM CopyMem;
    PEI_SET_MEM SetMem;
    PEI_RESET_SYSTEM ResetSystem;
    PEI_FFS_FIND_FILE_BY_NAME FfsFindFileByName;
    PEI_FFS_GET_FILE_INFO FfsGetFileInfo;
    PEI_FFS_GET_VOLUME_INFO FfsGetVolumeInfo;
    PEI_REGISTER_FOR_SHADOW RegisterForShadow;
    PEI_FFS_FIND_SECTION_DATA3 FfsFindSectionData3;
    PEI_FFS_GET_FILE_INFO2 FfsGetFileInfo2;
    PEI_FFS_GET_VOLUME_INFO2 FfsGetVolumeInfo2;
    PEI_REGISTER_FOR_SHADOW2 RegisterForShadow2;
};

/* EFI_PEI_READ_ONLY_VARIABLE2_PPI (PI 1.2+) */
typedef EFI_STATUS (EFIAPI *EFI_PEI_GET_VARIABLE2)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN CHAR16 *VariableName,
    IN EFI_GUID *VariableGuid,
    OUT UINT32 *Attributes,
    IN OUT UINTN *DataSize,
    OUT VOID *Data
);
typedef EFI_STATUS (EFIAPI *EFI_PEI_GET_NEXT_VARIABLE_NAME2)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN OUT UINTN *VariableNameSize,
    IN OUT CHAR16 *VariableName,
    IN OUT EFI_GUID *VariableGuid
);

typedef struct _EFI_PEI_READ_ONLY_VARIABLE2_PPI {
    EFI_PEI_GET_VARIABLE2 GetVariable;
    EFI_PEI_GET_NEXT_VARIABLE_NAME2 GetNextVariableName;
} EFI_PEI_READ_ONLY_VARIABLE2_PPI;

typedef VOID (EFIAPI *EFI_PEIM_NOTIFY_ENTRY_POINT)(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_PPI_DESCRIPTOR *NotifyDescriptor,
    IN VOID *Ppi
);

#define READ_ONLY_VARIABLE2_PPI_GUID \
    { 0x1E5668E2, 0x8481, 0x11D4, { 0xBA, 0x06, 0x00, 0x80, 0xC7, 0x3C, 0x88, 0x88 } }

/* ------------------------------------------------------------------ */
/* Module state                                                       */
/* ------------------------------------------------------------------ */

static CHAR16 gGoldenName[] = L"BslRollbackGolden";
static EFI_GUID gGoldenGuid = GOLDEN_VENDOR_GUID;
static EFI_GUID gVarPpiGuid = READ_ONLY_VARIABLE2_PPI_GUID;

static EFI_PEI_READ_ONLY_VARIABLE2_PPI *gRealVarPpi = 0;
static EFI_PEI_READ_ONLY_VARIABLE2_PPI gShadowVarPpi;
static EFI_PEI_PPI_DESCRIPTOR gShadowDescriptor;

/* The snapshot buffer is pool-allocated: a large static BSS array would put
   relocation fixups outside the raw image data and break UEFIReplace's rebase. */
static UINT8 *gGolden = 0;
static UINTN gGoldenSize = 0;
static UINTN gGoldenCapacity = 0;

#if defined(DEBUG_POST)
static inline VOID PostCode(UINT8 Code) {
    __asm__ volatile ("outb %0, %1" : : "a"(Code), "Nd"((UINT16)0x80) : "memory");
}
#else
#define PostCode(Code) ((VOID)0)
#endif

/* ------------------------------------------------------------------ */
/* Shadow variable service                                            */
/* ------------------------------------------------------------------ */

static EFI_STATUS EFIAPI ShadowGetVariable(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN CHAR16 *VariableName,
    IN EFI_GUID *VariableGuid,
    OUT UINT32 *Attributes,
    IN OUT UINTN *DataSize,
    OUT VOID *Data
) {
    UINTN NameBytes = StringBytes(VariableName);
    UINT32 SnapshotAttributes = 0;
    UINTN SnapshotBytes = 0;
    CONST VOID *Snapshot;

    Snapshot = FindSnapshotEntry(gGolden, gGoldenSize, VariableGuid,
                                 (CONST UINT8 *)VariableName, NameBytes,
                                 &SnapshotAttributes, &SnapshotBytes);
    if (Snapshot != 0) {
        if (Attributes) *Attributes = SnapshotAttributes;
        if (DataSize == 0) return EFI_INVALID_PARAMETER;
        if (*DataSize < SnapshotBytes) {
            *DataSize = SnapshotBytes;
            return EFI_BUFFER_TOO_SMALL;
        }
        *DataSize = SnapshotBytes;
        if (Data) CopyBytes(Data, Snapshot, SnapshotBytes);
        return EFI_SUCCESS;
    }

    if (gRealVarPpi != 0) {
        return gRealVarPpi->GetVariable(PeiServices, VariableName, VariableGuid,
                                        Attributes, DataSize, Data);
    }
    return EFI_NOT_FOUND;
}

static EFI_STATUS EFIAPI ShadowGetNextVariableName(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN OUT UINTN *VariableNameSize,
    IN OUT CHAR16 *VariableName,
    IN OUT EFI_GUID *VariableGuid
) {
    if (gRealVarPpi != 0) {
        return gRealVarPpi->GetNextVariableName(PeiServices, VariableNameSize,
                                                VariableName, VariableGuid);
    }
    return EFI_NOT_FOUND;
}

/* ------------------------------------------------------------------ */
/* Recovery decision (runs when the pre-memory var service appears)   */
/* ------------------------------------------------------------------ */

static VOID DoRollbackCheck(IN CONST EFI_PEI_SERVICES **PeiServices) {
    UINT8 Counter;
    UINT8 Done;
    UINT8 Pending;
    UINT8 RollbackNow = 0;
    EFI_STATUS Status;

    if (RtcRead(RTC_REG_MAGIC) != RTC_MAGIC_VALUE) {
        RtcWrite(RTC_REG_MAGIC, RTC_MAGIC_VALUE);
        RtcWrite(RTC_REG_COUNTER, 0);
        RtcWrite(RTC_REG_DONE, 0);
        RtcWrite(RTC_REG_PENDING, 0);
    }

    Done = RtcRead(RTC_REG_DONE);
    Pending = RtcRead(RTC_REG_PENDING);
    Counter = RtcRead(RTC_REG_COUNTER);

    if (Done == 1) {
        Counter = 0;
    } else if (Counter < 0xFF) {
        Counter++;
    }

    if (Counter >= ROLLBACK_MAX_FAILS) {
        UINTN DataSize = 0;
        UINT32 Attributes = 0;

        if (gGolden == 0) {
            (*PeiServices)->AllocatePool(PeiServices, GOLDEN_CAPACITY, (VOID **)&gGolden);
            if (gGolden != 0) gGoldenCapacity = GOLDEN_CAPACITY;
        }

        Status = EFI_NOT_FOUND;
        if (gGolden != 0) {
            Status = gRealVarPpi->GetVariable(PeiServices, gGoldenName, &gGoldenGuid,
                                              &Attributes, &DataSize, 0);
            if (Status == EFI_BUFFER_TOO_SMALL && DataSize <= gGoldenCapacity) {
                Status = gRealVarPpi->GetVariable(PeiServices, gGoldenName, &gGoldenGuid,
                                                  &Attributes, &DataSize, gGolden);
                if (Status == EFI_SUCCESS) gGoldenSize = DataSize;
            }
        }
        if (gGoldenSize != 0) RollbackNow = 1;

        if (RollbackNow) {
            gShadowVarPpi.GetVariable = ShadowGetVariable;
            gShadowVarPpi.GetNextVariableName = ShadowGetNextVariableName;
            gShadowDescriptor.Flags = EFI_PEI_PPI_DESCRIPTOR_PPI | EFI_PEI_PPI_DESCRIPTOR_TERMINATE_LIST;
            gShadowDescriptor.Guid = &gVarPpiGuid;
            gShadowDescriptor.Ppi = &gShadowVarPpi;
            (*PeiServices)->InstallPpi(PeiServices, &gShadowDescriptor);
            RtcWrite(RTC_REG_PENDING, 1);
            PostCode(0xE2);
        }

        Counter = 0;
    }

    RtcWrite(RTC_REG_COUNTER, Counter);
    RtcWrite(RTC_REG_DONE, 0);
    (void)Pending;
}

static VOID EFIAPI NotifyReadOnlyVar2(
    IN CONST EFI_PEI_SERVICES **PeiServices,
    IN EFI_PEI_PPI_DESCRIPTOR *NotifyDescriptor,
    IN VOID *Ppi
) {
    (void)NotifyDescriptor;
    gRealVarPpi = (EFI_PEI_READ_ONLY_VARIABLE2_PPI *)Ppi;
    PostCode(0xE1);
    DoRollbackCheck(PeiServices);
}

/* ------------------------------------------------------------------ */
/* Entry point                                                        */
/* ------------------------------------------------------------------ */

EFI_STATUS EFIAPI RollbackPeiEntry(
    IN EFI_PEI_FILE_HANDLE FileHandle,
    IN CONST EFI_PEI_SERVICES **PeiServices
) {
    static EFI_PEI_PPI_DESCRIPTOR NotifyDescriptor;

    (void)FileHandle;
    PostCode(0xE0);

    NotifyDescriptor.Flags = EFI_PEI_PPI_DESCRIPTOR_NOTIFY_TYPES | EFI_PEI_PPI_DESCRIPTOR_NOTIFY_DISPATCH;
    NotifyDescriptor.Guid = &gVarPpiGuid;
    NotifyDescriptor.Ppi = (VOID *)NotifyReadOnlyVar2;

    (*PeiServices)->NotifyPpi(PeiServices, &NotifyDescriptor);
    return EFI_SUCCESS;
}
