import { Store } from "@xmod/mod.ts";
import { MutableRef, useEffect, useRef } from "preact/hooks";
import { DataLoadCallback } from "@/fetcher/types.ts";
import { useDataFetcher } from "@/fetcher/hooks/useDataFetcher.ts";
import { getAddons } from "@xmod/mod.ts";
import { Header } from "@/columns/components/Header.tsx";
import { useTableColumnStyle } from "@/columns/hooks/useTableColumnStyle.ts";
import { RowData, RowPadding, useRenderRowCallback } from "@/row/mod.ts";

import { useTableInput } from "@/input/hooks/useTableInput.ts";

export type TableProps = {
  onDataLoad: DataLoadCallback;
  store: Store;
  scrollContainerRef: MutableRef<HTMLElement>;
};

export function Table(props: TableProps) {
  const { store, scrollContainerRef, onDataLoad } = props;

  const rowHeight = store.state.table.row_height.value;

  const { visibleRows, paddingBottom, paddingTop } = useDataFetcher({
    store,
    rowHeight,
    onDataLoad,
  });

  const { style, totalWidth } = useTableColumnStyle({ store });

  const renderRow = useRenderRowCallback({
    store,
    rowHeight,
  });

  const tableRef = useRef<HTMLTableElement>(null);

  const kb = useTableInput({ store, tableRef });

  const addons = getAddons({ store });

  const renderRows = [
    { row: "top", index: -10 },
    ...visibleRows,
    { row: "bottom", index: -10 },
  ];

  const classes = addons.tableclasses.string({
    store,
  });

  const initializing = !store.state.fetcher.is_initialized.value;

  return (
    <>
      <Header store={store} loading={initializing} />
      {addons.beforetable.render({
        ref: scrollContainerRef,
        store,
      })}

      <table
        style={style.value}
        x-id={`vt_${store.state.tableId}`}
        class={"vt vt-main " + classes}
        ref={tableRef}
        tabIndex={-1}
        width={totalWidth.value}
        {...kb}
      >
        <tbody>
          {initializing && addons.tableskeleton.at(0)?.()}

          {renderRows.map((item, i) => {
            if (item.row === "top") {
              return (
                <RowPadding
                  key={i}
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
                  key={i + 1}
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
          })}
        </tbody>
      </table>
      {addons.aftertable.render({
        ref: scrollContainerRef,
        store,
      })}
    </>
  );
}
