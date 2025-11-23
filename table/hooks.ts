import type { ModuleHooksCallback } from "@xmod/types.ts";
import type { DataLoadOptions, DataLoadResult } from "@/fetcher/types.ts";
import type { RowData } from "@/row/types.ts";
import type {
  AfterLoadCallback,
  BeforeLoadCallback,
  BeforeRenderCallback,
} from "./types.ts";

declare module "@xmod/types.ts" {
  interface XModule {
    beforeLoad?: BeforeLoadCallback;
    afterLoad?: AfterLoadCallback;
    beforeRender?: BeforeRenderCallback;
  }
}

export const hooks: ModuleHooksCallback = ({ modules, store }) => {
  const beforeLoad = async (options: DataLoadOptions) => {
    let result = options;
    for (const plugin of modules) {
      result = (await plugin.beforeLoad?.({
        options: result,
        store,
      })) ?? result;
    }
    return result;
  };

  const afterLoad = async (res: DataLoadResult) => {
    let result = res;
    for (const plugin of modules) {
      result = (await plugin.afterLoad?.({ res: result, store })) ?? result;
    }
    return result;
  };

  const beforeRender = (res: (RowData | null)[]) => {
    let result = res;
    for (const plugin of modules) {
      result = plugin.beforeRender?.({ res: result, store }) ?? result;
    }
    return result;
  };

  return {
    beforeLoad,
    afterLoad,
    beforeRender,
  };
};
