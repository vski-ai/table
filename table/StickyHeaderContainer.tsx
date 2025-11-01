import { type JSX } from "preact";
import { CommandType, TableStore } from "@/store/mod.ts";
import { ResizableHeader } from "./ResizableHeader.tsx";
import { Drilldown } from "@/menu/Drilldown.tsx";
import { Row } from "./types.ts";
import {
  useColumnResizer,
  useColumnsOrderCallback,
  useOrderedColumns,
  useStickyColOffset,
  useTableStyle,
} from "@/hooks/mod.ts";

interface StickyHeaderContainerProps {
  data: Row[];
  store: TableStore;
  columns: string[];
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  tableAddon?: any;
  rowKey: string;
  extensions?: (col: string) => JSX.Element;
  action?: (col: string) => JSX.Element;
}

export function StickyHeaderContainer({
  data,
  store,
  columns,
  enumerable,
  expandable,
  selectable,
  extensions,
  action,
  groupable,
  tableAddon,
  rowKey,
}: StickyHeaderContainerProps) {
  const {
    getColumnWidth,
    handleResizeUpdateCallback,
    handleResizeCallback,
  } = useColumnResizer({
    store,
  });

  const stickyColumns = useStickyColOffset({
    store,
    columns,
  });

  const orderColumnsCallback = useColumnsOrderCallback({
    store,
    columns,
  });

  const columnsInOrder = useOrderedColumns({
    store,
    columns,
  });

  const { style } = useTableStyle({
    store,
    getColumnWidth,
    columns,
    selectable,
    enumerable,
    expandable,
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        width: style.width,
      }}
    >
      <table
        style={style}
        class="vt"
      >
        <thead id="vt-main-head">
          <tr>
            {enumerable && (
              <th
                style={{ width: "50px" }}
                class="vski-expanded-row-th"
              >
              </th>
            )}
            {expandable && (
              <th
                style={{ width: "50px" }}
                class="vski-expanded-row-th"
              >
              </th>
            )}

            {selectable && (
              <th
                style={{ width: "50px" }}
                class="vski-select-row-th"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  checked={store.state.selectedRows.value.length ===
                    data.length}
                  onChange={(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      store.dispatch({
                        type: CommandType.SELECTED_ROWS_SET,
                        payload: data.map((row) => row[rowKey]),
                      });
                    } else {
                      store.dispatch({
                        type: CommandType.SELECTED_ROWS_SET,
                        payload: [],
                      });
                    }
                  }}
                />
              </th>
            )}

            {groupable && (
              <ResizableHeader
                key="$group_by"
                column="$group_by"
                width={getColumnWidth("$group_by")}
                onResize={handleResizeCallback}
                onResizeUpdate={handleResizeUpdateCallback}
                stickyColumns={stickyColumns}
              >
                <Drilldown store={store} />
              </ResizableHeader>
            )}

            {columnsInOrder.map((col) => (
              <ResizableHeader
                key={col}
                column={col}
                width={getColumnWidth(col)}
                onResize={handleResizeCallback}
                onResizeUpdate={handleResizeUpdateCallback}
                extensions={extensions}
                action={action}
                onColumnDrop={orderColumnsCallback}
                stickyColumns={stickyColumns}
              />
            ))}

            {tableAddon
              ? (
                <th
                  style={{
                    width: "80px",
                    padding: 0,
                  }}
                >
                  {tableAddon}
                </th>
              )
              : null}
          </tr>
        </thead>
      </table>
    </div>
  );
}
