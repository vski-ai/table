import { CommandType } from "./store.ts";
import { TableStore } from "@/store/types.ts";
import { ContextMenuItem } from "./types.ts";

type AddMenuItemProps = {
  store: TableStore;
  items: ContextMenuItem | ContextMenuItem[];
};

export function useAddMenuItems({
  store,
  items,
}: AddMenuItemProps) {
  if (!store.state.contextMenu) {
    return;
  }
  const data = Array.isArray(items) ? items : [items];
  for (const item of data) {
    if (store.state.contextMenuItems.value[item.id]) {
      continue;
    }
    store.dispatch({
      type: CommandType.CONTEXT_MENU_ADD_ITEM,
      payload: item,
    });
  }
}
