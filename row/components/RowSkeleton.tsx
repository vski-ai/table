const cells = new Array(25).fill(0);
const rows = new Array(25).fill(0);
export const RowSkeleton = () =>
  rows.map(() => (
    <tr class="vt-row">
      {cells.map((_, i) => (
        <td class="vt-cell" key={i} style={{ width: 150 }}>
          <div class="vt-loading p-4 m-1"></div>
        </td>
      ))}
    </tr>
  ));
