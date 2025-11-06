import { useCallback } from "preact/hooks";

import { CellRendererCallback } from "@/plugin/mod.ts";
import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";
import { useRowKey } from "@/fetcher/mod.ts";
import { RowResizeHandle } from "./RowResizeHandle.tsx";
import { RowHeightCommand, RowResizeCommand } from "./store.ts";

export const EnumeratorCell = ({
  store,
  row,
  index,
}: {
  store: TableStore;
  row: Row;
  index: number;
}) => {
  const rowKey = useRowKey({ store });
  const resizingRow = store.state.resizingRow.value;
  const onResize = useCallback((rowId: string | number, newHeight: number) => {
    store.dispatch<RowResizeCommand>({
      type: "ROW_RESIZING_SET",
      payload: { rowId, height: newHeight },
    });
  }, [store]);

  const onResizeEnd = useCallback(() => {
    if (resizingRow) {
      const { rowId, height } = resizingRow;
      const newRowHeights = {
        ...store.state.rowHeights.value,
        [rowId]: height,
      };
      store.dispatch({
        type: "RowHeightCommand",
        payload: newRowHeights,
      });
      store.dispatch<RowResizeCommand>({
        type: "ROW_RESIZING_SET",
        payload: null,
      });
    }
  }, [store, resizingRow]);

  return (
    <td
      class="vt-cell"
      style={{
        width: `var(--col-width-$$enumerator$$)`,
        position: "relative",
      }}
      tabIndex={0}
    >
      {index! + 1}
      <RowResizeHandle
        rowId={row[rowKey]}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        rowHeight={64}
      />
    </td>
  );
};

export const enumCellRenderCallback: CellRendererCallback = ({
  store,
  row,
  rowIndex,
}) => {
  return <EnumeratorCell {...{ store, row, index: rowIndex! }} />;
};

enumCellRenderCallback.columnName = "$$enumerator$$";
