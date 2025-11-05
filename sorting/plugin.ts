import {
  BeforeLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { headerRenderCallback } from "./RowSorter.tsx";

export const sorterPlugin = (): ITablePlugin => {
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
