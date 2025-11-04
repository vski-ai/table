import { Signal } from "@preact/signals";
import { Store } from "@/store/types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    expandedLevels: Signal<string[] | number[]>;
  }
}

export enum CommandType {
  EXPANDED_LEVELS_SET = "EXPANDED_LEVELS_SET",
}

export const groupingStore: Store = {
  data: {
    expandedLevels: [],
  },

  reducer: (state, command) => {
    switch (command.type) {
      case CommandType.EXPANDED_LEVELS_SET:
        state.expandedLevels.value =
          state.expandedLevels.value.includes(command.payload as never)
            ? state.expandedLevels.value.filter((id) => id !== command.payload)
            : [...state.expandedLevels.value, command.payload];
        break;
    }
    return state;
  },
};
