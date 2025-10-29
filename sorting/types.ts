import { Signal } from "@preact/signals";

export interface SorterStore {
  sorting: Signal<SortState>;
  leafSorting: Signal<Record<string, SortState>>;
}

export type SortState = {
  column: string;
  sort: "asc" | "desc";
};
