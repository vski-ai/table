import { TableStore } from "@/module/mod.ts";
import { useAddons } from "@/module/mod.ts";
import { useTableColumnStyle } from "../hooks/useTableColumnStyle.ts";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { Column } from "./Column.tsx";

interface HeaderProps {
  store: TableStore;
  loading: boolean;
}

export function Header({
  store,
  loading,
}: HeaderProps) {
  const adons = useAddons({ store });
  const columnsInOrder = useOrderedColumns({ store });
  const { style } = useTableColumnStyle({ store });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <table
        style={style}
        x-id={`vt_${store.state.tableId}`}
        class="vt vt-header"
      >
        <thead id="vt-main-head">
          {loading
            ? (
              <tr>
                {new Array(10).fill(0).map((_, i) => (
                  <th class="vt-col" key={i} style={{ width: 350 }}>
                    <div class="vt-header-skeleton"></div>
                  </th>
                ))}
              </tr>
            )
            : (
              <tr>
                {adons.lefttableheaders.render({
                  column: "",
                  store,
                })}
                {columnsInOrder.map((col) => (
                  <Column
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
