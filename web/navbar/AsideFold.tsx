import FoldHorizontal from "lucide-react/dist/esm/icons/fold-horizontal.js";
import UnfoldHorizontal from "lucide-react/dist/esm/icons/unfold-horizontal.js";

import { ui } from "../state.ts";

export function AsideFold() {
  return (
    <a
      role="button"
      className="btn btn-ghost"
      onClick={() => {
        ui.value.dense = ui.value.dense == "1" ? "0" : "1";
        ui.value = { ...ui.value };
      }}
    >
      <UnfoldHorizontal
        className="hidden dense:block"
        style={{ width: "24px", height: "24px" }}
      />
      <FoldHorizontal
        className="block dense:hidden"
        style={{ width: "24px", height: "24px" }}
      />
    </a>
  );
}

export default AsideFold;
