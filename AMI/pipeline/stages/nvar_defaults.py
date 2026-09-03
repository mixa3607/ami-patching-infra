from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import load_yaml, require_file, run as run_command, section_type, uefi_replace


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
    defaults = [section for section in sections if section.get("defaults") is True]
    forms = [section for section in sections if section.get("outputMode") == "section"]
    if not defaults or not forms:
        raise ValueError("IFR sections manifest must define defaults sections and form sections")

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(tool, "uefi-mod-tools")
    output = context.build_dir / "37-nvar-defaults.rom"
    work_dir = context.work_dir / "nvar-defaults"
    print(f"Patching NVAR defaults in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    for defaults_section in defaults:
        defaults_name = str(defaults_section["name"])
        defaults_source = ifr_root / str(defaults_section["output"])
        defaults_body = work_dir / f"{defaults_name}.bin"
        nvar_map = work_dir / f"{defaults_name}.nvar-map.json"
        require_file(defaults_source, f"{defaults_name} defaults")
        if not context.dry_run:
            shutil.copyfile(defaults_source, defaults_body)
        run_command(
            [str(tool), "uefi", "nvar", "map", "--input", str(defaults_body), "--output", str(nvar_map)],
            dry_run=context.dry_run,
        )

        patched_defaults = defaults_body
        changed = False
        for form in forms:
            name = str(form["name"])
            ifr_json = ifr_root / str(form["ifrJson"])
            patch = ifr_root / Path(str(form["output"])).parent / f"{defaults_name}-nvar-patch.json"
            require_file(ifr_json, f"{name} IFR JSON")
            require_file(patch, f"{name} {defaults_name} patch")
            patch_data = json.loads(patch.read_text())
            patches = patch_data.get("varPatches")
            if not isinstance(patches, list):
                raise ValueError(f"{name} NVAR patch field 'varPatches' must be a list")
            if not patches:
                continue

            store_map = work_dir / f"{name}-{defaults_name}.nvar-map.json"
            next_defaults = work_dir / f"{name}-{defaults_name}.bin"
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
            str(defaults_section["fileGuid"]),
            section_type(defaults_section["sectionType"]),
            patched_defaults,
        )
    return output
