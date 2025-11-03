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
  expandable,
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

    if (
      expandable && store.state.expandedRows.value.includes(row[rowKey])
    ) {
      // TODO: Replace 100 with a dynamic height calculation
      return height + 100; // 100 is a placeholder for the expanded content height
    }
    return height;
  }, [expandable, height, store.state.expandedRows.value, rowHeights]);
}
