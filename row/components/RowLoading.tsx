import type { Store } from "@xmod/types.ts";
import { getAddons } from "@xmod/mod.ts";
import { mapAddons } from "../hooks/mapAddons.ts";

export const RowLoading = ({
  columns,
  rowHeight,
  store,
}: {
  columns: string[];
  rowHeight: number;
  store: Store;
}) => {
  const { lefttableheaders, righttableheaders, beforeheaders } = getAddons({
    store,
  });
  const cols = new Array(
    columns.length * (beforeheaders.size + beforeheaders.size + 1),
  ).fill(0);
  return (
    <tr class="vt-row" style={{ height: rowHeight + "px" }}>
      {lefttableheaders
        .render({ store, column: "" })
        .map(mapAddons)}
      {cols.map(() => (
        <td class="vt-cell" style={{ height: rowHeight }}>
          <div class="vt-loading"></div>
        </td>
      ))}
      {righttableheaders
        .render({ store, column: "" })
        .map(mapAddons)}
    </tr>
  );
};
