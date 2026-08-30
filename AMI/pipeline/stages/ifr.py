from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import load_yaml, require_file, run as run_command, section_type, uefi_replace


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("ifr requires a prepared ROM")

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
    output = context.build_dir / "30-ifr.rom"
    work_dir = context.work_dir / "ifr"
    clean_setup_data = ifr_root / str(setup_data["output"])
    require_file(clean_setup_data, "clean SetupData")

    print(f"Patching IFR in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    patched_setup_data = clean_setup_data
    for form in forms:
        name = str(form["name"])
        patch = ifr_root / Path(str(form["output"])).parent / "SetupData.patch.json"
        require_file(patch, f"{name} SetupData patch")
        next_setup_data = work_dir / f"setupdata-{name}.bin"
        run_command(
            [str(tool), "uefi", "ifr-setupdata-patch", "--input", str(patched_setup_data), "--patch", str(patch), "--output", str(next_setup_data)],
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

    for form in forms:
        name = str(form["name"])
        source = ifr_root / str(form["output"])
        ifr_json = ifr_root / str(form["ifrJson"])
        patch = source.with_name(f"{source.name}.patch.json")
        patched_sct = work_dir / f"{name}.sct"
        for path, description in ((source, f"{name} clean SCT"), (ifr_json, f"{name} IFR JSON"), (patch, f"{name} SCT patch")):
            require_file(path, description)
        run_command(
            [str(tool), "uefi", "ifr-sct-patch", "--input", str(source), "--ifr", str(ifr_json), "--patch", str(patch), "--output", str(patched_sct)],
            dry_run=context.dry_run,
        )
        uefi_replace(context, output, str(form["fileGuid"]), section_type(form["sectionType"]), patched_sct, as_is=True)

    return output
