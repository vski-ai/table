import { Column } from "@/columns/components/Column.tsx";
import { ColumnRendererCallback } from "@/module/types.ts";
import { RowsSelectCommand } from "../store.ts";
import { KEY } from "../constants.ts";

export const selectorColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <Column
      key={KEY}
      column={KEY}
      store={store}
    >
      <div class="vt-select w-full -ml-0 text-center">
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
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
      </div>
    </Column>
  );
};
