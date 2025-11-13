import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, TableState } from "@/module/mod.ts";
import { TableMeta } from "./types.ts";
import { RowData } from "@/row/types.ts";

type FetcherState = {
  fetcher: {
    loading: Signal<boolean>;
    is_initialized: Signal<boolean>;
    table_meta: Signal<TableMeta>;
    reload_key: Signal<number>;
    current_data: RowData[];
  };
};

declare module "@/module/types.ts" {
  interface TableState extends FetcherState {}
  interface TableStore {
    shouldReload: () => void;
    getRow: (id: string | number) => RowData;
  }
}

const TABLE_META_SET = "TABLE_META_SET";

export type TableMetaCommnand = Command<typeof TABLE_META_SET, TableMeta>;

export function state(init: InferPersist<FetcherState>): FetcherState {
  const loading = signal(true);
  const is_initialized = signal(false);
  const table_meta = signal(init?.fetcher?.table_meta ?? {});
  const reload_key = signal(0);

  return {
    fetcher: {
      loading,
      is_initialized,
      table_meta,
      reload_key,
      current_data: [],
    },
  };
}

export function persist(state: TableState): InferPersist<FetcherState> {
  return {
    fetcher: {
      table_meta: state.fetcher.table_meta.value,
    },
  };
}

export function mutate(state: TableState, command: TableMetaCommnand) {
  switch (command.type) {
    case "TABLE_META_SET": {
      state.fetcher.table_meta.value = command.payload;
      break;
    }
  }
}

export function methods(state: TableState) {
  return {
    shouldReload() {
      state.fetcher.reload_key.value = new Date().getTime();
    },
    getRow(id: string | number) {
      return state.fetcher.current_data.find((row) =>
        row?.id?.toString() === id?.toString()
      );
    },
  };
}
