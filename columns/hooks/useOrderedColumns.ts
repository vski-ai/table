import { TableStore } from "@/module/mod.ts";

interface OrderedColumnsProps {
  store: TableStore;
}

export function useOrderedColumns({ store }: OrderedColumnsProps) {
  const colOrder = store.state.columns.ordered.value;
  const columns = store.state.columns.all.value;
  const res = [
    ...(colOrder ?? []),
    ...columns.filter((c) => !colOrder.includes(c)),
  ]
    .filter((c) => store.state.columns.visibility.value[c] !== false);
  return res;
}
