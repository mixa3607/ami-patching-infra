from __future__ import annotations

from pathlib import Path
import shutil

from ..context import BuildContext
from ..helpers import require_file, run as run_command, uefi_apply


def run(context: BuildContext) -> Path:
    if context.current_rom is None:
        raise RuntimeError("mcodes requires a prepared ROM")

    config = context.profile["mcodes"]
    if not isinstance(config, dict):
        raise ValueError("board profile field 'mcodes' must be a mapping")

    try:
        base = context.board_dir / str(config["base"])
        table = context.board_dir / str(config["table"])
        fit = context.board_dir / str(config["fit"])
        catalog = context.repo_root / str(config["catalog"])
        container_path = config["container_path"]
        fit_path = config["fit_path"]
    except KeyError as error:
        raise ValueError(f"board profile mcodes config is missing '{error.args[0]}'") from error

    for path, description in ((base, "microcode base"), (table, "microcode table"), (fit, "FIT base")):
        require_file(path, description)
    if not catalog.is_dir():
        raise FileNotFoundError(f"microcode catalog not found: {catalog}")

    tool = context.repo_root / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
    require_file(tool, "uefi-mod-tools")
    output = context.build_dir / "40-mcodes.rom"
    work_dir = context.work_dir / "mcodes"
    microcodes = work_dir / "microcodes.bin"
    patched_fit = work_dir / "fit.bin"

    print(f"Patching microcodes in {context.current_rom} -> {output}")
    if not context.dry_run:
        work_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(context.current_rom, output)

    run_command(
        [str(tool), "uefi", "mcodes-combine", "--input", str(base), "--table", str(table), "--mcodes", str(catalog), "--output", str(microcodes)],
        dry_run=context.dry_run,
    )
    uefi_apply(context, output, container_path, microcodes, input_mode="body")
    run_command(
        [str(tool), "uefi", "fit-inject-mcodes", "--input", str(fit), "--table", str(table), "--mcodes", str(catalog), "--output", str(patched_fit)],
        dry_run=context.dry_run,
    )
    uefi_apply(context, output, fit_path, patched_fit, input_mode="body")
    return output
