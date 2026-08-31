#!/usr/bin/env python3
"""Map AMI "NVRAM external defaults" blob offset for each variable.

Reads the AF516361 RAW payload (the body of the Freeform RAW section) and
returns the absolute blob offset (relative to payload start) and size of the
data of every variable it contains.

A single shared function `variables(payload)` is used by the other tools;
`main()` prints the table.
"""

import argparse
import sys

NVAR_MAGIC = b"NVAR"


def variables(blob: bytes):
    """Return [{name, offset, size}] of every variable in the defaults blob.

    The payload is a chain of "NVAR" entries; the "StdDefaults" entry is a
    container whose own data holds another nested chain of "NVAR" entries.
    Both levels are walked so the returned offsets are payload-absolute.
    """
    out = []
    stack = [(0, len(blob), False)]
    while stack:
        start, end, _nested = stack.pop()
        pos = start
        while pos + 0x1C <= end and blob[pos:pos + 4] == NVAR_MAGIC:
            total = int.from_bytes(blob[pos + 4:pos + 6], "little")
            if total <= 0x0B or pos + total > end or blob[pos + 9] == 0xFF:
                break
            name_end = blob.find(b"\0", pos + 0x0B, pos + total)
            if name_end < 0:
                break
            name = blob[pos + 0x0B:name_end].decode("ascii", "replace")
            data = name_end + 1
            size = pos + total - data
            out.append({"name": name, "offset": data, "size": size})
            if name == "StdDefaults":
                stack.append((data, pos + total, True))
            pos += total
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--blob", required=True, help="input RAW payload file")
    args = p.parse_args()

    blob = open(args.blob, "rb").read()
    table = variables(blob)
    print(f"{'name':<28} {'offset':>10} {'size':>8}")
    print("-" * 48)
    for v in table:
        print(f"{v['name']:<28} 0x{v['offset']:08x} 0x{v['size']:04x}")
    print(f"\n{len(table)} variable(s)")


if __name__ == "__main__":
    main()
