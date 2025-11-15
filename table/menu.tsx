import { ContextMenuItem, MenuContext } from "@/ctxmenu/types.ts";
import CogIcon from "lucide-react/dist/esm/icons/cog.js";

export const TableSettings: ContextMenuItem = {
  menu: "table-settings",
  order: Infinity,
  visibility: ({ placement }: MenuContext) => placement === "outside",
  label() {
    return (
      <>
        <CogIcon />
        Table settings
      </>
    );
  },
  action({ store }: MenuContext) {
    store.state.table.settings_dialog.value = true;
  },
};

export const MenuItems = [
  TableSettings,
];
