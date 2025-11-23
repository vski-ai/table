import type { Addon } from "@xmod/types.ts";
import type { ClassResolverCallback } from "@/table/types.ts";
import type { Store } from "@xmod/types.ts";

declare module "@xmod/types.ts" {
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
  store: Store;
}) => preact.ComponentChildren;
