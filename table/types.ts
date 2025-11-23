import type { Addon, CommonRendererCallback } from "@/module/types.ts";
import type { TableStore } from "@/module/store/types.ts";

declare module "@/module/types.ts" {
  interface Slots {
    beforetable: Addon<CommonRendererCallback>;
    aftertable: Addon<CommonRendererCallback>;
    beforesettings: Addon<CommonRendererCallback>;
    aftersettings: Addon<CommonRendererCallback>;
  }
}
