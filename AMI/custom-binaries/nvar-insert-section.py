#!/usr/bin/env python3
"""Insert a patched AMI "NVRAM external defaults" RAW section into a ROM.

Wraps UEFIReplace to swap the AF516361 RAW section (type 0x19) in a copy of
the ROM with the given blob. The input blob must be the RAW section *body*
(exactly what nvar-extract-section.py wrote), so it is passed in --no-asis
mode: UEFIReplace rebuilds the RAW section header and replaces the payload in
place. --validate re-extracts the section from the output ROM and confirms the
edits are present.

Note --asis is deliberately NOT used: it makes UEFIReplace treat the file as a
complete section and corrupts the NVAR blob.
"""

import argparse
import shutil
import subprocess
import sys

from pathlib import Path

GUID = "AF516361-B4C5-436E-A7E3-A149A31B1461"
SECTION = "0x19"
DEFAULT_TOOL = Path("SOFTWARE/UEFITool_0.28.0/UEFIReplace")
NVAR_GUID_FFS = bytes.fromhex("616351AFC5B46E43A7E3A149A31B1461")
NVAR_MAGIC = b"NVAR"


def find_blob(rom: bytes):
    """Return (blob_off, blob_size) of the AF516361 RAW payload, else None."""
    for m in range(len(rom)):
        if not rom.startswith(NVAR_GUID_FFS, m):
            continue
        if rom[m + 0x12] != 0x02:
            continue
        body = m + 0x18
        if body + 4 > len(rom) or rom[body + 3] != 0x19:
            continue
        sec_size = int.from_bytes(rom[body:body + 3], "little")
        if sec_size < 4 or body + sec_size > len(rom):
            continue
        blob = body + 4
        if rom[blob:blob + 4] != NVAR_MAGIC:
            continue
        return blob, sec_size - 4
    return None


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--rom", required=True, help="input BIOS ROM file")
    p.add_argument("--blob", required=True, help="patched RAW payload file")
    p.add_argument("--out", required=True, help="output BIOS ROM file")
    p.add_argument("--uefireplace", type=Path, default=DEFAULT_TOOL,
                   help="path to UEFIReplace (default within repo SOFTWARE)")
    p.add_argument("--validate", action="store_true",
                   help="re-extract and verify the section was injected")
    args = p.parse_args()

    shutil.copyfile(args.rom, args.out)
    cmd = [str(args.uefireplace), str(args.out), GUID, SECTION, args.blob,
           "-o", str(args.out)]
    print("+", " ".join(cmd))
    result = subprocess.run(cmd)
    if result.returncode not in (0, 41):
        sys.exit(result.returncode)

    if args.validate:
        base = Path(args.rom).read_bytes()
        out = Path(args.out).read_bytes()
        b = find_blob(out)
        if b is None:
            print("validate: section not found in output ROM", file=sys.stderr)
            sys.exit(1)
        off, size = b
        base_blob = find_blob(base)
        same_size = base_blob is not None and base_blob[1] == size
        with open(args.blob, "rb") as f:
            patched = f.read()
        print(f"validate: section @SPI 0x{off:x} size 0x{size:x} "
              f"{'(same size)' if same_size else '(SIZE CHANGED)'}")
        print(f"validate: injected payload "
              f"{'matches patched blob' if out[off:off + size] == patched else 'DIFFERS from patched blob'}")


if __name__ == "__main__":
    main()
