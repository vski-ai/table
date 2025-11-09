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
  const isEditing = !!store.state.cellEditing.value[key];

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
        break;
      }
      case "Tab": {
        unSetEditing();
        break;
      }
    }
  }, [isEditing]);

  const onDblClick = useCallback(() => {
    setEditing();
  }, [isEditing]);

  return {
    onKeyDown,
    onDblClick,
  };
}
