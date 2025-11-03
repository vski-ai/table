import { type JSX } from "preact";
import { TableStore } from "@/store/types.ts";
import { PluginContainer } from "@/plugin/mod.ts";
import { MutableRef } from "preact/hooks";

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

export type VirtualTableViewProps =
  & {
    onDataLoad: DataLoadCallback;
    columns: string[];
    store: TableStore;
    selectable?: boolean;
    initialWidth?: number;
    rowHeight?: number;
    buffer?: number;
    scrollContainerRef: MutableRef<HTMLElement>;
    rowIdentifier?: string;
    tableAddon?: JSX.Element;
    sortable?: boolean;
    enumerable?: boolean;
    groupable?: boolean;
    stickyGroupHeaderLevel?: number;
    onColumnDrop?: (draggedColumn: string, targetColumn: string) => void;
    formatColumnName?: (a: string) => string;
    columnExtensions?: (col: string) => JSX.Element;
    columnAction?: (col: string) => JSX.Element;
    plugins: PluginContainer;
  }
  & (
    | {
      expandable: true;
      renderExpand: (row: any) => JSX.Element;
    }
    | {
      expandable?: false;
    }
  );

export interface Row extends Record<string, any> {
  id: string | number;
  $group_by?: string;
  $is_group_root?: boolean;
  $group_level?: number;
  $parent_id?: string[] | number[];
}
