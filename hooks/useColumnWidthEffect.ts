import { useEffect } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { CommandType } from "@/store/mod.ts";

interface ColumnWidthEffectProps {
  store: TableStore;
  columns: string[];
  initialWidth?: number;
}

export function useColumnWidthEffect({
  store,
  columns,
  initialWidth,
}: ColumnWidthEffectProps) {
  useEffect(() => {
    const currentWidths = { ...store.state.columnWidths.peek() };
    let needsUpdate = false;
    const defaultWidth = 250;
    const _columns = [...columns, "$group_by"];
    for (const col of _columns) {
      if (currentWidths[col] !== undefined) continue;
      currentWidths[col] = defaultWidth;
      needsUpdate = true;
    }

    const currentColsInState = Object.keys(currentWidths);

    for (const col of currentColsInState) {
      if (!_columns.includes(col)) {
        delete currentWidths[col];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      store.dispatch({
        type: CommandType.COLUMN_WIDTHS_SET,
        payload: currentWidths,
      });
    }
  }, [columns, initialWidth]);
}
