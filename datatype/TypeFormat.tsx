import { RowData } from "@/row/types.ts";
import { TableStore } from "@/store/types.ts";

export interface TypeFormatProps {
  column: string;
  row: RowData;
  store: TableStore;
}

export function TypeFormat({ store, column, row }: TypeFormatProps) {
  const key = store.getCellKey({ column, row });
  const datatype = store.state.cellDataTypes.value?.[column] ?? "default";
  const fmt = store.getFormater(datatype);
  const isEditing = store.state.cellEditing.value?.[key];
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
