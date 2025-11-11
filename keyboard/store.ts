import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { RowData } from "@/row/types.ts";

type KeyboardState = {
  altKey: Signal<boolean>;
};

declare module "@/store/types.ts" {
  interface TableState {
    keyboard: KeyboardState;
  }
}

export function state() {
  return {
    keyboard: {
      altKey: signal(false),
    },
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(state: TableState, _: Command<T>) {
  return state;
}
