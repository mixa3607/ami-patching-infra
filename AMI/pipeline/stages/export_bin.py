from __future__ import annotations

import shutil
from pathlib import Path

from ..context import BuildContext
from ..helpers import sha256, write_manifest


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("export-bin requires a completed ROM build")

    output = context.final_rom
    print(f"Exporting {context.current_rom} -> {output}")
    if not context.dry_run:
        shutil.copyfile(context.current_rom, output)
        context.completed.append({"name": "export-bin", "rom": str(output), "sha256": sha256(output)})
        write_manifest(context)
    return output
