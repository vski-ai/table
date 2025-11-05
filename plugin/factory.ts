import {
  CellRendererCallback,
  ClassResolverCallback,
  ColumnRendererCallback,
  ITablePlugin,
  StyleResolverCallback,
} from "./types.ts";
import { PLUGIN_CONTAINER_ACCESSOR } from "./private.ts";

import { TableStore } from "../store/mod.ts";
import { SortedAddon } from "./addon.ts";
import { DataLoadOptions, DataLoadResult } from "../table/types.ts";

export const createPlugin = (plugin: ITablePlugin) => plugin;
export type PluginContainer = ReturnType<typeof createPluginContainer>;

export const createPluginContainer = (
  store: TableStore,
  plugins: ITablePlugin[],
) => {
  const sortedPlugins = [...plugins].sort((a, b) => {
    if (a.dependencies?.includes(b.name)) {
      return 1;
    }
    if (b.dependencies?.includes(a.name)) {
      return -1;
    }
    return 0;
  });

  const headerPrefixes = new SortedAddon<ColumnRendererCallback>();
  const leftTableCells = new SortedAddon<CellRendererCallback>();
  const cellPrefixes = new SortedAddon<CellRendererCallback>();
  const cellSuffixes = new SortedAddon<CellRendererCallback>();
  const rightTableCells = new SortedAddon<CellRendererCallback>();
  const leftTableHeaders = new SortedAddon<ColumnRendererCallback>();
  const rightTableHeaders = new SortedAddon<ColumnRendererCallback>();
  const rowClasses = new SortedAddon<ClassResolverCallback>();
  const rowStyles = new SortedAddon<StyleResolverCallback>();

  for (const plugin of sortedPlugins) {
    plugin.onInit?.({
      store,
      headerPrefixes,
      leftTableCells,
      rightTableCells,
      leftTableHeaders,
      rightTableHeaders,
      cellPrefixes,
      cellSuffixes,
      rowClasses,
      rowStyles,
    });
  }

  const container = {
    beforeLoad: async (options: DataLoadOptions) => {
      let result = options;
      for (const plugin of sortedPlugins) {
        result = (await plugin.beforeLoad?.({
          options: result,
          store,
        })) ?? result;
      }
      return result;
    },
    afterLoad: async (res: DataLoadResult) => {
      let result = res;
      for (const plugin of sortedPlugins) {
        console.log(1, plugin.name, result);
        result = (await plugin.afterLoad?.({ res: result, store })) ?? result;
        console.log(2, plugin.name, result);
      }
      return result;
    },
    headerPrefixes,
    leftTableCells,
    rightTableCells,
    leftTableHeaders,
    rightTableHeaders,
    cellPrefixes,
    cellSuffixes,
    rowClasses,
    rowStyles,
  };

  // @ts-ignore: some privats
  store[PLUGIN_CONTAINER_ACCESSOR] = container;

  return container;
};
