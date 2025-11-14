import { ITableModule, ModuleInitCallback } from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/addMenuItems.ts";
import { renderColumnsManager } from "./components/ColumnsManager.tsx";
import { MenuItems } from "./menu.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({
  store,
  beforetable,
}) => {
  beforetable.use(-1, renderColumnsManager);
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
