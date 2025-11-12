import { effect } from "@preact/signals";
import { StorageAdapter } from "../components/LocalStorageAdapter.ts";
import { Command, StoreModule, TableState, TableStore } from "./types.ts";

const builtInStore: StoreModule[] = [];

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  modules: StoreModule[] = [],
): TableStore {
  modules = [...modules, ...builtInStore];

  const initialState = storage && tableId
    ? storage.getItem<Record<string, any>>(tableId)
    : null;

  // @ts-expect-error:
  const state: TableState = {
    tableId,
  };
  modules.map((module) => module.inject?.(state))
    .filter(Boolean)
    .forEach((module) => {
      for (const sym of Object.getOwnPropertySymbols(module)) {
        // @ts-ignore
        state[sym] = module[sym];
      }
      for (const key in module) {
        state[key] = module[key];
      }
    });

  for (const module of modules.map((module) => module.state(initialState))) {
    for (const key in module) {
      state[key] = module[key];
    }
  }

  const history: Command<unknown>[] = [];

  effect(() => {
    if (storage && tableId) {
      const currentState: Record<string, unknown> = {};

      for (const module of modules.map((module) => module.persist(state))) {
        for (const key in module) {
          currentState[key] = module[key];
        }
      }

      storage.setItem(tableId, currentState);
    }
  });

  const dispatch = <T, P>(command: Command<T, P>) => {
    if (history.length >= MAX_HISTORY_SIZE) {
      history.shift();
    }
    history.push(command);
    modules.map((module) => module.mutate(state, command));
  };

  const methods = modules
    .map((module) => module.methods?.(state) ?? {})
    .reduce((acc, obj) => ({ ...acc, ...obj }), {});

  return {
    state,
    dispatch,
    ...methods,
  } as TableStore;
}
