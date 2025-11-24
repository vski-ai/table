import type { Store } from "@xmod/types.ts";
import { MutableRef } from "preact/hooks";

declare module "@xmod/types.ts" {
  interface Store {
    headerRef?: MutableRef<HTMLElement | null>;
  }
}

export type ColumnRendererCallback = (opts: {
  column: string;
  store: Store;
}) => preact.ComponentChildren;
