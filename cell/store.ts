import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { RowData } from "@/row/types.ts";

type CellsState = {
  cells: {
    selected: Signal<Record<string, boolean>>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends CellsState {}
  interface TableStore {
    getCellKey: (opts: { column: string; row: RowData }) => string;
  }
}

export const CELL_SELECT = "CELL_SELECT";
export const CELL_DESELECT = "CELL_DESELECT";
export const CELL_SELECT_RESET = "CELL_SELECT_RESET";

export type CellSelectCmd = Command<
  typeof CELL_SELECT,
  string
>;
export type CellDeselectCmd = Command<
  typeof CELL_DESELECT,
  string
>;
export type CellSelectResetCmd = Command<
  typeof CELL_SELECT_RESET,
  true
>;

export function state(): CellsState {
  const selected = signal({});
  return {
    cells: { selected },
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(
  state: TableState,
  cmd: CellSelectCmd | CellSelectResetCmd | CellDeselectCmd,
) {
  switch (cmd.type) {
    case CELL_SELECT:
      state.cells.selected.value = {
        ...state.cells.selected.value,
        [cmd.payload]: true,
      };
      break;
    case CELL_DESELECT:
      state.cells.selected.value = {
        ...state.cells.selected.value,
        [cmd.payload]: false,
      };
      break;
    case CELL_SELECT_RESET:
      if (cmd.payload) {
        state.cells.selected.value = {};
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
