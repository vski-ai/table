import { TableStore } from "@/store/types.ts";
import { cn } from "@/common/className.ts";

import AlignStart from "lucide-react/dist/esm/icons/text-align-start.js";
import AlignCenter from "lucide-react/dist/esm/icons/text-align-center.js";
import AlignEnd from "lucide-react/dist/esm/icons/text-align-end.js";

import type { StyleProps } from "./styleAction.ts";
import * as styleAction from "./styleAction.ts";

export const TextAlign = (props: StyleProps) => {
  const currentStyle = styleAction.getStyle(props);

  const isLeft = currentStyle["text-align"]
    ? currentStyle["text-align"] === "left"
    : true;
  const isRight = currentStyle["text-align"] === "right";
  const isCenter = currentStyle["text-align"] === "center";

  const toggleLeft = () => {
    const style = {
      "text-align": "left",
    };
    styleAction.setStyle({ ...props, style });
  };

  const toggleRight = () => {
    const style = {
      "text-align": isRight ? "left" as const : "right" as const,
    };
    styleAction.setStyle({ ...props, style });
  };

  const toggleCenter = () => {
    const style = {
      "text-align": isCenter ? "left" as const : "center" as const,
    };
    styleAction.setStyle({ ...props, style });
  };

  return (
    <>
      <div class="vt-fmt-text-align-wrap">
        <a
          onClick={toggleLeft}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isLeft,
          })}
        >
          <AlignStart />
        </a>
        <a
          onClick={toggleCenter}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isCenter,
          })}
        >
          <AlignCenter />
        </a>
        <a
          onClick={toggleRight}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isRight,
          })}
        >
          <AlignEnd />
        </a>
      </div>
    </>
  );
};
