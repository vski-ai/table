export const RowLoading = (
  { columns, rowHeight }: { columns: string[]; rowHeight: number },
) => {
  return (
    <tr class="vt-row" style={{ height: rowHeight + "px" }}>
      {columns.map(() => (
        <td class="vt-cell placeholder" style={{ height: rowHeight }}>
          <div class="vt-loading"></div>
        </td>
      ))}
    </tr>
  );
};
