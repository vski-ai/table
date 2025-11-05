import {
  BeforeLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { headerRenderCallback } from "./RowSorter.tsx";
import { SortState } from "./types.ts";

declare module "@/fetcher/types.ts" {
  interface TableMeta {
    sortableAll?: boolean;
    sortableColumns?: string[];
  }

  interface DataLoadOptions {
    sort?: SortState;
  }
}

export const plugin = (): ITablePlugin => {
  const onInit: PluginInitCallback = ({
    headerPrefixes,
  }) => {
    headerPrefixes.use(0, headerRenderCallback);
  };

  const beforeLoad: BeforeLoadCallback = ({
    options,
    store,
  }) => {
    const sorting = store.state.sorting.value;
    if (!options) return options;
    options.sort = sorting;
    return options;
  };

  return {
    name: "sorting",
    onInit,
    beforeLoad,
  };
};
