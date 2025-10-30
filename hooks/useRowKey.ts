import { useMemo } from "preact/hooks";

export function useRowKey(columns: string[], rowIdentifier?: string) {
  return useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);
}
