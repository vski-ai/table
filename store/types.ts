import { Signal } from "@preact/signals";

export type StoreModule = {
  state: (
    init: Record<string, unknown> | null,
  ) => { [key: string]: Signal<unknown> | unknown };
  persist: (state: TableState) => { [key: string]: unknown };
  reducer: (state: TableState, command: Command) => TableState;
  methods?: (state: TableState) => Record<string, (...args: any[]) => any>;
};

export interface Command<T = any, P = any> {
  type: T;
  payload: P;
}

export interface TableState {
  [key: string]: Signal<unknown> | unknown;
}

export interface TableStore {
  state: TableState;
  dispatch: <T>(command: T) => void;
}
