import { ITableModule } from "@/module/types.ts";
import * as store from "./store.ts";

export const EditingModule: ITableModule = {
  name: "$editing",
  store,
};
