import { Signal, signal } from "@preact/signals";
import { Command, State } from "@xmod/mod.ts";

type KeyboardState = {
  keyboard: {
    altKey: Signal<boolean>;
    metaKey: Signal<boolean>;
    focusedCell: Signal<{ column: string; rowId: string } | null>;
  };
  mouse: {
    pressed: Signal<boolean>;
  };
  drag: {
    active: Signal<boolean>;
  };
};

type InputState = KeyboardState;

declare module "@xmod/types.ts" {
  interface State extends InputState {}
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
    drag: {
      active: signal(false),
    },
  };
}

export function persist(_: State) {
  return {};
}

export function mutate(_: State, __: Command) {}
