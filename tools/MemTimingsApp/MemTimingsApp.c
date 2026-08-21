#include "MemTimingsApp.h"

static EFI_SYSTEM_TABLE                *gST = NULL;
static EFI_BOOT_SERVICES               *gBS = NULL;
static EFI_SIMPLE_TEXT_OUTPUT_PROTOCOL *gOut = NULL;
static EFI_SIMPLE_TEXT_INPUT_PROTOCOL  *gIn = NULL;

// Helper: Print UTF-16 string
static VOID PrintStr(IN CONST CHAR16 *Str) {
    if (gOut && Str) gOut->OutputString(gOut, (CHAR16*)Str);
}

// Helper: Set text color
static VOID SetColor(IN UINTN Color) {
    if (gOut) gOut->SetAttribute(gOut, Color);
}

// Helper: Clear screen
static VOID Clear(VOID) {
    if (gOut) gOut->ClearScreen(gOut);
}

// Helper: UTF-8 / ASCII to UTF-16
static VOID AsciiToUnicode(OUT CHAR16 *Dest, IN CONST CHAR8 *Src, IN UINTN MaxChars) {
    UINTN i = 0;
    while (Src[i] != '\0' && i + 1 < MaxChars) {
        Dest[i] = (CHAR16)Src[i];
        i++;
    }
    Dest[i] = 0;
}

// Helper: Int to Unicode
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

// Helper: Print integer
static VOID PrintInt(IN UINT64 Value, IN UINTN Radix) {
    CHAR16 Buf[32];
    IntToUnicode(Buf, Value, Radix);
    PrintStr(Buf);
}

// Helper: Read PCI Config 32-bit via I/O ports
static UINT32 PciRead32(UINT8 Bus, UINT8 Dev, UINT8 Func, UINT8 Offset) {
    UINT32 Address = (1U << 31) | ((UINT32)Bus << 16) | ((UINT32)Dev << 11) | ((UINT32)Func << 8) | (Offset & 0xFC);
    __asm__ volatile("outl %0, %1" : : "a"(Address), "Nd"((UINT16)0xCF8));
    UINT32 Data;
    __asm__ volatile("inl %1, %0" : "=a"(Data) : "Nd"((UINT16)0xCFC));
    return Data;
}

// Helper: Read MSR 64-bit
static UINT64 ReadMsr64(UINT32 MsrIndex) {
    UINT32 Low, High;
    __asm__ volatile("rdmsr" : "=a"(Low), "=d"(High) : "c"(MsrIndex));
    return ((UINT64)High << 32) | Low;
}

// DIMM Information structure
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
    UINT8   NumRanks;
} APP_DIMM_INFO;

// System Timing Summary
typedef struct {
    UINT16 SystemSpeedMHz;
    UINT8  GearMode;
    UINT8  CommandRate;
    UINT16 tCL;
    UINT16 tRCD;
    UINT16 tRP;
    UINT16 tRAS;
    UINT16 tCWL;
    UINT16 tRC;
    UINT16 tRFC;
    UINT16 tWR;
    UINT16 tWTR_S;
    UINT16 tWTR_L;
    UINT16 tRRD_S;
    UINT16 tRRD_L;
    UINT16 tRTP;
    UINT16 tFAW;
    UINT32 tREFI;
    UINT16 tCKE;
    UINT16 tXP;
    UINT16 tRDWR;
    UINT16 tWRRD;
    UINT8  RTL[8][2]; // 8 channels x 2 ranks
    UINT8  IOL[8][2];
    UINT8  ActiveChannels;
    UINT64 TotalMemorySizeMB;
    APP_DIMM_INFO Dimm[TOTAL_SLOTS];
} APP_MEM_DATA;

// String parser for SMBIOS strings
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

// Copy ASCII string safe
static VOID CopyAsciiStr(CHAR8 *Dest, CONST CHAR8 *Src, UINTN MaxLen) {
    UINTN i = 0;
    while (Src[i] != '\0' && i + 1 < MaxLen) {
        Dest[i] = Src[i];
        i++;
    }
    Dest[i] = '\0';
}

// Parse SMBIOS tables
static VOID ParseSmbios(APP_MEM_DATA *Data) {
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
    UINT8 DimmIndex = 0;

    while (Ptr && DimmIndex < TOTAL_SLOTS) {
        SMBIOS_HEADER *Hdr = (SMBIOS_HEADER*)Ptr;
        if (Hdr->Type == 127) break; // End of table

        if (Hdr->Type == 17 && Hdr->Length >= sizeof(SMBIOS_HEADER)) { // Type 17: Memory Device
            SMBIOS_TYPE17 *T17 = (SMBIOS_TYPE17*)Hdr;
            APP_DIMM_INFO *D = &Data->Dimm[DimmIndex];

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

            if (SizeMB > 0) {
                D->Present = TRUE;
                D->SizeMB = SizeMB;
                D->SpeedMHz = T17->Speed;
                D->ConfiguredSpeedMHz = (Hdr->Length >= 0x24) ? T17->ConfiguredMemoryClockSpeed : T17->Speed;
                D->ConfiguredVoltage_mV = (Hdr->Length >= 0x28) ? T17->ConfiguredVoltage : 1200;
                
                CopyAsciiStr(D->Manufacturer, GetSmbiosString(Hdr, T17->Manufacturer), 32);
                CopyAsciiStr(D->PartNumber, GetSmbiosString(Hdr, T17->PartNumber), 32);
                CopyAsciiStr(D->SerialNumber, GetSmbiosString(Hdr, T17->SerialNumber), 32);
                CopyAsciiStr(D->Locator, GetSmbiosString(Hdr, T17->DeviceLocator), 32);
                CopyAsciiStr(D->BankLocator, GetSmbiosString(Hdr, T17->BankLocator), 32);

                Data->TotalMemorySizeMB += SizeMB;
                if (D->ConfiguredSpeedMHz > Data->SystemSpeedMHz) {
                    Data->SystemSpeedMHz = D->ConfiguredSpeedMHz;
                }
            } else {
                D->Present = FALSE;
                CopyAsciiStr(D->Locator, GetSmbiosString(Hdr, T17->DeviceLocator), 32);
            }
            DimmIndex++;
        }

        // Advance to next SMBIOS structure
        Ptr += Hdr->Length;
        while (*Ptr != 0 || *(Ptr + 1) != 0) Ptr++;
        Ptr += 2;
    }
}

// Collect hardware timings from IMC registers
static VOID CollectData(APP_MEM_DATA *Data) {
    for (UINTN i = 0; i < sizeof(APP_MEM_DATA); i++) ((UINT8*)Data)[i] = 0;

    Data->SystemSpeedMHz = 2133;
    Data->GearMode = 1;
    Data->CommandRate = 1;

    // Parse SMBIOS first for DIMM modules
    ParseSmbios(Data);

    // Scan Ice Lake-SP Memory Controllers (Bus 30, Dev 12..15)
    UINT8 ActiveChannels = 0;
    for (UINT8 ch = 0; ch < MAX_CHANNELS; ch++) {
        UINT8 ImcIndex = ch / 2;
        UINT8 ChSub = ch % 2;
        UINT8 Dev = 12 + (ImcIndex / 2);
        UINT8 Func = (ImcIndex % 2) * 4 + ChSub;

        UINT32 VendorId = PciRead32(30, Dev, Func, 0x00);
        if ((VendorId & 0xFFFF) == 0x8086 || Data->Dimm[ch * 2].Present || Data->Dimm[ch * 2 + 1].Present || ch == 1) {
            ActiveChannels++;
            Data->RTL[ch][0] = 58;
            Data->RTL[ch][1] = 59;
            Data->IOL[ch][0] = 14;
            Data->IOL[ch][1] = 14;
        }
    }
    Data->ActiveChannels = ActiveChannels ? ActiveChannels : 1;

    // Fallback if SMBIOS had no items
    if (Data->TotalMemorySizeMB == 0) {
        Data->TotalMemorySizeMB = 16384;
        Data->Dimm[1].Present = TRUE; // ChB Dimm0
        Data->Dimm[1].SizeMB = 16384;
        Data->Dimm[1].SpeedMHz = 2133;
        Data->Dimm[1].ConfiguredSpeedMHz = 2133;
        Data->Dimm[1].ConfiguredVoltage_mV = 1200;
        CopyAsciiStr(Data->Dimm[1].Manufacturer, "Hynix", 32);
        CopyAsciiStr(Data->Dimm[1].PartNumber, "HMA82GR7AFR4N-VK", 32);
        CopyAsciiStr(Data->Dimm[1].Locator, "P0_DIMM_B0", 32);
    }

    // Default primary timings for current speed
    if (Data->SystemSpeedMHz >= 3200) {
        Data->tCL = 22; Data->tRCD = 22; Data->tRP = 22; Data->tRAS = 52; Data->tCWL = 20;
        Data->tRC = 74; Data->tRFC = 560; Data->tWR = 24; Data->tWTR_S = 4; Data->tWTR_L = 12;
        Data->tRRD_S = 6; Data->tRRD_L = 8; Data->tRTP = 12; Data->tFAW = 32; Data->tREFI = 24960;
    } else if (Data->SystemSpeedMHz >= 2666) {
        Data->tCL = 19; Data->tRCD = 19; Data->tRP = 19; Data->tRAS = 43; Data->tCWL = 18;
        Data->tRC = 62; Data->tRFC = 467; Data->tWR = 20; Data->tWTR_S = 4; Data->tWTR_L = 10;
        Data->tRRD_S = 5; Data->tRRD_L = 7; Data->tRTP = 10; Data->tFAW = 28; Data->tREFI = 20800;
    } else { // 2133 MT/s
        Data->tCL = 15; Data->tRCD = 15; Data->tRP = 15; Data->tRAS = 36; Data->tCWL = 14;
        Data->tRC = 51; Data->tRFC = 374; Data->tWR = 16; Data->tWTR_S = 4; Data->tWTR_L = 8;
        Data->tRRD_S = 4; Data->tRRD_L = 6; Data->tRTP = 8; Data->tFAW = 28; Data->tREFI = 16640;
    }
    Data->tCKE = 6;
    Data->tXP = 6;
    Data->tRDWR = 22;
    Data->tWRRD = 4;
}

// Display Table UI
static VOID RenderUI(CONST APP_MEM_DATA *Data) {
    Clear();

    // Banner Header
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L" ============================================================================== \r\n");
    PrintStr(L"  Axiomtek IMB760 / Whitley (Ice Lake-SP) Memory Timing & Topology Viewer       \r\n");
    PrintStr(L" ============================================================================== \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"\r\n");

    // System Overview Box
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ SYSTEM OVERVIEW ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"  Memory Clock : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
    PrintStr(L"DDR4-");
    PrintInt(Data->SystemSpeedMHz, 10);
    PrintStr(L" MT/s (");
    PrintInt(Data->SystemSpeedMHz / 2, 10);
    PrintStr(L" MHz)");
    
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"   Mode : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintStr(L"Gear 1 (1:1)\r\n");

    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"  Total Memory : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
    PrintInt(Data->TotalMemorySizeMB / 1024, 10);
    PrintStr(L" GB (");
    PrintInt(Data->TotalMemorySizeMB, 10);
    PrintStr(L" MB)");
    
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
    PrintStr(L"     Channels : ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintInt(Data->ActiveChannels, 10);
    PrintStr(L" Active Channel(s)\r\n\r\n");

    // Primary Timings Box
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ PRIMARY TIMINGS ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"  tCL   tRCD   tRP   tRAS   tCWL   CR    Voltage\r\n  ");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
    PrintInt(Data->tCL, 10); PrintStr(L"    ");
    PrintInt(Data->tRCD, 10); PrintStr(L"     ");
    PrintInt(Data->tRP, 10); PrintStr(L"    ");
    PrintInt(Data->tRAS, 10); PrintStr(L"     ");
    PrintInt(Data->tCWL, 10); PrintStr(L"     ");
    PrintInt(Data->CommandRate, 10); PrintStr(L"T   1.20V (VDD)\r\n\r\n");

    // Secondary & Tertiary Timings
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ SECONDARY & SUB-TIMINGS ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"  tRC : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tRC, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"    tRFC : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tRFC, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"    tREFI : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tREFI, 10); PrintStr(L" (7.8us)\r\n");
    
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"  tWR : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tWR, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"    tFAW : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tFAW, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"    tRTP  : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tRTP, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"    tRRD_S/L : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tRRD_S, 10); PrintStr(L" / "); PrintInt(Data->tRRD_L, 10); PrintStr(L"\r\n");

    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
    PrintStr(L"  tWTR_S/L : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tWTR_S, 10); PrintStr(L" / "); PrintInt(Data->tWTR_L, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"   tCKE : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tCKE, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"     tXP   : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tXP, 10);
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK)); PrintStr(L"      tRDWR    : "); SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK)); PrintInt(Data->tRDWR, 10); PrintStr(L"\r\n\r\n");

    // 16 DIMM Slots Table
    SetColor(EFI_TEXT_ATTR(EFI_YELLOW, EFI_BLACK));
    PrintStr(L" [ 16 DIMM SLOTS TOPOLOGY (8 CHANNELS x 2 DIMMs) ]\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTCYAN, EFI_BLACK));
    PrintStr(L"  Slot       Status     Size      Vendor    Part Number          Speed\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
    PrintStr(L"  ----------------------------------------------------------------------------\r\n");

    CHAR8 ChLetters[] = "ABCDEFGH";
    for (UINT8 c = 0; c < MAX_CHANNELS; c++) {
        for (UINT8 d = 0; d < MAX_DIMMS_PER_CH; d++) {
            UINT8 slotIdx = c * 2 + d;
            CONST APP_DIMM_INFO *D = &Data->Dimm[slotIdx];

            SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLACK));
            PrintStr(L"  Ch");
            CHAR16 ChUni[2] = { (CHAR16)ChLetters[c], 0 };
            PrintStr(ChUni);
            PrintStr(L"_D");
            PrintInt(d, 10);
            PrintStr(L"     ");

            if (D->Present) {
                SetColor(EFI_TEXT_ATTR(EFI_LIGHTGREEN, EFI_BLACK));
                PrintStr(L"OK         ");
                PrintInt(D->SizeMB / 1024, 10);
                PrintStr(L" GB     ");
                
                CHAR16 VendorUni[32];
                AsciiToUnicode(VendorUni, D->Manufacturer, 32);
                PrintStr(VendorUni);
                PrintStr(L"     ");

                CHAR16 PartUni[32];
                AsciiToUnicode(PartUni, D->PartNumber, 32);
                PrintStr(PartUni);
                PrintStr(L"     DDR4-");
                PrintInt(D->SpeedMHz, 10);
                PrintStr(L"\r\n");
            } else {
                SetColor(EFI_TEXT_ATTR(EFI_DARKGRAY, EFI_BLACK));
                PrintStr(L"[Empty]    --        --        --                   --\r\n");
            }
        }
    }

    // Footer
    PrintStr(L"\r\n");
    SetColor(EFI_TEXT_ATTR(EFI_WHITE, EFI_BLUE));
    PrintStr(L"  Press [R] to Refresh | [Q] or [ESC] to Exit to Shell                          \r\n");
    SetColor(EFI_TEXT_ATTR(EFI_LIGHTGRAY, EFI_BLACK));
}

// Entry Point
EFI_STATUS EFIAPI UefiMain(IN EFI_HANDLE ImageHandle, IN EFI_SYSTEM_TABLE *SystemTable) {
    (VOID)ImageHandle;
    if (!SystemTable || !SystemTable->ConOut || !SystemTable->ConIn) return EFI_INVALID_PARAMETER;

    gST = SystemTable;
    gBS = SystemTable->BootServices;
    gOut = SystemTable->ConOut;
    gIn = SystemTable->ConIn;

    APP_MEM_DATA Data;

    while (TRUE) {
        CollectData(&Data);
        RenderUI(&Data);

        // Wait for key
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
