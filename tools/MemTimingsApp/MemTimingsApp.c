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

// PCI Config read
static UINT32 PciRead32(UINT8 Bus, UINT8 Dev, UINT8 Func, UINT16 Offset) {
    UINT32 Address = (1U << 31) | ((UINT32)Bus << 16) | ((UINT32)Dev << 11) | ((UINT32)Func << 8) | (Offset & 0xFC);
    __asm__ volatile("outl %0, %1" : : "a"(Address), "Nd"((UINT16)0xCF8));
    UINT32 Data;
    __asm__ volatile("inl %1, %0" : "=a"(Data) : "Nd"((UINT16)0xCFC));
    return Data;
}

typedef struct {
    UINT8  Bus;
    UINT8  Dev;
    UINT8  Func;
    UINT16 DeviceId;
    UINT32 RegData[64]; // Sampled registers
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
    UINT8   MemoryType;
} SMBIOS_SLOT_INFO;

typedef struct {
    // Hardware Timings
    BOOLEAN DecodedFromHw;
    UINT8   HwBus;
    UINT8   HwDev;
    UINT8   HwFunc;
    UINT16  HwDevId;
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

    // SMBIOS Platform Info
    UINT32  TotalMemorySizeMB;
    UINT16  MaxConfiguredSpeedMHz;
    UINT8   PopulatedSlotCount;
    UINT8   TotalSmbiosSlots;
    SMBIOS_SLOT_INFO Slot[TOTAL_SLOTS];

    // Found IMC controllers
    UINT8         FoundImcCount;
    IMC_DEV_PROBE Imc[16];
} HW_PROBED_DATA;

// Get SMBIOS string
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

// Parse real SMBIOS tables
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
        if (Hdr->Type == 127) break; // End of table

        if (Hdr->Type == 17 && Hdr->Length >= sizeof(SMBIOS_HEADER)) { // Type 17: Memory Device
            SMBIOS_TYPE17 *T17 = (SMBIOS_TYPE17*)Hdr;
            SMBIOS_SLOT_INFO *S = &Data->Slot[SlotIndex];

            UINT32 SizeMB = 0;
            if (T17->Size != 0xFFFF && T17->Size != 0) {
                if (T17->Size & 0x8000) { // Size in KB
                    SizeMB = (T17->Size & 0x7FFF) / 1024;
                } else { // Size in MB
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
                S->MemoryType = T17->MemoryType;

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

// Scan PCI bus for Intel Memory Controllers and read timing registers
static VOID ProbeHardware(HW_PROBED_DATA *Data) {
    for (UINTN i = 0; i < sizeof(HW_PROBED_DATA); i++) ((UINT8*)Data)[i] = 0;

    ProbeSmbios(Data);

    UINT8 Found = 0;
    // Scan PCI buses for Intel Memory Controllers (Vendor 0x8086, Class 0880 or Device in 0x09A0..0x09AF, 0x3450..0x3460)
    // On Ice Lake-SP: Bus 30 (0x1E) / Bus 31 (0x1F) / Bus 0..64
    UINT8 ScanBuses[] = { 30, 31, 0, 1, 2, 3, 4, 126, 127, 254, 255 };
    UINTN NumScanBuses = sizeof(ScanBuses) / sizeof(ScanBuses[0]);

    for (UINTN bi = 0; bi < NumScanBuses; bi++) {
        UINT8 bus = ScanBuses[bi];
        for (UINT8 dev = 0; dev < 32; dev++) {
            for (UINT8 func = 0; func < 8; func++) {
                UINT32 id_reg = PciRead32(bus, dev, func, 0x00);
                UINT16 vendor = id_reg & 0xFFFF;
                UINT16 device = (id_reg >> 16) & 0xFFFF;

                if (vendor == 0x8086 && device != 0xFFFF) {
                    UINT32 class_reg = PciRead32(bus, dev, func, 0x08);
                    UINT8 base_class = (class_reg >> 24) & 0xFF;
                    UINT8 sub_class = (class_reg >> 16) & 0xFF;

                    // Memory Controller or System Peripheral (Class 0x08 / SubClass 0x80)
                    // Or known Ice Lake-SP IMC Device IDs (0x09A2..0x09A6, 0x3451..0x345F)
                    BOOLEAN IsImc = (base_class == 0x08 && sub_class == 0x80) ||
                                    (device >= 0x09A0 && device <= 0x09AF) ||
                                    (device >= 0x3450 && device <= 0x3465) ||
                                    (bus == 30 && dev >= 12 && dev <= 15);

                    if (IsImc && Found < 16) {
                        IMC_DEV_PROBE *pImc = &Data->Imc[Found];
                        pImc->Bus = bus;
                        pImc->Dev = dev;
                        pImc->Func = func;
                        pImc->DeviceId = device;

                        // Sample timing registers
                        for (UINT16 reg = 0; reg < 64; reg++) {
                            pImc->RegData[reg] = PciRead32(bus, dev, func, reg * 4);
                        }

                        // Check if this controller holds active timing constraints
                        // In Ice Lake-SP IMC: TC_DBP (offset 0x100..0x240)
                        for (UINT16 r = 0x80; r < 0x300; r += 4) {
                            UINT32 val = PciRead32(bus, dev, func, r);
                            if (val != 0 && val != 0xFFFFFFFF) {
                                UINT8 cl = val & 0x3F;
                                UINT8 cwl = (val >> 8) & 0x3F;
                                UINT8 rcd = (val >> 16) & 0x3F;
                                UINT8 rp = (val >> 24) & 0x3F;

                                // Valid DDR4 timing window
                                if (cl >= 9 && cl <= 32 && rcd >= 9 && rcd <= 32 && rp >= 9 && rp <= 32 && !Data->DecodedFromHw) {
                                    Data->DecodedFromHw = TRUE;
                                    Data->HwBus = bus;
                                    Data->HwDev = dev;
                                    Data->HwFunc = func;
                                    Data->HwDevId = device;
                                    Data->tCL = cl;
                                    Data->tCWL = cwl;
                                    Data->tRCD = rcd;
                                    Data->tRP = rp;

                                    // Next register: tRAS / tRC / tRRD
                                    UINT32 val_rap = PciRead32(bus, dev, func, r + 4);
                                    if (val_rap != 0 && val_rap != 0xFFFFFFFF) {
                                        Data->tRAS = val_rap & 0x7F;
                                        Data->tRC = (val_rap >> 8) & 0xFF;
                                        Data->tRRD_S = (val_rap >> 16) & 0x1F;
                                        Data->tRRD_L = (val_rap >> 24) & 0x1F;
                                    }

                                    // Refresh register: tRFC / tREFI
                                    UINT32 val_rfp = PciRead32(bus, dev, func, r + 8);
                                    if (val_rfp != 0 && val_rfp != 0xFFFFFFFF) {
                                        Data->tRFC = val_rfp & 0x3FF;
                                        Data->tREFI = (val_rfp >> 16) & 0xFFFF;
                                    }

                                    // Misc: tFAW / tWR / tWTR
                                    UINT32 val_misc = PciRead32(bus, dev, func, r + 12);
                                    if (val_misc != 0 && val_misc != 0xFFFFFFFF) {
                                        Data->tFAW = val_misc & 0x7F;
                                        Data->tWR = (val_misc >> 8) & 0x3F;
                                        Data->tWTR_S = (val_misc >> 16) & 0x1F;
                                        Data->tWTR_L = (val_misc >> 24) & 0x1F;
                                    }
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

// Render Real Probed Hardware Data
static VOID RenderUI(CONST HW_PROBED_DATA *Data) {
    Clear();

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" ============================================================================== \r\n");
    PrintStr(L"  Axiomtek IMB760 (Intel Ice Lake-SP) Hardware Memory & Timing Monitor         \r\n");
    PrintStr(L" ============================================================================== \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"\r\n");

    // SMBIOS Memory Summary
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ SYSTEM MEMORY (SMBIOS & HARDWARE) ]\r\n");
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
    PrintStr(L"      Total Capacity : ");
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
    PrintStr(L"       IMC Devices    : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintInt(Data->FoundImcCount, 10);
    PrintStr(L" Detected on PCI\r\n\r\n");

    // Hardware Decoded Timings
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ ACTIVE HARDWARE TIMINGS (IMC REGISTER DECODE) ]\r\n");
    if (Data->DecodedFromHw) {
        SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
        PrintStr(L"  Source: B");
        PrintInt(Data->HwBus, 10);
        PrintStr(L":D");
        PrintInt(Data->HwDev, 10);
        PrintStr(L":F");
        PrintInt(Data->HwFunc, 10);
        PrintStr(L" (DevID: ");
        PrintHex8((UINT8)(Data->HwDevId >> 8));
        PrintHex8((UINT8)(Data->HwDevId & 0xFF));
        PrintStr(L")\r\n");

        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        PrintStr(L"  tCL   tRCD   tRP   tRAS   tCWL   tRC   tRFC   tFAW   tWR   tRRD_S/L\r\n  ");
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
        PrintInt(Data->tCL, 10); PrintStr(L"    ");
        PrintInt(Data->tRCD, 10); PrintStr(L"     ");
        PrintInt(Data->tRP, 10); PrintStr(L"    ");
        PrintInt(Data->tRAS, 10); PrintStr(L"     ");
        PrintInt(Data->tCWL, 10); PrintStr(L"     ");
        PrintInt(Data->tRC, 10); PrintStr(L"    ");
        PrintInt(Data->tRFC, 10); PrintStr(L"    ");
        PrintInt(Data->tFAW, 10); PrintStr(L"     ");
        PrintInt(Data->tWR, 10); PrintStr(L"    ");
        PrintInt(Data->tRRD_S, 10); PrintStr(L"/"); PrintInt(Data->tRRD_L, 10);
        PrintStr(L"\r\n");

        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
        PrintStr(L"  tREFI: "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tREFI, 10);
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"  tWTR_S/L: "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tWTR_S, 10); PrintStr(L"/"); PrintInt(Data->tWTR_L, 10);
        PrintStr(L"\r\n\r\n");
    } else {
        SetColor(EFI_TEXT_ATTR(EFI_LIGHTRED, EFI_BLACK));
        PrintStr(L"  [!] IMC register timing block not locked or mapped to MMIO. Showing raw PCI list below.\r\n\r\n");
    }

    // DIMM Slots Breakdown (Real SMBIOS / SPD)
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ POPULATED DIMM MODULES (REAL SMBIOS TABLE 17) ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintStr(L"  Slot/Locator      Status     Size       Vendor        Part Number          Speed\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
    PrintStr(L"  --------------------------------------------------------------------------------\r\n");

    for (UINT8 s = 0; s < Data->TotalSmbiosSlots && s < TOTAL_SLOTS; s++) {
        CONST SMBIOS_SLOT_INFO *S = &Data->Slot[s];

        SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
        CHAR16 LocUni[32];
        AsciiToUnicode(LocUni, S->Locator[0] ? S->Locator : "DIMM", 32);
        PrintStr(L"  ");
        PrintStr(LocUni);
        // Padding
        UINTN len = 0;
        while (LocUni[len] && len < 18) len++;
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
            len = 0; while (PUni[len] && len < 21) len++;
            for (UINTN pad = len; pad < 21; pad++) PrintStr(L" ");

            PrintStr(L"DDR4-");
            PrintInt(S->SpeedMHz, 10);
            PrintStr(L"\r\n");
        } else {
            SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
            PrintStr(L"[Empty]    --         --            --                   --\r\n");
        }
    }

    // Detected IMC devices on PCI bus
    PrintStr(L"\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ DETECTED PCI MEMORY CONTROLLERS ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
    for (UINT8 i = 0; i < Data->FoundImcCount && i < 8; i++) {
        PrintStr(L"  B");
        PrintInt(Data->Imc[i].Bus, 10);
        PrintStr(L":D");
        PrintInt(Data->Imc[i].Dev, 10);
        PrintStr(L":F");
        PrintInt(Data->Imc[i].Func, 10);
        PrintStr(L" [DevID: ");
        PrintHex8((UINT8)(Data->Imc[i].DeviceId >> 8));
        PrintHex8((UINT8)(Data->Imc[i].DeviceId & 0xFF));
        PrintStr(L"]  Reg00=");
        PrintHex32(Data->Imc[i].RegData[0]);
        PrintStr(L"  Reg08=");
        PrintHex32(Data->Imc[i].RegData[2]);
        PrintStr(L"\r\n");
    }

    // Footer
    PrintStr(L"\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L"  Press [R] to Re-scan & Refresh | [Q] or [ESC] to Exit to Shell                \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
}

static HW_PROBED_DATA gData;

// Entry Point
EFI_STATUS EFIAPI UefiMain(IN EFI_HANDLE ImageHandle, IN EFI_SYSTEM_TABLE *SystemTable) {
    (VOID)ImageHandle;
    if (!SystemTable || !SystemTable->ConOut || !SystemTable->ConIn) return EFI_INVALID_PARAMETER;

    gST = SystemTable;
    gBS = SystemTable->BootServices;
    gOut = SystemTable->ConOut;
    gIn = SystemTable->ConIn;

    while (TRUE) {
        ProbeHardware(&gData);
        RenderUI(&gData);


        // Wait for keypress
        EFI_INPUT_KEY Key;
        EFI_STATUS Status;
        do {
            Status = gIn->ReadKeyStroke(gIn, &Key);
            if (Status == EFI_NOT_READY) {
                if (gBS && gBS->Stall) gBS->Stall(50000); // 50ms
            }
        } while (Status == EFI_NOT_READY);

        if (!EFI_ERROR(Status)) {
            if (Key.UnicodeChar == L'q' || Key.UnicodeChar == L'Q' || Key.ScanCode == 0x17) { // ESC or Q
                Clear();
                break;
            }
            if (Key.UnicodeChar == L'r' || Key.UnicodeChar == L'R') {
                continue;
            }
        }
    }

    return EFI_SUCCESS;
}
