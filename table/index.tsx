import { useMediaQuery } from "@/hooks/useMediaQuery.ts";
import { CardView } from "./CardView.tsx";
import { TablePlaceholder } from "./TablePlaceholder.tsx";
import { VirtualTableView } from "./VirtualTableView.tsx";
import { VirtualTableViewProps } from "./types.ts";

export function DynamicTable(
  {
    data,
    columns,
    initialWidth,
    columnExtensions,
    columnAction,
    onLoadMore,
    loading,
    rowHeight,
    buffer,
    scrollContainerRef,
    selectedRows,
    rowIdentifier,
    renderExpandedRow,
    expandedRows,
    tableAddon,
    cellFormatting,
    groupStates,
  }: VirtualTableViewProps,
) {
  const isMobile = useMediaQuery("(max-width: 980px)");

  if (loading && (!data || data.length === 0)) {
    return (
      <TablePlaceholder
        columns={columns}
        selectedRows={selectedRows}
        renderExpandedRow={renderExpandedRow}
      />
    );
  }

  if (!data || data.length === 0) {
    return <p>No data to display.</p>;
  }

  if (isMobile.value) {
    return (
      <CardView
        data={data}
        columns={columns}
        onLoadMore={onLoadMore}
        loading={loading}
        selectedRows={selectedRows}
        rowIdentifier={rowIdentifier}
        renderExpandedRow={renderExpandedRow}
        expandedRows={expandedRows}
        rowHeight={rowHeight}
        buffer={buffer}
        scrollContainerRef={scrollContainerRef}
        tableAddon={tableAddon}
        columnAction={columnAction}
        cellFormatting={cellFormatting}
      />
    );
  }

  return (
    <VirtualTableView
      data={data}
      columns={columns}
      initialWidth={initialWidth}
      columnExtensions={columnExtensions}
      onLoadMore={onLoadMore}
      loading={loading}
      rowHeight={rowHeight}
      buffer={buffer}
      scrollContainerRef={scrollContainerRef}
      selectedRows={selectedRows}
      rowIdentifier={rowIdentifier}
      renderExpandedRow={renderExpandedRow}
      expandedRows={expandedRows}
      tableAddon={tableAddon}
      columnAction={columnAction}
      cellFormatting={cellFormatting}
      groupStates={groupStates}
    />
  );
}
