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
import { usePluginContainer } from "../plugin/usePluginContainer.ts";

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
  columns,
  enumerable,
  expandable,
  selectable,
  groupable,
  rowKey,
}: StickyHeaderContainerProps) {
  const {
    getColumnWidth,
  } = useColumnResizer({
    store,
  });

  const plugins = usePluginContainer({ store });
  const columnsInOrder = useOrderedColumns({ store });

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
            {plugins.leftTableHeaders.render({
              column: "",
              store,
            })}
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
