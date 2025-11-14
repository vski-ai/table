export * from "./types.ts";
export * from "./components/TypeFormat.tsx";

import { ITableModule, ModuleInitCallback } from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/mod.ts";
import { MenuItems } from "./menu.tsx";
import { NumberMenuItems } from "./number/menu.tsx";
import { DateMenuItems } from "./date/menu.tsx";
import {
  CurrencyFormater,
  NumberFormater,
  UnitFormater,
} from "./number/Formater.tsx";
import { DateFormater } from "./date/Formater.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({ store }) => {
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

export const DatatypeModule: ITableModule = {
  name: "datatypes",
  store,
  onInit,
};
