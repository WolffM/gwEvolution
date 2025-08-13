Migration steps (day-by-day style)

Day 0 (prep)

Export your Dash data to classes.json. Validate with Zod.
Collect icons/lotties; define color tokens.

Day 1

Scaffold Vite + deps.
Implement Scene, HexField, HexClass with landing layout + hover.

Day 2

Camera helpers; click → classFocus zoom; Hud + Nameplate (Framer+Lottie).
Add zustand store; wire stage transitions.

Day 3

SpecsGrid appear + stagger; basic Connections with a few sample links.
Add filters toolbar; reset/back flows.

Day 4

Polish: easing, timing, post-processing, textures, focus outlines, keyboard.
Perf pass (instancing, memoization), QA on 1080p/4K.