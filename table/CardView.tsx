import { useMemo, useRef } from "preact/hooks";
import { useVariableVirtualizer } from "./useVariableVirtualizer.ts";
import { VirtualTableViewProps } from "./types.ts";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import { CommandType } from "@/store/mod.ts";

type CardViewProps = VirtualTableViewProps;

export function CardView(props: CardViewProps) {
  const {
    data,
    columns,
    store,
    onLoadMore,
    rowHeight = 60, // Adjusted for a card-like appearance
    buffer = 5,
    scrollContainerRef,
    rowIdentifier,
    formatColumnName,
    selectable,
  } = props;
  const tableRef = useRef<HTMLDivElement>(null);

  const rowKey = useMemo(() => {
    if (rowIdentifier && columns.includes(rowIdentifier)) return rowIdentifier;
    if (columns.includes("id")) return "id";
    return columns[0];
  }, [columns, rowIdentifier]);

  const rowHeights = useMemo(() => {
    return data.map((row) => {
      const isExpanded = store.state.expandedRows.value.includes(row[rowKey]);
      // Expanded height can be dynamic based on content, 200 is a placeholder
      return isExpanded ? rowHeight + 200 : rowHeight;
    });
  }, [data, store.state.expandedRows.value, rowHeight, rowKey]);

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
        const isSelected = store.state.selectedRows.value.includes(row[rowKey]);
        const isExpanded = store.state.expandedRows.value.includes(row[rowKey]);

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
              onClick={() =>
                props.expandable &&
                store.dispatch({
                  type: CommandType.ROW_EXPANSION_TOGGLE,
                  payload: row[rowKey],
                })}
            >
              {selectable && (
                <input
                  type="checkbox"
                  class="checkbox mr-4"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent opening the card
                    const checked = (e.target as HTMLInputElement).checked;
                    const currentSelectedRows = store.state.selectedRows.value;
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
                          formatting={store.state.cellFormatting.value[col]}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
              {isExpanded && props.expandable && (
                <div class="mt-4">
                  {props.renderExpand(row)}
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
            disabled={store.state.loading.value}
          >
            {store.state.loading.value ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
