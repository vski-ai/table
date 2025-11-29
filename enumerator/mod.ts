import { BeforeInitCallback, ModuleInitCallback, XModule } from "@xmod/mod.ts";
import { ColumnWidthCommand } from "@/columns/store.ts";
import { enumCellRenderCallback } from "./components/Cell.tsx";
import { enumColumnRenderCallback } from "./components/Column.tsx";
import * as store from "./store.ts";

const beforeInit: BeforeInitCallback = ({
  row,
  header,
}) => {
  header.left.use(enumColumnRenderCallback);
  row.left.use(enumCellRenderCallback);
};

const afterInit: ModuleInitCallback = ({ store }) => {
  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      __enumerator__: 58,
    },
  });
};

export const EnumeratorModule: XModule = {
  name: "enumerator",
  dependencies: ["fetcher"],
  store,
  beforeInit,
  afterInit,
};
