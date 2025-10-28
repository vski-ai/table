import { signal } from "@preact/signals";
import { Command, CommandType } from "./commands.ts";
import { TableState, TableStore } from "./types.ts";

export function createTableStore(): TableStore {
  const state: TableState = {
    drilldowns: signal([]),
    filters: signal([]),
    sorting: signal([]),
    columnOrder: signal([]),
    columnVisibility: signal({}),
    loading: signal(false),
    isMobile: signal(false),
    selectedRows: signal([]),
    expandedRows: signal([]),
    cellFormatting: signal({}),
  };

  const history: Command[] = [];

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
