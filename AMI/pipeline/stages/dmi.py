from __future__ import annotations

import json
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("dmi requires a prepared ROM")

    config = context.profile["dmi"]
    if not isinstance(config, dict):
        raise ValueError("board profile field 'dmi' must be a mapping")
    try:
        path = config["path"]
        vendor_suffix = str(config["vendor_suffix"])
        version_suffix = str(config["version_suffix"]).format(version=context.version)
    except KeyError as error:
        raise ValueError(f"board profile dmi config is missing '{error.args[0]}'") from error

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    ne_tool = context.repo_root / "SOFTWARE" / "UEFITool_NE-cli" / "uefitool-ne-cli"
    require_file(tool, "uefi-mod-tools")
    require_file(ne_tool, "uefitool-ne-cli")
    output = context.build_dir / "10-dmi.rom"
    work_dir = context.work_dir / "dmi"
    extract_manifest = work_dir / "extract.json"
    table = work_dir / "table-source.bin"
    table_json = work_dir / "table.json"
    bios_json = work_dir / "bios.json"
    patched_bios_json = work_dir / "bios-patched.json"
    patched_table_json = work_dir / "table-patched.json"
    patched_table = work_dir / "table.bin"

    print(f"Patching DMI in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    extraction = {
        "schema_version": 1,
        "outputs": [{"path": path, "output": table.name, "outputMode": "body"}],
    }
    if not context.dry_run:
        extract_manifest.write_text(json.dumps(extraction, indent=2) + "\n")
    run_command([str(ne_tool), "extract", str(output), str(extract_manifest), str(work_dir)], dry_run=context.dry_run)

    run_command([str(tool), "smbios", "table2json", "--input", str(table), "--output", str(table_json)], dry_run=context.dry_run)
    if not context.dry_run:
        structures = json.loads(table_json.read_text()).get("structures", [])
        bios = next((item for item in structures if item.get("structureType") == "BiosInformation"), None)
        if not isinstance(bios, dict) or "structureHandle" not in bios:
            raise ValueError("SMBIOS table has no BiosInformation structure")
        handle = str(bios["structureHandle"])
    else:
        handle = "0"

    run_command(
        [str(tool), "smbios", "extract-struct", "--input", str(table_json), "--handle", handle, "--output", str(bios_json)],
        dry_run=context.dry_run,
    )
    if not context.dry_run:
        bios_data = json.loads(bios_json.read_text())
        bios_data["vendor"] += vendor_suffix
        bios_data["version"] += version_suffix
        patched_bios_json.write_text(json.dumps(bios_data, indent=2) + "\n")

    run_command(
        [str(tool), "smbios", "inject-struct", "--input", str(table_json), "--struct", str(patched_bios_json), "--output", str(patched_table_json)],
        dry_run=context.dry_run,
    )
    run_command([str(tool), "smbios", "json2table", "--input", str(patched_table_json), "--output", str(patched_table)], dry_run=context.dry_run)
    uefi_apply(context, output, path, patched_table, input_mode="body")
    return output
