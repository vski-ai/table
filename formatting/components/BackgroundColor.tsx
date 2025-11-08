import TypeIcon from "lucide-react/dist/esm/icons/squares-subtract.js";

import type { StyleProps } from "./styleAction.ts";
import * as styleAction from "./styleAction.ts";
import { TargetedEvent } from "preact";

const getDefaultColor = () =>
  typeof document !== "undefined" && "getDefaultComputedStyle" in globalThis
    // @ts-ignore:
    ? globalThis.getDefaultComputedStyle(document.body.querySelector(".vt td"))
      .getPropertyValue("background-color")
    : "#fff";

export const BackgroundColor = (props: StyleProps) => {
  const currentStyle = styleAction.getStyle(props);
  const currentValue = currentStyle["background-color"];

  const onChange = (ev: TargetedEvent<HTMLInputElement, InputEvent>) => {
    const target = ev.target as HTMLInputElement;
    const style = {
      "background-color": target?.value,
    };
    styleAction.setStyle({ ...props, style });
  };

  return (
    <div className="vt-fmt-color-w">
      <TypeIcon className="vt-fmt-color-i right" />
      <input
        onInput={onChange}
        type="color"
        value={currentValue ?? getDefaultColor()}
        className="color-i"
      />
    </div>
  );
};
