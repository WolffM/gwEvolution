# RPG Class Diagram (Dash + Plotly)

Interactive visualization for 6 RPG base classes with 3 specializations each.

- Landing: 6 colored hexagons for base classes.
- Click flow (2-stage animation):
	1) Clicked hex moves to center, others rotate into a 5-gon around it.
	2) All accelerate into center, then we transition to a grid.
- Grid: 3 specialization columns × 5 other base rows. Each cell lists the three combinations.

## Setup (Windows PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:8050/

## Project layout
- `app.py` — lightweight Dash app wiring and callbacks.
- `models.py` — data classes for BaseClass and Specialization.
- `data_loader.py` — loads `evolist.txt`, reads `config.json`, builds classes, writes `classes.json`.
- `viz.py` — plotting helpers (landing figure and grid figure).
- `anim.py` — easing and animation position interpolations.
- `evolist.txt` — source of truth, lines like `Mage – Evoker`.
- `config.json` — theme and animation settings.
- `classes.json` — generated snapshot of parsed classes/specs.

## Data/config
- Edit `evolist.txt` to change base classes and specs. Expected format per line: `Base – Spec` (hyphen or en/em dash supported).
- Edit `config.json` to tweak:
	- `palette`: 6 colors for base classes.
	- `anim.steps1`, `anim.steps2`, `anim.interval_ms`: animation smoothness vs performance.

## Customize the grid
- Each cell shows three lines: `<selected spec> - <row spec>` for all three row specs.
- You can add tooltips or badges by enhancing `viz.make_grid_figure`.

## Next steps
- Make each combo line clickable to drill into specialization links.
- Add metrics per combo (color/weight) if you have the 135 connections.

