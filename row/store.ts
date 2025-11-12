import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { RowData } from "./types.ts";

declare module "@/module/types.ts" {
  interface TableState {
    stickyTopRows: Signal<RowData[]>;
    stickyBottomRows: Signal<RowData[]>;
  }
}

const STICKY_TOP_ROWS_SET = "STICKY_TOP_ROWS_SET";
const STICKY_BOTTOM_ROWS_SET = "STICKY_BOTTOM_ROWS_SET";

export type StickyTopRowsSetCommand = Command<
  typeof STICKY_TOP_ROWS_SET,
  RowData[]
>;
export type StickyBottomRowsSetCommand = Command<
  typeof STICKY_BOTTOM_ROWS_SET,
  RowData[]
>;

type StickyRowsCommand = StickyTopRowsSetCommand | StickyBottomRowsSetCommand;

export function state<T>(init: Record<string, T> | null) {
  return {
    stickyTopRows: signal(init?.stickyTopRows ?? []),
    stickyBottomRows: signal(init?.stickyBottomRows ?? []),
  };
}

export function persist(state: TableState) {
  return {
    stickyTopRows: state.stickyTopRows.value,
    stickyBottomRows: state.stickyBottomRows.value,
  };
}

export function mutate(state: TableState, command: StickyRowsCommand) {
  switch (command.type) {
    case "STICKY_TOP_ROWS_SET":
      state.stickyTopRows.value = command.payload;
      break;
    case "STICKY_BOTTOM_ROWS_SET":
      state.stickyBottomRows.value = command.payload;
      break;
  }
}
