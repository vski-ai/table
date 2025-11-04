import { effect, signal } from "@preact/signals";
import { Command, CommandType } from "./commands.ts";
import { StorageAdapter } from "./storage.ts";
import { Store, TableState, TableStore } from "./types.ts";
import {
  columnsPersist,
  columnsReducer,
  columnsState,
} from "@/columns/columnsStore.ts";

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  plugins: Store[] = [],
): TableStore {
  const initialState = storage && tableId
    ? storage.getItem<Record<string, any>>(
      `tableState_${tableId}`,
    )
    : null;

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
    ...columnsState(initialState),
  };

  for (const plugin of plugins) {
    if (plugin.data) {
      for (const key in plugin.data) {
        state[key] = signal(initialState?.[key] || plugin.data[key]);
      }
    }
  }

  const history: Command<unknown>[] = [];

  effect(() => {
    if (storage && tableId) {
      const currentState: Record<string, unknown> = {
        ...columnsPersist(state),
        expandedRows: state.expandedRows.value,
        expandedLevels: state.expandedLevels.value,
        filters: state.filters.value,
        rowHeights: state.rowHeights.value,
        stickyColumns: state.stickyColumns.value,
      };

      for (const plugin of plugins) {
        if (plugin.data) {
          for (const key in plugin.data) {
            currentState[key] = state[key].value;
          }
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

    columnsReducer(state, command);

    for (const plugin of plugins) {
      if (plugin.reducer) {
        plugin.reducer(state, command);
      }
    }

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
