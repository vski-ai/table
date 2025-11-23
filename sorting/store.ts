import { Signal, signal } from "@preact/signals";
import { Command, State } from "@xmod/mod.ts";
import { SortState } from "./types.ts";

declare module "@xmod/types.ts" {
  interface State {
    sorting: Signal<SortState>;
  }
}

export const SORT_SET = "SORT_SET";
export type SortSetCommand = Command<typeof SORT_SET, SortState>;

export function state(init: Record<string, any> | null) {
  return {
    sorting: signal(init?.sorting ?? {}),
  };
}

export function persist(state: State) {
  return {
    sorting: state.sorting.value,
  };
}

export function mutate(state: State, command: SortSetCommand) {
  switch (command.type) {
    case SORT_SET: {
      state.sorting.value = command.payload;
      break;
    }
  }
}
