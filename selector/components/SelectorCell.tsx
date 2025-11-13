import { useCallback } from "preact/hooks";
import { CellRendererCallback } from "@/module/mod.ts";
import { TableStore } from "@/module/types.ts";
import { RowData } from "@/row/types.ts";
import { useRowKey } from "@/columns/hooks/useRowKey.ts";
import { KEY } from "../constants.ts";
import { RowsSelectCommand } from "../store.ts";

export const SelectorCell = ({
  store,
  row,
}: {
  store: TableStore;
  row: RowData;
  index: number;
}) => {
  const rowKey = useRowKey({ store });
  const onSelectionChange = useCallback((e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    const currentSelectedRows = store.state.selector.rows.value;
    if (checked) {
      store.dispatch<RowsSelectCommand>({
        type: "SELECTED_ROWS_SET",
        payload: [...currentSelectedRows, row[rowKey]],
      });
    } else {
      store.dispatch<RowsSelectCommand>({
        type: "SELECTED_ROWS_SET",
        payload: currentSelectedRows.filter((id) => id !== row[rowKey]),
      });
    }
  }, [store, row]);

  const isSelected = store.state.selector.rows.value.includes(row[rowKey]);

  return (
    <td
      class="vt-cell vt-select"
      style={{
        width: `var(--col-width-${KEY})`,
        position: "relative",
      }}
    >
      <input
        type="checkbox"
        class="checkbox checkbox-sm"
        checked={isSelected}
        onChange={onSelectionChange}
      />
    </td>
  );
};

export const selectorCellRenderCallback: CellRendererCallback = ({
  store,
  row,
  rowIndex,
}) => {
  return <SelectorCell {...{ store, row, index: rowIndex! }} />;
};

selectorCellRenderCallback.columnName = KEY;
