import { useMemo } from "preact/hooks";
import { TableStore } from "@/module/types.ts";
import { useOrderedColumns } from "./useOrderedColumns.ts";
interface StickyColOffset {
  store: TableStore;
}

export function useStickyColOffset({ store }: StickyColOffset) {
  const columns = useOrderedColumns({ store });

  const offsets = useMemo(() => {
    const stickyColumns = store.state.columns.sticky.value;
    const widths = store.state.columns.widths.value;

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
    store.state.columns.widths.value,
    store.state.columns.sticky.value,
    store.state.columns.ordered.value,
    columns,
  ]);
  return offsets;
}

interface StickyColumn {
  store: TableStore;
  column: string;
}

export function useStickyColumn({ store, column }: StickyColumn) {
  const stickyColumns = useStickyColOffset({ store });
  const isStickyLeft = typeof stickyColumns.left[column] === "number";
  const isStickyRight = typeof stickyColumns.right[column] === "number";
  const isSticky = isStickyLeft || isStickyRight;
  const left = isStickyLeft ? stickyColumns.left[column] : undefined;
  const right = isStickyRight ? stickyColumns.right[column] : undefined;
  return {
    isStickyLeft,
    isStickyRight,
    isSticky,
    left,
    right,
  };
}
