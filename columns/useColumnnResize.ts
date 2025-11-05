import { useCallback } from "preact/hooks";

import { TableStore } from "@/store/mod.ts";
import { CommandType } from "./columnsStore.ts";

interface ColumnResizerProps {
  store: TableStore;
}

export function useColumnResizer({
  store,
}: ColumnResizerProps) {
  const handleResizeCallback = useCallback(
    (column: string, newWidth: number) => {
      store.state.resizingColumn.value = null;
      store.dispatch({
        type: CommandType.COLUMN_WIDTHS_SET,
        payload: {
          ...store.state.columnWidths.value,
          [column]: newWidth,
        },
      });
    },
    [],
  );

  const handleResizeUpdateCallback = useCallback(
    (column: string, newWidth: number) => {
      store.state.resizingColumn.value = { column, width: newWidth };
    },
    [],
  );

  const getColumnWidth = useCallback((col: string) => {
    if (
      store.state.resizingColumn.value &&
      store.state.resizingColumn.value.column === col
    ) {
      return store.state.resizingColumn.value.width;
    }
    return store.state.columnWidths.value[col] ?? 250;
  }, []);
  return {
    resizingColumn: store.state.resizingColumn,
    getColumnWidth,
    handleResizeCallback,
    handleResizeUpdateCallback,
  };
}
