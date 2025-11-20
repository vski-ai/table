import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

type KeyboardState = {
  keyboard: {
    altKey: Signal<boolean>;
    metaKey: Signal<boolean>;
    focusedCell: Signal<{ column: string; rowId: string } | null>;
  };
};

type MouseState = {
  mouse: {
    pressed: Signal<boolean>;
  };
};

type InputState = KeyboardState & MouseState;

declare module "@/module/types.ts" {
  interface TableState extends InputState {}
}

export function state(): InputState {
  return {
    keyboard: {
      altKey: signal(false),
      metaKey: signal(false),
      focusedCell: signal(null),
    },
    mouse: {
      pressed: signal(false),
    },
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate(_: TableState, __: Command) {}
