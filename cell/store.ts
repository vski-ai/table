import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

declare module "@/store/types.ts" {
  interface TableState {
    focusedCell: Signal<{ tabIndex: number; rowIndex: number } | null>;
    selectedCells: Signal<Record<string, Record<string, boolean>>>;
  }
}

export function state() {
  const selectedCells = signal({});
  const focusedCell = signal(null);
  return {
    selectedCells,
    focusedCell,
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(state: TableState, _: Command<T>) {
  return state;
}
