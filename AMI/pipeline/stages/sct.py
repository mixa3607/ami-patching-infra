from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import load_yaml, require_file, run as run_command, uefi_apply


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("sct requires a setup-data ROM")

    config = context.profile["ifr"]
    if not isinstance(config, dict) or "manifest" not in config:
        raise ValueError("board profile field 'ifr.manifest' is required")
    ifr_root = context.board_dir / "ifr"
    manifest = load_yaml(ifr_root / str(config["manifest"]), "IFR sections manifest")
    outputs = manifest.get("outputs")
    if not isinstance(outputs, list):
        raise ValueError("IFR extraction manifest field 'outputs' must be a list")
    forms = [section for section in outputs if section.get("outputMode") == "section"]
    if not forms:
        raise ValueError("IFR sections manifest must define form sections")

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(tool, "uefi-mod-tools")
    output = context.build_dir / "35-sct.rom"
    work_dir = context.work_dir / "sct"

    print(f"Patching SCT in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    for form in forms:
        name = str(form["name"])
        source = ifr_root / str(form["output"])
        ifr_json = ifr_root / f"{form['output']}.0.0.uefi.ifr.json"
        patch = source.with_name(f"{source.name}.patch.json")
        patched_sct = work_dir / f"{name}.sct"
        for path, description in ((source, f"{name} clean SCT"), (ifr_json, f"{name} IFR JSON"), (patch, f"{name} SCT patch")):
            require_file(path, description)
        run_command(
            [
                str(tool), "uefi", "sct", "apply-patch",
                "--input", str(source), "--ifr", str(ifr_json),
                "--patch", str(patch), "--output", str(patched_sct),
            ],
            dry_run=context.dry_run,
        )
        uefi_apply(context, output, form["path"], patched_sct, input_mode="section")
    return output
