import { cn } from "@/common/className.ts";
import { TypeFormatComponent, TypeFormatOpts } from "../types.ts";
import { useRef } from "preact/hooks";
import { useAutoFocus } from "./useAutoFocus.ts";
import { useEditCallback } from "./useEditCallback.ts";

export function display({ column, row, store }: TypeFormatOpts) {
  const value = store.getCurrentCellValue({
    row,
    column,
  });
  const isModified = store.isCellModified({
    row,
    column,
  });
  return (
    <div
      class={cn({
        "vt-fmt": true,
        "vt-fmt-is-dirty": isModified,
      })}
    >
      {value}
    </div>
  );
}

export function edit(opts: TypeFormatOpts) {
  const { store } = opts;
  const cellKey = store.getCellKey(opts);
  const ref = useRef<HTMLTextAreaElement>(null);
  const updateKey = new Date().getTime();

  useAutoFocus(ref, updateKey, store);

  const { value, onInput } = useEditCallback(opts);

  return (
    <textarea
      ref={ref}
      onInput={onInput}
      onBlur={onInput as any}
      class="vt-edit vt-default-edit"
      name={cellKey}
      value={value}
      style={{
        height: "inherit",
      }}
    />
  );
}

export const DefaultFormater: TypeFormatComponent<"default"> = {
  datatype: "default",
  display,
  edit,
};
