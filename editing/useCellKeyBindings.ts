import { useCallback } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { RowData } from "@/row/types.ts";
import { CellEditingSetCommand } from "./store.ts";

type CellKeyBindingsProps = {
  store: TableStore;
  row: RowData;
  column: string;
};

export function useCellKeyBingins(
  { store, row, column }: CellKeyBindingsProps,
) {
  const key = store.getCellKey({ row, column });

  const setEditing = useCallback(() => {
    store.dispatch<CellEditingSetCommand>({
      type: "CELL_EDITING_SET",
      payload: {
        [key]: true,
      },
    });
  }, [key]);

  const unSetEditing = useCallback(() => {
    store.state.cellEditing.value = {};
  }, [key]);

  const isNavigationUnfocus = useCallback((ev: KeyboardEvent) => {
    const isEditing = !!store.state.cellEditing.value[key];
    if (ev.ctrlKey && ev.key !== "Control" && isEditing) {
      ev.preventDefault();
      return true;
    }
  }, [key]);

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    const isEditing = !!store.state.cellEditing.value[key];
    const unfocus = isNavigationUnfocus(ev);
    if (unfocus) {
      setTimeout(unSetEditing, 200);
      return;
    } else if (isEditing) {
      ev.stopPropagation();
    }

    switch (ev.key) {
      case "Escape": {
        ev.stopPropagation();
        ev.preventDefault();
        unSetEditing();
        break;
      }
      case "Enter": {
        ev.stopPropagation();
        ev.preventDefault();
        setEditing();
        break;
      }
    }
  }, []);

  const onDblClick = useCallback(() => {
    setEditing();
  }, []);

  return {
    onKeyDown,
    onDblClick,
  };
}
