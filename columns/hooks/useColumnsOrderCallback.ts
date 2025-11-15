import { useCallback } from "preact/hooks";
import { TableStore } from "@/module/mod.ts";
import { ColumnOrderCommand, COLUMN_ORDER_SET } from "../store.ts";
import { useOrderedColumns } from "./useOrderedColumns.ts";

interface ColumnsOrderCallbackProps {
  store: TableStore;
}

export function useColumnsOrderCallback(
  { store }: ColumnsOrderCallbackProps,
) {
  const columns = useOrderedColumns({ store });
  return useCallback(
    (draggedColumn: string, targetColumn: string) => {
      const currentColumnOrder = store.state.columns.ordered.value.length
        ? store.state.columns.ordered.value
        : columns;
      const draggedIndex = currentColumnOrder.indexOf(draggedColumn);
      const targetIndex = currentColumnOrder.indexOf(targetColumn);

      if (draggedIndex === -1 || targetIndex === -1) {
        return;
      }

      const newColumnOrder = [...currentColumnOrder];
      const [draggedItem] = newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(targetIndex, 0, draggedItem);

      store.dispatch<ColumnOrderCommand>({
        type: COLUMN_ORDER_SET,
        payload: newColumnOrder,
      });
    },
    [columns, store],
  );
}
