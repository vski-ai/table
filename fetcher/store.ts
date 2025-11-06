import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { TableMeta } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    loading: Signal<boolean>;
    dataLoadKey: Signal<number>;
    tableMeta: Signal<TableMeta>;
  }
  interface TableStore {
    shouldReload: () => void;
  }
}

export enum CommandType {
  TABLE_META_SET = "TABLE_META_SET",
}

export function state(init: Record<string, any> | null) {
  return {
    tableMeta: signal(init?.tableMeta ?? {}),
    dataLoadKey: signal(0),
    loading: signal(false),
    rowHeights: signal({}),
  };
}

export function persist(state: TableState) {
  return {
    rowHeights: state.rowHeights.value,
  };
}

export function reducer<T>(state: TableState, command: Command<T>) {
  switch (command.type) {
    case CommandType.TABLE_META_SET: {
      state.tableMeta.value = command.payload;
      break;
    }
  }
  return state;
}

export function methods(state: TableState) {
  return {
    shouldReload() {
      state.dataLoadKey.value = new Date().getTime();
    },
  };
}
