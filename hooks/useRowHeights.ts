import { useMemo } from "preact/hooks";
import { Row } from "@/table/types.ts";
import { TableStore } from "@/store/types.ts";

interface RowHeightsProps {
  data: Row[];
  store: TableStore;
  expandable?: boolean;
  height?: number;
  rowKey?: string;
}

export function useRowHeights({
  data,
  store,
  expandable,
  height = 64,
  rowKey = "id",
}: RowHeightsProps) {
  return useMemo(() => {
    return data.map((row) => {
      if (
        expandable && store.state.expandedRows.value.includes(row[rowKey])
      ) {
        // TODO: Replace 100 with a dynamic height calculation
        return height + 100; // 100 is a placeholder for the expanded content height
      }
      return height;
    });
  }, [data, expandable, height, store.state.expandedRows.value]);
}
