import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/mod.ts";

interface OrderedColumnsProps {
  store: TableStore;
}

export function useOrderedColumns({ store }: OrderedColumnsProps) {
  return useMemo(() => {
    const colOrder = store.state.columnOrder.value;
    const columns = store.state.columns.value;
    if (colOrder.length === 0) {
      return columns;
    }
    return [...colOrder, ...columns.filter((c) => !colOrder.includes(c))];
  }, [store.state.columnOrder.value, store.state.columns.value]);
}
