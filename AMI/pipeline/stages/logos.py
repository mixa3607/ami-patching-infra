from __future__ import annotations

import os
from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("logos requires a prepared ROM")

    output = context.build_dir / "20-logos.rom"
    logos_work_dir = context.work_dir / "logos"
    annotation = f"Patched by mixa3607\n{context.version}"
    logo_specs = context.profile["logos"]
    if not isinstance(logo_specs, list):
        raise ValueError("board profile field 'logos' must be a list")

    print(f"Patching logos in {context.current_rom} -> {output}")
    if not context.dry_run:
        logos_work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    for logo in logo_specs:
        if not isinstance(logo, dict):
            raise ValueError("board profile logo entries must be objects")
        point_size = str(logo["point_size"])
        source = context.board_dir / str(logo["source"])
        rendered = logos_work_dir / source.name
        require_file(source, "logo source")
        command = ["convert", str(source), 
                   "-gravity", "NorthWest", 
                   "-pointsize", point_size, 
                   "-fill", "white",
                   "-font", "DejaVu-Sans",
                   "-annotate", "-0-3", annotation, 
                   f"BMP3:{rendered}",
                   ]
        run_command(command, dry_run=context.dry_run)
        uefi_apply(context, output, logo["path"], rendered, input_mode="body")

    return output
