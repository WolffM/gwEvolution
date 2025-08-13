from __future__ import annotations

import math
from typing import List, Optional, Tuple

import plotly.graph_objects as go

from models import BaseClass


def circle_layout(n: int, radius: float = 1.0, phase: float = -math.pi / 2) -> List[Tuple[float, float]]:
    return [
        (radius * math.cos(phase + 2 * math.pi * i / n), radius * math.sin(phase + 2 * math.pi * i / n))
        for i in range(n)
    ]


def hex_with_alpha(hex_color: str, alpha: float) -> str:
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    a = max(0.0, min(1.0, alpha))
    return f"rgba({r},{g},{b},{a:.3f})"


def make_landing_figure(
    base_positions: List[Tuple[float, float]],
    classes: List[BaseClass],
    selected_idx: Optional[int] = None,
    *,
    show_text: bool = True,
    hover: bool = True,
) -> go.Figure:
    xs = [p[0] for p in base_positions]
    ys = [p[1] for p in base_positions]
    colors = [classes[i].color for i in range(len(classes))]
    texts = [classes[i].name for i in range(len(classes))]

    sizes = [52 if i == selected_idx else 44 for i in range(len(classes))]

    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=xs,
            y=ys,
            mode="markers+text" if show_text else "markers",
            text=texts if show_text else None,
            textposition="bottom center",
            marker=dict(symbol="hexagon", size=sizes, color=colors, line=dict(color="#222", width=1.5)),
            hoverinfo="text" if hover else "skip",
        )
    )

    fig.update_layout(
        title="Choose a Base Class",
        margin=dict(l=30, r=30, t=60, b=30),
        xaxis=dict(visible=False, scaleanchor="y", scaleratio=1, range=[-1.4, 1.4]),
        yaxis=dict(visible=False, range=[-1.4, 1.4]),
        plot_bgcolor="white",
        uirevision="static",
    )
    return fig


def make_grid_figure(classes: List[BaseClass], selected_idx: int) -> go.Figure:
    selected = classes[selected_idx]
    others = [c for c in classes if c.id != selected_idx]
    cols = [s.name for s in selected.specs]
    rows = [bc.name for bc in others]

    fig = go.Figure()

    for r, base in enumerate(others):
        for c in range(3):
            fig.add_shape(
                type="rect",
                x0=c - 0.5,
                x1=c + 0.5,
                y0=4 - r - 0.5,
                y1=4 - r + 0.5,
                line=dict(color="rgba(0,0,0,0.15)", width=1),
                fillcolor=hex_with_alpha(base.color, 0.12),
            )
            sel_spec = selected.specs[c].name
            combos = [f"{sel_spec} - {sp.name}" for sp in base.specs]
            cell_text = "<br>".join(combos)
            fig.add_annotation(
                x=c,
                y=4 - r,
                text=cell_text,
                showarrow=False,
                xanchor="center",
                yanchor="middle",
                font=dict(size=11, color="#222"),
                align="center",
            )

    for c, title in enumerate(cols):
        fig.add_annotation(x=c, y=4.8, text=title, showarrow=False, font=dict(size=16, color="#222"), xanchor="center", yanchor="bottom")

    for r, base in enumerate(others):
        fig.add_annotation(
            x=-0.7,
            y=4 - r,
            text=base.name,
            showarrow=False,
            font=dict(size=14, color=base.color),
            xanchor="right",
            yanchor="middle",
        )

    fig.add_annotation(x=-0.7, y=5.1, text=f"Combos with {selected.name}", showarrow=False, font=dict(size=14, color="#333"), xanchor="right", yanchor="bottom")

    fig.add_trace(go.Scatter(x=[-1, 3], y=[-1, 6], mode="markers", marker=dict(size=0, color="rgba(0,0,0,0)"), hoverinfo="skip", showlegend=False))

    fig.update_layout(
        title=f"{selected.name}: Specializations vs Other Classes",
        margin=dict(l=140, r=30, t=70, b=50),
        xaxis=dict(visible=False, range=[-1.0, 2.5], fixedrange=True),
        yaxis=dict(visible=False, range=[-0.5, 5.2], fixedrange=True, scaleanchor=None),
        plot_bgcolor="white",
    )
    return fig
