export const renderSkeleton = () => {
  return (
    <tr>
      {new Array(30).fill(0).map((_, i) => (
        <th class="vt-col col-loading" key={i} style={{ width: 150 }}>
          <div class="vt-header-skeleton"></div>
        </th>
      ))}
    </tr>
  );
};
