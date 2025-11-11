import { TableStore } from "@/store/types.ts";
import { MutableRef, useCallback, useEffect, useRef } from "preact/hooks";
import { CellSelectResetCmd } from "@/cell/store.ts";

const BUFFER_SIZE = 5;

type RowKbProps = {
  store: TableStore;
  tableRef: MutableRef<HTMLTableElement | null>;
};

export function useTableKb({ store, tableRef }: RowKbProps) {
  const lastFocused = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const setAltKey = (ev: KeyboardEvent) => {
      if (ev.altKey) {
        store.state.keyboard.altKey.value = true;
      }
      if (ev.key === "Escape") {
        store.dispatch<CellSelectResetCmd>({
          type: "CELL_SELECT_RESET",
          payload: true,
        });
      }
    };
    const unSetAltKey = (ev: KeyboardEvent) => {
      if (!ev.altKey) {
        store.state.keyboard.altKey.value = false;
      }
    };
    globalThis.addEventListener("keydown", setAltKey);
    globalThis.addEventListener("keyup", unSetAltKey);
    return () => {
      globalThis.removeEventListener("keydown", setAltKey);
      globalThis.removeEventListener("keyup", unSetAltKey);
    };
  });

  useEffect(() => {
    const keyIntercept = () => {
      if (document.activeElement === document.body) {
        tableRef.current?.focus();
      }
    };
    globalThis.addEventListener("keyup", keyIntercept);
    return () => {
      globalThis.removeEventListener("keyup", keyIntercept);
    };
  }, [tableRef.current]);

  const onFocus = useCallback((ev: FocusEvent) => {
    const target = ev.target as HTMLTableCellElement;
    if (target.tagName !== "TD") {
      return;
    }
    const x = target.cellIndex;
    const y = (target.parentElement as HTMLTableRowElement).rowIndex;
    lastFocused.current = { x, y };
  }, []) as any;

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const target = ev.target as HTMLTableCellElement;
    if (target.tagName !== "TD") {
      getCellAtXY(tableRef.current!, 1, BUFFER_SIZE + 3)?.focus();
      return;
    }

    const x = target.cellIndex;
    switch (ev.key) {
      case "ArrowUp":
        ev.preventDefault();
        getCellAbove(target, x + 1)?.focus();
        break;
      case "ArrowDown":
        ev.preventDefault();
        getCellBelow(target, x + 1)?.focus();
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
  return getCellAtIndex(row, x) as HTMLTableCellElement;
}

function getCellBelow(target: HTMLTableCellElement, x: number) {
  const row = getRowBelow(target);
  if (!row) return;
  return getCellAtIndex(row, x);
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

function getCellAtXY(table: HTMLTableElement, x: number, y: number) {
  const row = getRowAtIndex(table, y);
  if (!row) return;
  return getCellAtIndex(row, x);
}
