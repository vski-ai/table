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
  const { header } = getAddons({ store });
  const classes = header.parentClasses.string({
    store,
  });

  const columnsInOrder = useOrderedColumns({ store });
  const { style } = useTableColumnStyle({ store });

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
              header.skeleton.at(0)?.()
            )
            : (
              <>
                {header.before.render({
                  store,
                })}
                <tr>
                  {header.left
                    .render({
                      column: "",
                      store,
                    })
                    .map(mapAddons)}
                  {columnsInOrder.map((col) => (
                    <>
                      {header.beforeEach.render({
                        column: col,
                        store,
                      })}
                      <Column key={col} column={col} store={store} />
                      {header.afterEach.render({
                        column: col,
                        store,
                      })}
                    </>
                  ))}
                  {header.right
                    .render({
                      column: "",
                      store,
                    })
                    .map(mapAddons)}
                </tr>
                {header.after.render({
                  store,
                })}
              </>
            )}
        </thead>
      </table>
    </div>
  );
}
