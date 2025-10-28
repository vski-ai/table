import { effect, signal } from "@preact/signals";
import { Command, CommandType } from "./commands.ts";
import { StorageAdapter } from "./storage.ts";
import { TableState, TableStore } from "./types.ts";

export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
): TableStore {
  const initialState = storage && tableId
    ? storage.getItem<TableState>(
      `tableState_${tableId}`,
    )
    : null;

  const state: TableState = {
    drilldowns: signal(initialState?.drilldowns || []),
    filters: signal(initialState?.filters || []),
    sorting: signal(initialState?.sorting || []),
    columnOrder: signal(initialState?.columnOrder || []),
    columnVisibility: signal(initialState?.columnVisibility || {}),
    loading: signal(false),
    isMobile: signal(false),
    selectedRows: signal([]),
    expandedRows: signal([]),
    cellFormatting: signal(initialState?.cellFormatting || {}),
    columnWidths: signal(initialState?.columnWidths || {}),
  };

  const history: Command[] = [];

  effect(() => {
    if (storage && tableId) {
      const currentState = {
        drilldowns: state.drilldowns.value,
        filters: state.filters.value,
        sorting: state.sorting.value,
        columnOrder: state.columnOrder.value,
        columnVisibility: state.columnVisibility.value,
        cellFormatting: state.cellFormatting.value,
        columnWidths: state.columnWidths.value,
      };
      storage.setItem(`tableState_${tableId}`, currentState);
    }
  });

  const dispatch = (command: Command) => {
    history.push(command);
    switch (command.type) {
      // Drilldown
      case CommandType.DRILLDOWN_SET:
        state.drilldowns.value = command.payload;
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

      // Formatting
      case CommandType.CELL_FORMATTING_SET:
        state.cellFormatting.value = command.payload;
        break;

      default:
        break;
    }
  };

  return { state, dispatch };
}
