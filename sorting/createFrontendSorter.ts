import { RowData } from "@/row/types.ts";
import { TableStore } from "@/store/mod.ts";
import { SortState } from "./types.ts";

const sortFn = (sorting: SortState) => (a: RowData, b: RowData) => {
  const aValue = a[sorting.column] ?? 0;
  const bValue = b[sorting.column] ?? 0;

  if (typeof aValue === "string" && typeof bValue === "string") {
    return sorting.sort === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  }

  return sorting.sort === "asc" ? aValue - bValue : bValue - aValue;
};

/**
 * The table uses flattened tree structure, so the sorting
 * is a bit tricky - we have to rebuilt tree and visit branches
 * recursevely.
 */
const sortGroup = (data: RowData[], store: TableStore): RowData[] => {
  const sorting = store.state.sorting.value;
  const groupSorting = store.state.groupSorting?.value ?? {};

  const roots = data.filter((row) => !row.$parent_id);
  const children: Record<string, RowData[]> = {};

  for (const row of data) {
    if (row.$parent_id) {
      const parentId = row.$parent_id.at(-1)!;
      if (!children[parentId]) {
        children[parentId] = [];
      }
      children[parentId].push(row);
    }
  }

  const sortLevel = (rows: RowData[], parentId?: string): RowData[] => {
    const currentSorting = parentId ? groupSorting[parentId] : sorting;
    if (currentSorting) {
      rows.sort(sortFn(currentSorting));
    }

    const result: RowData[] = [];
    for (const row of rows) {
      result.push(row);
      if (children[row.id]) {
        const sortedChildren = sortLevel(children[row.id], row.id?.toString());
        result.push(...sortedChildren);
      }
    }
    return result;
  };

  return sortLevel(roots);
};

// This is a reference implemetation to sort multilevel
// tables on frontend
export function createFrontendSorter() {
  let lastData: RowData[] | undefined;
  let lastSorting: SortState | undefined;
  let lastLeafSorting: Record<string, SortState> | undefined;
  let lastResult: RowData[] | undefined;
  return function sorter({ data, store }: {
    data: RowData[];
    store: TableStore;
  }): RowData[] {
    const sorting = store.state.sorting.value;
    const groupSorting = store.state.groupSorting?.value ?? {};
    if (
      lastData === data &&
      lastSorting === sorting &&
      lastLeafSorting === groupSorting
    ) {
      return lastResult!;
    }
    const result = sortGroup(data, store);
    lastData = data;
    lastSorting = sorting;
    lastLeafSorting = groupSorting;
    lastResult = result;
    return result;
  };
}
