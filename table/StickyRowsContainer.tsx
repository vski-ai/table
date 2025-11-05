import { memo } from "preact/compat";
import { MutableRef, useRef } from "preact/hooks";
import { useStickyGroupHeaders } from "@/hooks/mod.ts";
import { useColumnResizer } from "@/columns/useColumnnResize.ts";
import { TableStore } from "@/store/types.ts";
import { Row } from "./types.ts";
import { useTableStyle } from "./useTableStyle.ts";

interface StickyRowsContainerProps {
  store: TableStore;
  visibleRows: { row: Row | null; index: number }[];
  renderRow: (row: any, index: number) => preact.ComponentChild;
  top?: number;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  columns: string[];
  scrollContainerRef: MutableRef<HTMLElement>;
  rowHeights: number[];
}

export const StickyRowsContainer = memo((props: StickyRowsContainerProps) => {
  const {
    store,
    visibleRows,
    columns,
    renderRow,
    top = 50,
    selectable,
    enumerable,
    groupable,
    scrollContainerRef,
    rowHeights,
  } = props;
  const ref = useRef<HTMLTableElement>(null);
  const {
    getColumnWidth,
  } = useColumnResizer({
    store,
  });
  const { style, totalWidth } = useTableStyle({
    store,
    columns,
    selectable,
    enumerable,
    groupable,
    getColumnWidth,
  });

  const stickyHeaders = useStickyGroupHeaders({
    groupable,
    scrollContainerRef,
    visibleRows,
    rowHeights,
    maxLevel: 2,
    expandedLevels: store.state.expandedLevels.value,
  });
  return (
    <div
      style={{
        position: "sticky",
        top: `${top}px`,
        zIndex: 5,
        width: totalWidth,
      }}
      class="shadow-md bg-accent/5"
    >
      <table
        class={[
          "vt",
          stickyHeaders.value.length
            ? "shadow-md border-b border-accent/10"
            : "",
        ].join(" ")}
        style={style}
        ref={ref}
      >
        <tbody>
          {stickyHeaders.value.map((header, _) =>
            renderRow(header.row, header.index)
          )}
        </tbody>
      </table>
    </div>
  );
});
