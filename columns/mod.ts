import { ITableModule, ModuleInitCallback } from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderColumnSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({ store, beforetable }) => {
  beforetable.use(renderColumnSettings);
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableColumnsModule: ITableModule = {
  name: "columns",
  onInit,
  store,
};
