import { useEffect, useState } from "react";
import { Scene } from "../three/Scene";
import { loadAppData, type LoadedAppData } from "../data/load";
import { Sandbox } from "../Sandbox";
import { Hud } from "../ui/Hud";

export default function AppPage() {
  const [data, setData] = useState<LoadedAppData | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    loadAppData().then(setData).catch(setError);
  }, []);

  if (error) return <div style={{ padding: 16 }}>Failed to load data.</div>;
  if (!data) return <div style={{ padding: 16 }}>Booting…</div>;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Overlay sandbox for quick checks */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          <Sandbox />
        </div>
      </div>

  {/* HUD overlay */}
  <Hud data={data} />

      <Scene data={data}>
        {/* Environment now provides the dungeon floor and walls; no extra ground plane needed. */}
      </Scene>
    </div>
  );
}
