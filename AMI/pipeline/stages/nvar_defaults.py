from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import load_yaml, require_file, run as run_command, section_type, uefi_replace


NVAR_GUID = bytes.fromhex("616351AFC5B46E43A7E3A149A31B1461")


def nvar_body(rom: bytes) -> bytes:
    for offset in range(len(rom)):
        if not rom.startswith(NVAR_GUID, offset) or offset + 0x1C > len(rom):
            continue
        if rom[offset + 0x12] != 0x02:
            continue
        section = offset + 0x18
        size = int.from_bytes(rom[section:section + 3], "little")
        body = section + 4
        if rom[section + 3] != 0x19 or size < 4 or section + size > len(rom):
            continue
        if rom[body:body + 4] == b"NVAR":
            return rom[body:section + size]
    raise ValueError("AF516361 NVAR defaults RAW body not found")


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("nvar-defaults requires an SCT-patched ROM")

    config = context.profile["ifr"]
    if not isinstance(config, dict) or "manifest" not in config:
        raise ValueError("board profile field 'ifr.manifest' is required")
    ifr_root = context.board_dir / "ifr"
    manifest = load_yaml(ifr_root / str(config["manifest"]), "IFR sections manifest")
    sections = manifest.get("sections")
    if not isinstance(sections, list):
        raise ValueError("IFR sections manifest field 'sections' must be a list")
    defaults = next((section for section in sections if section.get("name") == "AF516361-BiosDefaults"), None)
    forms = [section for section in sections if section.get("outputMode") == "section"]
    if not isinstance(defaults, dict) or not forms:
        raise ValueError("IFR sections manifest must define AF516361-BiosDefaults and form sections")

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(tool, "uefi-mod-tools")
    output = context.build_dir / "37-nvar-defaults.rom"
    work_dir = context.work_dir / "nvar-defaults"
    defaults_body = work_dir / "AF516361-BiosDefaults.bin"
    nvar_map = work_dir / "AF516361-BiosDefaults-nvar-map.json"

    print(f"Patching NVAR defaults in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)
        defaults_body.write_bytes(nvar_body(context.current_rom.read_bytes()))

    run_command(
        [str(tool), "uefi", "nvar", "map", "--input", str(defaults_body), "--output", str(nvar_map)],
        dry_run=context.dry_run,
    )

    patched_defaults = defaults_body
    changed = False
    for form in forms:
        name = str(form["name"])
        ifr_json = ifr_root / str(form["ifrJson"])
        patch = ifr_root / Path(str(form["output"])).parent / "AF516361-BiosDefaults-nvar-patch.json"
        require_file(ifr_json, f"{name} IFR JSON")
        require_file(patch, f"{name} NVAR patch")
        patch_data = json.loads(patch.read_text())
        patches = patch_data.get("varPatches")
        if not isinstance(patches, list):
            raise ValueError(f"{name} NVAR patch field 'varPatches' must be a list")
        if not patches:
            continue

        store_map = work_dir / f"{name}.nvar-map.json"
        next_defaults = work_dir / f"{name}.bin"
        run_command(
            [
                str(tool), "uefi", "nvar", "map-ifr-stores", "--input", str(nvar_map),
                "--ifr", str(ifr_json), "--output", str(store_map),
            ],
            dry_run=context.dry_run,
        )
        command = [
            str(tool), "uefi", "nvar", "apply-patch", "--input", str(patched_defaults),
            "--map", str(store_map), "--patch", str(patch), "--output", str(next_defaults),
        ]
        if changed:
            command.append("--ignore-checksums")
        run_command(command, dry_run=context.dry_run)
        patched_defaults = next_defaults
        changed = True

    uefi_replace(
        context,
        output,
        str(defaults["fileGuid"]),
        section_type(defaults["sectionType"]),
        patched_defaults,
    )
    if not context.dry_run and nvar_body(output.read_bytes()) != patched_defaults.read_bytes():
        raise RuntimeError("AF516361 NVAR defaults reintegration verification failed")
    return output
