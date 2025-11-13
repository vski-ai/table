import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, TableState } from "@/module/mod.ts";
import { SortState } from "@/sorting/types.ts";

type GroupingStore = {
  grouping: {
    expanded: Signal<string[]>;
    group_by: Signal<string[] | null>;
    sorting: Signal<Record<string, SortState>>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends GroupingStore {}
}

const EXPANDED_LEVELS_SET = "EXPANDED_LEVELS_SET";
const LEAF_SORT_SET = "LEAF_SORT_SET";

export type ExpandSetCommand = Command<typeof EXPANDED_LEVELS_SET, string>;
export type LeafSortCommand = Command<
  typeof LEAF_SORT_SET,
  Record<string, SortState>
>;
export type GroupingCommand = ExpandSetCommand | LeafSortCommand;

export function state<T>(init: InferPersist<GroupingStore>): GroupingStore {
  return {
    grouping: {
      expanded: signal(init?.grouping?.expanded ?? []),
      group_by: signal([]),
      sorting: signal(init?.grouping?.sorting ?? {}),
    },
  };
}

export function persist(state: TableState): InferPersist<GroupingStore> {
  return {
    grouping: {
      expanded: state.grouping.expanded.value,
      sorting: state.grouping.sorting.value,
    },
  };
}

export function mutate(state: TableState, command: GroupingCommand) {
  switch (command.type) {
    case "EXPANDED_LEVELS_SET":
      state.grouping.expanded.value =
        state.grouping.expanded.value.includes(command.payload as never)
          ? state.grouping.expanded.value.filter((id) => id !== command.payload)
          : [...state.grouping.expanded.value, command.payload];
      break;
    case "LEAF_SORT_SET": {
      state.grouping.sorting.value = {
        ...state.grouping.sorting.value,
        ...command.payload,
      };
      break;
    }
  }
}
