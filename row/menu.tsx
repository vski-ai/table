import { ContextMenuItem, MenuContext } from "@/ctxmenu/types.ts";
import Pin from "lucide-react/dist/esm/icons/pin.js";
import UnPin from "lucide-react/dist/esm/icons/pin-off.js";
import TopIcon from "lucide-react/dist/esm/icons/arrow-up-to-line.js";
import BottomIcon from "lucide-react/dist/esm/icons/arrow-down-to-line.js";
import {
  STICKY_BOTTOM_ROWS_SET,
  STICKY_TOP_ROWS_SET,
  StickyBottomRowsSetCommand,
  StickyTopRowsSetCommand,
} from "./store.ts";
import { RowData } from "./types.ts";

const STICKY_ROW = "sticky_rows";

export const Stick: ContextMenuItem = {
  menu: STICKY_ROW,
  order: Infinity,
  title: () => (
    <div class="flex justify-between w-full font-bold">
      Pin Row
    </div>
  ),
  visibility: ({ placement, store, rowId }) =>
    placement === "body" && (
      !(store.state.rows.sticky_top.value.some((r: RowData) =>
        r.id.toString() === rowId
      ) ||
        store.state.rows.sticky_bottom.value.some((r: RowData) =>
          r.id.toString() === rowId
        ))
    ),
  label() {
    return (
      <>
        <Pin />
        Pin Row
      </>
    );
  },
  action() {},
};

export const StickTop: ContextMenuItem = {
  menu: "row-stick-top",
  parent: STICKY_ROW,
  visibility: () => true,
  label() {
    return (
      <>
        <TopIcon />
        Pin Top
      </>
    );
  },
  action({ store, rowId }) {
    const row = store.getRow(rowId!);
    if (!row) return;
    const currentSticky = store.state.rows.sticky_top.value;
    store.dispatch<StickyTopRowsSetCommand>({
      type: STICKY_TOP_ROWS_SET,
      payload: [...currentSticky, row] as RowData[],
    });
  },
};

export const StickBottom: ContextMenuItem = {
  menu: "row-stick-bottom",
  parent: STICKY_ROW,
  order: 2,
  visibility: (ctx) => true,
  label() {
    return (
      <>
        <BottomIcon />
        Pin Bottom
      </>
    );
  },
  action({ store, rowId }) {
    const row = store.getRow(rowId!);
    if (!row) return;
    const currentSticky = store.state.rows.sticky_bottom.value;
    store.dispatch<StickyBottomRowsSetCommand>({
      type: STICKY_BOTTOM_ROWS_SET,
      payload: [...currentSticky, row] as RowData[],
    });
  },
};

const unpinVisibility = ({ store, rowId }: MenuContext) => {
  const row = store.getRow(rowId!);
  return !!row &&
    (store.state.rows.sticky_top.value.some((r: RowData) => r.id === row.id) ||
      store.state.rows.sticky_bottom.value.some((r: RowData) =>
        r.id === row.id
      ));
};

const unpinLabel = () => {
  return (
    <>
      <UnPin />
      Unpin
    </>
  );
};

const unpinAction = ({ store, rowId }: MenuContext) => {
  const row = store.getRow(rowId!);
  if (!row) return;
  const { sticky_bottom, sticky_top } = store.state.rows;
  sticky_top.value = sticky_top.value.filter((r: RowData) => r.id !== row.id);
  sticky_bottom.value = sticky_bottom.value.filter(
    (r: RowData) => r.id !== row.id,
  );
};

export const StickReset: ContextMenuItem = {
  menu: "row-stick-reset",
  parent: STICKY_ROW,
  order: Infinity,
  visibility: unpinVisibility,
  label: unpinLabel,
  action: unpinAction,
};

export const UnpinRow: ContextMenuItem = {
  menu: "row-unpin",
  order: Infinity,
  title: (ctx) => (
    <span>
      Unpin
    </span>
  ),
  visibility: unpinVisibility,
  label: unpinLabel,
  action: unpinAction,
};
