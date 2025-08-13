import { useEffect, useState } from "react";
import { Scene } from "../three/Scene";
import { loadAppData, type LoadedAppData } from "../data/load";
import { Sandbox } from "../Sandbox";
import { HexClass } from "../three/HexClass";

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

      <Scene data={data}>
        {/* Temporary test geometry to visualize lights */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1e2129" roughness={1} metalness={0} />
        </mesh>

        {/* Sample Hex tiles */}
        <HexClass
          id="warrior"
          name="Warrior"
          color="#1ABC9C"
          position={[-2, 0.04, 0]}
          selected={false}
          onClick={(id) => console.log("tile click:", id)}
        />
        <HexClass
          id="priest"
          name="Priest"
          color="#E74C3C"
          position={[2, 0.04, 0]}
          selected={false}
          onClick={(id) => console.log("tile click:", id)}
        />
      </Scene>
    </div>
  );
}
