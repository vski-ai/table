import { Column } from "@/columns/components/Column.tsx";
import { ColumnRendererCallback } from "@/module/types.ts";

export const enumColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <Column
      key="__enumerator__"
      column="__enumerator__"
      store={store}
    >
      <div class="text-center">#</div>
    </Column>
  );
};
