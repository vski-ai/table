import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";

declare module "@/store/types.ts" {
  interface TableState {
    cellEditing: Signal<Record<string, boolean>>;
  }
}

const CELL_EDITING_SET = "CELL_EDITING_SET";

export type CellEditingSetCommand = Command<
  typeof CELL_EDITING_SET,
  Record<string, boolean>
>;

export type EditingCommandType = CellEditingSetCommand;

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

export function mutate(state: TableState, command: EditingCommandType) {
  switch (command.type) {
    case "CELL_EDITING_SET":
      state.cellEditing.value = {
        ...state.cellEditing.value,
        ...command.payload,
      };
      break;
  }
}
