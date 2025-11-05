import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { CommandType } from "../columns/store.ts";
import { enumCellRenderCallback } from "./EnumeratorCell.tsx";
import { enumColumnRenderCallback } from "./EnumeratorColumn.tsx";

export const enumeratorPlugin = (): ITablePlugin => {
  const onInit: PluginInitCallback = ({
    leftTableCells,
    leftTableHeaders,
    store,
  }) => {
    leftTableHeaders.use(0, enumColumnRenderCallback);
    leftTableCells.use(0, enumCellRenderCallback);
    store.dispatch({
      type: CommandType.COLUMN_WIDTHS_SET,
      payload: {
        $$enumerator$$: 50,
      },
    });
  };

  return {
    name: "enumerator",
    onInit,
  };
};
