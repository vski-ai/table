import { useMemo } from "preact/hooks";
import { Store } from "@xmod/types.ts";
import { sanitizeColName } from "@/common/sanitizeColName.ts";
import { useColumnResizer } from "./useColumnnResize.ts";
import { useOrderedColumns } from "./useOrderedColumns.ts";
import { useComputed } from "@preact/signals";

export interface TableStyleProps {
  store: Store;
}

export function useTableColumnStyle({ store }: TableStyleProps) {
  const { getColumnWidth } = useColumnResizer({ store });
  const ordered_columns = useOrderedColumns({ store });
  const service_columns = store.state.columns.service_columns.value;
  const columns = [...service_columns, ...ordered_columns];

  const totalWidth = useComputed(() => {
    const { column, width: resizingColumnWidth } =
      store.state.columns.resizing_column.value || {};

    return Object.entries(store.state.columns.widths.value)
      .filter(([col, _]) => {
        return col !== column;
      })
      .reduce(
        (sum, [col, _]) => sum + getColumnWidth(col),
        resizingColumnWidth ?? 0,
      );
  });

  const style = useComputed(() => {
    const widths: Record<string, string> = {
      width: `${totalWidth.value}px`,
      ...columns.reduce(
        (acc, col) => {
          acc[`--col-width-${sanitizeColName(col)}`] = `${getColumnWidth(
            col,
          )}px`;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    const currentState = store.state.columns.widths.value;

    Object.entries(currentState).reduce((sum, [col, _]) => {
      widths[`--col-left-${sanitizeColName(col)}`] = sum + "px";
      return sum + getColumnWidth(col);
    }, 0);

    return widths;
  });

  return {
    style,
    totalWidth,
  };
}
