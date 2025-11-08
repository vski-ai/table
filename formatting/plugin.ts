import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/mod.ts";
import { renderStyleFormat } from "./StyleFormat.tsx";
import { MenuItems } from "./menu.tsx";

const onInit: PluginInitCallback = ({ store, beforetable }) => {
  beforetable.use(-1, renderStyleFormat);
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const FormattingPlugin: ITablePlugin = {
  name: "formatting",
  onInit,
};
