import { TableStore } from "@/module/types.ts";
import {
  CELL_STYLE_RESET,
  CELL_STYLE_SET,
  CellStyleSetCommand,
  COLUMN_STYLE_RESET,
  COLUMN_STYLE_SET,
  ColumnStyleResetCommand,
  ColumnStyleSetCommand,
  ROW_STYLE_RESET,
  ROW_STYLE_SET,
  RowStyleResetCommand,
  RowStyleSetCommand,
  TABLE_STYLE_RESET,
  TABLE_STYLE_SET,
  TableStyleResetCommand,
  TableStyleSetCommand,
} from "../store.ts";

import { CellStyle } from "../types.ts";

type WithStore = {
  store: TableStore;
};

type SetColumnStyle = {
  scope: "column";
  column: string;
  style: Partial<CellStyle>;
} & WithStore;

type SetRowStyle = {
  scope: "row";
  row: string;
  style: Partial<CellStyle>;
} & WithStore;

type SetCellStyle = {
  scope: "cell";
  row: string;
  column: string;
  style: Partial<CellStyle>;
} & WithStore;

type SetTableStyle = {
  scope: "table";
  style: any;
} & WithStore;

export function setStyle(
  ctx: SetColumnStyle | SetRowStyle | SetCellStyle | SetTableStyle,
) {
  const { store, style } = ctx;
  switch (ctx.scope) {
    case "table": {
      store.dispatch<TableStyleSetCommand>({
        type: TABLE_STYLE_SET,
        payload: style,
      });
      break;
    }
    case "column": {
      store.dispatch<ColumnStyleSetCommand>({
        type: COLUMN_STYLE_SET,
        payload: { key: ctx.column, style },
      });
      break;
    }
    case "row": {
      store.dispatch<RowStyleSetCommand>({
        type: ROW_STYLE_SET,
        payload: { key: ctx.row, style },
      });
      break;
    }
    case "cell": {
      store.dispatch<CellStyleSetCommand>({
        type: CELL_STYLE_SET,
        payload: { rowKey: ctx.row, columnId: ctx.column, style },
      });
      break;
    }
  }
}

export type ScopedStyleProps =
  | {
    scope: "cell";
    row: string;
    column: string;
  }
  | { scope: "row"; row: string }
  | { scope: "column"; column: string }
  | { scope: "table" };

export type StyleProps = {
  store: TableStore;
} & ScopedStyleProps;

export function getStyle(
  ctx: ScopedStyleProps & WithStore,
): Partial<CellStyle> {
  const { store } = ctx;
  switch (ctx.scope) {
    case "table":
      return store.state.styles.table.value ?? {};
    case "column":
      return store.state.styles.columns.value[ctx.column ?? -1] ?? {};
    case "row":
      return store.state.styles.rows.value[ctx.row ?? -1] ?? {};
    case "cell":
      return store.state.styles.cells.value[ctx.row ?? -1]
        ?.[ctx.column ?? -1] ??
        {};
    default:
      return {};
  }
}

export function resetStyle(ctx: ScopedStyleProps & WithStore) {
  const { store } = ctx;
  switch (ctx.scope) {
    case "table": {
      store.dispatch<TableStyleResetCommand>({
        type: TABLE_STYLE_RESET,
        payload: {},
      });
      break;
    }
    case "column": {
      store.dispatch<ColumnStyleResetCommand>({
        type: COLUMN_STYLE_RESET,
        payload: { key: ctx.column },
      });
      break;
    }
    case "row": {
      store.dispatch<RowStyleResetCommand>({
        type: ROW_STYLE_RESET,
        payload: { key: ctx.row },
      });
      break;
    }
    case "cell": {
      store.dispatch({
        type: CELL_STYLE_RESET,
        payload: { rowKey: ctx.row, columnId: ctx.column },
      });
      break;
    }
  }
}
