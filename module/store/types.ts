import { Signal } from "@preact/signals";
import { MutableRef } from "preact/hooks";

export type StoreModule = {
  state: (init: any) => { [key: string]: Signal<unknown> | unknown };
  persist: (state: TableState) => { [key: string]: unknown };
  mutate: (state: TableState, command: Command) => void;
  methods?: (state: TableState) => Record<string, (...args: any[]) => any>;
  // for injecting anything except signals
  inject?: (state: TableState) => Record<string, any>;
};

export interface Command<T = any, P = any, Doc = any> {
  type: T;
  payload: P;
  history?: boolean;
  comment?: Doc;
}

export interface TableState {
  [key: string]: Signal<unknown> | unknown;
  tableId?: string;
}

export interface TableStore {
  state: TableState;
  dispatch: <T, R = any>(command: T) => R[];
  undo: () => void;
  redo: () => void;
  scrollContainerRef: MutableRef<any>;
}

export type InferPersist<T extends Record<string, any>> = Record<
  keyof T,
  Partial<Record<keyof T[keyof T], any>>
>;

export interface HistoryEntry {
  stateSnapshot: Record<string, any>;
  command: Command<unknown, unknown>;
  timestamp: number;
}
