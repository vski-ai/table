import { useSignal } from "@preact/signals";
import { useCallback, useMemo, useRef } from "preact/hooks";

import {
  useColumnWidthEffect,
  useLoadMoreEffect,
  useRowHeights,
  useRowKey,
  useStickyColOffset,
  useStickyGroupHeaders,
  useTableStyle,
  useVariableVirtualizer,
  useVisibleRows,
} from "@/hooks/mod.ts";
import { VirtualTableViewProps } from "./types.ts";
import { ResizableHeader } from "./ResizableHeader.tsx";
import { CommandType } from "@/store/mod.ts";
import { RowSorter, sorter } from "@/sorting/mod.ts";
import { StickyRowsContainer } from "./StickyRowsContainer.tsx";
import { useRenderRowCallback } from "./Row.tsx";
import { ContextMenu } from "@/menu/ContextMenu.tsx";
import { Drilldown } from "../menu/Drilldown.tsx";

export function VirtualTableView(props: VirtualTableViewProps) {
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
    onColumnDrop,
    selectable,
    sortable,
    stickyGroupHeaderLevel = 2,
    expandable,
  } = props;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // For body table
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const resizingColumn = useSignal<{ column: string; width: number } | null>(
    null,
  );

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
      rowHeights: rowHeights,
      buffer,
    });

  const stickyHeaders = useStickyGroupHeaders({
    scrollContainerRef,
    visibleRows,
    rowHeights,
    maxLevel: stickyGroupHeaderLevel,
    expandedLevels: store.state.expandedLevels.value,
  });

  const stickyColumns = useStickyColOffset({
    store,
    columns,
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

  const handleResize = useCallback((column: string, newWidth: number) => {
    resizingColumn.value = null;
    store.dispatch({
      type: CommandType.COLUMN_WIDTHS_SET,
      payload: {
        ...store.state.columnWidths.value,
        [column]: newWidth,
      },
    });
  }, []);

  const handleResizeUpdate = useCallback((column: string, newWidth: number) => {
    resizingColumn.value = { column, width: newWidth };
  }, []);

  const getColumnWidth = useCallback((col: string) => {
    if (resizingColumn.value && resizingColumn.value.column === col) {
      return resizingColumn.value.width;
    }
    return store.state.columnWidths.value[col];
  }, []);

  const { style: tableStyle } = useTableStyle({
    store,
    getColumnWidth,
    columns,
    selectable,
    expandable,
    hasAddon: !!tableAddon,
  });

  const renderRow = useRenderRowCallback({
    store,
    rowKey,
    rowHeight,
    columns,
    expandable,
    selectable,
    tableAddon,
    getColumnWidth,
    stickyColumns,
  });

  return (
    <>
      <ContextMenu store={store} />
      <div
        ref={headerContainerRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: tableStyle.width,
        }}
      >
        <table
          style={tableStyle}
          class="vski-table"
        >
          <thead id="vski-table-main-head">
            <tr>
              {expandable && (
                <th
                  style={{ width: "60px" }}
                  class="vski-expanded-row-th"
                >
                </th>
              )}

              {selectable && (
                <th
                  style={{ width: "60px" }}
                  class="vski-select-row-th"
                >
                  <input
                    type="checkbox"
                    class="checkbox"
                    checked={store.state.selectedRows.value.length ===
                      data.length}
                    onChange={(e) => {
                      if ((e.target as HTMLInputElement).checked) {
                        store.dispatch({
                          type: CommandType.SELECTED_ROWS_SET,
                          payload: data.map((row) => row[rowKey]),
                        });
                      } else {
                        store.dispatch({
                          type: CommandType.SELECTED_ROWS_SET,
                          payload: [],
                        });
                      }
                    }}
                  />
                </th>
              )}

              {store.state.expandedLevels && (
                <ResizableHeader
                  key="$group_by"
                  column="$group_by"
                  width={getColumnWidth("$group_by")}
                  onResize={handleResize}
                  onResizeUpdate={handleResizeUpdate}
                  stickyColumns={stickyColumns}
                >
                  <Drilldown store={store} />
                </ResizableHeader>
              )}

              {columns.map((col) => (
                <ResizableHeader
                  key={col}
                  column={col}
                  width={getColumnWidth(col)}
                  onResize={handleResize}
                  onResizeUpdate={handleResizeUpdate}
                  extensions={renderColumnExtension}
                  action={renderColumnAction}
                  onColumnDrop={onColumnDrop}
                  stickyColumns={stickyColumns}
                />
              ))}

              {tableAddon
                ? (
                  <th
                    style={{
                      width: "80px",
                      padding: 0,
                    }}
                  >
                    {tableAddon}
                  </th>
                )
                : null}
            </tr>
          </thead>
        </table>
      </div>

      <StickyRowsContainer
        stickyHeaders={stickyHeaders.value}
        renderRow={renderRow}
        rowHeight={rowHeight}
        tableStyle={tableStyle}
        top={0}
      />

      <div ref={bodyContainerRef}>
        <table
          ref={tableRef}
          style={tableStyle}
          class="vski-table"
        >
          <tbody>
            <tr style={{ height: `${paddingTop}px` }}>
              {props.expandable && (
                <td style={{ width: "50px", height: 0, border: 0, padding: 0 }}>
                </td>
              )}
              {selectable && (
                <td style={{ width: "60px", height: 0, border: 0, padding: 0 }}>
                </td>
              )}
              {store.state.expandedLevels && (
                <td
                  style={{
                    width: getColumnWidth("$group_by"),
                    height: 0,
                    border: 0,
                    padding: 0,
                  }}
                >
                </td>
              )}
              {columns.map((col) => (
                <td
                  style={{
                    width: getColumnWidth(col),
                    height: 0,
                    border: 0,
                    padding: 0,
                  }}
                >
                </td>
              ))}
              {tableAddon
                ? (
                  <td
                    style={{
                      height: 0,
                      border: 0,
                      padding: 0,
                      width: "80px",
                    }}
                  >
                  </td>
                )
                : null}
            </tr>
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
