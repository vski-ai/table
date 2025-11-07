import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { contextMenuRenderCallback } from "./ContextMenu.tsx";
import { addMenuItems } from "./addMenuItems.ts";
import { Copy } from "./default.tsx";

const onInit: PluginInitCallback = ({ beforeTable, store }) => {
  beforeTable.use(0, contextMenuRenderCallback);
  addMenuItems({
    store,
    items: [
      Copy,
    ],
  });
};

export const ContextMenuPlugin: ITablePlugin = {
  name: "contextmenu",
  onInit,
};
