export const RowLoading = (
  { columns, rowHeight }: { columns: string[]; rowHeight: number },
) => {
  return (
    <tr class="vt-loading" style={{ height: rowHeight + "px" }}>
      {columns.map(() => (
        <td class="vt-cell" style={{ height: rowHeight }}>
          <div class="vt-loading"></div>
        </td>
      ))}
    </tr>
  );
};
