from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def _require_forms(config: object) -> list[dict[str, object]]:
    if not isinstance(config, dict) or not isinstance(config.get("sct_paths"), list):
        raise ValueError("board profile field 'sct.sct_paths' must be a list")
    forms = config["sct_paths"]
    if not forms or not all(isinstance(form, dict) for form in forms):
        raise ValueError("board profile field 'sct.sct_paths' must be a non-empty list of mappings")
    for form in forms:
        if not isinstance(form.get("name"), str) or not isinstance(form.get("path"), list):
            raise ValueError("each SCT path requires name and path")
    return forms


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("setup-data requires an NVAR-defaults ROM")

    config = context.profile.get("setup_data")
    if not isinstance(config, dict) or not isinstance(config.get("path"), list) or not isinstance(config.get("patch"), str):
        raise ValueError("board profile field 'setup_data' requires path and patch")
    forms = _require_forms(context.profile.get("sct"))

    ne_tool = context.repo_root / "SOFTWARE" / "UEFITool_NE-cli" / "uefitool-ne-cli"
    ifr_tool = context.repo_root / "SOFTWARE" / "IFRExtractor-RS-structured" / "ifrextractor"
    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(ne_tool, "uefitool-ne-cli")
    require_file(ifr_tool, "IFR extractor")
    require_file(tool, "uefi-mod-tools")

    output = context.build_dir / "35-setup-data.rom"
    work_dir = context.work_dir / "setup-data"
    extract_manifest = work_dir / "extract.json"
    extract_dir = work_dir / "extracted"
    print(f"Patching SetupData in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    extraction_outputs: list[dict[str, object]] = [{
        "path": config["path"],
        "output": "SetupData.bin",
        "outputMode": "body",
    }]
    for form in forms:
        extraction_outputs.append({
            "path": form["path"],
            "output": f"forms/{form['name']}.sct",
            "outputMode": "section",
        })
    if not context.dry_run:
        extract_manifest.write_text(json.dumps({"schema_version": 1, "outputs": extraction_outputs}, indent=2) + "\n")
    run_command([str(ne_tool), "extract", str(output), str(extract_manifest), str(extract_dir)], dry_run=context.dry_run)

    patched_setup_data = extract_dir / "SetupData.bin"
    for form in forms:
        name = str(form["name"])
        sct = extract_dir / "forms" / f"{name}.sct"
        ifr_json = Path(f"{sct}.0.0.uefi.ifr.json")
        patch = context.board_dir / str(config["patch"]).format(sct=name)
        setup_data_map = work_dir / f"{name}.map.json"
        next_setup_data = work_dir / f"{name}.bin"
        require_file(patch, f"{name} SetupData patch")
        run_command([str(ifr_tool), str(sct), "json"], dry_run=context.dry_run)
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

    uefi_apply(context, output, config["path"], patched_setup_data, input_mode="body")
    return output
