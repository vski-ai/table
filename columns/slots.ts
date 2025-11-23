import { SortedAddon } from "@/module/components/SortedAddon.ts";
import { ClassResolverCallback } from "@/module/types.ts";
import { type ColumnRendererCallback } from "./types.ts";

export const slots = () => ({
  headerprefixes: new SortedAddon<ColumnRendererCallback>(),
  lefttableheaders: new SortedAddon<ColumnRendererCallback>(),
  beforeheaders: new SortedAddon<ColumnRendererCallback>(),
  afterheaders: new SortedAddon<ColumnRendererCallback>(),
  righttableheaders: new SortedAddon<ColumnRendererCallback>(),
  headerclasses: new SortedAddon<ClassResolverCallback>(),
});
