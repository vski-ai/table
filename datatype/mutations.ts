import { TableStore } from "@/module/types.ts";
import {
  COLUMN_DATATYPE_OPTIONS_SET,
  COLUMN_DATATYPE_SET,
  ColumnDataTypeOptionsSetCommand,
  ColumnDataTypeSetCommand,
} from "./store.ts";

export function resetFormatting(
  { store, column }: { store: TableStore; column?: string },
) {
  if (!column) return;
  store.dispatch<ColumnDataTypeSetCommand>({
    type: COLUMN_DATATYPE_SET,
    payload: {
      [column]: "default",
    },
  });
  store.dispatch<ColumnDataTypeOptionsSetCommand>({
    type: COLUMN_DATATYPE_OPTIONS_SET,
    payload: {
      [column]: {},
    },
  });
}

export function setFormatting<T>({
  store,
  column,
  datatype,
  opts,
}: {
  datatype: string;
  store: TableStore;
  column?: string;
  opts: T;
}) {
  if (!column) return;
  store.dispatch<ColumnDataTypeOptionsSetCommand>({
    type: COLUMN_DATATYPE_OPTIONS_SET,
    payload: {
      [column]: opts,
    },
  });
  store.dispatch<ColumnDataTypeSetCommand>({
    type: COLUMN_DATATYPE_SET,
    payload: {
      [column]: datatype,
    },
  });
}
