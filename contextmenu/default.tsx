import { ContextMenuItem, MenuContext } from "@/contextmenu/types.ts";
import RightIcon from "lucide-react/dist/esm/icons/panel-right.js";
import LeftIcon from "lucide-react/dist/esm/icons/panel-left.js";
import UnPin from "lucide-react/dist/esm/icons/pin-off.js";
import CopyIcon from "lucide-react/dist/esm/icons/copy.js";

export const Copy: ContextMenuItem = {
  menu: "default",
  visibility: ({ placement }) => placement === "body",
  label: ({}) => (
    <>
      <CopyIcon />
      Copy
    </>
  ),
  action() {
    document.execCommand("copy");
  },
};
