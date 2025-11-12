export * from "./hooks/useTableKb.ts";
export * from "./hooks/useCellKb.ts";

import * as KeyboardStore from "./store.ts";

import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";

const onInit: PluginInitCallback = () => {
};

export const KeyboardPlugin: ITablePlugin = {
  name: "keyboard",
  onInit,
  store: KeyboardStore,
};
