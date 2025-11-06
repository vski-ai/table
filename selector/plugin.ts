import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { CommandType } from "../columns/store.ts";
import { selectorCellRenderCallback } from "./SelectorCell.tsx";
import { selectorColumnRenderCallback } from "./SelectorColumn.tsx";
import { KEY } from "./constants.ts";

const onInit: PluginInitCallback = ({
  leftTableCells,
  leftTableHeaders,
  rowClasses,
  store,
}) => {
  leftTableHeaders.use(1, selectorColumnRenderCallback);
  leftTableCells.use(1, selectorCellRenderCallback);
  rowClasses.use(1, ({ row, store, rowKey }) => {
    return [
      store.state.selectedRows.value.includes(row?.[rowKey ?? ""]!)
        ? "bg-accent/25"
        : "",
    ];
  });
  store.dispatch({
    type: CommandType.COLUMN_WIDTHS_SET,
    payload: {
      [KEY]: 50,
    },
  });
};

export const SelectorPlugin: ITablePlugin = {
  name: "selector",
  onInit,
};
