import { Signal, signal } from "@preact/signals";
import { Command, TableState } from "@/store/mod.ts";
import { RowData } from "@/row/types.ts";

declare module "@/store/types.ts" {
  interface TableState {
    focusedCell: Signal<{ tabIndex: number; rowIndex: number } | null>;
    selectedCells: Signal<Record<string, Record<string, boolean>>>;
  }
  interface TableStore {
    getCellKey: (opts: { column: string; row: RowData }) => string;
  }
}

export function state() {
  const selectedCells = signal({});
  const focusedCell = signal(null);
  return {
    selectedCells,
    focusedCell,
  };
}

export function persist(_: TableState) {
  return {};
}

export function mutate<T>(state: TableState, _: Command<T>) {
  return state;
}

export function methods(_: TableState) {
  return {
    getCellKey({ column, row }: { column: string; row: RowData }) {
      return row.id + "/" + column;
    },
  };
}
