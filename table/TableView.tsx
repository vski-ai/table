import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

import {
  useColumnResizer,
  useColumnWidthEffect,
  useData,
  useFocusNavCallback,
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
    onDataLoad,
    columns,
    store,
    initialWidth,
    columnExtensions,
    columnAction,
    rowHeight = 56,
    buffer = 50,
    scrollContainerRef,
    rowIdentifier,
    tableAddon,
    selectable,
    sortable,
    expandable,
    enumerable,
    groupable,
  } = props;
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const [borderSpacing] = useState(0);

  const { data, total, load } = useData(onDataLoad, store);

  const columnsInOrder = useOrderedColumns({
    store,
    columns,
  });

  // TODO: first filter then sort
  // const sortedData = useMemo(() => {
  //   const filteredData = data.value.filter(Boolean);
  //   return sortable ? sorter({ data: filteredData, store: store.state }) : filteredData;
  // }, [
  //   data.value,
  //   store.state.sorting.value,
  //   store.state.leafSorting.value,
  // ]);

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

  const rowKey = useRowKey(columns, rowIdentifier);

  const visibleRows = useVisibleRows({
    data: data.value,
    store,
    sortable,
  });

  const getRowHeight = useRowHeights({
    data: visibleRows,
    store,
    expandable,
    rowKey,
    height: rowHeight,
  });

  const rowHeights = useMemo(
    () => data.value.map((row) => row ? getRowHeight(row) : rowHeight),
    [
      data.value,
      getRowHeight,
    ],
  );

  const { startIndex, endIndex, paddingTop, paddingBottom } =
    useVariableVirtualizer({
      scrollContainerRef,
      itemCount: total.value,
      rowHeights,
      buffer,
      spacing: borderSpacing,
    });

  useColumnWidthEffect({
    store,
    columns,
    initialWidth,
  });

  useEffect(() => {
    if (startIndex + endIndex < 1) return;
    if (total.value > 0) {
      load(startIndex, endIndex);
    }
  }, [startIndex, endIndex, total.value]);

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
    getRowHeight,
    columns: columnsInOrder,
    expandable,
    selectable,
    groupable,
    enumerable,
    tableAddon,
  });

  const focusNav = useFocusNavCallback({
    store,
    startIndex,
    endIndex,
    key: paddingTop + paddingBottom,
    scrollContainerRef: scrollContainerRef!,
    rowHeights,
  });

  return (
    <>
      <ContextMenu store={store} target={scrollContainerRef} />

      <StickyHeaderContainer
        store={store}
        extensions={renderColumnExtension}
        action={renderColumnAction}
        {...{
          data: visibleRows,
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
          scrollContainerRef,
        }}
      />

      <div ref={bodyContainerRef}>
        <table
          style={style}
          id="vt-main"
          class="vt"
          onKeyDown={focusNav.onKeyDown}
          onKeyUp={focusNav.onKeyUp}
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

            {data.value.slice(startIndex, endIndex + 1).map((row, i) => {
              row = row ||
                columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {
                  $loading: true,
                });
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
    </>
  );
}
