import {
  BeforeLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { headerRenderCallback } from "./RowSorter.tsx";
import { SortState } from "./types.ts";
import * as store from "./store.ts";

declare module "@/fetcher/types.ts" {
  interface TableMeta {
    sortableAll?: boolean;
    sortableColumns?: string[];
  }

  interface DataLoadOptions {
    sort?: SortState;
  }
}

const onInit: PluginInitCallback = ({ headerprefixes }) => {
  headerprefixes.use(0, headerRenderCallback);
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

export const SortingPlugin: ITablePlugin = {
  name: "sorting",
  onInit,
  beforeLoad,
  store,
};
