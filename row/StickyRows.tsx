import { CommonRendererCallback } from "@/plugin/types.ts";
import { TableStore } from "@/store/types.ts";
import { Row } from "./Row.tsx";

interface StickyRowsProps {
  store: TableStore;
}

export const StickyTopRows = ({ store }: StickyRowsProps) => {
  const rows = store.state.stickyTopRows.value;

  if (!rows.length) {
    return null;
  }

  return (
    <div class="vt-sticky-rows-top">
      <table>
        <tbody>
          {rows.map((row, index) => (
            <Row
              row={row}
              rowIndex={index}
              rowHeight={30}
              columns={store.state.orderedColumns.value}
              store={store}
              rowKey={store.state.rowKey.value}
            />
          ))}
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
  const rows = store.state.stickyBottomRows.value;

  if (!rows.length) {
    return null;
  }

  return (
    <div class="vt-sticky-rows-bottom">
      <table>
        <tbody>
          {rows.map((row, index) => (
            <Row
              row={row}
              rowIndex={index}
              rowHeight={30}
              columns={store.state.orderedColumns.value}
              store={store}
              rowKey={store.state.rowKey.value}
            />
          ))}
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
