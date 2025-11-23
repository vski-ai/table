import { sanitizeColName } from "@/common/sanitizeColName.ts";
import { cn } from "@/common/className.ts";
import { useStickyColumn } from "@/columns/hooks/useStickyColumn.ts";
import { Store } from "@xmod/types.ts";
import { RowData } from "@/row/types.ts";
import { getAddons } from "@xmod/mod.ts";
import { TypeFormat } from "@/datatype/mod.ts";
import { useCellInput } from "@/input/hooks/useCellInput.ts";

interface CellProps {
  store: Store;
  column: string;
  row: RowData;
}

export const Cell = ({ store, column, row }: CellProps) => {
  const addons = getAddons({ store });
  const key = store.getCellKey({ row, column });

  const { isSticky, isStickyLeft, isStickyRight, left, right } =
    useStickyColumn({ store, column });
  const isSelected = store.state.cells.selected?.value?.[key];
  const keyBindings = useCellInput({ store, row, column });

  const classes = addons.columnclasses.string({
    column,
    store,
  });

  return (
    <td
      key={column}
      data-column-name={column}
      tabIndex={0}
      style={{
        width: `var(--col-width-${sanitizeColName(column)})`,
        height: `inherit`,
        left,
        right,
        zIndex: isSticky ? 1 : 0,
        position: isSticky ? "sticky" : undefined,
      }}
      class={cn({
        "vt-cell": true,
        "stick-left": isStickyLeft,
        "stick-right": isStickyRight,
        multifocus: isSelected,
      }) +
        ` ` +
        classes}
      {...keyBindings}
    >
      <div class="vt-cell-wrap" title={row[column]?.toString()}>
        {addons.cellprefixes.render({
          column: column,
          row,
          store,
        })}

        <TypeFormat {...{ store, column, row }} />

        {addons.cellsuffixes?.render({
          column: column,
          row,
          store,
        })}
      </div>
    </td>
  );
};
