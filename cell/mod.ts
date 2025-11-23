export * from "./Cell.tsx";
import { XModule } from "@xmod/mod.ts";
import { slots } from "./slots.ts";
import * as store from "./store.ts";

export const TableCellModule: XModule = {
  name: "cell",
  store,
  slots,
};
