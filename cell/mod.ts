import { ITableModule } from "@/module/mod.ts";
export * from "./Cell.tsx";
import * as store from "./store.ts";

export const TableCellModule: ITableModule = {
  name: "$cell",
  store,
};
