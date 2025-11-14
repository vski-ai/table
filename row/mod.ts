export * from "./components/Row.tsx";
export * from "./components/RowLoading.tsx";
export * from "./components/RowPadding.tsx";
export * from "./components/RowSkeleton.tsx";
export * from "./types.ts";

import {
  AfterLoadCallback,
  ITableModule,
  ModuleInitCallback,
} from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/addMenuItems.ts";
import {
  bottomStickRowsRenderCallback,
  topStickRowsRenderCallback,
} from "./components/StickyRows.tsx";
import { Stick, StickBottom, StickReset, StickTop, UnpinRow } from "./menu.tsx";
import {
  StickyBottomRowsSetCommand,
  StickyTopRowsSetCommand,
} from "./store.ts";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({
  store,
  aftertable,
  beforetable,
}) => {
  beforetable.use(0, topStickRowsRenderCallback);
  aftertable.use(0, bottomStickRowsRenderCallback);
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

// server may send pinned rows
const afterLoad: AfterLoadCallback = ({ store, res }) => {
  if (res.meta.pinnedRows?.top) {
    store.dispatch<StickyTopRowsSetCommand>({
      type: "STICKY_TOP_ROWS_SET",
      payload: res.meta.pinnedRows.top,
    });
  }
  if (res.meta.pinnedRows?.bottom) {
    store.dispatch<StickyBottomRowsSetCommand>({
      type: "STICKY_BOTTOM_ROWS_SET",
      payload: res.meta.pinnedRows.bottom,
    });
  }
  return res;
};

export const RowsModule: ITableModule = {
  name: "rows",
  onInit,
  afterLoad,
  store,
};
