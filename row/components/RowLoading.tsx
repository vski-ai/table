import { useAddons } from "@/module/mod.ts";
import { TableStore } from "@/module/types.ts";

export const RowLoading = ({
  columns,
  rowHeight,
  store,
}: {
  columns: string[];
  rowHeight: number;
  store: TableStore;
}) => {
  const adons = useAddons({ store });
  const left = new Array(adons.lefttableheaders.size).fill(0);
  const right = new Array(adons.righttableheaders.size).fill(0);
  const cols = new Array(
    columns.length * (adons.beforeheaders.size + adons.beforeheaders.size + 1),
  ).fill(0);
  return (
    <tr class="vt-row" style={{ height: rowHeight + "px" }}>
      {[...left, ...cols, ...right].map(() => (
        <td class="vt-cell" style={{ height: rowHeight }}>
          <div class="vt-loading"></div>
        </td>
      ))}
    </tr>
  );
};
