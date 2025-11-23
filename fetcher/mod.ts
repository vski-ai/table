export * from "./types.ts";
export * from "./hooks/useLoader.ts";
export * from "./hooks/useDataFetcher.ts";

import { XModule } from "@xmod/types.ts";
import * as DataFetcherStore from "./store.ts";

export const DataFetcherModule: XModule = {
  name: "fetcher",
  store: DataFetcherStore,
};
