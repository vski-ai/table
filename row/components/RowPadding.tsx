import { TableStore } from "@/module/types.ts";
import { useColumnResizer } from "@/columns/hooks/useColumnnResize.ts";
import { useOrderedColumns } from "@/columns/hooks/useOrderedColumns.ts";
import { useAddons } from "@/module/mod.ts";

interface RowPaddingProps {
  padding: number;
  name: string;
  store: TableStore;
}

export const RowPadding = ({ padding, name, store }: RowPaddingProps) => {
  const all_columns = useOrderedColumns({ store });
  const columns = [
    ...store.state.columns.service_columns.value,
    ...all_columns,
  ];
  const addons = useAddons({ store });
  const { getColumnWidth } = useColumnResizer({ store });
  return (
    <tr
      class="vt-row vt-row-padding"
      data-name={name}
      style={{ height: `${padding}px` }}
    >
      {addons.lefttablecells.getSorted().map((cb) =>
        store.state.columns.visibility.value[cb.columnName!] ===
            false
          ? null
          : (
            <td
              class="vt-cell"
              style={{
                width: getColumnWidth(cb.columnName!),
                height: 0,
                padding: 0,
              }}
            >
            </td>
          )
      )}
      {columns.map((col) =>
        store.state.columns.visibility.value[col] === false ? null : (
          <>
            {addons.beforepadding.render({} as any)}
            <td
              class="vt-cell"
              style={{
                width: getColumnWidth(col),
                height: 0,
                padding: 0,
              }}
            >
            </td>
          </>
        )
      )}
    </tr>
  );
};
