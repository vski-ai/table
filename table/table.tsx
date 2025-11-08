import { MutableRef, useRef } from "preact/hooks";
import { useTableTabIndexEffect } from "@/common/useTableTabIndexEffect.ts";
import { DataLoadCallback, useDataFetcher } from "@/fetcher/mod.ts";
import { usePlugins } from "@/plugin/mod.ts";
import { Header, useTableColumnStyle } from "@/columns/mod.ts";
import { useNavCallback } from "@/cell/mod.ts";
import {
  RowData,
  RowPadding,
  RowSkeleton,
  useRenderRowCallback,
} from "@/row/mod.ts";
import { TableStore } from "@/store/types.ts";

export type TableProps = {
  onDataLoad: DataLoadCallback;
  store: TableStore;
  rowHeight?: number;
  scrollContainerRef: MutableRef<HTMLElement>;
  rowIdentifier?: string;
};

export function Table(props: TableProps) {
  const {
    store,
    scrollContainerRef,
    onDataLoad,
    rowHeight = 64,
  } = props;

  const {
    data,
    visibleRows,
    rowHeights,
    paddingBottom,
    paddingTop,
  } = useDataFetcher({
    store,
    scrollContainerRef,
    rowHeight,
    onDataLoad,
  });

  const { style } = useTableColumnStyle({ store });

  const renderRow = useRenderRowCallback({
    store,
    rowHeight,
  });

  const tableRef = useRef<HTMLTableElement>(null);

  useTableTabIndexEffect({
    target: tableRef,
  }, [data.value, visibleRows]);

  const focusNav = useNavCallback({
    store,
    startIndex: visibleRows[0]?.index ?? 0,
    endIndex: visibleRows[visibleRows.length - 1]?.index ?? 0,
    key: paddingTop + paddingBottom,
    scrollContainerRef: scrollContainerRef!,
    rowHeights,
  });

  const plugins = usePlugins({ store });
  const initializing = !data.value.length;
  return (
    <>
      <Header store={store} loading={initializing} />
      {plugins.beforetable.render({
        ref: scrollContainerRef,
        store,
      })}

      <table
        style={style}
        x-id={`vt_${store.state.tableId}`}
        class="vt vt-main"
        ref={tableRef}
        onKeyDown={focusNav.onKeyDown}
        onKeyUp={focusNav.onKeyUp}
        onFocus={focusNav.onFocus}
      >
        <tbody>
          {initializing && <RowSkeleton />}
          {[{ row: "top", index: -Infinity }, ...visibleRows, {
            row: "bottom",
            index: Infinity,
          }].map(
            (item, i) => {
              if (item.row === "top") {
                return (
                  <RowPadding
                    key={paddingTop + i}
                    name="top"
                    padding={paddingTop}
                    {...{
                      store,
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
                    {...{
                      store,
                    }}
                  />
                );
              }

              return renderRow(
                (item.row as RowData) ?? { $loading: true },
                item.index,
              );
            },
          )}
        </tbody>
      </table>
      {plugins.aftertable.render({
        ref: scrollContainerRef,
        store,
      })}
    </>
  );
}
