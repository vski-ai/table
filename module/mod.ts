export * from "./types.ts";
export * from "./factory.ts";
export * from "./components/SortedAddon.ts";
export * from "./hooks/useAddons.ts";
export * from "./store/mod.ts";
export * from "./components/LocalStorageAdapter.ts";
export * from "./components/NoopStorageAdapter.ts";

import { ITableModule, StoreModule } from "./types.ts";
import {
  LocalStorageAdapter,
  StorageAdapter,
} from "./components/LocalStorageAdapter.ts";
import { buildInModules, createPluginContainer } from "./factory.ts";
import { createTableStore } from "./store/factory.ts";

export type CreateTableModuleOpts = {
  id: string;
  modules: ITableModule[];
  persistence?: StorageAdapter;
};

export function createTableModule({
  id,
  modules,
  persistence,
}: CreateTableModuleOpts) {
  const storeModules: StoreModule[] = [...buildInModules, ...modules]
    .map((p) => p.store)
    .filter((p) => !!p);

  const store = createTableStore({
    storage: persistence ?? new LocalStorageAdapter(),
    tableId: id,
    modules: storeModules,
  });

  createPluginContainer(store, modules);
  return store;
}
