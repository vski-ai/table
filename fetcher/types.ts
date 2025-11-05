import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";

export interface DataLoadOptions {
  offset: number;
  limit: number;
  store: TableStore;
}

export interface TableMeta {
  id?: unknown;
}

export type DataLoadResult = {
  rows: Row[];
  total: number;
  meta: TableMeta;
};

export type DataLoadCallback = (
  options: DataLoadOptions,
) => Promise<DataLoadResult>;
