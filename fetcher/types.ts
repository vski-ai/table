import { Store } from "@xmod/types.ts";
import { RowData } from "@/row/types.ts";

export interface DataLoadOptions {
  offset: number;
  limit: number;
  store: Store;
}

export interface TableMeta {
  id?: unknown;
}

export type DataLoadResult = {
  rows: RowData[];
  total: number;
  meta: TableMeta;
};

export type DataLoadCallback = (
  options: DataLoadOptions,
) => Promise<DataLoadResult>;
