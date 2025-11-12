import { ITablePlugin, PluginInitCallback } from "@/plugin/mod.ts";
import { ColumnWidthCommand } from "@/columns/store.ts";
import { enumCellRenderCallback } from "./components/EnumeratorCell.tsx";
import { enumColumnRenderCallback } from "./components/EnumeratorColumn.tsx";
import * as store from "./store.ts";

const onInit: PluginInitCallback = ({
  lefttablecells,
  lefttableheaders,
  store,
}) => {
  lefttableheaders.use(0, enumColumnRenderCallback);
  lefttablecells.use(0, enumCellRenderCallback);
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
