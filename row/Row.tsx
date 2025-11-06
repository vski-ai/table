import { useCallback } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { useOrderedColumns } from "@/columns/mod.ts";
import { usePluginContainer } from "@/plugin/usePluginContainer.ts";
import { useRowHeights, useRowKey } from "@/fetcher/mod.ts";
import { RowData } from "./types.ts";
import { RowLoading } from "./RowLoading.tsx";
import { Cell } from "@/cell/mod.ts";

interface RowProps {
  row: RowData;
  rowIndex: number;
  rowKey: string;
  rowHeight: number;
  store: TableStore;
  columns: string[];
}

export const Row = (props: RowProps) => {
  const {
    row,
    rowIndex,
    rowHeight,
    store,
    columns,
    rowKey,
  } = props;

  const plugins = usePluginContainer({ store });
  const height = rowHeight;

  const classes = plugins.rowClasses.string({
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
        class={classes}
        style={{
          height: height,
          ...plugins.rowStyles.data({
            row,
            store,
          }),
        }}
      >
        {plugins.leftTableCells.render({
          column: "",
          store,
          row,
          rowIndex,
        })}

        {columns.map((column) => (
          <Cell key={column} store={store} row={row} column={column} />
        ))}

        {plugins.rightTableCells.render({
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

export function useRenderRowCallback(
  { store, rowHeight }: RenderRowCallbackProps,
) {
  const columns = useOrderedColumns({ store });
  const rowKey = useRowKey({ store });
  const getRowHeight = useRowHeights({
    store,
    rowKey,
    height: rowHeight,
  });
  return useCallback((row: RowData, index: number) => {
    const rowHeight = getRowHeight(row);

    if (row.$loading) {
      return <RowLoading columns={columns} rowHeight={rowHeight} />;
    }

    return (
      <Row
        row={row}
        rowIndex={index}
        rowHeight={rowHeight}
        columns={columns}
        store={store}
        rowKey={rowKey}
      />
    );
  }, [
    rowKey,
    getRowHeight,
    columns,
  ]);
}
