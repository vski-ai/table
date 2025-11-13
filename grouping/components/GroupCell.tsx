import { ComponentChildren } from "preact";
import { GroupCaret } from "./GroupCaret.tsx";
import { GroupLevelLine } from "./GroupLevelLine.tsx";
import { GroupLinePointer } from "./GroupLevelLine.tsx";
import { GroupMargin } from "./GroupMargin.tsx";
import { RowData } from "@/row/types.ts";
import { TableStore } from "@/module/types.ts";
import { CellRendererCallback } from "@/module/mod.ts";
import { useStickyColOffset } from "@/columns/hooks/useStickyColumn.ts";
import { GroupSorter } from "./GroupSorter.tsx";
import { ExpandSetCommand } from "../store.ts";

interface GroupCellProps {
  store: TableStore;
  row: RowData;
  height: number;
  children?: ComponentChildren;
}

export const GroupCell = ({
  row,
  height,
  children,
  store,
}: GroupCellProps) => {
  const onLevelToggle = () => {
    store.dispatch<ExpandSetCommand>({
      type: "EXPANDED_LEVELS_SET",
      payload: row.id.toString(),
    });
    store.shouldReload();
  };

  const key = "$group_by";
  const stickyColumns = useStickyColOffset({ store });
  const levels = store.state.expandedLevels;
  const groupby = store.state.fetcher.table_meta.value?.groupBy || [];
  const nextColInOrder = groupby.at(groupby.indexOf(row.$group_by!) + 1); // because of grouping it's a header of the next level
  const isStickyLeft = typeof stickyColumns.left[key] === "number";

  return (
    <td
      key={key}
      data-column-name="$group_by"
      style={{
        width: `var(--col-width-$group_by)`,
        height: `${height}px`,
        left: isStickyLeft ? stickyColumns.left[key] : undefined,
        zIndex: isStickyLeft ? 1 : 0,
        position: isStickyLeft ? "sticky" : undefined,
      }}
      class={["vt-g-cell", isStickyLeft ? "vt-s-left" : ""].join(" ")}
    >
      <div class="flex justify-between w-full">
        <div class="vt-g-wrap">
          {row.$is_group_root && (
            <>
              <GroupCaret
                active={levels.value.includes(
                  row.id as never,
                )}
                size={16}
                level={row.$group_level!}
                onClick={onLevelToggle}
                height={height}
              />
              <GroupLevelLine
                level={row.$group_level!}
                height={height}
                caretSize={16}
              />
              {row.$group_level !== 0 &&
                (
                  <GroupLinePointer
                    level={row.$group_level!}
                    height={height - 1}
                  />
                )}
              <span
                class="vt-pointer"
                onClick={onLevelToggle}
              >
                <span class="ml-1" />
                {children}
              </span>
            </>
          )}
          {!row.$is_group_root && (
            <div class="truncate">
              <GroupLevelLine
                level={row.$group_level!}
                height={height - 1}
                caretSize={16}
              />
              {row.$group_level !== 0 &&
                (
                  <GroupLinePointer
                    level={row.$group_level!}
                    height={height - 1}
                  />
                )}
              <GroupMargin level={row.$group_level!} size={16} />
              {children}
            </div>
          )}
        </div>
        {nextColInOrder && (
          <span
            style={{ paddingRight: (row.$group_level! * 17) + "px" }}
          >
            <GroupSorter
              store={store}
              column={nextColInOrder}
              row={row}
            />
          </span>
        )}
      </div>
    </td>
  );
};

export const groupCellRenderCallback: CellRendererCallback = ({
  store,
  row,
}) => {
  return (
    <GroupCell
      store={store}
      height={64}
      row={row}
    >
      {row[row.$group_by!]}
    </GroupCell>
  );
};

groupCellRenderCallback.columnName = "$group_by";
