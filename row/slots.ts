import { SortedAddon } from "@xmod/mod.ts";
import type {
  ClassResolverCallback,
  CommonRendererCallback,
  StyleResolverCallback,
} from "@/table/types.ts";
import type { CellRendererCallback } from "./types.ts";

export const slots = () => ({
  cellprefixes: new SortedAddon<CellRendererCallback>(),
  cellsuffixes: new SortedAddon<CellRendererCallback>(),
  lefttablecells: new SortedAddon<CellRendererCallback>(),
  beforecells: new SortedAddon<CellRendererCallback>(),
  aftercells: new SortedAddon<CellRendererCallback>(),
  beforepadding: new SortedAddon<CommonRendererCallback>(),
  righttablecells: new SortedAddon<CellRendererCallback>(),
  rowclasses: new SortedAddon<ClassResolverCallback>(),
  rowstyles: new SortedAddon<StyleResolverCallback>(),
});
