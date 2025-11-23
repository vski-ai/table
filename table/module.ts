import { BeforeInitCallback, ModuleInitCallback, XModule } from "@xmod/mod.ts";

import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import { renderSettings } from "./components/Settings.tsx";
import { MenuItems } from "./menu.tsx";
import { slots } from "./slots.ts";
import { hooks } from "./hooks.ts";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ beforetable }) => {
  beforetable.use(renderSettings);
};

const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const TableModule: XModule = {
  name: "table",
  beforeInit,
  onInit,
  store,
  slots,
  hooks,
};
