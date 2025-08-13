from __future__ import annotations

import math
from typing import List, Tuple


def ease_accel_quad(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t


def ease_smooth(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def to_polar(x: float, y: float) -> Tuple[float, float]:
    r = math.hypot(x, y)
    ang = math.atan2(y, x)
    return r, ang


def to_cart(r: float, ang: float) -> Tuple[float, float]:
    return r * math.cos(ang), r * math.sin(ang)


def shortest_angle_delta(a: float, b: float) -> float:
    d = (b - a + math.pi) % (2 * math.pi) - math.pi
    return d


def stage1_targets(base_positions: List[Tuple[float, float]], selected_idx: int, outer_radius: float = 1.0) -> List[Tuple[float, float]]:
    others = [(i, base_positions[i]) for i in range(len(base_positions)) if i != selected_idx]
    others_sorted = sorted(others, key=lambda it: math.atan2(it[1][1], it[1][0]))

    if others_sorted:
        _, first_pos = others_sorted[0]
        _, base_phase = to_polar(first_pos[0], first_pos[1])
    else:
        base_phase = -math.pi / 2

    targets = [(0.0, 0.0)] * len(base_positions)
    for k, (idx, _pos) in enumerate(others_sorted):
        ang = base_phase + 2 * math.pi * k / 5.0
        tx, ty = to_cart(outer_radius, ang)
        targets[idx] = (tx, ty)
    targets[selected_idx] = (0.0, 0.0)
    return targets


def interpolate_stage1_positions(base_positions: List[Tuple[float, float]], selected_idx: int, t: float, steps: int, outer_radius: float = 1.0) -> List[Tuple[float, float]]:
    u = ease_smooth(t / max(1, steps))
    targets = stage1_targets(base_positions, selected_idx, outer_radius)
    cur: List[Tuple[float, float]] = []
    for i, (x0, y0) in enumerate(base_positions):
        xt, yt = targets[i]
        if i == selected_idx:
            r0, a0 = to_polar(x0, y0)
            r = (1 - u) * r0
            x, y = to_cart(r, a0)
        else:
            r0, a0 = to_polar(x0, y0)
            rt, at = to_polar(xt, yt)
            r = r0 + (rt - r0) * u
            a = a0 + shortest_angle_delta(a0, at) * u
            x, y = to_cart(r, a)
        cur.append((x, y))
    return cur


def interpolate_stage2_positions(base_positions: List[Tuple[float, float]], selected_idx: int, t: float, steps: int, outer_radius: float = 1.0) -> List[Tuple[float, float]]:
    u = ease_accel_quad(t / max(1, steps))
    start = stage1_targets(base_positions, selected_idx, outer_radius)
    cur: List[Tuple[float, float]] = []
    for i, (x0, y0) in enumerate(start):
        if i == selected_idx:
            cur.append((0.0, 0.0))
        else:
            x = x0 + (0.0 - x0) * u
            y = y0 + (0.0 - y0) * u
            cur.append((x, y))
    return cur
