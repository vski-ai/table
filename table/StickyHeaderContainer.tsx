import { CommandType, TableStore } from "@/store/mod.ts";
import { Row } from "./types.ts";
import {
  ColumnHeader,
  useColumnResizer,
  useColumnsOrderCallback,
  useOrderedColumns,
  useStickyColOffset,
} from "@/columns/mod.ts";
import { useTableStyle } from "@/hooks/mod.ts";
import { PluginContainer } from "@/plugin/mod.ts";

interface StickyHeaderContainerProps {
  data: (Row | null)[];
  store: TableStore;
  plugins: PluginContainer;
  columns: string[];
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  rowKey: string;
}

export function StickyHeaderContainer({
  data,
  store,
  plugins,
  columns,
  enumerable,
  expandable,
  selectable,
  groupable,
  rowKey,
}: StickyHeaderContainerProps) {
  const {
    getColumnWidth,
    handleResizeUpdateCallback,
    handleResizeCallback,
  } = useColumnResizer({
    store,
  });

  const orderColumnsCallback = useColumnsOrderCallback({ store });

  const columnsInOrder = useOrderedColumns({ store });

  const stickyColumns = useStickyColOffset({ store });

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
      }}
      class="shadow-2xl"
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
                        payload: data.map((row) => row?.[rowKey]),
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
              <ColumnHeader
                key="$group_by"
                column="$group_by"
                store={store}
              >
              </ColumnHeader>
            )}

            {columnsInOrder.map((col) => (
              <ColumnHeader
                key={col}
                column={col}
                store={store}
              />
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}
