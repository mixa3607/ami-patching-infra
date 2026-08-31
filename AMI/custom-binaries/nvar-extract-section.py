#!/usr/bin/env python3
"""Extract the AMI "NVRAM external defaults" RAW section from a BIOS ROM.

Finds the AF516361-B4C5-436E-A7E3-A149A31B1461 Freeform FFS file, validates
the Freeform (0x02) + RAW (0x19) headers and that the payload starts with
"NVAR", then writes the raw unnamed payload to --out. The blob is exactly the
bytes that UEFIReplace injects back (the RAW section body, without the 4-byte
section header), so it pairs with nvar-insert-section.py.

This is read-only and does not touch the ROM.
"""

import argparse
import sys

NVAR_GUID_FFS = bytes.fromhex("616351AFC5B46E43A7E3A149A31B1461")
NVAR_MAGIC = b"NVAR"
FALLBACK_BLOB_BASE = 0x1DD9D14   # known stock IMB760 blob offset (validated anyway)


def find_blob(rom: bytes):
    """Return (blob_off, blob_size) of the AF516361 RAW payload, else None."""
    candidates = [m for m in range(len(rom)) if rom.startswith(NVAR_GUID_FFS, m)]
    for m in candidates:
        if rom[m + 0x12] != 0x02:                      # Freeform ffs
            continue
        body = m + 0x18
        if body + 4 > len(rom) or rom[body + 3] != 0x19:   # RAW section
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
    p.add_argument("--out", required=True, help="output RAW payload file")
    args = p.parse_args()

    rom = open(args.rom, "rb").read()
    blob = find_blob(rom)
    if blob is None:
        print("AF516361 external-defaults blob not found", file=sys.stderr)
        sys.exit(1)
    blob_off, blob_size = blob

    payload = rom[blob_off:blob_off + blob_size]
    with open(args.out, "wb") as f:
        f.write(payload)

    print(f"blob @SPI 0x{blob_off:x}  size 0x{blob_size:x} ({blob_size})")
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
