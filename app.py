from __future__ import annotations

import os
from typing import List

from dash import Dash, dcc, html, Input, Output, State, ctx

from anim import interpolate_stage1_positions, interpolate_stage2_positions
from data_loader import build_classes, export_classes_to_json, load_config
from models import BaseClass
from viz import circle_layout, make_grid_figure, make_landing_figure


REPO_DIR = os.path.dirname(os.path.abspath(__file__))
EVOLIST_PATH = os.path.join(REPO_DIR, "evolist.txt")
CONFIG_PATH = os.path.join(REPO_DIR, "config.json")

config = load_config(CONFIG_PATH)
palette: List[str] = config.get("palette", ["#E74C3C", "#9B59B6", "#3498DB", "#1ABC9C", "#F1C40F", "#E67E22"])
anim_steps1: int = config.get("anim", {}).get("steps1", 14)
anim_steps2: int = config.get("anim", {}).get("steps2", 10)
anim_interval: int = config.get("anim", {}).get("interval_ms", 60)

BASE_CLASSES: List[BaseClass] = build_classes(EVOLIST_PATH, palette)
N_CLASSES = len(BASE_CLASSES)
assert N_CLASSES == 6, f"Expected 6 base classes in evolist.txt, got {N_CLASSES}"

export_classes_to_json(BASE_CLASSES, os.path.join(REPO_DIR, "classes.json"))

BASE_POSITIONS = circle_layout(N_CLASSES, radius=1.0)


def make_anim1_figure(selected_idx: int, t: int, steps: int):
    cur_positions = interpolate_stage1_positions(BASE_POSITIONS, selected_idx, t, steps, outer_radius=1.0)
    return make_landing_figure(cur_positions, BASE_CLASSES, selected_idx=selected_idx, show_text=False, hover=False)


def make_anim2_figure(selected_idx: int, t: int, steps: int):
    cur_positions = interpolate_stage2_positions(BASE_POSITIONS, selected_idx, t, steps, outer_radius=1.0)
    return make_landing_figure(cur_positions, BASE_CLASSES, selected_idx=selected_idx, show_text=False, hover=False)


app = Dash(__name__)
app.title = "RPG Class Diagram"

app.layout = html.Div(
    [
        dcc.Store(id="app-state", data={"mode": "landing", "selected": None}),
        dcc.Store(id="anim-state", data={"t": 0, "steps": anim_steps1, "steps2": anim_steps2}),
        dcc.Interval(id="anim-interval", interval=anim_interval, n_intervals=0, disabled=True),

        html.Div(
            [
                html.Button("\u2190 Back", id="back-btn", n_clicks=0, style={"display": "none", "marginBottom": "8px"}),
            ],
            id="controls",
            style={"padding": "8px 12px"},
        ),

        dcc.Graph(
            id="graph",
            figure=make_landing_figure(BASE_POSITIONS, BASE_CLASSES),
            style={"height": "85vh"},
            config={"displayModeBar": False},
            clear_on_unhover=True,
        ),
    ]
)


@app.callback(Output("back-btn", "style"), Input("app-state", "data"))
def toggle_back_button(app_state):
    mode = (app_state or {}).get("mode", "landing")
    return {"display": "inline-block", "marginBottom": "8px"} if mode == "grid" else {"display": "none", "marginBottom": "8px"}


@app.callback(
    Output("app-state", "data"),
    Output("anim-state", "data"),
    Output("anim-interval", "disabled"),
    Input("graph", "clickData"),
    Input("anim-interval", "n_intervals"),
    Input("back-btn", "n_clicks"),
    State("app-state", "data"),
    State("anim-state", "data"),
    prevent_initial_call=False,
)
def orchestrate(clickData, _n_intervals, back_clicks, app_state, anim_state):
    app_state = app_state or {"mode": "landing", "selected": None}
    anim_state = anim_state or {"t": 0, "steps": anim_steps1, "steps2": anim_steps2}
    mode = app_state.get("mode", "landing")
    selected = app_state.get("selected", None)
    t = anim_state.get("t", 0)
    steps = anim_state.get("steps", anim_steps1)
    steps2 = anim_state.get("steps2", anim_steps2)

    trigger = ctx.triggered_id

    if trigger == "back-btn":
        return {"mode": "landing", "selected": None}, {"t": 0, "steps": steps, "steps2": steps2}, True

    if trigger == "graph" and mode == "landing" and clickData:
        try:
            point_idx = clickData["points"][0]["pointIndex"]
        except Exception:
            point_idx = None
        if point_idx is not None and 0 <= point_idx < N_CLASSES:
            return {"mode": "anim1", "selected": point_idx}, {"t": 0, "steps": steps, "steps2": steps2}, False

    if trigger == "anim-interval" and mode in ("anim1", "anim2"):
        nxt = t + 1
        if mode == "anim1":
            if nxt >= steps:
                return {"mode": "anim2", "selected": selected}, {"t": 0, "steps": steps, "steps2": steps2}, False
            else:
                return {"mode": "anim1", "selected": selected}, {"t": nxt, "steps": steps, "steps2": steps2}, False
        else:
            if nxt >= steps2:
                return {"mode": "grid", "selected": selected}, {"t": steps2, "steps": steps, "steps2": steps2}, True
            else:
                return {"mode": "anim2", "selected": selected}, {"t": nxt, "steps": steps, "steps2": steps2}, False

    return app_state, anim_state, True if mode not in ("anim1", "anim2") else False


@app.callback(Output("graph", "figure"), Input("app-state", "data"), Input("anim-state", "data"))
def render(app_state, anim_state):
    app_state = app_state or {"mode": "landing", "selected": None}
    anim_state = anim_state or {"t": 0, "steps": anim_steps1, "steps2": anim_steps2}
    mode = app_state.get("mode", "landing")
    selected = app_state.get("selected", None)
    t = anim_state.get("t", 0)
    steps = anim_state.get("steps", anim_steps1)
    steps2 = anim_state.get("steps2", anim_steps2)

    if mode == "landing" or selected is None:
        return make_landing_figure(BASE_POSITIONS, BASE_CLASSES)
    elif mode == "anim1":
        return make_anim1_figure(selected_idx=selected, t=t, steps=steps)
    elif mode == "anim2":
        return make_anim2_figure(selected_idx=selected, t=t, steps=steps2)
    else:
        return make_grid_figure(BASE_CLASSES, selected_idx=selected)


if __name__ == "__main__":
    app.run(debug=True)
