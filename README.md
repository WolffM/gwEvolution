# gwEvolution

This repo has two implementations of the RPG class visualization:

1) Legacy: Dash + Plotly (Python) — quick prototype in `app.py`.
2) New: React + TypeScript + @react-three/fiber (WebGL) — interactive 3D scene in `gw-evolution-r3f`.

Both read from the same data source (`evolist.txt` → `classes.json`). The React app validates and indexes the data at runtime.

## Run the new 3D app (recommended)

Requirements: Node 18+.

Windows PowerShell
```powershell
cd gw-evolution-r3f
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173 or :5174).

What you’ll see
- Landing: 6 hex tiles around a ring with subtle animation.
- Focus: click a class to frame it (camera zoom).
- Specs Grid: three spec cards billboarding near the selected class.
- Connections: curved links between specs with hover highlight.
- Dungeon vibe: cobblestone floor, stone walls, flickering torches, light postprocessing.

Controls
- Mouse/touch to hover and click.
- HUD buttons in the top-right to navigate stages.

Tech stack
- Vite + React + TypeScript (strict)
- @react-three/fiber, three.js, @react-three/drei
- Zustand state store, Zod schema validation
- @react-spring/three, Framer Motion, postprocessing (SMAA, Bloom, Vignette)

Project structure (web)
- `gw-evolution-r3f/src/pages/App.tsx` — app entry, HUD + Scene.
- `gw-evolution-r3f/src/three/Scene.tsx` — Canvas, camera, lights, fog, stage composition.
- `gw-evolution-r3f/src/three/Environment.tsx` — cobblestone floor, stone walls, torches.
- `gw-evolution-r3f/src/three/HexField.tsx` — six base tiles on a ring.
- `gw-evolution-r3f/src/three/HexClass.tsx` — single hex tile mesh.
- `gw-evolution-r3f/src/three/SpecsGrid.tsx` — three spec cards.
- `gw-evolution-r3f/src/three/Connections.tsx` — curved lines between specs.
- `gw-evolution-r3f/src/three/Effects.tsx` — particles + postprocessing.
- `gw-evolution-r3f/src/data/schema.ts` — Zod schemas for classes/specs/links.
- `gw-evolution-r3f/src/data/load.ts` — loads `classes.json`, builds `baseById`/`specById`.

Data
- Source of truth is `evolist.txt` (format: `Base – Spec`).
- Python script `data_loader.py` reads it with `config.json` and emits `classes.json` used by the web app.

## Run the legacy Dash app (optional)

Windows PowerShell
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:8050/

Files (Python)
- `app.py` — Dash app and callbacks.
- `models.py` — BaseClass, Specialization.
- `data_loader.py` — builds `classes.json` from `evolist.txt` + `config.json`.
- `viz.py` — Plotly figures (landing/grid).
- `anim.py` — easing helpers.

## Notes
- If the 3D app shows a black screen on enter connections, ensure your GPU supports WebGL2; the project auto-disables MSAA on WebGL1.
- The floor/walls are procedurally generated at runtime (no external textures), so the app works fully offline.
- To tweak visuals, see `Environment.tsx` (floor tiling, wall size, torch intensity) and `Effects.tsx` (bloom/vignette/SMAA).

