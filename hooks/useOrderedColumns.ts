import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/mod.ts";

interface OrderedColumnsProps {
  store: TableStore;
  columns: string[];
}

export function useOrderedColumns({
  store,
  columns,
}: OrderedColumnsProps) {
  return useMemo(() => {
    const colOrder = store.state.columnOrder.value;
    if (colOrder.length === 0) {
      return columns;
    }
    return [...colOrder, ...columns.filter((c) => !colOrder.includes(c))];
  }, [columns, store.state.columnOrder.value]);
}
