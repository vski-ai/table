export type SortState = {
  column?: string;
  sort?: "asc" | "desc";
};

declare module "@/fetcher/types.ts" {
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
