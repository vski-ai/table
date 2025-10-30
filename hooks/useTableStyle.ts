import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/utils/sanitizeColName.ts";
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

  const style = useMemo(() => {
    const widths: Record<string, string> = {
      width: `${totalWidth}px`,
      ...columns.reduce((acc, col, i) => {
        acc[`--col-width-${sanitizeColName(col)}`] = `${getColumnWidth(col)}px`;
        return acc;
      }, {} as Record<string, string>),
    };

    const currentState = store.state.columnWidths.value;
    Object.entries(currentState).reduce(
      (sum, [col, _]) => {
        widths[`--col-left-${sanitizeColName(col)}`] = sum + "px";
        return sum + getColumnWidth(col);
      },
      0,
    );

    return widths;
  }, [totalWidth, columns]);

  return {
    style,
    totalWidth,
  };
}
