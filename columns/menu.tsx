import { ContextMenuItem, MenuContext } from "@/ctxmenu/types.ts";
import RightIcon from "lucide-react/dist/esm/icons/panel-right.js";
import LeftIcon from "lucide-react/dist/esm/icons/panel-left.js";
import UnpinIcon from "lucide-react/dist/esm/icons/pin-off.js";
import PinIcon from "lucide-react/dist/esm/icons/pin.js";
import HideIcon from "lucide-react/dist/esm/icons/eye-off.js";
import CogIcon from "lucide-react/dist/esm/icons/columns-3-cog.js";

import {
  COLUMN_STICK_SET,
  COLUMN_VISIBILITY_SET,
  ColumnStickCommand,
  ColumnVisibilityCommand,
} from "./store.ts";

const STICKY_COLUMN = "sticky_column";

export const Stick: ContextMenuItem = {
  menu: STICKY_COLUMN,
  order: 10,
  highlight: ({ column }) => `td[data-column-name="${column}"]`,
  visibility: ({ column, placement, store }) =>
    (!!column && placement === "header") &&
    !store.state.columns.sticky.value[column],
  title: () => (
    <div class="flex justify-between w-full">
      Pin Column
    </div>
  ),

  label() {
    return (
      <>
        <PinIcon />
        Pin
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
      type: COLUMN_STICK_SET,
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
      type: COLUMN_STICK_SET,
      payload: {
        column,
        position: "right",
      },
    });
  },
};

const unpinVisibility = ({ store, column }: MenuContext) =>
  !!column && !!store.state.columns.sticky.value[column];

const unpinLabel = () => {
  return (
    <>
      <UnpinIcon />
      Unpin
    </>
  );
};

const unpinAction = ({ store, column }: MenuContext) => {
  if (!column) return;
  store.dispatch<ColumnStickCommand>({
    type: COLUMN_STICK_SET,
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
  menu: "unpin-column",
  order: 10,
  highlight: ({ column }) => `td[data-column-name="${column}"]`,
  title: () => (
    <span>
      Unpin
    </span>
  ),
  visibility: unpinVisibility,
  label: unpinLabel,
  action: unpinAction,
};

export const HideColumn: ContextMenuItem = {
  menu: "hide-column",
  order: 10,
  highlight: ({ column }) => `td[data-column-name="${column}"]`,
  visibility: ({ placement }: MenuContext) => placement === "header",
  label() {
    return (
      <>
        <HideIcon />
        Hide
      </>
    );
  },
  action({ store, column }: MenuContext) {
    if (!column) return;
    store.dispatch<ColumnVisibilityCommand>({
      type: COLUMN_VISIBILITY_SET,
      payload: {
        [column]: false,
      },
    });
  },
};

export const ManageColumns: ContextMenuItem = {
  menu: "manage-columns",
  order: 99,
  visibility: ({ placement }: MenuContext) => placement === "header",
  label() {
    return (
      <>
        <CogIcon />
        Columns
      </>
    );
  },
  action({ store }: MenuContext) {
    store.state.columns.settings_dialog.value = true;
  },
};

export const MenuItems = [
  Stick,
  StickLeft,
  StickReset,
  StickRight,
  UnpinColumn,
  HideColumn,
  ManageColumns,
];
