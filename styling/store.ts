import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, State } from "@xmod/mod.ts";
import { CellStyle } from "./types.ts";

type CSSStyleObject = Record<string, string | undefined>;

type StylesState = {
  styles: {
    table: Signal<CSSStyleObject>;
    columns: Signal<Record<string, CSSStyleObject>>;
    rows: Signal<Record<string, CSSStyleObject>>;
    cells: Signal<Record<string, Record<string, CSSStyleObject>>>;
  };
};

declare module "@xmod/types.ts" {
  interface State extends StylesState {}
}

export const TABLE_STYLE_SET = "TABLE_STYLE_SET";
export const ROW_STYLE_SET = "ROW_STYLE_SET";
export const COLUMN_STYLE_SET = "COLUMN_STYLE_SET";
export const CELL_STYLE_SET = "CELL_STYLE_SET";
export const TABLE_STYLE_RESET = "TABLE_STYLE_RESET";
export const ROW_STYLE_RESET = "ROW_STYLE_RESET";
export const COLUMN_STYLE_RESET = "COLUMN_STYLE_RESET";
export const CELL_STYLE_RESET = "CELL_STYLE_RESET";

export type TableStyleSetCommand = Command<
  typeof TABLE_STYLE_SET,
  Partial<CellStyle>,
  "Set table style. A json serializable object containing CSS styles { [css-property-name: string]: string }"
>;

export type ColumnStyleSetCommand = Command<
  typeof COLUMN_STYLE_SET,
  { key: string; style: Partial<CellStyle> },
  "Set column css style. Superseeds table styles. { [key: column_name]: string, style: { [css-property-name: string]: string } }"
>;

export type RowStyleSetCommand = Command<
  typeof ROW_STYLE_SET,
  { key: string; style: Partial<CellStyle> },
  "Set row css style. Superseeds column styles. { [key: row_id]: string, style: { [css-property-name: string]: string } }"
>;

export type CellStyleSetCommand = Command<
  typeof CELL_STYLE_SET,
  { rowKey: string; columnId: string; style: Partial<CellStyle> },
  "Set cell css style. Superseeds row styles. {  rowKey: string, columnId: string, style: { [css-property-name: string]: string } }"
>;

export type TableStyleResetCommand = Command<
  typeof TABLE_STYLE_RESET,
  unknown,
  "Reset table styles"
>;
export type RowStyleResetCommand = Command<
  typeof ROW_STYLE_RESET,
  { key: string },
  "Reset row styles"
>;
export type ColumnStyleResetCommand = Command<
  typeof COLUMN_STYLE_RESET,
  { key: string },
  "Reset column styles"
>;

export type CellStyleResetCommand = Command<
  typeof CELL_STYLE_RESET,
  { rowKey: string; columnId: string },
  "Reset cell styles"
>;

export type StylingCommandType =
  | TableStyleSetCommand
  | RowStyleSetCommand
  | ColumnStyleSetCommand
  | CellStyleSetCommand
  | TableStyleResetCommand
  | RowStyleResetCommand
  | ColumnStyleResetCommand
  | CellStyleResetCommand;

export function state(persist: InferPersist<StylesState>): StylesState {
  const table = signal(persist?.styles.table ?? {});
  const columns = signal(persist?.styles.columns ?? {});
  const rows = signal(persist?.styles.rows ?? {});
  const cells = signal(persist?.styles.cells ?? {});
  return {
    styles: {
      table,
      columns,
      rows,
      cells,
    },
  };
}

export function persist(state: State): InferPersist<StylesState> {
  return {
    styles: {
      table: state.styles.table.value,
      columns: state.styles.columns.value,
      rows: state.styles.rows.value,
      cells: state.styles.cells.value,
    },
  };
}

export function mutate(state: State, command: StylingCommandType) {
  switch (command.type) {
    case TABLE_STYLE_SET:
      state.styles.table.value = {
        ...state.styles.table.value,
        ...sanitize(command.payload as any),
      };
      break;
    case ROW_STYLE_SET:
      state.styles.rows.value = {
        ...state.styles.rows.value,
        [command.payload.key]: {
          ...state.styles.rows.value[command.payload.key],
          ...sanitize(command.payload.style as any),
        },
      };
      break;
    case COLUMN_STYLE_SET:
      state.styles.columns.value = {
        ...state.styles.columns.value,
        [command.payload.key]: {
          ...state.styles.columns.value[command.payload.key],
          ...sanitize(command.payload.style as any),
        },
      };
      break;
    case CELL_STYLE_SET:
      state.styles.cells.value = {
        ...state.styles.cells.value,
        [command.payload.rowKey]: {
          ...state.styles.cells.value[command.payload.rowKey],
          [command.payload.columnId]: {
            ...state.styles.cells.value[command.payload.rowKey]?.[
              command.payload.columnId
            ],
            ...sanitize(command.payload.style as any),
          },
        },
      };
      break;
    case TABLE_STYLE_RESET:
      state.styles.table.value = {};
      break;
    case ROW_STYLE_RESET:
      {
        const { [command.payload.key]: _, ...rest } = state.styles.rows.value;
        state.styles.rows.value = rest;
      }
      break;
    case COLUMN_STYLE_RESET:
      {
        const { [command.payload.key]: _, ...rest } =
          state.styles.columns.value;
        state.styles.columns.value = rest;
      }
      break;
    case CELL_STYLE_RESET:
      {
        const { [command.payload.rowKey]: row, ...rest } =
          state.styles.cells.value;
        const { [command.payload.columnId]: _, ...restRow } = row;
        state.styles.cells.value = {
          ...rest,
          [command.payload.rowKey]: restRow,
        };
      }
      break;
  }
}

function sanitize(obj: Record<string, string>) {
  const result: Record<string, string> = {};
  for (const key in obj) {
    result[key.replaceAll("_", "-")] = obj[key];
  }
  return result;
}
