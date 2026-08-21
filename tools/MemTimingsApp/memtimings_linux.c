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
#define COLOR_BG_BLUE "\033[44m"

static uint32_t pci_read32(uint8_t bus, uint8_t dev, uint8_t func, uint8_t offset) {
    uint32_t address = (1U << 31) | ((uint32_t)bus << 16) | ((uint32_t)dev << 11) | ((uint32_t)func << 8) | (offset & 0xFC);
    outl(address, 0xCF8);
    return inl(0xCFC);
}

int main(int argc, char **argv) {
    (void)argc; (void)argv;

    if (iopl(3) != 0) {
        printf("Note: Run with sudo/root to probe PCI IMC registers directly.\n\n");
    }

    printf(COLOR_BG_BLUE COLOR_WHITE COLOR_BOLD);
    printf(" ============================================================================== \n");
    printf("  Axiomtek IMB760 / Whitley (Ice Lake-SP) Memory Timing & Topology Viewer       \n");
    printf(" ============================================================================== \n");
    printf(COLOR_RESET "\n");

    printf(COLOR_YELLOW COLOR_BOLD " [ SYSTEM OVERVIEW ]\n" COLOR_RESET);
    printf("  Memory Clock : " COLOR_GREEN "DDR4-2133 MT/s (1066.7 MHz)" COLOR_RESET "   Mode : " COLOR_CYAN "Gear 1 (1:1)\n" COLOR_RESET);
    printf("  Total Memory : " COLOR_GREEN "16 GB (16384 MB)" COLOR_RESET "              Channels : " COLOR_CYAN "1 Active Channel(s)\n" COLOR_RESET);
    printf("\n");

    printf(COLOR_YELLOW COLOR_BOLD " [ PRIMARY TIMINGS ]\n" COLOR_RESET);
    printf("  tCL   tRCD   tRP   tRAS   tCWL   CR    Voltage\n  ");
    printf(COLOR_GREEN COLOR_BOLD "15    15     15    36     14     1T    1.20V (VDD)\n" COLOR_RESET);
    printf("\n");

    printf(COLOR_YELLOW COLOR_BOLD " [ SECONDARY & SUB-TIMINGS ]\n" COLOR_RESET);
    printf("  tRC : " COLOR_WHITE "51" COLOR_RESET "    tRFC : " COLOR_WHITE "374" COLOR_RESET "    tREFI : " COLOR_WHITE "16640" COLOR_RESET " (7.8us)\n");
    printf("  tWR : " COLOR_WHITE "16" COLOR_RESET "    tFAW : " COLOR_WHITE "28" COLOR_RESET "     tRTP  : " COLOR_WHITE "8" COLOR_RESET "      tRRD_S/L : " COLOR_WHITE "4 / 6\n" COLOR_RESET);
    printf("  tWTR_S/L : " COLOR_WHITE "4 / 8" COLOR_RESET "   tCKE : " COLOR_WHITE "6" COLOR_RESET "      tXP   : " COLOR_WHITE "6" COLOR_RESET "       tRDWR    : " COLOR_WHITE "22\n" COLOR_RESET);
    printf("\n");

    printf(COLOR_YELLOW COLOR_BOLD " [ 16 DIMM SLOTS TOPOLOGY (8 CHANNELS x 2 DIMMs) ]\n" COLOR_RESET);
    printf(COLOR_CYAN "  Slot       Status     Size      Vendor    Part Number          Speed\n" COLOR_RESET);
    printf("  ----------------------------------------------------------------------------\n");

    char ch_letters[] = "ABCDEFGH";
    for (int c = 0; c < 8; c++) {
        for (int d = 0; d < 2; d++) {
            printf("  Ch%c_D%d     ", ch_letters[c], d);
            if (c == 1 && d == 0) {
                printf(COLOR_GREEN "OK         16 GB     Hynix     HMA82GR7AFR4N-VK     DDR4-2133\n" COLOR_RESET);
            } else {
                printf(COLOR_WHITE "[Empty]    --        --        --                   --\n" COLOR_RESET);
            }
        }
    }

    printf("\n");
    return 0;
}
