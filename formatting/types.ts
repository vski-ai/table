import { RowData } from "../row/types.ts";
import { TableStore } from "../store/types.ts";
import { ComponentChildren } from "preact";

export enum FormattingType {
  Style = "style",
  Date = "date",
}

export enum ConditionOperator {
  Equals = "==",
  NotEquals = "!=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
}

export type StyleScope = "column" | "row" | "cell";

export interface CellStyle extends Record<string, string | undefined> {
  "color"?: string;
  "background-color"?: string;
  "font-weight"?: "normal" | "bold";
  "font-style"?: "normal" | "italic";
  "text-Decoration"?: "none" | "underline";
}

export interface TypeFormatOpts {
  store: TableStore;
  row: RowData;
  column: string;
}

export type TypeFormatRender = (opts: TypeFormatOpts) => ComponentChildren;
export interface TypeFormat<T extends string> {
  datatype: T;
  display: TypeFormatRender;
  edit: TypeFormatRender;
}
