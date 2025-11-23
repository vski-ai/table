import { RowData } from "../row/types.ts";
import { Store } from "@xmod/types.ts";
import { ComponentChildren } from "preact";

export interface DataType<T extends string = "default", O = any> {
  column: string;
  type: T;
  options: O;
}

export interface TypeFormatOpts {
  store: Store;
  row: RowData;
  column: string;
}

export type TypeFormatRender = (opts: TypeFormatOpts) => ComponentChildren;

export interface TypeFormatComponent<T extends string> {
  datatype: T;
  display: TypeFormatRender;
  edit: TypeFormatRender;
}
