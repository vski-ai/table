export * from "./store/types.ts";
import { TableStore } from "@/module/types.ts";
import { RowData } from "@/row/types.ts";
import { DataLoadOptions, DataLoadResult } from "@/fetcher/types.ts";
import { SortedAddon } from "./components/SortedAddon.ts";
import { MutableRef } from "preact/hooks";
import { StoreModule } from "@/module/types.ts";

export type Addon<T extends (...args: any) => any = any> = SortedAddon<T>;

export type WithRef = {
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

export type BeforeRenderCallback = (opts: {
  res: (RowData | null)[];
  store: TableStore;
}) => (RowData | null)[];

export type BeforeLoadCallback = (
  opts: BeforeLoadOptions,
) => Promise<DataLoadOptions> | DataLoadOptions;

type RowClasses = SortedAddon<ClassResolverCallback>;

export interface ModuleInitOptions {
  store: TableStore;
}

export type ModuleInitCallback = (opts: ModuleInitOptions) => void;

export interface Slots extends Record<string, any> {}
export type BeforeInitCallback = (opts: Slots) => void;

export type ITableModule<T extends Record<string, any> = Record<string, any>> =
  {
    name: string;
    dependencies?: string[];
    tableProps?: T;

    beforeInit?: BeforeInitCallback;
    onInit?: ModuleInitCallback;
    afterInit?: ModuleInitCallback;

    // A hook that is called before data is loaded
    beforeLoad?: BeforeLoadCallback;

    // A hook that is called after data is loaded
    afterLoad?: AfterLoadCallback;

    beforeRender?: BeforeRenderCallback;

    store?: StoreModule;
    slots?: () => Partial<Slots>;
  };
