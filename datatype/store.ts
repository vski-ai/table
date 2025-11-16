import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/module/mod.ts";
import { TypeFormatComponent } from "./types.ts";
import { DefaultFormater } from "./components/DefaultFormater.tsx";
import { InferPersist } from "../module/types.ts";
import { NumberDataTypeOptions, NumberDataTypes } from "./number/types.ts";
import { DateDataType, DateDataTypeOptions } from "./date/types.ts";
import { DataType } from "./types.ts";

const TYPE_FORMATTERS_ACCESSOR = Symbol("formatters");

type DatatypesState = {
  data_type: {
    column: Signal<Record<string, string>>;
    options: Signal<Record<string, any>>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends DatatypesState {
    [TYPE_FORMATTERS_ACCESSOR]: Record<string, TypeFormatComponent<string>>;
  }

  interface TableStore {
    getFormater: <T extends string>(datetype: T) => TypeFormatComponent<T>;
    addFormater: <T extends string>(formatter: TypeFormatComponent<T>) => void;
  }
}

export const COLUMN_DATATYPE_SET = "COLUMN_DATATYPE_SET";
export const COLUMN_DATATYPE_OPTIONS_SET = "COLUMN_DATATYPE_OPTIONS_SET";
export const COLUMN_FORMAT_SET = "COLUMN_FORMAT_SET";

export type ColumnDataTypeSetCommand = Command<
  typeof COLUMN_DATATYPE_SET,
  Record<string, string>
>;

export type ColumnDataTypeOptionsSetCommand = Command<
  typeof COLUMN_DATATYPE_OPTIONS_SET,
  Record<string, any>
>;

export type ColumnFormatSetCommand = Command<
  typeof COLUMN_FORMAT_SET,
  | DataType<NumberDataTypes, NumberDataTypeOptions>
  | DataType<DateDataType, DateDataTypeOptions>,
  "Set column formatting based on a datetype { column: [column_name], type: [datatype], options: [datetype_options] }"
>;

export type FormattingCommandType =
  | ColumnDataTypeSetCommand
  | ColumnDataTypeOptionsSetCommand
  | ColumnFormatSetCommand;

export function inject(_: TableState) {
  return {
    [TYPE_FORMATTERS_ACCESSOR]: {
      "default": DefaultFormater,
    },
  };
}

export function state(persist: InferPersist<DatatypesState>): DatatypesState {
  const column = signal(persist?.data_type.column ?? {});
  const options = signal(persist?.data_type.options ?? {});
  return {
    data_type: {
      column,
      options,
    },
  };
}

export function persist(state: TableState) {
  return {
    data_type: {
      column: state.data_type.column.value,
      options: state.data_type.options.value,
    },
  };
}

export function mutate(state: TableState, command: FormattingCommandType) {
  switch (command.type) {
    case COLUMN_DATATYPE_SET:
      state.data_type.column.value = {
        ...state.data_type.column.value,
        ...command.payload,
      };
      break;
    case COLUMN_DATATYPE_OPTIONS_SET:
      state.data_type.options.value = {
        ...state.data_type.options.value,
        ...command.payload,
      };
      break;
    case COLUMN_FORMAT_SET:
      state.data_type.options.value = {
        ...state.data_type.options.value,
        [command.payload.column]: {},
      };
      state.data_type.column.value = {
        ...state.data_type.column.value,
        [command.payload.column]: "default",
      };
      state.data_type.options.value = {
        ...state.data_type.options.value,
        [command.payload.column]: command.payload.options,
      };
      state.data_type.column.value = {
        ...state.data_type.column.value,
        [command.payload.column]: command.payload.type,
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
