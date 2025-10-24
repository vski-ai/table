import { useMemo, useRef } from "preact/hooks";
import { useVariableVirtualizer } from "./useVariableVirtualizer.ts";
import { VirtualTableViewProps } from "./types.ts";
import { CellFormatter } from "@/format/CellFormatter.tsx";

interface CardViewProps extends VirtualTableViewProps {}

export function CardView(
  {
    data,
    columns,
    onLoadMore,
    loading,
    rowHeight = 60, // Adjusted for a card-like appearance
    buffer = 5,
    scrollContainerRef,
    selectedRows,
    rowIdentifier,
    renderExpandedRow,
    expandedRows,
    cellFormatting,
    formatColumnName,
  }: CardViewProps,
) {
  const tableRef = useRef<HTMLDivElement>(null);

  const rowKey = useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);

  const rowHeights = useMemo(() => {
    if (!expandedRows) return data.map(() => rowHeight);
    return data.map((row) => {
      const isExpanded = expandedRows.value[row[rowKey]];
      // Expanded height can be dynamic based on content, 200 is a placeholder
      return isExpanded ? rowHeight + 200 : rowHeight;
    });
  }, [data, expandedRows, rowHeight, rowKey]);

  const { startIndex, endIndex, paddingTop, paddingBottom } =
    useVariableVirtualizer({
      scrollContainerRef,
      tableRef: tableRef as any,
      itemCount: data.length,
      rowHeights,
      buffer,
    });

  const visibleData = data.slice(startIndex, endIndex + 1);

  if (!data || data.length === 0) {
    return <p>No data to display.</p>;
  }

  return (
    <div ref={tableRef} class="space-y-4">
      <div style={{ height: `${paddingTop}px` }} />
      {visibleData.map((row, i) => {
        const rowIndex = startIndex + i;
        const isSelected = selectedRows
          ? selectedRows.value.includes(row[rowKey])
          : false;
        const isExpanded = expandedRows
          ? expandedRows.value[row[rowKey]]
          : false;

        const rowContent = (
          <div
            key={rowIndex}
            class={`bg-base-200 shadow-md collapse collapse-arrow ${
              isExpanded ? "collapse-open" : ""
            }`}
            style={{ minHeight: `${rowHeights[rowIndex]}px` }}
          >
            <div
              class="collapse-title font-medium flex items-center"
              onClick={() => {
                if (expandedRows) {
                  expandedRows.value = {
                    ...expandedRows.value,
                    [row[rowKey]]: !isExpanded,
                  };
                }
              }}
            >
              {selectedRows && (
                <input
                  type="checkbox"
                  class="checkbox mr-4"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent opening the card
                    const checked = (e.target as HTMLInputElement).checked;
                    if (checked) {
                      selectedRows.value = [...selectedRows.value, row[rowKey]];
                    } else {
                      selectedRows.value = selectedRows.value.filter((id) =>
                        id !== row[rowKey]
                      );
                    }
                  }}
                />
              )}
              {row[columns[0]] || `Row ${rowIndex + 1}`}
            </div>
            <div class="collapse-content">
              <div class="grid grid-cols-2 gap-2">
                {columns.map((col) => {
                  const formattedName = formatColumnName?.(col) ?? col;
                  return (
                    <div
                      key={col}
                      class="badge badge-base-100 p-4 flex justify-between w-full"
                    >
                      <span class="font-bold text-sm">{formattedName}</span>
                      <span class="divider"></span>
                      <span
                        class="text-right truncate badge badge-sm badge-soft"
                        title={row[col]}
                      >
                        <CellFormatter
                          value={row[col]}
                          formatting={cellFormatting?.value[col]}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
              {isExpanded && renderExpandedRow && (
                <div class="mt-4">
                  {renderExpandedRow(row)}
                </div>
              )}
            </div>
          </div>
        );

        return rowContent;
      })}
      <div style={{ height: `${paddingBottom}px` }} />
      {onLoadMore && (
        <div class="flex justify-center items-center mt-4">
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
    </div>
  );
}
