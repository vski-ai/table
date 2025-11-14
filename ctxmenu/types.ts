import { TableStore } from "@/module/store/types.ts";
import { ComponentChildren } from "preact";

export interface ContextMenuItem {
  parent?: string | "main";
  menu: string | "main";
  order?: number;
  title?: (ctx: MenuContext) => ComponentChildren;
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  action?: (ctx: MenuContext) => void;
}

export type MenuContext = {
  column?: string;
  rowId?: string;
  index?: string;
  tabIndex?: number;
  placement: "body" | "outside";
  store: TableStore;
};

export interface MenuItem {
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  action?: (ctx: MenuContext) => void;
  submenu?: ContextMenu;
}
export interface ContextMenu {
  title?: (ctx: MenuContext) => ComponentChildren;
  items: MenuItem[];
}
