import { Signal } from "@preact/signals";
import { Command } from "./commands.ts";
import { CellFormatting } from "@/format/types.ts";
import { TableMeta } from "@/table/types.ts";

export interface TableState {
  [key: string]: unknown;

  cellFormatting: Signal<Record<string, CellFormatting>>;
  focusedCell: Signal<{ tabIndex: number; rowIndex: number } | null>;
}

export interface TableStore {
  state: TableState;
  dispatch: <T>(command: Command<T>) => void;
  shouldReload: () => void;
}
