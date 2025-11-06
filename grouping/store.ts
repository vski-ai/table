import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { SortState } from "@/sorting/types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    expandedLevels: Signal<string[]>;
    groupBy: Signal<string[] | null>;
    groupSorting: Signal<Record<string, SortState>>;
  }
}

const EXPANDED_LEVELS_SET = "EXPANDED_LEVELS_SET";
const LEAF_SORT_SET = "LEAF_SORT_SET";

export type ExpandSetCommand = Command<typeof EXPANDED_LEVELS_SET, string>;
export type LeafSortCommand = Command<
  typeof LEAF_SORT_SET,
  Record<string, SortState>
>;
export type GroupingCommand = ExpandSetCommand | LeafSortCommand;

export function state<T>(init: Record<string, T> | null) {
  return {
    groupBy: signal([]),
    expandedLevels: signal(init?.expandedLevels ?? []),
    groupSorting: signal(init?.groupSorting ?? {}),
  };
}

export function persist(state: TableState) {
  return {
    expandedLevels: state.expandedLevels.value,
    groupSorting: state.groupSorting.value,
  };
}

export function reducer(state: TableState, command: GroupingCommand) {
  switch (command.type) {
    case "EXPANDED_LEVELS_SET":
      state.expandedLevels.value =
        state.expandedLevels.value.includes(command.payload as never)
          ? state.expandedLevels.value.filter((id) => id !== command.payload)
          : [...state.expandedLevels.value, command.payload];
      break;
    case "LEAF_SORT_SET": {
      state.groupSorting.value = {
        ...state.groupSorting.value,
        ...command.payload,
      };
      break;
    }
  }
  return state;
}
