import { TableStore } from "@/store/types.ts";
import { useColumnResizer, useOrderedColumns } from "@/columns/mod.ts";
import { usePlugins } from "../plugin/usePlugins.ts";

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
  const plugins = usePlugins({ store });
  const { getColumnWidth } = useColumnResizer({ store });
  return (
    <tr
      class="vt-row vt-row-padding"
      data-name={name}
      style={{ height: `${padding}px` }}
    >
      {plugins.leftTableCells.getSorted().map((cb) => (
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
