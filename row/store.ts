import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, TableState } from "@/module/mod.ts";
import { RowData } from "./types.ts";

type RowsState = {
  rows: {
    sticky_top: Signal<RowData[]>;
    sticky_bottom: Signal<RowData[]>;
    heights: Signal<Record<string, number>>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends RowsState {}
}

export const STICKY_TOP_ROWS_SET = "STICKY_TOP_ROWS_SET";
export const STICKY_BOTTOM_ROWS_SET = "STICKY_BOTTOM_ROWS_SET";

export type StickyTopRowsSetCommand = Command<
  typeof STICKY_TOP_ROWS_SET,
  RowData[]
>;
export type StickyBottomRowsSetCommand = Command<
  typeof STICKY_BOTTOM_ROWS_SET,
  RowData[]
>;

type StickyRowsCommand = StickyTopRowsSetCommand | StickyBottomRowsSetCommand;

export function state<T>(persist: InferPersist<RowsState>): RowsState {
  const sticky_top = signal(persist?.rows?.sticky_top ?? []);
  const sticky_bottom = signal(persist?.rows?.sticky_bottom ?? []);
  const heights = signal(persist?.rows.heights ?? {});
  return {
    rows: {
      sticky_top,
      sticky_bottom,
      heights,
    },
  };
}

export function persist(state: RowsState): InferPersist<RowsState> {
  return {
    rows: {
      sticky_top: state.rows.sticky_top.value,
      sticky_bottom: state.rows.sticky_bottom.value,
      heights: state.rows.heights.value,
    },
  };
}

export function mutate(state: TableState, command: StickyRowsCommand) {
  switch (command.type) {
    case STICKY_TOP_ROWS_SET:
      state.rows.sticky_top.value = command.payload;
      break;
    case STICKY_BOTTOM_ROWS_SET:
      state.rows.sticky_bottom.value = command.payload;
      break;
  }
}
