import { Store } from "@xmod/mod.ts";

interface OrderedColumnsProps {
  store: Store;
  visibility?: boolean;
}

export function useOrderedColumns({
  store,
  visibility = true,
}: OrderedColumnsProps) {
  const colOrder = store.state.columns.ordered.value;
  const columns = store.state.columns.all.value;

  const res = [
    ...(colOrder ?? []),
    ...columns.filter((c) => !colOrder.includes(c)),
  ].filter((c) =>
    visibility ? store.state.columns.visibility.value[c] !== false : true
  );
  return res;
}
