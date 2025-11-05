import { useMemo } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/common/sanitizeColName.ts";
import { useColumnResizer, useOrderedColumns } from "@/columns/mod.ts";

export interface TableStyleProps {
  store: TableStore;
}

export function useTableStyle({ store }: TableStyleProps) {
  const { getColumnWidth } = useColumnResizer({ store });
  const columns = useOrderedColumns({ store });

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
        );
    },
    [store.state.columnWidths.value, store.state.resizingColumn.value],
  );

  const style = useMemo(() => {
    const widths: Record<string, string> = {
      width: `${totalWidth}px`,
      ...columns.reduce((acc, col) => {
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
  }, [totalWidth, columns, store.state.columnWidths.value]);

  return {
    style,
    totalWidth,
  };
}
