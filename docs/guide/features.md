# Features

What GW Evolution shows, and how to run it. Neither app deploys anywhere;
both run locally only.

## Hex-tile 3D scene

**What it does.** Six base classes sit on a ring of hex tiles in a
dungeon-styled 3D scene — cobblestone floor, stone walls, flickering
torches, built with no external texture files. Clicking a tile zooms the
camera onto that class and opens three specialization cards, joined to the
base tile by curved connection lines, with light postprocessing (bloom,
vignette, SMAA).

**How to use it.** `cd gw-evolution-r3f && npm install && npm run dev`,
then open the URL Vite prints (usually `http://localhost:5173`). Click a
hex tile to focus it, and use the HUD buttons in the top-right to move
between stages.

**What it does not do.** It needs WebGL2 — the README notes it
auto-disables multisampling on WebGL1 rather than failing outright. There
is no save state or server: every session starts from the same six
classes and eighteen specializations in `evolist.txt`.

## Legacy Dash chart

**What it does.** The original prototype: a Dash/Plotly app (`app.py`)
charting the same base-class-and-specialization data as a 2D landing view
and a grid view, superseded by the 3D scene the same day
([history](history.md)).

**How to use it.** `python -m venv .venv`, activate it,
`pip install -r requirements.txt`, `python app.py`, then open
`http://127.0.0.1:8050/`.

**What it does not do.** It has had no commits since the 3D scene
replaced it and is kept only as the earlier version.

## Trivia

Both apps read the same source file, `evolist.txt`, through
`data_loader.py`, which turns it into the `classes.json` the 3D scene
loads at runtime.
