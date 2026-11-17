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
