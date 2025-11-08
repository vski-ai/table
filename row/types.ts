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
