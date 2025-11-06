import { ComponentChildren, h } from "preact";

export interface ContextMenuItem {
  id: string;
  parent?: string | "main";
  menu: string | "main";
  order?: number;
  icon?: ComponentChildren;
  label: ComponentChildren;
  action: () => void;
}

export interface ContextMenu {
  title?: string;
  items: {
    id: string;
    icon?: ComponentChildren;
    label: string | ComponentChildren;
    action?: () => void;
    submenu?: ContextMenu;
  }[];
}
