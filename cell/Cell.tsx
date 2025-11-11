import { sanitizeColName } from "@/common/sanitizeColName.ts";
import { cn } from "@/common/className.ts";
import { useStickyColumn } from "@/columns/mod.ts";
import { TableStore } from "@/store/types.ts";
import { RowData } from "@/row/types.ts";
import { usePlugins } from "@/plugin/usePlugins.ts";
import { TypeFormat } from "@/datatype/mod.ts";
import { useRowHeights } from "@/fetcher/useRowHeights.ts";
import { useCellKb } from "@/keyboard/useCellKb.ts";

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
  const key = store.getCellKey({ row, column });

  const getHeight = useRowHeights({
    store,
    height: 64,
  });

  const {
    isSticky,
    isStickyLeft,
    isStickyRight,
    left,
    right,
  } = useStickyColumn({ store, column });
  const isSelected = store.state.selectedCells?.value?.[key];
  const keyBindings = useCellKb({ store, row, column });

  return (
    <td
      key={column}
      data-column-name={column}
      tabIndex={0}
      style={{
        width: `var(--col-width-${sanitizeColName(column)})`,
        height: `${getHeight(row)}px`,
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
      {...keyBindings}
    >
      <div
        class="vt-cell-wrap"
        title={row[column]?.toString()}
      >
        {plugins.cellprefixes.render({
          column: column,
          row,
          store,
        })}

        <TypeFormat {...{ store, column, row }} />

        {plugins.cellsuffixes?.render({
          column: column,
          row,
          store,
        })}
      </div>
    </td>
  );
};
