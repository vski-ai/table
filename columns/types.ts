import type { Store } from "@xmod/types.ts";

export type ColumnRendererCallback = (opts: {
  column: string;
  store: Store;
}) => preact.ComponentChildren;
