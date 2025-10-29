import { useSignal } from "@preact/signals";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useVariableVirtualizer } from "../hooks/useVariableVirtualizer.ts";
import { VirtualTableViewProps } from "./types.ts";
import { ResizableHeader } from "./ResizableHeader.tsx";
import { CommandType } from "@/store/mod.ts";
import { RowSorter, sorter } from "@/sorting/mod.ts";
import { ColumnMenu } from "@/menu/ColumnMenu.tsx";
import { useStickyGroupHeaders } from "../hooks/useStickyGroupHeaders.ts";
import { StickyRowsContainer } from "./StickyRowsContainer.tsx";
import { Row } from "./Row.tsx";

export function VirtualTableView(props: VirtualTableViewProps) {
  const {
    data,
    columns: cols,
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
    stickyGroupHeaders = 2,
  } = props;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // For body table
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const resizingColumn = useSignal<{ column: string; width: number } | null>(
    null,
  );
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerContainerRef.current) {
      setHeaderHeight(headerContainerRef.current.offsetHeight);
    }
  }, [headerContainerRef.current]);

  // TODO: first filter then sort
  const sortedData = useMemo(() => {
    return sortable ? sorter({ data, store: store.state }) : data;
  }, [
    data,
    store.state.sorting.value,
    store.state.leafSorting.value,
  ]);

  const renderColumnAction = (col: string) => (
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
  );

  const renderColumnExtension = (col: string) => (
    <>
      <ColumnMenu column={col} store={store.state} />
      {columnExtensions?.(col)}
    </>
  );

  const columns = useMemo(() => {
    return cols;
  }, [cols]);

  const formatting = useMemo(() => {
    return store.state.cellFormatting.value;
  }, [store.state.cellFormatting.value]);

  const rowKey = useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);

  const shownRows = useMemo(() => {
    if (!store.state.drilldowns?.value) return sortedData;

    const shown = sortedData.filter((row: any) => {
      if (!row.$parent_id?.length) {
        return true;
      }

      if (
        row.$parent_id.every(
          (id: string) => store.state.drilldowns.value.includes(id),
        )
      ) {
        return true;
      }

      return false;
    });
    return shown;
  }, [
    sortedData,
    sortable,
    store.state.sorting.value,
    store.state.leafSorting.value,
    store.state.drilldowns?.value,
  ]);

  const rowHeights = useMemo(() => {
    return shownRows.map((row) => {
      if (
        props.expandable && store.state.expandedRows.value.includes(row[rowKey])
      ) {
        // TODO: Replace 100 with a dynamic height calculation
        return rowHeight + 100; // 100 is a placeholder for the expanded content height
      }
      return rowHeight;
    });
  }, [shownRows, store.state.expandedRows.value]);

  const { startIndex, endIndex, paddingTop, paddingBottom } =
    useVariableVirtualizer({
      scrollContainerRef,
      tableRef,
      itemCount: shownRows.length,
      rowHeights: rowHeights,
      buffer,
    });

  const stickyHeaders = useStickyGroupHeaders({
    scrollContainerRef,
    shownRows,
    rowHeights,
    maxLevel: stickyGroupHeaders,
    drilldowns: store.state.drilldowns.value,
  });

  // Effect to sync horizontal scroll
  useEffect(() => {
    const bodyEl = bodyContainerRef.current;
    if (!bodyEl) return;

    const handleScroll = () => {
      if (headerContainerRef.current) {
        headerContainerRef.current.scrollLeft = bodyEl.scrollLeft;
      }
    };

    bodyEl.addEventListener("scroll", handleScroll);
    return () => bodyEl.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentWidths = { ...store.state.columnWidths.peek() };
    let needsUpdate = false;
    const defaultWidth = 250;
    const _columns = [...columns, "$group_by"];
    for (const col of _columns) {
      if (currentWidths[col] !== undefined) continue;
      currentWidths[col] = defaultWidth;
      needsUpdate = true;
    }

    const currentColsInState = Object.keys(currentWidths);
    for (const col of currentColsInState) {
      if (!_columns.includes(col)) {
        delete currentWidths[col];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      store.dispatch({
        type: CommandType.COLUMN_WIDTHS_SET,
        payload: currentWidths,
      });
    }
  }, [columns, initialWidth]);

  useEffect(() => {
    if (!onLoadMore) return;

    const loadMoreObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !store.state.loading.value) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        loadMoreObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [onLoadMore, store.state.loading.value]);

  const handleResize = (column: string, newWidth: number) => {
    resizingColumn.value = null;
    store.dispatch({
      type: CommandType.COLUMN_WIDTHS_SET,
      payload: {
        ...store.state.columnWidths.value,
        [column]: newWidth,
      },
    });
  };

  const handleResizeUpdate = (column: string, newWidth: number) => {
    resizingColumn.value = { column, width: newWidth };
  };

  const getColumnWidth = (col: string) => {
    if (resizingColumn.value && resizingColumn.value.column === col) {
      return resizingColumn.value.width;
    }
    return store.state.columnWidths.value[col];
  };

  const totalWidth = Object.entries(store.state.columnWidths.value).reduce(
    (sum, [col, width]) => sum + getColumnWidth(col),
    0,
  ) + (props.expandable ? 50 : 0) + (selectable ? 50 : 0) +
    (tableAddon ? 80 : 0);

  const tableStyle = {
    width: `${totalWidth}px`,
    ...columns.reduce((acc, col) => {
      const sanitizedCol = col.replace(/[^a-zA-Z0-9]/g, "_");
      acc[`--col-width-${sanitizedCol}`] = `${getColumnWidth(col)}px`;
      return acc;
    }, {} as Record<string, string>),
  };

  const renderRow = (row: any, index: number) => {
    const isSelected = store.state.selectedRows.value.includes(
      row[rowKey],
    );
    const isExpanded = store.state.expandedRows.value.includes(
      row[rowKey],
    );

    return (
      <Row
        row={row}
        rowIndex={index}
        isSelected={isSelected}
        isExpanded={isExpanded}
        rowHeight={rowHeight}
        formatting={formatting}
        columns={columns}
        store={store}
        getColumnWidth={getColumnWidth}
        tableAddon={tableAddon}
        expandable={props.expandable}
        selectable={selectable}
        rowKey={rowKey}
      />
    );
  };

  return (
    <>
      <div
        ref={headerContainerRef}
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <table
          style={tableStyle}
          class="vski-table"
        >
          <thead>
            <tr>
              {props.expandable && (
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

              {store.state.drilldowns && (
                <ResizableHeader
                  key="$group_by"
                  column="$group_by"
                  width={getColumnWidth("$group_by")}
                  onResize={handleResize}
                  onResizeUpdate={handleResizeUpdate}
                >
                  <span></span>
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
        top={headerHeight}
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
              {store.state.drilldowns && (
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
            {shownRows.slice(startIndex, endIndex + 1).map((row, i) => {
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
                        (store.state.drilldowns ? 1 : 0)}
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
