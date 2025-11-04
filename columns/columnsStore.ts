import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

export type StickyPosition = "left" | "right" | false;
export interface ColumnStickCommandPayload {
  column: string;
  position: StickyPosition;
}

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

export enum CommandType {
  COLUMNS_SET = "COLUMNS_SET",
  COLUMN_ORDER_SET = "COLUMN_ORDER_SET",
  COLUMN_VISIBILITY_SET = "COLUMN_VISIBILITY_SET",
  COLUMN_WIDTHS_SET = "COLUMN_WIDTHS_SET",
  COLUMN_STICK_SET = "COLUMN_STICK_SET",
}

export function columnsState(init: Record<string, any> | null) {
  return {
    columns: signal([]),
    columnOrder: signal(init?.columnOrder || []),
    columnVisibility: signal(init?.columnVisibility || {}),
    columnWidths: signal(init?.columnWidths || {}),
    stickyColumns: signal<Record<string, StickyPosition>>(
      init?.stickyColumns || {},
    ),
    resizingColumn: signal(null),
  };
}

export function columnsPersist(state: TableState) {
  return {
    columnOrder: state.columnOrder.value,
    columnVisibility: state.columnVisibility.value,
    cellFormatting: state.cellFormatting.value,
    columnWidths: state.columnWidths.value,
    stickyColumns: state.stickyColumns.value,
  };
}

export function columnsReducer<T>(state: TableState, command: Command<T>) {
  switch (command.type) {
    case CommandType.COLUMNS_SET: {
      state.columns.value = command.payload;
      break;
    }
    case CommandType.COLUMN_ORDER_SET:
      state.columnOrder.value = command.payload;
      break;
    case CommandType.COLUMN_VISIBILITY_SET:
      state.columnVisibility.value = command.payload;
      break;
    case CommandType.COLUMN_WIDTHS_SET:
      state.columnWidths.value = command.payload;
      break;
    case CommandType.COLUMN_STICK_SET: {
      const { column, position } = command
        .payload as ColumnStickCommandPayload;
      state.stickyColumns.value = {
        ...state.stickyColumns.value,
        [column]: position,
      };
      break;
    }
  }
  return state;
}
