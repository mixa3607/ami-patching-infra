#!/usr/bin/env python3
"""AMI Aptio "NVRAM external defaults" editor (dump / patch).

On a CMOS clear the AMI variable service rebuilds the setup NVRAM variables
from the "external defaults" Freeform file in the PEI volume (GUID
AF516361-B4C5-436E-A7E3-A149A31B1461), NOT from the AMITSESetupData
"setupdata" blob. Patching this file is what actually changes the factory
defaults.

NVAR entry format (reverse-engineered from NvramPei/NvramSmm, cross-checked
against live variable values read from the running board):

  +0x00  "NVAR"                       4-byte ASCII signature
  +0x04  UINT16 LE  total entry size   distance to the next entry, i.e.
                                       header + name + data (0x3568 for the
                                       "StdDefaults" container)
  +0x06  UINT8 0xFF                   24-bit "link" field (0xFFFFFF = no link)
  +0x07  UINT8 0xFF
  +0x08  UINT8 0xFF
  +0x09  UINT8 attributes             0x82 = NV + ASCII name + valid,
                                       0x83 = same but UEFI-defined variable
                                       (PlatformLang/Timeout). High bit set
                                       means ASCII name; bit0 = "DataOnly".
  +0x0A  UINT8 slot/index             0-based sequence within the owning
                                       form-set; resets for the "native"
                                       variables (StdDefaults, Setup,
                                       UsbSupport, IntelSetup are all 0).
                                       Not needed to locate data.
  +0x0B  CHAR8 name[]                 null-terminated ASCII variable name
  ...    data[]                       variable data, starts right after the
                                       name's NUL terminator; length =
                                       total_size - (0x0B + len(name) + 1)

Layout of the file's raw section (0x3588 bytes):
  - "StdDefaults" entry (the container). Its data starts at blob+0x17 and is
    0x3551 bytes: it holds every per-variable NVAR entry (Setup, ServerSetup,
    SocketMemoryConfig, ...) followed by a 16-byte aligned GUID store.
  - After the container: a short tail (0x20 bytes: an empty GUID slot and the
    StdDefaults variable GUID 4599D26F-1A11-49B8-B91F-858745CFF824).

Commands:
  dump  --rom FILE [--offsets 0xC8,0x19,0x01]
        List every variable in the blob (name, data size, SPI offset) and
        optionally the byte values at the given data offsets (verification).

  patch --rom FILE --out FILE --set SocketMemoryConfig:0xC8=0x00[,Name:OFF=BYTE...]
        Apply byte changes to the NVAR data in place (same ROM size, no FFS
        rebuild). Validates each variable name and offset, errors otherwise.

The file is located by scanning the ROM for the FFS file GUID
AF516361-B4C5-436E-A7E3-A149A31B1461 in little-endian byte layout and
validating the surrounding FFS header (Freeform type 0x02, RAW section that
starts with "NVAR"), so it is not position-locked.
"""

import argparse
import re
import sys

PROG = "nvar-defaults-editor"

# AF516361-B4C5-436E-A7E3-A149A31B1461, FFS little-endian byte layout
NVAR_FILE_GUID_FFS = bytes.fromhex("616351AFC5B46E43A7E3A149A31B1461")
NVAR_MAGIC = b"NVAR"

# Known location of the FFS file header in the stock IMB760 image; used as a
# fallback if the GUID scan somehow finds nothing.
FALLBACK_FILE_OFF = 0x1DD9CF8


def fail(msg):
    print(f"{PROG}: {msg}", file=sys.stderr)
    sys.exit(1)


class NvarEntry:
    """One NVAR entry resolved to absolute ROM coordinates."""

    __slots__ = ("name", "blob_off", "abs_off", "header_size",
                 "total_size", "data_off", "abs_data", "data_size",
                 "container")

    def __init__(self, name, blob_off, abs_off, header_size, total_size,
                 data_size, container):
        self.name = name
        self.blob_off = blob_off        # offset inside the NVAR blob
        self.abs_off = abs_off          # absolute SPI offset of the entry
        self.header_size = header_size  # "NVAR"+size+ff3+attr+slot+name+NUL
        self.total_size = total_size    # size field (+0x04), distance to next
        self.data_off = blob_off + header_size
        self.abs_data = abs_off + header_size
        self.data_size = data_size
        self.container = container      # True for the "StdDefaults" wrapper


def find_blob(rom):
    """Locate the AF516361 Freeform file, return (file_off, blob_off, blob_size).

    The FFS file header is 0x18 bytes and starts with the file GUID. The file
    body is a single RAW section (type 0x19); the NVAR blob is the section
    payload (after the 4-byte section header).
    """
    candidates = [m.start() for m in re.finditer(re.escape(NVAR_FILE_GUID_FFS), rom)]
    for m in candidates:
        if m + 0x18 + 4 + 4 > len(rom):
            continue
        # FFS header at m: type at +0x12, size (24-bit LE) at +0x14
        if rom[m + 0x12] != 0x02:                 # Freeform
            continue
        file_size = int.from_bytes(rom[m + 0x14:m + 0x17], "little")
        if file_size < 0x1C or m + file_size > len(rom):
            continue
        # body at m+0x18: 4-byte section header (3-byte size LE + type)
        body = m + 0x18
        if rom[body + 3] != 0x19:                 # RAW section
            continue
        sec_size = int.from_bytes(rom[body:body + 3], "little")
        if sec_size < 4 or body + sec_size > len(rom):
            continue
        blob_off = body + 4
        if rom[blob_off:blob_off + 4] != NVAR_MAGIC:
            continue
        blob_size = sec_size - 4
        return (m, blob_off, blob_size)
    # fallback to the known stock offset (still validated)
    m = FALLBACK_FILE_OFF
    if m + 0x18 + 4 + 4 <= len(rom):
        blob_off = m + 0x18 + 4
        if rom[blob_off:blob_off + 4] == NVAR_MAGIC:
            sec_size = int.from_bytes(rom[m + 0x18:m + 0x18 + 3], "little")
            return (m, blob_off, sec_size - 4)
    fail("AF516361 external-defaults blob not found (GUID scan failed)")


def _is_valid(blob, pos, end):
    if pos + 0x1C > end or blob[pos:pos + 4] != NVAR_MAGIC:
        return False
    sz = int.from_bytes(blob[pos + 4:pos + 6], "little")
    if sz == 0xFFFF or sz <= 0x0A:
        return False
    if blob[pos + 9] == 0xFF:      # attributes byte
        return False
    if pos + sz > end:
        return False
    return True


def _walk_region(blob, start, end, abs_base, container=False):
    """Walk contiguous NVAR entries in blob[start:end) by size field."""
    out = []
    pos = start
    while _is_valid(blob, pos, end):
        total = int.from_bytes(blob[pos + 4:pos + 6], "little")
        name_end = blob.find(b"\x00", pos + 0x0B)
        if name_end < 0 or name_end - (pos + 0x0B) > 64:
            break
        name = blob[pos + 0x0B:name_end].decode("ascii", "replace")
        header = name_end + 1 - pos
        data_size = total - header
        if data_size < 0:
            break
        out.append(NvarEntry(name, pos, abs_base + pos, header, total,
                             data_size, container))
        pos += total
    return out


def parse_blob(rom, blob_off, blob_size):
    """Parse the NVAR blob; recurses into the StdDefaults container.

    The per-variable entries physically live inside the StdDefaults entry's
    data (StdDefaults is the whole-defaults variable); the firmware walks them
    as a nested list, so we do the same.
    """
    blob = rom[blob_off:blob_off + blob_size]
    entries = _walk_region(blob, 0, blob_size, blob_off)
    nested = []
    for e in entries:
        if e.name == "StdDefaults":
            data_end = e.blob_off + e.total_size
            nested = _walk_region(blob, e.data_off, data_end, blob_off)
    return entries + nested


def find_var(entries, name):
    """Return the entry for a variable name; None if missing/ambiguous."""
    matches = [e for e in entries if e.name == name]
    if len(matches) == 0:
        fail(f"variable '{name}' not found in the defaults blob "
             f"({len(entries) - 1} variables)")
    if len(matches) > 1:
        fail(f"ambiguous variable name '{name}': {len(matches)} entries match "
             f"(duplicate names are stored twice in this blob)")
    return matches[0]


def parse_hex_list(text):
    out = []
    for tok in text.split(","):
        tok = tok.strip()
        if not tok:
            continue
        try:
            out.append(int(tok, 16))
        except ValueError:
            fail(f"not a hex offset: {tok!r}")
    return out


def cmd_dump(args):
    rom = open(args.rom, "rb").read()
    file_off, blob_off, blob_size = find_blob(rom)
    entries = parse_blob(rom, blob_off, blob_size)
    offsets = parse_hex_list(args.offsets) if args.offsets else []

    print(f"AF516361 NVRAM external defaults")
    print(f"  file header : SPI 0x{file_off:x}, size 0x{int.from_bytes(rom[file_off + 0x14:file_off + 0x17], 'little'):x}")
    print(f"  NVAR blob   : SPI 0x{blob_off:x}, size 0x{blob_size:x} ({blob_size})")
    print(f"  variables   : {len(entries) - 1} (+ 1 'StdDefaults' container)\n")

    hdr = f"{'name':<28} {'data size':>14} {'data @SPI':>11}  "
    hdr += " ".join(f"[0x{o:x}]" for o in offsets)
    print(hdr)
    print("-" * len(hdr))
    for e in entries:
        tag = "  (container)" if e.container else ""
        line = f"{e.name:<28} 0x{e.data_size:04x} ({e.data_size:>5}) {e.abs_data:#10x}{tag}"
        if offsets:
            cells = []
            for o in offsets:
                if 0 <= o < e.data_size:
                    cells.append(f"{rom[e.abs_data + o]:#04x}")
                else:
                    cells.append("  --")
            line += "   " + " ".join(f"     {c}" for c in cells)
        print(line)


def cmd_patch(args):
    rom = bytearray(open(args.rom, "rb").read())
    file_off, blob_off, blob_size = find_blob(rom)
    entries = parse_blob(rom, blob_off, blob_size)

    edits = []  # (abs_spi, name, off, old, new)
    for spec in args.set.split(","):
        spec = spec.strip()
        if not spec:
            continue
        if "=" not in spec:
            fail(f"expected NAME:OFFSET=BYTE, got {spec!r}")
        lhs, rhs = spec.split("=", 1)
        if ":" not in lhs:
            fail(f"expected NAME:OFFSET=BYTE, got {spec!r}")
        name, off_str = lhs.rsplit(":", 1)
        try:
            off = int(off_str, 16)
        except ValueError:
            fail(f"offset {off_str!r} in {spec!r} is not hex")
        try:
            new = int(rhs, 16)
        except ValueError:
            fail(f"byte value {rhs!r} in {spec!r} is not hex")
        if not (0 <= new <= 0xFF):
            fail(f"byte value {rhs!r} out of range in {spec!r}")
        e = find_var(entries, name)
        if not (0 <= off < e.data_size):
            fail(f"offset 0x{off:x} is outside {name} data (size 0x{e.data_size:x})")
        abs_spi = e.abs_data + off
        edits.append((abs_spi, name, off, rom[abs_spi], new))

    if not edits:
        fail("no edits parsed from --set")

    for abs_spi, name, off, old, new in edits:
        rom[abs_spi] = new

    with open(args.out, "wb") as f:
        f.write(rom)

    print(f"{args.out} ({len(edits)} byte change(s), ROM size {len(rom)})")
    for abs_spi, name, off, old, new in edits:
        print(f"  {name} data[0x{off:x}]: SPI 0x{abs_spi:x}  {old:#04x} -> {new:#04x}")


def main():
    p = argparse.ArgumentParser(
        prog=PROG,
        description="Dump / patch the AMI Aptio 'NVRAM external defaults' "
                    "(AF516361-B4C5-436E-A7E3-A149A31B1461) in a BIOS ROM.",
    )
    sub = p.add_subparsers(dest="cmd", metavar="COMMAND", required=True)

    d = sub.add_parser("dump", help="list every variable in the defaults blob")
    d.add_argument("--rom", required=True, help="input ROM file")
    d.add_argument("--offsets", default=None,
                   help="comma-separated hex offsets to print per variable, "
                        "e.g. 0xC8,0x19,0x01")
    d.set_defaults(func=cmd_dump)

    pt = sub.add_parser("patch", help="apply byte changes to the defaults blob")
    pt.add_argument("--rom", required=True, help="input ROM file")
    pt.add_argument("--out", required=True, help="output ROM file (same size)")
    pt.add_argument("--set", required=True,
                    help="NAME:OFFSET=BYTE[,NAME:OFFSET=BYTE...], e.g. "
                         "SocketMemoryConfig:0xC8=0x00,ServerSetup:0x19=0x03")
    pt.set_defaults(func=cmd_patch)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
