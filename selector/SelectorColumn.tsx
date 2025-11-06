import { Column } from "../columns/Column.tsx";
import { ColumnRendererCallback } from "@/plugin/types.ts";
import { RowsSelectCommand } from "./store.ts";
import { KEY } from "./constants.ts";

export const selectorColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <Column
      key={KEY}
      column={KEY}
      store={store}
    >
      <input
        type="checkbox"
        class="checkbox"
        checked={false}
        onChange={(e) => {
          if ((e.target as HTMLInputElement).checked) {
            store.dispatch<RowsSelectCommand>({
              type: "SELECTED_ROWS_SET",
              payload: [],
            });
          } else {
            store.dispatch<RowsSelectCommand>({
              type: "SELECTED_ROWS_SET",
              payload: [],
            });
          }
        }}
      />
    </Column>
  );
};
