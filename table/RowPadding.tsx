import { TableStore } from "@/store/types.ts";
import { useOrderedColumns } from "@/columns/mod.ts";
import { usePluginContainer } from "../plugin/usePluginContainer.ts";

interface RowPaddingProps {
  columns: string[];
  getColumnWidth: (col: string) => number;
  padding: number;
  name: string;
  store: TableStore;
}

export const RowPadding = (
  {
    getColumnWidth,
    padding,
    name,
    store,
  }: RowPaddingProps,
) => {
  const columns = useOrderedColumns({ store });
  const plugins = usePluginContainer({ store });
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
