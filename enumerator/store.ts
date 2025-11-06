import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

type ResizingRow = { rowId: string | number; height: number } | null;
declare module "@/store/types.ts" {
  interface TableState {
    rowHeights: Signal<Record<string, number>>;
    resizingRow: Signal<ResizingRow>;
  }
}

const ROW_RESIZING_SET = "ROW_RESIZING_SET";
const ROW_HEIGHTS_SET = "ROW_HEIGHTS_SET";

export type RowResizeCommand = Command<typeof ROW_RESIZING_SET, ResizingRow>;
export type RowHeightCommand = Command<
  typeof ROW_HEIGHTS_SET,
  Record<string, number>
>;

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
