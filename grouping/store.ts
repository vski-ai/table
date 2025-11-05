import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

declare module "@/store/types.ts" {
  interface TableState {
    expandedLevels: Signal<string[] | number[]>;
  }
}

export enum CommandType {
  EXPANDED_LEVELS_SET = "EXPANDED_LEVELS_SET",
}

export function state(init: Record<string, any> | null) {
  return {
    expandedLevels: signal(init?.expandedLevels ?? {}),
  };
}

export function persist(state: TableState) {
  return {
    expandedLevels: state.expandedLevels.value,
  };
}

export function reducer<T>(state: TableState, command: Command<T>) {
  switch (command.type) {
    case CommandType.EXPANDED_LEVELS_SET:
      state.expandedLevels.value =
        state.expandedLevels.value.includes(command.payload as never)
          ? state.expandedLevels.value.filter((id) => id !== command.payload)
          : [...state.expandedLevels.value, command.payload];
      break;
  }
  return state;
}
