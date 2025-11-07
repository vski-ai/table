import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { SortState } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    sorting: Signal<SortState>;
  }
}

const SORT_SET = "SORT_SET";
export type SortSetCommand = Command<typeof SORT_SET, SortState>;

export function state(init: Record<string, any> | null) {
  return {
    sorting: signal(init?.sorting ?? {}),
  };
}

export function persist(state: TableState) {
  return {
    sorting: state.sorting.value,
  };
}

export function reducer(state: TableState, command: SortSetCommand) {
  switch (command.type) {
    case "SORT_SET": {
      state.sorting.value = command.payload;
      break;
    }
  }
  return state;
}
