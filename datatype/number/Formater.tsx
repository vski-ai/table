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

  const opts = store.state.data_type.options.value?.[column];
  const formattedValue = new Intl.NumberFormat(opts.locale, opts).format(
    Number(value),
  );
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

export const NumberFormater: TypeFormatComponent<"number"> = {
  datatype: "number",
  display,
  edit: DefaultFormater.edit,
};

export const CurrencyFormater: TypeFormatComponent<"currency"> = {
  datatype: "currency",
  display,
  edit: DefaultFormater.edit,
};

export const UnitFormater: TypeFormatComponent<"unit"> = {
  datatype: "unit",
  display,
  edit: DefaultFormater.edit,
};
