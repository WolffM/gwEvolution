import { useMemo, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { Image, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Vec3 } from "../lib/layout";

export type HexClassProps = {
  id: string;
  name: string;
  color: string; // hex
  iconUrl?: string; // optional; if provided, rendered via <Image/>
  position: Vec3;
  selected?: boolean;
  hovered?: boolean;
  onClick?: (id: string) => void;
};

/** A thin hex tile with optional icon that gently bobs and scales on hover. */
export function HexClass({ id, color, iconUrl, position, selected = false, hovered = false, onClick }: HexClassProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const isHover = hovered || localHover;
  useCursor(isHover, 'pointer');

  // cache base position vector
  const basePos = useMemo(() => new Vector3(...position), [position[0], position[1], position[2]]);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;

    // Hover scale smoothing
    const target = isHover ? 1.05 : 1.0;
    g.scale.lerp(new Vector3(target, target, target), Math.min(1, dt * 8));

    // Subtle bobbing on Y
    const t = state.clock.getElapsedTime();
    const amp = 0.05;
    const speed = 1.2;
    g.position.set(basePos.x, basePos.y + Math.sin(t * speed + id.length) * amp + (selected ? 0.02 : 0), basePos.z);

    // Keep flat-top orientation
    g.rotation.y = Math.PI / 6; // rotate hex so it appears flat-top
  });

  return (
    <group ref={groupRef} onClick={() => onClick?.(id)}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); setLocalHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setLocalHover(false); }}
      >
        {/* Thin cylinder with 6 radial segments forms a hex prism */}
        <cylinderGeometry args={[0.9, 0.9, 0.08, 6]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Optional icon slightly above the top face */}
      {iconUrl ? (
        <group position={[0, 0.08 / 2 + 0.02, 0]}>
          <Image url={iconUrl} scale={0.9} transparent />
        </group>
      ) : null}
    </group>
  );
}
