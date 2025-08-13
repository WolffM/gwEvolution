import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useAppStore } from "../state/store";
import type { LoadedAppData } from "../data/load";
import { Nameplate } from "./Nameplate";

export function Hud({ data }: { data: LoadedAppData }) {
  const stage = useAppStore((s) => s.stage);
  const selectedId = useAppStore((s) => s.selectedBaseId);
  const nextStage = useAppStore((s) => s.nextStage);
  const prevStage = useAppStore((s) => s.prevStage);

  const selectedBase = useMemo(() => {
    if (!selectedId) return null;
    return data.baseById.get(selectedId) ?? null;
  }, [data.baseById, selectedId]);

  const canNext = stage !== "connections" && !!selectedId;
  const canBack = stage !== "landing";

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
  pointerEvents: "none",
  zIndex: 20,
      }}
    >
      <AnimatePresence>
        {stage !== "landing" && selectedBase && (
          <motion.div
            key={selectedBase.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: "auto" }}
          >
            <Nameplate
              title={selectedBase.name}
              color={selectedBase.color}
              icon={selectedBase.icon}
              // lottieUrl can be added to data model later; fallback to icon
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: 8, marginLeft: "auto", pointerEvents: "auto" }}>
        <button
          onClick={prevStage}
          disabled={!canBack}
          style={btnStyle}
          aria-label="Back"
        >
          Back
        </button>
        <button
          onClick={nextStage}
          disabled={!canNext}
          style={btnStyle}
          aria-label="Next"
        >
          Next
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #3a3f4b",
  background: "#171a20",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
};
