export * from "./types.ts";
export * from "./components/RowSorter.tsx";
export * from "./createFrontendSorter.ts";

import {
  BeforeInitCallback,
  BeforeLoadCallback,
  ITableModule,
  ModuleInitCallback,
} from "@/module/mod.ts";
import { renderSorter } from "./components/RowSorter.tsx";
import { SortState } from "./types.ts";
import * as store from "./store.ts";

declare module "@/fetcher/types.ts" {
  interface TableMeta {
    sortable_all?: boolean;
    sortable_columns?: string[];
  }

  interface DataLoadOptions {
    sort?: SortState;
  }
}

const beforeInit: BeforeInitCallback = ({ headerprefixes }) => {
  headerprefixes.use(renderSorter);
};

const beforeLoad: BeforeLoadCallback = ({ options, store }) => {
  const sorting = store.state.sorting.value;
  if (!options) return options;
  options.sort = sorting;
  return options;
};

export const SortingModule: ITableModule = {
  name: "sorting",
  beforeInit,
  beforeLoad,
  store,
};
