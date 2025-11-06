import { TableStore } from "@/store/types.ts";
import { useColumnResizer, useOrderedColumns } from "@/columns/mod.ts";
import { usePluginContainer } from "../plugin/usePluginContainer.ts";

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
  const plugins = usePluginContainer({ store });
  const { getColumnWidth } = useColumnResizer({ store });
  return (
    <tr data-name={name} style={{ height: `${padding}px` }}>
      {plugins.leftTableCells.getSorted().map((cb) => (
        <td
          class="bg-base-100"
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
          class="bg-base-100"
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
