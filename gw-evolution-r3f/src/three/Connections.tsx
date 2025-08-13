import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useMemo, useState } from "react";
import type { LoadedAppData } from "../data/load";
import { getBasePositions, DEFAULT_RING_RADIUS, stackPositions } from "../lib/layout";

function bezierPoints(start: THREE.Vector3, end: THREE.Vector3, height = 1.2, segments = 32) {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const ctrl = mid.clone().add(new THREE.Vector3(0, height, 0));
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic Bezier: B(t) = (1-t)^2 S + 2(1-t)t C + t^2 E
    const p = new THREE.Vector3()
      .copy(start).multiplyScalar((1 - t) * (1 - t))
      .add(ctrl.clone().multiplyScalar(2 * (1 - t) * t))
      .add(end.clone().multiplyScalar(t * t));
    pts.push(p);
  }
  return pts;
}

export function Connections({ data }: { data: LoadedAppData }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const basePositions = useMemo(() => getBasePositions(DEFAULT_RING_RADIUS), []);
  const specYOffset = useMemo(() => stackPositions(3, 0.6).map((v) => v[1]), []);

  type LinkDef = {
    key: number;
    color: string;
    points: THREE.Vector3[]; // full path (max)
  };

  const links: LinkDef[] = useMemo(() => {
    const orderIds = ["warrior", "priest", "druid", "mesmer", "mage", "rogue"] as const;
    const baseIndex = new Map<string, number>(orderIds.map((id, idx) => [id, idx]));
    const out: LinkDef[] = [];

    data.links.forEach((lk, i) => {
      const from = data.specById.get(lk.from);
      const to = data.specById.get(lk.to);
      if (!from || !to) return;
      const fromBase = data.baseById.get(from.baseId);
      const toBase = data.baseById.get(to.baseId);
      if (!fromBase || !toBase) return;
      const fi = baseIndex.get(from.baseId) ?? 0;
      const ti = baseIndex.get(to.baseId) ?? 0;
      const fp = basePositions[fi] ?? [0, 0, 0];
      const tp = basePositions[ti] ?? [0, 0, 0];
      // y offset by spec index and baseline height
  const fiSpec = fromBase.specs.findIndex((s) => s.id === lk.from);
  const tiSpec = toBase.specs.findIndex((s) => s.id === lk.to);
  const fy = 1.3 + (specYOffset[((fiSpec + 3) % 3)] ?? 0);
  const ty = 1.3 + (specYOffset[((tiSpec + 3) % 3)] ?? 0);
      // small radial outward offset for clarity
      const fDir = new THREE.Vector3(fp[0], 0, fp[2]).normalize().multiplyScalar(0.2);
      const tDir = new THREE.Vector3(tp[0], 0, tp[2]).normalize().multiplyScalar(0.2);
      const start = new THREE.Vector3(fp[0] + fDir.x, fy, fp[2] + fDir.z);
      const end = new THREE.Vector3(tp[0] + tDir.x, ty, tp[2] + tDir.z);
      const color = toBase.color;
      const points = bezierPoints(start, end, 1.5);
      out.push({ key: i, color, points });
    });

    return out;
  }, [data, basePositions, specYOffset]);

  return (
    <group>
      {links.map((l, i) => {
        const isHover = hovered === i;
        const width = isHover ? 2.4 : 1.2;
        const opacity = hovered === null || isHover ? 0.9 : 0.25;
        return (
          <group
            key={l.key}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(null);
            }}
          >
            <Line
              points={l.points}
              color={l.color}
              lineWidth={width}
              transparent
              opacity={opacity}
              depthWrite={false}
              dashed
              dashScale={1}
              dashSize={0.35}
              gapSize={0.75}
              dashOffset={0}
            />
            {/* glow */}
            <Line
              points={l.points}
              color={l.color}
              lineWidth={width * 2.0}
              transparent
              opacity={0.06}
              depthWrite={false}
            />
          </group>
        );
      })}
    </group>
  );
}
