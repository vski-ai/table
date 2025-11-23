import { Store } from "@xmod/mod.ts";
import { getAddons } from "@xmod/mod.ts";
import { useTableColumnStyle } from "../hooks/useTableColumnStyle.ts";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { Column } from "./Column.tsx";

interface HeaderProps {
  store: Store;
  loading: boolean;
}

export function Header({ store, loading }: HeaderProps) {
  const addons = getAddons({ store });
  const columnsInOrder = useOrderedColumns({ store });
  const { style } = useTableColumnStyle({ store });
  const classes = addons.headerclasses.string({
    store,
  });
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
        class={"vt vt-header " + classes}
        tabIndex={-1}
      >
        <thead id="vt-main-head">
          {loading
            ? (
              addons.headerskeleton.at(0)?.()
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
