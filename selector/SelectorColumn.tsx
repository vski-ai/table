import { ColumnHeader } from "@/columns/ColumnHeader.tsx";
import { ColumnRendererCallback } from "@/plugin/types.ts";
import { CommandType } from "./store.ts";
import { KEY } from "./constants.ts";

export const selectorColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <ColumnHeader
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
            store.dispatch({
              type: CommandType.SELECTED_ROWS_SET,
              payload: [],
            });
          } else {
            store.dispatch({
              type: CommandType.SELECTED_ROWS_SET,
              payload: [],
            });
          }
        }}
      />
    </ColumnHeader>
  );
};
