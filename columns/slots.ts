import { SortedAddon } from "@xmod/mod.ts";
import { ClassResolverCallback } from "@/table/types.ts";
import { type ColumnRendererCallback } from "./types.ts";
import { ComponentChildren } from "preact";
import { renderSkeleton } from "./components/Skeleton.tsx";
import { CommonRendererCallback } from "@/table/types.ts";

declare module "@xmod/types.ts" {
  interface Slots {
    beforeheader: SortedAddon<CommonRendererCallback>;
    afterheader: SortedAddon<CommonRendererCallback>;
    headerprefixes: SortedAddon<ColumnRendererCallback>;
    lefttableheaders: SortedAddon<ColumnRendererCallback>;
    righttableheaders: SortedAddon<ColumnRendererCallback>;
    beforeheaders: SortedAddon<ColumnRendererCallback>;
    afterheaders: SortedAddon<ColumnRendererCallback>;
    thclasses: SortedAddon<ClassResolverCallback>;
    headerclasses: SortedAddon<ClassResolverCallback>;
    headerskeleton: (() => ComponentChildren)[];
  }
}

export const slots = () => ({
  beforeheader: new SortedAddon<CommonRendererCallback>(),
  afterheader: new SortedAddon<CommonRendererCallback>(),
  headerprefixes: new SortedAddon<ColumnRendererCallback>(),
  lefttableheaders: new SortedAddon<ColumnRendererCallback>(),
  beforeheaders: new SortedAddon<ColumnRendererCallback>(),
  afterheaders: new SortedAddon<ColumnRendererCallback>(),
  righttableheaders: new SortedAddon<ColumnRendererCallback>(),
  thclasses: new SortedAddon<ClassResolverCallback>(),
  headerclasses: new SortedAddon<ClassResolverCallback>(),
  headerskeleton: [renderSkeleton],
});
