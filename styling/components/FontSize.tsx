import type { StyleProps } from "./mutations.ts";
import * as mutations from "./mutations.ts";
import { TargetedEvent } from "preact";

export const FontSize = (props: StyleProps) => {
  const currentStyle = mutations.getStyle(props);

  const onChange = (ev: TargetedEvent<HTMLInputElement, InputEvent>) => {
    const target = ev.target as HTMLInputElement;
    const style = {
      "font-size": (parseFloat(target.value) / 100 * 2) + "em",
    };
    mutations.setStyle({ ...props, style });
  };

  return (
    <div>
      <div class="w-full">
        <input
          onInput={onChange}
          type="range"
          min="10"
          max="100"
          value={parseFloat(currentStyle["font-size"] ?? "1") * 100 / 2}
          class="range range-xs w-full"
          step="10"
        />
      </div>
    </div>
  );
};
