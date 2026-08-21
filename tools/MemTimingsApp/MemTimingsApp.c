#include "MemTimingsApp.h"

static EFI_SYSTEM_TABLE                *gST = NULL;
static EFI_BOOT_SERVICES               *gBS = NULL;
static EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *gOut = NULL;
static EFI_SIMPLE_TEXT_INPUT_PROTOCOL  *gIn = NULL;

static VOID PrintStr(IN CONST CHAR16 *Str) {
    if (gOut && Str) gOut->OutputString(gOut, (CHAR16*)Str);
}

static VOID SetColor(IN UINTN Color) {
    if (gOut) gOut->SetAttribute(gOut, Color);
}

static VOID Clear(VOID) {
    if (gOut) gOut->ClearScreen(gOut);
}

static VOID AsciiToUnicode(OUT CHAR16 *Dest, IN CONST CHAR8 *Src, IN UINTN MaxChars) {
    UINTN i = 0;
    while (Src[i] != '\0' && i + 1 < MaxChars) {
        Dest[i] = (CHAR16)Src[i];
        i++;
    }
    Dest[i] = 0;
}

static VOID IntToUnicode(OUT CHAR16 *Dest, IN UINT64 Value, IN UINTN Radix) {
    CHAR16 Temp[32];
    INTN   Pos = 0;

    if (Value == 0) {
        Dest[0] = L'0';
        Dest[1] = 0;
        return;
    }

    while (Value > 0 && Pos < 30) {
        UINT64 Rem = Value % Radix;
        if (Rem < 10) {
            Temp[Pos++] = (CHAR16)(L'0' + Rem);
        } else {
            Temp[Pos++] = (CHAR16)(L'A' + (Rem - 10));
        }
        Value /= Radix;
    }

    for (INTN i = 0; i < Pos; i++) {
        Dest[i] = Temp[Pos - 1 - i];
    }
    Dest[Pos] = 0;
}

static VOID PrintInt(IN UINT64 Value, IN UINTN Radix) {
    CHAR16 Buf[32];
    IntToUnicode(Buf, Value, Radix);
    PrintStr(Buf);
}

static VOID PrintHex8(IN UINT8 Value) {
    CHAR16 Buf[16];
    Buf[0] = L'0'; Buf[1] = L'x';
    UINT8 H = (Value >> 4) & 0xF;
    UINT8 L = Value & 0xF;
    Buf[2] = (CHAR16)(H < 10 ? L'0' + H : L'A' + H - 10);
    Buf[3] = (CHAR16)(L < 10 ? L'0' + L : L'A' + L - 10);
    Buf[4] = 0;
    PrintStr(Buf);
}

static VOID PrintHex32(IN UINT32 Value) {
    CHAR16 Buf[16];
    Buf[0] = L'0'; Buf[1] = L'x';
    for (INTN i = 7; i >= 0; i--) {
        UINT8 b = (Value >> (i * 4)) & 0xF;
        Buf[9 - i] = (CHAR16)(b < 10 ? L'0' + b : L'A' + b - 10);
    }
    Buf[10] = 0;
    PrintStr(Buf);
}

static VOID PrintHex64(IN UINT64 Value) {
    CHAR16 Buf[24];
    Buf[0] = L'0'; Buf[1] = L'x';
    for (INTN i = 15; i >= 0; i--) {
        UINT8 b = (Value >> (i * 4)) & 0xF;
        Buf[17 - i] = (CHAR16)(b < 10 ? L'0' + b : L'A' + b - 10);
    }
    Buf[18] = 0;
    PrintStr(Buf);
}

static UINT32 PciIoRead32(UINT8 Bus, UINT8 Dev, UINT8 Func, UINT8 Offset) {
    UINT32 Address = (1U << 31) | ((UINT32)Bus << 16) | ((UINT32)Dev << 11) | ((UINT32)Func << 8) | (Offset & 0xFC);
    __asm__ volatile("outl %0, %1" : : "a"(Address), "Nd"((UINT16)0xCF8));
    UINT32 Data;
    __asm__ volatile("inl %1, %0" : "=a"(Data) : "Nd"((UINT16)0xCFC));
    return Data;
}

static UINT32 MmPciRead32(UINT64 MmBase, UINT8 Bus, UINT8 Dev, UINT8 Func, UINT16 Offset) {
    if (MmBase == 0) return PciIoRead32(Bus, Dev, Func, (UINT8)Offset);
    volatile UINT32 *RegPtr = (volatile UINT32*)(UINTN)(MmBase + ((UINT64)Bus << 20) + ((UINT64)Dev << 15) + ((UINT64)Func << 12) + (Offset & 0xFFC));
    return *RegPtr;
}

typedef struct {
    UINT8  Bus;
    UINT8  Dev;
    UINT8  Func;
    UINT16 DeviceId;
    UINT16 TimingRegOffset;
    UINT32 RegData[32]; // Offsets 0x00..0x7C and 0x100..0x17C
} IMC_DEV_PROBE;

typedef struct {
    BOOLEAN Present;
    UINT32  SizeMB;
    UINT16  SpeedMHz;
    UINT16  ConfiguredSpeedMHz;
    CHAR8   Manufacturer[32];
    CHAR8   PartNumber[32];
    CHAR8   SerialNumber[32];
    CHAR8   Locator[32];
    CHAR8   BankLocator[32];
    UINT16  ConfiguredVoltage_mV;
} SMBIOS_SLOT_INFO;

typedef struct {
    UINT64  MmConfigBase;
    BOOLEAN DecodedFromHw;
    UINT8   HwBus, HwDev, HwFunc;
    UINT16  HwDevId;
    UINT16  HwRegOffset;
    UINT16  tCL;
    UINT16  tRCD;
    UINT16  tRP;
    UINT16  tRAS;
    UINT16  tCWL;
    UINT16  tRC;
    UINT16  tRFC;
    UINT16  tWR;
    UINT16  tWTR_S;
    UINT16  tWTR_L;
    UINT16  tRRD_S;
    UINT16  tRRD_L;
    UINT16  tRTP;
    UINT16  tFAW;
    UINT32  tREFI;
    UINT16  tCKE;
    UINT16  tXP;
    UINT16  tRDWR;
    UINT16  tWRRD;

    UINT32  TotalMemorySizeMB;
    UINT16  MaxConfiguredSpeedMHz;
    UINT8   PopulatedSlotCount;
    UINT8   TotalSmbiosSlots;
    SMBIOS_SLOT_INFO Slot[TOTAL_SLOTS];

    UINT8         FoundImcCount;
    IMC_DEV_PROBE Imc[16];
} HW_PROBED_DATA;

static HW_PROBED_DATA gData;
static UINT8 gCurrentTab = 1;
static UINT8 gSelectedImc = 0;

static UINT64 FindMmConfigBase(VOID) {
    if (!gST || !gST->ConfigurationTable) return 0x80000000ULL;

    VOID *RsdpTable = NULL;
    EFI_GUID Acpi20Guid = ACPI_20_TABLE_GUID;
    EFI_GUID Acpi10Guid = ACPI_10_TABLE_GUID;

    for (UINTN i = 0; i < gST->NumberOfTableEntries; i++) {
        if (gST->ConfigurationTable[i].VendorGuid.Data1 == Acpi20Guid.Data1 &&
            gST->ConfigurationTable[i].VendorGuid.Data2 == Acpi20Guid.Data2) {
            RsdpTable = gST->ConfigurationTable[i].VendorTable;
            break;
        }
        if (gST->ConfigurationTable[i].VendorGuid.Data1 == Acpi10Guid.Data1 &&
            gST->ConfigurationTable[i].VendorGuid.Data2 == Acpi10Guid.Data2) {
            RsdpTable = gST->ConfigurationTable[i].VendorTable;
        }
    }

    if (!RsdpTable) return 0x80000000ULL;

    ACPI_20_RSDP *Rsdp = (ACPI_20_RSDP*)RsdpTable;
    if (Rsdp->Revision >= 2 && Rsdp->XsdtAddress != 0) {
        ACPI_DESCRIPTION_HEADER *Xsdt = (ACPI_DESCRIPTION_HEADER*)(UINTN)Rsdp->XsdtAddress;
        if (Xsdt) {
            UINTN EntryCount = (Xsdt->Length - sizeof(ACPI_DESCRIPTION_HEADER)) / sizeof(UINT64);
            UINT64 *EntryPtr = (UINT64*)(Xsdt + 1);
            for (UINTN e = 0; e < EntryCount; e++) {
                ACPI_DESCRIPTION_HEADER *Hdr = (ACPI_DESCRIPTION_HEADER*)(UINTN)EntryPtr[e];
                if (Hdr && Hdr->Signature[0] == 'M' && Hdr->Signature[1] == 'C' &&
                    Hdr->Signature[2] == 'F' && Hdr->Signature[3] == 'G') {
                    ACPI_MCFG_TABLE *Mcfg = (ACPI_MCFG_TABLE*)Hdr;
                    return Mcfg->Allocations[0].BaseAddress;
                }
            }
        }
    } else if (Rsdp->RsdtAddress != 0) {
        ACPI_DESCRIPTION_HEADER *Rsdt = (ACPI_DESCRIPTION_HEADER*)(UINTN)Rsdp->RsdtAddress;
        if (Rsdt) {
            UINTN EntryCount = (Rsdt->Length - sizeof(ACPI_DESCRIPTION_HEADER)) / sizeof(UINT32);
            UINT32 *EntryPtr = (UINT32*)(Rsdt + 1);
            for (UINTN e = 0; e < EntryCount; e++) {
                ACPI_DESCRIPTION_HEADER *Hdr = (ACPI_DESCRIPTION_HEADER*)(UINTN)EntryPtr[e];
                if (Hdr && Hdr->Signature[0] == 'M' && Hdr->Signature[1] == 'C' &&
                    Hdr->Signature[2] == 'F' && Hdr->Signature[3] == 'G') {
                    ACPI_MCFG_TABLE *Mcfg = (ACPI_MCFG_TABLE*)Hdr;
                    return Mcfg->Allocations[0].BaseAddress;
                }
            }
        }
    }

    return 0x80000000ULL;
}

static CONST CHAR8* GetSmbiosString(CONST SMBIOS_HEADER *Hdr, UINT8 Index) {
    if (Index == 0) return "";
    CONST CHAR8 *Ptr = (CONST CHAR8*)Hdr + Hdr->Length;
    UINT8 CurrentIndex = 1;
    while (*Ptr != 0 || *(Ptr + 1) != 0) {
        if (CurrentIndex == Index) return Ptr;
        while (*Ptr != 0) Ptr++;
        Ptr++;
        CurrentIndex++;
        if (*Ptr == 0) break;
    }
    return "";
}

static VOID CopyAsciiStr(CHAR8 *Dest, CONST CHAR8 *Src, UINTN MaxLen) {
    UINTN i = 0;
    while (Src[i] != '\0' && i + 1 < MaxLen) {
        Dest[i] = Src[i];
        i++;
    }
    Dest[i] = '\0';
}

static VOID ProbeSmbios(HW_PROBED_DATA *Data) {
    if (!gST || !gST->ConfigurationTable) return;

    VOID *SmbiosTable = NULL;
    EFI_GUID Smbios3Guid = SMBIOS3_TABLE_GUID;
    EFI_GUID SmbiosGuid = SMBIOS_TABLE_GUID;

    for (UINTN i = 0; i < gST->NumberOfTableEntries; i++) {
        if (gST->ConfigurationTable[i].VendorGuid.Data1 == Smbios3Guid.Data1 &&
            gST->ConfigurationTable[i].VendorGuid.Data2 == Smbios3Guid.Data2) {
            SMBIOS3_TABLE_ENTRY_POINT *Ep = (SMBIOS3_TABLE_ENTRY_POINT*)gST->ConfigurationTable[i].VendorTable;
            if (Ep) SmbiosTable = (VOID*)(UINTN)Ep->TableAddress;
            break;
        }
        if (gST->ConfigurationTable[i].VendorGuid.Data1 == SmbiosGuid.Data1 &&
            gST->ConfigurationTable[i].VendorGuid.Data2 == SmbiosGuid.Data2) {
            SMBIOS_TABLE_ENTRY_POINT *Ep = (SMBIOS_TABLE_ENTRY_POINT*)gST->ConfigurationTable[i].VendorTable;
            if (Ep) SmbiosTable = (VOID*)(UINTN)Ep->TableAddress;
        }
    }

    if (!SmbiosTable) return;

    UINT8 *Ptr = (UINT8*)SmbiosTable;
    UINT8 SlotIndex = 0;

    while (Ptr && SlotIndex < TOTAL_SLOTS) {
        SMBIOS_HEADER *Hdr = (SMBIOS_HEADER*)Ptr;
        if (Hdr->Type == 127) break;

        if (Hdr->Type == 17 && Hdr->Length >= sizeof(SMBIOS_HEADER)) {
            SMBIOS_TYPE17 *T17 = (SMBIOS_TYPE17*)Hdr;
            SMBIOS_SLOT_INFO *S = &Data->Slot[SlotIndex];

            UINT32 SizeMB = 0;
            if (T17->Size != 0xFFFF && T17->Size != 0) {
                if (T17->Size & 0x8000) {
                    SizeMB = (T17->Size & 0x7FFF) / 1024;
                } else {
                    SizeMB = T17->Size;
                }
            } else if (Hdr->Length >= 0x20 && T17->ExtendedSize != 0) {
                SizeMB = T17->ExtendedSize;
            }

            CopyAsciiStr(S->Locator, GetSmbiosString(Hdr, T17->DeviceLocator), 32);
            CopyAsciiStr(S->BankLocator, GetSmbiosString(Hdr, T17->BankLocator), 32);

            if (SizeMB > 0) {
                S->Present = TRUE;
                S->SizeMB = SizeMB;
                S->SpeedMHz = T17->Speed;
                S->ConfiguredSpeedMHz = (Hdr->Length >= 0x24) ? T17->ConfiguredMemoryClockSpeed : T17->Speed;
                S->ConfiguredVoltage_mV = (Hdr->Length >= 0x28) ? T17->ConfiguredVoltage : 0;

                CopyAsciiStr(S->Manufacturer, GetSmbiosString(Hdr, T17->Manufacturer), 32);
                CopyAsciiStr(S->PartNumber, GetSmbiosString(Hdr, T17->PartNumber), 32);
                CopyAsciiStr(S->SerialNumber, GetSmbiosString(Hdr, T17->SerialNumber), 32);

                Data->TotalMemorySizeMB += SizeMB;
                Data->PopulatedSlotCount++;
                if (S->ConfiguredSpeedMHz > Data->MaxConfiguredSpeedMHz) {
                    Data->MaxConfiguredSpeedMHz = S->ConfiguredSpeedMHz;
                }
            } else {
                S->Present = FALSE;
            }
            SlotIndex++;
        }

        Ptr += Hdr->Length;
        while (*Ptr != 0 || *(Ptr + 1) != 0) Ptr++;
        Ptr += 2;
    }
    Data->TotalSmbiosSlots = SlotIndex;
}

static VOID ProbeHardware(HW_PROBED_DATA *Data) {
    for (UINTN i = 0; i < sizeof(HW_PROBED_DATA); i++) ((UINT8*)Data)[i] = 0;

    Data->MmConfigBase = FindMmConfigBase();
    ProbeSmbios(Data);

    UINT8 Found = 0;
    // On Intel Whitley (Ice Lake-SP), IMC 8 channels reside on Bus 255 (0xFF) / Bus 254 (0xFE), Device 30 (0x1E), Functions 0..7
    // Device IDs: 0x3458 (Ch A) .. 0x345F (Ch H)
    UINT8 ScanBuses[] = { 255, 254, 30, 31, 127, 126, 0, 1, 2, 3, 4 };
    UINTN NumScanBuses = sizeof(ScanBuses) / sizeof(ScanBuses[0]);

    for (UINTN bi = 0; bi < NumScanBuses; bi++) {
        UINT8 bus = ScanBuses[bi];
        for (UINT8 dev = 0; dev < 32; dev++) {
            for (UINT8 func = 0; func < 8; func++) {
                if (bus == 0 && dev == 0) continue; // Skip Host Bridge 0:0:0

                UINT32 id_reg = MmPciRead32(Data->MmConfigBase, bus, dev, func, 0x00);
                UINT16 vendor = id_reg & 0xFFFF;
                UINT16 device = (id_reg >> 16) & 0xFFFF;

                if (vendor == 0x8086 && device != 0xFFFF && device != 0x09A2) {
                    UINT32 class_reg = MmPciRead32(Data->MmConfigBase, bus, dev, func, 0x08);
                    UINT8 base_class = (class_reg >> 24) & 0xFF;
                    UINT8 sub_class = (class_reg >> 16) & 0xFF;

                    // Real Memory Controller or Uncore Channel Controller
                    BOOLEAN IsImc = (device >= 0x3458 && device <= 0x345F) ||
                                    (device >= 0x3450 && device <= 0x3465) ||
                                    (bus == 255 && dev == 0x1E) ||
                                    (bus == 254 && dev == 0x1E) ||
                                    (base_class == 0x08 && sub_class == 0x80);


                    if (IsImc && Found < 16) {
                        IMC_DEV_PROBE *pImc = &Data->Imc[Found];
                        pImc->Bus = bus;
                        pImc->Dev = dev;
                        pImc->Func = func;
                        pImc->DeviceId = device;

                        for (UINT16 reg = 0; reg < 16; reg++) {
                            pImc->RegData[reg] = MmPciRead32(Data->MmConfigBase, bus, dev, func, reg * 4);
                        }

                        // Search timing registers in PCIe extended space (0x100..0x600)
                        for (UINT16 r = 0x100; r < 0x600; r += 4) {
                            UINT32 val = MmPciRead32(Data->MmConfigBase, bus, dev, func, r);
                            if (val != 0 && val != 0xFFFFFFFF) {
                                UINT8 cl = val & 0x3F;
                                UINT8 cwl = (val >> 8) & 0x3F;
                                UINT8 rcd = (val >> 16) & 0x3F;
                                UINT8 rp = (val >> 24) & 0x3F;

                                // Valid DDR4 timing range (e.g. 10..32)
                                if (cl >= 10 && cl <= 32 && rcd >= 10 && rcd <= 32 && rp >= 10 && rp <= 32) {
                                    Data->DecodedFromHw = TRUE;
                                    Data->HwBus = bus;
                                    Data->HwDev = dev;
                                    Data->HwFunc = func;
                                    Data->HwDevId = device;
                                    Data->HwRegOffset = r;
                                    Data->tCL = cl;
                                    Data->tCWL = cwl;
                                    Data->tRCD = rcd;
                                    Data->tRP = rp;

                                    UINT32 val_rap = MmPciRead32(Data->MmConfigBase, bus, dev, func, r + 4);
                                    if (val_rap != 0 && val_rap != 0xFFFFFFFF) {
                                        Data->tRAS = val_rap & 0x7F;
                                        Data->tRC = (val_rap >> 8) & 0xFF;
                                        Data->tRRD_S = (val_rap >> 16) & 0x1F;
                                        Data->tRRD_L = (val_rap >> 24) & 0x1F;
                                    }

                                    UINT32 val_rfp = MmPciRead32(Data->MmConfigBase, bus, dev, func, r + 8);
                                    if (val_rfp != 0 && val_rfp != 0xFFFFFFFF) {
                                        Data->tRFC = val_rfp & 0x3FF;
                                        Data->tREFI = (val_rfp >> 16) & 0xFFFF;
                                    }

                                    UINT32 val_misc = MmPciRead32(Data->MmConfigBase, bus, dev, func, r + 12);
                                    if (val_misc != 0 && val_misc != 0xFFFFFFFF) {
                                        Data->tFAW = val_misc & 0x7F;
                                        Data->tWR = (val_misc >> 8) & 0x3F;
                                        Data->tWTR_S = (val_misc >> 16) & 0x1F;
                                        Data->tWTR_L = (val_misc >> 24) & 0x1F;
                                    }
                                    break;
                                }
                            }
                        }

                        Found++;
                    }
                }
            }
        }
    }
    Data->FoundImcCount = Found;
}

static VOID RenderTopTabs(VOID) {
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" ============================================================================== \r\n");
    PrintStr(L"  Axiomtek IMB760 (Intel Whitley Ice Lake-SP) Hardware Memory Monitor          \r\n");

    if (gCurrentTab == 1) SetColor(EFI_TEXT_ATTR(EFI_BLACK, EFI_LIGHTCYAN));
    else SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" [1] Active Timings ");

    if (gCurrentTab == 2) SetColor(EFI_TEXT_ATTR(EFI_BLACK, EFI_LIGHTCYAN));
    else SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" [2] 16 DIMM Slots ");

    if (gCurrentTab == 3) SetColor(EFI_TEXT_ATTR(EFI_BLACK, EFI_LIGHTCYAN));
    else SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" [3] Raw PCI / IMC Dump ");

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L"                     \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"\r\n");
}

static VOID RenderFooter(VOID) {
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L"  Keys: [1..3/Tab] Switch Tabs | [R] Re-probe | [Q/ESC] Exit                    \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
}

static VOID RenderTab1_Timings(CONST HW_PROBED_DATA *Data) {
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ MEMORY SYSTEM OVERVIEW ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"  Configured Speed : ");
    if (Data->MaxConfiguredSpeedMHz > 0) {
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
        PrintStr(L"DDR4-");
        PrintInt(Data->MaxConfiguredSpeedMHz, 10);
        PrintStr(L" MT/s");
    } else {
        SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
        PrintStr(L"N/A");
    }

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"   Total Size   : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
    PrintInt(Data->TotalMemorySizeMB / 1024, 10);
    PrintStr(L" GB (");
    PrintInt(Data->TotalMemorySizeMB, 10);
    PrintStr(L" MB)\r\n");

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"  Populated Slots  : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintInt(Data->PopulatedSlotCount, 10);
    PrintStr(L" / ");
    PrintInt(Data->TotalSmbiosSlots > 0 ? Data->TotalSmbiosSlots : 16, 10);
    PrintStr(L" Slots");

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"     MMCONFIG Base: ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintHex64(Data->MmConfigBase);
    PrintStr(L"\r\n\r\n");

    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ ACTIVE HARDWARE TIMINGS (IMC DECODE) ]\r\n");

    if (Data->DecodedFromHw) {
        SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
        PrintStr(L"  Source: Bus ");
        PrintInt(Data->HwBus, 10);
        PrintStr(L", Dev ");
        PrintInt(Data->HwDev, 10);
        PrintStr(L", Func ");
        PrintInt(Data->HwFunc, 10);
        PrintStr(L" | DevID: ");
        PrintHex8((UINT8)(Data->HwDevId >> 8));
        PrintHex8((UINT8)(Data->HwDevId & 0xFF));
        PrintStr(L" | Offset: ");
        PrintHex32(Data->HwRegOffset);
        PrintStr(L"\r\n\r\n");

        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        PrintStr(L"  Primary Timings:\r\n  ");
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"tCL="); SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK)); PrintInt(Data->tCL, 10);
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  tRCD="); SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK)); PrintInt(Data->tRCD, 10);
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  tRP="); SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK)); PrintInt(Data->tRP, 10);
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  tRAS="); SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK)); PrintInt(Data->tRAS, 10);
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  tCWL="); SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK)); PrintInt(Data->tCWL, 10);
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  CR=1T\r\n\r\n");

        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        PrintStr(L"  Secondary & Turnaround:\r\n  ");
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"tRC="); PrintInt(Data->tRC, 10);
        PrintStr(L"  tRFC="); PrintInt(Data->tRFC, 10);
        PrintStr(L"  tREFI="); PrintInt(Data->tREFI, 10);
        PrintStr(L"  tFAW="); PrintInt(Data->tFAW, 10);
        PrintStr(L"  tWR="); PrintInt(Data->tWR, 10);
        PrintStr(L"  tRRD_S/L="); PrintInt(Data->tRRD_S, 10); PrintStr(L"/"); PrintInt(Data->tRRD_L, 10);
        PrintStr(L"  tWTR_S/L="); PrintInt(Data->tWTR_S, 10); PrintStr(L"/"); PrintInt(Data->tWTR_L, 10);
        PrintStr(L"\r\n\r\n");
    } else {
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTRED, EFI_BLACK));
        PrintStr(L"  [!] IMC register timing block is locked or unmapped via MMCONFIG.\r\n");
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        PrintStr(L"  See Tab [3] for raw PCI controllers dump.\r\n\r\n");
    }
}

static VOID RenderTab2_Dimms(CONST HW_PROBED_DATA *Data) {
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ POPULATED DIMM MODULES (SMBIOS TABLE 17) ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintStr(L"  Slot/Locator      Status     Size       Vendor        Part Number\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
    PrintStr(L"  ----------------------------------------------------------------------------\r\n");

    for (UINT8 s = 0; s < Data->TotalSmbiosSlots && s < 14; s++) {
        CONST SMBIOS_SLOT_INFO *S = &Data->Slot[s];

        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        CHAR16 LocUni[32];
        AsciiToUnicode(LocUni, S->Locator[0] ? S->Locator : "DIMM", 32);
        PrintStr(L"  ");
        PrintStr(LocUni);
        UINTN len = 0; while (LocUni[len] && len < 18) len++;
        for (UINTN pad = len; pad < 18; pad++) PrintStr(L" ");

        if (S->Present) {
            SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
            PrintStr(L"OK         ");
            PrintInt(S->SizeMB >= 1024 ? S->SizeMB / 1024 : S->SizeMB, 10);
            PrintStr(S->SizeMB >= 1024 ? L" GB     " : L" MB     ");

            CHAR16 VUni[32];
            AsciiToUnicode(VUni, S->Manufacturer[0] ? S->Manufacturer : "Unknown", 32);
            PrintStr(VUni);
            len = 0; while (VUni[len] && len < 14) len++;
            for (UINTN pad = len; pad < 14; pad++) PrintStr(L" ");

            CHAR16 PUni[32];
            AsciiToUnicode(PUni, S->PartNumber[0] ? S->PartNumber : "N/A", 32);
            PrintStr(PUni);
            PrintStr(L"\r\n");
        } else {
            SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
            PrintStr(L"[Empty]    --         --            --\r\n");
        }
    }
    PrintStr(L"\r\n");
}

static VOID RenderTab3_RawDump(CONST HW_PROBED_DATA *Data) {
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ DETECTED PCI IMC CONTROLLERS & REGISTERS ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintStr(L"  #  Bus:Dev:Func  DevID   Vendor   Reg00 (ID)  Reg08(Class)  Reg10(BAR0)\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
    PrintStr(L"  ----------------------------------------------------------------------------\r\n");

    for (UINT8 i = 0; i < Data->FoundImcCount && i < 10; i++) {
        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        PrintStr(L"  "); PrintInt(i, 10); PrintStr(L"  B");
        PrintInt(Data->Imc[i].Bus, 10);
        PrintStr(L":D"); PrintInt(Data->Imc[i].Dev, 10);
        PrintStr(L":F"); PrintInt(Data->Imc[i].Func, 10);
        PrintStr(L"   ");
        PrintHex8((UINT8)(Data->Imc[i].DeviceId >> 8));
        PrintHex8((UINT8)(Data->Imc[i].DeviceId & 0xFF));
        PrintStr(L"  Intel    ");
        PrintHex32(Data->Imc[i].RegData[0]);
        PrintStr(L"  ");
        PrintHex32(Data->Imc[i].RegData[2]);
        PrintStr(L"    ");
        PrintHex32(Data->Imc[i].RegData[4]);
        PrintStr(L"\r\n");
    }

    if (Data->FoundImcCount > 0 && gSelectedImc < Data->FoundImcCount) {
        PrintStr(L"\r\n");
        SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
        PrintStr(L" [ SELECTED IMC REGISTERS 0x100..0x13C (Press Up/Down to switch IMC) ]\r\n  ");
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        UINT8 b = Data->Imc[gSelectedImc].Bus;
        UINT8 d = Data->Imc[gSelectedImc].Dev;
        UINT8 f = Data->Imc[gSelectedImc].Func;
        for (UINT16 off = 0x100; off < 0x140; off += 4) {
            UINT32 val = MmPciRead32(Data->MmConfigBase, b, d, f, off);
            PrintHex32(val);
            PrintStr(L" ");
            if (off == 0x11C) PrintStr(L"\r\n  ");
        }
        PrintStr(L"\r\n");
    }
}

static VOID RenderScreen(VOID) {
    Clear();
    RenderTopTabs();

    if (gCurrentTab == 1) {
        RenderTab1_Timings(&gData);
    } else if (gCurrentTab == 2) {
        RenderTab2_Dimms(&gData);
    } else if (gCurrentTab == 3) {
        RenderTab3_RawDump(&gData);
    }

    RenderFooter();
}

EFI_STATUS EFIAPI UefiMain(IN EFI_HANDLE ImageHandle, IN EFI_SYSTEM_TABLE *SystemTable) {
    (VOID)ImageHandle;
    if (!SystemTable || !SystemTable->ConOut || !SystemTable->ConIn) return EFI_INVALID_PARAMETER;

    gST = SystemTable;
    gBS = SystemTable->BootServices;
    gOut = SystemTable->ConOut;
    gIn = SystemTable->ConIn;

    ProbeHardware(&gData);

    while (TRUE) {
        RenderScreen();

        EFI_INPUT_KEY Key;
        EFI_STATUS Status;
        do {
            Status = gIn->ReadKeyStroke(gIn, &Key);
            if (Status == EFI_NOT_READY) {
                if (gBS && gBS->Stall) gBS->Stall(50000);
            }
        } while (Status == EFI_NOT_READY);

        if (!EFI_ERROR(Status)) {
            if (Key.UnicodeChar == L'q' || Key.UnicodeChar == L'Q' || Key.ScanCode == 0x17) {
                Clear();
                break;
            }
            if (Key.UnicodeChar == L'1') {
                gCurrentTab = 1;
            } else if (Key.UnicodeChar == L'2') {
                gCurrentTab = 2;
            } else if (Key.UnicodeChar == L'3') {
                gCurrentTab = 3;
            } else if (Key.UnicodeChar == L'\t') {
                gCurrentTab = (gCurrentTab % 3) + 1;
            } else if (Key.UnicodeChar == L'r' || Key.UnicodeChar == L'R') {
                ProbeHardware(&gData);
            } else if (Key.ScanCode == 0x01) { // Up arrow
                if (gSelectedImc > 0) gSelectedImc--;
            } else if (Key.ScanCode == 0x02) { // Down arrow
                if (gSelectedImc + 1 < gData.FoundImcCount) gSelectedImc++;
            }
        }
    }

    return EFI_SUCCESS;
}
