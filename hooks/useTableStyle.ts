import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/utils/sanitizeColName.ts";
export interface TableStyleProps {
  columns: string[];
  store: TableStore;
  getColumnWidth: (col: string) => number;
  selectable?: boolean;
  expandable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  hasAddon?: boolean;
  key?: any;
}

export function useTableStyle({
  store,
  getColumnWidth,
  columns,
  selectable,
  expandable,
  enumerable,
  hasAddon,
  key,
}: TableStyleProps) {
  const leftOffset = 0 + (enumerable ? 50 : 0) + (expandable ? 50 : 0) +
    (selectable ? 50 : 0);
  const totalWidth = useMemo(
    () => {
      const { column, width: resizingColumnWidth } =
        store.state.resizingColumn.value || {};

      return Object.entries(store.state.columnWidths.value)
        .filter(([col, _]) => {
          return col !== column;
        })
        .reduce(
          (sum, [col, _]) => sum + getColumnWidth(col),
          resizingColumnWidth ?? 0,
        ) +
        leftOffset +
        (hasAddon ? 80 : 0);
    },
    [store.state.columnWidths.value, store.state.resizingColumn.value, key],
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
  }, [totalWidth, columns, store.state.columnWidths.value, key]);

  return {
    style,
    totalWidth,
    leftOffset,
  };
}
