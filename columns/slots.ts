import { SortedAddon } from "@xmod/mod.ts";
import { ClassResolverCallback } from "@/table/types.ts";
import { type ColumnRendererCallback } from "./types.ts";
import { ComponentChildren } from "preact";
import { renderSkeleton } from "./components/Skeleton.tsx";
import { CommonRendererCallback } from "@/table/types.ts";

declare module "@xmod/types.ts" {
  interface Slots extends ColumnSlots {}
}

type ColumnSlots = {
  header: {
    left: SortedAddon<ColumnRendererCallback>;
    right: SortedAddon<ColumnRendererCallback>;
    prefixes: SortedAddon<ColumnRendererCallback>;
    suffixes: SortedAddon<ColumnRendererCallback>;
    before: SortedAddon<CommonRendererCallback>;
    after: SortedAddon<CommonRendererCallback>;
    beforeEach: SortedAddon<ColumnRendererCallback>;
    afterEach: SortedAddon<ColumnRendererCallback>;
    classes: SortedAddon<ClassResolverCallback>;
    parentClasses: SortedAddon<ClassResolverCallback>;
    skeleton: (() => ComponentChildren)[];
  };
  column: {
    prefixes: SortedAddon<ColumnRendererCallback>;
    suffixes: SortedAddon<ColumnRendererCallback>;
    classes: SortedAddon<ClassResolverCallback>;
  };
};

export const slots = (): ColumnSlots => ({
  header: {
    left: new SortedAddon<ColumnRendererCallback>(),
    right: new SortedAddon<ColumnRendererCallback>(),
    prefixes: new SortedAddon<ColumnRendererCallback>(),
    suffixes: new SortedAddon<ColumnRendererCallback>(),
    before: new SortedAddon<CommonRendererCallback>(),
    after: new SortedAddon<CommonRendererCallback>(),
    classes: new SortedAddon<ClassResolverCallback>(),
    parentClasses: new SortedAddon<ClassResolverCallback>(),
    beforeEach: new SortedAddon<ColumnRendererCallback>(),
    afterEach: new SortedAddon<ColumnRendererCallback>(),
    skeleton: [renderSkeleton],
  },
  column: {
    classes: new SortedAddon<ClassResolverCallback>(),
    prefixes: new SortedAddon<ColumnRendererCallback>(),
    suffixes: new SortedAddon<ColumnRendererCallback>(),
  },
});
