import { ContextMenuItem, MenuContext } from "@/contextmenu/types.ts";
import RightIcon from "lucide-react/dist/esm/icons/panel-right.js";
import LeftIcon from "lucide-react/dist/esm/icons/panel-left.js";
import UnPin from "lucide-react/dist/esm/icons/pin-off.js";
import Pin from "lucide-react/dist/esm/icons/pin.js";
import { ColumnStickCommand } from "./store.ts";

const STICKY_COLUMN = "sticky_column";

export const Stick: ContextMenuItem = {
  menu: STICKY_COLUMN,
  order: Infinity,
  visibility: ({ column, placement, store }) =>
    (!!column && placement === "outside") &&
    !store.state.stickyColumns.value[column],
  title: ({ column }) => (
    <div class="flex justify-between w-full">
      Pin Column
      <span class="badge badge-xs badge-accent">
        {column}
      </span>
    </div>
  ),

  label({ column }) {
    return (
      <>
        <Pin />
        Pin
        <span class="badge badge-xs badge-accent absolute right-3">
          {column}
        </span>
      </>
    );
  },
  action() {},
};

export const StickLeft: ContextMenuItem = {
  menu: "column-stick-left",
  parent: STICKY_COLUMN,
  visibility: (ctx) => !!ctx?.column,
  label() {
    return (
      <>
        <LeftIcon />
        Pin Left
      </>
    );
  },
  action({ store, column }) {
    if (!column) return;
    store.dispatch<ColumnStickCommand>({
      type: "COLUMN_STICK_SET",
      payload: {
        column,
        position: "left",
      },
    });
  },
};

export const StickRight: ContextMenuItem = {
  menu: "column-stick-right",
  parent: STICKY_COLUMN,
  visibility: (ctx) => !!ctx?.column,
  label() {
    return (
      <>
        <RightIcon />
        Pin Right
      </>
    );
  },
  action({ store, column }) {
    if (!column) return;
    store.dispatch<ColumnStickCommand>({
      type: "COLUMN_STICK_SET",
      payload: {
        column,
        position: "right",
      },
    });
  },
};

const unpinVisibility = ({ store, column }: MenuContext) =>
  !!column && !!store.state.stickyColumns.value[column];

const unpinLabel = ({ column }: MenuContext) => {
  return (
    <>
      <UnPin />
      Unpin
      <span class="badge badge-xs badge-accent">
        {column}
      </span>
    </>
  );
};

const unpinAction = ({ store, column }: MenuContext) => {
  if (!column) return;
  store.dispatch<ColumnStickCommand>({
    type: "COLUMN_STICK_SET",
    payload: {
      column,
      position: false,
    },
  });
};

export const StickReset: ContextMenuItem = {
  menu: "column-stick-reset",
  parent: STICKY_COLUMN,
  order: Infinity,
  visibility: unpinVisibility,
  label: unpinLabel,
  action: unpinAction,
};

export const UnpinColumn: ContextMenuItem = {
  menu: "main",
  order: Infinity,
  title: (ctx) => (
    <span>
      Unpin
      <span class="badge badge-xs badge-accent absolute ml-3">
        {ctx?.column}
      </span>
    </span>
  ),
  visibility: unpinVisibility,
  label: unpinLabel,
  action: unpinAction,
};
