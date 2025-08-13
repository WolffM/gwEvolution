import { useAppStore } from "./state/store";
import { useEffect, useState } from "react";
import { getBasePositions, stackPositions, type Vec3 } from "./lib/layout";

export function Sandbox() {
  const stage = useAppStore((s) => s.stage);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectBase = useAppStore((s) => s.selectBase);
  const nextStage = useAppStore((s) => s.nextStage);
  const prevStage = useAppStore((s) => s.prevStage);
  const reset = useAppStore((s) => s.reset);

  const [deterministic, setDeterministic] = useState<{ ring: boolean; stack: boolean }>({
    ring: false,
    stack: false,
  });

  useEffect(() => {
    const r1 = getBasePositions(2);
    const r2 = getBasePositions(2);
    const s1 = stackPositions(3, 1);
    const s2 = stackPositions(3, 1);
    const eq = (a: Vec3[], b: Vec3[]) => JSON.stringify(a) === JSON.stringify(b);
    const ring = eq(r1, r2) && r1.length === 6;
    const stack = eq(s1, s2) && s1.length === 3;
    setDeterministic({ ring, stack });
    console.log("layout helpers:", { ringPositions: r1, stackPositions: s1, deterministic: { ring, stack } });
  }, []);

  return (
    <div style={{ padding: 12, border: "1px solid #444", borderRadius: 8, marginTop: 12 }}>
      <div>Stage: {stage}</div>
      <div>Selected: {selectedBaseId ?? "(none)"}</div>
      <div style={{ marginTop: 8 }}>
        Helpers OK → ring: {String(deterministic.ring)}, stack: {String(deterministic.stack)}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => selectBase("warrior")}>selectBase("warrior")</button>
        <button onClick={prevStage}>prevStage()</button>
        <button onClick={nextStage}>nextStage()</button>
        <button onClick={reset}>reset()</button>
      </div>
      <small>Guard: nextStage() from landing requires selectedBaseId.</small>
    </div>
  );
}
