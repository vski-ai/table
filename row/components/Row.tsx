import { useCallback } from "preact/hooks";
import { TableStore } from "@/module/types.ts";
import { useOrderedColumns } from "@/columns/hooks/useOrderedColumns.ts";
import { useAddons } from "@/module/mod.ts";

import { useRowHeights } from "@/row/hooks/useRowHeights.ts";
import { Cell } from "@/cell/mod.ts";
import { RowLoading } from "./RowLoading.tsx";
import { RowData } from "../types.ts";

interface RowProps {
  row: RowData;
  rowIndex: number;
  rowKey: string;
  rowHeight: number;
  store: TableStore;
  columns: string[];
}

export const Row = (props: RowProps) => {
  const { row, rowIndex, rowHeight, store, columns, rowKey } = props;

  const adons = useAddons({ store });
  const height = rowHeight;

  const classes = adons.rowclasses.string({
    row,
    store,
    rowKey,
  });

  return (
    <>
      <tr
        key={row[rowKey]}
        data-row-id={row[rowKey]}
        data-index={rowIndex}
        class={"vt-row " + classes}
        style={{
          height: height,
          ...adons.rowstyles.data({
            row,
            store,
          }),
        }}
      >
        {adons.lefttablecells.render({
          column: "",
          store,
          row,
          rowIndex,
        })}

        {columns.map((column) => (
          <Cell key={column} store={store} row={row} column={column} />
        ))}

        {adons.righttablecells.render({
          column: "",
          store,
          row,
          rowIndex,
        })}
      </tr>
    </>
  );
};

interface RenderRowCallbackProps {
  store: TableStore;
  rowHeight: number;
}

export function useRenderRowCallback({
  store,
  rowHeight,
}: RenderRowCallbackProps) {
  const columns = useOrderedColumns({ store });
  const rowKey = "id";
  const getRowHeight = useRowHeights({
    store,
    rowKey,
    height: store.state.table.row_height.value ?? rowHeight,
  });
  return useCallback(
    (row: RowData, index: number) => {
      const rowHeight = getRowHeight(row);

      if (row.$loading) {
        return (
          <RowLoading store={store} columns={columns} rowHeight={rowHeight} />
        );
      }

      return (
        <Row
          row={row}
          rowIndex={index}
          rowHeight={store.state.table.row_height.value || rowHeight}
          columns={columns}
          store={store}
          rowKey={rowKey}
        />
      );
    },
    [rowKey, getRowHeight, columns, store.state.table.row_height.value],
  );
}
