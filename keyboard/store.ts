import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

type KeyboardState = {
  altKey: Signal<boolean>;
  metaKey: Signal<boolean>;
  focusedCell: Signal<{ column: string; rowId: string } | null>;
};

declare module "@/module/types.ts" {
  interface TableState {
    keyboard: KeyboardState;
  }
}

export function state() {
  return {
    keyboard: {
      altKey: signal(false),
      metaKey: signal(false),
      focusedCell: signal(null),
    },
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(state: TableState, _: Command<T>) {
}
