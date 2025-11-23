import type { Command, State } from "@xmod/types.ts";
import type { ContextMenu, ContextMenuItem } from "./types.ts";
import { computed, type Signal, signal } from "@preact/signals";

export const PLACEMENT_TARGET_ACESSOR = Symbol("placement");

export type PlacementTargetResolver = {
  name: string;
  match: (element: HTMLElement) => boolean;
  target: (element: HTMLElement) => HTMLElement | null;
};

type ContextMenuState = {
  context_menu: {
    menu: Signal<ContextMenu>;
    items: Signal<Record<string, ContextMenuItem>>;
    [PLACEMENT_TARGET_ACESSOR]: PlacementTargetResolver[];
  };
};

declare module "@xmod/types.ts" {
  interface State extends ContextMenuState {}
}

export const CONTEXT_MENU_ADD_ITEM = "CONTEXT_MENU_ADD_ITEM";
export type ContextMenuAddCommand = Command<
  typeof CONTEXT_MENU_ADD_ITEM,
  ContextMenuItem,
  "Add context menu item"
>;

const PlacementBody: PlacementTargetResolver = {
  name: "body",
  match: (el) => !!el.closest(".vt-cell"),
  target: (el) => el.closest(".vt-cell"),
};

const PlacementHeader: PlacementTargetResolver = {
  name: "header",
  match: (el) => !!el.closest(".vt-header"),
  target: (el) => el.closest(".vt-header"),
};

export function state(): ContextMenuState {
  const contextMenuItems = signal<Record<string, ContextMenuItem>>({});

  const contextMenu = computed<ContextMenu>(() => {
    const items = Object.values(contextMenuItems.value);

    const itemsByParent = items.reduce(
      (acc, item) => {
        const parent = item.parent || "main";
        if (!acc[parent]) {
          acc[parent] = [];
        }
        acc[parent].push(item);
        return acc;
      },
      {} as Record<string, ContextMenuItem[]>,
    );

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
            highlight: item.highlight,
            submenu: submenu,
          };
        }),
      };
    };
    return buildMenu("main");
  });

  return {
    context_menu: {
      items: contextMenuItems,
      menu: contextMenu,
      [PLACEMENT_TARGET_ACESSOR]: [PlacementBody, PlacementHeader],
    },
  };
}

export function persist(_: State) {
  return {};
}

export function mutate(state: State, command: ContextMenuAddCommand) {
  switch (command.type) {
    case CONTEXT_MENU_ADD_ITEM: {
      state.context_menu.items.value = {
        ...state.context_menu.items.value,
        [command.payload.menu]: command.payload,
      };
      break;
    }
  }
}
