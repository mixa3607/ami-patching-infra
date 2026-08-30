from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from .context import BuildContext


StageRunner = Callable[[BuildContext], Path]


@dataclass(frozen=True)
class Stage:
    name: str
    dependencies: tuple[str, ...]
    runner: StageRunner
    ready: bool
    dangerous: bool = False


def select_stages(stages: dict[str, Stage], requested: list[str]) -> list[Stage]:
    selected: set[str] = set()

    def include(name: str) -> None:
        if name not in stages:
            raise ValueError(f"Unknown scope: {name}")
        if name in selected:
            return
        for dependency in stages[name].dependencies:
            include(dependency)
        selected.add(name)

    for name in requested:
        include(name)
    return [stage for name, stage in stages.items() if name in selected]


def parse_scopes(values: list[str] | None, defaults: tuple[str, ...]) -> list[str]:
    if not values:
        return list(defaults)
    return [scope for value in values for scope in value.split(",") if scope]
