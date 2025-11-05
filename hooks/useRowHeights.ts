import { useCallback } from "preact/hooks";
import { Row } from "@/table/types.ts";
import { TableStore } from "@/store/types.ts";

interface RowHeightsProps {
  store: TableStore;
  expandable?: boolean;
  height?: number;
  rowKey?: string;
}

export function useRowHeights({
  store,
  height = 64,
  rowKey = "id",
}: RowHeightsProps) {
  const rowHeights = store.state.rowHeights.value;

  return useCallback((row: Row | null) => {
    if (!row) {
      return height;
    }

    const rowId = row[rowKey];
    if (rowHeights[rowId]) {
      return rowHeights[rowId] || height;
    }

    return height;
  }, [height, rowHeights]);
}
