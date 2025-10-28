import { Signal } from "@preact/signals";
import { Command } from "./commands.ts";
import { CellFormatting } from "@/format/types.ts";

export interface TableState {
  drilldowns: Signal<string[]>;
  filters: Signal<any[]>;
  sorting: Signal<any[]>;
  columnOrder: Signal<string[]>;
  columnVisibility: Signal<Record<string, boolean>>;
  loading: Signal<boolean>;
  isMobile: Signal<boolean>;
  selectedRows: Signal<string[]>;
  expandedRows: Signal<string[]>;
  cellFormatting: Signal<Record<string, CellFormatting>>;
}

export interface TableStore {
  state: TableState;
  dispatch: (command: Command) => void;
}
