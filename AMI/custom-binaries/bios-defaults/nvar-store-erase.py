#!/usr/bin/env python3
"""Erase the populated NVAR variable store out of a BIOS ROM.

The flashed image ships with a filled-in variable store (two mirrored banks).
The firmware reads the live setup variables straight from this store; the
external-defaults / setupdata / IFR sources are only consulted when a variable
is MISSING. Blanking the whole store makes every variable missing, so on the
next boot the variable service rebuilds the store from the patched
external-defaults blob (AF516361-B4C5-436E-A7E3-A149A31B1461), which is what
actually changes the defaults.

Consequences to be aware of:
  - StdDefaults inside the rebuilt store comes from the same blob, so F9 /
    CMOS-clear also restore the patched values.
  - Anything not covered by the external defaults (BootOrder/Boot####,
    DriverOrder, SMBIOS entry points, runtime counters, ...) is recreated from
    its default on first boot. Boot order may reset. Fine for a test board.

The store is located structurally (not by hardcoded offsets): we scan for
EFI_FIRMWARE_FILE_SYSTEM2 FVs (_FVH + the standard FFS GUID) whose body starts
with an AMI "NVAR" entry chain right after the FV header (+0x90). Exactly two
such FVs are expected (the mirrored banks); their full span is erased so the
Fault-Tolerant-Write scratch/spare inside the region goes too.

Usage: nvar-store-erase.py IN.rom OUT.rom [--keep-headers]
  --keep-headers: keep each bank's 72-byte FV header (valid empty FV) and only
                  blank the body. By default the entire region is erased.
"""

import argparse
import re
import sys

PROG = "nvar-store-erase"

# EFI_FIRMWARE_FILE_SYSTEM2_GUID 8C8CE578-8A3D-4F1C-9935-896185C32DD3 in the
# little-endian byte layout stored in the FV header (+0x10).
FFS2_GUID = bytes.fromhex("78e58c8c3d8a1c4f9935896185c32dd3")
FV_SIGNATURE = b"_FVH"
NVAR_MAGIC = b"NVAR"
FV_HEADER_LEN = 0x48      # header + first file GUID region; NVAR chain at +0x90


def fail(msg):
    print(f"{PROG}: {msg}", file=sys.stderr)
    sys.exit(1)


def is_varstore(rom, fv_off):
    """True if fv_off starts an AMI NVAR store bank (mirrored varstore FV)."""
    if fv_off + 0x40 > len(rom):
        return False
    if rom[fv_off + 0x28:fv_off + 0x2C] != FV_SIGNATURE:
        return False
    if rom[fv_off + 0x10:fv_off + 0x20] != FFS2_GUID:
        return False
    fv_len = int.from_bytes(rom[fv_off + 0x20:fv_off + 0x28], "little")
    if not (0x1000 <= fv_len <= 0x1000000):
        return False
    if fv_off + fv_len > len(rom):
        return False
    # AMI varstore: "NVAR" entry chain starts at fv_off + 0x90, right after the
    # FV header. Validate the size-field chain a few hops to avoid false hits
    # inside the main BIOS FVs (which contain the AF516361 blob with "NVAR").
    pos = fv_off + 0x90
    for _ in range(4):
        if pos + 0x1C > fv_off + fv_len or rom[pos:pos + 4] != NVAR_MAGIC:
            return False
        size = int.from_bytes(rom[pos + 4:pos + 6], "little")
        if size == 0xFFFF or size < 0x0B:
            return False
        if rom[pos + 9] == 0xFF:
            return False
        pos += size
    return True


def find_banks(rom):
    """Return sorted [(offset, fv_len), ...] of the NVAR store banks."""
    banks = []
    for m in re.finditer(re.escape(FV_SIGNATURE), rom):
        off = m.start() - 0x28
        if off >= 0 and is_varstore(rom, off):
            fv_len = int.from_bytes(rom[off + 0x20:off + 0x28], "little")
            banks.append((off, fv_len))
    return sorted(banks)


def main():
    p = argparse.ArgumentParser(
        prog=PROG,
        description="Blank the AMI NVAR variable store out of a BIOS ROM so "
                    "the patched external defaults (AF516361) become effective.")
    p.add_argument("rom_in", help="input ROM file")
    p.add_argument("rom_out", help="output ROM file (same size)")
    p.add_argument("--keep-headers", action="store_true",
                   help="keep each bank's FV header, blank only the body")
    args = p.parse_args()

    rom = bytearray(open(args.rom_in, "rb").read())
    banks = find_banks(rom)

    if len(banks) != 2:
        fail(f"expected exactly 2 NVAR store banks, found {len(banks)} "
             f"({', '.join(hex(o) for o, _ in banks) or 'none'}) - aborting, "
             f"refusing to guess on a changed layout")
    (off0, len0), (off1, len1) = banks
    if off0 + len0 != off1:
        fail(f"store banks are not contiguous: bank0 ends at "
             f"{off0 + len0:#x}, bank1 starts at {off1:#x}")

    span_start = off0
    span_end = off1 + len1

    if args.keep_headers:
        # blank each bank's body (after the FV header); keep the 0x48-byte
        # headers so the region still looks like a (valid, empty) store FV.
        for off, fv_len in banks:
            body_start = off + FV_HEADER_LEN
            rom[body_start:off + fv_len] = b"\xFF" * (off + fv_len - body_start)
        mode = f"bodies only (headers kept)"
    else:
        rom[span_start:span_end] = b"\xFF" * (span_end - span_start)
        mode = "full span"

    with open(args.rom_out, "wb") as f:
        f.write(rom)

    print(f"{args.rom_out} ({len(rom)} bytes, mode: {mode})")
    print(f"  bank0 : {span_start:#x} .. {span_start + len0:#x}  (FvLength 0x{len0:x})")
    print(f"  bank1 : {off1:#x} .. {span_end:#x}  (FvLength 0x{len1:x})")
    print(f"  span  : {span_start:#x} .. {span_end:#x}  ({span_end - span_start} bytes)")

    # sanity: nothing left of the old store inside the span (in keep-headers
    # mode the 72-byte FV headers stay, so exempt those)
    exempt = []
    if args.keep_headers:
        for off, _ in banks:
            exempt.append((off, off + FV_HEADER_LEN))
    remaining = []
    for i in range(span_start, span_end):
        if any(a <= i < b for a, b in exempt):
            continue
        if rom[i] != 0xFF:
            remaining.append(i)
            if len(remaining) > 16:
                break
    if remaining:
        fail(f"{len(remaining)}+ non-0xFF bytes left in the store span "
             f"(first at {remaining[0]:#x}) - aborting")


if __name__ == "__main__":
    main()
