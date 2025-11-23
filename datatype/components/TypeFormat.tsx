import { RowData } from "@/row/types.ts";
import { Store } from "@xmod/types.ts";

export interface TypeFormatProps {
  column: string;
  row: RowData;
  store: Store;
}

export function TypeFormat({ store, column, row }: TypeFormatProps) {
  const key = store.getCellKey({ column, row });
  const datatype = store.state.data_type.column.value?.[column] ?? "default";
  const fmt = store.getFormater(datatype);
  const isEditing = store.state.editing.cell.value?.[key];
  if (isEditing) {
    return fmt.edit({
      store,
      column,
      row,
    });
  }
  return fmt.display({
    store,
    column,
    row,
  });
}
