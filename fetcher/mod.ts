export * from "./types.ts";
export * from "./hooks/useLoader.ts";
export * from "./hooks/useDataFetcher.ts";
export * from "./hooks/useRowHeights.ts";

import { ITableModule } from "@/module/types.ts";
import * as DataFetcherStore from "./store.ts";

export const DataFetcherModule: ITableModule = {
  name: "fetcher",
  store: DataFetcherStore,
};
