import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { RowData } from "@/row/types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    selectedCells: Signal<Record<string, boolean>>;
  }
  interface TableStore {
    getCellKey: (opts: { column: string; row: RowData }) => string;
  }
}

const CELL_SELECT = "CELL_SELECT";
const CELL_SELECT_RESET = "CELL_SELECT_RESET";

export type CellSelectCmd = Command<
  typeof CELL_SELECT,
  string
>;
export type CellSelectResetCmd = Command<
  typeof CELL_SELECT_RESET,
  true
>;

export function state() {
  const selectedCells = signal({});
  return {
    selectedCells,
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(
  state: TableState,
  cmd: CellSelectCmd | CellSelectResetCmd,
) {
  switch (cmd.type) {
    case "CELL_SELECT":
      state.selectedCells.value = {
        ...state.selectedCells.value,
        [cmd.payload]: true,
      };
      break;
    case "CELL_SELECT_RESET":
      if (cmd.payload) {
        state.selectedCells.value = {};
      }
      break;
  }
}

export function methods(_: TableState) {
  return {
    getCellKey({ column, row }: { column: string; row: RowData }) {
      return row.id + "/" + column;
    },
  };
}
