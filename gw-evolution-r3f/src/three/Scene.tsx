import { Canvas } from "@react-three/fiber";
import { Html, PerspectiveCamera, useProgress } from "@react-three/drei";
import { Suspense, type PropsWithChildren } from "react";
import type { LoadedAppData } from "../data/load";

function LoadingOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          borderRadius: 8,
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
        }}
      >
        Loading… {Math.round(progress)}%
      </div>
    </Html>
  );
}

export type SceneProps = PropsWithChildren<{ data: LoadedAppData }>;

export function Scene({ data, children }: SceneProps) {
  // data is available for future scene composition
  void data;
  return (
    <Canvas dpr={[1, 2]} shadows>
      {/* Background to make shading readable */}
      <color attach="background" args={["#0f1015"]} />
      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={<LoadingOverlay />}>
        {/* Children will render within the lit scene */}
        {children}
      </Suspense>
    </Canvas>
  );
}
