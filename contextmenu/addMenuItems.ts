import { ContextMenuAddCommand } from "./store.ts";
import { TableStore } from "@/store/types.ts";
import { ContextMenuItem } from "./types.ts";

type AddMenuItemProps = {
  store: TableStore;
  items: ContextMenuItem | ContextMenuItem[];
};

export function addMenuItems({
  store,
  items,
}: AddMenuItemProps) {
  if (!store.state.contextMenu) {
    return;
  }
  const data = Array.isArray(items) ? items : [items];
  for (const item of data) {
    if (store.state.contextMenuItems.value[item.menu]) {
      continue;
    }
    store.dispatch<ContextMenuAddCommand>({
      type: "CONTEXT_MENU_ADD_ITEM",
      payload: item,
    });
  }
}
