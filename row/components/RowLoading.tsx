import { useAddons } from "@/module/mod.ts";
import { TableStore } from "@/module/types.ts";

export const RowLoading = (
  { columns, rowHeight, store }: {
    columns: string[];
    rowHeight: number;
    store: TableStore;
  },
) => {
  const adons = useAddons({ store });
  const left = new Array(adons.lefttablecells.size).fill(0);
  const right = new Array(adons.righttablecells.size).fill(0);
  return (
    <tr class="vt-row" style={{ height: rowHeight + "px" }}>
      {}
      {[...left, ...columns, ...right].map(() => (
        <td class="vt-cell placeholder" style={{ height: rowHeight }}>
          <div class="vt-loading p-4 m-2"></div>
        </td>
      ))}
    </tr>
  );
};
