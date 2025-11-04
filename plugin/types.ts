import { TableStore } from "@/store/types.ts";
import { DataLoadOptions, DataLoadResult, Row } from "@/table/types.ts";
import { SortedAddon } from "./addon.ts";

export type CellRendererCallback = (opts: {
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
type LeftTableCells = SortedAddon<ColumnRendererCallback>;
type RightTableCells = SortedAddon<ColumnRendererCallback>;
type LeftTableHeaders = SortedAddon<ColumnRendererCallback>;
type RightTableHeaders = SortedAddon<ColumnRendererCallback>;
type GroupHeaderCellSuffixes = SortedAddon<CellRendererCallback>;
type GroupHeaderCellPrefixes = SortedAddon<CellRendererCallback>;
type GroupHeaderCellContent = SortedAddon<CellRendererCallback>;

export interface PluginsInitOptions {
  store: TableStore;
  headerPrefixes: HeaderPrefixes;
  leftTableCells: LeftTableCells;
  rightTableCells: RightTableCells;
  leftTableHeaders: LeftTableHeaders;
  rightTableHeaders: RightTableHeaders;
  groupHeaderCellPrefixes: GroupHeaderCellPrefixes;
  groupHeaderCellSuffixes: GroupHeaderCellSuffixes;
  groupHeaderCellContent: GroupHeaderCellSuffixes;
}

export type PluginInitCallback = (opts: PluginsInitOptions) => void;

export type ITablePlugin<T extends Record<string, any> = Record<string, any>> =
  {
    name: string;
    dependencies?: string[];
    tableProps?: T;
    addons?: Record<string, SortedAddon>;

    onInit?: PluginInitCallback;

    // A hook that is called before data is loaded
    beforeLoad?: BeforeLoadCallback;

    // A hook that is called after data is loaded
    afterLoad?: AfterLoadCallback;
  };
