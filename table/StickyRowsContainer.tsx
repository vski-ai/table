import { memo } from "preact/compat";
import { VirtualTableViewProps } from "./types.ts";
import { useEffect, useRef } from "preact/hooks";

interface StickyRowsContainerProps {
  stickyHeaders: any[];
  rowHeight: number;
  renderRow: (row: any, index: number) => preact.ComponentChild;
  tableStyle: any;
  top: number;
}

export const StickyRowsContainer = memo((props: StickyRowsContainerProps) => {
  const { stickyHeaders, rowHeight, renderRow, tableStyle, top } = props;
  const ref = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const mainHead = document.getElementById("vski-table-main-head");
    if (mainHead) {
      ref.current?.prepend(mainHead);
    }
  }, []);
  return (
    <div
      style={{ position: "sticky", top: `${top}px`, zIndex: 5 }}
    >
      <table
        class={[
          "vski-table",
          stickyHeaders.length ? "shadow-2xl border-b border-accent/10" : "",
        ].join(" ")}
        style={tableStyle}
        ref={ref}
      >
        <tbody>
          {stickyHeaders.map((header, _) =>
            renderRow(header.row, header.index)
          )}
        </tbody>
      </table>
    </div>
  );
});
