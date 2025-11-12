import { TableStore } from "@/module/types.ts";
import { useColumnResizer } from "@/columns/hooks/useColumnnResize.ts";
import { useOrderedColumns } from "@/columns/hooks/useOrderedColumns.ts";
import { useAddons } from "@/module/mod.ts";

interface RowPaddingProps {
  padding: number;
  name: string;
  store: TableStore;
}

export const RowPadding = (
  {
    padding,
    name,
    store,
  }: RowPaddingProps,
) => {
  const columns = useOrderedColumns({ store });
  const adons = useAddons({ store });
  const { getColumnWidth } = useColumnResizer({ store });
  return (
    <tr
      class="vt-row vt-row-padding"
      data-name={name}
      style={{ height: `${padding}px` }}
    >
      {adons.lefttablecells.getSorted().map((cb) => (
        <td
          class="vt-cell"
          style={{
            width: getColumnWidth(cb.columnName!),
            height: 0,
            padding: 0,
          }}
        >
        </td>
      ))}
      {columns.map((col) => (
        <td
          class="vt-cell"
          style={{
            width: getColumnWidth(col),
            height: 0,
            padding: 0,
          }}
        >
        </td>
      ))}
    </tr>
  );
};
