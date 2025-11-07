import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { TableMeta } from "./types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    loading: Signal<boolean>;
    dataLoadKey: Signal<number>;
    tableMeta: Signal<TableMeta>;
    rowHeights: Signal<Record<string, number>>;
  }
  interface TableStore {
    shouldReload: () => void;
  }
}

const TABLE_META_SET = "TABLE_META_SET";

export type TableMetaCommnand = Command<typeof TABLE_META_SET, TableMeta>;

export function state(init: Record<string, any> | null) {
  return {
    tableMeta: signal(init?.tableMeta ?? {}),
    dataLoadKey: signal(0),
    loading: signal(false),
    rowHeights: signal(init?.rowHeights ?? {}),
  };
}

export function persist(state: TableState) {
  return {
    rowHeights: state.rowHeights.value,
  };
}

export function reducer(state: TableState, command: TableMetaCommnand) {
  switch (command.type) {
    case "TABLE_META_SET": {
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
