import { TableStore } from "@/store/types.ts";
import { useMemo } from "preact/hooks";

type RowKeyProps = {
  store: TableStore;
};

export function useRowKey({
  store,
}: RowKeyProps) {
  const columns = store.state.columns.value;
  const rowIdentifier = "id";
  return useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);
}
