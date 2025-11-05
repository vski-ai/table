import { useMemo } from "preact/hooks";
import { effect, Signal, signal } from "@preact/signals";
import { Command, CommandType } from "./commands.ts";
import { StorageAdapter } from "./persistence.ts";
import { Store, TableState, TableStore } from "./types.ts";

import { store as columnsStore } from "@/columns/mod.ts";
import { store as fetcherStore } from "@/fetcher/mod.ts";

type Module = {
  state: (
    init: Record<string, unknown> | null,
  ) => { [key: string]: Signal<unknown> };
  persist: (state: TableState) => { [key: string]: unknown };
  reducer: (state: TableState, command: Command<unknown>) => TableState;
};

const stores: Module[] = [
  fetcherStore,
  columnsStore,
];

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  modules: Module[] = [],
): TableStore {
  modules = [...modules, ...stores];

  const initialState = storage && tableId
    ? storage.getItem<Record<string, any>>(
      `tableState_${tableId}`,
    )
    : null;

  // @ts-expect-error: due to namespace extenstions - slow types
  const state: TableState = {
    drilldowns: signal(initialState?.drilldowns || []),
    expandedLevels: signal(initialState?.expandedLevels || []),
    filters: signal(initialState?.filters || []),
    loading: signal(false),
    dataLoadKey: signal(0),
    tableMeta: signal({}),
    selectedRows: signal(initialState?.selectedRows || []),
    expandedRows: signal(initialState?.expandedRows || []),
    cellFormatting: signal(initialState?.cellFormatting || {}),
    rowHeights: signal(initialState?.rowHeights || {}),
    resizingRow: signal(null),
    focusedCell: signal(null),
  };

  for (const module of modules.map((module) => module.state(initialState))) {
    for (const key in module) {
      state[key] = module[key];
    }
  }

  const history: Command<unknown>[] = [];

  effect(() => {
    if (storage && tableId) {
      const currentState: Record<string, unknown> = {
        expandedRows: state.expandedRows.value,
        expandedLevels: state.expandedLevels.value,
        filters: state.filters.value,
        rowHeights: state.rowHeights.value,
      };

      for (const module of modules.map((module) => module.persist(state))) {
        for (const key in module) {
          currentState[key] = module[key];
        }
      }

      storage.setItem(`tableState_${tableId}`, currentState);
    }
  });

  const dispatch = <T>(command: Command<T>) => {
    if (history.length >= MAX_HISTORY_SIZE) {
      history.shift();
    }
    history.push(command);

    modules.map((module) => module.reducer(state, command));

    switch (command.type) {
      // Filtering
      case CommandType.FILTER_SET:
        state.filters.value = command.payload;
        break;

      case CommandType.ROW_HEIGHTS_SET:
        state.rowHeights.value = command.payload;
        break;
      case CommandType.ROW_RESIZING_SET:
        state.resizingRow.value = command.payload;
        break;

      // View
      case CommandType.LOADING_SET:
        state.loading.value = command.payload;
        break;
      case CommandType.SELECTED_ROWS_SET:
        state.selectedRows.value = command.payload;
        break;
      case CommandType.EXPANDED_ROWS_SET:
        state.expandedRows.value = command.payload;
        break;
      case CommandType.ROW_EXPANSION_TOGGLE: {
        const newExpandedRows = state.expandedRows.value.includes(
            command.payload,
          )
          ? state.expandedRows.value.filter((row: any) =>
            row !== command.payload
          )
          : [...state.expandedRows.value, command.payload];
        state.expandedRows.value = newExpandedRows;
        break;
      }

      case CommandType.CELL_FORMATTING_SET:
        state.cellFormatting.value = command.payload;
        break;

      default:
        break;
    }
  };

  return {
    state,
    dispatch,
    shouldReload() {
      state.dataLoadKey.value = new Date().getTime();
    },
  };
}
