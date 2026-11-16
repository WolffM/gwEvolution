---
title: GW Evolution
summary: >-
  A sketch, not a tool: the same fictional RPG class-evolution tree, six
  base classes branching into three specializations each, drawn two ways —
  a Plotly dashboard and a 3D hex-tile scene in the browser. Nothing here
  is deployed; both apps run locally only.
features:
  - name: Hex-tile 3D scene
    summary: 'Six base classes on a ring of hex tiles; click one to zoom in and see its three specializations.'
    anchor: hex-tile-3d-scene
  - name: Legacy Dash chart
    summary: 'The original Plotly/Dash prototype the 3D scene replaced.'
    anchor: legacy-dash-chart
trivia:
  - 'All four commits landed on the same day, 2025-08-13, from the first take (`29a2dc4`) to "we got some stuff working" (`82c58af`).'
  - 'The biggest commit, 4,667 lines across 28 files, built the entire React/three.js scene — camera, lighting, hex tiles, spec cards and postprocessing — in one commit (`84eb060`).'
  - 'A five-stage migration plan (`docs/executionplan.md`, Day 0 through Day 4) laid out building the 3D scene over several days; every commit it describes landed within the same single day (`29a2dc4`, `82c58af`).'
  - 'The class tree (`evolist.txt`) holds six base classes — Priest, Druid, Mesmer, Warrior, Mage, Rogue — each with three specializations, eighteen in all (`29a2dc4`).'
---

# GW Evolution

Two small apps, one data file. `evolist.txt` lists six base classes, each
with three specializations (`Base – Spec` per line); `data_loader.py` turns
that into `classes.json`. A Plotly/Dash app (`app.py`) was the first way to
look at it; a 3D scene built with Vite, React and `@react-three/fiber`
replaced it on the same day, framing each base class's hex tile and zooming
into its three specs on click.

Neither app talks to a server or saves anything — every run starts from
the same `evolist.txt`.

- [Features](features.md): what each app shows and how to run it.
- [Contributing](contributing.md): the architecture and the run commands.
- [History](history.md): one era, one day.
- [Trivia](trivia.md)

## Trivia

The whole repo — both apps, a 4,667-line commit building the entire 3D
scene among them — was written in a single day, 2025-08-13
([history](history.md#a-single-day-two-apps-2025-08-13)).
