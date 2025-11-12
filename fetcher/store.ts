import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { TableMeta } from "./types.ts";
import { RowData } from "@/row/types.ts";

declare module "@/module/types.ts" {
  interface TableState {
    loading: Signal<boolean>;
    isInitialized: Signal<boolean>;
    dataLoadKey: Signal<number>;
    tableMeta: Signal<TableMeta>;
    rowHeights: Signal<Record<string, number>>;
    currentData: RowData[];
  }
  interface TableStore {
    shouldReload: () => void;
    getRow: (id: string | number) => RowData;
  }
}

const TABLE_META_SET = "TABLE_META_SET";

export type TableMetaCommnand = Command<typeof TABLE_META_SET, TableMeta>;

export function state(init: Record<string, any> | null) {
  return {
    tableMeta: signal(init?.tableMeta ?? {}),
    dataLoadKey: signal(0),
    loading: signal(true),
    isInitialized: signal(false),
    rowHeights: signal(init?.rowHeights ?? {}),
    currentData: [],
  };
}

export function persist(state: TableState) {
  return {
    tableMeta: state.tableMeta.value,
    rowHeights: state.rowHeights.value,
  };
}

export function mutate(state: TableState, command: TableMetaCommnand) {
  switch (command.type) {
    case "TABLE_META_SET": {
      state.tableMeta.value = command.payload;
      break;
    }
  }
}

export function methods(state: TableState) {
  return {
    shouldReload() {
      state.dataLoadKey.value = new Date().getTime();
    },
    getRow(id: string | number) {
      return state.currentData.find((row) =>
        row?.id?.toString() === id?.toString()
      );
    },
  };
}
