import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { contextMenuRenderCallback } from "./ContextMenu.tsx";

export const plugin = (): ITablePlugin => {
  const onInit: PluginInitCallback = ({
    beforeTable,
  }) => {
    beforeTable.use(0, contextMenuRenderCallback);
  };

  return {
    name: "contextmenu",
    onInit,
  };
};
