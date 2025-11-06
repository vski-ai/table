import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { contextMenuRenderCallback } from "./ContextMenu.tsx";

const onInit: PluginInitCallback = ({ beforeTable }) => {
  beforeTable.use(0, contextMenuRenderCallback);
};

export const ContextMenuPlugin: ITablePlugin = {
  name: "contextmenu",
  onInit,
};
