import { effect } from "@preact/signals";
import { StorageAdapter } from "./persistence.ts";
import { Command, Module, TableState, TableStore } from "./types.ts";

import { FormattingStore } from "@/formatting/mod.ts";
import { ColumnsStore } from "@/columns/mod.ts";
import { FetcherStore } from "@/fetcher/mod.ts";
import { NavigationStore } from "@/navigation/mod.ts";
import { ContextMenuStore } from "@/contextmenu/mod.ts";

const builtInStore: Module[] = [
  FormattingStore,
  FetcherStore,
  ColumnsStore,
  NavigationStore,
  ContextMenuStore,
];

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  modules: Module[] = [],
): TableStore {
  modules = [...modules, ...builtInStore];

  const initialState = storage && tableId
    ? storage.getItem<Record<string, any>>(
      `tableState_${tableId}`,
    )
    : null;

  // @ts-expect-error: due to namespace extenstions - slow types
  const state: TableState = {};

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

      storage.setItem(`tableState_${tableId}`, currentState);
    }
  });

  const dispatch = <T, P>(command: Command<T, P>) => {
    if (history.length >= MAX_HISTORY_SIZE) {
      history.shift();
    }
    history.push(command);
    modules.map((module) => module.reducer(state, command));
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
