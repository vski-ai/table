import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import {
  GroupCaret,
  GroupLevelLine,
  GroupLinePointer,
  GroupMargin,
} from "@/group/mod.ts";
import { CommandType } from "@/store/mod.ts";
import { RowSorter } from "@/sorting/mod.ts";

export const Row = memo((props) => {
  const {
    row,
    rowIndex,
    isSelected,
    isExpanded,
    rowHeight,
    formatting,
    columns,
    store,
    getColumnWidth,
    tableAddon,
    expandable,
    selectable,
    rowKey,
  } = props;

  const onExpansionToggle = useCallback(() => {
    store.dispatch({
      type: CommandType.ROW_EXPANSION_TOGGLE,
      payload: row[rowKey],
    });
  }, [store, row, rowKey]);

  const onSelectionChange = useCallback((e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    const currentSelectedRows = store.state.selectedRows.value;
    if (checked) {
      store.dispatch({
        type: CommandType.SELECTED_ROWS_SET,
        payload: [...currentSelectedRows, row[rowKey]],
      });
    } else {
      store.dispatch({
        type: CommandType.SELECTED_ROWS_SET,
        payload: currentSelectedRows.filter((id) => id !== row[rowKey]),
      });
    }
  }, [store, row, rowKey]);

  const onDrilldown = useCallback(() => {
    const newDrilldowns = store.state.drilldowns.value.includes(row.id)
      ? store.state.drilldowns.value.filter((id) => id !== row.id)
      : [...store.state.drilldowns.value, row.id];
    store.dispatch({
      type: CommandType.DRILLDOWN_SET,
      payload: newDrilldowns,
    });
  }, [store, row]);

  return (
    <tr
      key={row.id}
      data-index={rowIndex}
      class={[
        "hover:shadow-md",
        isSelected ? "bg-base-200" : "",
        row.$is_group_root ? "vski-table-group-row" : "vski-table-row",
      ].join(" ")}
      style={{
        height: rowHeight,
        "--group-level": row.$group_level ?? 0,
      }}
    >
      {expandable && (
        <td
          class="border border-base-300 align-center text-center p-0"
          style={{ width: "50px" }}
        >
          <button
            type="button"
            class="btn btn-ghost btn-md"
            onClick={onExpansionToggle}
          >
            {isExpanded ? "[-]" : "[+]"}
          </button>
        </td>
      )}
      {selectable && (
        <td
          class="border border-base-300 align-center text-center p-0"
          style={{ width: "50px" }}
        >
          <input
            type="checkbox"
            class="checkbox"
            checked={isSelected}
            onChange={onSelectionChange}
          />
        </td>
      )}

      {store.state.drilldowns && (
        <td
          key="$group_by"
          style={{
            width: `var(--col-width-$group_by)`,
            height: `${rowHeight}px`,
          }}
          class="relative border border-base-300"
        >
          <div class="truncate flex items-center">
            {row.$is_group_root && (
              <>
                <GroupCaret
                  active={store.state.drilldowns.value.includes(
                    row.id,
                  )}
                  size={16}
                  level={row.$group_level}
                />
                <GroupLevelLine
                  level={row.$group_level}
                  height={rowHeight}
                  caretSize={16}
                />
                {row.$group_level !== 0 &&
                  (
                    <GroupLinePointer
                      level={row.$group_level}
                      height={rowHeight - 1}
                    />
                  )}
                <span
                  class="pt-1/2 cursor-pointer"
                  onClick={onDrilldown}
                >
                  <span class="ml-1" />
                  <CellFormatter
                    value={row[row.$group_by]}
                    formatting={formatting?.[row.$group_by]}
                  />
                </span>
              </>
            )}
            {!row.$is_group_root && (
              <div class="truncate">
                <GroupLevelLine
                  level={row.$group_level}
                  height={rowHeight - 1}
                  caretSize={16}
                />
                {row.$group_level !== 0 &&
                  (
                    <GroupLinePointer
                      level={row.$group_level}
                      height={rowHeight - 1}
                    />
                  )}
                <GroupMargin level={row.$group_level} size={16} />
                <CellFormatter
                  value={row[row.$group_by]}
                  formatting={formatting?.[row.$group_by]}
                />
              </div>
            )}
          </div>
        </td>
      )}

      {columns.map((col, colIndex) => {
        const sanitizedCol = col.replace(/[^a-zA-Z0-9]/g, "_");
        return (
          <td
            key={col}
            style={{
              width: `var(--col-width-${sanitizedCol})`,
              height: `${rowHeight}px`,
            }}
            class="border border-base-300 relative"
          >
            <div
              class="truncate"
              title={row[col]}
              style={{
                paddingLeft: row.$is_group_root
                  ? `${row.$level * 20}px`
                  : colIndex === 0
                  ? `${(row.$level) * 20}px`
                  : "0px",
              }}
            >
              <CellFormatter
                value={row[col]}
                formatting={formatting?.[col]}
              />

              {row.$is_group_root && (
                <>
                  <RowSorter
                    style={{
                      top: rowHeight / 2 - 6,
                      width: 12,
                      height: 12,
                    }}
                    className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity p-0 w-3 h-3 btn btn-ghost absolute right-2"
                    activeClassName="!opacity-100 !text-accent"
                    column={col}
                    store={store.state}
                    leafId={row.id}
                  />
                </>
              )}
            </div>
          </td>
        );
      })}
      {tableAddon
        ? (
          <td
            class="border border-base-300 text-center"
            style={{
              padding: 0,
              width: "80px",
            }}
          >
            <button class="btn w-full h-12 border-0 rounded-none opacity-45 hover:opacity-100 transition-opacity">
            </button>
          </td>
        )
        : null}
    </tr>
  );
});
