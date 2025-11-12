import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";

type ColumnsState = {
  columns: {
    all: Signal<string[]>;
    ordered: Signal<string[]>;
    visibility: Signal<Record<string, boolean>>;
    widths: Signal<Record<string, number>>;
    sticky: Signal<Record<string, StickyPosition>>;
    resizing_column: Signal<{ column: string; width: number } | null>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends ColumnsState {}
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

export function state<T>(init: any): ColumnsState {
  const all = signal<string[]>([]);
  const ordered = signal<string[]>(init?.columns?.ordered || []);
  const visibility = signal<Record<string, boolean>>(
    init?.columns?.visibility || {
      id: false,
    },
  );
  const widths = signal(init?.columns?.widths || {});
  const sticky = signal<Record<string, StickyPosition>>(
    init?.columns.sticky || {},
  );
  const resizing_column = signal(null);
  return {
    columns: {
      all,
      ordered,
      visibility,
      widths,
      sticky,
      resizing_column,
    },
  };
}

export function persist(state: TableState) {
  return {
    columns: {
      ordered: state.columns.ordered.value,
      visibility: state.columns.visibility.value,
      widths: state.columns.widths.value,
      sticky: state.columns.sticky.value,
    },
  };
}

export function mutate(state: TableState, command: ColumnCommandType) {
  switch (command.type) {
    case "COLUMNS_SET": {
      state.columns.all.value = command.payload;
      break;
    }
    case "COLUMN_ORDER_SET":
      state.columns.ordered.value = command.payload;
      break;
    case "COLUMN_VISIBILITY_SET":
      state.columns.visibility.value = {
        ...state.columns.visibility.value,
        ...command.payload,
      };
      break;
    case "COLUMN_WIDTHS_SET":
      state.columns.widths.value = {
        ...state.columns.widths.value,
        ...command.payload,
      };
      break;
    case "COLUMN_STICK_SET": {
      const { column, position } = command
        .payload as ColumnStickCommandPayload;
      state.columns.sticky.value = {
        ...state.columns.sticky.value,
        [column]: position,
      };
      break;
    }
  }
}
