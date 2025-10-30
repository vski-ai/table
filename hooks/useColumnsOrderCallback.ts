import { useCallback } from "preact/hooks";
import { CommandType, TableStore } from "@/store/mod.ts";

interface ColumnsOrderCallbackProps {
  store: TableStore;
  columns: string[];
}

export function useColumnsOrderCallback(
  { columns, store }: ColumnsOrderCallbackProps,
) {
  return useCallback(
    (draggedColumn: string, targetColumn: string) => {
      const currentColumnOrder = store.state.columnOrder.value.length
        ? store.state.columnOrder.value
        : columns;
      const draggedIndex = currentColumnOrder.indexOf(draggedColumn);
      const targetIndex = currentColumnOrder.indexOf(targetColumn);

      if (draggedIndex === -1 || targetIndex === -1) {
        return;
      }

      const newColumnOrder = [...currentColumnOrder];
      const [draggedItem] = newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(targetIndex, 0, draggedItem);

      store.dispatch({
        type: CommandType.COLUMN_ORDER_SET,
        payload: newColumnOrder,
      });
    },
    [columns, store],
  );
}
