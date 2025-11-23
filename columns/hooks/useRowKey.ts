import { Store } from "@xmod/types.ts";
import { useMemo } from "preact/hooks";

type RowKeyProps = {
  store: Store;
};

export function useRowKey({ store }: RowKeyProps) {
  const columns = store.state.columns.all?.value ?? [];
  const rowIdentifier = "id";
  return useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);
}
