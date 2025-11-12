import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

type ResizingRow = { rowId: string | number; height: number } | null;
declare module "@/module/types.ts" {
  interface TableState {
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
type RowCommand = RowResizeCommand | RowHeightCommand;

export function state<T>(init: Record<string, T> | null) {
  return {
    resizingRow: signal({}),
  };
}

export function persist(state: TableState) {
  return {};
}

export function mutate(state: TableState, command: RowCommand) {
  switch (command.type) {
    case "ROW_RESIZING_SET":
      state.resizingRow.value = command.payload;
      break;
    case "ROW_HEIGHTS_SET":
      state.rowHeights.value = {
        ...state.rowHeights.value,
        ...command.payload,
      };
      break;
  }
}
