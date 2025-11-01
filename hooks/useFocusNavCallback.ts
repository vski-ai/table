import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { RefObject } from "preact/compat";

interface FocusCallbackProps {
  store: TableStore;
  startIndex: number;
  endIndex: number;
  key: any;
  scrollContainerRef: RefObject<HTMLElement>;
  rowHeights: number[];
}

export function useFocusNavCallback(
  {
    store,
    startIndex,
    endIndex,
    key,
    scrollContainerRef,
    rowHeights,
  }: FocusCallbackProps,
) {
  const preventScroll = useSignal(true);
  const isKeyHeldDown = useRef(false);
  const scrollTimeout = useRef<number | null>(null);
  const lastScrollTop = useRef(0);

  const getCell = useCallback((index: number, tabIndex: number) => {
    return document
      .querySelector(`#vt-main tr[data-index="${index}"]`)
      ?.querySelector(`td[tabindex="${tabIndex}"]`) as HTMLTableCellElement;
  }, []);

  useEffect(() => {
    const { rowIndex, tabIndex } = store.state.focusedCell.value! ?? {};
    const cell = getCell(rowIndex, tabIndex);
    cell?.focus({ preventScroll: preventScroll.value });

    preventScroll.value = true;
  }, [store.state.focusedCell.value, key, endIndex, startIndex]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (!isKeyHeldDown.current) return;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const currentScrollTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;

        if (currentScrollTop === lastScrollTop.current) return;

        const scrollDirection = currentScrollTop > lastScrollTop.current
          ? "down"
          : "up";

        let y = 0;
        let firstVisibleIndex = 0;
        for (let i = 0; i < rowHeights.length; i++) {
          const height = rowHeights[i] || 0;
          if (y + height >= currentScrollTop) {
            firstVisibleIndex = i;
            break;
          }
          y += height;
        }

        let lastVisibleY = y;
        let lastVisibleIndex = firstVisibleIndex;
        for (let i = firstVisibleIndex; i < rowHeights.length; i++) {
          const height = rowHeights[i] || 0;
          if (lastVisibleY + height > currentScrollTop + containerHeight) {
            break;
          }
          lastVisibleIndex = i;
          lastVisibleY += height;
        }

        const { tabIndex } = store.state.focusedCell.value! ?? { tabIndex: 0 };

        let newRowIndex: number;
        if (scrollDirection === "down") {
          newRowIndex = lastVisibleIndex;
        } else {
          newRowIndex = firstVisibleIndex;
        }

        if (store.state.focusedCell.value?.rowIndex !== newRowIndex) {
          preventScroll.value = true;
          store.state.focusedCell.value = {
            rowIndex: newRowIndex,
            tabIndex,
          };
        }
      }, 100);
    };

    scrollContainer.addEventListener("scrollend", handleScroll);
    return () => scrollContainer.removeEventListener("scrollend", handleScroll);
  }, [scrollContainerRef.current, rowHeights, store]);

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
      isKeyHeldDown.current = true;
      lastScrollTop.current = scrollContainerRef.current!.scrollTop;
    }

    const target: HTMLTableCellElement = ev.target as HTMLTableCellElement;
    if (target.tagName !== "TD") {
      return;
    }

    const tabIndex = target.tabIndex;
    const rowIndex = Number(
      (target.parentNode as HTMLTableRowElement)?.dataset.index,
    );

    switch (ev.key) {
      case "ArrowRight":
        ev.preventDefault();
        preventScroll.value = false;
        store.state.focusedCell.value = {
          tabIndex: tabIndex + 1,
          rowIndex,
        };
        break;
      case "ArrowLeft":
        ev.preventDefault();
        preventScroll.value = false;
        store.state.focusedCell.value = {
          tabIndex: tabIndex - 1,
          rowIndex,
        };
        break;
      case "ArrowUp": {
        ev.preventDefault();
        const nextRowIndex = rowIndex - 1;
        if (nextRowIndex < 0) return;

        const itemTop = rowHeights.slice(0, nextRowIndex).reduce(
          (a, b) => a + b,
          0,
        );
        const currentScrollTop = scrollContainerRef.current!.scrollTop;

        if (itemTop < currentScrollTop) {
          scrollContainerRef.current?.scrollTo({ top: itemTop });
        }

        preventScroll.value = true;
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: nextRowIndex,
        };
        break;
      }
      case "ArrowDown": {
        ev.preventDefault();
        const nextRowIndex = rowIndex + 1;
        if (nextRowIndex >= rowHeights.length) return;

        const itemTop = rowHeights.slice(0, nextRowIndex).reduce(
          (a, b) => a + b,
          0,
        );
        const itemHeight = rowHeights[nextRowIndex];
        const containerHeight = scrollContainerRef.current!.clientHeight;
        const currentScrollTop = scrollContainerRef.current!.scrollTop;

        if (itemTop + itemHeight > currentScrollTop + containerHeight) {
          const newScrollTop = itemTop + itemHeight - containerHeight;
          scrollContainerRef.current?.scrollTo({ top: newScrollTop });
          return;
        }

        preventScroll.value = true;
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: nextRowIndex,
        };
        break;
      }
    }
  }, [startIndex, endIndex, scrollContainerRef, rowHeights]);

  const onKeyUp = useCallback((ev: KeyboardEvent) => {
    if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
      isKeyHeldDown.current = false;
    }
  }, []);

  return { onKeyDown, onKeyUp };
}
