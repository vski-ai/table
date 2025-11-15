import { useCallback, useRef } from "preact/hooks";
import { TableStore } from "@/module/types.ts";
import { RowData } from "@/row/types.ts";
import { CellEditingSetCommand } from "@/editing/store.ts";
import { CellDeselectCmd, CellSelectCmd } from "@/cell/store.ts";

type CellKeyBindingsProps = {
  store: TableStore;
  row: RowData;
  column: string;
};

export function useCellKb(
  { store, row, column }: CellKeyBindingsProps,
) {
  const key = store.getCellKey({ row, column });
  const isEditing = !!store.state.editing.cell.value[key];

  const setEditing = useCallback(() => {
    store.dispatch<CellEditingSetCommand>({
      type: "CELL_EDITING_SET",
      payload: {
        [key]: true,
      },
    });
  }, [key]);

  const unSetEditing = useCallback(() => {
    store.dispatch<CellEditingSetCommand>({
      type: "CELL_EDITING_SET",
      payload: {
        [key]: false,
      },
    });
  }, [key]);

  const isNavigationUnfocus = useCallback((ev: KeyboardEvent) => {
    if (ev.metaKey && ev.key !== "Meta" && isEditing) {
      ev.preventDefault();
      return true;
    }
    if (ev.ctrlKey && ev.key !== "Control" && isEditing) {
      ev.preventDefault();
      return true;
    }
  }, [key, isEditing]);

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const unfocus = isNavigationUnfocus(ev);
    if (unfocus) {
      setTimeout(unSetEditing, 0);
      return;
    }

    if (!isEditing) {
      if (ev.key === "Enter") {
        ev.stopPropagation();
        ev.preventDefault();
        setEditing();
      }
      return;
    }

    ev.stopPropagation();

    switch (ev.key) {
      case "Escape": {
        ev.stopPropagation();
        ev.preventDefault();
        unSetEditing();
        focusTarget.current?.focus();
        break;
      }
      case "Tab": {
        unSetEditing();
        break;
      }
    }
  }, [isEditing]) as any;

  const onDblClick = useCallback(() => {
    setEditing();
  }, [isEditing]) as any;

  const onClick = useCallback(() => {
    const values = Object.values(store.state.editing.cell.value);
    if (values.length && values.every(Boolean)) {
      setEditing();
    }
    if (store.state.keyboard.metaKey.value) {
      store.dispatch<CellDeselectCmd>({
        type: "CELL_DESELECT",
        payload: key,
      });
    }
    if (store.state.keyboard.altKey.value) {
      store.dispatch<CellSelectCmd>({
        type: "CELL_SELECT",
        payload: key,
      });
    }
  }, [store.state.editing.cell.value, store.state.keyboard.metaKey.value]);

  const focusTarget = useRef<HTMLTableCellElement>(null);
  const onBlur = useCallback((e: KeyboardEvent) => {
    focusTarget.current = e.target as HTMLTableCellElement; // tricky part: so we have to return focus when we cancel edit
    e.preventDefault();
    if (store.state.keyboard.altKey.value) {
      store.dispatch<CellSelectCmd>({
        type: "CELL_SELECT",
        payload: key,
      });
    }
    if (store.state.keyboard.metaKey.value) {
      store.dispatch<CellDeselectCmd>({
        type: "CELL_DESELECT",
        payload: key,
      });
    }
  }, [
    store.state.keyboard.altKey.value,
    store.state.keyboard.metaKey.value,
  ]) as any;

  const onFocus = useCallback(() => {
    if (store.state.keyboard.altKey.value) {
      store.dispatch<CellSelectCmd>({
        type: "CELL_SELECT",
        payload: key,
      });
    }
    if (store.state.keyboard.metaKey.value) {
      store.dispatch<CellDeselectCmd>({
        type: "CELL_DESELECT",
        payload: key,
      });
    }
  }, [
    store.state.keyboard.altKey.value,
    store.state.keyboard.metaKey.value,
  ]) as any;

  return {
    onKeyDown,
    onDblClick,
    onBlur,
    onFocus,
    onClick,
  };
}
