import { ITableModule, ModuleInitCallback } from "@/module/mod.ts";
import { ColumnWidthCommand } from "@/columns/store.ts";
import { enumCellRenderCallback } from "./components/EnumeratorCell.tsx";
import { enumColumnRenderCallback } from "./components/EnumeratorColumn.tsx";
import * as store from "./store.ts";

const onInit: ModuleInitCallback = ({
  lefttablecells,
  lefttableheaders,
  store,
}) => {
  lefttableheaders.use(0, enumColumnRenderCallback);
  lefttablecells.use(0, enumCellRenderCallback);
  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      __enumerator__: 58,
    },
  });
};

export const EnumeratorModule: ITableModule = {
  name: "enumerator",
  dependencies: ["$fetcher"],
  store,
  onInit,
};
