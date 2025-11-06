import { Column } from "../columns/Column.tsx";
import { ColumnRendererCallback } from "@/plugin/types.ts";

export const enumColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <Column
      key="$$enumerator$$"
      column="$$enumerator$$"
      store={store}
    >
      <div class="text-center">#</div>
    </Column>
  );
};
