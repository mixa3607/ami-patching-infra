#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/io.h>

#define COLOR_RESET   "\033[0m"
#define COLOR_BOLD    "\033[1m"
#define COLOR_RED     "\033[31m"
#define COLOR_GREEN   "\033[32m"
#define COLOR_YELLOW  "\033[33m"
#define COLOR_BLUE    "\033[34m"
#define COLOR_MAGENTA "\033[35m"
#define COLOR_CYAN    "\033[36m"
#define COLOR_WHITE   "\033[37m"
#define COLOR_DARK    "\033[90m"
#define COLOR_BG_BLUE "\033[44m"

static uint32_t pci_read32(uint8_t bus, uint8_t dev, uint8_t func, uint16_t offset) {
    uint32_t address = (1U << 31) | ((uint32_t)bus << 16) | ((uint32_t)dev << 11) | ((uint32_t)func << 8) | (offset & 0xFC);
    outl(address, 0xCF8);
    return inl(0xCFC);
}

typedef struct {
    uint8_t  bus, dev, func;
    uint16_t dev_id;
    uint32_t reg[64];
} IMC_INFO;

int main(int argc, char **argv) {
    (void)argc; (void)argv;

    int has_iopl = (iopl(3) == 0);

    printf(COLOR_BG_BLUE COLOR_WHITE COLOR_BOLD);
    printf(" ============================================================================== \n");
    printf("  Axiomtek IMB760 (Intel Ice Lake-SP) Hardware Memory & Timing Monitor         \n");
    printf(" ============================================================================== \n");
    printf(COLOR_RESET "\n");

    if (!has_iopl) {
        printf(COLOR_RED " [!] PCI port access denied. Run with sudo/root to probe IMC registers directly.\n\n" COLOR_RESET);
    }

    IMC_INFO imcs[16];
    int imc_count = 0;
    int decoded = 0;
    uint8_t tCL = 0, tCWL = 0, tRCD = 0, tRP = 0, tRAS = 0, tRC = 0, tRRD_S = 0, tRRD_L = 0;
    uint16_t tRFC = 0, tREFI = 0;
    uint8_t tFAW = 0, tWR = 0, tWTR_S = 0, tWTR_L = 0;
    uint8_t hw_b = 0, hw_d = 0, hw_f = 0;

    if (has_iopl) {
        uint8_t scan_buses[] = { 30, 31, 0, 1, 2, 3, 4, 126, 127, 254, 255 };
        for (size_t bi = 0; bi < sizeof(scan_buses); bi++) {
            uint8_t b = scan_buses[bi];
            for (uint8_t d = 0; d < 32; d++) {
                for (uint8_t f = 0; f < 8; f++) {
                    uint32_t id = pci_read32(b, d, f, 0x00);
                    uint16_t vendor = id & 0xFFFF;
                    uint16_t device = (id >> 16) & 0xFFFF;

                    if (vendor == 0x8086 && device != 0xFFFF) {
                        uint32_t clr = pci_read32(b, d, f, 0x08);
                        uint8_t base_class = (clr >> 24) & 0xFF;
                        uint8_t sub_class = (clr >> 16) & 0xFF;

                        if ((base_class == 0x08 && sub_class == 0x80) ||
                            (device >= 0x09A0 && device <= 0x09AF) ||
                            (device >= 0x3450 && device <= 0x3465) ||
                            (b == 30 && d >= 12 && d <= 15)) {
                            
                            if (imc_count < 16) {
                                imcs[imc_count].bus = b;
                                imcs[imc_count].dev = d;
                                imcs[imc_count].func = f;
                                imcs[imc_count].dev_id = device;
                                for (int r = 0; r < 64; r++) imcs[imc_count].reg[r] = pci_read32(b, d, f, r * 4);

                                for (uint16_t reg = 0x80; reg < 0x300; reg += 4) {
                                    uint32_t val = pci_read32(b, d, f, reg);
                                    if (val != 0 && val != 0xFFFFFFFF) {
                                        uint8_t cl = val & 0x3F;
                                        uint8_t cwl = (val >> 8) & 0x3F;
                                        uint8_t rcd = (val >> 16) & 0x3F;
                                        uint8_t rp = (val >> 24) & 0x3F;

                                        if (cl >= 9 && cl <= 32 && rcd >= 9 && rcd <= 32 && rp >= 9 && rp <= 32 && !decoded) {
                                            decoded = 1;
                                            hw_b = b; hw_d = d; hw_f = f;
                                            tCL = cl; tCWL = cwl; tRCD = rcd; tRP = rp;

                                            uint32_t val_rap = pci_read32(b, d, f, reg + 4);
                                            if (val_rap != 0 && val_rap != 0xFFFFFFFF) {
                                                tRAS = val_rap & 0x7F;
                                                tRC = (val_rap >> 8) & 0xFF;
                                                tRRD_S = (val_rap >> 16) & 0x1F;
                                                tRRD_L = (val_rap >> 24) & 0x1F;
                                            }

                                            uint32_t val_rfp = pci_read32(b, d, f, reg + 8);
                                            if (val_rfp != 0 && val_rfp != 0xFFFFFFFF) {
                                                tRFC = val_rfp & 0x3FF;
                                                tREFI = (val_rfp >> 16) & 0xFFFF;
                                            }

                                            uint32_t val_misc = pci_read32(b, d, f, reg + 12);
                                            if (val_misc != 0 && val_misc != 0xFFFFFFFF) {
                                                tFAW = val_misc & 0x7F;
                                                tWR = (val_misc >> 8) & 0x3F;
                                                tWTR_S = (val_misc >> 16) & 0x1F;
                                                tWTR_L = (val_misc >> 24) & 0x1F;
                                            }
                                        }
                                    }
                                }

                                imc_count++;
                            }
                        }
                    }
                }
            }
        }
    }

    printf(COLOR_YELLOW COLOR_BOLD " [ ACTIVE HARDWARE TIMINGS (IMC REGISTER DECODE) ]\n" COLOR_RESET);
    if (decoded) {
        printf(COLOR_DARK "  Source: B%d:D%d:F%d\n" COLOR_RESET, hw_b, hw_d, hw_f);
        printf("  tCL   tRCD   tRP   tRAS   tCWL   tRC   tRFC   tFAW   tWR   tRRD_S/L\n  ");
        printf(COLOR_GREEN COLOR_BOLD "%-5u %-6u %-5u %-6u %-6u %-5u %-6u %-6u %-5u %u/%u\n" COLOR_RESET,
               tCL, tRCD, tRP, tRAS, tCWL, tRC, tRFC, tFAW, tWR, tRRD_S, tRRD_L);
        printf("  tREFI: " COLOR_WHITE "%u" COLOR_RESET "  tWTR_S/L: " COLOR_WHITE "%u/%u\n" COLOR_RESET, tREFI, tWTR_S, tWTR_L);
    } else {
        printf(COLOR_RED "  [!] IMC register timing block not detected on scanned PCI buses.\n" COLOR_RESET);
    }
    printf("\n");

    printf(COLOR_YELLOW COLOR_BOLD " [ DETECTED PCI MEMORY CONTROLLERS ]\n" COLOR_RESET);
    printf(COLOR_CYAN "  Device          DevID    Reg00 (ID)   Reg08 (Class)\n" COLOR_RESET);
    printf("  ------------------------------------------------------------\n");
    for (int i = 0; i < imc_count; i++) {
        printf("  B%02d:D%02d:F%02d     0x%04X   0x%08X   0x%08X\n",
               imcs[i].bus, imcs[i].dev, imcs[i].func, imcs[i].dev_id,
               imcs[i].reg[0], imcs[i].reg[2]);
    }
    printf("\n");

    return 0;
}
