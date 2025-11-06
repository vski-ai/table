import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/addMenuItems.ts";
import { Stick, StickLeft, StickReset, StickRight } from "./menu.tsx";

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
    ],
  });
};

export const ColumnsPlugin: ITablePlugin = {
  name: "columns",
  onInit,
};
