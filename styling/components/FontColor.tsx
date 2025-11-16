import TypeIcon from "lucide-react/dist/esm/icons/type.js";

import type { StyleProps } from "./mutations.ts";
import * as mutations from "./mutations.ts";
import { TargetedEvent } from "preact";
import { getDefaultColor } from "./utils.ts";

export const FontColor = (props: StyleProps) => {
  const currentStyle = mutations.getStyle(props);
  const currentValue = currentStyle.color;

  const onChange = (ev: TargetedEvent<HTMLInputElement, InputEvent>) => {
    const target = ev.target as HTMLInputElement;
    const style = {
      "color": target?.value,
    };
    mutations.setStyle({ ...props, style });
  };

  return (
    <div class="vt-fmt-color-w">
      <TypeIcon className="vt-fmt-color-i left" />
      <input
        tabIndex={0}
        onInput={onChange}
        type="color"
        value={currentValue ?? getDefaultColor("#555")}
        class="color-i"
      />
    </div>
  );
};
