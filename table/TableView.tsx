import { useNavCallback, useTableTabIndexEffect } from "@/navigation/mod.ts";
import { useTableStyle } from "./useTableStyle.ts";
import { useDataFetcher } from "@/fetcher/mod.ts";

import { Row } from "./types.ts";
import { VirtualTableViewProps } from "./types.ts";
import { useRenderRowCallback } from "./Row.tsx";
import { ContextMenu } from "@/menu/ContextMenu.tsx";
import { HeaderContainer } from "./HeaderContainer.tsx";

import { RowPadding } from "./RowPadding.tsx";
import { useRef } from "preact/hooks";

export function TableView(props: VirtualTableViewProps) {
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

  const { style } = useTableStyle({ store });

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

  const initializing = !data.value.length;
  return (
    <>
      <ContextMenu store={store} target={scrollContainerRef} />
      <HeaderContainer store={store} loading={initializing} />
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
        ref={tableRef}
        onKeyDown={focusNav.onKeyDown}
        onKeyUp={focusNav.onKeyUp}
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
                (item.row as Row) ?? { $loading: true },
                item.index,
              );
            },
          )}
        </tbody>
      </table>
    </>
  );
}
