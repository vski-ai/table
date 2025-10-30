import { useMemo } from "preact/hooks";
import { StickyPosition, TableStore } from "@/store/types.ts";

interface StickyColOffset {
  store: TableStore;
  columns: string[];
}

export function useStickyColOffset({ store, columns }: StickyColOffset) {
  const offsets = useMemo(() => {
    const stickyColumns = store.state.stickyColumns.value;
    const widths = store.state.columnWidths.value;

    const leftOffsets: Record<string, number> = {};
    let currentLeftOffset = 0;
    for (const col of columns) {
      if (stickyColumns[col] === "left") {
        leftOffsets[col] = currentLeftOffset;
        currentLeftOffset += widths[col] ?? 0;
      }
    }

    const rightOffsets: Record<string, number> = {};
    let currentRightOffset = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (stickyColumns[col] === "right") {
        rightOffsets[col] = currentRightOffset;
        currentRightOffset += widths[col] ?? 0;
      }
    }

    return { left: leftOffsets, right: rightOffsets };
  }, [
    store.state.columnWidths.value,
    store.state.stickyColumns.value,
    columns,
  ]);
  return offsets;
}
