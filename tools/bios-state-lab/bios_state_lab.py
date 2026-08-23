#!/usr/bin/env python3
"""Build an IFR registry and experiment with Linux efivarfs variables."""

import argparse
import base64
import hashlib
import json
import os
import re
import struct
import subprocess
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

EFIVARS = Path("/sys/firmware/efi/efivars")
QUESTION_TYPES = "OneOf|Numeric|Checkbox|String|OrderedList|Date|Time|Action|Ref"
BRIDGE_NAME = "BiosStateLabState"
BRIDGE_GUID = "3f143cec-91e2-4b9a-90f3-ce93556a1d42"
REQUEST_NAME = "BiosStateLabRequest"
RESULT_NAME = "BiosStateLabResult"


def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2, sort_keys=True) + "\n")


def indent(line):
    # IFRExtractor prints indentation after the hexadecimal opcode address.
    body = line.split(":", 1)[1] if ":" in line else line
    body = body.lstrip(" ")
    return len(body) - len(body.lstrip("\t"))


def parse_int(value):
    return int(value, 0)


def match_field(line, name):
    match = re.search(rf"{re.escape(name)}: (0x[0-9A-Fa-f]+|\d+)", line)
    return parse_int(match.group(1)) if match else None


def parse_ifr(path, root):
    text = path.read_text(errors="replace").splitlines()
    source_path = str(path.relative_to(root))
    formset = None
    stores = {}
    questions = []
    conditions = []
    active = []

    for line in text:
        depth = indent(line)
        if "FormSet Guid:" in line:
            match = re.search(r'FormSet Guid: ([0-9A-Fa-f-]+), Title: "(.*?)"', line)
            if match:
                formset = {"guid": match.group(1).lower(), "title": match.group(2)}

        store = re.search(
            r'VarStore(?:Efi)? Guid: ([0-9A-Fa-f-]+), VarStoreId: (0x[0-9A-Fa-f]+),'
            r'(?: Attributes: (0x[0-9A-Fa-f]+),)? Size: (0x[0-9A-Fa-f]+), Name: "(.*?)"',
            line,
        )
        if store:
            stores[parse_int(store.group(2))] = {
                "guid": store.group(1).lower(),
                "name": store.group(5),
                "size": parse_int(store.group(4)),
                "attributes": parse_int(store.group(3)) if store.group(3) else None,
            }

        kind = re.search(r'\s(SuppressIf|GrayOutIf|DisableIf|InconsistentIf)\b', line)
        if kind:
            condition = {"kind": kind.group(1), "depth": depth, "ops": []}
            conditions.append(condition)
            active.append(condition)
            continue

        if re.search(r'\sEnd\s', line):
            active = [item for item in active if item["depth"] != depth]
            continue

        # Operators within an active condition are emitted in IFR stack order.
        if active and depth > active[-1]["depth"]:
            op = parse_condition_op(line)
            if op:
                active[-1]["ops"].append(op)

        question = re.search(rf'\s({QUESTION_TYPES}) Prompt: "(.*?)"', line)
        if not question or "QuestionId:" not in line:
            continue
        question_id = match_field(line, "QuestionId")
        store_id = match_field(line, "VarStoreId")
        offset = match_field(line, "VarOffset")
        if offset is None:
            offset = match_field(line, "VarStoreInfo")
        bits = match_field(line, "Size")
        storage = stores.get(store_id)
        question = {
            "id": f"{formset['guid'] if formset else 'unknown'}:{question_id:#x}",
            "formset_guid": formset["guid"] if formset else None,
            "formset_title": formset["title"] if formset else None,
            "question_id": question_id,
            "type": question.group(1),
            "prompt": question.group(2),
            "flags": match_field(line, "QuestionFlags"),
            "varstore": storage,
            "offset": offset,
            "width": max(1, bits // 8) if bits else None,
            "min": match_field(line, "Min"),
            "max": match_field(line, "Max"),
            "step": match_field(line, "Step"),
            "conditions": [
                {"kind": item["kind"], "ops": item["ops"][:]}
                for item in active
            ],
        }
        store_key = storage["name"] if storage else "no-varstore"
        offset_key = f"{offset:#x}" if offset is not None else "no-offset"
        question["key"] = f"{source_path}:{question['id']}:{store_key}:{offset_key}"
        questions.append(question)

    return {
        "path": source_path,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "formset": formset,
        "varstores": stores,
        "questions": questions,
    }


def parse_condition_op(line):
    if re.search(r'\sTrue\s', line):
        return {"op": "const", "value": True}
    if re.search(r'\sFalse\s', line):
        return {"op": "const", "value": False}
    match = re.search(r'EqIdVal QuestionId: (0x[0-9A-Fa-f]+), Value: (0x[0-9A-Fa-f]+)', line)
    if match:
        return {"op": "eq", "question_id": parse_int(match.group(1)), "value": parse_int(match.group(2))}
    match = re.search(r'EqIdValList QuestionId: (0x[0-9A-Fa-f]+), Values: \[(.*?)\]', line)
    if match:
        return {"op": "in", "question_id": parse_int(match.group(1)), "values": [parse_int(v.strip()) for v in match.group(2).split(",")]}
    for operation in ("And", "Or", "Not"):
        if re.search(rf'\s{operation}\s', line):
            return {"op": operation.lower()}
    return None


def build_registry(args):
    root = Path(args.ifr_root).resolve()
    sources = [parse_ifr(path, root) for path in sorted(root.rglob("*.uefi.ifr.txt"))]
    if not sources:
        raise SystemExit(f"No verbose IFR files below {root}")
    registry = {
        "format": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ifr_root": str(root),
        "sources": sources,
        "question_count": sum(len(source["questions"]) for source in sources),
    }
    write_json(args.output, registry)
    print(f"Registry: {len(sources)} IFR files, {registry['question_count']} questions -> {args.output}")


def variable_path(name, guid, root=EFIVARS):
    return Path(root) / f"{name}-{guid.lower()}"


def snapshot(args):
    root = Path(args.efivars)
    if not root.is_dir():
        raise SystemExit(f"efivarfs is unavailable: {root}")
    variables = []
    for path in sorted(root.iterdir()):
        # efivarfs names are <variable-name>-<36-character GUID>; variable
        # names may themselves contain hyphens, so rsplit("-", 1) is wrong.
        if len(path.name) < 38 or path.name[-37] != "-":
            continue
        name, guid = path.name[:-37], path.name[-36:]
        raw = path.read_bytes()
        if len(raw) < 4:
            continue
        variables.append({
            "name": name,
            "guid": guid.lower(),
            "attributes": int.from_bytes(raw[:4], "little"),
            "data_b64": base64.b64encode(raw[4:]).decode(),
        })
    write_json(args.output, {"format": 1, "created_at": datetime.now(timezone.utc).isoformat(), "variables": variables})
    print(f"Snapshot: {len(variables)} variables -> {args.output}")


def clear_immutable(path):
    subprocess.run(["chattr", "-i", str(path)], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def write_variable(root, name, guid, data, attrs=None):
    path = variable_path(name, guid, root)
    if attrs is None:
        if not path.exists():
            raise SystemExit(f"{path} does not exist; provide --attrs to create it")
        attrs = int.from_bytes(path.read_bytes()[:4], "little")
    clear_immutable(path)
    path.write_bytes(attrs.to_bytes(4, "little") + data)


def write_command(args):
    data = bytes.fromhex(args.data_hex)
    write_variable(Path(args.efivars), args.name, args.guid, data, args.attrs)
    print(f"Wrote {args.name}-{args.guid.lower()}: {len(data)} payload bytes")


def restore(args):
    root = Path(args.efivars)
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    for item in snapshot_data["variables"]:
        write_variable(root, item["name"], item["guid"], base64.b64decode(item["data_b64"]), item["attributes"])
    print(f"Restored {len(snapshot_data['variables'])} variables from {args.snapshot}")


def bridge_state(args):
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    bridge = next(
        (item for item in snapshot_data["variables"]
         if item["name"] == BRIDGE_NAME and item["guid"].lower() == BRIDGE_GUID),
        None,
    )
    if bridge is None:
        raise SystemExit(f"Bridge variable {BRIDGE_NAME}-{BRIDGE_GUID} is absent")
    raw = base64.b64decode(bridge["data_b64"])
    if len(raw) < 24:
        raise SystemExit("Bridge state is shorter than its header")
    magic, version, entry_count, total_size, _ = struct.unpack_from("<8sIIII", raw)
    if magic != b"BSLSTATE" or version != 1 or total_size > len(raw):
        raise SystemExit("Bridge state has an unsupported header")
    position = 24
    variables = []
    for _ in range(entry_count):
        if position + 36 > total_size:
            raise SystemExit("Bridge state has a truncated entry header")
        guid_raw, attrs, name_bytes, data_bytes, status = struct.unpack_from("<16sIIIQ", raw, position)
        position += 36
        end = position + name_bytes + data_bytes
        if name_bytes % 2 or end > total_size:
            raise SystemExit("Bridge state has an invalid entry length")
        name = raw[position:position + name_bytes].decode("utf-16-le")
        position += name_bytes
        data = raw[position:end]
        position = end
        if status == 0:
            variables.append({
                "name": name,
                "guid": str(uuid.UUID(bytes_le=guid_raw)),
                "attributes": attrs,
                "data_b64": base64.b64encode(data).decode(),
            })
    write_json(args.output, {
        "format": 1,
        "created_at": snapshot_data.get("created_at"),
        "source": "BiosStateLabBridgeDxe",
        "variables": variables,
    })
    print(f"Bridge state: {len(variables)}/{entry_count} variables -> {args.output}")


def read_snapshot_values(snapshot_data):
    return {
        (item["name"], item["guid"].lower()): base64.b64decode(item["data_b64"])
        for item in snapshot_data["variables"]
    }


def iter_parameters(registry, snapshot_data):
    variables = read_snapshot_values(snapshot_data)
    for source in registry["sources"]:
        for question in source["questions"]:
            store = question["varstore"]
            if not store or question["offset"] is None or not question["width"]:
                continue
            data = variables.get((store["name"], store["guid"]))
            start = question["offset"]
            end = start + question["width"]
            if data is None or end > len(data):
                continue
            yield source["path"], question, int.from_bytes(data[start:end], "little")


def values(args):
    registry = json.loads(Path(args.registry).read_text())
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    parameters = []
    for source, question, value in iter_parameters(registry, snapshot_data):
        parameters.append({
            "key": question["key"],
            "source": source,
            "prompt": question["prompt"],
            "type": question["type"],
            "value": value,
            "storage": {
                "name": question["varstore"]["name"],
                "guid": question["varstore"]["guid"],
                "offset": question["offset"],
                "width": question["width"],
            },
            "limits": {key: question[key] for key in ("min", "max", "step") if question[key] is not None},
        })
    write_json(args.output, {"format": 1, "source": snapshot_data.get("source"), "parameters": parameters})
    print(f"Values: {len(parameters)} parameters -> {args.output}")


def apply_profile(args):
    registry = json.loads(Path(args.registry).read_text())
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    profile = json.loads(Path(args.profile).read_text())
    questions = {
        question["key"]: question
        for source in registry["sources"] for question in source["questions"]
    }
    payloads = {
        (item["name"], item["guid"].lower()): bytearray(base64.b64decode(item["data_b64"]))
        for item in snapshot_data["variables"]
    }
    applied = []
    seen = set()
    for change in profile.get("changes", []):
        key = change.get("key")
        value = change.get("value")
        if key in seen:
            raise SystemExit(f"Profile changes {key} more than once")
        seen.add(key)
        if key not in questions or not isinstance(value, int):
            raise SystemExit(f"Invalid profile change: {change}")
        question = questions[key]
        store = question["varstore"]
        if not store or question["offset"] is None or not question["width"]:
            raise SystemExit(f"Question has no writable varstore field: {key}")
        if not args.unsafe:
            if question["min"] is not None and value < question["min"]:
                raise SystemExit(f"Value below IFR minimum for {key}")
            if question["max"] is not None and value > question["max"]:
                raise SystemExit(f"Value above IFR maximum for {key}")
        limit = 1 << (question["width"] * 8)
        if value < 0 or value >= limit:
            raise SystemExit(f"Value does not fit {question['width']} bytes: {key}")
        payload_key = (store["name"], store["guid"])
        payload = payloads.get(payload_key)
        start = question["offset"]
        end = start + question["width"]
        if payload is None or end > len(payload):
            raise SystemExit(f"Snapshot lacks storage for {key}")
        old_value = int.from_bytes(payload[start:end], "little")
        payload[start:end] = value.to_bytes(question["width"], "little")
        applied.append({"key": key, "old_value": old_value, "new_value": value})
    result = dict(snapshot_data)
    result["variables"] = [
        dict(item, data_b64=base64.b64encode(payloads[(item["name"], item["guid"].lower())]).decode())
        for item in snapshot_data["variables"]
    ]
    result["profile_applied"] = applied
    write_json(args.output, result)
    print(f"Profile: {len(applied)} changes -> {args.output}")


def make_request(args):
    registry = json.loads(Path(args.registry).read_text())
    profile = json.loads(Path(args.profile).read_text())
    questions = {
        question["key"]: question
        for source in registry["sources"] for question in source["questions"]
    }
    entries = []
    seen = set()
    for change in profile.get("changes", []):
        key, value = change.get("key"), change.get("value")
        if key in seen or key not in questions or not isinstance(value, int):
            raise SystemExit(f"Invalid profile change: {change}")
        seen.add(key)
        question = questions[key]
        store = question["varstore"]
        if not store or question["offset"] is None or not question["width"]:
            raise SystemExit(f"Question has no writable varstore field: {key}")
        if not args.unsafe:
            if question["min"] is not None and value < question["min"]:
                raise SystemExit(f"Value below IFR minimum for {key}")
            if question["max"] is not None and value > question["max"]:
                raise SystemExit(f"Value above IFR maximum for {key}")
        width = question["width"]
        if value < 0 or value >= 1 << (width * 8):
            raise SystemExit(f"Value does not fit {width} bytes: {key}")
        name = store["name"].encode("utf-16-le")
        data = value.to_bytes(width, "little")
        entries.append(struct.pack("<16sIII", uuid.UUID(store["guid"]).bytes_le, len(name), question["offset"], len(data)) + name + data)
    body = b"".join(entries)
    payload = struct.pack("<8sIIII", b"BSLREQ01", 1, len(entries), 24 + len(body), 0) + body
    write_json(args.output, {
        "format": 1,
        "source": "BiosStateLabBridgeDxe",
        "variables": [{
            "name": REQUEST_NAME,
            "guid": BRIDGE_GUID,
            "attributes": 7,
            "data_b64": base64.b64encode(payload).decode(),
        }],
        "profile_queued": profile.get("changes", []),
    })
    print(f"Bridge request: {len(entries)} changes -> {args.output}")


def bridge_result(args):
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    result = next(
        (item for item in snapshot_data["variables"]
         if item["name"] == RESULT_NAME and item["guid"].lower() == BRIDGE_GUID),
        None,
    )
    if result is None:
        raise SystemExit(f"Bridge variable {RESULT_NAME}-{BRIDGE_GUID} is absent")
    raw = base64.b64decode(result["data_b64"])
    if len(raw) < 32:
        raise SystemExit("Bridge result is shorter than its header")
    magic, version, count, total_size, _, overall = struct.unpack_from("<8sIIIIQ", raw)
    if magic != b"BSLRES01" or version != 1 or total_size > len(raw) or total_size != 32 + count * 12:
        raise SystemExit("Bridge result has an unsupported header")
    entries = [
        {"request_index": index, "status": status}
        for index, status in (struct.unpack_from("<IQ", raw, 32 + offset * 12) for offset in range(count))
    ]
    write_json(args.output, {"format": 1, "overall_status": overall, "entries": entries})
    print(f"Bridge result: {count} entries, overall EFI status {overall:#x} -> {args.output}")


def evaluate(ops, values):
    stack = []
    for op in ops:
        if op["op"] == "const":
            stack.append(op["value"])
        elif op["op"] in ("eq", "in"):
            value = values.get(op["question_id"])
            if value is None:
                stack.append(None)
            elif op["op"] == "eq":
                stack.append(value == op["value"])
            else:
                stack.append(value in op["values"])
        elif op["op"] == "not":
            value = stack.pop() if stack else None
            stack.append(None if value is None else not value)
        else:
            right = stack.pop() if stack else None
            left = stack.pop() if stack else None
            if op["op"] == "and":
                stack.append(False if False in (left, right) else None if None in (left, right) else True)
            else:
                stack.append(True if True in (left, right) else None if None in (left, right) else False)
    return stack[-1] if len(stack) == 1 else None


def state(args):
    registry = json.loads(Path(args.registry).read_text())
    snapshot_data = json.loads(Path(args.snapshot).read_text())
    variables = read_snapshot_values(snapshot_data)
    output = []
    required_varstores = set()
    for source in registry["sources"]:
        values = {}
        for question in source["questions"]:
            store = question["varstore"]
            if store:
                required_varstores.add((store["name"], store["guid"]))
            if not store or question["offset"] is None or not question["width"]:
                continue
            data = variables.get((store["name"], store["guid"]))
            start, end = question["offset"], question["offset"] + question["width"]
            if data is not None and end <= len(data):
                values[question["question_id"]] = int.from_bytes(data[start:end], "little")
        for question in source["questions"]:
            flags = {"hidden": False, "grayed": False, "disabled": False, "invalid": False, "unknown": False}
            reasons = []
            for condition in question["conditions"]:
                result = evaluate(condition["ops"], values)
                if result is None:
                    flags["unknown"] = True
                elif result:
                    key = {"SuppressIf": "hidden", "GrayOutIf": "grayed", "DisableIf": "disabled", "InconsistentIf": "invalid"}[condition["kind"]]
                    flags[key] = True
                    reasons.append(condition["kind"])
            output.append({"source": source["path"], "question": question, "state": flags, "reasons": reasons})
    missing = sorted(required_varstores - set(variables))
    json.dump({
        "format": 1,
        "coverage": {
            "required_varstores": len(required_varstores),
            "present_varstores": len(required_varstores) - len(missing),
            "missing_varstores": [{"name": name, "guid": guid} for name, guid in missing],
        },
        "questions": output,
    }, sys.stdout, indent=2)
    sys.stdout.write("\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(required=True)
    command = sub.add_parser("build-registry", help="Rebuild registry from verbose IFR files")
    command.add_argument("ifr_root")
    command.add_argument("output")
    command.set_defaults(func=build_registry)
    command = sub.add_parser("snapshot", help="Capture all efivarfs variables")
    command.add_argument("output")
    command.add_argument("--efivars", default=EFIVARS)
    command.set_defaults(func=snapshot)
    command = sub.add_parser("write", help="Write one variable payload")
    command.add_argument("--name", required=True)
    command.add_argument("--guid", required=True)
    command.add_argument("--data-hex", required=True)
    command.add_argument("--attrs", type=parse_int)
    command.add_argument("--efivars", default=EFIVARS)
    command.set_defaults(func=write_command)
    command = sub.add_parser("restore", help="Restore variables from a snapshot")
    command.add_argument("snapshot")
    command.add_argument("--efivars", default=EFIVARS)
    command.set_defaults(func=restore)
    command = sub.add_parser("bridge-state", help="Decode a read-only bridge variable from a snapshot")
    command.add_argument("snapshot")
    command.add_argument("output")
    command.set_defaults(func=bridge_state)
    command = sub.add_parser("values", help="Export IFR-addressed values from a snapshot")
    command.add_argument("registry")
    command.add_argument("snapshot")
    command.add_argument("output")
    command.set_defaults(func=values)
    command = sub.add_parser("apply-profile", help="Apply integer field changes to a copy of a snapshot")
    command.add_argument("registry")
    command.add_argument("snapshot")
    command.add_argument("profile")
    command.add_argument("output")
    command.add_argument("--unsafe", action="store_true", help="Ignore IFR min/max constraints")
    command.set_defaults(func=apply_profile)
    command = sub.add_parser("make-request", help="Build a runtime bridge request from an IFR profile")
    command.add_argument("registry")
    command.add_argument("profile")
    command.add_argument("output")
    command.add_argument("--unsafe", action="store_true", help="Ignore IFR min/max constraints")
    command.set_defaults(func=make_request)
    command = sub.add_parser("bridge-result", help="Decode bridge write statuses from a snapshot")
    command.add_argument("snapshot")
    command.add_argument("output")
    command.set_defaults(func=bridge_result)
    command = sub.add_parser("state", help="Evaluate static IFR conditions against a snapshot")
    command.add_argument("registry")
    command.add_argument("snapshot")
    command.set_defaults(func=state)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
