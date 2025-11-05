import { ColumnHeader } from "@/columns/ColumnHeader.tsx";
import { ColumnRendererCallback } from "@/plugin/types.ts";

export const enumColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <ColumnHeader
      key="$$enumerator$$"
      column="$$enumerator$$"
      store={store}
    >
      <div class="text-center">#</div>
    </ColumnHeader>
  );
};
