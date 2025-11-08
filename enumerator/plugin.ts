import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { ColumnWidthCommand } from "../columns/store.ts";
import { enumCellRenderCallback } from "./EnumeratorCell.tsx";
import { enumColumnRenderCallback } from "./EnumeratorColumn.tsx";
import * as store from "./store.ts";

const onInit: PluginInitCallback = ({
  leftTableCells,
  leftTableHeaders,
  store,
}) => {
  leftTableHeaders.use(0, enumColumnRenderCallback);
  leftTableCells.use(0, enumCellRenderCallback);
  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      $$enumerator$$: 58,
    },
  });
};

export const EnumeratorPlugin: ITablePlugin = {
  name: "enumerator",
  store,
  onInit,
};
