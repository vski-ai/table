import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, State } from "@xmod/mod.ts";
import { RowData } from "@/row/types.ts";

type GetCellValueOpts = { row: RowData; column: string };

type EditingStore = {
  editing: {
    cell: Signal<Record<string, boolean>>;
    rows: Signal<Record<string, RowData>>;
  };
};

declare module "@xmod/types.ts" {
  interface State extends EditingStore {}
  interface Store {
    getCurrentRowValue: ({ row }: { row: RowData }) => RowData;
    getCurrentCellValue: (opts: GetCellValueOpts) => string;
    isCellModified: (opts: GetCellValueOpts) => boolean;
  }
}

export const CELL_EDITING_SET = "CELL_EDITING_SET";
export const ROW_EDIT_UPDATE = "ROW_EDIT_UPDATE";
export const ROW_EDIT_UNDO = "ROW_EDIT_UNDO";

export type CellEditingSetCommand = Command<
  typeof CELL_EDITING_SET,
  Record<string, boolean>
>;

export type RowEditCommand = Command<typeof ROW_EDIT_UPDATE, RowData>;

export type RowEditUndoCommand = Command<
  typeof ROW_EDIT_UNDO,
  { row_id: string }
>;

export type EditingCommandType =
  | CellEditingSetCommand
  | RowEditCommand
  | RowEditUndoCommand;

export function state(persist: InferPersist<EditingStore>): EditingStore {
  const cell = signal({});
  const rows = signal(persist?.editing?.rows ?? {});

  return {
    editing: {
      cell,
      rows,
    },
  };
}

export function persist(_: State) {
  return {};
}

export function mutate(state: State, command: EditingCommandType) {
  switch (command.type) {
    case CELL_EDITING_SET:
      state.editing.cell.value = command.payload;
      break;
    case ROW_EDIT_UPDATE:
      state.editing.rows.value = {
        ...state.editing.rows.value,
        [command.payload.id]: command.payload,
      };
      break;
    case ROW_EDIT_UNDO: {
      const { [command.payload.row_id]: _, ...rest } = state.editing.rows.value;
      state.editing.rows.value = rest;
      state.fetcher.render_key.value = new Date().getTime();
      break;
    }
  }
}

export function methods(state: State) {
  return {
    getCurrentCellValue({ row, column }: GetCellValueOpts) {
      return state.editing.rows.value[row.id]?.[column] ?? row[column];
    },
    getCurrentRowValue({ row }: { row: RowData }) {
      return state.editing.rows.value[row.id] ?? row;
    },
    isCellModified({ row, column }: GetCellValueOpts) {
      const edited = state.editing.rows.value[row.id]?.[column];
      if (!edited) {
        return false;
      }
      return state.editing.rows.value[row.id]?.[column] !== row[column];
    },
  };
}
