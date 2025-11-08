import { ContextMenuItem, MenuContext } from "@/contextmenu/types.ts";
import Pin from "lucide-react/dist/esm/icons/pin.js";
import UnPin from "lucide-react/dist/esm/icons/pin-off.js";
import TopIcon from "lucide-react/dist/esm/icons/arrow-up-to-line.js";
import BottomIcon from "lucide-react/dist/esm/icons/arrow-down-to-line.js";
import {
  StickyBottomRowsSetCommand,
  StickyTopRowsSetCommand,
} from "./store.ts";
import { RowData } from "./types.ts";

const STICKY_ROW = "sticky_rows";

export const Stick: ContextMenuItem = {
  menu: STICKY_ROW,
  title: () => (
    <div class="flex justify-between w-full">
      Pin Rows
    </div>
  ),
  visibility: ({ placement }) => placement === "body",
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
  action({ store, row }) {
    if (!row) return;
    const currentSticky = store.state.stickyTopRows.value;
    store.dispatch<StickyTopRowsSetCommand>({
      type: "STICKY_TOP_ROWS_SET",
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
  action({ store, row }) {
    if (!row) return;
    const currentSticky = store.state.stickyBottomRows.value;
    store.dispatch<StickyBottomRowsSetCommand>({
      type: "STICKY_BOTTOM_ROWS_SET",
      payload: [...currentSticky, row] as RowData[],
    });
  },
};

const unpinVisibility = ({ store, row }: MenuContext) =>
  !!row &&
  (store.state.stickyTopRows.value.some((r: RowData) => r.id === row.id) ||
    store.state.stickyBottomRows.value.some((r: RowData) => r.id === row.id));

const unpinLabel = () => {
  return (
    <>
      <UnPin />
      Unpin
    </>
  );
};

const unpinAction = ({ store, row }: MenuContext) => {
  if (!row) return;
  const { stickyTopRows, stickyBottomRows } = store.state;
  stickyTopRows.value = stickyTopRows.value.filter((r: RowData) =>
    r.id !== row.id
  );
  stickyBottomRows.value = stickyBottomRows.value.filter(
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
  menu: "main",
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
