import { a, useSprings } from "@react-spring/three";
import { getBasePositions } from "../lib/layout";
import { HexClass } from "./HexClass";
import { useAppStore } from "../state/store";

export function HexField() {
  // Demo bases; will be replaced with real data mapping later
  const bases = [
    { id: "warrior", name: "Warrior", color: "#1ABC9C" },
    { id: "priest", name: "Priest", color: "#E74C3C" },
    { id: "druid", name: "Druid", color: "#9B59B6" },
    { id: "mesmer", name: "Mesmer", color: "#3498DB" },
    { id: "mage", name: "Mage", color: "#F1C40F" },
    { id: "rogue", name: "Rogue", color: "#E67E22" },
  ] as const;

  const positions = getBasePositions(3);

  // Staggered springs for scale/opacity
  const [springs] = useSprings(bases.length, (i) => ({
    from: { s: 0.8, o: 0 },
    to: async (next) => {
      await new Promise((r) => setTimeout(r, i * 80));
      await next({ s: 1, o: 1 });
    },
    config: { tension: 220, friction: 18 },
  }));

  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const hoveredId = useAppStore((s) => s.hoveredId);
  const focusBase = useAppStore((s) => s.focusBase);
  const setHovered = useAppStore((s) => s.setHovered);

  return (
    <group>
      {bases.map((b, idx) => {
        const p = positions[idx] ?? [0, 0, 0];
        const spring = springs[idx]!; // springs length === bases.length
        return (
          <a.group key={b.id} scale-x={spring.s} scale-y={spring.s} scale-z={spring.s}>
            <HexClass
              id={b.id}
              name={b.name}
              color={b.color}
              position={[p[0], 0.04, p[2]]}
              selected={selectedBaseId === b.id}
              hovered={hoveredId === b.id}
              baseScale={1}
              opacity={spring.o}
              onClick={focusBase}
              onHoverChange={(h) => setHovered(h ? b.id : undefined)}
            />
          </a.group>
        );
      })}
    </group>
  );
}
