import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { TypeFormat } from "./types.ts";
import { DefaultFormater } from "./DefaultFormater.tsx";
import { RowData } from "../row/types.ts";

const TYPE_FORMATTERS_ACCESSOR = Symbol("formatters");

declare module "@/store/types.ts" {
  interface TableState {
    cellDataTypes: Signal<Record<string, string>>;
    cellFormatting: Signal<Record<string, any>>;
    [TYPE_FORMATTERS_ACCESSOR]: Record<string, TypeFormat<string>>;
  }

  interface TableStore {
    getFormater: <T extends string>(datetype: T) => TypeFormat<T>;
    addFormater: <T extends string>(formatter: TypeFormat<T>) => void;
  }
}

const CELL_DATATYPES_SET = "CELL_DATATYPE_SET";

export type CellDatatypeSetCommand = Command<
  typeof CELL_DATATYPES_SET,
  Record<string, string>
>;

export type FormattingCommandType = CellDatatypeSetCommand;

export function inject(_: TableState) {
  return {
    [TYPE_FORMATTERS_ACCESSOR]: {
      "default": DefaultFormater,
    },
  };
}

export function state(init: Record<string, any> | null) {
  const cellDataTypes = signal(init?.cellDataTypes ?? {});
  const cellEditing = signal({});
  return {
    cellDataTypes,
    cellEditing,
  };
}

export function persist(state: TableState) {
  return {};
}

export function mutate(state: TableState, command: FormattingCommandType) {
  switch (command.type) {
    case "CELL_DATATYPE_SET":
      state.cellDataTypes.value = {
        ...state.cellDataTypes.value,
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
    addFormater<T extends string>(formatter: TypeFormat<T>) {
      state[TYPE_FORMATTERS_ACCESSOR][formatter.datatype] = formatter;
    },
  };
}
