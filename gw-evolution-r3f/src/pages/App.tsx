import { useEffect, useState } from "react";
import { Scene } from "../three/Scene";
import { loadAppData, type LoadedAppData } from "../data/load";

export default function AppPage() {
  const [data, setData] = useState<LoadedAppData | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    loadAppData().then(setData).catch(setError);
  }, []);

  if (error) return <div style={{ padding: 16 }}>Failed to load data.</div>;
  if (!data) return <div style={{ padding: 16 }}>Booting…</div>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Scene data={data}>
        {/* Temporary test geometry to visualize lights */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#91c9ff" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1e2129" roughness={1} metalness={0} />
        </mesh>
      </Scene>
    </div>
  );
}
