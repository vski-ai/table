import { ContextMenuItem } from "@/contextmenu/types.ts";
import RightIcon from "lucide-react/dist/esm/icons/panel-right.js";
import LeftIcon from "lucide-react/dist/esm/icons/panel-left.js";
import Reset from "lucide-react/dist/esm/icons/rotate-ccw.js";

const STICKY_COLUMN = "sticky_column";

export const Stick: ContextMenuItem = {
  menu: STICKY_COLUMN,
  title: (ctx) => (
    <span>
      Fix Column
      <span class="badge badge-xs badge-accent absolute right-3 top-3">
        {ctx?.column}
      </span>
    </span>
  ),
  visibility: (ctx) => !!ctx?.column,
  label: () => "Sticky Columns",
  action() {},
};

export const StickLeft: ContextMenuItem = {
  menu: "column-stick-left",
  parent: STICKY_COLUMN,
  visibility: (ctx) => !!ctx?.column,
  label(ctx) {
    return (
      <>
        <LeftIcon />
        Stick Left
      </>
    );
  },
  action() {},
};

export const StickRight: ContextMenuItem = {
  menu: "column-stick-right",
  parent: STICKY_COLUMN,
  visibility: (ctx) => !!ctx?.column,
  label(ctx) {
    return (
      <>
        <RightIcon />
        Stick Right
      </>
    );
  },
  action() {},
};

export const StickReset: ContextMenuItem = {
  menu: "column-stick-reset",
  parent: STICKY_COLUMN,
  visibility: (ctx) => !!ctx?.column,
  label(ctx) {
    return (
      <>
        <Reset />
        Reset
      </>
    );
  },
  action() {},
};
