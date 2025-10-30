import { effect, signal } from "@preact/signals";
import {
  ColumnStickSetCommandPayload,
  Command,
  CommandType,
} from "./commands.ts";
import { StorageAdapter } from "./storage.ts";
import { StickyPosition, TableState, TableStore } from "./types.ts";

const MAX_HISTORY_SIZE = 100;

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
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
    sorting: signal(initialState?.sorting || []),
    leafSorting: signal(initialState?.leafSorting || {}),
    columnOrder: signal(initialState?.columnOrder || []),
    columnVisibility: signal(initialState?.columnVisibility || {}),
    stickyColumns: signal<Record<string, StickyPosition>>(
      initialState?.stickyColumns || {},
    ),
    loading: signal(false),
    isMobile: signal(false),
    selectedRows: signal(initialState?.selectedRows || []),
    expandedRows: signal(initialState?.expandedRows || []),
    cellFormatting: signal(initialState?.cellFormatting || {}),
    columnWidths: signal(initialState?.columnWidths || {}),
  };

  const history: Command[] = [];

  effect(() => {
    if (storage && tableId) {
      const currentState = {
        drilldowns: state.drilldowns.value,
        expandedLevels: state.expandedLevels.value,
        filters: state.filters.value,
        sorting: state.sorting.value,
        leafSorting: state.leafSorting.value,
        columnOrder: state.columnOrder.value,
        columnVisibility: state.columnVisibility.value,
        cellFormatting: state.cellFormatting.value,
        columnWidths: state.columnWidths.value,
        stickyColumns: state.stickyColumns.value,
      };
      storage.setItem(`tableState_${tableId}`, currentState);
    }
  });

  const dispatch = (command: Command) => {
    if (history.length >= MAX_HISTORY_SIZE) {
      history.shift();
    }
    history.push(command);
    switch (command.type) {
      // Drilldown
      case CommandType.DRILLDOWN_SET:
        state.drilldowns.value = command.payload;
        break;

      // Expanded Levels
      case CommandType.EXPANDED_LEVELS_SET:
        state.expandedLevels.value = command.payload;
        break;

      // Filtering
      case CommandType.FILTER_SET:
        state.filters.value = command.payload;
        break;

      // Sorting
      case CommandType.SORT_SET:
        state.sorting.value = command.payload;
        break;

      // Column Management
      case CommandType.COLUMN_ORDER_SET:
        state.columnOrder.value = command.payload;
        break;
      case CommandType.COLUMN_VISIBILITY_SET:
        state.columnVisibility.value = command.payload;
        break;
      case CommandType.COLUMN_WIDTHS_SET:
        state.columnWidths.value = command.payload;
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
          ? state.expandedRows.value.filter((row) => row !== command.payload)
          : [...state.expandedRows.value, command.payload];
        state.expandedRows.value = newExpandedRows;
        break;
      }

      case CommandType.CELL_FORMATTING_SET:
        state.cellFormatting.value = command.payload;
        break;

      case CommandType.COLUMN_STICK_SET: {
        const { column, position } = command
          .payload as ColumnStickSetCommandPayload;
        state.stickyColumns.value = {
          ...state.stickyColumns.value,
          [column]: position,
        };
        break;
      }
      default:
        break;
    }
  };

  return { state, dispatch };
}
