import { TableStore } from "@/store/mod.ts";

interface OrderedColumnsProps {
  store: TableStore;
}

export function useOrderedColumns({ store }: OrderedColumnsProps) {
  const colOrder = store.state.columnOrder.value;
  const columns = store.state.columns.value;
  const res = [
    ...(colOrder ?? []),
    ...columns.filter((c) => !colOrder.includes(c)),
  ]
    .filter((c) => store.state.columnVisibility.value[c] !== false);
  return res;
}
