import { effect, Signal } from "@preact/signals";
import { StorageAdapter } from "../components/LocalStorageAdapter.ts";
import {
  Command,
  HistoryEntry,
  StoreModule,
  TableState,
  TableStore,
} from "./types.ts";

const builtInStore: StoreModule[] = [];

const MAX_HISTORY_SIZE = 100;

function serializeState(state: any): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};
  for (const key of Object.keys(state)) {
    const value = state[key as keyof typeof state];
    if (value instanceof Signal) {
      snapshot[key] = value.peek();
    } else if (typeof value === "object") {
      snapshot[key] = serializeState(value);
    } else if (typeof value !== "function") {
      snapshot[key] = value;
    }
  }
  return snapshot;
}

function restoreFromSnaphot(snap: any, state: TableState | any) {
  if (!snap) return;
  for (const key in state) {
    const ref = state[key];
    const value = snap[key];
    if (typeof value === "undefined") continue;
    if (ref instanceof Signal) {
      try {
        ref.value = value;
      } catch {
        /* some signals are not writable */
      }
    } else if (typeof ref === "object" && typeof value === "object") {
      restoreFromSnaphot(value, ref);
    }
  }
}

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
  modules
    .map((module) => module.inject?.(state))
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

  const history: HistoryEntry[] = [];
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
    }
    return modules
      .map((module) => module.mutate(state, command))
      .filter(Boolean);
  };

  const undoHistory: HistoryEntry[] = [];

  const undo = () => {
    const item = history.pop();
    if (item) {
      if (undoHistory.length >= MAX_HISTORY_SIZE) {
        undoHistory.shift();
      }
      undoHistory.push(item);
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

  const methods = modules
    .map((module) => module.methods?.(state) ?? {})
    .reduce((acc, obj) => ({ ...acc, ...obj }), {});

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
    state,
    dispatch,
    undo,
    redo,
    ...methods,
  } as TableStore;
}
