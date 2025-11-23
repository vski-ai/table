import type { Store } from "@xmod/types.ts";
import type { RowData } from "@/row/types.ts";
import type { DataLoadOptions, DataLoadResult } from "@/fetcher/types.ts";
import type { MutableRef } from "preact/hooks";

declare module "@xmod/types.ts" {
  interface Store {
    scrollContainerRef: MutableRef<HTMLElement>;
  }
}

export type WithRef = {
  ref?: MutableRef<HTMLElement>;
};

export type ClassResolverCallback = (
  opts: {
    row?: RowData;
    rowKey?: string;
    column?: string;
    store: Store;
  } & WithRef,
) => string[];

export type StyleResolverCallback = (
  opts: {
    row?: RowData;
    column?: string;
    store: Store;
  } & WithRef,
) => [string, string | number][];

export type CommonRendererCallback = (
  opts: {
    store: Store;
  } & WithRef,
) => preact.ComponentChildren;

export type AfterLoadOptions = {
  res: DataLoadResult;
  store: Store;
};

export type BeforeLoadOptions = {
  options: DataLoadOptions;
  store: Store;
};

export type AfterLoadCallback = (
  opts: AfterLoadOptions,
) => Promise<DataLoadResult | void> | DataLoadResult | void;

export type BeforeRenderCallback = (opts: {
  res: (RowData | null)[];
  store: Store;
}) => (RowData | null)[];

export type BeforeLoadCallback = (
  opts: BeforeLoadOptions,
) => Promise<DataLoadOptions> | DataLoadOptions;
