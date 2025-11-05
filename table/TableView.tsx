import {
  useFocusNavCallback,
  useRowHeights,
  useRowKey,
  useTableStyle,
} from "@/hooks/mod.ts";

import { useDataFetcher } from "@/fetcher/mod.ts";

import { useColumnResizer, useOrderedColumns } from "@/columns/mod.ts";

import { Row } from "./types.ts";
import { VirtualTableViewProps } from "./types.ts";
import { useRenderRowCallback } from "./Row.tsx";
import { ContextMenu } from "@/menu/ContextMenu.tsx";
import { StickyHeaderContainer } from "./StickyHeaderContainer.tsx";
import { StickyRowsContainer } from "./StickyRowsContainer.tsx";

import { RowPadding } from "./RowPadding.tsx";

export function TableView(props: VirtualTableViewProps) {
  const {
    store,
    scrollContainerRef,
    tableAddon,
    selectable,
    expandable,
    enumerable,
    groupable,
    plugins,
    onDataLoad,
    rowHeight = 64,
    rowIdentifier = "id",
    buffer = 1,
  } = props;

  const columns = store.state.columns.value;
  const rowKey = useRowKey(columns, rowIdentifier);

  const {
    data,
    visibleRows,
    rowHeights,
    paddingBottom,
    paddingTop,
  } = useDataFetcher({
    store,
    plugins,
    scrollContainerRef,
    rowKey,
    rowHeight,
    onDataLoad,
  });

  const columnsInOrder = useOrderedColumns({ store });

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

  const getRowHeight = useRowHeights({
    store,
    rowKey,
    height: rowHeight,
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
    plugins,
  });

  const focusNav = useFocusNavCallback({
    store,
    startIndex: visibleRows[0]?.index ?? 0,
    endIndex: visibleRows[visibleRows.length - 1]?.index ?? 0,
    key: paddingTop + paddingBottom,
    scrollContainerRef: scrollContainerRef!,
    rowHeights,
  });

  return (
    <>
      <ContextMenu store={store} target={scrollContainerRef} />
      <StickyHeaderContainer
        {...{
          store,
          plugins,
          data: data.value,
          enumerable,
          expandable,
          groupable,
          selectable,
          rowKey,
          tableAddon,
          columns,
        }}
      />
      {
        /* <StickyRowsContainer
        {...{
          store,
          plugins,
          data: data.value,
          visibleRows,
          renderRow,
          rowHeights,
          enumerable,
          expandable,
          groupable,
          selectable,
          rowKey,
          tableAddon,
          columns,
          scrollContainerRef,
        }}
      /> */
      }

      <table
        style={style}
        id="vt-main"
        class="vt"
        onKeyDown={focusNav.onKeyDown}
        onKeyUp={focusNav.onKeyUp}
      >
        <tbody>
          {[{ row: "top" }, ...visibleRows, { row: "bottom" }].map(
            (item, i) => {
              if (item.row === "top") {
                return (
                  <RowPadding
                    key={paddingTop + i}
                    name="top"
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
                );
              }

              if (item.row === "bottom") {
                return (
                  <RowPadding
                    key={paddingBottom + i}
                    name="bottom"
                    padding={paddingBottom}
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
                );
              }

              return renderRow(
                (item.row as Row) ?? { $loading: true },
                i,
              );
            },
          )}
        </tbody>
      </table>
    </>
  );
}
