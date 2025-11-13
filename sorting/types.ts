export type SortState = {
  column?: string;
  sort?: "asc" | "desc";
};

declare module "@/fetcher/types.ts" {
  interface DataLoadOptions {
    sort?: SortState;
  }

  interface TableMeta {
    group_by?: string[];
    sortableAll?: boolean;
    sortableColumns?: string[];
    group_sorting_all?: boolean;
    group_sorting_level_columns?: string[][];
  }
}
