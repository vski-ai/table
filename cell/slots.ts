import { SortedAddon } from "@xmod/mod.ts";
import type { ClassResolverCallback } from "@/table/types.ts";
import type { CellRendererCallback } from "./types.ts";

declare module "@xmod/types.ts" {
  interface Slots extends CellSlots {}
}

type CellSlots = {
  cell: {
    classes: SortedAddon<ClassResolverCallback>;
    attributes: SortedAddon;
    prefixes: SortedAddon<CellRendererCallback>;
    suffixes: SortedAddon<CellRendererCallback>;
  };
};

export const slots = (): CellSlots => ({
  cell: {
    classes: new SortedAddon<ClassResolverCallback>(),
    attributes: new SortedAddon(),
    prefixes: new SortedAddon<CellRendererCallback>(),
    suffixes: new SortedAddon<CellRendererCallback>(),
  },
});
