import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Row } from "@/table/types.ts";
import { RefObject } from "preact/compat";

interface UseStickyGroupHeadersProps {
  scrollContainerRef?: RefObject<HTMLElement | Window>;
  visibleRows: Row[];
  rowHeights: number[];
  maxLevel?: number;
  expandedLevels?: number[] | string[];
  groupable?: boolean;
}

type IndexedRow = {
  index: number;
  row: Row;
};
interface StickyHeaders {
  [key: number]: IndexedRow;
}

export const useStickyGroupHeaders = (props: UseStickyGroupHeadersProps) => {
  const {
    scrollContainerRef,
    visibleRows,
    rowHeights,
    maxLevel = 2,
    expandedLevels,
    groupable,
  } = props;

  const result = useSignal<IndexedRow[]>([]);

  useEffect(() => {
    if (!groupable) return;

    const scrollContainer = scrollContainerRef?.current as HTMLDivElement ||
      globalThis;
    if (!scrollContainer) return;

    const rowTops = visibleRows.reduce((acc, _, index) => {
      const prevHeight = index > 0
        ? acc[index - 1].top + rowHeights[index - 1]
        : 0;
      acc.push({ top: prevHeight });
      return acc;
    }, [] as { top: number }[]);

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop || globalThis.scrollY;
      const newStickyHeaders: StickyHeaders = {};

      for (let i = 0; i < visibleRows.length; i++) {
        const row = visibleRows[i];
        if (
          row.$is_group_root && row.$group_level! < maxLevel &&
          expandedLevels?.includes(row.id as never) &&
          rowTops[i].top < scrollTop
        ) {
          const level = row.$group_level!;
          if (!newStickyHeaders[level] || i > newStickyHeaders[level].index) {
            newStickyHeaders[level] = { index: i, row: row };
          }
        }
      }
      result.value = Object.values(newStickyHeaders).sort((a, b) =>
        a.index - b.index
      );
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [groupable, visibleRows, rowHeights, maxLevel, expandedLevels]);

  return result;
};
