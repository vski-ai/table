import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { CellFormatting } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    cellFormatting: Signal<Record<string, CellFormatting>>;
  }
}

const CELL_FORMATTING_SET = "CELL_FORMATTING_SET";

export function state(init: Record<string, any> | null) {
  const cellFormatting = signal(init?.cellFormatting || {});
  return {
    cellFormatting,
  };
}

export function persist(state: TableState) {
  return {
    cellFormatting: state.cellFormatting.value,
  };
}

export function reducer<T>(state: TableState, _: Command<T>) {
  return state;
}
