import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/mod.ts";
import * as Store from "./store.ts";
import { MenuItems } from "./menu.tsx";
import { NumberMenuItems } from "./number/menu.tsx";
import { DateMenuItems } from "./date/menu.tsx";
import {
  CurrencyFormater,
  NumberFormater,
  UnitFormater,
} from "./number/Formater.tsx";
import { DateFormater } from "./date/Formater.tsx";

const onInit: PluginInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: [
      ...MenuItems,
      ...NumberMenuItems,
      ...DateMenuItems,
    ],
  });
  store.addFormater(NumberFormater);
  store.addFormater(CurrencyFormater);
  store.addFormater(UnitFormater);
  store.addFormater(DateFormater);
};

export const DatatypePlugin: ITablePlugin = {
  name: "datatypes",
  store: Store,
  onInit,
};
