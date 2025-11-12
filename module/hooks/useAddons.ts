import { TableStore } from "@/module/types.ts";
import { ADDONS_CONTAINER_ACCESSOR } from "./private.ts";
import { PluginContainer } from "../factory.ts";

export function useAddons(
  { store }: { store: TableStore },
): PluginContainer {
  // @ts-ignore: some privats
  return store[ADDONS_CONTAINER_ACCESSOR];
}
