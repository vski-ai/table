import { useCallback } from "preact/hooks";

import { Store } from "@xmod/mod.ts";
import { COLUMN_WIDTHS_SET, ColumnWidthCommand } from "../store.ts";

interface ColumnResizerProps {
  store: Store;
}

export function useColumnResizer({ store }: ColumnResizerProps) {
  const handleResizeCallback = useCallback(
    (column: string, newWidth: number) => {
      store.state.columns.resizing_column.value = null;
      store.dispatch<ColumnWidthCommand>({
        type: COLUMN_WIDTHS_SET,
        payload: {
          [column]: newWidth,
        },
      });
    },
    [],
  );

  const handleResizeUpdateCallback = useCallback(
    (column: string, newWidth: number) => {
      store.state.columns.resizing_column.value = { column, width: newWidth };
    },
    [],
  );

  const getColumnWidth = useCallback((col: string) => {
    if (
      store.state.columns.resizing_column.value &&
      store.state.columns.resizing_column.value.column === col
    ) {
      return store.state.columns.resizing_column.value.width;
    }
    return (
      store.state.columns.widths.value[col] ??
        store.state.table.column_width.value
    );
  }, []);
  return {
    resizingColumn: store.state.columns.resizing_column,
    getColumnWidth,
    handleResizeCallback,
    handleResizeUpdateCallback,
  };
}
