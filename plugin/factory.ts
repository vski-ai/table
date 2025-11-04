import {
  CellRendererCallback,
  ColumnRendererCallback,
  ITablePlugin,
} from "./types.ts";
import { PLUGIN_CONTAINER_ACCESSOR } from "./private.ts";

import { TableStore } from "../store/mod.ts";
import { SortedAddon } from "./addon.ts";
import { DataLoadOptions, DataLoadResult } from "../table/types.ts";

export const createPlugin = (plugin: ITablePlugin) => plugin;
export type PluginContainer = ReturnType<typeof createPluginContainer>;

export const createPluginContainer = (
  plugins: ITablePlugin[],
  store: TableStore,
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

  const pluginAddons = sortedPlugins.reduce(
    (acc, p) => ({ ...p.addons, ...acc }),
    {} as Record<string, SortedAddon>,
  );

  const headerPrefixes = new SortedAddon<ColumnRendererCallback>();
  const leftTableCells = new SortedAddon<ColumnRendererCallback>();
  const rightTableCells = new SortedAddon<ColumnRendererCallback>();
  const leftTableHeaders = new SortedAddon<ColumnRendererCallback>();
  const rightTableHeaders = new SortedAddon<ColumnRendererCallback>();
  const groupHeaderCellPrefixes = new SortedAddon<CellRendererCallback>();
  const groupHeaderCellSuffixes = new SortedAddon<CellRendererCallback>();
  const groupHeaderCellContent = new SortedAddon<CellRendererCallback>();

  for (const plugin of sortedPlugins) {
    plugin.onInit?.({
      store,
      headerPrefixes,
      leftTableCells,
      rightTableCells,
      leftTableHeaders,
      rightTableHeaders,
      ...pluginAddons,
      groupHeaderCellContent,
      groupHeaderCellPrefixes,
      groupHeaderCellSuffixes,
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
        result = (await plugin.afterLoad?.({ res: result, store })) ?? result;
      }
      return result;
    },
    headerPrefixes,
    leftTableCells,
    rightTableCells,
    leftTableHeaders,
    rightTableHeaders,
    groupHeaderCellSuffixes,
    groupHeaderCellContent,
    groupHeaderCellPrefixes,
  };

  // @ts-ignore: some privats
  store[PLUGIN_CONTAINER_ACCESSOR] = container;

  return container;
};
