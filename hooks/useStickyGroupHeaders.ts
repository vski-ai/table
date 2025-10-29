import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface UseStickyGroupHeadersProps {
  scrollContainerRef?: any;
  shownRows: any[];
  rowHeights: number[];
  maxLevel?: number;
  drilldowns: any[];
}

export const useStickyGroupHeaders = (props: UseStickyGroupHeadersProps) => {
  const {
    scrollContainerRef,
    shownRows,
    rowHeights,
    maxLevel = 2,
    drilldowns,
  } = props;
  const stickyHeaders = useSignal<any[]>([]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current || globalThis;
    if (!scrollContainer) return;

    const rowTops = shownRows.reduce((acc, row, index) => {
      const prevHeight = index > 0
        ? acc[index - 1].top + rowHeights[index - 1]
        : 0;
      acc.push({ top: prevHeight });
      return acc;
    }, [] as { top: number }[]);

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop || globalThis.scrollY;
      const newStickyHeaders: any = {};

      for (let i = 0; i < shownRows.length; i++) {
        const row = shownRows[i];
        if (
          row.$is_group_root && row.$group_level < maxLevel &&
          drilldowns.includes(row.id) && rowTops[i].top < scrollTop
        ) {
          const level = row.$group_level;
          if (!newStickyHeaders[level] || i > newStickyHeaders[level].index) {
            newStickyHeaders[level] = { index: i, row: row };
          }
        }
      }
      stickyHeaders.value = Object.values(newStickyHeaders).sort((a, b) =>
        a.index - b.index
      );
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [shownRows, rowHeights, maxLevel, drilldowns]);

  return stickyHeaders;
};
