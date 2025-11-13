declare module "@/fetcher/types.ts" {
  interface TableMeta {
    group_by?: string[];
    group_sorting_all?: boolean;
    group_sorting_level_columns?: string[][];
  }
  interface DataLoadOptions {
    group_by?: string[] | null;
  }
}

declare module "@/row/types.ts" {
  interface RowData {
    $group_by?: string;
    $is_group_root?: boolean;
    $group_level?: number;
    $parent_id?: string[] | number[];
  }
}
