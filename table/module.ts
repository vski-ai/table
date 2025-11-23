import {
  BeforeInitCallback,
  ITableModule,
  ModuleInitCallback,
} from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderTableSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ beforetable }) => {
  beforetable.use(renderTableSettings);
};

const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableModule: ITableModule = {
  name: "table",
  beforeInit,
  onInit,
  store,
  slots,
};
