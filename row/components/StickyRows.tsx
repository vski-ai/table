import { CommonRendererCallback } from "@/module/types.ts";
import { TableStore } from "@/module/types.ts";
import { useTableColumnStyle } from "@/columns/hooks/useTableColumnStyle.ts";
import { useRenderRowCallback } from "./Row.tsx";
import { RowPadding } from "./RowPadding.tsx";

interface StickyRowsProps {
  store: TableStore;
}

export const StickyTopRows = ({ store }: StickyRowsProps) => {
  const rows = store.state.rows.sticky_top.value;

  if (!rows.length || !store.state.fetcher.current_data.length) {
    return null;
  }

  const { style } = useTableColumnStyle({ store });

  const renderRow = useRenderRowCallback({
    store,
    rowHeight: store.state.table.row_height.value,
  });

  return (
    <div
      class="vt-sticky-rows-top"
      style={{
        top: store.state.columns.header_height.value, // header heihgt
      }}
    >
      <table style={style} class="vt" x-id={`vt_${store.state.tableId}`}>
        <tbody>
          <RowPadding padding={0} name="top-rows" store={store} />
          {rows.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export const topStickRowsRenderCallback: CommonRendererCallback = (
  { store },
) => {
  return <StickyTopRows store={store} />;
};

export const StickyBottomRows = ({ store }: StickyRowsProps) => {
  const rows = store.state.rows.sticky_bottom.value;

  if (!rows.length || !store.state.fetcher.is_initialized.value) {
    return null;
  }

  const { style } = useTableColumnStyle({ store });

  const renderRow = useRenderRowCallback({
    store,
    rowHeight: 64,
  });

  return (
    <div class="vt-sticky-rows-bottom">
      <table style={style} class="vt" x-id={`vt_${store.state.tableId}`}>
        <tbody>
          <RowPadding padding={0} name="bottom-rows" store={store} />
          {rows.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export const bottomStickRowsRenderCallback: CommonRendererCallback = (
  { store },
) => {
  return <StickyBottomRows store={store} />;
};
