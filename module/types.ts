export * from "./store/types.ts";
import { TableStore } from "@/module/types.ts";
import { RowData } from "@/row/types.ts";
import { DataLoadOptions, DataLoadResult } from "@/fetcher/types.ts";
import { SortedAddon } from "./components/SortedAddon.ts";
import { MutableRef } from "preact/hooks";
import { StoreModule } from "@/module/types.ts";

type WithRef = {
  ref?: MutableRef<HTMLElement>;
};
export type ClassResolverCallback = (
  opts: {
    row?: RowData;
    rowKey?: string;
    column?: string;
    store: TableStore;
  } & WithRef,
) => string[];

export type StyleResolverCallback = (
  opts: {
    row?: RowData;
    column?: string;
    store: TableStore;
  } & WithRef,
) => [string, string | number][];

export type CellRendererCallback =
  & { columnName?: string }
  & ((
    opts: {
      column: string;
      row: RowData;
      store: TableStore;
      rowIndex?: number;
    } & WithRef,
  ) => preact.ComponentChildren);

export type CommonRendererCallback = (
  opts: {
    store: TableStore;
  } & WithRef,
) => preact.ComponentChildren;

export type ColumnRendererCallback = (opts: {
  column: string;
  store: TableStore;
}) => preact.ComponentChildren;

export type AfterLoadOptions = {
  res: DataLoadResult;
  store: TableStore;
};

export type BeforeLoadOptions = {
  options: DataLoadOptions;
  store: TableStore;
};

export type AfterLoadCallback = (
  opts: AfterLoadOptions,
) => Promise<DataLoadResult | void> | DataLoadResult | void;

export type BeforeLoadCallback = (
  opts: BeforeLoadOptions,
) => Promise<DataLoadOptions> | DataLoadOptions;

type BeforeTable = SortedAddon<CommonRendererCallback>;
type InsideTable = SortedAddon<CommonRendererCallback>;
type AfterTable = SortedAddon<CommonRendererCallback>;
type HeaderPrefixes = SortedAddon<ColumnRendererCallback>;
type CellPrefixes = SortedAddon<CellRendererCallback>;
type CellSuffixes = SortedAddon<CellRendererCallback>;
type LeftTableCells = SortedAddon<CellRendererCallback>;
type RightTableCells = SortedAddon<CellRendererCallback>;
type LeftTableHeaders = SortedAddon<ColumnRendererCallback>;
type RightTableHeaders = SortedAddon<ColumnRendererCallback>;
type RowClasses = SortedAddon<ClassResolverCallback>;
type RowStyles = SortedAddon<StyleResolverCallback>;

export interface ModuleInitOptions {
  store: TableStore;
  headerprefixes: HeaderPrefixes;
  lefttablecells: LeftTableCells;
  righttablecells: RightTableCells;
  lefttableheaders: LeftTableHeaders;
  righttableheaders: RightTableHeaders;
  cellprefixes: CellPrefixes;
  cellsuffixes: CellSuffixes;
  rowclasses: RowClasses;
  rowstyles: RowStyles;
  beforetable: BeforeTable;
  insidetable: InsideTable;
  aftertable: AfterTable;
}

export type ModuleInitCallback = (opts: ModuleInitOptions) => void;

export type ITableModule<T extends Record<string, any> = Record<string, any>> =
  {
    name: string;
    dependencies?: string[];
    tableProps?: T;

    onInit?: ModuleInitCallback;

    // A hook that is called before data is loaded
    beforeLoad?: BeforeLoadCallback;

    // A hook that is called after data is loaded
    afterLoad?: AfterLoadCallback;

    store?: StoreModule;
  };
