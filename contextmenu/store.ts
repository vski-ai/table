import { computed, Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { ContextMenu, ContextMenuItem } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    contextMenuItems: Signal<Record<string, ContextMenuItem>>;
    contextMenu: Signal<ContextMenu>;
  }
}

const CONTEXT_MENU_ADD_ITEM = "CONTEXT_MENU_ADD_ITEM";
export type ContextMenuAddCommand = Command<
  typeof CONTEXT_MENU_ADD_ITEM,
  ContextMenuItem
>;

export function state<T>(_: Record<string, T> | null) {
  const contextMenuItems = signal<Record<string, ContextMenuItem>>({});

  const contextMenu = computed<ContextMenu>(() => {
    const items = Object.values(contextMenuItems.value);

    const itemsByParent = items.reduce((acc, item) => {
      const parent = item.parent || "main";
      if (!acc[parent]) {
        acc[parent] = [];
      }
      acc[parent].push(item);
      return acc;
    }, {} as Record<string, ContextMenuItem[]>);

    const buildMenu = (menuId: string): ContextMenu => {
      const menuItems = itemsByParent[menuId] || [];
      menuItems.sort((a, b) => (a.order || 0) - (b.order || 0));
      return {
        items: menuItems.map((item) => {
          let submenu: ContextMenu | undefined = undefined;
          if (item.menu && item.menu !== "main") {
            submenu = buildMenu(item.menu);
            submenu.title = item.title;
          }
          return {
            title: item.title,
            visibility: item.visibility,
            label: item.label,
            action: item.action,
            submenu: submenu,
          };
        }),
      };
    };
    return buildMenu("main");
  });

  return {
    contextMenuItems,
    contextMenu,
  };
}

export function persist(_: TableState) {
  return {};
}

export function reducer(state: TableState, command: ContextMenuAddCommand) {
  switch (command.type) {
    case "CONTEXT_MENU_ADD_ITEM": {
      state.contextMenuItems.value = {
        ...state.contextMenuItems.value,
        [command.payload.menu]: command.payload,
      };
      break;
    }
  }
  return state;
}
