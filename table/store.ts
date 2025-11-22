import { Signal, signal } from "@preact/signals";
import { Command, InferPersist } from "@/module/mod.ts";

type TableViewState = {
  table: {
    settings_dialog: Signal<boolean>;
    row_height: Signal<number>;
    column_width: Signal<number>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends TableViewState {}
}

export const SET_DEFAULT_ROW_HEIGHT = "SET_DEFAULT_ROW_HEIGHT";

export type TableSetDefaultRowHeight = Command<
  typeof SET_DEFAULT_ROW_HEIGHT,
  number
>;

export function state<T>(
  persist: InferPersist<TableViewState>,
): TableViewState {
  const settings_dialog = signal(false);
  const row_height = signal(persist?.table.row_height ?? 42);
  const column_width = signal(persist?.table.column_width ?? 250);
  return {
    table: {
      settings_dialog,
      row_height,
      column_width,
    },
  };
}

export function persist(state: TableViewState): InferPersist<TableViewState> {
  return {
    table: {
      row_height: state.table.row_height.value,
      column_width: state.table.column_width.value,
    },
  };
}

export function mutate(
  state: TableViewState,
  command: TableSetDefaultRowHeight,
) {
  switch (command.type) {
    case SET_DEFAULT_ROW_HEIGHT:
      state.table.row_height.value = command.payload;
      break;
  }
}
