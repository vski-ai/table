import { Signal } from "@preact/signals";

export type Module = {
  state: (
    init: Record<string, unknown> | null,
  ) => { [key: string]: Signal<unknown> };
  persist: (state: TableState) => { [key: string]: unknown };
  reducer: (state: TableState, command: Command) => TableState;
  methods?: (state: TableState) => Record<string, (...args: any[]) => any>;
};

export interface Command<T = any, P = any> {
  type: T;
  payload: P;
}

export interface TableState {
  [key: string]: Signal<unknown>;
}

export interface TableStore {
  state: TableState;
  dispatch: <T>(command: T) => void;
}
