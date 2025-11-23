import {
  BeforeInitCallback,
  ITableModule,
  ModuleInitCallback,
} from "@/module/types.ts";
import { addMenuItems } from "@/ctxmenu/mod.ts";
import { renderStyleFormat } from "./StyleFormat.tsx";
import { MenuItems } from "./menu.tsx";
import * as Store from "./store.ts";

const beforeInit: BeforeInitCallback = ({ beforetable }) => {
  beforetable.use(renderStyleFormat);
};
const onInit: ModuleInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: MenuItems,
  });
};

export const StylingModule: ITableModule = {
  name: "styling",
  store: Store,
  beforeInit,
  onInit,
};
