import { type RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

// This hook is responsible for calculating the visible range of items in a list with variable heights.
export function useVariableVirtualizer(
  {
    scrollContainerRef,
    itemCount,
    rowHeights,
    buffer = 5,
    spacing = 0,
  }: {
    scrollContainerRef?: RefObject<HTMLElement>;
    itemCount: number;
    rowHeights: number[];
    buffer?: number;
    spacing?: number;
  },
) {
  const [range, setRange] = useState({ startIndex: 0, endIndex: 0 });
  const animationFrameRef = useRef<number>();
  const ignoreScrollEventsRef = useRef(false);
  const ignoreTimeoutRef = useRef<number>();

  const setRangeAndIgnoreScroll = useCallback((newRange: typeof range) => {
    if (
      newRange.startIndex !== range.startIndex ||
      newRange.endIndex !== range.endIndex
    ) {
      setRange(newRange);
      ignoreScrollEventsRef.current = true;
      if (ignoreTimeoutRef.current) {
        clearTimeout(ignoreTimeoutRef.current);
      }
      ignoreTimeoutRef.current = setTimeout(() => {
        ignoreScrollEventsRef.current = false;
      }, 50);
    }
  }, [range]);

  const calculateRange = useCallback(() => {
    const scrollElement = scrollContainerRef?.current;

    const scrollTop = scrollElement
      ? scrollElement.scrollTop
      : globalThis.scrollY;

    const containerHeight = scrollElement
      ? scrollElement.clientHeight
      : globalThis.innerHeight;

    let y = 0;
    let startIndex = 0;
    for (let i = 0; i < itemCount; i++) {
      const height = rowHeights[i] || 0;
      if (y + height > scrollTop) {
        startIndex = i;
        break;
      }
      y += height + spacing;
    }

    let endIndex = startIndex;
    let visibleHeight = 0;
    for (let i = startIndex; i < itemCount; i++) {
      const height = rowHeights[i] || 0;
      visibleHeight += height + spacing;
      endIndex = i;
      if (visibleHeight >= containerHeight) {
        break;
      }
    }

    setRangeAndIgnoreScroll({
      startIndex: Math.max(0, startIndex - buffer),
      endIndex: Math.min(itemCount - 1, endIndex + buffer),
    });
  }, [
    scrollContainerRef?.current,
    itemCount,
    rowHeights,
    buffer,
    spacing,
    setRangeAndIgnoreScroll,
  ]);

  useEffect(() => {
    if (scrollContainerRef?.current) {
      if (scrollContainerRef.current.style) {
        scrollContainerRef.current.style.overflowAnchor = "none";
        scrollContainerRef.current.style.transition = "none";
      }
    }
    const scrollElement = scrollContainerRef?.current || globalThis;

    const handleScroll = (_: Event) => {
      if (ignoreScrollEventsRef.current) {
        return;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(calculateRange);
    };

    calculateRange();

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    globalThis.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollElement.removeEventListener("scroll", handleScroll);
      globalThis.removeEventListener("resize", handleScroll);
    };
  }, [scrollContainerRef?.current, calculateRange]);

  const paddingTop = rowHeights.slice(0, range.startIndex).reduce(
    (sum, height) => sum + height + spacing,
    0,
  );
  const paddingBottom = rowHeights.slice(range.endIndex + 1).reduce(
    (sum, height) => sum + height + spacing,
    0,
  );

  return { ...range, paddingTop, paddingBottom };
}
