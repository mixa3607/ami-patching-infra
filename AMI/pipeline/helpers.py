from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import subprocess
from typing import TYPE_CHECKING

import yaml

if TYPE_CHECKING:
    from .context import BuildContext


def require_file(path: Path, description: str) -> None:
    if not path.is_file():
        raise FileNotFoundError(f"{description} not found: {path}")


def run(command: list[str], *, dry_run: bool) -> None:
    print("+", " ".join(command))
    if not dry_run:
        subprocess.run(command, check=True)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_profile(path: Path) -> dict[str, object]:
    require_file(path, "board profile")
    profile = yaml.safe_load(path.read_text())
    if not isinstance(profile, dict):
        raise ValueError("board profile must be a YAML mapping")
    for key in ("board_root", "base_dump", "rom_prefix", "logos", "mcodes"):
        if key not in profile:
            raise ValueError(f"board profile is missing '{key}'")
    return profile


def git_version(repo_root: Path) -> str:
    if version := os.environ.get("REPO_GIT_REF"):
        return version
    tags = subprocess.run(
        ["git", "tag", "--points-at", "HEAD"], cwd=repo_root, text=True, capture_output=True, check=True
    ).stdout.splitlines()
    if tags:
        return tags[0].replace("+", "")
    return subprocess.run(
        ["git", "rev-parse", "--short", "HEAD"], cwd=repo_root, text=True, capture_output=True, check=True
    ).stdout.strip()


def write_manifest(context: BuildContext) -> None:
    manifest = {
        "version": context.version,
        "input": str(context.input_rom),
        "stages": context.completed,
        "final_rom": str(context.final_rom),
        "final_sha256": sha256(context.final_rom),
    }
    (context.build_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


def uefi_replace(context: BuildContext, rom: Path, guid: str, section_type: str, replacement: Path) -> None:
    tool = context.repo_root / "SOFTWARE" / "UEFITool_0.28.0" / "UEFIReplace"
    require_file(tool, "UEFIReplace")
    command = [str(tool), str(rom), guid, section_type, str(replacement), "-o", str(rom)]
    print("+", " ".join(command))
    if context.dry_run:
        return
    result = subprocess.run(command, check=False)
    if result.returncode not in (0, 41):
        raise subprocess.CalledProcessError(result.returncode, result.args)


def pending(stage: str) -> Path:
    raise NotImplementedError(f"Scope '{stage}' is not implemented yet.")
