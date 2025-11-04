import { Signal } from "@preact/signals";
import { Command } from "./commands.ts";
import { CellFormatting } from "@/format/types.ts";
import { TableMeta } from "@/table/types.ts";

export interface Store {
  data?: Record<string, unknown>;
  reducer?: <T>(
    state: TableState,
    command: Command<T>,
  ) => TableState;
}

export type StickyPosition = "left" | "right" | false;
export interface TableState {
  [key: string]: any;
  expandedLevels: Signal<string[] | number[]>;
  filters: Signal<Record<string, string>>;
  loading: Signal<boolean>;
  dataLoadKey: Signal<number>;
  tableMeta: Signal<TableMeta>;
  selectedRows: Signal<string[]>;
  expandedRows: Signal<string[]>;
  cellFormatting: Signal<Record<string, CellFormatting>>;
  rowHeights: Signal<Record<string, number>>;
  resizingRow: Signal<{ rowId: string | number; height: number } | null>;
  focusedCell: Signal<{ tabIndex: number; rowIndex: number } | null>;
}

export interface TableStore {
  state: TableState;
  dispatch: <T>(command: Command<T>) => void;
  shouldReload: () => void;
}
