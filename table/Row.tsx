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
import { Row as RowType } from "./types.ts";
import { CellFormatting } from "@/format/types.ts";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/utils/sanitizeColName.ts";
import { useStickyColOffset } from "@/hooks/useStickyColOffset.ts";

interface RowProps {
  row: RowType;
  rowIndex: number | string;
  isSelected?: boolean;
  isExpanded?: boolean;
  rowKey: string;
  rowHeight: number;
  formatting: Record<string, CellFormatting>;
  columns: string[];
  store: TableStore;
  tableAddon: any;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
}

export const Row = memo((props: RowProps) => {
  const {
    row,
    rowIndex,
    isSelected,
    isExpanded,
    rowHeight,
    formatting,
    columns,
    store,
    tableAddon,
    rowKey,
    expandable,
    selectable,
    groupable,
    enumerable,
  } = props;

  const stickyColumns = useStickyColOffset({
    store,
    columns,
  });

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

  const onLevelToggle = useCallback(() => {
    const newexpandedLevels =
      store.state.expandedLevels.value.includes(row.id as never)
        ? store.state.expandedLevels.value.filter((id) => id !== row.id)
        : [...store.state.expandedLevels.value, row.id];
    store.dispatch({
      type: CommandType.EXPANDED_LEVELS_SET,
      payload: newexpandedLevels,
    });
  }, [store, row]);

  return (
    <tr
      key={row.id}
      data-row-id={row[rowKey]}
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
      {enumerable && (
        <td
          class="vski-table-cell"
          style={{ width: "50px" }}
        >
          <button
            type="button"
            class="btn btn-ghost btn-md"
            onClick={onExpansionToggle}
          >
            {rowIndex}
          </button>
        </td>
      )}
      {expandable && (
        <td
          class="vski-table-cell"
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
          class="vski-table-cell"
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

      {groupable && (
        <td
          key="$group_by"
          data-column-name="$group_by"
          style={{
            width: `var(--col-width-$group_by)`,
            height: `${rowHeight}px`,
          }}
          class="vski-table-group-cell"
        >
          <div class="c-content">
            {row.$is_group_root && (
              <>
                <GroupCaret
                  active={store.state.expandedLevels.value.includes(
                    row.id as never,
                  )}
                  size={16}
                  level={row.$group_level!}
                  onClick={onLevelToggle}
                />
                <GroupLevelLine
                  level={row.$group_level!}
                  height={rowHeight}
                  caretSize={16}
                />
                {row.$group_level !== 0 &&
                  (
                    <GroupLinePointer
                      level={row.$group_level!}
                      height={rowHeight - 1}
                    />
                  )}
                <span
                  class="c-pointer"
                  onClick={onLevelToggle}
                >
                  <span class="ml-1" />
                  <CellFormatter
                    value={row[row.$group_by!]}
                    formatting={formatting?.[row.$group_by!]}
                  />
                </span>
              </>
            )}
            {!row.$is_group_root && (
              <div class="truncate">
                <GroupLevelLine
                  level={row.$group_level!}
                  height={rowHeight - 1}
                  caretSize={16}
                />
                {row.$group_level !== 0 &&
                  (
                    <GroupLinePointer
                      level={row.$group_level!}
                      height={rowHeight - 1}
                    />
                  )}
                <GroupMargin level={row.$group_level!} size={16} />
                <CellFormatter
                  value={row[row.$group_by!]}
                  formatting={formatting?.[row.$group_by!]}
                />
              </div>
            )}
          </div>
        </td>
      )}

      {columns.map((col, colIndex) => {
        const isStickyLeft = typeof stickyColumns.left[col] === "number";
        const isStickyRight = typeof stickyColumns.right[col] === "number";

        return (
          <td
            key={col}
            data-column-name={col}
            style={{
              width: `var(--col-width-${sanitizeColName(col)})`,
              height: `${rowHeight}px`,
              left: isStickyLeft ? stickyColumns.left[col] : undefined,
              right: isStickyRight ? stickyColumns.right[col] : undefined,
              zIndex: isStickyLeft || isStickyRight ? 100 : 0,
              position: isStickyLeft || isStickyRight ? "sticky" : undefined,
            }}
            class={`vski-table-group-cell ${
              isStickyLeft || isStickyRight ? "vski-sticky-col" : ""
            }`}
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
                    className="group-sorter"
                    activeClassName="group-sorter-active"
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
            class="vski-table-group-cell"
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

interface RenderRowCallbackProps {
  store: TableStore;
  rowKey?: string;
  rowHeight: number;
  columns: string[];
  tableAddon: any;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
}

export function useRenderRowCallback({
  store,
  rowHeight,
  columns,
  tableAddon,
  selectable,
  expandable,
  groupable,
  enumerable,
  rowKey = "id",
}: RenderRowCallbackProps) {
  const formatting = store.state.cellFormatting.value;
  const selected = store.state.selectedRows.value;
  const expanded = store.state.expandedRows.value;

  return useCallback((row: RowType, index: number) => {
    const isSelected = selected.includes(
      row[rowKey],
    );
    const isExpanded = expanded.includes(
      row[rowKey],
    );

    return (
      <Row
        row={row}
        rowIndex={index}
        isSelected={isSelected}
        isExpanded={isExpanded}
        selectable={selectable}
        expandable={expandable}
        rowHeight={rowHeight}
        formatting={formatting}
        groupable={groupable}
        enumerable={enumerable}
        columns={columns}
        store={store}
        tableAddon={tableAddon}
        rowKey={rowKey}
      />
    );
  }, [
    selected,
    expanded,
    rowKey,
    rowHeight,
    formatting,
    columns,
    tableAddon,
    expandable,
    selectable,
  ]);
}
