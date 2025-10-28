import { useMediaQuery } from "@/hooks/useMediaQuery.ts";
import { CardView } from "./CardView.tsx";
import { TablePlaceholder } from "./TablePlaceholder.tsx";
import { VirtualTableView } from "./VirtualTableView.tsx";
import { VirtualTableViewProps } from "./types.ts";

export function DynamicTable(props: VirtualTableViewProps) {
  const {
    data,
    columns,
    store,
    initialWidth,
    columnExtensions,
    columnAction,
    onLoadMore,
    rowHeight,
    buffer,
    scrollContainerRef,
    rowIdentifier,
    tableAddon,
  } = props;
  const isMobile = useMediaQuery("(max-width: 980px)");
  store.state.isMobile.value = isMobile.value;

  const filteredColumns = columns.filter(
    (col) =>
      !["$group_by", "$group_level", "$parent_id", "$is_group_root"].includes(
        col,
      ),
  );

  if (store.state.loading.value && (!data || data.length === 0)) {
    return (
      <TablePlaceholder
        columns={filteredColumns}
        selectedRows={store.state.selectedRows}
        renderExpand={props.expandable ? props.renderExpand : undefined}
      />
    );
  }

  if (!data || data.length === 0) {
    return <p>No data to display.</p>;
  }

  if (isMobile.value) {
    return (
      <CardView
        {...props}
        columns={filteredColumns}
      />
    );
  }

  return (
    <VirtualTableView
      {...props}
      columns={filteredColumns}
    />
  );
}
