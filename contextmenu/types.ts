import { ComponentChildren, h } from "preact";

export interface ContextMenuItem {
  id: string;
  parent?: string | "main";
  menu: string | "main";
  order?: number;
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  action: (ctx: MenuContext) => void;
}

export type MenuContext = {
  column?: string;
  rowId?: string;
  index?: string;
  placement: "body" | "outside";
} | null;

export interface MenuItem {
  id: string;
  label: (ctx: MenuContext) => ComponentChildren;
  visibility: (ctx: MenuContext) => boolean;
  action?: (ctx: MenuContext) => void;
  submenu?: ContextMenu;
}
export interface ContextMenu {
  title?: string;
  items: MenuItem[];
}
