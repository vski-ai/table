import { useCallback } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { TableStore } from "@/module/types.ts";

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
  const rowHeights = store.state.rows.heights.value;

  return useCallback((row: RowData | null) => {
    if (!row) {
      return height;
    }

    const rowId = row[rowKey];
    if (rowHeights[rowId]) {
      return rowHeights[rowId] || store.state.table.row_height.value || height;
    }

    return height;
  }, [height, rowHeights, store.state.table.row_height.value]);
}
