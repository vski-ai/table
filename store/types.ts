import { Signal } from "@preact/signals";

export type StoreModule = {
  state: (
    init: Record<string, unknown> | null,
  ) => { [key: string]: Signal<unknown> | unknown };
  persist: (state: TableState) => { [key: string]: unknown };
  mutate: (state: TableState, command: Command) => void;
  methods?: (state: TableState) => Record<string, (...args: any[]) => any>;
  // for injecting anything except signals
  inject?: (state: TableState) => Record<string, any>;
};

export interface Command<T = any, P = any> {
  type: T;
  payload: P;
}

export interface TableState {
  [key: string]: Signal<unknown> | unknown;
  tableId?: string;
}

export interface TableStore {
  state: TableState;
  dispatch: <T>(command: T) => void;
}
