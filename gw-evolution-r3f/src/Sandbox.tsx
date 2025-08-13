import { useAppStore } from "./state/store";

export function Sandbox() {
  const stage = useAppStore((s) => s.stage);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectBase = useAppStore((s) => s.selectBase);
  const nextStage = useAppStore((s) => s.nextStage);
  const prevStage = useAppStore((s) => s.prevStage);
  const reset = useAppStore((s) => s.reset);

  return (
    <div style={{ padding: 12, border: "1px solid #444", borderRadius: 8, marginTop: 12 }}>
      <div>Stage: {stage}</div>
      <div>Selected: {selectedBaseId ?? "(none)"}</div>
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
