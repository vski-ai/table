import {
  BeforeLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { headerRenderCallback } from "./RowSorter.tsx";
import { createSorter } from "./createSorter.ts";

type SorterPluginOpts = {
  frontendSort?: boolean;
};

export const sorterPlugin = ({
  frontendSort = true,
}: SorterPluginOpts = {}): ITablePlugin => {
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

  const conditional: Partial<ITablePlugin> = {};
  if (frontendSort) {
    const sorter = createSorter();
    conditional.afterLoad = ({ res, store }) => {
      res.rows = sorter({
        data: res.rows,
        store,
      });
    };
  }

  return {
    name: "FrontendSorter",
    onInit,
    beforeLoad,
    ...conditional,
  };
};
