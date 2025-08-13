import { Canvas } from "@react-three/fiber";
import { Html, PerspectiveCamera, useProgress } from "@react-three/drei";
import { Suspense, type PropsWithChildren, useEffect } from "react";
import type { LoadedAppData } from "../data/load";
import { HexField } from "./HexField";
import { SpecsGrid } from "./SpecsGrid";
import { Connections } from "./Connections";
import { Effects } from "./Effects";
import { Environment } from "./Environment";
import { useAppStore } from "../state/store";
import type { PerspectiveCamera as PCam } from "three";
import * as THREE from "three";
import { getBasePositions, DEFAULT_RING_RADIUS } from "../lib/layout";
import { zoomTo } from "../lib/camera";

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
  const stage = useAppStore((s) => s.stage);
  const setCamera = useAppStore((s) => s.setCamera);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const cameraRef = useAppStore((s) => s.camera);

  useEffect(() => {
    if (stage !== "specsGrid" || !selectedBaseId || !cameraRef) return;
    const orderIds = ["warrior", "priest", "druid", "mesmer", "mage", "rogue"] as const;
    const idx = orderIds.indexOf(selectedBaseId as (typeof orderIds)[number]);
    const pos = getBasePositions(DEFAULT_RING_RADIUS)[idx] ?? [0, 0, 0];
    const target = new THREE.Vector3(pos[0], 0.8, pos[2]);
    void zoomTo(cameraRef, target, { duration: 450, offset: new THREE.Vector3(3.2, 3.2, 3.2) });
  }, [stage, selectedBaseId, cameraRef]);

  useEffect(() => {
    if (stage !== "connections" || !selectedBaseId || !cameraRef) return;
    const orderIds = ["warrior", "priest", "druid", "mesmer", "mage", "rogue"] as const;
    const idx = orderIds.indexOf(selectedBaseId as (typeof orderIds)[number]);
    const pos = getBasePositions(DEFAULT_RING_RADIUS)[idx] ?? [0, 0, 0];
    const target = new THREE.Vector3(pos[0], 0.9, pos[2]);
    // Wider framing for connections stage
    void zoomTo(cameraRef, target, { duration: 450, offset: new THREE.Vector3(4.2, 4.2, 4.2) });
  }, [stage, selectedBaseId, cameraRef]);
  return (
    <Canvas dpr={[1, 2]} shadows>
      {/* Background and subtle fog for depth */}
      <color attach="background" args={["#0d0e11"]} />
      <fog attach="fog" args={["#0d0e11", 12, 36]} />
      <PerspectiveCamera
        makeDefault
        position={[6, 6, 6]}
        fov={45}
        onUpdate={(c) => c.lookAt(0, 0.25, 0)}
        ref={(ref: PCam | null) => setCamera(ref ?? undefined)}
      />
  {/* Low ambient; torches will add most light */}
  <ambientLight intensity={0.15} />
  {/* Soft key light to keep subjects readable */}
  <directionalLight position={[6, 10, 4]} intensity={0.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Suspense fallback={<LoadingOverlay />}>
  {/* Dungeon environment */}
  <Environment />
  {/* Children will render within the lit scene */}
  {(stage === "landing" || stage === "classFocus") && <HexField />}
        {stage === "specsGrid" && <SpecsGrid data={data} />}
        {stage === "connections" && (
          <>
            <SpecsGrid data={data} />
            <Connections data={data} />
          </>
        )}
        {children}
  <Effects />
      </Suspense>
    </Canvas>
  );
}
