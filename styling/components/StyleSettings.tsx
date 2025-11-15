import { cn } from "@/common/className.ts";
import { BackgroundColor } from "./BackgroundColor.tsx";
import { FontColor } from "./FontColor.tsx";
import { FontSize } from "./FontSize.tsx";
import { FontStyle } from "./FontStyle.tsx";
import { TextAlign } from "./TextAlign.tsx";
import { VerticalAlign } from "./VerticalAlign.tsx";
import type { StyleProps } from "./mutations.ts";
import * as mutations from "./mutations.ts";

import RemoveFormatting from "lucide-react/dist/esm/icons/remove-formatting.js";

export function StyleSettings(props: StyleProps & { className?: string }) {
  return (
    <div class={cn(["vt-fmt-style-settings-w", props.className])}>
      <FontStyle {...props} />
      <TextAlign {...props} />
      <VerticalAlign {...props} />

      <div class="vt-fmt-color-wrap mt-3">
        <FontColor {...props} />
        <BackgroundColor {...props} />
      </div>
      <FontSize {...props} />

      <a
        onClick={() => {
          mutations.resetStyle(props);
        }}
        class="vt-fmt-menu-btn vt-fmt-reset h-8"
      >
        Reset{" "}
        <RemoveFormatting style={{ width: 13, height: 13, marginLeft: 6 }} />
      </a>
    </div>
  );
}
