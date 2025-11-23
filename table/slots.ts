import { SortedAddon } from "@xmod/mod.ts";
import { CommonRendererCallback } from "./types.ts";

export const slots = () => ({
  beforesettings: new SortedAddon<CommonRendererCallback>(),
  aftersettings: new SortedAddon<CommonRendererCallback>(),
  beforetable: new SortedAddon<CommonRendererCallback>(),
  aftertable: new SortedAddon<CommonRendererCallback>(),
});
