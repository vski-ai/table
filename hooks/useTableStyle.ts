import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/types.ts";

export interface TableStyleProps {
  columns: string[];
  store: TableStore;
  getColumnWidth: (col: string) => number;
  selectable?: boolean;
  expandable?: boolean;
  hasAddon?: boolean;
}

export function useTableStyle({
  store,
  getColumnWidth,
  columns,
  selectable,
  expandable,
  hasAddon,
}: TableStyleProps) {
  const totalWidth = useMemo(
    () =>
      Object.entries(store.state.columnWidths.value).reduce(
        (sum, [col, _]) => sum + getColumnWidth(col),
        0,
      ) + (expandable ? 50 : 0) + (selectable ? 50 : 0) +
      (hasAddon ? 80 : 0),
    [store.state.columnWidths.value],
  );

  const style = useMemo(() => ({
    width: `${totalWidth}px`,
    ...columns.reduce((acc, col) => {
      const sanitizedCol = col.replace(/[^a-zA-Z0-9]/g, "_");
      acc[`--col-width-${sanitizedCol}`] = `${getColumnWidth(col)}px`;
      return acc;
    }, {} as Record<string, string>),
  }), [totalWidth, columns]);

  return {
    style,
    totalWidth,
  };
}
