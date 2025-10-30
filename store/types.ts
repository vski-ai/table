import { Signal } from "@preact/signals";
import { Command } from "./commands.ts";
import { CellFormatting } from "@/format/types.ts";
import { SortState } from "@/sorting/mod.ts";

export type StickyPosition = "left" | "right" | false;
export interface TableState {
  drilldowns: Signal<string[] | number[]>;
  filters: Signal<Record<string, string>>;
  sorting: Signal<SortState>;
  leafSorting: Signal<Record<string, SortState>>;
  columnOrder: Signal<string[]>;
  columnVisibility: Signal<Record<string, boolean>>;
  stickyColumns: Signal<Record<string, StickyPosition>>;
  loading: Signal<boolean>;
  isMobile: Signal<boolean>;
  selectedRows: Signal<string[]>;
  expandedRows: Signal<string[]>;
  cellFormatting: Signal<Record<string, CellFormatting>>;
  columnWidths: Signal<Record<string, number>>;
}

export interface TableStore {
  state: TableState;
  dispatch: (command: Command) => void;
}
