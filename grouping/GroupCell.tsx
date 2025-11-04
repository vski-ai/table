import { ComponentChildren } from "preact";
import { GroupCaret } from "./GroupCaret.tsx";
import { GroupLevelLine } from "./GroupLevelLine.tsx";
import { GroupLinePointer } from "./GroupLevelLine.tsx";
import { GroupMargin } from "./GroupMargin.tsx";
import { Row } from "@/table/types.ts";
import { TableStore } from "@/store/types.ts";
import { CommandType } from "./store.ts";
import { CellRendererCallback } from "@/plugin/mod.ts";
import { usePluginContainer } from "@/plugin/usePluginContainer.ts";

interface GroupCellProps {
  store: TableStore;
  row: Row;
  height: number;
  children?: ComponentChildren;
  stickyColumns: { [key: string]: Record<string, number> };
}

export const GroupCell = ({
  row,
  height,
  children,
  store,
  stickyColumns,
}: GroupCellProps) => {
  const onLevelToggle = () => {
    store.dispatch({
      type: CommandType.EXPANDED_LEVELS_SET,
      payload: row.id,
    });
    store.shouldReload();
  };

  const key = "$group_by";

  const levels = store.state.expandedLevels;
  const groupby = store.state.tableMeta.value?.groupby || [];
  const nextColInOrder = groupby.at(groupby.indexOf(row.$group_by!) + 1); // because of grouping it's a header of the next level
  const isStickyLeft = typeof stickyColumns.left[key] === "number";
  const plugins = usePluginContainer({ store });

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
      tabIndex={4}
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
                tabIndex={4}
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
            {plugins.groupHeaderCellSuffixes.render({
              column: nextColInOrder,
              row,
              store,
            })}
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
  return <GroupCell {...{ store, row }} />;
};
