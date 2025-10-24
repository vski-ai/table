import { useSignal } from "@preact/signals";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { useVariableVirtualizer } from "./useVariableVirtualizer.ts";
import { VirtualTableViewProps } from "./types.ts";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import { ResizableHeader } from "./ResizableHeader.tsx";
import {
  GroupCaret,
  GroupLevelLine,
  GroupLinePointer,
  GroupMargin,
} from "@/group/mod.ts";

export function VirtualTableView(
  {
    data,
    columns: cols,
    initialWidth,
    columnExtensions,
    columnAction,
    onLoadMore,
    loading,
    rowHeight = 56,
    buffer = 5,
    scrollContainerRef,
    selectedRows,
    rowIdentifier,
    renderExpandedRow,
    expandedRows,
    tableAddon,
    cellFormatting,
    onColumnDrop,
    groupStates,
  }: VirtualTableViewProps,
) {
  const columnWidths = useSignal<Record<string, number>>({});
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // For body table
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    return cols;
  }, [cols]);

  const formatting = useMemo(() => {
    return cellFormatting;
  }, [cellFormatting]);

  const rowKey = useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);

  const shownRows = useMemo(() => {
    if (!groupStates?.value) return data;

    return data.filter((row: any) => {
      if (!row.$parent_id?.length) {
        return true;
      }

      if (
        row.$parent_id.every(
          (id: string) => groupStates.value[id],
        )
      ) {
        return true;
      }

      return false;
    });
  }, [data, groupStates?.value]);

  const rowHeights = useMemo(() => {
    return shownRows.map((row) => {
      if (expandedRows && expandedRows.value[row[rowKey]]) {
        // TODO: Replace 100 with a dynamic height calculation
        return rowHeight + 100; // 100 is a placeholder for the expanded content height
      }
      return rowHeight;
    });
  }, [shownRows]);

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
    const currentWidths = columnWidths.peek();
    let needsUpdate = false;
    const newWidths = { ...currentWidths };
    const defaultWidth = 250;
    const _columns = [...columns, "$group_by"];
    for (const col of _columns) {
      if (newWidths[col] !== undefined) continue;
      newWidths[col] = defaultWidth;
      needsUpdate = true;
    }

    const currentColsInState = Object.keys(newWidths);
    for (const col of currentColsInState) {
      if (!_columns.includes(col)) {
        delete newWidths[col];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      columnWidths.value = newWidths;
    }
  }, [columns, initialWidth]);

  useEffect(() => {
    if (!onLoadMore) return;

    const loadMoreObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
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
  }, [onLoadMore, loading]);

  const handleResize = (column: string, newWidth: number) => {
    columnWidths.value = {
      ...columnWidths.value,
      [column]: newWidth,
    };
  };

  const totalWidth = Object.values(columnWidths.value).reduce(
    (sum, width) => sum + width,
    0,
  ) + (selectedRows ? 50 : 0) + (renderExpandedRow ? 50 : 0) +
    (tableAddon ? 80 : 0);

  const tableStyle = {
    width: `${totalWidth}px`,
    ...columns.reduce((acc, col) => {
      const sanitizedCol = col.replace(/[^a-zA-Z0-9]/g, "_");
      acc[`--col-width-${sanitizedCol}`] = `${columnWidths.value[col]}px`;
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
              {renderExpandedRow && (
                <th
                  style={{ width: "60px" }}
                  class="vski-expanded-row-th"
                >
                </th>
              )}

              {selectedRows && (
                <th
                  style={{ width: "60px" }}
                  class="vski-select-row-th"
                >
                  <input
                    type="checkbox"
                    class="checkbox"
                    checked={selectedRows?.value.length === data.length}
                    onChange={(e) => {
                      if ((e.target as HTMLInputElement).checked) {
                        selectedRows.value = data.map((row) => row[rowKey]);
                      } else {
                        selectedRows.value = [];
                      }
                    }}
                  />
                </th>
              )}

              {groupStates && (
                <ResizableHeader
                  key="$group_by"
                  column="$group_by"
                  width={columnWidths?.value["$group_by"]}
                  onResize={handleResize}
                >
                  <span></span>
                </ResizableHeader>
              )}

              {columns.map((col) => (
                <ResizableHeader
                  key={col}
                  column={col}
                  width={columnWidths?.value[col]}
                  onResize={handleResize}
                  extensions={columnExtensions}
                  action={columnAction}
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
              {renderExpandedRow && (
                <td style={{ width: "50px", height: 0, border: 0, padding: 0 }}>
                </td>
              )}
              {selectedRows && (
                <td style={{ width: "60px", height: 0, border: 0, padding: 0 }}>
                </td>
              )}
              {groupStates && (
                <td
                  style={{
                    width: columnWidths.value["$group_by"],
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
                    width: columnWidths.value[col],
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
              const isSelected = selectedRows
                ? selectedRows.value.includes(row[rowKey])
                : false;
              const isExpanded = expandedRows
                ? expandedRows.value[row[rowKey]]
                : false;

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
                  {renderExpandedRow && expandedRows && (
                    <td
                      class="border border-base-300 align-center text-center p-0"
                      style={{ width: "50px" }}
                    >
                      <button
                        type="button"
                        class="btn btn-ghost btn-md"
                        onClick={() => {
                          expandedRows.value = {
                            ...expandedRows.value,
                            [row[rowKey]]: !isExpanded,
                          };
                        }}
                      >
                        {isExpanded ? "[-]" : "[+]"}
                      </button>
                    </td>
                  )}
                  {selectedRows && (
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
                          if (checked) {
                            selectedRows.value = [
                              ...selectedRows.value,
                              row[rowKey],
                            ];
                          } else {
                            selectedRows.value = selectedRows.value.filter((
                              id,
                            ) => id !== row[rowKey]);
                          }
                        }}
                      />
                    </td>
                  )}

                  {groupStates && (
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
                              active={groupStates.value[row.id]}
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
                                groupStates.value = {
                                  ...groupStates.value,
                                  [row.id]: !groupStates.value[row.id],
                                };
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
                        class="border border-base-300"
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

              if (isExpanded && renderExpandedRow) {
                return [
                  rowContent,
                  <tr key={`${rowIndex}-expanded`} class="transition-all">
                    <td
                      colSpan={columns.length + (selectedRows ? 1 : 0) +
                        (Boolean(renderExpandedRow) ? 1 : 0) +
                        (groupStates ? 1 : 0)}
                    >
                      {renderExpandedRow(row)}
                    </td>
                  </tr>,
                ];
              }
              return rowContent;
            })}
            <tr style={{ height: `${paddingBottom}px` }}>
              <td
                colSpan={columns.length + (selectedRows ? 1 : 0) +
                  (renderExpandedRow ? 1 : 0) + (groupStates ? 1 : 0)}
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
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
