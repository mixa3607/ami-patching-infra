#!/usr/bin/env python3
"""Apply value edits to the AMI "NVRAM external defaults" blob and verify.

Consumes the mapping produced by nvar-map-ifr.py and applies byte changes by
question_id. It writes the patched blob to --out and then re-reads every edit
back to confirm the new value is actually present.

Edits are given as --set question_id=HEXVALUE,question_id=HEXVALUE... The new
value may be any byte string whose length matches the question width (1 or 2
bytes are the common cases).
"""

import argparse
import json
import sys

NVAR_MAGIC = b"NVAR"


def variables(blob: bytes):
    """Return [{name, offset, size}] for every NVAR variable in the payload."""
    out = []
    stack = [(0, len(blob))]
    while stack:
        start, end = stack.pop()
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
                stack.append((data, pos + total))
            pos += total
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--blob", required=True, help="input RAW payload file (unmodified)")
    p.add_argument("--map", required=True, help="mapping JSON from nvar-map-ifr.py")
    p.add_argument("--set", required=True,
                   help="question_id=HEXVALUE,question_id=HEXVALUE...")
    p.add_argument("--out", required=True, help="output patched payload file")
    args = p.parse_args()

    blob = bytearray(open(args.blob, "rb").read())
    lookup = {}
    for v in variables(blob):
        lookup.setdefault(v["name"], []).append(v)

    mapping = json.load(open(args.map))["mappings"]
    by_id = {m["question_id"]: m for m in mapping if m["status"] == "mapped"}

    edits = []
    for spec in args.set.split(","):
        spec = spec.strip()
        if "=" not in spec:
            print(f"expected question_id=HEXVALUE, got {spec!r}", file=sys.stderr)
            sys.exit(1)
        qid, value = spec.split("=", 1)
        qid = int(qid, 0)
        m = by_id.get(qid)
        if m is None:
            print(f"question {qid} is not in the mapped set", file=sys.stderr)
            sys.exit(1)
        new = bytes.fromhex(value)
        width = m["width"] or 1
        if len(new) != width:
            print(f"question {qid}: value {len(new)} bytes != width {width}",
                  file=sys.stderr)
            sys.exit(1)
        off = m["offset"]
        edits.append((qid, m, off, new))

    if not edits:
        print("no edits parsed from --set", file=sys.stderr)
        sys.exit(1)

    for qid, m, off, new in edits:
        old = bytes(blob[off:off + len(new)])
        blob[off:off + len(new)] = new
        print(f"q{qid} {m['varstore']}[0x{m['var_offset']:x}] "
              f"@blob 0x{off:x}  {old.hex().upper():<4} -> {new.hex().upper()}")

    with open(args.out, "wb") as f:
        f.write(blob)

    # verify read-back
    ok = True
    checksum = bytearray(open(args.out, "rb").read())
    for qid, m, off, new in edits:
        got = bytes(checksum[off:off + len(new)])
        if got != new:
            ok = False
            print(f"VERIFY FAIL q{qid}: expected {new.hex().upper()} got "
                  f"{got.hex().upper()}", file=sys.stderr)
    print(f"wrote {args.out}: {'verified' if ok else 'FAILED'}")


if __name__ == "__main__":
    main()
