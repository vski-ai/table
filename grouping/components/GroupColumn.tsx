import { Column } from "@/columns/mod.ts";
import { ColumnRendererCallback } from "@/plugin/types.ts";

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
