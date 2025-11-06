import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/addMenuItems.ts";
import {
  Stick,
  StickLeft,
  StickReset,
  StickRight,
  UnpinColumn,
} from "./menu.tsx";

const onInit: PluginInitCallback = ({
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

export const ColumnsPlugin: ITablePlugin = {
  name: "columns",
  onInit,
};
