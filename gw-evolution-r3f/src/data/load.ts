import { AppData } from "./schema";
import type { TAppData } from "./schema";

export type Indexes = {
  baseById: Map<string, TAppData["classes"][number]>;
  specById: Map<string, { baseId: string; spec: { id: string; name: string; icon: string } }>;
};

export type LoadedAppData = TAppData & Indexes;

export async function loadAppData(): Promise<LoadedAppData> {
  // Dynamic import ensures JSON bundling and works in Vite
  const raw = await import("./classes.json");
  const parsed = AppData.parse(raw.default ?? raw);

  const baseById = new Map<string, TAppData["classes"][number]>();
  const specById = new Map<string, { baseId: string; spec: { id: string; name: string; icon: string } }>();

  for (const base of parsed.classes) {
    baseById.set(base.id, base);
    for (const spec of base.specs) {
      specById.set(spec.id, { baseId: base.id, spec });
    }
  }

  return { ...parsed, baseById, specById };
}
