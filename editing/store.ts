import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { RowData } from "../row/types.ts";

type GetCellValueOpts = { row: RowData; column: string };
declare module "@/module/types.ts" {
  interface TableState {
    cellEditing: Signal<Record<string, boolean>>;
    rowEdits: Signal<Record<string, RowData>>;
    // we'll treat external edits differently, this should be in a separate module
    rowAgentEdits: Signal<Record<string, RowData>>;
  }
  interface TableStore {
    getCurrentRowValue: ({ row }: { row: RowData }) => RowData;
    getCurrentCellValue: (opts: GetCellValueOpts) => string;
    isCellModified: (opts: GetCellValueOpts) => boolean;
  }
}

const CELL_EDITING_SET = "CELL_EDITING_SET";
const ROW_EDIT_UPDATE = "ROW_EDIT_UPDATE";

export type CellEditingSetCommand = Command<
  typeof CELL_EDITING_SET,
  Record<string, boolean>
>;

export type RowEditCommand = Command<
  typeof ROW_EDIT_UPDATE,
  RowData
>;

export type EditingCommandType = CellEditingSetCommand | RowEditCommand;

export function state(init: Record<string, any> | null) {
  const cellDataTypes = signal(init?.cellDataTypes ?? {});
  const rowEdits = signal(init?.rowEdits ?? {});
  const rowAgentEdits = signal({});
  const cellEditing = signal({});
  return {
    cellDataTypes,
    cellEditing,
    rowAgentEdits,
    rowEdits,
  };
}

export function persist(state: TableState) {
  return {
    // rowEdits: state.rowEdits.value
  };
}

export function mutate(state: TableState, command: EditingCommandType) {
  switch (command.type) {
    case "CELL_EDITING_SET":
      state.cellEditing.value = command.payload;
      break;
    case "ROW_EDIT_UPDATE":
      state.rowEdits.value = {
        ...state.rowEdits.value,
        [command.payload.id]: command.payload,
      };
      break;
  }
}

export function methods(state: TableState) {
  return {
    getCurrentCellValue({ row, column }: GetCellValueOpts) {
      return state.rowEdits.value[row.id]?.[column] ?? row[column];
    },
    getCurrentRowValue({ row }: { row: RowData }) {
      return state.rowEdits.value[row.id] ?? row;
    },
    isCellModified({ row, column }: GetCellValueOpts) {
      const edited = state.rowEdits.value[row.id]?.[column];
      if (!edited) {
        return false;
      }
      return state.rowEdits.value[row.id]?.[column] !== row[column];
    },
  };
}
