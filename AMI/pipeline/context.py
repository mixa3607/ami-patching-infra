from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class BuildContext:
    repo_root: Path
    ami_dir: Path
    profile: dict[str, object]
    version: str
    build_dir: Path
    input_rom: Path
    dry_run: bool
    allow_dangerous: bool
    current_rom: Path | None = None
    completed: list[dict[str, str]] = field(default_factory=list)

    @property
    def work_dir(self) -> Path:
        return self.build_dir / "work"

    @property
    def board_dir(self) -> Path:
        return self.ami_dir / str(self.profile["board_root"])

    @property
    def final_rom(self) -> Path:
        return self.build_dir / f"{self.profile['rom_prefix']}-{self.version}.rom"
