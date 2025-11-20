import { effect } from "@preact/signals";
import { StorageAdapter } from "../components/LocalStorageAdapter.ts";
import { NoopStorageAdapter } from "../components/NoopStorageAdapter.ts";
import {
  Command,
  HistoryEntry,
  StoreModule,
  TableState,
  TableStore,
} from "./types.ts";
import { restoreFromSnaphot, serializeState } from "./utils.ts";

const MAX_HISTORY_SIZE = 100;

// Store factory
// Provides dispatch and history
export function createTableStore({
  storage = new NoopStorageAdapter(),
  tableId,
  modules = [],
}: {
  storage?: StorageAdapter;
  tableId: string;
  modules: StoreModule[];
}): TableStore {
  const TABLE_PERSIST_KEY = tableId;
  const TABLE_HISTORY_PERSIST_KEY = tableId + "_history";
  const TABLE_UNDOHISTORY_PERSIST_KEY = tableId + "_undohistory";
  // we get persistent data initially.
  // storage must be sync - if want server/async do a background side
  // effect for your storage impl.
  const INITIAL_STATE = storage.getItem<Record<string, any>>(TABLE_PERSIST_KEY);

  // @ts-expect-error: type signature incomplete here
  // due to extentions
  const state: TableState = {
    tableId,
  };

  // handle inject (usually for private/sybmols)
  modules
    .map((module) => module.inject?.(state))
    .filter(Boolean)
    .forEach((module) => {
      for (const sym of Object.getOwnPropertySymbols(module)) {
        // @ts-ignore: privates
        state[sym] = module[sym];
      }
      for (const key in module) {
        state[key] = module[key];
      }
    });

  // mapping state from modules
  for (const module of modules.map((module) => module.state(INITIAL_STATE))) {
    for (const key in module) {
      state[key] = module[key];
    }
  }

  // dispatch mutations
  const history = (storage.getItem<Record<string, any>>(
    TABLE_HISTORY_PERSIST_KEY,
  ) ?? []) as HistoryEntry[];

  const dispatch = <T, P>(command: Command<T, P>) => {
    if (command.history) {
      const stateSnapshot = serializeState(state);
      if (history.length >= MAX_HISTORY_SIZE) {
        history.shift();
      }
      history.push({
        stateSnapshot,
        command,
        timestamp: Date.now(),
      });
      storage.setItem(TABLE_HISTORY_PERSIST_KEY, history);
    }
    return modules
      .map((module) => module.mutate(state, command))
      .filter(Boolean);
  };

  // undo/redo methods
  const undoHistory = (storage.getItem<Record<string, any>>(
    TABLE_UNDOHISTORY_PERSIST_KEY,
  ) ?? []) as HistoryEntry[];

  const undo = () => {
    const item = history.pop();
    if (item) {
      if (undoHistory.length >= MAX_HISTORY_SIZE) {
        undoHistory.shift();
      }
      undoHistory.push(item);
      storage.setItem(TABLE_UNDOHISTORY_PERSIST_KEY, undoHistory);
      restoreFromSnaphot(item.stateSnapshot, state);
    }
  };

  const redo = () => {
    const item = undoHistory.pop();
    if (item) {
      if (history.length >= MAX_HISTORY_SIZE) {
        history.shift();
      }
      history.push(item);
      restoreFromSnaphot(item.stateSnapshot, state);
    }
  };

  // methods to be injected into store
  const methods = modules
    .map((module) => module.methods?.(state) ?? {})
    .reduce((acc, obj) => ({ ...acc, ...obj }), {});

  // handle persisting on store updates
  let persistDebounceId: number = 0;
  effect(() => {
    if (storage && tableId) {
      const currentState: Record<string, unknown> = {};
      for (const module of modules.map((module) => module.persist(state))) {
        for (const key in module) {
          currentState[key] = module[key];
        }
      }
      clearTimeout(persistDebounceId);
      persistDebounceId = setTimeout(() => {
        storage.setItem(tableId, currentState);
      });
    }
  });

  return {
    ...methods,
    state,
    dispatch,
    undo,
    redo,
  } as TableStore;
}
