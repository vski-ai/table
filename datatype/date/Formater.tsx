import { cn } from "@/common/className.ts";
import { TypeFormatComponent, TypeFormatOpts } from "../types.ts";
import { DefaultFormater } from "../components/DefaultFormater.tsx";

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

export const DateFormater: TypeFormatComponent<"date"> = {
  datatype: "date",
  display,
  edit: DefaultFormater.edit,
};
