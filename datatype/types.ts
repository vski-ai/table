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
