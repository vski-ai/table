import { cn } from "@/common/className.ts";

import AlignStart from "lucide-react/dist/esm/icons/text-align-start.js";
import AlignCenter from "lucide-react/dist/esm/icons/text-align-center.js";
import AlignEnd from "lucide-react/dist/esm/icons/text-align-end.js";

import type { StyleProps } from "./mutations.ts";
import * as mutations from "./mutations.ts";

export const VerticalAlign = (props: StyleProps) => {
  const currentStyle = mutations.getStyle(props);

  const isMiddle = currentStyle["vertical-align"]
    ? currentStyle["vertical-align"] === "middle"
    : true;
  const isTop = currentStyle["vertical-align"] === "baseline";
  const isBottom = currentStyle["vertical-align"] === "bottom";

  const toggleMiddle = () => {
    const style = {
      "vertical-align": "middle",
    };
    mutations.setStyle({ ...props, style });
  };

  const toggleBottom = () => {
    const style = {
      "vertical-align": isBottom ? "middle" as const : "bottom" as const,
    };
    mutations.setStyle({ ...props, style });
  };

  const toggleTop = () => {
    const style = {
      "vertical-align": isTop ? "middle" as const : "baseline" as const,
    };
    mutations.setStyle({ ...props, style });
  };

  return (
    <>
      <div class="vt-fmt-text-align-wrap">
        <button
          type="button"
          tabIndex={0}
          onClick={toggleTop}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isTop,
          })}
        >
          <AlignStart className="rotate-90" />
        </button>
        <button
          type="button"
          tabIndex={0}
          onClick={toggleMiddle}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isMiddle,
          })}
        >
          <AlignCenter className="rotate-90" />
        </button>
        <button
          type="button"
          tabIndex={0}
          onClick={toggleBottom}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isBottom,
          })}
        >
          <AlignEnd className="rotate-90" />
        </button>
      </div>
    </>
  );
};
