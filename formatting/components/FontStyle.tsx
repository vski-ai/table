import { TableStore } from "@/store/types.ts";
import { cn } from "@/common/className.ts";

import Bold from "lucide-react/dist/esm/icons/bold.js";
import Italic from "lucide-react/dist/esm/icons/italic.js";
import Underline from "lucide-react/dist/esm/icons/underline.js";
import Strikethrough from "lucide-react/dist/esm/icons/strikethrough.js";

import type { StyleProps } from "./styleAction.ts";
import * as styleAction from "./styleAction.ts";

export const FontStyle = (props: StyleProps) => {
  const currentStyle = styleAction.getStyle(props);

  const isBold = currentStyle["font-weight"] === "bold";
  const isGay = currentStyle["font-style"] === "italic";
  const isUnderdog = currentStyle["text-decoration"] === "underline";
  const isMyJobApplication = currentStyle["text-decoration"] === "line-through";

  const toggleBold = () => {
    const style = {
      "font-weight": isBold ? "normal" as const : "bold" as const,
    };
    styleAction.setStyle({ ...props, style });
  };

  const toggleItalic = () => {
    const style = {
      "font-style": isGay ? "normal" as const : "italic" as const,
    };
    styleAction.setStyle({ ...props, style });
  };

  const toggleDecoration = (decoration: "underline" | "line-through") => () => {
    const current = currentStyle["text-decoration"];
    const style = {
      "text-decoration": current === decoration ? "none" : decoration,
    };
    styleAction.setStyle({ ...props, style });
  };

  return (
    <>
      <div class="vt-font-style-menu-wrap">
        <a
          onClick={toggleBold}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isBold,
          })}
        >
          <Bold />
        </a>
        <a
          onClick={toggleItalic}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isGay,
          })}
        >
          <Italic />
        </a>
        <a
          onClick={toggleDecoration("underline")}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isUnderdog,
          })}
        >
          <Underline />
        </a>
        <a
          onClick={toggleDecoration("line-through")}
          class={cn({
            "vt-fmt-menu-btn": true,
            "enabled": isMyJobApplication,
          })}
        >
          <Strikethrough />
        </a>
      </div>
    </>
  );
};
