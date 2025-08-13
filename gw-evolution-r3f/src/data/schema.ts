import { z } from "zod";

export const Specialization = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(), // /assets/icons/...
});

export const BaseClass = z.object({
  id: z.string(), // "warrior"
  name: z.string(),
  color: z.string(), // hex for base tint
  icon: z.string(),
  specs: z.array(Specialization).length(3),
});

export const Link = z.object({
  from: z.string(), // spec.id
  to: z.string(), // spec.id
  weight: z.number().optional(), // thickness/alpha
});

export const AppData = z.object({
  classes: z.array(BaseClass).length(6),
  links: z.array(Link), // between specs
});

export type TAppData = z.infer<typeof AppData>;
