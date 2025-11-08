import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/addMenuItems.ts";
import {
  bottomStickRowsRenderCallback,
  topStickRowsRenderCallback,
} from "./StickyRows.tsx";
import { Stick, StickBottom, StickReset, StickTop, UnpinRow } from "./menu.tsx";

const onInit: PluginInitCallback = ({
  store,
  afterTable,
  beforeTable,
}) => {
  beforeTable.use(0, topStickRowsRenderCallback);
  afterTable.use(0, bottomStickRowsRenderCallback);
  addMenuItems({
    store,
    items: [
      Stick,
      StickTop,
      StickBottom,
      StickReset,
      UnpinRow,
    ],
  });
};

export const RowsPlugin: ITablePlugin = {
  name: "rows",
  onInit,
};
