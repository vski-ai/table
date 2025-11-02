import { TableStore } from "@/store/types.ts";
import { DataLoadOptions, DataLoadResult, Row } from "@/table/types.ts";
import { SortedAddon } from "./addon.ts";

export type CellRenderer = (opts: {
  column: string;
  row: Row;
  store: TableStore;
}) => preact.ComponentChildren;
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
type GroupHeaderCellSuffixes = SortedAddon<CellRenderer>;
type GroupHeaderCellPrefixes = SortedAddon<CellRenderer>;
type GroupHeaderCellContent = SortedAddon<CellRenderer>;

export type PluginInitCallback = (opts: {
  store: TableStore;
  headerPrefixes: HeaderPrefixes;
  groupHeaderCellPrefixes: GroupHeaderCellPrefixes;
  groupHeaderCellSuffixes: GroupHeaderCellSuffixes;
  groupHeaderCellContent: GroupHeaderCellSuffixes;
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
