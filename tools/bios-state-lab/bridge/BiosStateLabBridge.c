#include "bridge.h"

#define BSL_STATE_CAPACITY (32U * 1024U)

typedef struct {
    CHAR16 *Name;
    EFI_GUID Guid;
} VARIABLE_TARGET;

static CHAR16 gStateName[] = L"BiosStateLabState";
static EFI_GUID gBridgeGuid = EFI_GUID_INIT(
    0x3f143cec, 0x91e2, 0x4b9a, 0x90, 0xf3, 0xce, 0x93, 0x55, 0x6a, 0x1d, 0x42
);

static VARIABLE_TARGET gTargets[] = {
    { L"Setup", EFI_GUID_INIT(0xec87d643, 0xeba4, 0x4bb5, 0xa1, 0xe5, 0x3f, 0x3e, 0x36, 0xb2, 0x0d, 0xa9) },
    { L"ServerSetup", EFI_GUID_INIT(0x01239999, 0xfc0e, 0x4b6e, 0x9e, 0x79, 0xd5, 0x4d, 0x5d, 0xb6, 0xcd, 0x20) },
    { L"IntelSetup", EFI_GUID_INIT(0xec87d643, 0xeba4, 0x4bb5, 0xa1, 0xe5, 0x3f, 0x3e, 0x36, 0xb2, 0x0d, 0xa9) },
    { L"PchSetup", EFI_GUID_INIT(0x4570b7f1, 0xade8, 0x4943, 0x8d, 0xc3, 0x40, 0x64, 0x72, 0x84, 0x23, 0x84) },
    { L"FpgaSocketConfig", EFI_GUID_INIT(0x75839b0b, 0x0a99, 0x4233, 0x8a, 0xa4, 0x38, 0x66, 0xf6, 0xce, 0xf4, 0xb3) },
    { L"SocketIioConfig", EFI_GUID_INIT(0xdd84017e, 0x7f52, 0x48f9, 0xb1, 0x6e, 0x50, 0xed, 0x9e, 0x0d, 0xbe, 0x27) },
    { L"SocketCommonRcConfig", EFI_GUID_INIT(0x4402ca38, 0x808f, 0x4279, 0xbc, 0xec, 0x5b, 0xaf, 0x8d, 0x59, 0x09, 0x2f) },
    { L"SocketMpLinkConfig", EFI_GUID_INIT(0x2b9b22de, 0x2ad4, 0x4abc, 0x95, 0x7d, 0x5f, 0x18, 0xc5, 0x04, 0xa0, 0x5c) },
    { L"SocketMemoryConfig", EFI_GUID_INIT(0x98cf19ed, 0x4109, 0x4681, 0xb7, 0x9d, 0x91, 0x96, 0x75, 0x7c, 0x78, 0x24) },
    { L"SocketPowerManagementConfig", EFI_GUID_INIT(0xa1047342, 0xbdba, 0x4dae, 0xa6, 0x7a, 0x40, 0x97, 0x9b, 0x65, 0xc7, 0xf8) },
    { L"SocketProcessorCoreConfig", EFI_GUID_INIT(0x07013588, 0xc789, 0x4e12, 0xa7, 0xc3, 0x88, 0xfa, 0xfa, 0xe7, 0x9f, 0x7c) },
};

static UINT8 gState[BSL_STATE_CAPACITY];

static VOID CopyBytes(VOID *Destination, CONST VOID *Source, UINTN Count) {
    UINT8 *DestinationBytes = Destination;
    CONST UINT8 *SourceBytes = Source;
    while (Count-- != 0) *DestinationBytes++ = *SourceBytes++;
}

static VOID ZeroBytes(VOID *Destination, UINTN Count) {
    UINT8 *Bytes = Destination;
    while (Count-- != 0) *Bytes++ = 0;
}

static UINTN StringBytes(CONST CHAR16 *String) {
    UINTN Length = 0;
    while (String[Length] != 0) Length++;
    return Length * sizeof(CHAR16);
}

EFI_STATUS EFIAPI BridgeEntry(IN EFI_HANDLE ImageHandle, IN EFI_SYSTEM_TABLE *SystemTable) {
    EFI_RUNTIME_SERVICES *Runtime = SystemTable->RuntimeServices;
    BSL_STATE_HEADER *Header = (BSL_STATE_HEADER *)gState;
    UINTN Position = sizeof(*Header);
    UINTN Index;

    (void)ImageHandle;
    ZeroBytes(gState, sizeof(gState));
    CopyBytes(Header->Magic, "BSLSTATE", 8);
    Header->Version = 1;

    for (Index = 0; Index < sizeof(gTargets) / sizeof(gTargets[0]); Index++) {
        BSL_STATE_ENTRY *Entry;
        UINTN NameBytes = StringBytes(gTargets[Index].Name);
        UINTN DataBytes = 0;
        UINT32 Attributes = 0;
        EFI_STATUS Status;

        if (Position + sizeof(*Entry) + NameBytes > sizeof(gState)) break;
        Entry = (BSL_STATE_ENTRY *)(gState + Position);
        Position += sizeof(*Entry);
        CopyBytes(&Entry->Guid, &gTargets[Index].Guid, sizeof(Entry->Guid));
        Entry->NameBytes = (UINT32)NameBytes;
        CopyBytes(gState + Position, gTargets[Index].Name, NameBytes);
        Position += NameBytes;

        Status = Runtime->GetVariable(gTargets[Index].Name, &gTargets[Index].Guid, &Attributes, &DataBytes, 0);
        if (Status == EFI_BUFFER_TOO_SMALL && Position + DataBytes <= sizeof(gState)) {
            Status = Runtime->GetVariable(gTargets[Index].Name, &gTargets[Index].Guid, &Attributes, &DataBytes, gState + Position);
        } else {
            DataBytes = 0;
        }
        Entry->Attributes = Attributes;
        Entry->DataBytes = (UINT32)DataBytes;
        Entry->Status = Status;
        Position += DataBytes;
        Header->EntryCount++;
    }

    Header->TotalSize = (UINT32)Position;
    return Runtime->SetVariable(
        gStateName,
        &gBridgeGuid,
        EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS | EFI_VARIABLE_RUNTIME_ACCESS,
        Position,
        gState
    );
}
