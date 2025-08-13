gw-evolution-r3f/
  src/
    data/
      classes.json           # your exported data
      schema.ts              # zod schema for validation
    assets/
      icons/                 # class icons (png/svg/webp)
      lottie/                # .json Lottie animations
      fonts/
    lib/
      camera.ts              # camera helpers (zoomTo, dolly, focus)
      layout.ts              # hex/grid layouts, spacing utils
      easing.ts              # timing curves
    state/
      store.ts               # zustand store (stage, selected, hovered)
      machine.ts             # (optional) xstate config
    three/
      Scene.tsx              # root <Canvas> scene
      HexClass.tsx           # a single hex “class” mesh/sprite
      HexField.tsx           # landing layout (6 bases)
      SpecsGrid.tsx          # 3x? columns when focused
      Connections.tsx        # lines/curves between specs
      Effects.tsx            # bloom, vignette, particles (postprocessing)
    ui/
      Hud.tsx                # overlay UI (Framer Motion)
      Nameplate.tsx          # Lottie + text stats
      Toolbar.tsx            # filters, reset, theme toggle
      Tooltip.tsx
    pages/
      App.tsx
    styles/
      globals.css
  vite.config.ts
  package.json