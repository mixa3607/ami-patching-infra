#ifndef __MEM_TIMING_DXE_H__
#define __MEM_TIMING_DXE_H__

#include "UefiBase.h"

#define MEM_TIMING_DXE_GUID \
    EFI_GUID_INIT(0xa81729f4, 0x38b1, 0x4d90, 0xa8, 0x73, 0x18, 0x27, 0x4b, 0x63, 0xed, 0x21)

#define SOCKET_SETUP_FORMSET_GUID \
    EFI_GUID_INIT(0x516d5a04, 0xc0d5, 0x4657, 0xb9, 0x08, 0xe4, 0xfb, 0x1d, 0x93, 0x5e, 0xf0)

#define FPGA_SETUP_FORMSET_GUID \
    EFI_GUID_INIT(0x22819110, 0x7f6f, 0x4852, 0xb4, 0xbb, 0x13, 0xa7, 0x70, 0x14, 0x9b, 0x0c)

#define EFI_MEMORY_CONFIG_DATA_GUID \
    EFI_GUID_INIT(0x80db1735, 0x87a0, 0x4193, 0xb2, 0x66, 0x53, 0x8c, 0x38, 0xaf, 0x48, 0xce)

#define EFI_MEMORY_SUBCLASS_GUID \
    EFI_GUID_INIT(0x4e8f4e63, 0x0f79, 0x42ff, 0x80, 0x71, 0x9e, 0x7b, 0x8b, 0x63, 0x06, 0xb8)

#define AMI_TSE_SETUP_ENTER_GUID \
    EFI_GUID_INIT(0x71202ec3, 0x77dc, 0x49f6, 0xb4, 0x70, 0xd0, 0x72, 0x95, 0x02, 0x3e, 0x95)

#define MAX_SOCKETS      1
#define MAX_CHANNELS     8
#define MAX_DIMMS_PER_CH 2
#define TOTAL_DIMM_SLOTS (MAX_CHANNELS * MAX_DIMMS_PER_CH) // 16 slots
#define MAX_RANKS_PER_CH 4

// Primary timings
typedef struct {
    UINT16 tCL;          // CAS Latency
    UINT16 tRCD;         // RAS# to CAS# Delay
    UINT16 tRP;          // Row Precharge Time
    UINT16 tRAS;         // Active to Precharge Delay
    UINT16 tCWL;         // CAS Write Latency
    UINT8  CommandRate;  // 1 = 1T/1N, 2 = 2T/2N, 3 = 3T/3N
    UINT8  GearMode;     // 1 = 1:1, 2 = 1:2
} MEM_PRIMARY_TIMINGS;

// Secondary timings
typedef struct {
    UINT16 tRC;          // Row Cycle Time
    UINT16 tRFC;         // Refresh Cycle Time
    UINT16 tWR;          // Write Recovery Time
    UINT16 tWTR_S;       // Write to Read Delay (Short)
    UINT16 tWTR_L;       // Write to Read Delay (Long)
    UINT16 tRRD_S;       // Row to Row Delay (Short)
    UINT16 tRRD_L;       // Row to Row Delay (Long)
    UINT16 tRTP;         // Read to Precharge Delay
    UINT16 tFAW;         // Four Activate Window
} MEM_SECONDARY_TIMINGS;

// Tertiary & Turnaround timings
typedef struct {
    UINT32 tREFI;        // Refresh Interval (in clock cycles or us)
    UINT16 tCKE;         // CKE Minimum Pulse Width
    UINT16 tXP;          // Exit Precharge Power Down
    UINT16 tRDWR;        // Read to Write
    UINT16 tWRRD;        // Write to Read
    UINT16 tRDRD;        // Read to Read
    UINT16 tWRWR;        // Write to Write
} MEM_TERTIARY_TIMINGS;

// Margins, latencies and signal calibration data
typedef struct {
    UINT8  RTL[MAX_RANKS_PER_CH];      // Round Trip Latency per rank
    UINT8  IOL[MAX_RANKS_PER_CH];      // I/O Latency per rank
    INT8   TxVrefOffset;               // Tx Vref margin offset
    INT8   RxVrefOffset;               // Rx Vref margin offset
    UINT16 DramRttNom;                 // DRAM RTT_NOM (Ohms)
    UINT16 DramRttWr;                  // DRAM RTT_WR (Ohms)
    UINT16 DramRttPark;                // DRAM RTT_PARK (Ohms)
    UINT16 McOdt;                      // Memory Controller ODT (Ohms)
} MEM_SIGNAL_MARGINS;

// DIMM Module Information (16 slots total)
typedef struct {
    BOOLEAN Present;
    UINT32  SizeMB;                    // Capacity in MB
    UINT16  SpeedMHz;                  // Configured clock speed (e.g. 2133 / 3200 MT/s)
    UINT8   DramType;                  // 0=DDR4, 1=DDR5
    UINT8   DimmType;                  // 0=UDIMM, 1=RDIMM, 2=LRDIMM, 3=SODIMM
    UINT8   NumRanks;                  // 1, 2, 4
    CHAR8   PartNumber[32];            // Part number string
    CHAR8   Manufacturer[32];          // Manufacturer (Samsung, Micron, SK Hynix, etc.)
    UINT8   TemperatureC;              // Temperature from TSOD (0 if unavailable)
} DIMM_INFO;

// Per-channel status structure
typedef struct {
    BOOLEAN               Enabled;
    UINT16                CurrentFreqMHz;     // Effective MT/s
    UINT16                VddVoltage_mV;      // e.g. 1200 mV (1.20V)
    UINT16                VppVoltage_mV;      // e.g. 2500 mV (2.50V)
    MEM_PRIMARY_TIMINGS   Primary;
    MEM_SECONDARY_TIMINGS Secondary;
    MEM_TERTIARY_TIMINGS  Tertiary;
    MEM_SIGNAL_MARGINS    Margins;
    DIMM_INFO             Dimm[MAX_DIMMS_PER_CH];
    UINT32                EccCorrectableErrors;
    UINT32                EccUncorrectableErrors;
} CHANNEL_INFO;

// System-wide memory configuration summary
typedef struct {
    UINT8        ActiveSocketCount;
    UINT8        ActiveChannelCount;
    UINT8        PopulatedDimmCount;
    UINT64       TotalMemorySizeMB;
    UINT16       SystemMemorySpeedMHz;
    CHAR8        DramTechnologyStr[16];   // "DDR4" / "DDR5"
    CHANNEL_INFO Channel[MAX_CHANNELS];
} SYSTEM_MEM_TIMING_INFO;

#endif // __MEM_TIMING_DXE_H__
