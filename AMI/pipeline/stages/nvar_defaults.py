from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def _require_entries(config: object, key: str) -> list[dict[str, object]]:
    if not isinstance(config, dict) or not isinstance(config.get(key), list):
        raise ValueError(f"board profile field '{key}' must be a list")
    entries = config[key]
    if not entries or not all(isinstance(entry, dict) for entry in entries):
        raise ValueError(f"board profile field '{key}' must be a non-empty list of mappings")
    return entries


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("nvar-defaults requires a logo-patched ROM")

    defaults = _require_entries(context.profile.get("nvar_defaults"), "nvar_sources")
    forms = _require_entries(context.profile.get("sct"), "sct_paths")
    for source in defaults:
        if not isinstance(source.get("name"), str) or not isinstance(source.get("path"), list) or not isinstance(source.get("patch"), str):
            raise ValueError("each nvar source requires name, path, and patch")
    for form in forms:
        if not isinstance(form.get("name"), str) or not isinstance(form.get("path"), list):
            raise ValueError("each SCT path requires name and path")

    ne_tool = context.repo_root / "SOFTWARE" / "UEFITool_NE-cli" / "uefitool-ne-cli"
    ifr_tool = context.repo_root / "SOFTWARE" / "IFRExtractor-RS-structured" / "ifrextractor"
    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(ne_tool, "uefitool-ne-cli")
    require_file(ifr_tool, "IFR extractor")
    require_file(tool, "uefi-mod-tools")

    output = context.build_dir / "37-nvar-defaults.rom"
    work_dir = context.work_dir / "nvar-defaults"
    extract_manifest = work_dir / "extract.json"
    extract_dir = work_dir / "extracted"
    print(f"Patching NVAR defaults in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    extraction_outputs: list[dict[str, object]] = []
    for source in defaults:
        extraction_outputs.append({
            "path": source["path"],
            "output": f"defaults/{source['name']}.bin",
            "outputMode": "body",
        })
    for form in forms:
        extraction_outputs.append({
            "path": form["path"],
            "output": f"forms/{form['name']}.sct",
            "outputMode": "section",
        })
    if not context.dry_run:
        extract_manifest.write_text(json.dumps({"schema_version": 1, "outputs": extraction_outputs}, indent=2) + "\n")
    run_command([str(ne_tool), "extract", str(output), str(extract_manifest), str(extract_dir)], dry_run=context.dry_run)

    ifr_files: dict[str, Path] = {}
    for form in forms:
        name = str(form["name"])
        sct = extract_dir / "forms" / f"{name}.sct"
        ifr_json = Path(f"{sct}.0.0.uefi.ifr.json")
        run_command([str(ifr_tool), str(sct), "json"], dry_run=context.dry_run)
        ifr_files[name] = ifr_json

    for source in defaults:
        defaults_name = str(source["name"])
        defaults_body = extract_dir / "defaults" / f"{defaults_name}.bin"
        nvar_map = work_dir / f"{defaults_name}.nvar-map.json"
        run_command(
            [str(tool), "uefi", "nvar", "map", "--input", str(defaults_body), "--output", str(nvar_map)],
            dry_run=context.dry_run,
        )

        patched_defaults = defaults_body
        changed = False
        for form in forms:
            form_name = str(form["name"])
            patch = context.board_dir / str(source["patch"]).format(sct=form_name, name=defaults_name)
            require_file(patch, f"{form_name} {defaults_name} patch")
            patch_data = json.loads(patch.read_text())
            patches = patch_data.get("varPatches")
            if not isinstance(patches, list):
                raise ValueError(f"{form_name} {defaults_name} patch field 'varPatches' must be a list")
            if not patches:
                continue

            store_map = work_dir / f"{form_name}-{defaults_name}.nvar-map.json"
            next_defaults = work_dir / f"{form_name}-{defaults_name}.bin"
            run_command(
                [
                    str(tool), "uefi", "nvar", "map-ifr-stores", "--input", str(nvar_map),
                    "--ifr", str(ifr_files[form_name]), "--output", str(store_map),
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

        uefi_apply(context, output, source["path"], patched_defaults, input_mode="body")
    return output
