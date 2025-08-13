from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple


@dataclass(frozen=True)
class Specialization:
    name: str


@dataclass(frozen=True)
class BaseClass:
    id: int
    name: str
    color: str
    specs: Tuple[Specialization, Specialization, Specialization]
