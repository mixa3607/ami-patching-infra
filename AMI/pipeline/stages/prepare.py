from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file


def run(context: BuildContext) -> Path:
    output = context.build_dir / "00-prepare.rom"
    require_file(context.input_rom, "base ROM")
    if context.input_rom.is_relative_to(context.build_dir):
        raise ValueError("--input must be outside --build-dir because prepare clears its workspace")

    print(f"Preparing {context.input_rom} -> {output}")
    if not context.dry_run:
        shutil.rmtree(context.build_dir, ignore_errors=True)
        context.build_dir.mkdir(parents=True, exist_ok=True)
        context.work_dir.mkdir(exist_ok=True)
        shutil.copyfile(context.input_rom, output)
    return output
