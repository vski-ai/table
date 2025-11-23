import { SortedAddon } from "@xmod/mod.ts";
import { ClassResolverCallback, CommonRendererCallback } from "./types.ts";
import { ComponentChildren } from "preact";
import { RowSkeleton } from "@/row/mod.ts";

declare module "@xmod/types.ts" {
  interface Slots {
    beforetable: SortedAddon<CommonRendererCallback>;
    aftertable: SortedAddon<CommonRendererCallback>;
    beforesettings: SortedAddon<CommonRendererCallback>;
    aftersettings: SortedAddon<CommonRendererCallback>;
    tableclasses: SortedAddon<CommonRendererCallback>;
    tableskeleton: (() => ComponentChildren)[];
  }
}

export const slots = () => ({
  beforesettings: new SortedAddon<CommonRendererCallback>(),
  aftersettings: new SortedAddon<CommonRendererCallback>(),
  beforetable: new SortedAddon<CommonRendererCallback>(),
  aftertable: new SortedAddon<CommonRendererCallback>(),
  tableclasses: new SortedAddon<ClassResolverCallback>(),
  tableskeleton: [() => <RowSkeleton />],
});
