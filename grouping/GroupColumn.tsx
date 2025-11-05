import { ColumnHeader } from "@/columns/ColumnHeader.tsx";
import { ColumnRendererCallback } from "@/plugin/types.ts";

export const GroupHeader = ({}) => {
};

export const groupHeaderRenderCallback: ColumnRendererCallback = (
  { store },
) => {
  return (
    <ColumnHeader
      key="$group_by"
      column="$group_by"
      store={store}
    >
      <span>A / B / C</span>
    </ColumnHeader>
  );
};
