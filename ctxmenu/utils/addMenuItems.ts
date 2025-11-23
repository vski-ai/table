import { CONTEXT_MENU_ADD_ITEM, ContextMenuAddCommand } from "../store.ts";
import { Store } from "@xmod/types.ts";
import { ContextMenuItem } from "../types.ts";

type AddMenuItemProps = {
  store: Store;
  items: ContextMenuItem | ContextMenuItem[];
};

export function addMenuItems({ store, items }: AddMenuItemProps) {
  if (!store.state.context_menu?.menu) {
    return;
  }

  const data = Array.isArray(items) ? items : [items];
  for (const item of data) {
    if (store.state.context_menu?.items?.value[item.menu]) {
      continue;
    }
    store.dispatch<ContextMenuAddCommand>({
      type: CONTEXT_MENU_ADD_ITEM,
      payload: item,
    });
  }
}
