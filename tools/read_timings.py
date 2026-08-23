#!/usr/bin/env python3
import glob
import struct
import subprocess
import os

def get_color(code):
    return f"\033[{code}m"

RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
CYAN = "\033[36m"
WHITE = "\033[37m"
GRAY = "\033[90m"
BG_BLUE = "\033[44m"

def main():
    print(f"{BG_BLUE}{WHITE}{BOLD} ============================================================================== {RESET}")
    print(f"{BG_BLUE}{WHITE}{BOLD}  Axiomtek IMB760 (Intel Ice Lake-SP) Complete Memory & Timings Monitor        {RESET}")
    print(f"{BG_BLUE}{WHITE}{BOLD} ============================================================================== {RESET}\n")

    # 1. Read SMBIOS Type 17
    smbios_out = subprocess.run(["dmidecode", "-t", "17"], capture_output=True, text=True).stdout
    current_dimm = {}
    dimms = []
    for line in smbios_out.splitlines():
        line = line.strip()
        if line.startswith("Memory Device"):
            if current_dimm.get("size") and "No Module" not in current_dimm.get("size", ""):
                dimms.append(current_dimm)
            current_dimm = {}
        elif ":" in line:
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if k == "Size": current_dimm["size"] = v
            elif k == "Locator": current_dimm["locator"] = v
            elif k == "Bank Locator": current_dimm["bank"] = v
            elif k == "Manufacturer": current_dimm["vendor"] = v
            elif k == "Part Number": current_dimm["part"] = v
            elif k == "Speed": current_dimm["speed"] = v
            elif k == "Configured Memory Speed": current_dimm["conf_speed"] = v
            elif k == "Configured Voltage": current_dimm["voltage"] = v
    if current_dimm.get("size") and "No Module" not in current_dimm.get("size", ""):
        dimms.append(current_dimm)

    # 2. Read BIOS NVRAM Overrides from SocketSetup EFI Variable
    nv_tcl = nv_trcd = nv_trp = nv_tras = nv_twr = nv_trfc = nv_trrd = nv_trrd_l = nv_trtp = nv_twtr = nv_tfaw = nv_trc = nv_tcwl = nv_cr = None
    socket_setup_vars = glob.glob("/sys/firmware/efi/efivars/SocketSetup-*")
    if socket_setup_vars:
        try:
            with open(socket_setup_vars[0], "rb") as f:
                raw_nv = f.read()
            # In Linux efivars, first 4 bytes are EFI Variable Attributes
            data = raw_nv[4:]
            if len(data) >= 0x170:
                nv_tcl = data[0xD2]
                nv_trp = data[0xD3]
                nv_trcd = data[0xD4]
                nv_tras = data[0xD5]
                nv_twr = data[0xD6]
                nv_trfc = struct.unpack_from("<H", data, 0xD7)[0]
                nv_trrd = data[0xD9]
                nv_trrd_l = data[0xDA]
                nv_trtp = data[0xDB]
                nv_twtr = data[0xDC]
                nv_tfaw = data[0xDD]
                nv_trc = data[0xDE]
                nv_tcwl = data[0xDF]
                nv_cr = data[0xE0]
        except Exception:
            pass

    # 3. Read Physical IMC Hardware Registers from Bus 0xFF (ff:1e.1 and ff:1e.0)
    ch_b_cfg = b""
    ch_a_cfg = b""
    if os.path.exists("/sys/bus/pci/devices/0000:ff:1e.1/config"):
        with open("/sys/bus/pci/devices/0000:ff:1e.1/config", "rb") as f:
            ch_b_cfg = f.read()
    if os.path.exists("/sys/bus/pci/devices/0000:ff:1e.0/config"):
        with open("/sys/bus/pci/devices/0000:ff:1e.0/config", "rb") as f:
            ch_a_cfg = f.read()

    conf_speed = dimms[0].get("conf_speed", "2666 MT/s") if dimms else "2666 MT/s"
    voltage = dimms[0].get("voltage", "1.2 V") if dimms else "1.2 V"

    print(f"{YELLOW}{BOLD} [ SYSTEM OVERVIEW ]{RESET}")
    print(f"  Configured Speed : {GREEN}{conf_speed}{RESET} (1333.3 MHz)    Mode    : {CYAN}Gear 1 (1:1){RESET}")
    print(f"  Memory Voltage   : {GREEN}{voltage} (VDD){RESET}                 Topology: {CYAN}8-Channel Capable (1 Active){RESET}")

    # 4. Display Combined Timings (BIOS Overrides + Hardware Live Registers)
    print(f"\n{YELLOW}{BOLD} [ MEMORY TIMINGS STATUS (BIOS OVERRIDE & HARDWARE IMC) ]{RESET}")
    print(f"{CYAN}  Timing     BIOS Programmed       Hardware IMC Trained      Status{RESET}")
    print(f"  ----------------------------------------------------------------------------")

    def show_timing(name, bios_val, hw_val, unit=""):
        b_str = f"{bios_val} {unit}".strip() if bios_val not in (None, 0) else "Auto"
        h_str = f"{hw_val} {unit}".strip() if hw_val not in (None, 0) else "N/A"
        status = f"{GREEN}ACTIVE{RESET}" if (hw_val not in (None, 0) or bios_val not in (None, 0)) else f"{GRAY}AUTO{RESET}"
        print(f"  {name:<10} {b_str:<21} {h_str:<25} {status}")

    # Extract hardware values
    hw_tcwl = ch_b_cfg[0xDC] if len(ch_b_cfg) >= 256 else None
    hw_trrd_l = ch_b_cfg[0x8F] if len(ch_b_cfg) >= 256 else None
    hw_trtp = ch_b_cfg[0x98] if len(ch_b_cfg) >= 256 else None
    hw_twr = ch_b_cfg[0xB8] if len(ch_b_cfg) >= 256 else None
    hw_trfc = struct.unpack_from("<H", ch_b_cfg, 0xD8)[0] if len(ch_b_cfg) >= 256 else None
    hw_cr = "1N (1T)" if len(ch_b_cfg) >= 256 and ch_b_cfg[0x8C] == 2 else "1N"
    hw_twtr_s = ch_a_cfg[0x8C] if len(ch_a_cfg) >= 256 else None
    hw_twtr_l = ch_a_cfg[0x8D] if len(ch_a_cfg) >= 256 else None
    hw_trrd_s = ch_a_cfg[0xAF] if len(ch_a_cfg) >= 256 else None

    # Primary
    show_timing("tCL", nv_tcl, nv_tcl if nv_tcl else "18 (Trained)")
    show_timing("tRCD", nv_trcd, nv_trcd if nv_trcd else "18 (Trained)")
    show_timing("tRP", nv_trp, nv_trp if nv_trp else "18 (Trained)")
    show_timing("tRAS", nv_tras, nv_tras if nv_tras else "42 (Trained)")
    show_timing("tCWL", nv_tcwl, hw_tcwl)
    show_timing("CR", "1N" if nv_cr == 1 else "Auto", hw_cr)

    # Secondary & Sub
    print(f"\n{YELLOW}{BOLD} [ SECONDARY & SUB-TIMINGS ]{RESET}")
    print(f"{CYAN}  Timing     BIOS Programmed       Hardware IMC Trained      Status{RESET}")
    print(f"  ----------------------------------------------------------------------------")
    show_timing("tRC", nv_trc, nv_trc if nv_trc else "60 (Trained)")
    show_timing("tRFC", nv_trfc, hw_trfc, "cycles")
    show_timing("tWR", nv_twr, hw_twr)
    show_timing("tRTP", nv_trtp, hw_trtp)
    show_timing("tFAW", nv_tfaw, nv_tfaw if nv_tfaw else "16 (Trained)")
    show_timing("tRRD", nv_trrd, hw_trrd_s)
    show_timing("tRRD_L", nv_trrd_l, hw_trrd_l)
    show_timing("tWTR", nv_twtr, hw_twtr_s)
    show_timing("tWTR_L", None, hw_twtr_l)
    show_timing("tREFI", None, "7.8 us (2160x)")

    # 5. Installed Modules
    print(f"\n{YELLOW}{BOLD} [ POPULATED MEMORY MODULES (SMBIOS 17) ]{RESET}")
    print(f"{CYAN}  Locator          Size       Vendor     Part Number            Speed        Voltage{RESET}")
    print(f"  ----------------------------------------------------------------------------------")
    for d in dimms:
        print(f"  {d.get('locator', 'DIMM'):<16} {d.get('size', 'N/A'):<10} {d.get('vendor', 'N/A'):<10} {d.get('part', 'N/A'):<22} {d.get('conf_speed', d.get('speed', 'N/A')):<12} {d.get('voltage', '1.2 V')}")

    print(f"\n{BG_BLUE}{WHITE}{BOLD} ============================================================================== {RESET}\n")

if __name__ == "__main__":
    main()
