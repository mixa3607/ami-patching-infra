#!/usr/bin/env python3
import glob
import struct
import subprocess

def main():
    print("=" * 70)
    print(" Axiomtek IMB760 (Intel Ice Lake-SP) Real Hardware Timings Decoder")
    print("=" * 70)

    # Read SMBIOS for configured speed & populated DIMMs
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
            elif k == "Manufacturer": current_dimm["vendor"] = v
            elif k == "Part Number": current_dimm["part"] = v
            elif k == "Speed": current_dimm["speed"] = v
            elif k == "Configured Memory Speed": current_dimm["conf_speed"] = v
    if current_dimm.get("size") and "No Module" not in current_dimm.get("size", ""):
        dimms.append(current_dimm)

    print("\n[ Populated DIMMs ]")
    for d in dimms:
        print(f"  {d.get('locator', 'DIMM')}: {d.get('size')} {d.get('vendor')} {d.get('part')} ({d.get('conf_speed', d.get('speed'))})")

    # Read IMC Channel registers from ff:1e.0 .. ff:1e.7
    print("\n[ Channel B Timing Registers (ff:1e.1) ]")
    try:
        with open("/sys/bus/pci/devices/0000:ff:1e.1/config", "rb") as f:
            cfg = f.read()
        
        trrd_l = cfg[0x8F]
        trtp = cfg[0x98]
        twr = cfg[0xB8]
        trfc = struct.unpack_from("<H", cfg, 0xD8)[0]
        tcwl = cfg[0xDC]

        print(f"  tCWL   : {tcwl}")
        print(f"  tRRD_L : {trrd_l}")
        print(f"  tRTP   : {trtp}")
        print(f"  tWR    : {twr}")
        print(f"  tRFC   : {trfc} cycles")
    except Exception as e:
        print(f"  Error reading ff:1e.1: {e}")

    print("=" * 70)

if __name__ == "__main__":
    main()
