import { TableStore } from "@/module/mod.ts";
import { useAddons } from "@/module/mod.ts";
import { useTableColumnStyle } from "../hooks/useTableColumnStyle.ts";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { Column } from "./Column.tsx";

interface HeaderProps {
  store: TableStore;
  loading: boolean;
}

export function Header({ store, loading }: HeaderProps) {
  const addons = useAddons({ store });
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
        tabIndex={-1}
      >
        <thead id="vt-main-head">
          {loading
            ? (
              <tr>
                {new Array(30).fill(0).map((_, i) => (
                  <th class="vt-col col-loading" key={i} style={{ width: 150 }}>
                    <div class="vt-header-skeleton"></div>
                  </th>
                ))}
              </tr>
            )
            : (
              <tr>
                {addons.lefttableheaders.render({
                  column: "",
                  store,
                })}
                {columnsInOrder.map((col) => (
                  <>
                    {addons.beforeheaders.render({
                      column: "",
                      store,
                    })}
                    <Column key={col} column={col} store={store} />
                    {addons.afterheaders.render({
                      column: "",
                      store,
                    })}
                  </>
                ))}
                {addons.righttableheaders.render({
                  column: "",
                  store,
                })}
              </tr>
            )}
        </thead>
      </table>
    </div>
  );
}
