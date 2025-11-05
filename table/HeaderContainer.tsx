import { TableStore } from "@/store/mod.ts";
import { ColumnHeader, useOrderedColumns } from "@/columns/mod.ts";
import { useTableStyle } from "./useTableStyle.ts";
import { usePluginContainer } from "@/plugin/usePluginContainer.ts";

interface StickyHeaderContainerProps {
  store: TableStore;
  loading: boolean;
}

export function HeaderContainer({
  store,
  loading,
}: StickyHeaderContainerProps) {
  const plugins = usePluginContainer({ store });
  const columnsInOrder = useOrderedColumns({ store });
  const { style } = useTableStyle({ store });

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
          {loading
            ? (
              <tr>
                {new Array(10).fill(0).map((_, i) => (
                  <th key={i} style={{ width: 350 }}>
                    <div class="skeleton h-8"></div>
                  </th>
                ))}
              </tr>
            )
            : (
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
            )}
        </thead>
      </table>
    </div>
  );
}
