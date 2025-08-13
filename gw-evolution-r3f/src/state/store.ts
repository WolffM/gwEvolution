import { create } from "zustand";
import * as THREE from "three";
import { getBasePositions, DEFAULT_RING_RADIUS } from "../lib/layout";
import { zoomTo } from "../lib/camera";

export type Stage = "landing" | "classFocus" | "specsGrid" | "connections";

export type Filters = {
  showLinks: boolean;
  byWeight?: [number, number];
};

export type StoreState = {
  stage: Stage;
  selectedBaseId: string | undefined;
  hoveredId: string | undefined;
  filters: Filters;
  camera: THREE.PerspectiveCamera | undefined;
  // actions
  selectBase: (id: string) => void;
  setHovered: (id: string | undefined) => void;
  setCamera: (cam: THREE.PerspectiveCamera | undefined) => void;
  focusBase: (id: string) => Promise<void>;
  nextStage: () => void;
  prevStage: () => void;
  reset: () => void;
};

const order: Stage[] = ["landing", "classFocus", "specsGrid", "connections"];

export const useAppStore = create<StoreState>((set) => ({
  stage: "landing",
  selectedBaseId: undefined,
  hoveredId: undefined,
  filters: { showLinks: true },
  camera: undefined,

  selectBase: (id) => set({ selectedBaseId: id }),
  setHovered: (id) => set({ hoveredId: id }),
  setCamera: (cam) => set({ camera: cam }),

  focusBase: async (id) => {
    set({ selectedBaseId: id, stage: "classFocus" });
    const orderIds = ["warrior", "priest", "druid", "mesmer", "mage", "rogue"] as const;
    const idx = orderIds.indexOf(id as (typeof orderIds)[number]);
    const pos = getBasePositions(DEFAULT_RING_RADIUS)[idx] ?? [0, 0, 0];
    const target = new THREE.Vector3(pos[0], 0.1, pos[2]);
    const cam = useAppStore.getState().camera;
    if (cam) {
      await zoomTo(cam, target, { duration: 700, offset: new THREE.Vector3(2.2, 2.2, 2.2) });
    }
  },

  nextStage: () =>
    set((state) => {
      if (state.stage === "landing" && !state.selectedBaseId) return state;
      const idx = order.indexOf(state.stage);
      const next = order[idx + 1];
      if (!next) return state;
      return { stage: next };
    }),

  prevStage: () =>
    set((state) => {
      const idx = order.indexOf(state.stage);
      const prev = order[idx - 1];
      if (!prev) return state;
      return { stage: prev };
    }),

  reset: () =>
    set((state) => {
      // Reset camera to initial position/lookAt if available
      const cam = state.camera;
      if (cam) {
        cam.position.set(6, 6, 6);
        cam.lookAt(0, 0.25, 0);
      }
      return {
        stage: "landing",
        selectedBaseId: undefined,
        hoveredId: undefined,
        filters: { showLinks: true },
      };
    }),
}));
