import { effect, Signal, signal } from "@preact/signals";
import { Command } from "./commands.ts";
import { StorageAdapter } from "./persistence.ts";
import { TableState, TableStore } from "./types.ts";

import { store as columnsStore } from "@/columns/mod.ts";
import { store as fetcherStore } from "@/fetcher/mod.ts";

type Module = {
  state: (
    init: Record<string, unknown> | null,
  ) => { [key: string]: Signal<unknown> };
  persist: (state: TableState) => { [key: string]: unknown };
  reducer: (state: TableState, command: Command<unknown>) => TableState;
};

const stores: Module[] = [
  fetcherStore,
  columnsStore,
];

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  modules: Module[] = [],
): TableStore {
  modules = [...modules, ...stores];

  const initialState = storage && tableId
    ? storage.getItem<Record<string, any>>(
      `tableState_${tableId}`,
    )
    : null;

  // @ts-expect-error: due to namespace extenstions - slow types
  const state: TableState = {
    rowHeights: signal({}),
    cellFormatting: signal(initialState?.cellFormatting || {}),
    focusedCell: signal(null),
  };

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

  const dispatch = <T>(command: Command<T>) => {
    if (history.length >= MAX_HISTORY_SIZE) {
      history.shift();
    }
    history.push(command);
    modules.map((module) => module.reducer(state, command));
  };

  return {
    state,
    dispatch,
    shouldReload() {
      state.dataLoadKey.value = new Date().getTime();
    },
  };
}
