import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

declare module "@/store/types.ts" {
  interface TableState {
    rowHeights: Signal<Record<string, number>>;
    resizingRow: Signal<{ rowId: string | number; height: number } | null>;
  }
}

export enum CommandType {
  ROW_RESIZING_SET = "ROW_RESIZING_SET",
  ROW_HEIGHTS_SET = "ROW_HEIGHTS_SET",
}

export function state<T>(init: Record<string, T> | null) {
  return {
    resizingRow: signal({}),
  };
}

export function persist(state: TableState) {
  return {};
}

export function reducer<T>(state: TableState, command: Command<T>) {
  // switch (command.type) {
  // }
  return state;
}
