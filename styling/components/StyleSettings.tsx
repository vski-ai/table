import { BackgroundColor } from "./BackgroundColor.tsx";
import { FontColor } from "./FontColor.tsx";
import { FontSize } from "./FontSize.tsx";
import { FontStyle } from "./FontStyle.tsx";
import { TextAlign } from "./TextAlign.tsx";
import type { StyleProps } from "./mutations.ts";
import * as mutations from "./mutations.ts";

import RemoveFormatting from "lucide-react/dist/esm/icons/remove-formatting.js";

export function StyleSettings(props: StyleProps) {
  return (
    <div class="vt-fmt-style-settings-w">
      <FontStyle {...props} />
      <TextAlign {...props} />

      <div class="vt-fmt-color-wrap">
        <FontColor {...props} />
        <BackgroundColor {...props} />
      </div>
      <FontSize {...props} />

      <a
        onClick={() => {
          mutations.resetStyle(props);
        }}
        class="vt-fmt-menu-btn vt-fmt-reset"
      >
        Reset{" "}
        <RemoveFormatting style={{ width: 13, height: 13, marginLeft: 6 }} />
      </a>
    </div>
  );
}
