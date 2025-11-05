import { memo } from "preact/compat";
import { useCallback, useMemo } from "preact/hooks";
import { CellFormatter } from "@/format/CellFormatter.tsx";
import { Row as RowType } from "./types.ts";
import { RowLoading } from "./RowLoading.tsx";
import { CellFormatting } from "@/format/types.ts";
import { TableStore } from "@/store/types.ts";
import { sanitizeColName } from "@/utils/sanitizeColName.ts";
import { useStickyColOffset } from "@/columns/mod.ts";
import { PluginContainer } from "../plugin/mod.ts";
import { usePluginContainer } from "../plugin/usePluginContainer.ts";

interface RowProps {
  row: RowType;
  rowIndex: number;
  rowKey: string;
  rowHeight: number;
  formatting: Record<string, CellFormatting>;
  columns: string[];
  store: TableStore;
  plugins: PluginContainer;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
}

export const Row = memo((props: RowProps) => {
  const {
    row,
    rowIndex,
    rowHeight,
    formatting,
    columns,
    store,
    rowKey,
  } = props;

  const plugins = usePluginContainer({ store });
  const height = rowHeight;
  const stickyColumns = useStickyColOffset({ store });
  const tabIndex = plugins.leftTableCells.size + 1;

  const classes = plugins.rowClasses.render({
    row,
    store,
  });

  return (
    <tr
      key={row.id}
      data-row-id={row[rowKey]}
      data-index={rowIndex}
      class={classes.flat().join(" ")}
      style={{
        height: height,
        ...Object.fromEntries(
          plugins.rowStyles.render({
            row,
            store,
          }).flat(1),
        ),
      }}
    >
      {plugins.leftTableCells.render({
        column: "",
        store,
        row,
        rowIndex,
      })}

      {columns.map((col, colIndex) => {
        const isStickyLeft = typeof stickyColumns.left[col] === "number";
        const isStickyRight = typeof stickyColumns.right[col] === "number";
        return (
          <td
            key={col}
            data-column-name={col}
            tabIndex={colIndex + tabIndex}
            style={{
              width: `var(--col-width-${sanitizeColName(col)})`,
              height: `${height}px`,
              left: isStickyLeft ? stickyColumns.left[col] : undefined,
              right: isStickyRight ? stickyColumns.right[col] : undefined,
              zIndex: isStickyLeft || isStickyRight ? 1 : 0,
              position: isStickyLeft || isStickyRight ? "sticky" : undefined,
            }}
            class={`vt-g-cell ${isStickyLeft ? "vt-s-left" : ""} ${
              isStickyRight ? "vt-s-right" : ""
            }`}
          >
            <div
              class="truncate flex w-full items-center justify-between"
              title={row[col]}
              style={{
                paddingLeft: row.$is_group_root
                  ? `${row.$level * 20}px`
                  : colIndex === 0
                  ? `${(row.$level) * 20}px`
                  : "0px",
              }}
            >
              {row.$is_group_root && (
                <>
                  {plugins.cellPrefixes.render({
                    column: col,
                    row,
                    store,
                  })}
                </>
              )}
              <CellFormatter
                value={row[col]}
                formatting={formatting?.[col]}
              />
              {row.$is_group_root && (
                <>
                  {plugins.cellSuffixes?.render({
                    column: col,
                    row,
                    store,
                  })}
                </>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
});

interface RenderRowCallbackProps {
  store: TableStore;
  rowKey?: string;
  getRowHeight: (row: RowType) => number;
  columns: string[];
  plugins: PluginContainer;
}

export function useRenderRowCallback({
  store,
  getRowHeight,
  columns,
  plugins,
  rowKey = "id",
}: RenderRowCallbackProps) {
  const formatting = store.state.cellFormatting.value;

  return useCallback((row: RowType, index: number) => {
    const rowHeight = getRowHeight(row);
    if (row.$loading) {
      return <RowLoading columns={columns} rowHeight={rowHeight} />;
    }

    return (
      <Row
        row={row}
        rowIndex={index}
        rowHeight={rowHeight}
        formatting={formatting}
        columns={columns}
        store={store}
        plugins={plugins}
        rowKey={rowKey}
      />
    );
  }, [
    rowKey,
    getRowHeight,
    formatting,
    columns,
  ]);
}
