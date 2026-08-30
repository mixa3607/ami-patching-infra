from __future__ import annotations

from pathlib import Path

from ..context import BuildContext
from ..helpers import pending


def run(context: BuildContext) -> Path:
    return pending("ifr")
