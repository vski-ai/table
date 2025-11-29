import type { Store } from "@xmod/mod.ts";
import type { ComponentChildren } from "preact";
import type { WithRef } from "@/table/types.ts";
import type { RowData } from "@/row/mod.ts";

export type CellRendererCallback =
  & { columnName?: string }
  & ((
    opts: {
      column: string;
      row: RowData;
      store: Store;
      rowIndex?: number;
    } & WithRef,
  ) => ComponentChildren);
