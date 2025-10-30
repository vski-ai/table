import { type JSX, type RefObject } from "preact";
import { type Signal } from "@preact/signals";
import { TableStore } from "@/store/types.ts";

export type VirtualTableViewProps =
  & {
    data: Row[];
    columns: string[];
    store: TableStore;
    selectable?: boolean;
    initialWidth?: number;
    rowHeight?: number;
    buffer?: number;
    scrollContainerRef?: RefObject<HTMLElement>;
    groupStates?: Signal<Record<string, boolean>>;
    rowIdentifier?: string;
    tableAddon?: JSX.Element;
    sortable?: boolean;
    stickyGroupHeaderLevel?: number;
    onColumnDrop?: (draggedColumn: string, targetColumn: string) => void;
    formatColumnName?: (a: string) => string;
    columnExtensions?: (col: string) => JSX.Element;
    columnAction?: (col: string) => JSX.Element;
    onLoadMore?: () => void;
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
