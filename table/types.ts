import { type JSX, type RefObject } from "preact";
import { type Signal } from "@preact/signals";
import { TableStore } from "@/store/types.ts";

export type VirtualTableViewProps =
  & {
    data: any[];
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
    stickyGroupHeaders?: number;
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
