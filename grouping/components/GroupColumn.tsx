import { Column } from "@/columns/components/Column.tsx";
import { ColumnRendererCallback } from "@/module/types.ts";

export const groupColumnRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <Column
      key="$group_by"
      column="$group_by"
      store={store}
    >
      <span>A / B / C</span>
    </Column>
  );
};
