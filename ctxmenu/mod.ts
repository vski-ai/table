export * from "./utils/addMenuItems.ts";

import { BeforeInitCallback, ModuleInitCallback, XModule } from "@xmod/mod.ts";
import { contextMenuRenderCallback } from "./ContextMenu.tsx";
import { addMenuItems } from "./utils/addMenuItems.ts";
import { Copy } from "./default.tsx";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ beforetable }) => {
  beforetable.use(contextMenuRenderCallback);
};

const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: [Copy],
  });
};

export const ContextMenuModule: XModule = {
  name: "contextmenu",
  beforeInit,
  onInit,
  store,
};
