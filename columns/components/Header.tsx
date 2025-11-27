import { Store } from "@xmod/mod.ts";
import { getAddons } from "@xmod/mod.ts";
import { useTableColumnStyle } from "../hooks/useTableColumnStyle.ts";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { Column } from "./Column.tsx";
import { useEffect, useRef } from "preact/hooks";
import { mapAddons } from "../hooks/mapAddons.ts";

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
  const ref = useRef(null);
  useEffect(() => {
    store.headerRef = ref;
  }, [ref.current]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <table
        style={style.value}
        x-id={`vt_${store.state.tableId}`}
        class={"vt vt-header " + classes}
        tabIndex={-1}
      >
        <thead id="vt-main-head" ref={ref}>
          {loading
            ? (
              addons.headerskeleton.at(0)?.()
            )
            : (
              <>
                {addons.beforeheader.render({
                  store,
                })}
                <tr>
                  {addons.lefttableheaders
                    .render({
                      column: "",
                      store,
                    })
                    .map(mapAddons)}
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
                  {addons.righttableheaders
                    .render({
                      column: "",
                      store,
                    })
                    .map(mapAddons)}
                </tr>
                {addons.afterheader.render({
                  store,
                })}
              </>
            )}
        </thead>
      </table>
    </div>
  );
}
