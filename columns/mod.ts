export * from "./hooks/useColumnnResize.ts";
export * from "./hooks/useColumnsOrderCallback.ts";
export * from "./hooks/useOrderedColumns.ts";
export * from "./hooks/useStickyColumn.ts";
export * from "./hooks/useTableColumnStyle.ts";
export * from "./hooks/useRowKey.ts";
export * from "./components/Column.tsx";
export * from "./components/Header.tsx";

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
