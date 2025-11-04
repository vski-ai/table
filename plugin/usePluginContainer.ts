import { TableStore } from "@/store/types.ts";
import { PLUGIN_CONTAINER_ACCESSOR } from "./private.ts";
import { PluginContainer } from "./factory.ts";

export function usePluginContainer(
  { store }: { store: TableStore },
): PluginContainer {
  // @ts-ignore: some privats
  return store[PLUGIN_CONTAINER_ACCESSOR];
}
