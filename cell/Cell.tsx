import { sanitizeColName } from "@/common/sanitizeColName.ts";
import { cn } from "@/common/className.ts";
import { useStickyColumn } from "@/columns/mod.ts";
import { TableStore } from "@/store/types.ts";
import { RowData } from "@/row/types.ts";
import { useRowKey } from "@/fetcher/useRowKey.ts";
import { usePlugins } from "../plugin/usePlugins.ts";

interface CellProps {
  store: TableStore;
  column: string;
  row: RowData;
}

export const Cell = ({
  store,
  column,
  row,
}: CellProps) => {
  const plugins = usePlugins({ store });
  const height = 64;
  const rowKey = useRowKey({ store });
  const {
    isSticky,
    isStickyLeft,
    isStickyRight,
    left,
    right,
  } = useStickyColumn({ store, column });
  const isSelected = store.state.selectedCells?.value?.[row[rowKey]]?.[column];
  return (
    <td
      key={column}
      data-column-name={column}
      style={{
        width: `var(--col-width-${sanitizeColName(column)})`,
        height: `${height}px`,
        left,
        right,
        zIndex: isSticky ? 1 : 0,
        position: isSticky ? "sticky" : undefined,
      }}
      class={cn({
        "vt-cell": true,
        "stick-left": isStickyLeft,
        "stick-right": isStickyRight,
        "multifocus": isSelected,
      })}
    >
      <div
        class="vt-cell-wrap"
        title={row[column].toString()}
      >
        {plugins.cellprefixes.render({
          column: column,
          row,
          store,
        })}

        {row[column]}

        {plugins.cellsuffixes?.render({
          column: column,
          row,
          store,
        })}
      </div>
    </td>
  );
};
