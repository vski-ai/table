import { ITableModule, ModuleInitCallback } from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderTableSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({ store, beforetable }) => {
  beforetable.use(-1, renderTableSettings);
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableModule: ITableModule = {
  name: "table",
  onInit,
  store,
};
