const cells = new Array(25).fill(0);
const rows = new Array(25).fill(0);
export const RowSkeleton = () => (rows.map(() => (
  <tr class="vt-row">
    {cells.map((_, i) => (
      <td class="vt-cell placeholder" key={i} style={{ width: 350 }}>
        <div class="vt-loading p-4 m-2 rounded-none"></div>
      </td>
    ))}
  </tr>
)));
