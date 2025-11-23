import type { ComponentChildren } from "preact";
import type {
  Addon,
  ClassResolverCallback,
  CommonRendererCallback,
  StyleResolverCallback,
  WithRef,
} from "@/table/types.ts";
import type { Store } from "@xmod/types.ts";

export interface RowData extends Record<string, string | number> {
  id: string | number;
}

declare module "@/fetcher/types.ts" {
  interface TableMeta {
    pinnedRows?: {
      top?: RowData[];
      bottom?: RowData[];
    };
  }
}

declare module "@xmod/types.ts" {
  interface Slots {
    cellprefixes: Addon<CellRendererCallback>;
    cellsuffixes: Addon<CellRendererCallback>;
    lefttablecells: Addon<CellRendererCallback>;
    righttablecells: Addon<CellRendererCallback>;
    beforepadding: Addon<CommonRendererCallback>;
    beforecells: Addon<CellRendererCallback>;
    aftercells: Addon<CellRendererCallback>;
    rowclasses: Addon<ClassResolverCallback>;
    rowstyles: Addon<StyleResolverCallback>;
  }
}

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
