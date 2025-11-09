import { TableStore } from "@/store/types.ts";
import { cn } from "@/common/className.ts";

import type { StyleProps } from "./styleAction.ts";
import * as styleAction from "./styleAction.ts";
import { TargetedEvent } from "preact";

export const FontSize = (props: StyleProps) => {
  const currentStyle = styleAction.getStyle(props);

  const onChange = (ev: TargetedEvent<HTMLInputElement, InputEvent>) => {
    const target = ev.target as HTMLInputElement;
    const style = {
      "font-size": (parseFloat(target.value) / 100 * 2) + "em",
    };
    styleAction.setStyle({ ...props, style });
  };

  return (
    <div>
      <div className="w-full max-w-xs">
        <input
          onInput={onChange}
          type="range"
          min="10"
          max="100"
          value={parseFloat(currentStyle["font-size"] ?? "1") * 100 / 2}
          className="range range-xs"
          step="10"
        />
      </div>
    </div>
  );
};
