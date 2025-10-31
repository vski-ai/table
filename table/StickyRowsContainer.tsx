import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import {
  useColumnResizer,
  useStickyGroupHeaders,
  useTableStyle,
} from "@/hooks/mod.ts";
import { TableStore } from "@/store/types.ts";
import { Row } from "./types.ts";

interface StickyRowsContainerProps {
  store: TableStore;
  visibleRows: Row[];
  renderRow: (row: any, index: number) => preact.ComponentChild;
  top?: number;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  columns: string[];
  scrollContainerRef?: any;
  rowHeights: number[];
}

export const StickyRowsContainer = memo((props: StickyRowsContainerProps) => {
  const {
    store,
    visibleRows,
    columns,
    renderRow,
    top = 0,
    selectable,
    enumerable,
    groupable,
    scrollContainerRef,
    rowHeights,
  } = props;
  const ref = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const mainHead = document.getElementById("vski-table-main-head");
    if (mainHead) {
      ref.current?.prepend(mainHead);
    }
  }, []);
  const {
    getColumnWidth,
  } = useColumnResizer({
    store,
  });
  const { style } = useTableStyle({
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
      style={{ position: "sticky", top: `${top}px`, zIndex: 5 }}
    >
      <table
        class={[
          "vski-table",
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
