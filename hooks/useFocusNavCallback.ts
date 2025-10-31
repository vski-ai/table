import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { TableStore } from "@/store/types.ts";

interface FocusCallbackProps {
  store: TableStore;
  key: any;
}

export function useFocusNavCallback({ store, key }: FocusCallbackProps) {
  useEffect(() => {
    const { tabIndex, rowIndex } = store.state.focusedCell.value ?? {};
    const cell = document
      .querySelector(`#vski-table-main tr[data-index="${rowIndex}"]`)
      ?.querySelector(`td[tabindex="${tabIndex}"]`) as HTMLTableCellElement;
    cell?.focus();
  }, [store.state.focusedCell.value, key]);

  return useCallback((ev: KeyboardEvent) => {
    const target: HTMLTableCellElement = ev.target as HTMLTableCellElement;
    if (target.tagName !== "TD") {
      return;
    }
    // ev.preventDefault()

    const tabIndex = target.tabIndex;
    const rowIndex = Number(
      (target.parentNode as HTMLTableRowElement)?.dataset.index,
    );

    switch (ev.key) {
      case "ArrowRight":
        store.state.focusedCell.value = {
          tabIndex: tabIndex + 1,
          rowIndex,
        };
        break;
      case "ArrowLeft":
        store.state.focusedCell.value = {
          tabIndex: tabIndex - 1,
          rowIndex,
        };
        break;
      case "ArrowUp":
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: rowIndex - 1,
        };
        break;
      case "ArrowDown":
        store.state.focusedCell.value = {
          tabIndex,
          rowIndex: rowIndex + 1,
        };
        break;
    }
  }, []);
}
