from __future__ import annotations

import os
from pathlib import Path
import re
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, sha256, write_manifest


_SIZE_UNITS = {"b": 1, "kb": 1024, "mb": 1024 * 1024, "gb": 1024 * 1024 * 1024}


def _parse_size(value: object) -> int:
    if not isinstance(value, str):
        raise ValueError("board profile field 'export_iso.iso_size' must be a size string")
    match = re.fullmatch(r"(\d+)\s*(b|kb|mb|gb)", value.lower())
    if match is None or int(match.group(1)) == 0:
        raise ValueError("board profile field 'export_iso.iso_size' must use a positive B, KB, MB, or GB value")
    return int(match.group(1)) * _SIZE_UNITS[match.group(2)]


def _profile_files(context: BuildContext, config: dict[str, object]) -> list[tuple[Path, Path]]:
    add_files = config.get("add_files")
    if not isinstance(add_files, list) or not all(isinstance(item, str) for item in add_files):
        raise ValueError("board profile field 'export_iso.add_files' must be a list of paths")

    files: list[tuple[Path, Path]] = []
    for item in add_files:
        destination = Path(item)
        if destination.is_absolute() or ".." in destination.parts:
            raise ValueError(f"export_iso file path must stay within the board directory: {item}")
        source = context.board_dir / destination
        require_file(source, f"export_iso file '{item}'")
        files.append((source, destination))
    return files


def run(context: BuildContext) -> Path:
    if context.current_rom != context.final_rom:
        raise RuntimeError("export-iso requires the final BIN from export-bin")

    config = context.profile.get("export_iso")
    if not isinstance(config, dict) or not isinstance(config.get("iso_name"), str):
        raise ValueError("board profile field 'export_iso' requires iso_name")
    iso_size = _parse_size(config.get("iso_size"))
    iso_name = Path(str(config["iso_name"]).format(version=context.version))
    if iso_name.name != str(iso_name) or iso_name.suffix.lower() != ".iso":
        raise ValueError("board profile field 'export_iso.iso_name' must be an ISO filename")
    files = _profile_files(context, config)

    xorriso = shutil.which("xorriso")
    if xorriso is None:
        raise FileNotFoundError("xorriso not found in PATH")
    require_file(context.final_rom, "final BIN")

    output = context.build_dir / iso_name
    staging = context.work_dir / "export-iso"
    print(f"Exporting {context.final_rom} -> {output}")
    if not context.dry_run:
        shutil.rmtree(staging, ignore_errors=True)
        staging.mkdir(parents=True)
        shutil.copyfile(context.final_rom, staging / context.final_rom.name)
        for source, destination in files:
            target = staging / destination
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)

    run_command([xorriso, "-as", "mkisofs", "-iso-level", "3", "-o", str(output), str(staging)], dry_run=context.dry_run)
    if not context.dry_run:
        actual_size = output.stat().st_size
        if actual_size > iso_size:
            raise RuntimeError(f"ISO is {actual_size} bytes, larger than configured size {iso_size}")
        os.truncate(output, iso_size)
        context.completed.append({"name": "export-iso", "rom": str(output), "sha256": sha256(output)})
        write_manifest(context)
    return output
