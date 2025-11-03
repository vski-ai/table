export const RowLoading = (
  { columns, rowHeight }: { columns: string[]; rowHeight: number },
) => {
  return (
    <tr class="vt-loading" style={{ height: rowHeight + "px" }}>
      {columns.map(() => (
        <td style={{ height: rowHeight }}>
          <div class="skeleton h-8"></div>
        </td>
      ))}
    </tr>
  );
};
