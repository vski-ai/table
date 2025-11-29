export * from "./types.ts";
import {
  BeforeInitCallback,
  ModuleInitCallback,
  XModule,
} from "@xmod/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderColumnSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ table }) => {
  table.before.use(renderColumnSettings);
};

const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableColumnsModule: XModule = {
  name: "columns",
  beforeInit,
  onInit,
  store,
  slots,
};
