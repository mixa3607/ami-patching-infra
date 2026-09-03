from __future__ import annotations

import json
from pathlib import Path
import subprocess

from ..context import BuildContext


def erase(rom: bytearray, offset: int, size: int) -> None:
    end = offset + size
    if offset < 0 or size < 0 or end > len(rom):
        raise ValueError(f"nvram_erase range {offset:#x}+{size:#x} outside ROM size {len(rom):#x}")
    rom[offset:end] = b"\xff" * size


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("nvram-erase requires a prepared ROM")

    config = context.profile["nvram_erase"]
    if not isinstance(config, dict):
        raise ValueError("board profile field 'nvram_erase' must be a mapping")
    entry_ids = config.get("entry_ids")
    if not isinstance(entry_ids, list) or not entry_ids:
        raise ValueError("board profile field 'nvram_erase.entry_ids' must be a non-empty list")

    tool = context.repo_root / "SOFTWARE" / "UEFITool_NE-cli" / "uefitool-ne-cli"
    inspect = context.work_dir / "nvram-erase.inspect.json"
    if not context.dry_run:
        context.work_dir.mkdir(parents=True, exist_ok=True)

    command = [str(tool), "inspect", str(context.current_rom), "--output", str(inspect)]
    print("+", " ".join(command))
    if not context.dry_run:
        subprocess.run(command, check=True)

    output = context.build_dir / "36-nvram-erase.rom"
    print(f"Erasing NVRAM ranges in {context.current_rom} -> {output}")
    if context.dry_run:
        return output

    entities = json.loads(inspect.read_text())["entities"]
    ranges: list[tuple[int, int]] = []
    for entry in entry_ids:
        entity = entities.get(str(entry))
        if entity is None:
            raise ValueError(f"nvram_erase entry_id not found in image: {entry!r}")
        ranges.append((int(entity["offset"]), int(entity["size"])))

    rom = bytearray(context.current_rom.read_bytes())
    for offset, size in ranges:
        erase(rom, offset, size)
    output.write_bytes(rom)

    check = output.read_bytes()
    for offset, size in ranges:
        if check[offset:offset + size] != b"\xff" * size:
            raise RuntimeError(f"nvram-erase verification failed at {offset:#x}+{size:#x}")
    return output
