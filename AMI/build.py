#!/usr/bin/env python3
"""Build the IMB760 AMI BIOS from independently selectable stages."""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import subprocess
import sys

from pipeline.context import BuildContext
from pipeline.helpers import git_version, load_profile, sha256, write_manifest
from pipeline.plan import Stage, parse_scopes, select_stages
from pipeline.stages import bridge, dmi, ifr, logos, mcodes, nvar_defaults, nvar_erase, prepare, validate


AMI_DIR = Path(__file__).resolve().parent
REPO_ROOT = AMI_DIR.parent
DEFAULT_SCOPES = ("prepare", "dmi", "logos", "ifr", "mcodes")
STAGES = {
    "prepare": Stage("prepare", (), prepare.run, ready=True),
    "dmi": Stage("dmi", ("prepare",), dmi.run, ready=True),
    "logos": Stage("logos", ("prepare",), logos.run, ready=True),
    "ifr": Stage("ifr", ("prepare",), ifr.run, ready=True),
    "mcodes": Stage("mcodes", ("prepare",), mcodes.run, ready=True),
    "bridge": Stage("bridge", ("prepare",), bridge.run, ready=False),
    "nvar-defaults": Stage("nvar-defaults", ("prepare",), nvar_defaults.run, ready=False),
    "nvar-erase": Stage("nvar-erase", ("prepare",), nvar_erase.run, ready=False, dangerous=True),
    "validate": Stage("validate", (), validate.run, ready=False),
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scopes", action="append", help="Comma-separated stages to run (default: prepare,dmi,logos,ifr,mcodes)")
    parser.add_argument("--input", type=Path, help="Base ROM; defaults to the profile base_dump")
    parser.add_argument("--profile", type=Path, default=AMI_DIR / "profiles" / "imb760.yaml")
    parser.add_argument("--version", help="Build version; defaults to REPO_GIT_REF, tag, or commit SHA")
    parser.add_argument("--build-dir", type=Path, help="Directory for ROM checkpoints and manifest")
    parser.add_argument("--dry-run", action="store_true", help="Print the selected plan without modifying files")
    parser.add_argument("--allow-dangerous", action="store_true", help="Allow stages that alter persistent NVAR state")
    parser.add_argument("--list-stages", action="store_true", help="List scopes and their migration status")
    args = parser.parse_args()

    if args.list_stages:
        for stage in STAGES.values():
            status = "ready" if stage.ready else "pending"
            danger = " dangerous" if stage.dangerous else ""
            print(f"{stage.name}: {status}{danger}")
        return 0

    try:
        profile = load_profile(args.profile.resolve())
        version = args.version or git_version(REPO_ROOT)
        build_dir = (args.build_dir or AMI_DIR / "build" / version).resolve()
        board_dir = AMI_DIR / str(profile["board_root"])
        input_rom = (args.input or board_dir / str(profile["base_dump"])).resolve()
        context = BuildContext(
            repo_root=REPO_ROOT,
            ami_dir=AMI_DIR,
            profile=profile,
            version=version,
            build_dir=build_dir,
            input_rom=input_rom,
            dry_run=args.dry_run,
            allow_dangerous=args.allow_dangerous,
        )

        for stage in select_stages(STAGES, parse_scopes(args.scopes, DEFAULT_SCOPES)):
            if stage.dangerous and not context.allow_dangerous:
                raise PermissionError(f"Scope '{stage.name}' requires --allow-dangerous")
            if not stage.ready:
                raise NotImplementedError(f"Scope '{stage.name}' is not implemented yet.")
            context.current_rom = stage.runner(context)
            if not context.dry_run:
                context.completed.append({"name": stage.name, "rom": str(context.current_rom), "sha256": sha256(context.current_rom)})

        if context.current_rom is None:
            raise RuntimeError("The selected plan did not produce a ROM")
        print(f"Final BIOS ROM: {context.final_rom}")
        if not context.dry_run:
            shutil.copyfile(context.current_rom, context.final_rom)
            write_manifest(context)
        return 0
    except (FileNotFoundError, NotImplementedError, PermissionError, RuntimeError, ValueError, subprocess.CalledProcessError) as error:
        print(f"build failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
