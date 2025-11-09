import { TypeFormat, TypeFormatOpts } from "./types.ts";
import { useRef } from "preact/hooks";
import { useAutoFocus } from "@/common/useAutoFocus.ts";

export function display({ column, row }: TypeFormatOpts) {
  return <div class="vt-fmt">{row[column]}</div>;
}

export function edit({ column, row }: TypeFormatOpts) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutoFocus(ref);
  return (
    <textarea
      onKeyDown={(ev) => {
      }}
      ref={ref}
      class="vt-edit vt-default-edit"
      tabIndex={0}
      value={row[column]}
      style={{
        height: "inherit",
      }}
    />
  );
}

export const DefaultFormatter: TypeFormat<"default"> = {
  datatype: "default",
  display,
  edit,
};
