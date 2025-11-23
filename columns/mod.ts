export * from "./types.ts";
import {
  BeforeInitCallback,
  ITableModule,
  ModuleInitCallback,
} from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderColumnSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ beforetable }) => {
  beforetable.use(renderColumnSettings);
};

const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableColumnsModule: ITableModule = {
  name: "columns",
  beforeInit,
  onInit,
  store,
  slots,
};
