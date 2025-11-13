import { Signal, signal } from "@preact/signals";
import { Command, InferPersist, TableState } from "@/module/mod.ts";

type SelectorStore = {
  selector: {
    rows: Signal<(string | number)[]>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends SelectorStore {}
}

const SELECTED_ROWS_SET = "SELECTED_ROWS_SET";
export type RowsSelectCommand = Command<
  typeof SELECTED_ROWS_SET,
  (string | number)[]
>;

export function state(init: InferPersist<SelectorStore>): SelectorStore {
  const rows = signal(init?.selector?.rows ?? []);
  return {
    selector: {
      rows,
    },
  };
}

export function persist(state: TableState): InferPersist<SelectorStore> {
  return {
    selector: {
      rows: state.selector.rows.value,
    },
  };
}

export function mutate(state: TableState, command: RowsSelectCommand) {
  switch (command.type) {
    case "SELECTED_ROWS_SET": {
      state.selector.rows.value = command.payload;
      break;
    }
  }
}
