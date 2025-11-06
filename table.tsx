import { MutableRef, useRef } from "preact/hooks";
import { useTableTabIndexEffect } from "@/common/useTableTabIndexEffect.ts";
import { DataLoadCallback, useDataFetcher } from "@/fetcher/mod.ts";
import { usePluginContainer } from "@/plugin/mod.ts";
import { Header, useTableColumnStyle } from "@/columns/mod.ts";
import { useNavCallback } from "@/cell/mod.ts";
import { RowData, RowPadding, useRenderRowCallback } from "@/row/mod.ts";
import { TableStore } from "@/store/types.ts";

export type TableProps = {
  onDataLoad: DataLoadCallback;
  store: TableStore;
  initialWidth?: number;
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

  const plugins = usePluginContainer({ store });
  const initializing = !data.value.length;
  return (
    <>
      {plugins.beforeTable.render({
        ref: scrollContainerRef,
        store,
      })}
      <Header store={store} loading={initializing} />
      <table
        style={style}
        id="vt-main"
        class="vt"
        ref={tableRef}
        onKeyDown={focusNav.onKeyDown}
        onKeyUp={focusNav.onKeyUp}
        onFocus={focusNav.onFocus}
      >
        <tbody>
          {initializing && (
            new Array(50).fill(0).map((_, i) => (
              <tr>
                {new Array(10).fill(0).map((_, i) => (
                  <td key={i} style={{ width: 350 }}>
                    <div class="skeleton h-8"></div>
                  </td>
                ))}
              </tr>
            ))
          )}
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
      {plugins.afterTable.render({
        ref: scrollContainerRef,
        store,
      })}
    </>
  );
}
