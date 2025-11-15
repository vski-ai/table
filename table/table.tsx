import { MutableRef, useRef } from "preact/hooks";
import { DataLoadCallback } from "@/fetcher/types.ts";
import { useDataFetcher } from "@/fetcher/hooks/useDataFetcher.ts";
import { useAddons } from "@/module/mod.ts";
import { Header } from "@/columns/components/Header.tsx";
import { useTableColumnStyle } from "@/columns/hooks/useTableColumnStyle.ts";
import {
  RowData,
  RowPadding,
  RowSkeleton,
  useRenderRowCallback,
} from "@/row/mod.ts";
import { TableStore } from "@/module/types.ts";
import { useTableKb } from "@/keyboard/hooks/useTableKb.ts";

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
  } = props;

  const rowHeight = store.state.table.row_height.value;

  const {
    visibleRows,
    paddingBottom,
    paddingTop,
  } = useDataFetcher({
    store,
    rowHeight,
    onDataLoad,
  });

  const { style } = useTableColumnStyle({ store });

  const renderRow = useRenderRowCallback({
    store,
    rowHeight,
  });

  const tableRef = useRef<HTMLTableElement>(null);

  const kb = useTableKb({ store, tableRef });

  const adons = useAddons({ store });
  const initializing = !store.state.fetcher.is_initialized.value;
  return (
    <>
      <Header store={store} loading={initializing} />
      {adons.beforetable.render({
        ref: scrollContainerRef,
        store,
      })}

      <table
        style={style}
        x-id={`vt_${store.state.tableId}`}
        class="vt vt-main"
        ref={tableRef}
        tabIndex={-1}
        {...kb}
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
      {adons.aftertable.render({
        ref: scrollContainerRef,
        store,
      })}
    </>
  );
}
