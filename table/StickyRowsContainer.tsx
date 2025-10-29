import { memo } from "preact/compat";
import { VirtualTableViewProps } from "./types.ts";

interface StickyRowsContainerProps {
  stickyHeaders: any[];
  rowHeight: number;
  renderRow: (row: any, index: number) => preact.ComponentChild;
  tableStyle: any;
  top: number;
}

export const StickyRowsContainer = memo((props: StickyRowsContainerProps) => {
  const { stickyHeaders, rowHeight, renderRow, tableStyle, top } = props;

  return (
    <div
      class={stickyHeaders.length ? "shadow-2xl border-b border-accent/10" : ""}
      style={{ position: "sticky", top: `${top}px`, zIndex: 5 }}
    >
      <table
        class="vski-table"
        style={tableStyle}
      >
        <tbody>
          {stickyHeaders.map((header, index) =>
            renderRow(header.row, header.index)
          )}
        </tbody>
      </table>
    </div>
  );
});
