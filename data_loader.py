from __future__ import annotations

import json
import os
import re
from typing import Dict, List

from models import BaseClass, Specialization


def parse_evolist(path: str) -> Dict[str, List[str]]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing evolist file at {path}")
    with open(path, "r", encoding="utf-8") as f:
        lines = [ln.strip() for ln in f.readlines()]

    mapping: Dict[str, List[str]] = {}
    sep = re.compile(r"\s*[-\u2013\u2014]\s*")  # -, – (en), — (em)
    for ln in lines:
        if not ln:
            continue
        parts = sep.split(ln, maxsplit=1)
        if len(parts) != 2:
            continue
        base, spec = parts[0].strip(), parts[1].strip()
        if base and spec:
            mapping.setdefault(base, []).append(spec)
    return mapping


def load_config(config_path: str) -> dict:
    if not os.path.exists(config_path):
        # Defaults
        return {
            "palette": ["#E74C3C", "#9B59B6", "#3498DB", "#1ABC9C", "#F1C40F", "#E67E22"],
            "anim": {"steps1": 14, "steps2": 10, "interval_ms": 60},
        }
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_classes(evolist_path: str, palette: List[str]) -> List[BaseClass]:
    mapping = parse_evolist(evolist_path)
    bases_in_order = list(mapping.keys())  # keep file order
    classes: List[BaseClass] = []
    for i, base in enumerate(bases_in_order):
        specs = mapping[base]
        padded = (specs + ["Spec A", "Spec B", "Spec C"])[:3]
        classes.append(
            BaseClass(
                id=i,
                name=base,
                color=palette[i % len(palette)],
                specs=(Specialization(padded[0]), Specialization(padded[1]), Specialization(padded[2])),
            )
        )
    return classes


def export_classes_to_json(classes: List[BaseClass], out_path: str) -> None:
    data = {
        "classes": [
            {"id": c.id, "name": c.name, "color": c.color, "specs": [s.name for s in c.specs]} for c in classes
        ]
    }
    try:
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
