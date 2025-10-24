import { type JSX, type RefObject } from "preact";
import { type Signal } from "@preact/signals";
import { type CellFormatting } from "@/format/types.ts";

export interface VirtualTableViewProps {
  data: any[];
  columns: string[];
  initialWidth?: number;
  loading?: boolean;
  rowHeight?: number;
  buffer?: number;
  scrollContainerRef?: RefObject<HTMLElement>;
  selectedRows?: Signal<any[]>;
  groupStates?: Signal<Record<string, boolean>>;
  rowIdentifier?: string;
  expandedRows?: Signal<Record<string, boolean>>;
  tableAddon?: JSX.Element;
  cellFormatting?: Record<string, CellFormatting>;
  onColumnDrop?: (draggedColumn: string, targetColumn: string) => void;
  formatColumnName?: (a: string) => string;
  renderExpandedRow?: (row: any) => JSX.Element;
  columnExtensions?: (col: string) => JSX.Element;
  columnAction?: (col: string) => JSX.Element;
  onLoadMore?: () => void;
}
