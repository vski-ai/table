import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/mod.ts";
import { renderStyleFormat } from "./StyleFormat.tsx";
import { MenuItems } from "./menu.tsx";
import * as Store from "./store.ts";

const onInit: PluginInitCallback = ({ store, beforetable }) => {
  beforetable.use(-1, renderStyleFormat);
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const StylingPlugin: ITablePlugin = {
  name: "styling",
  store: Store,
  onInit,
};
