import { SortedAddon } from "@/module/components/SortedAddon.ts";
import { CommonRendererCallback } from "@/module/types.ts";

export const slots = () => ({
  beforesettings: new SortedAddon<CommonRendererCallback>(),
  aftersettings: new SortedAddon<CommonRendererCallback>(),
  beforetable: new SortedAddon<CommonRendererCallback>(),
  aftertable: new SortedAddon<CommonRendererCallback>(),
});
