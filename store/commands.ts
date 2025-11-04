import { StickyPosition } from "./types.ts";

export enum CommandType {
  // Drilldown
  DRILLDOWN_SET = "DRILLDOWN_SET",

  // Expanded Levels
  EXPANDED_LEVELS_SET = "EXPANDED_LEVELS_SET",

  // Filtering
  FILTER_ADD = "FILTER_ADD",
  FILTER_REMOVE = "FILTER_REMOVE",
  FILTER_SET = "FILTER_SET",

  // View
  LOADING_SET = "LOADING_SET",
  SELECTED_ROWS_SET = "SELECTED_ROWS_SET",
  EXPANDED_ROWS_SET = "EXPANDED_ROWS_SET",
  ROW_EXPANSION_TOGGLE = "ROW_EXPANSION_TOGGLE",

  // Formatting
  CELL_FORMATTING_SET = "CELL_FORMATTING_SET",

  ROW_HEIGHTS_SET = "ROW_HEIGHTS_SET",
  ROW_RESIZING_SET = "ROW_RESIZING_SET",
}

export interface Command<T = CommandType> {
  type: T;
  payload: any;
}
