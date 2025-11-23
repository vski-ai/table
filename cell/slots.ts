import { SortedAddon } from "@xmod/mod.ts";
import type { ClassResolverCallback } from "@/table/types.ts";

export const slots = () => ({
  columnclasses: new SortedAddon<ClassResolverCallback>(),
});
