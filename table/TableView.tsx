import { useCallback, useMemo, useRef } from "preact/hooks";

import {
  useColumnResizer,
  useColumnWidthEffect,
  useLoadMoreEffect,
  useOrderedColumns,
  useRowHeights,
  useRowKey,
  useTableStyle,
  useVariableVirtualizer,
  useVisibleRows,
} from "@/hooks/mod.ts";
import { VirtualTableViewProps } from "./types.ts";

import { RowSorter, sorter } from "@/sorting/mod.ts";
import { StickyRowsContainer } from "./StickyRowsContainer.tsx";
import { useRenderRowCallback } from "./Row.tsx";
import { ContextMenu } from "@/menu/ContextMenu.tsx";
import { StickyHeaderContainer } from "./StickyHeaderContainer.tsx";
import { RowPadding } from "./RowPadding.tsx";

export function TableView(props: VirtualTableViewProps) {
  const {
    data,
    columns,
    store,
    initialWidth,
    columnExtensions,
    columnAction,
    onLoadMore,
    rowHeight = 56,
    buffer = 5,
    scrollContainerRef,
    rowIdentifier,
    tableAddon,
    selectable,
    sortable,
    expandable,
    enumerable,
    groupable,
  } = props;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // For body table
  const bodyContainerRef = useRef<HTMLDivElement>(null);

  const columnsInOrder = useOrderedColumns({
    store,
    columns,
  });

  // TODO: first filter then sort
  const sortedData = useMemo(() => {
    return sortable ? sorter({ data, store: store.state }) : data;
  }, [
    data,
    store.state.sorting.value,
    store.state.leafSorting.value,
  ]);

  const renderColumnAction = useCallback((col: string) => (
    <>
      {sortable
        ? (
          <RowSorter
            column={col}
            store={store.state}
          />
        )
        : null}
      {columnAction?.(col)}
    </>
  ), [sortable]);

  const renderColumnExtension = useCallback((col: string) => (
    <>
      {columnExtensions?.(col)}
    </>
  ), []);
  console.log(1);

  const rowKey = useRowKey(columns, rowIdentifier);

  const visibleRows = useVisibleRows({
    data: sortedData,
    store,
    sortable,
  });

  const rowHeights = useRowHeights({
    data: visibleRows,
    store,
    expandable,
    rowKey,
    height: rowHeight,
  });

  const { startIndex, endIndex, paddingTop, paddingBottom } =
    useVariableVirtualizer({
      scrollContainerRef,
      tableRef,
      itemCount: visibleRows.length,
      rowHeights,
      buffer,
    });

  useColumnWidthEffect({
    store,
    columns,
    initialWidth,
  });

  useLoadMoreEffect({
    store,
    onLoadMore,
    ref: loadMoreRef,
  });

  const { getColumnWidth } = useColumnResizer({ store });

  const { style } = useTableStyle({
    store,
    getColumnWidth,
    columns,
    selectable,
    expandable,
    groupable,
    enumerable,
    hasAddon: !!tableAddon,
  });

  const renderRow = useRenderRowCallback({
    store,
    rowKey,
    rowHeight,
    columns: columnsInOrder,
    expandable,
    selectable,
    groupable,
    enumerable,
    tableAddon,
  });

  return (
    <>
      <ContextMenu store={store} />
      <StickyHeaderContainer
        store={store}
        extensions={renderColumnExtension}
        action={renderColumnAction}
        {...{
          data,
          enumerable,
          expandable,
          groupable,
          selectable,
          rowKey,
          tableAddon,
          columns,
        }}
      />

      <StickyRowsContainer
        renderRow={renderRow}
        {...{
          enumerable,
          expandable,
          groupable,
          selectable,
          store,
          columns,
          rowHeights,
          visibleRows,
        }}
      />

      <div ref={bodyContainerRef}>
        <table
          ref={tableRef}
          style={style}
          class="vski-table"
        >
          <tbody>
            <RowPadding
              padding={paddingTop}
              columns={columnsInOrder}
              {...{
                enumerable,
                expandable,
                groupable,
                selectable,
                tableAddon,
                getColumnWidth,
              }}
            />

            {visibleRows.slice(startIndex, endIndex + 1).map((row, i) => {
              const rowIndex = startIndex + i;
              const rowContent = renderRow(row, rowIndex);
              const isExpanded = store.state.expandedRows.value.includes(
                row[rowKey],
              );

              if (isExpanded && props.expandable) {
                return [
                  rowContent,
                  <tr key={`${row.id}-expanded`} class="transition-all">
                    <td
                      colSpan={columns.length + (props.expandable ? 1 : 0) +
                        (selectable ? 1 : 0) +
                        (store.state.expandedLevels ? 1 : 0)}
                    >
                      {props.renderExpand(row)}
                    </td>
                  </tr>,
                ];
              }
              return rowContent;
            })}
            <tr style={{ height: `${paddingBottom}px` }}>
              <td
                colSpan={columns.length + (props.expandable ? 1 : 0) +
                  (selectable ? 1 : 0)}
                style={{ padding: 0, border: 0 }}
              >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {onLoadMore && (
        <div ref={loadMoreRef} class="h-20 flex justify-center items-center">
          <button
            type="button"
            class="btn btn-primary"
            onClick={onLoadMore}
            disabled={store.state.loading.value}
          >
            {store.state.loading.value ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
