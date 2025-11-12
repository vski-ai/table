import * as KeyboardStore from "./store.ts";

import { ITableModule, ModuleInitCallback } from "@/module/types.ts";

const onInit: ModuleInitCallback = () => {
};

export const KeyboardPlugin: ITableModule = {
  name: "keyboard",
  onInit,
  store: KeyboardStore,
};
