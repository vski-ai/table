import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

declare module "@/module/types.ts" {
  interface TableState {
    selectedRows: Signal<(string | number)[]>;
  }
}

const SELECTED_ROWS_SET = "SELECTED_ROWS_SET";
export type RowsSelectCommand = Command<
  typeof SELECTED_ROWS_SET,
  (string | number)[]
>;

export function state(init: Record<string, any> | null) {
  return {
    selectedRows: signal(init?.selectedRows ?? []),
  };
}

export function persist(state: TableState) {
  return {
    selectedRows: state.selectedRows.value,
  };
}

export function mutate(state: TableState, command: RowsSelectCommand) {
  switch (command.type) {
    case "SELECTED_ROWS_SET": {
      state.selectedRows.value = command.payload;
      break;
    }
  }
}
