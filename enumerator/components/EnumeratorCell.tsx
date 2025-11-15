import { useCallback } from "preact/hooks";

import { CellRendererCallback } from "@/module/mod.ts";
import { TableStore } from "@/module/types.ts";
import { RowData } from "@/row/types.ts";
import { useRowKey } from "@/columns/hooks/useRowKey.ts";
import { useRowHeights } from "@/row/hooks/useRowHeights.ts";
import { RowResizeHandle } from "./RowResizeHandle.tsx";
import { RowHeightCommand } from "../store.ts";
import { useSignal } from "@preact/signals";

export const EnumeratorCell = ({
  store,
  row,
  index,
}: {
  store: TableStore;
  row: RowData;
  index: number;
}) => {
  const rowKey = useRowKey({ store });
  const getRowHeight = useRowHeights({
    rowKey,
    store,
  });
  const height = getRowHeight(row);
  const update = useSignal(0);
  const onResize = useCallback((rowId: string | number, newHeight: number) => {
    store.dispatch<RowHeightCommand>({
      type: "ROW_HEIGHTS_SET",
      payload: { [rowId]: newHeight },
    });
  }, []);
  return (
    <td
      class="vt-cell vt-enum"
      style={{
        width: `var(--col-width-$$enumerator$$)`,
        position: "relative",
      }}
      tabIndex={-1}
    >
      {index! + 1}
      <RowResizeHandle
        key={update.value}
        rowId={row[rowKey]}
        onResize={onResize}
        onResizeEnd={() => update.value = new Date().getTime()}
        rowHeight={height}
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
