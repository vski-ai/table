import { cn } from "@/common/className.ts";
import { TypeFormatComponent, TypeFormatOpts } from "../types.ts";
import { useAutoFocus } from "../components/useAutoFocus.ts";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { RowEditCommand } from "../../editing/store.ts";

export function display({ column, row, store }: TypeFormatOpts) {
  const value = store.getCurrentCellValue({
    row,
    column,
  });
  const isModified = store.isCellModified({
    row,
    column,
  });

  const opts = store.state.columnDataTypeOptions.value?.[column];

  let formattedValue = value;
  try {
    formattedValue = new Intl.DateTimeFormat(opts.locale, opts).format(
      new Date(value),
    );
  } catch (_) { /** */ }

  return (
    <div
      class={cn({
        "vt-fmt": true,
        "vt-fmt-is-dirty": isModified,
      })}
    >
      {formattedValue}
    </div>
  );
}

export function edit(opts: TypeFormatOpts) {
  const { store, row, column } = opts;
  const cellKey = store.getCellKey(opts);
  const ref = useRef<HTMLInputElement>(null);
  const updateKey = new Date().getTime();
  useAutoFocus(ref, updateKey, store);

  const onChange = useCallback((ev: InputEvent) => {
    const value = (ev.target as HTMLInputElement).valueAsDate;
    if (!value) return;
    const currentRow = store.getCurrentRowValue({ row });
    store.dispatch<RowEditCommand>({
      type: "ROW_EDIT_UPDATE",
      payload: { ...currentRow, [column]: value.toISOString() },
    });
  }, []);

  const value = store.getCurrentCellValue({
    row,
    column,
  });

  useEffect(() => {
    if (!ref.current) return;
    ref.current.valueAsDate = new Date(value);
  }, [ref.current, value, updateKey]);

  return (
    <input
      ref={ref}
      type="datetime-local"
      onChange={onChange as any}
      onBlur={onChange as any}
      class="vt-edit vt-default-edit m-0 -mt-2"
      name={cellKey}
      style={{
        height: "inherit",
      }}
    />
  );
}

export const DateFormater: TypeFormatComponent<"date"> = {
  datatype: "date",
  display,
  edit,
};
