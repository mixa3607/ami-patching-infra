#!/usr/bin/env python3
"""Map IFR questions onto AMI "NVRAM external defaults" blob offsets.

For every question (Numeric/OneOf/Checkbox/String/...) it resolves the
referenced VarStore name, matches the NVAR variable of the same name in the
AF516361 payload and computes var_offset + var_offset_relative_address.

Read-only: takes --blob (the RAW payload from nvar-extract-section.py) and
--ifr (the UEFI IFR JSON), emits a JSON mapping with status:
  mapped             -> offset within blob + current value
  unmapped_varstore  -> no NVAR variable with that name in defaults
  size_mismatch      -> NVAR variable exists but data size != declared size
  ambiguous_nvar_entry -> several NVAR variables match the name+size
  out_of_range       -> var_offset + width exceeds the variable size
  unsupported_width  -> the question size is not derivable
"""

import argparse
import json

NVAR_MAGIC = b"NVAR"
QUESTION_OPCODES = {"Numeric", "OneOf", "Checkbox", "OrderedList",
                    "String", "Password", "Date", "Time"}


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


def question_width(fields):
    if fields.get("kind") == "string" and isinstance(fields.get("max_size"), int):
        return fields["max_size"] * 2
    range_info = fields.get("min_max_step")
    if isinstance(range_info, dict) and isinstance(range_info.get("size_bits"), int):
        return range_info["size_bits"] // 8
    return 1 if fields.get("kind") == "checkbox" else None


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--blob", required=True, help="input RAW payload file")
    p.add_argument("--ifr", required=True, help="input UEFI IFR JSON")
    p.add_argument("--out", required=True, help="output mapping JSON")
    args = p.parse_args()

    blob = open(args.blob, "rb").read()
    lookup = {}
    for v in variables(blob):
        lookup.setdefault(v["name"], []).append(v)

    doc = json.loads(open(args.ifr).read())
    ops = doc["operations"]
    varstores = {
        op["fields"].get("varstore_id"): op["fields"]
        for op in ops if op["opcode"] in {"VarStore", "VarStoreEfi"}
    }

    mappings = []
    for op in ops:
        if op["opcode"] not in QUESTION_OPCODES:
            continue
        fields = op["fields"]
        store = varstores.get(fields.get("varstore_id"))
        if store is None or "var_offset" not in fields:
            continue
        name = store.get("name")
        width = question_width(fields)
        r = {
            "question_id": fields.get("question_id"),
            "prompt": fields.get("prompt", {}).get("text", ""),
            "opcode": op["opcode"],
            "varstore": name,
            "var_offset": fields["var_offset"],
            "width": width,
        }
        candidates = lookup.get(name, [])
        matching = [e for e in candidates if e["size"] == store.get("size")]
        if not candidates:
            r["status"] = "unmapped_varstore"
        elif not matching:
            r["status"] = "size_mismatch"
        elif len(matching) > 1:
            r["status"] = "ambiguous_nvar_entry"
        elif width is None:
            r["status"] = "unsupported_width"
        elif fields["var_offset"] + width > matching[0]["size"]:
            r["status"] = "out_of_range"
        else:
            off = matching[0]["offset"] + fields["var_offset"]
            r.update({"status": "mapped",
                      "offset": off,
                      "value_hex": blob[off:off + width].hex().upper()})
        mappings.append(r)

    with open(args.out, "w") as f:
        json.dump({"mappings": mappings}, f, indent=2)
        f.write("\n")
    mapped = sum(1 for m in mappings if m["status"] == "mapped")
    print(f"{args.out}: {mapped}/{len(mappings)} questions mapped")


if __name__ == "__main__":
    main()
