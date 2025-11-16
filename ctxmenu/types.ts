import { TableStore } from "@/module/store/types.ts";
import { ComponentChildren } from "preact";

export interface ContextMenuItem {
  parent?: string | "main";
  menu: string | "main";
  order?: number;
  title?: (ctx: MenuContext) => ComponentChildren;
  highlight?: (ctx: MenuContext) => string;
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  action?: (ctx: MenuContext) => void;
}

export interface MenuContext {
  column?: string;
  rowId?: string;
  index?: string;
  placement?: string;
  store: TableStore;
}

export interface MenuItem {
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  highlight?: (ctx: MenuContext) => string;
  action?: (ctx: MenuContext) => void;
  submenu?: ContextMenu;
}
export interface ContextMenu {
  title?: (ctx: MenuContext) => ComponentChildren;
  items: MenuItem[];
}
