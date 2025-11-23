export * from "./types.ts";
export * from "./Cell.tsx";
import { ITableModule } from "@/module/mod.ts";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

export const TableCellModule: ITableModule = {
  name: "cell",
  store,
  slots,
};
