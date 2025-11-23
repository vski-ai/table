import { Store } from "@xmod/types.ts";
import {
  COLUMN_DATATYPE_OPTIONS_SET,
  COLUMN_DATATYPE_SET,
  ColumnDataTypeOptionsSetCommand,
  ColumnDataTypeSetCommand,
} from "./store.ts";

export function resetFormatting({
  store,
  column,
}: {
  store: Store;
  column?: string;
}) {
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
  store: Store;
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
