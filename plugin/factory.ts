import {
  CellRendererCallback,
  ClassResolverCallback,
  ColumnRendererCallback,
  CommonRendererCallback,
  ITablePlugin,
  StyleResolverCallback,
} from "./types.ts";
import { PLUGIN_CONTAINER_ACCESSOR } from "./private.ts";

import { TableStore } from "../store/mod.ts";
import { SortedAddon } from "./addon.ts";
import { DataLoadOptions, DataLoadResult } from "@/fetcher/types.ts";

import { DatatypePlugin } from "@/datatype/plugin.ts";
import { StylingPlugin } from "@/styling/plugin.ts";
import { ContextMenuPlugin } from "@/contextmenu/plugin.ts";
import { ColumnsPlugin } from "@/columns/plugin.ts";
import { RowsPlugin } from "@/row/plugin.ts";

export const createPlugin = (plugin: ITablePlugin) => plugin;
export type PluginContainer = ReturnType<typeof createPluginContainer>;

export const buildInPlugins = [
  StylingPlugin,
  ColumnsPlugin,
  DatatypePlugin,
  ContextMenuPlugin,
  RowsPlugin,
];

export const createPluginContainer = (
  store: TableStore,
  plugins: ITablePlugin[],
) => {
  plugins = [...buildInPlugins, ...plugins];
  const sortedPlugins = [...plugins].sort((a, b) => {
    if (a.dependencies?.includes(b.name)) {
      return 1;
    }
    if (b.dependencies?.includes(a.name)) {
      return -1;
    }
    return 0;
  });

  const beforetable = new SortedAddon<CommonRendererCallback>();
  const insidetable = new SortedAddon<CommonRendererCallback>();
  const aftertable = new SortedAddon<CommonRendererCallback>();
  const headerprefixes = new SortedAddon<ColumnRendererCallback>();
  const lefttablecells = new SortedAddon<CellRendererCallback>();
  const cellprefixes = new SortedAddon<CellRendererCallback>();
  const cellsuffixes = new SortedAddon<CellRendererCallback>();
  const righttablecells = new SortedAddon<CellRendererCallback>();
  const lefttableheaders = new SortedAddon<ColumnRendererCallback>();
  const righttableheaders = new SortedAddon<ColumnRendererCallback>();
  const rowclasses = new SortedAddon<ClassResolverCallback>();
  const rowstyles = new SortedAddon<StyleResolverCallback>();

  setTimeout(() => {
    for (const plugin of sortedPlugins) {
      plugin.onInit?.({
        store,
        headerprefixes,
        lefttablecells,
        righttablecells,
        lefttableheaders,
        righttableheaders,
        cellprefixes,
        cellsuffixes,
        rowclasses,
        rowstyles,
        beforetable,
        insidetable,
        aftertable,
      });
    }
  });

  const beforeLoad = async (options: DataLoadOptions) => {
    let result = options;
    for (const plugin of sortedPlugins) {
      result = (await plugin.beforeLoad?.({
        options: result,
        store,
      })) ?? result;
    }
    return result;
  };

  const afterLoad = async (res: DataLoadResult) => {
    let result = res;
    for (const plugin of sortedPlugins) {
      result = (await plugin.afterLoad?.({ res: result, store })) ?? result;
    }
    return result;
  };

  const container = {
    beforeLoad,
    afterLoad,
    headerprefixes,
    lefttablecells,
    righttablecells,
    lefttableheaders,
    righttableheaders,
    cellprefixes,
    cellsuffixes,
    rowclasses,
    rowstyles,
    beforetable,
    insidetable,
    aftertable,
  };

  // @ts-ignore: some privats
  store[PLUGIN_CONTAINER_ACCESSOR] = container;

  return container;
};
