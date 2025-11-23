import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, State } from "@xmod/mod.ts";
import { TableMeta } from "./types.ts";
import { RowData } from "@/row/types.ts";

type FetcherState = {
  fetcher: {
    loading: Signal<boolean>;
    is_initialized: Signal<boolean>;
    table_meta: Signal<TableMeta>;
    reload_key: Signal<number>;
    render_key: Signal<number>;
    latest_data: Signal<(RowData | null)[]>;
    latest_count: Signal<number>;
    current_data: RowData[];
    visible_rows: RowData[];
  };
};

declare module "@xmod/types.ts" {
  interface State extends FetcherState {}
  interface Store {
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
  const render_key = signal(0);
  const latest_data = signal([]);
  const latest_count = signal(0);
  return {
    fetcher: {
      loading,
      is_initialized,
      table_meta,
      reload_key,
      render_key,
      latest_data,
      latest_count,
      current_data: [],
      visible_rows: [],
    },
  };
}

export function persist(state: State): InferPersist<FetcherState> {
  return {
    fetcher: {
      table_meta: state.fetcher.table_meta.value,
    },
  };
}

export function mutate(state: State, command: TableMetaCommnand) {
  switch (command.type) {
    case TABLE_META_SET: {
      state.fetcher.table_meta.value = command.payload;
      break;
    }
  }
}

export function methods(state: State) {
  return {
    shouldReload() {
      state.fetcher.reload_key.value = new Date().getTime();
    },
    getRow(id: string | number) {
      return state.fetcher.current_data.find(
        (row) => row?.id?.toString() === id?.toString(),
      );
    },
  };
}
