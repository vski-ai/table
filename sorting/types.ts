import { Signal } from "@preact/signals";

export type SortState = {
  column: string;
  sort: "asc" | "desc";
};

declare module "@/table/types.ts" {
  interface DataLoadOptions {
    sort?: SortState;
  }

  interface TableMeta {
    groupby?: string[];
    sortableAll?: boolean;
    sortableColumns?: string[];
    sortableGroupLevelAll?: boolean;
    sortableGroupLevelColumns?: string[][];
  }
}
