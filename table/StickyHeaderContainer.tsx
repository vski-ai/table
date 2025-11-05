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
  store,
  columns,
  enumerable,
  expandable,
  selectable,
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
