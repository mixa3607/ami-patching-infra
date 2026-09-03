from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import load_yaml, require_file, run as run_command, section_type, uefi_replace


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("setup-data requires a prepared ROM")

    config = context.profile["ifr"]
    if not isinstance(config, dict) or "manifest" not in config:
        raise ValueError("board profile field 'ifr.manifest' is required")
    ifr_root = context.board_dir / "ifr"
    manifest = load_yaml(ifr_root / str(config["manifest"]), "IFR sections manifest")
    sections = manifest.get("sections")
    if not isinstance(sections, list):
        raise ValueError("IFR sections manifest field 'sections' must be a list")

    setup_data = next((section for section in sections if section.get("name") == "SetupData"), None)
    forms = [section for section in sections if section.get("outputMode") == "section"]
    if not isinstance(setup_data, dict) or not forms:
        raise ValueError("IFR sections manifest must define SetupData and form sections")

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(tool, "uefi-mod-tools")
    output = context.build_dir / "30-setup-data.rom"
    work_dir = context.work_dir / "setup-data"
    clean_setup_data = ifr_root / str(setup_data["output"])
    require_file(clean_setup_data, "clean SetupData")

    print(f"Patching SetupData in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    patched_setup_data = clean_setup_data
    for form in forms:
        name = str(form["name"])
        ifr_json = ifr_root / str(form["ifrJson"])
        patch = ifr_root / Path(str(form["output"])).parent / "SetupData.patch.json"
        for path, description in ((ifr_json, f"{name} IFR JSON"), (patch, f"{name} SetupData patch")):
            require_file(path, description)
        setup_data_map = work_dir / f"{name}.map.json"
        next_setup_data = work_dir / f"{name}.bin"
        run_command(
            [
                str(tool), "uefi", "setup-data", "map-ifr",
                "--input", str(patched_setup_data), "--ifr", str(ifr_json),
                "--output", str(setup_data_map),
            ],
            dry_run=context.dry_run,
        )
        run_command(
            [
                str(tool), "uefi", "setup-data", "apply-patch",
                "--input", str(patched_setup_data), "--map", str(setup_data_map),
                "--patch", str(patch), "--output", str(next_setup_data),
            ],
            dry_run=context.dry_run,
        )
        patched_setup_data = next_setup_data

    uefi_replace(
        context,
        output,
        str(setup_data["fileGuid"]),
        section_type(setup_data["sectionType"]),
        patched_setup_data,
    )
    return output
