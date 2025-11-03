import { useMemo, useRef } from "preact/hooks";
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
  useVirtualData,
} from "@/hooks/mod.ts";
import { VirtualTableViewProps } from "./types.ts";
import { useRenderRowCallback } from "./Row.tsx";
import { ContextMenu } from "@/menu/ContextMenu.tsx";
import { StickyHeaderContainer } from "./StickyHeaderContainer.tsx";
import { RowPadding } from "./RowPadding.tsx";
import { useSignal } from "@preact/signals";

export function TableView(props: VirtualTableViewProps) {
  const {
    columns,
    store,
    initialWidth,
    scrollContainerRef,
    rowIdentifier,
    tableAddon,
    selectable,
    expandable,
    enumerable,
    groupable,
    plugins,
    onDataLoad,
    rowHeight,
    buffer,
  } = props;
  const bodyContainerRef = useRef<HTMLDivElement>(null);

  const loadedData = useSignal([]);
  const count = useSignal(buffer ?? 50);

  const getRowHeight = useRowHeights({
    store,
    expandable,
    rowKey: rowIdentifier,
    height: rowHeight,
  });

  const rowHeights = loadedData.value.map(getRowHeight);
  const {
    virtualItems,
    paddingTop,
    paddingBottom,
  } = useVariableVirtualizer({
    scrollContainerRef,
    itemCount: count.value,
    rowHeights,
  });

  const visibleRows = useMemo(() => {
    return virtualItems.map((i) => ({
      ...i,
      row: loadedData.value[i.index] ?? null,
    }));
  }, [loadedData.value, virtualItems]);

  console.log("11", visibleRows);

  const { data, total, isLoading } = useData({
    onDataLoad,
    store,
    plugins,
    visibleRows,
  });

  loadedData.value = data.value;
  count.value = total.value;

  const columnsInOrder = useOrderedColumns({ store, columns });
  const rowKey = useRowKey(columns, rowIdentifier);

  useColumnWidthEffect({ store, columns, initialWidth });

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
        store={store}
        plugins={plugins}
        {...{
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
      {isLoading.value && (
        <progress class="progress progress-primary h-1 rounded-none absolute z-100 w-full opacity-25" />
      )}
      <div ref={bodyContainerRef}>
        <table
          style={style}
          id="vt-main"
          class="vt"
          onKeyDown={focusNav.onKeyDown}
          onKeyUp={focusNav.onKeyUp}
        >
          <tbody>
            {["top", ...visibleRows, "bottom"].map((row, i) => {
              if (row === "top") {
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

              if (row === "bottom") {
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
                row.row ?? { $loading: true, _key: row.index },
                i,
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
