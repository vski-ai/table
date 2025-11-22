import {
  CellRendererCallback,
  ClassResolverCallback,
  ColumnRendererCallback,
  CommonRendererCallback,
  ITableModule,
  StyleResolverCallback,
} from "./types.ts";
import { ADDONS_CONTAINER_ACCESSOR } from "./hooks/private.ts";

import { TableStore } from "./store/mod.ts";
import { SortedAddon } from "./components/SortedAddon.ts";

import {
  DataFetcherModule,
  DataLoadOptions,
  DataLoadResult,
} from "@/fetcher/mod.ts";
import { TableModule } from "@/table/module.ts";
import { TableCellModule } from "@/cell/mod.ts";
import { TableColumnsModule } from "@/columns/mod.ts";
import { ContextMenuModule } from "@/ctxmenu/mod.ts";
import { DatatypeModule } from "@/datatype/mod.ts";
import { EditingModule } from "@/editing/mod.ts";
import { RowData, RowsModule } from "@/row/mod.ts";

import { StylingModule } from "@/styling/mod.ts";

import { InputModule } from "@/input/mod.ts";

export const createPlugin = (plugin: ITableModule) => plugin;
export type PluginContainer = ReturnType<typeof createPluginContainer>;

export const buildInModules = [
  TableModule,
  DataFetcherModule,
  TableCellModule,
  TableColumnsModule,
  RowsModule,
  ContextMenuModule,
  DatatypeModule,
  EditingModule,
  InputModule,
  StylingModule,
];

export const createPluginContainer = (
  store: TableStore,
  plugins: ITableModule[],
) => {
  plugins = [...buildInModules, ...plugins];
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
  const beforesettings = new SortedAddon<CommonRendererCallback>();
  const aftersettings = new SortedAddon<CommonRendererCallback>();
  const aftertable = new SortedAddon<CommonRendererCallback>();
  const headerprefixes = new SortedAddon<ColumnRendererCallback>();
  const lefttablecells = new SortedAddon<CellRendererCallback>();
  const beforecells = new SortedAddon<CellRendererCallback>();
  const aftercells = new SortedAddon<CellRendererCallback>();
  const cellprefixes = new SortedAddon<CellRendererCallback>();
  const cellsuffixes = new SortedAddon<CellRendererCallback>();
  const righttablecells = new SortedAddon<CellRendererCallback>();
  const lefttableheaders = new SortedAddon<ColumnRendererCallback>();
  const beforeheaders = new SortedAddon<ColumnRendererCallback>();
  const afterheaders = new SortedAddon<ColumnRendererCallback>();
  const righttableheaders = new SortedAddon<ColumnRendererCallback>();
  const rowclasses = new SortedAddon<ClassResolverCallback>();
  const columnclasses = new SortedAddon<ClassResolverCallback>();
  const headerclasses = new SortedAddon<ClassResolverCallback>();
  const rowstyles = new SortedAddon<StyleResolverCallback>();
  const beforepadding = new SortedAddon<CommonRendererCallback>();
  const afterpadding = new SortedAddon<CommonRendererCallback>();

  setTimeout(async () => {
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
        columnclasses,
        rowstyles,
        beforetable,
        insidetable,
        aftertable,
        beforesettings,
        aftersettings,
        beforecells,
        aftercells,
        beforeheaders,
        afterheaders,
        beforepadding,
        afterpadding,
        headerclasses,
      });
    }
    await new Promise((r) => setTimeout(r, 1));
    for (const plugin of sortedPlugins) {
      plugin.afterInit?.({
        store,
        headerprefixes,
        lefttablecells,
        righttablecells,
        lefttableheaders,
        righttableheaders,
        cellprefixes,
        cellsuffixes,
        rowclasses,
        columnclasses,
        rowstyles,
        beforetable,
        insidetable,
        aftertable,
        beforesettings,
        aftersettings,
        beforecells,
        aftercells,
        beforeheaders,
        afterheaders,
        beforepadding,
        afterpadding,
        headerclasses,
      });
    }
  }, 0);

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

  const beforeRender = (res: (RowData | null)[]) => {
    let result = res;
    for (const plugin of sortedPlugins) {
      result = plugin.beforeRender?.({ res: result, store }) ?? result;
    }
    return result;
  };

  const container = {
    beforeLoad,
    afterLoad,
    beforeRender,
    headerprefixes,
    lefttablecells,
    righttablecells,
    lefttableheaders,
    righttableheaders,
    cellprefixes,
    cellsuffixes,
    rowclasses,
    columnclasses,
    rowstyles,
    beforetable,
    insidetable,
    aftertable,
    beforesettings,
    aftersettings,
    beforecells,
    aftercells,
    beforeheaders,
    afterheaders,
    beforepadding,
    afterpadding,
    headerclasses,
  };

  // @ts-ignore: some privats
  store[ADDONS_CONTAINER_ACCESSOR] = container;

  return container;
};
