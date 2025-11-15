import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

type ResizingRow = { rowId: string | number; height: number } | null;

type EnumeratorStore = {
  enumerator: {
    resizing_row: Signal<ResizingRow>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends EnumeratorStore {}
}

export const ROW_RESIZING_SET = "ROW_RESIZING_SET";
export const ROW_HEIGHTS_SET = "ROW_HEIGHTS_SET";

export type RowResizeCommand = Command<typeof ROW_RESIZING_SET, ResizingRow>;
export type RowHeightCommand = Command<
  typeof ROW_HEIGHTS_SET,
  Record<string, number>
>;
type RowCommand = RowResizeCommand | RowHeightCommand;

export function state<T>(): EnumeratorStore {
  const resizing_row = signal<ResizingRow>(null);
  return {
    enumerator: {
      resizing_row,
    },
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate(state: TableState, command: RowCommand) {
  switch (command.type) {
    case ROW_RESIZING_SET:
      state.enumerator.resizing_row.value = command.payload;
      break;
    case ROW_HEIGHTS_SET:
      state.rows.heights.value = {
        ...state.rows.heights.value,
        ...command.payload,
      };
      break;
  }
}
