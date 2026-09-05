from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("bridge requires a prepared ROM")

    config = context.profile["bridge"]
    if not isinstance(config, dict):
        raise ValueError("board profile field 'bridge' must be a mapping")
    try:
        component = context.ami_dir / str(config["component"])
        efi_name = str(config["efi"])
        path = config["path"]
    except KeyError as error:
        raise ValueError(f"board profile bridge config is missing '{error.args[0]}'") from error

    require_file(component / "Makefile", "bridge Makefile")
    output = context.build_dir / "50-bridge.rom"
    work_dir = context.work_dir / "bridge"
    component_build_dir = work_dir / "component"
    bridge_efi = component_build_dir / efi_name

    print(f"Patching bridge in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    run_command(
        ["make", "-C", str(component), f"BUILD_DIR={component_build_dir}", "clean", "all"],
        dry_run=context.dry_run,
    )
    if not context.dry_run:
        require_file(bridge_efi, "built bridge EFI")
    uefi_apply(context, output, path, bridge_efi, input_mode="body")
    return output
