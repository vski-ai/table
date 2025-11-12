import { Column } from "@/columns/mod.ts";
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
