import { TableStore } from "@/store/types.ts";
import { MutableRef, useCallback, useEffect, useRef } from "preact/hooks";

const BUFFER_SIZE = 5;

type RowKbProps = {
  store: TableStore;
  tableRef: MutableRef<HTMLTableElement | null>;
  visibleRows: any;
};

export function useTableKb({ store, visibleRows, tableRef }: RowKbProps) {
  const lastFocused = useRef<{ x: number; y: number }>({
    x: 0,
    y: BUFFER_SIZE + 2,
  });

  useEffect(() => {
    const reFocus = setTimeout(() => {
      if (!tableRef.current) return;
      if (store.state.loading.value) return;
      const row = getRowAtIndex(tableRef.current, lastFocused.current.y + 1);
      if (!row) return;
      getCellAtIndex(row, lastFocused.current.x + 1)?.focus();
    }, 500);
    return () => clearTimeout(reFocus);
  }, [visibleRows, store.state.loading.value]);

  const onFocus = useCallback((ev: FocusEvent) => {
    const target = ev.target as HTMLTableCellElement;
    const x = target.cellIndex;
    const y = (target.parentElement as HTMLTableRowElement).rowIndex;
    lastFocused.current = { x, y };
  }, []) as any;

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const target = ev.target as HTMLTableCellElement;
    const x = target.tabIndex;

    switch (ev.key) {
      case "ArrowUp":
        ev.preventDefault();
        getCellAbove(target, x)?.focus();
        break;
      case "ArrowDown":
        ev.preventDefault();
        getCellBelow(target, x)?.focus();
        break;
      case "ArrowLeft":
        ev.preventDefault();
        getPrevCell(target)?.focus();
        break;
      case "ArrowRight":
        ev.preventDefault();
        getNextCell(target)?.focus();
        break;
    }
  }, []) as any;

  return {
    onFocus,
    onKeyDown,
  };
}

function getNextCell(target: HTMLTableCellElement) {
  return target.nextSibling as HTMLTableCellElement;
}

function getPrevCell(target: HTMLTableCellElement) {
  return target.previousSibling as HTMLTableCellElement;
}

function getCellAbove(target: HTMLTableCellElement, x: number) {
  const row = getRowAbove(target);
  if (!row) return;
  return row.querySelector(`td[tabindex="${x}"]`) as HTMLTableCellElement;
}

function getCellBelow(target: HTMLTableCellElement, x: number) {
  const row = getRowBelow(target);
  if (!row) return;
  return row.querySelector(`td[tabindex="${x}"]`) as HTMLTableCellElement;
}

function getRowAbove(target: HTMLTableCellElement) {
  return target.parentNode?.previousSibling as HTMLTableRowElement;
}

function getRowBelow(target: HTMLTableCellElement) {
  return target.parentNode?.nextSibling as HTMLTableRowElement;
}

function getRowAtIndex(table: HTMLTableElement, index: number) {
  return table.querySelector("tbody")?.querySelector(
    `tr:nth-child(${index})`,
  ) as HTMLTableRowElement;
}

function getCellAtIndex(row: HTMLTableRowElement, index: number) {
  return row.querySelector(`td:nth-child(${index})`) as HTMLTableCellElement;
}
