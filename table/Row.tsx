import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import { Row as RowType } from "./types.ts";
import { RowLoading } from "./RowLoading.tsx";
import { CellFormatting } from "@/format/types.ts";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/utils/sanitizeColName.ts";
import { useStickyColOffset } from "@/columns/mod.ts";
import { usePluginContainer } from "../plugin/usePluginContainer.ts";
import { useOrderedColumns } from "../columns/useOrderedColumns.ts";
import { useRowHeights } from "../fetcher/useRowHeights.ts";
import { useRowKey } from "../fetcher/useRowKey.ts";

interface RowProps {
  row: RowType;
  rowIndex: number;
  rowKey: string;
  rowHeight: number;
  formatting: Record<string, CellFormatting>;
  store: TableStore;
  columns: string[];
}

export const Row = memo((props: RowProps) => {
  const {
    row,
    rowIndex,
    rowHeight,
    formatting,
    store,
    columns,
    rowKey,
  } = props;

  const plugins = usePluginContainer({ store });
  const height = rowHeight;
  const stickyColumns = useStickyColOffset({ store });
  const tabIndex = plugins.leftTableCells.size + 1;

  const classes = plugins.rowClasses.render({
    row,
    store,
  });

  return (
    <tr
      key={row.id}
      data-row-id={row[rowKey]}
      data-index={rowIndex}
      class={classes.flat().join(" ")}
      style={{
        height: height,
        ...Object.fromEntries(
          plugins.rowStyles.render({
            row,
            store,
          }).flat(1),
        ),
      }}
    >
      {plugins.leftTableCells.render({
        column: "",
        store,
        row,
        rowIndex,
      })}

      {columns.map((col, colIndex) => {
        const isStickyLeft = typeof stickyColumns.left[col] === "number";
        const isStickyRight = typeof stickyColumns.right[col] === "number";
        return (
          <td
            key={col}
            data-column-name={col}
            tabIndex={colIndex + tabIndex}
            style={{
              width: `var(--col-width-${sanitizeColName(col)})`,
              height: `${height}px`,
              left: isStickyLeft ? stickyColumns.left[col] : undefined,
              right: isStickyRight ? stickyColumns.right[col] : undefined,
              zIndex: isStickyLeft || isStickyRight ? 1 : 0,
              position: isStickyLeft || isStickyRight ? "sticky" : undefined,
            }}
            class={`vt-g-cell ${isStickyLeft ? "vt-s-left" : ""} ${
              isStickyRight ? "vt-s-right" : ""
            }`}
          >
            <div
              class="truncate flex w-full items-center justify-between"
              title={row[col]}
            >
              {plugins.cellPrefixes.render({
                column: col,
                row,
                store,
              })}

              <CellFormatter
                value={row[col]}
                formatting={formatting?.[col]}
              />

              {plugins.cellSuffixes?.render({
                column: col,
                row,
                store,
              })}
            </div>
          </td>
        );
      })}
    </tr>
  );
});

interface RenderRowCallbackProps {
  store: TableStore;
  rowHeight: number;
}

export function useRenderRowCallback(
  { store, rowHeight }: RenderRowCallbackProps,
) {
  const formatting = store.state.cellFormatting.value;
  const columns = useOrderedColumns({ store });
  const rowKey = useRowKey({ store });
  const getRowHeight = useRowHeights({
    store,
    rowKey,
    height: rowHeight,
  });
  return useCallback((row: RowType, index: number) => {
    const rowHeight = getRowHeight(row);

    if (row.$loading) {
      return <RowLoading columns={columns} rowHeight={rowHeight} />;
    }

    return (
      <Row
        row={row}
        rowIndex={index}
        rowHeight={rowHeight}
        formatting={formatting}
        columns={columns}
        store={store}
        rowKey={rowKey}
      />
    );
  }, [
    rowKey,
    getRowHeight,
    formatting,
    columns,
  ]);
}
