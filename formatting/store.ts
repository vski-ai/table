import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { CellFormatting, CellStyle } from "./types.ts";

type CSSStyleObject = Record<string, string | undefined>;

declare module "@/store/types.ts" {
  interface TableState {
    tableStyles: Signal<CSSStyleObject>;
    columnStyles: Signal<Record<string, CSSStyleObject>>;
    rowStyles: Signal<Record<string, CSSStyleObject>>;
    cellStyles: Signal<
      Record<string, Record<string, CSSStyleObject>>
    >;
    cellFormatting: Signal<Record<string, CellFormatting>>;
  }
}

const CELL_FORMATTING_SET = "CELL_FORMATTING_SET";
const TABLE_STYLE_SET = "TABLE_STYLE_SET";
const ROW_STYLE_SET = "ROW_STYLE_SET";
const COLUMN_STYLE_SET = "COLUMN_STYLE_SET";
const CELL_STYLE_SET = "CELL_STYLE_SET";
const TABLE_STYLE_RESET = "TABLE_STYLE_RESET";
const ROW_STYLE_RESET = "ROW_STYLE_RESET";
const COLUMN_STYLE_RESET = "COLUMN_STYLE_RESET";
const CELL_STYLE_RESET = "CELL_STYLE_RESET";

export type CellFormattingSetCommand = Command<
  typeof CELL_FORMATTING_SET,
  Record<string, CellFormatting>
>;
export type TableStyleSetCommand = Command<
  typeof TABLE_STYLE_SET,
  Partial<CellStyle>
>;
export type RowStyleSetCommand = Command<
  typeof ROW_STYLE_SET,
  { key: string; style: Partial<CellStyle> }
>;
export type ColumnStyleSetCommand = Command<
  typeof COLUMN_STYLE_SET,
  { key: string; style: Partial<CellStyle> }
>;
export type CellStyleSetCommand = Command<
  typeof CELL_STYLE_SET,
  { rowKey: string; columnId: string; style: Partial<CellStyle> }
>;
export type TableStyleResetCommand = Command<typeof TABLE_STYLE_RESET, void>;
export type RowStyleResetCommand = Command<
  typeof ROW_STYLE_RESET,
  { key: string }
>;
export type ColumnStyleResetCommand = Command<
  typeof COLUMN_STYLE_RESET,
  { key: string }
>;
export type CellStyleResetCommand = Command<
  typeof CELL_STYLE_RESET,
  { rowKey: string; columnId: string }
>;

export type FormattingCommandType =
  | CellFormattingSetCommand
  | TableStyleSetCommand
  | RowStyleSetCommand
  | ColumnStyleSetCommand
  | CellStyleSetCommand
  | TableStyleResetCommand
  | RowStyleResetCommand
  | ColumnStyleResetCommand
  | CellStyleResetCommand;

export function state(init: Record<string, any> | null) {
  const cellFormatting = signal(init?.cellFormatting || {});
  const tableStyles = signal(init?.tableStyles ?? {});
  const columnStyles = signal(init?.columnStyles ?? {});
  const rowStyles = signal(init?.rowStyles ?? {});
  const cellStyles = signal(init?.cellStyles ?? {});
  return {
    cellFormatting,
    tableStyles,
    columnStyles,
    rowStyles,
    cellStyles,
  };
}

export function persist(state: TableState): Record<keyof TableState, any> {
  return {
    tableStyles: state.tableStyles.value,
    columnStyles: state.columnStyles.value,
    rowStyles: state.rowStyles.value,
    cellStyles: state.cellStyles.value,
    cellFormatting: state.cellFormatting.value,
  };
}

export function mutate(state: TableState, command: FormattingCommandType) {
  switch (command.type) {
    case "TABLE_STYLE_SET":
      state.tableStyles.value = {
        ...state.tableStyles.value,
        ...command.payload,
      };
      break;
    case "ROW_STYLE_SET":
      state.rowStyles.value = {
        ...state.rowStyles.value,
        [command.payload.key]: {
          ...state.rowStyles.value[command.payload.key],
          ...command.payload.style,
        },
      };
      break;
    case "COLUMN_STYLE_SET":
      state.columnStyles.value = {
        ...state.columnStyles.value,
        [command.payload.key]: {
          ...state.columnStyles.value[command.payload.key],
          ...command.payload.style,
        },
      };
      break;
    case "CELL_STYLE_SET":
      state.cellStyles.value = {
        ...state.cellStyles.value,
        [command.payload.rowKey]: {
          ...state.cellStyles.value[command.payload.rowKey],
          [command.payload.columnId]: {
            ...state.cellStyles.value[command.payload.rowKey]?.[
              command.payload.columnId
            ],
            ...command.payload.style,
          },
        },
      };
      break;
    case "TABLE_STYLE_RESET":
      state.tableStyles.value = {};
      break;
    case "ROW_STYLE_RESET":
      {
        const { [command.payload.key]: _, ...rest } = state.rowStyles.value;
        state.rowStyles.value = rest;
      }
      break;
    case "COLUMN_STYLE_RESET":
      {
        const { [command.payload.key]: _, ...rest } = state.columnStyles.value;
        state.columnStyles.value = rest;
      }
      break;
    case "CELL_STYLE_RESET":
      {
        const { [command.payload.rowKey]: row, ...rest } = state.cellStyles
          .value;
        const { [command.payload.columnId]: _, ...restRow } = row;
        state.cellStyles.value = { ...rest, [command.payload.rowKey]: restRow };
      }
      break;
    case "CELL_FORMATTING_SET":
      state.cellFormatting.value = {
        ...state.cellFormatting.value,
        ...command.payload,
      };
      break;
  }
}
