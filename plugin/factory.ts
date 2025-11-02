import { ColumnRendererCallback, ITablePlugin } from "./types.ts";
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

  const headerPrefixes = new SortedAddon<ColumnRendererCallback>();

  for (const plugin of sortedPlugins) {
    plugin.onInit?.({ store, headerPrefixes });
  }

  return {
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
  };
};
