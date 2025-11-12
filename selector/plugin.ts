import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { ColumnWidthCommand } from "@/columns/store.ts";
import { selectorCellRenderCallback } from "./components/SelectorCell.tsx";
import { selectorColumnRenderCallback } from "./components/SelectorColumn.tsx";
import { KEY } from "./constants.ts";
import * as store from "./store.ts";

const onInit: PluginInitCallback = ({
  lefttablecells,
  lefttableheaders,
  rowclasses,
  store,
}) => {
  lefttableheaders.use(1, selectorColumnRenderCallback);
  lefttablecells.use(1, selectorCellRenderCallback);
  rowclasses.use(1, ({ row, store, rowKey }) => {
    return [
      store.state.selectedRows.value.includes(row?.[rowKey ?? ""]!)
        ? "selected"
        : "",
    ];
  });
  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      [KEY]: 58,
    },
  });
};

export const SelectorPlugin: ITablePlugin = {
  name: "selector",
  store,
  onInit,
};
