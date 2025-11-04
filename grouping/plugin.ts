import {
  BeforeLoadCallback,
  CellRendererCallback,
  ITablePlugin,
  PluginInitCallback,
  SortedAddon,
} from "@/plugin/mod.ts";

type GroupHeaderCellSuffixes = SortedAddon<CellRendererCallback>;
type GroupHeaderCellPrefixes = SortedAddon<CellRendererCallback>;

declare module "@/plugin/types.ts" {
  interface PluginsInitOptions {
    groupHeaderCellPrefixes: GroupHeaderCellPrefixes;
    groupHeaderCellSuffixes: GroupHeaderCellSuffixes;
    groupHeaderCellContent: GroupHeaderCellSuffixes;
  }
}

export const groupingPlugin = (): ITablePlugin => {
  const onInit: PluginInitCallback = () => {
  };

  const groupHeaderCellPrefixes = new SortedAddon();
  const groupHeaderCellSuffixes = new SortedAddon();
  const groupHeaderCellContent = new SortedAddon();

  return {
    name: "grouping",
    addons: {
      groupHeaderCellPrefixes,
      groupHeaderCellSuffixes,
      groupHeaderCellContent,
    },
    onInit,
  };
};
