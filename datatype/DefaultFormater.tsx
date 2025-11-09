import { cn } from "@/common/className.ts";
import { TypeFormat, TypeFormatOpts } from "./types.ts";
import { useCallback, useRef } from "preact/hooks";
import { useAutoFocus } from "@/common/useAutoFocus.ts";
import { RowEditCommand } from "@/editing/store.ts";

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

export function edit({ store, column, row }: TypeFormatOpts) {
  const cellKey = store.getCellKey({ column, row });
  const ref = useRef<HTMLTextAreaElement>(null);
  const updateKey = new Date().getTime();

  useAutoFocus(ref, updateKey);

  const onInput = useCallback((ev: InputEvent) => {
    const value = (ev.target as HTMLTextAreaElement).value;
    const currentRow = store.getCurrentRowValue({ row });
    store.dispatch<RowEditCommand>({
      type: "ROW_EDIT_UPDATE",
      payload: { ...currentRow, [column]: value },
    });
  }, []);

  const value = store.getCurrentCellValue({
    row,
    column,
  });

  return (
    <textarea
      ref={ref}
      onInput={onInput}
      class="vt-edit vt-default-edit"
      name={cellKey}
      value={value}
      style={{
        height: "inherit",
      }}
    />
  );
}

export const DefaultFormater: TypeFormat<"default"> = {
  datatype: "default",
  display,
  edit,
};
