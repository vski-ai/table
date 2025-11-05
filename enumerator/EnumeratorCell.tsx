import { useCallback } from "preact/hooks";
import { RowResizeHandle } from "./RowResizeHandle.tsx";
import { CommandType } from "./store.ts";
import { CellRendererCallback } from "@/plugin/mod.ts";

export const EnumeratorCell = ({
  store,
  row,
}: {
  store: any;
  row: any;
}) => {
  const resizingRow = store.state.resizingRow.value;
  const onResize = useCallback((rowId: string | number, newHeight: number) => {
    store.dispatch({
      type: CommandType.ROW_RESIZING_SET,
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
        type: CommandType.ROW_HEIGHTS_SET,
        payload: newRowHeights,
      });
      store.dispatch({
        type: CommandType.ROW_RESIZING_SET,
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
      tabIndex={1}
    >
      {0}
      <RowResizeHandle
        rowId={row["id"]}
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
}) => {
  return <EnumeratorCell {...{ store, row }} />;
};

enumCellRenderCallback.columnName = "$$enumerator$$";
