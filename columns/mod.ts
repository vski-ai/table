import { ITableModule, ModuleInitCallback } from "@/module/types.ts";
import { addMenuItems } from "@/contextmenu/addMenuItems.ts";
import {
  Stick,
  StickLeft,
  StickReset,
  StickRight,
  UnpinColumn,
} from "./menu.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({
  store,
}) => {
  addMenuItems({
    store,
    items: [
      Stick,
      StickLeft,
      StickRight,
      StickReset,
      UnpinColumn,
    ],
  });
};

export const TableColumnsModule: ITableModule = {
  name: "columns",
  onInit,
  store,
};
