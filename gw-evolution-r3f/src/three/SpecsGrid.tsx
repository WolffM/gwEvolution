import * as THREE from "three";
import { a, useSprings } from "@react-spring/three";
import { Billboard, Image } from "@react-three/drei";
import { useMemo } from "react";
import type { LoadedAppData } from "../data/load";
import { useAppStore } from "../state/store";
import { getBasePositions, DEFAULT_RING_RADIUS, stackPositions } from "../lib/layout";
import { useThree } from "@react-three/fiber";

const ORDER_IDS = ["warrior", "priest", "druid", "mesmer", "mage", "rogue"] as const;

export function SpecsGrid({ data }: { data: LoadedAppData }) {
  const selectedId = useAppStore((s) => s.selectedBaseId);

  const base = useMemo(() => {
    if (!selectedId) return null;
    return data.baseById.get(selectedId) ?? null;
  }, [data.baseById, selectedId]);

  const { camera } = useThree();
  const anchor = useMemo(() => {
    if (!selectedId) return new THREE.Vector3(0, 0, 0);
    const idx = ORDER_IDS.indexOf(selectedId as (typeof ORDER_IDS)[number]);
    const ring = getBasePositions(DEFAULT_RING_RADIUS);
    const p = ring[idx] ?? [0, 0, 0];
  const base = new THREE.Vector3(p[0], 1.3, p[2]);
    // Offset toward the camera (on XZ-plane) for readability
    const dir = new THREE.Vector3().subVectors(camera.position, base).setY(0);
    if (dir.lengthSq() > 0.0001) dir.normalize(); else dir.set(1, 0, 0);
  return base.add(dir.multiplyScalar(0.9));
  }, [selectedId, camera.position.x, camera.position.y, camera.position.z]);

  const specs = base?.specs ?? [];
  const positions = useMemo(() => stackPositions(specs.length, 0.6), [specs.length]);

  const [springs] = useSprings(
    specs.length,
    (i) => {
      const baseY = positions[i] ? positions[i][1] : 0;
      return {
        from: { y: baseY + 0.6, o: 0 },
        to: { y: baseY, o: 1 },
        delay: i * 120,
        config: { tension: 170, friction: 22 },
      };
    },
    [positions]
  );

  if (!base) return null;

  return (
    <group>
      {specs.map((spec, i) => {
        const s = springs[i];
        if (!s) return null;
        const yAnimated = (s as any).y.to((v: number) => v + anchor.y);
        const o = (s as any).o;
  // Slight depth offset to prevent z-fighting/occlusion between stacked cards
  const dirToCam = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(anchor.x, anchor.y, anchor.z)).setY(0);
  if (dirToCam.lengthSq() > 0.0001) dirToCam.normalize(); else dirToCam.set(0, 0, 1);
  const depthGap = 0.01; // minimal spacing along camera axis
  const rank = i - (specs.length - 1) / 2; // -1,0,1
  const dx = dirToCam.x * rank * depthGap;
  const dz = dirToCam.z * rank * depthGap;
  const x = anchor.x + dx;
  const z = anchor.z + dz;
        return (
          <a.group key={spec.id} position-x={x} position-z={z} position-y={yAnimated}>
            {/* background plate */}
            <Billboard follow lockX lockZ position={[0, 0, 0]}>
              <a.mesh>
                <planeGeometry args={[0.72, 0.4]} />
                <a.meshStandardMaterial color={base.color} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} />
              </a.mesh>
            {/* icon sprite */}
              <a.group position={[0, 0, 0.01]}
              // Slight scale pop tied to opacity value
              scale-x={o}
              scale-y={o}
              scale-z={1}
            >
              <Image url={spec.icon} scale={0.4} />
              </a.group>
            </Billboard>
          </a.group>
        );
      })}
    </group>
  );
}
