export * from "./utils/addMenuItems.ts";

import { ITableModule, ModuleInitCallback } from "@/module/mod.ts";
import { contextMenuRenderCallback } from "./ContextMenu.tsx";
import { addMenuItems } from "./utils/addMenuItems.ts";
import { Copy } from "./default.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({ beforetable, store }) => {
  beforetable.use(contextMenuRenderCallback);
  addMenuItems({
    store,
    items: [
      Copy,
    ],
  });
};

export const ContextMenuModule: ITableModule = {
  name: "contextmenu",
  onInit,
  store,
};
