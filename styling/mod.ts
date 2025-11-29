import {
  BeforeInitCallback,
  ModuleInitCallback,
  XModule,
} from "@xmod/types.ts";
import { addMenuItems } from "@/ctxmenu/mod.ts";
import { renderStyleFormat } from "./StyleFormat.tsx";
import { MenuItems } from "./menu.tsx";
import * as Store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ table }) => {
  table.before.use(renderStyleFormat);
};
const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const StylingModule: XModule = {
  name: "styling",
  store: Store,
  beforeInit,
  onInit,
};
