import { Signal } from "@preact/signals";

export type SortState = {
  column: string;
  sort: "asc" | "desc";
};

declare module "@/store/types.ts" {
  interface TableState {
    sorting: Signal<SortState>;
    leafSorting: Signal<Record<string, SortState>>;
  }
}

declare module "@/table/types.ts" {
  interface DataLoadOptions {
    sort?: SortState;
  }

  interface TableMeta {
    sortableAll?: boolean;
    sortableColumns?: string[];
    sortableGroupLevelAll?: boolean;
    sortableGroupLevelColumns?: string[][];
  }
}
