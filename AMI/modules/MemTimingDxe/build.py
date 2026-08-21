#!/usr/bin/env python3
import subprocess, sys, os

def build():
    dir_path = os.path.dirname(os.path.abspath(__file__))
    os.chdir(dir_path)
    
    cmd_cc = [
        "clang",
        "-target", "x86_64-unknown-windows",
        "-ffreestanding",
        "-fno-stack-protector",
        "-fshort-wchar",
        "-mno-red-zone",
        "-Wall",
        "-Wextra",
        "-O2",
        "-I.",
        "-c", "MemTimingDxe.c",
        "-o", "MemTimingDxe.obj"
    ]
    print("Running:", " ".join(cmd_cc))
    res = subprocess.run(cmd_cc, capture_output=True, text=True)
    if res.returncode != 0:
        print("Compilation FAILED:\n", res.stderr)
        sys.exit(1)
    print("Compilation successful.")

    cmd_link = [
        "lld-link",
        "-subsystem:efi_boot_service_driver",
        "-entry:MemTimingDxeEntry",
        "-nodefaultlib",
        "-safeseh:no",
        "-out:MemTimingDxe.efi",
        "MemTimingDxe.obj"
    ]
    print("Running:", " ".join(cmd_link))
    res = subprocess.run(cmd_link, capture_output=True, text=True)
    if res.returncode != 0:
        print("Linking FAILED:\n", res.stderr)
        sys.exit(1)
    print("Linking successful. Output: MemTimingDxe.efi")

    # Pack FFS
    cmd_pack = [sys.executable, "pack_ffs.py", "MemTimingDxe.efi", "MemTimingDxe.ffs"]
    print("Running:", " ".join(cmd_pack))
    res = subprocess.run(cmd_pack, capture_output=True, text=True)
    if res.returncode != 0:
        print("FFS Packing FAILED:\n", res.stderr)
        sys.exit(1)
    print("FFS Packing successful. Output: MemTimingDxe.ffs")

if __name__ == "__main__":
    build()
