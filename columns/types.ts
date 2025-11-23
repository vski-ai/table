import type { Addon, ClassResolverCallback } from "@/module/types.ts";
import type { TableStore } from "@/module/store/types.ts";

declare module "@/module/types.ts" {
  interface Slots {
    headerprefixes: Addon<ColumnRendererCallback>;
    lefttableheaders: Addon<ColumnRendererCallback>;
    righttableheaders: Addon<ColumnRendererCallback>;
    beforeheaders: Addon<ColumnRendererCallback>;
    afterheaders: Addon<ColumnRendererCallback>;
    headerclasses: Addon<ClassResolverCallback>;
  }
}
export type ColumnRendererCallback = (opts: {
  column: string;
  store: TableStore;
}) => preact.ComponentChildren;
