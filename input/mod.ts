import * as KeyboardStore from "./store.ts";

import { ModuleInitCallback, XModule } from "@xmod/types.ts";

const onInit: ModuleInitCallback = () => {};

export const InputModule: XModule = {
  name: "keyboard",
  onInit,
  store: KeyboardStore,
};
