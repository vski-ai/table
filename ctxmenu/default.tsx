import { ContextMenuItem } from "@/ctxmenu/types.ts";
import CopyIcon from "lucide-react/dist/esm/icons/copy.js";

export const Copy: ContextMenuItem = {
  menu: "default",
  visibility: ({ placement }) => placement === "body",
  label: () => (
    <>
      <CopyIcon />
      Copy
    </>
  ),
  action() {
    document.execCommand("copy");
  },
};
