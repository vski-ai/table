import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { RefObject } from "preact/compat";

interface FocusCallbackProps {
  store: TableStore;
  startIndex: number;
  endIndex: number;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  key: any;
}

export function useFocusNavCallback({
  store,
  scrollContainerRef,
  startIndex,
  endIndex,
  key,
}: FocusCallbackProps) {
  const preventScroll = useSignal(true);
  const visibleStart = startIndex > 5 ? startIndex + 5 : startIndex;
  const visibleEnd = endIndex;

  const getCell = useCallback((index: number, tabIndex: number) => {
    return document
      .querySelector(`#vski-table-main tr[data-index="${index}"]`)
      ?.querySelector(`td[tabindex="${tabIndex}"]`) as HTMLTableCellElement;
  }, []);

  useEffect(() => {
    const { rowIndex, tabIndex } = store.state.focusedCell.value! ?? {};
    const cell = getCell(rowIndex, tabIndex);
    cell?.focus({ preventScroll: preventScroll.value });

    preventScroll.value = true;
  }, [store.state.focusedCell.value, key, endIndex, startIndex]);

  return useCallback((ev: KeyboardEvent) => {
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
        store.state.focusedCell.value = {
          tabIndex: tabIndex + 1,
          rowIndex,
        };
        break;
      case "ArrowLeft":
        ev.preventDefault();
        store.state.focusedCell.value = {
          tabIndex: tabIndex - 1,
          rowIndex,
        };
        break;
      case "ArrowUp":
        ev.preventDefault();
        preventScroll.value = false;
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: rowIndex - 1 < visibleStart ? visibleStart : rowIndex - 1,
        };
        break;
      case "ArrowDown":
        ev.preventDefault();
        preventScroll.value = false;
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: rowIndex + 1 > visibleEnd ? visibleEnd : rowIndex + 1,
        };
        break;
    }
  }, [startIndex, endIndex]);
}
