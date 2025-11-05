import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { TableMeta } from "@/fetcher/types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    selectedRows: Signal<(string | number)[]>;
  }
}

export enum CommandType {
  SELECTED_ROWS_SET = "SELECTED_ROWS_SET",
}

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

export function reducer<T>(state: TableState, command: Command<T>) {
  switch (command.type) {
    case CommandType.SELECTED_ROWS_SET: {
      state.selectedRows.value = command.payload;
      break;
    }
  }
  return state;
}
