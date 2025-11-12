import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { TypeFormatComponent } from "./types.ts";
import { DefaultFormater } from "./components/DefaultFormater.tsx";

const TYPE_FORMATTERS_ACCESSOR = Symbol("formatters");

declare module "@/module/types.ts" {
  interface TableState {
    columnDataType: Signal<Record<string, string>>;
    columnDataTypeOptions: Signal<Record<string, any>>;
    [TYPE_FORMATTERS_ACCESSOR]: Record<string, TypeFormatComponent<string>>;
  }

  interface TableStore {
    getFormater: <T extends string>(datetype: T) => TypeFormatComponent<T>;
    addFormater: <T extends string>(formatter: TypeFormatComponent<T>) => void;
  }
}

const COLUMN_DATATYPE_SET = "COLUMN_DATATYPE_SET";
const COLUMN_DATATYPE_OPTIONS_SET = "COLUMN_DATATYPE_OPTIONS_SET";

export type ColumnDataTypeSetCommand = Command<
  typeof COLUMN_DATATYPE_SET,
  Record<string, string>
>;

export type ColumnDataTypeOptionsSetCommand = Command<
  typeof COLUMN_DATATYPE_OPTIONS_SET,
  Record<string, any>
>;

export type FormattingCommandType =
  | ColumnDataTypeSetCommand
  | ColumnDataTypeOptionsSetCommand;

export function inject(_: TableState) {
  return {
    [TYPE_FORMATTERS_ACCESSOR]: {
      "default": DefaultFormater,
    },
  };
}

export function state(init: Record<string, any> | null) {
  const columnDataType = signal(init?.columnDataType ?? {});
  const columnDataTypeOptions = signal(init?.columnDataTypeOptions ?? {});
  return {
    columnDataType,
    columnDataTypeOptions,
  };
}

export function persist(state: TableState) {
  return {
    columnDataType: state.columnDataType.value,
    columnDataTypeOptions: state.columnDataTypeOptions.value,
  };
}

export function mutate(state: TableState, command: FormattingCommandType) {
  switch (command.type) {
    case "COLUMN_DATATYPE_SET":
      state.columnDataType.value = {
        ...state.columnDataType.value,
        ...command.payload,
      };
      break;
    case "COLUMN_DATATYPE_OPTIONS_SET":
      state.columnDataTypeOptions.value = {
        ...state.columnDataTypeOptions.value,
        ...command.payload,
      };
      break;
  }
}

export function methods(state: TableState) {
  return {
    getFormater(datatype: string) {
      return state[TYPE_FORMATTERS_ACCESSOR]?.[datatype] ??
        DefaultFormater;
    },
    addFormater<T extends string>(formatter: TypeFormatComponent<T>) {
      state[TYPE_FORMATTERS_ACCESSOR][formatter.datatype] = formatter;
    },
  };
}
