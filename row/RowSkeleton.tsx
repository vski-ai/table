const cells = new Array(25).fill(0);
const rows = new Array(25).fill(0);
export const RowSkeleton = () => (rows.map(() => (
  <tr>
    {cells.map((_, i) => (
      <td class="vt-cell" key={i} style={{ width: 350 }}>
        <div class="vt-loading"></div>
      </td>
    ))}
  </tr>
)));
