import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

declare module "@/store/types.ts" {
  interface TableState {
    columns: Signal<string[]>;
    columnOrder: Signal<string[]>;
    columnVisibility: Signal<Record<string, boolean>>;
    columnWidths: Signal<Record<string, number>>;
    stickyColumns: Signal<Record<string, StickyPosition>>;
    resizingColumn: Signal<{ column: string; width: number } | null>;
  }
}

export type StickyPosition = "left" | "right" | false;
export interface ColumnStickCommandPayload {
  column: string;
  position: StickyPosition;
}

const COLUMNS_SET = "COLUMNS_SET";
const COLUMN_ORDER_SET = "COLUMN_ORDER_SET";
const COLUMN_VISIBILITY_SET = "COLUMN_VISIBILITY_SET";
const COLUMN_WIDTHS_SET = "COLUMN_WIDTHS_SET";
const COLUMN_STICK_SET = "COLUMN_STICK_SET";

export type ColumnSetCommand = Command<typeof COLUMNS_SET, string[]>;
export type ColumnOrderCommand = Command<typeof COLUMN_ORDER_SET, string[]>;
export type ColumnStickCommand = Command<
  typeof COLUMN_STICK_SET,
  ColumnStickCommandPayload
>;
export type ColumnWidthCommand = Command<
  typeof COLUMN_WIDTHS_SET,
  Record<string, number>
>;
export type ColumnVisibilityCommand = Command<
  typeof COLUMN_VISIBILITY_SET,
  Record<string, boolean>
>;
export type ColumnCommandType =
  | ColumnSetCommand
  | ColumnOrderCommand
  | ColumnStickCommand
  | ColumnWidthCommand
  | ColumnVisibilityCommand;

export function state<T>(init: Record<string, T> | null) {
  return {
    columns: signal([]),
    columnOrder: signal(init?.columnOrder || []),
    columnVisibility: signal(
      init?.columnVisibility || {
        id: false,
      },
    ),
    columnWidths: signal(init?.columnWidths || {}),
    stickyColumns: signal<Record<string, StickyPosition>>(
      init?.stickyColumns || {},
    ),
    resizingColumn: signal(null),
  };
}

export function persist(state: TableState) {
  return {
    columnOrder: state.columnOrder.value,
    columnVisibility: state.columnVisibility.value,
    columnWidths: state.columnWidths.value,
    stickyColumns: state.stickyColumns.value,
  };
}

export function mutate(state: TableState, command: ColumnCommandType) {
  switch (command.type) {
    case "COLUMNS_SET": {
      state.columns.value = command.payload;
      break;
    }
    case "COLUMN_ORDER_SET":
      state.columnOrder.value = command.payload;
      break;
    case "COLUMN_VISIBILITY_SET":
      state.columnVisibility.value = {
        ...state.columnVisibility.value,
        ...command.payload,
      };
      break;
    case "COLUMN_WIDTHS_SET":
      state.columnWidths.value = {
        ...state.columnWidths.value,
        ...command.payload,
      };
      break;
    case "COLUMN_STICK_SET": {
      const { column, position } = command
        .payload as ColumnStickCommandPayload;
      state.stickyColumns.value = {
        ...state.stickyColumns.value,
        [column]: position,
      };
      break;
    }
  }
}
