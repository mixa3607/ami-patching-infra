from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def _find_entity(inspect: dict[str, object], path: object, description: str) -> dict[str, object]:
    if not isinstance(path, list) or not path:
        raise ValueError(f"{description} path must be a non-empty list")
    entities = inspect.get("entities")
    if not isinstance(entities, dict):
        raise ValueError("inspect output has no entities mapping")

    matches: list[dict[str, object]] = []
    for entity in entities.values():
        if not isinstance(entity, dict):
            continue
        candidate = entity.get("path")
        if not isinstance(candidate, list) or len(candidate) != len(path):
            continue
        if all(
            isinstance(expected, dict)
            and isinstance(actual, dict)
            and expected.get("kind") == actual.get("kind")
            and all(expected.get(key) == actual.get(key) for key in ("guid", "fsGuid", "index") if key in expected)
            and (
                "subtype" not in expected
                or expected.get("kind") == "file" and entity.get("subtype") == expected.get("subtype")
                or expected.get("kind") != "file" and expected.get("subtype") == actual.get("subtype")
            )
            for expected, actual in zip(path, candidate)
        ):
            matches.append(entity)
    if len(matches) != 1:
        raise ValueError(f"{description} path resolved to {len(matches)} entities in inspect output")
    return matches[0]


def _hex(value: int) -> str:
    return f"0x{value:X}"


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("mcodes requires a prepared ROM")

    config = context.profile["mcodes"]
    if not isinstance(config, dict):
        raise ValueError("board profile field 'mcodes' must be a mapping")
    try:
        catalog = context.repo_root / str(config["catalog"])
        microcode_names = config["use_microcodes"]
        container_path = config["container_path"]
        fit_path = config["fit_path"]
    except KeyError as error:
        raise ValueError(f"board profile mcodes config is missing '{error.args[0]}'") from error
    if not isinstance(microcode_names, list) or not microcode_names or not all(isinstance(name, str) for name in microcode_names):
        raise ValueError("board profile mcodes.use_microcodes must be a non-empty list of filenames")
    if len(set(microcode_names)) != len(microcode_names):
        raise ValueError("board profile mcodes.use_microcodes contains duplicate filenames")
    if not catalog.is_dir():
        raise FileNotFoundError(f"microcode catalog not found: {catalog}")
    microcodes = [catalog / name for name in microcode_names]
    for microcode in microcodes:
        if microcode.name != microcode.relative_to(catalog).as_posix():
            raise ValueError(f"microcode filename must not contain a path: {microcode}")
        require_file(microcode, "microcode")

    ne_tool = context.repo_root / "SOFTWARE" / "UEFITool_NE-cli" / "uefitool-ne-cli"
    mod_tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(ne_tool, "uefitool-ne-cli")
    require_file(mod_tool, "uefi-mod-tools")

    output = context.build_dir / "40-mcodes.rom"
    work_dir = context.work_dir / "mcodes"
    inspect_file = work_dir / "inspect.json"
    extract_manifest = work_dir / "extract.json"
    extract_dir = work_dir / "extracted"
    container = extract_dir / "container.bin"
    fit = extract_dir / "fit.bin"
    partitions = work_dir / "partitions"
    partitions_table = work_dir / "partitions.json"
    patched_container = work_dir / "container.patched.bin"
    fit_map = work_dir / "fit.map.json"
    fit_patch = work_dir / "fit.patch.json"
    patched_fit = work_dir / "fit.patched.bin"

    print(f"Patching microcodes in {context.current_rom} -> {output}")
    if context.dry_run:
        print("+ runtime microcode layout will be resolved with inspect --add-paths")
        return output

    work_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(context.current_rom, output)
    run_command([str(ne_tool), "inspect", str(output), "--add-paths", "--output", str(inspect_file)], dry_run=False)
    inspect = json.loads(inspect_file.read_text())
    container_entity = _find_entity(inspect, container_path, "microcode container")
    fit_entity = _find_entity(inspect, fit_path, "FIT")
    for entity, description in ((container_entity, "microcode container"), (fit_entity, "FIT")):
        if entity.get("kind") != "file" or entity.get("subtype") != "raw":
            raise ValueError(f"{description} path must resolve to a raw file")

    container_offset = int(container_entity["offset"]) + int(container_entity["header_size"])
    container_size = int(container_entity["body_size"])
    if container_size <= 16:
        raise ValueError("microcode container is too small to reserve its 16-byte tail")
    usable_size = container_size - 16
    total_size = sum(microcode.stat().st_size for microcode in microcodes)
    if total_size > usable_size:
        raise ValueError(f"microcodes need {_hex(total_size)}, container has {_hex(usable_size)} usable bytes")
    rom_size = output.stat().st_size
    if rom_size > 0x100000000:
        raise ValueError("ROM is too large for the 32-bit flash address formula")
    base_address = 0x100000000 - rom_size + container_offset

    extraction = {
        "schema_version": 1,
        "outputs": [
            {"path": container_path, "output": container.name, "outputMode": "body"},
            {"path": fit_path, "output": fit.name, "outputMode": "body"},
        ],
    }
    extract_manifest.write_text(json.dumps(extraction, indent=2) + "\n")
    run_command([str(ne_tool), "extract", str(output), str(extract_manifest), str(extract_dir)], dry_run=False)

    partitions.mkdir(exist_ok=True)
    clear = partitions / "clear.bin"
    clear.write_bytes(b"")
    partition_entries: list[dict[str, object]] = [{
        "fileName": clear.name,
        "beginAddress": _hex(0),
        "endAddress": _hex(usable_size),
        "padByte": "0xFF",
    }]
    position = 0
    for microcode in microcodes:
        staged = partitions / microcode.name
        shutil.copyfile(microcode, staged)
        next_position = position + staged.stat().st_size
        partition_entries.append({
            "fileName": staged.name,
            "beginAddress": _hex(position),
            "endAddress": _hex(next_position),
            "padByte": "0xFF",
        })
        position = next_position
    partitions_table.write_text(json.dumps({"partitions": partition_entries}, indent=2) + "\n")
    run_command(
        [str(mod_tool), "bin", "combine", "--input", str(container), "--table", str(partitions_table), "--partitions", str(partitions), "--output", str(patched_container)],
        dry_run=False,
    )

    run_command([str(mod_tool), "uefi", "fit", "map", "--input", str(fit), "--output", str(fit_map)], dry_run=False)
    mapped_fit = json.loads(fit_map.read_text())
    entries = mapped_fit.get("entries")
    if not isinstance(entries, list):
        raise ValueError("FIT map has no entries list")
    old_microcodes = [entry for entry in entries if isinstance(entry, dict) and entry.get("entry", {}).get("type") == "MicrocodeUpdateEntry"]
    empty_entries = [entry for entry in entries if isinstance(entry, dict) and entry.get("entry", {}).get("type") == "UnusedEntry"]
    slots = old_microcodes + empty_entries
    if len(slots) < len(microcodes):
        raise ValueError(f"FIT has {len(slots)} usable microcode slots but needs {len(microcodes)}")
    operations: list[dict[str, object]] = [{"kind": "Clear", "id": entry["id"]} for entry in old_microcodes]
    position = 0
    for slot, microcode in zip(slots, microcodes):
        operations.append({
            "kind": "Write",
            "id": slot["id"],
            "entry": {
                "address": _hex(base_address + position),
                "size": "0x0",
                "reserved": 0,
                "version": "0x100",
                "checksumValidate": False,
                "type": "MicrocodeUpdateEntry",
                "checksum": 0,
            },
        })
        position += microcode.stat().st_size
    fit_patch.write_text(json.dumps({"version": 1, "type": "FIT-Patch", "operations": operations}, indent=2) + "\n")
    run_command(
        [str(mod_tool), "uefi", "fit", "apply-patch", "--input", str(fit), "--map", str(fit_map), "--patch", str(fit_patch), "--output", str(patched_fit)],
        dry_run=False,
    )

    uefi_apply(context, output, container_path, patched_container, input_mode="body")
    uefi_apply(context, output, fit_path, patched_fit, input_mode="body")
    return output
