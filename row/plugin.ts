import {
  AfterLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/addMenuItems.ts";
import {
  bottomStickRowsRenderCallback,
  topStickRowsRenderCallback,
} from "./components/StickyRows.tsx";
import { Stick, StickBottom, StickReset, StickTop, UnpinRow } from "./menu.tsx";
import {
  StickyBottomRowsSetCommand,
  StickyTopRowsSetCommand,
} from "./store.ts";

const onInit: PluginInitCallback = ({
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

export const RowsPlugin: ITablePlugin = {
  name: "rows",
  onInit,
  afterLoad,
};
