import { SortedAddon } from "@/module/components/SortedAddon.ts";
import type { ClassResolverCallback } from "@/module/types.ts";

export const slots = () => ({
  columnclasses: new SortedAddon<ClassResolverCallback>(),
});
