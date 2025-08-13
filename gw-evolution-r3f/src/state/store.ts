import { create } from "zustand";

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
  // actions
  selectBase: (id: string) => void;
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

  selectBase: (id) => set({ selectedBaseId: id }),

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
    set({
      stage: "landing",
      selectedBaseId: undefined,
      hoveredId: undefined,
      filters: { showLinks: true },
    }),
}));
