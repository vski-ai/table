import { type RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

// This hook is responsible for calculating the visible range of items in a list with variable heights.
export function useVariableVirtualizer(
  {
    scrollContainerRef,
    tableRef,
    itemCount,
    rowHeights,
    buffer = 5,
  }: {
    scrollContainerRef?: RefObject<HTMLElement>;
    tableRef: RefObject<HTMLTableElement>;
    itemCount: number;
    rowHeights: number[];
    buffer?: number;
  },
) {
  const [range, setRange] = useState({ startIndex: 0, endIndex: 0 });
  const animationFrameRef = useRef<number>();

  const calculateRange = useCallback(() => {
    const scrollElement = scrollContainerRef?.current;
    const tableElement = tableRef.current;

    if (!tableElement) return;

    const scrollTop = scrollElement
      ? scrollElement.scrollTop
      : globalThis.scrollY;

    const containerHeight = scrollElement
      ? scrollElement.clientHeight
      : globalThis.innerHeight;

    const tableTop = tableElement.getBoundingClientRect().top + scrollTop -
      (scrollElement?.getBoundingClientRect().top ?? 0);

    const relativeScrollTop = scrollTop - tableTop;

    let paddingTop = 0;
    let startIndex = 0;
    for (let i = 0; i < itemCount; i++) {
      paddingTop += rowHeights[i];
      if (paddingTop >= relativeScrollTop) {
        startIndex = i;
        break;
      }
    }

    let endIndex = startIndex;
    let visibleHeight = 0;
    for (let i = startIndex; i < itemCount; i++) {
      visibleHeight += rowHeights[i];
      endIndex = i;
      if (visibleHeight >= containerHeight) {
        break;
      }
    }

    setRange({
      startIndex: Math.max(0, startIndex - buffer),
      endIndex: Math.min(itemCount - 1, endIndex + buffer),
    });
  }, [scrollContainerRef, tableRef, itemCount, rowHeights, buffer]);

  useEffect(() => {
    const scrollElement = scrollContainerRef?.current || globalThis;

    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(calculateRange);
    };

    calculateRange(); // Initial calculation

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    globalThis.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollElement.removeEventListener("scroll", handleScroll);
      globalThis.removeEventListener("resize", handleScroll);
    };
  }, [calculateRange, scrollContainerRef]);

  const paddingTop = rowHeights.slice(0, range.startIndex).reduce(
    (sum, height) => sum + height,
    0,
  );
  const paddingBottom = rowHeights.slice(range.endIndex + 1).reduce(
    (sum, height) => sum + height,
    0,
  );

  return { ...range, paddingTop, paddingBottom };
}
