# Contributing

There is no CI, no deploy and no test suite. The Python half and the React
half are two separate local apps that happen to read the same data.

## Architecture

```
evolist.txt (Base – Spec, one pair per line)
      |
      v
data_loader.py + config.json  -->  classes.json
      |                                   |
      v                                   v
app.py (Dash/Plotly)             gw-evolution-r3f/ (Vite + React + three.js)
```

| Piece             | Path                             | What it is                                           |
| ------------------ | --------------------------------- | ----------------------------------------------------- |
| Legacy prototype  | `app.py`, `models.py`, `viz.py`, `anim.py` | Dash app, Plotly figures, easing helpers              |
| Data loader       | `data_loader.py`, `config.json`, `evolist.txt` | builds `classes.json` from the text list              |
| 3D scene          | `gw-evolution-r3f/src/`           | Vite + React + TypeScript, `@react-three/fiber`, three.js, Zustand, Zod |

Inside the 3D scene: `src/three/Scene.tsx` holds the camera, lights, fog
and stage composition; `Environment.tsx` builds the floor, walls and
torches at runtime; `HexField.tsx` and `HexClass.tsx` place the six base
tiles; `SpecsGrid.tsx` and `Connections.tsx` draw the three specs and the
curved links between them once a class is focused.

## Running it

See [features.md](features.md) for both apps' run commands. The 3D scene
needs Node 18+; the legacy app needs Python with the packages in
`requirements.txt` (Dash and Plotly).

## Trivia

The repo's own migration plan (`docs/executionplan.md`) describes building
the 3D scene over five stages, Day 0 through Day 4 — scaffolding, camera
and hex tiles, stage transitions, the specs grid, then a polish pass — but
every stage it describes landed in the same real day,
2025-08-13 ([history](history.md#a-single-day-two-apps-2025-08-13)).
