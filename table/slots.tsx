import { SortedAddon } from "@xmod/mod.ts";
import { ClassResolverCallback, CommonRendererCallback } from "./types.ts";
import { ComponentChildren } from "preact";
import { RowSkeleton } from "@/row/mod.ts";

declare module "@xmod/types.ts" {
  interface Slots extends TableSlots {}
}

type TableSlots = {
  settings: {
    before: SortedAddon<CommonRendererCallback>;
    after: SortedAddon<CommonRendererCallback>;
  };
  table: {
    before: SortedAddon<CommonRendererCallback>;
    after: SortedAddon<CommonRendererCallback>;
    classes: SortedAddon<CommonRendererCallback>;
    skeleton: (() => ComponentChildren)[];
  };
};

export const slots = (): TableSlots => ({
  settings: {
    before: new SortedAddon<CommonRendererCallback>(),
    after: new SortedAddon<CommonRendererCallback>(),
  },
  table: {
    before: new SortedAddon<CommonRendererCallback>(),
    after: new SortedAddon<CommonRendererCallback>(),
    classes: new SortedAddon<ClassResolverCallback>(),
    skeleton: [() => <RowSkeleton />],
  },
});
