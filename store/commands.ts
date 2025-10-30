import { StickyPosition } from "./types.ts";

export enum CommandType {
  // Drilldown
  DRILLDOWN_ADD = "DRILLDOWN_ADD",
  DRILLDOWN_REMOVE = "DRILLDOWN_REMOVE",
  DRILLDOWN_SET = "DRILLDOWN_SET",

  // Filtering
  FILTER_ADD = "FILTER_ADD",
  FILTER_REMOVE = "FILTER_REMOVE",
  FILTER_SET = "FILTER_SET",

  // Sorting
  SORT_ADD = "SORT_ADD",
  SORT_REMOVE = "SORT_REMOVE",
  SORT_SET = "SORT_SET",

  // Column Management
  COLUMN_ORDER_SET = "COLUMN_ORDER_SET",
  COLUMN_VISIBILITY_SET = "COLUMN_VISIBILITY_SET",
  COLUMN_WIDTHS_SET = "COLUMN_WIDTHS_SET",

  // View
  LOADING_SET = "LOADING_SET",
  SELECTED_ROWS_SET = "SELECTED_ROWS_SET",
  EXPANDED_ROWS_SET = "EXPANDED_ROWS_SET",
  ROW_EXPANSION_TOGGLE = "ROW_EXPANSION_TOGGLE",

  // Formatting
  CELL_FORMATTING_SET = "CELL_FORMATTING_SET",

  COLUMN_STICK_SET = "COLUMN_STICK_SET",
}

export interface Command {
  type: CommandType;
  payload: any;
}

export interface ColumnStickSetCommandPayload {
  column: string;
  position: StickyPosition;
}
