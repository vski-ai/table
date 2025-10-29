import { useSignal } from "@preact/signals";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { useVariableVirtualizer } from "../hooks/useVariableVirtualizer.ts";
import { VirtualTableViewProps } from "./types.ts";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import { ResizableHeader } from "./ResizableHeader.tsx";
import {
  GroupCaret,
  GroupLevelLine,
  GroupLinePointer,
  GroupMargin,
} from "@/group/mod.ts";
import { CommandType } from "@/store/mod.ts";
import { ColumnSorter, sorter } from "@/sorting/mod.ts";

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

  const renderColumnAction = (col: string) => (
    <>
      {sortable
        ? (
          <ColumnSorter
            column={col}
            store={store.state}
          />
        )
        : null}
      {columnAction?.(col)}
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
                  extensions={columnExtensions}
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
              const isSelected = store.state.selectedRows.value.includes(
                row[rowKey],
              );
              const isExpanded = store.state.expandedRows.value.includes(
                row[rowKey],
              );

              const rowContent = (
                <tr
                  key={rowIndex}
                  class={[
                    "hover:shadow-md",
                    isSelected ? "bg-base-200" : "",
                    row.$is_group_root ? "bg-base-200 border-b" : null,
                  ].join(" ")}
                  style={{ height: rowHeight }}
                >
                  {props.expandable && (
                    <td
                      class="border border-base-300 align-center text-center p-0"
                      style={{ width: "50px" }}
                    >
                      <button
                        type="button"
                        class="btn btn-ghost btn-md"
                        onClick={() =>
                          store.dispatch({
                            type: CommandType.ROW_EXPANSION_TOGGLE,
                            payload: row[rowKey],
                          })}
                      >
                        {isExpanded ? "[-]" : "[+]"}
                      </button>
                    </td>
                  )}
                  {selectable && (
                    <td
                      class="border border-base-300 align-center text-center p-0"
                      style={{ width: "50px" }}
                    >
                      <input
                        type="checkbox"
                        class="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const checked =
                            (e.target as HTMLInputElement).checked;
                          const currentSelectedRows =
                            store.state.selectedRows.value;
                          if (checked) {
                            store.dispatch({
                              type: CommandType.SELECTED_ROWS_SET,
                              payload: [...currentSelectedRows, row[rowKey]],
                            });
                          } else {
                            store.dispatch({
                              type: CommandType.SELECTED_ROWS_SET,
                              payload: currentSelectedRows.filter((id) =>
                                id !== row[rowKey]
                              ),
                            });
                          }
                        }}
                      />
                    </td>
                  )}

                  {store.state.drilldowns && (
                    <td
                      key="$group_by"
                      style={{
                        width: `var(--col-width-$group_by)`,
                        height: `${rowHeight}px`,
                      }}
                      class="relative border border-base-300"
                    >
                      <div class="truncate flex items-center">
                        {row.$is_group_root && (
                          <>
                            <GroupCaret
                              active={store.state.drilldowns.value.includes(
                                row.id,
                              )}
                              size={16}
                              level={row.$group_level}
                            />
                            <GroupLevelLine
                              level={row.$group_level}
                              height={rowHeight}
                              caretSize={16}
                            />
                            {row.$group_level !== 0 &&
                              (
                                <GroupLinePointer
                                  level={row.$group_level}
                                  height={rowHeight - 1}
                                />
                              )}
                            <span
                              class="pt-1/2 cursor-pointer"
                              onClick={() => {
                                const newDrilldowns =
                                  store.state.drilldowns.value.includes(row.id)
                                    ? store.state.drilldowns.value.filter((
                                      id,
                                    ) => id !== row.id)
                                    : [...store.state.drilldowns.value, row.id];
                                store.dispatch({
                                  type: CommandType.DRILLDOWN_SET,
                                  payload: newDrilldowns,
                                });
                              }}
                            >
                              <span class="ml-1" />
                              <CellFormatter
                                value={row[row.$group_by]}
                                formatting={formatting?.[row.$group_by]}
                              />
                            </span>
                          </>
                        )}
                        {!row.$is_group_root && (
                          <div class="truncate">
                            <GroupLevelLine
                              level={row.$group_level}
                              height={rowHeight - 1}
                              caretSize={16}
                            />
                            {row.$group_level !== 0 &&
                              (
                                <GroupLinePointer
                                  level={row.$group_level}
                                  height={rowHeight - 1}
                                />
                              )}
                            <GroupMargin level={row.$group_level} size={16} />
                            <CellFormatter
                              value={row[row.$group_by]}
                              formatting={formatting?.[row.$group_by]}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  )}

                  {columns.map((col, colIndex) => {
                    const sanitizedCol = col.replace(/[^a-zA-Z0-9]/g, "_");
                    return (
                      <td
                        key={col}
                        style={{
                          width: `var(--col-width-${sanitizedCol})`,
                          height: `${rowHeight}px`,
                        }}
                        class="border border-base-300 relative"
                      >
                        <div
                          class="truncate"
                          title={row[col]}
                          style={{
                            paddingLeft: row.$is_group_root
                              ? `${row.$level * 20}px`
                              : colIndex === 0
                              ? `${(row.$level) * 20}px`
                              : "0px",
                          }}
                        >
                          <CellFormatter
                            value={row[col]}
                            formatting={formatting?.[col]}
                          />

                          {row.$is_group_root && (
                            <>
                              <ColumnSorter
                                style={{
                                  top: rowHeight / 2 - 6,
                                  width: 12,
                                  height: 12,
                                }}
                                className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity p-0 w-3 h-3 btn btn-ghost absolute right-2"
                                activeClassName="!opacity-100 !text-accent"
                                column={col}
                                store={store.state}
                                leafId={row.id}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {tableAddon
                    ? (
                      <td
                        class="border border-base-300 text-center"
                        style={{
                          padding: 0,
                          width: "80px",
                        }}
                      >
                        <button class="btn w-full h-12 border-0 rounded-none opacity-45 hover:opacity-100 transition-opacity">
                        </button>
                      </td>
                    )
                    : null}
                </tr>
              );

              if (isExpanded && props.expandable) {
                return [
                  rowContent,
                  <tr key={`${rowIndex}-expanded`} class="transition-all">
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
