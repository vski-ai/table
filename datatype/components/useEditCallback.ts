import { TypeFormatOpts } from "../types.ts";
import { useCallback } from "preact/hooks";
import { RowEditCommand } from "@/editing/store.ts";

export function useEditCallback({ store, column, row }: TypeFormatOpts) {
  const onInput = useCallback((ev: InputEvent) => {
    const value = (ev.target as HTMLTextAreaElement).value.trim();
    const currentRow = store.getCurrentRowValue({ row });
    store.dispatch<RowEditCommand>({
      type: "ROW_EDIT_UPDATE",
      payload: { ...currentRow, [column]: value },
    });
  }, []);

  const value = store.getCurrentCellValue({
    row,
    column,
  });

  return {
    value,
    onInput,
  };
}
