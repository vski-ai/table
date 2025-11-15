import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, TableState } from "@/module/mod.ts";

type TableViewState = {
  table: {
    settings_dialog: Signal<boolean>;
    row_height: Signal<number>;
    header_height: Signal<number>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends TableViewState {}
}

const SET_DEFAULT_ROW_HEIGHT = "SET_DEFAULT_ROW_HEIGHT";
const SET_HEADER_HEIGHT = "SET_HEADER_HEIGHT";

export type TableSetDefaultRowHeight = Command<
  typeof SET_DEFAULT_ROW_HEIGHT,
  number
>;

export function state<T>(
  persist: InferPersist<TableViewState>,
): TableViewState {
  const settings_dialog = signal(false);
  const row_height = signal(persist?.table.row_height ?? 42);
  const header_height = signal(persist?.table.row_height ?? 50);
  return {
    table: {
      settings_dialog,
      row_height,
      header_height,
    },
  };
}

export function persist(state: TableViewState): InferPersist<TableViewState> {
  return {
    table: {
      row_height: state.table.row_height.value,
      header_height: state.table.header_height.value,
    },
  };
}

export function mutate(
  state: TableViewState,
  command: TableSetDefaultRowHeight,
) {
  switch (command.type) {
    case "SET_DEFAULT_ROW_HEIGHT":
      state.table.row_height.value = command.payload;
      break;
  }
}
