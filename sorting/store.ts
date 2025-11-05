import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { TableMeta } from "@/fetcher/types.ts";

import { SortState } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    sorting: Signal<SortState>;
  }
}

export enum CommandType {
  SORT_ADD = "SORT_ADD",
  SORT_REMOVE = "SORT_REMOVE",
  SORT_SET = "SORT_SET",
}

export function state(init: Record<string, any> | null) {
  return {
    sorting: signal(init?.sorting ?? {}),
  };
}

export function persist(_: TableState) {
  return {};
}

export function reducer<T>(state: TableState, command: Command<T>) {
  switch (command.type) {
    case CommandType.SORT_SET: {
      state.sorting.value = command.payload;
      break;
    }
  }
  return state;
}
