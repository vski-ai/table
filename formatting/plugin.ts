import { ITablePlugin, PluginInitCallback } from "@/plugin/types.ts";
import { addMenuItems } from "@/contextmenu/mod.ts";

const onInit: PluginInitCallback = ({ store }) => {
  addMenuItems({
    store,
    items: [
      {
        id: "ololo",
        menu: "main",
        visibility: () => true,
        label(ctx) {
          return ctx?.column;
        },
        action(ctx) {
          console.log(ctx);
        },
      },
    ],
  });
};

export const FormattingPlugin: ITablePlugin = {
  name: "formatting",
  onInit,
};
