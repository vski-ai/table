import { Signal } from "@preact/signals";
import { Store } from "@/store/types.ts";
import { SortState } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    sorting: Signal<SortState>;
    leafSorting: Signal<Record<string, SortState>>;
  }
}

export enum CommandType {
  SORT_ADD = "SORT_ADD",
  SORT_REMOVE = "SORT_REMOVE",
  SORT_SET = "SORT_SET",
}

export const sorterStore: Store = {
  data: {
    sorting: {},
    leafSorting: {},
  },

  reducer: (state, command) => {
    if (command.type === CommandType.SORT_SET) {
      state.sorting.value = command.payload;
      state.dataLoadKey.value = new Date().getTime();
    }
    return state;
  },
};
