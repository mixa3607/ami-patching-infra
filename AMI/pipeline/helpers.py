from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import subprocess
from typing import TYPE_CHECKING
from uuid import uuid4

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
    profile = load_yaml(path, "board profile")
    for key in ("board_root", "base_dump", "rom_prefix", "logos", "mcodes", "dmi", "ifr"):
        if key not in profile:
            raise ValueError(f"board profile is missing '{key}'")
    return profile


def load_yaml(path: Path, description: str) -> dict[str, object]:
    require_file(path, description)
    profile = yaml.safe_load(path.read_text())
    if not isinstance(profile, dict):
        raise ValueError(f"{description} must be a YAML mapping")
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


def uefi_apply(
    context: BuildContext, rom: Path, path: object, replacement: Path, *, input_mode: str
) -> None:
    if not isinstance(path, list) or not path:
        raise ValueError("UEFI target path must be a non-empty list")
    if input_mode not in ("body", "section"):
        raise ValueError("UEFI input mode must be body or section")

    tool = context.repo_root / "SOFTWARE" / "UEFITool_OE-cli" / "uefitool-oe-cli"
    require_file(tool, "uefitool-oe-cli")

    work_dir = context.work_dir / "uefi-oe"
    token = uuid4().hex
    manifest = work_dir / f"{rom.stem}-{token}.yaml"
    temporary_output = rom.with_name(f".{rom.name}.{token}.tmp")
    document = {
        "schema_version": 1,
        "operations": [{
            "name": replacement.name,
            "action": "replace",
            "path": path,
            "input": str(replacement.resolve()),
            "inputMode": input_mode,
        }],
    }
    command = [str(tool), "apply", str(rom), str(manifest), str(temporary_output)]
    print("+", " ".join(command))
    if context.dry_run:
        return

    require_file(replacement, "UEFI replacement input")
    work_dir.mkdir(parents=True, exist_ok=True)
    manifest.write_text(yaml.safe_dump(document, sort_keys=False))
    try:
        subprocess.run(command, check=True)
        temporary_output.replace(rom)
    finally:
        temporary_output.unlink(missing_ok=True)


def pending(stage: str) -> Path:
    raise NotImplementedError(f"Scope '{stage}' is not implemented yet.")
