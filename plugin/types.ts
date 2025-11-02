import { TableStore } from "@/store/types.ts";
import { DataLoadOptions, DataLoadResult, Row } from "@/table/types.ts";
import { SortedAddon } from "./addon.ts";

export type CellRenderer = (col: string, row: Row) => preact.ComponentChildren;
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

type HeaderPrefixes = SortedAddon<ColumnRendererCallback>;

export type PluginInitCallback = (opts: {
  store: TableStore;
  headerPrefixes: HeaderPrefixes;
}) => void;

export type ITablePlugin = {
  name: string;
  dependencies?: string[];

  onInit?: PluginInitCallback;

  // A hook that is called before data is loaded
  beforeLoad?: BeforeLoadCallback;

  // A hook that is called after data is loaded
  afterLoad?: AfterLoadCallback;
};
