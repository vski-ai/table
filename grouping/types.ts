declare module "@/fetcher/types.ts" {
  interface TableMeta {
    groupBy: string[];
    sortableGroupLevelAll?: boolean;
    sortableGroupLevelColumns?: string[][];
  }
  interface DataLoadOptions {
    groupBy?: string[] | null;
  }
}

declare module "@/table/types.ts" {
  interface Row {
    $group_by?: string;
    $is_group_root?: boolean;
    $group_level?: number;
    $parent_id?: string[] | number[];
  }
}
