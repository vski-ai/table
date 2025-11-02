import { type JSX, type RefObject } from "preact";
import { TableStore } from "@/store/types.ts";

export type DataLoadCallback = (
  options: {
    offset: number;
    limit: number;
    store: TableStore;
  },
) => Promise<{ rows: Row[]; total: number }>;

export type VirtualTableViewProps =
  & {
    onDataLoad: DataLoadCallback;
    columns: string[];
    store: TableStore;
    selectable?: boolean;
    initialWidth?: number;
    rowHeight?: number;
    buffer?: number;
    scrollContainerRef?: RefObject<HTMLElement>;
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
