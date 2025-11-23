export * from "./components/Row.tsx";
export * from "./components/RowLoading.tsx";
export * from "./components/RowPadding.tsx";
export * from "./components/RowSkeleton.tsx";
export * from "./types.ts";

import {
  AfterLoadCallback,
  BeforeInitCallback,
  ModuleInitCallback,
  XModule,
} from "@xmod/types.ts";
import { addMenuItems } from "@/ctxmenu/utils/addMenuItems.ts";
import {
  bottomStickRowsRenderCallback,
  topStickRowsRenderCallback,
} from "./components/StickyRows.tsx";
import { Stick, StickBottom, StickReset, StickTop, UnpinRow } from "./menu.tsx";
import {
  StickyBottomRowsSetCommand,
  StickyTopRowsSetCommand,
} from "./store.ts";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ aftertable, beforetable }) => {
  beforetable.use(topStickRowsRenderCallback);
  aftertable.use(bottomStickRowsRenderCallback);
};
const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: [Stick, StickTop, StickBottom, StickReset, UnpinRow],
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

export const RowsModule: XModule = {
  name: "rows",
  beforeInit,
  onInit,
  afterLoad,
  store,
  slots,
};
