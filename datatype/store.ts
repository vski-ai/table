import { Signal, signal } from "@preact/signals";
import { Command, State } from "@xmod/mod.ts";
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

declare module "@xmod/types.ts" {
  interface State extends DatatypesState {
    [TYPE_FORMATTERS_ACCESSOR]: Record<string, TypeFormatComponent<string>>;
  }

  interface Store {
    getFormater: <T extends string>(datetype: T) => TypeFormatComponent<T>;
    addFormater: <T extends string>(formatter: TypeFormatComponent<T>) => void;
  }
}

export const COLUMN_DATATYPE_SET = "COLUMN_DATATYPE_SET";
export const COLUMN_DATATYPE_OPTIONS_SET = "COLUMN_DATATYPE_OPTIONS_SET";
export const COLUMN_NUMBER_FORMAT_SET = "COLUMN_NUMBER_FORMAT_SET";
export const COLUMN_DATE_FORMAT_SET = "COLUMN_DATE_FORMAT_SET";

export type ColumnDataTypeSetCommand = Command<
  typeof COLUMN_DATATYPE_SET,
  Record<string, string>
>;

export type ColumnDataTypeOptionsSetCommand = Command<
  typeof COLUMN_DATATYPE_OPTIONS_SET,
  Record<string, any>
>;

export type ColumnNumnerFormatSetCommand = Command<
  typeof COLUMN_NUMBER_FORMAT_SET,
  DataType<NumberDataTypes, NumberDataTypeOptions>,
  `Set column number formatting:
     { column: [column_name], type: "number", options: [datetype_options] } or
     { column: [column_name], type: "unit", options: [datetype_options] } or
     { column: [column_name], type: "currency", options: [datetype_options] }
    Datetype options support all Intl.NumberFormatOptions options (number, currency, units),
    but it is also IMPORTANT to pass user locale { locale: string }. The default locale is en-US.
    Example:
      {
          "column": "total_price",
          "type": "currency",
          "options": {
              "minimumFractionDigits":2,
              "maximumFractionDigits":2,
              "locale":"en-GB",
              "style":"currency",
              "currencyDisplay":"symbol",
              "currency":"USD"
            }
      }
   `
>;
export type ColumnDateFormatSetCommand = Command<
  typeof COLUMN_DATE_FORMAT_SET,
  DataType<DateDataType, DateDataTypeOptions>,
  `Set column date/time formatting:
     { column: [column_name], type: "date", options: [datetype_options] }

    Datetype options support all Intl.DateTimeFormatOptions options,
    but it is also IMPORTANT to pass user locale { locale: string }. The default locale is en-US.
    Example:
      {
          "column": "delivery date",
          "type": "date",
          "options": {"locale":"en-GB","dateStyle":"medium","timeStyle":"medium"}
      }
   `
>;

export type FormattingCommandType =
  | ColumnDataTypeSetCommand
  | ColumnDataTypeOptionsSetCommand
  | ColumnDateFormatSetCommand
  | ColumnNumnerFormatSetCommand;

export function inject(_: State) {
  return {
    [TYPE_FORMATTERS_ACCESSOR]: {
      default: DefaultFormater,
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

export function persist(state: State) {
  return {
    data_type: {
      column: state.data_type.column.value,
      options: state.data_type.options.value,
    },
  };
}

export function mutate(state: State, command: FormattingCommandType) {
  const setFormat = () => {
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
  };
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
    case COLUMN_NUMBER_FORMAT_SET:
      setFormat();
      break;
    case COLUMN_DATE_FORMAT_SET:
      setFormat();
      break;
  }
}

export function methods(state: State) {
  return {
    getFormater(datatype: string) {
      return state[TYPE_FORMATTERS_ACCESSOR]?.[datatype] ?? DefaultFormater;
    },
    addFormater<T extends string>(formatter: TypeFormatComponent<T>) {
      state[TYPE_FORMATTERS_ACCESSOR][formatter.datatype] = formatter;
    },
  };
}
