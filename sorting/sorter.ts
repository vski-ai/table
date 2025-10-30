import { SorterStore, SortState } from "./types.ts";
import { Row } from "@/table/types.ts";

export interface SorterProps {
  data: Row[];
  store: SorterStore;
}

const sortFn = (sorting: SortState) => (a: Row, b: Row) => {
  const aValue = a[sorting.column];
  const bValue = b[sorting.column];

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
const sortGroup = (data: Row[], store: SorterStore): Row[] => {
  const sorting = store.sorting.value;
  const leafSorting = store.leafSorting.value;

  const roots = data.filter((row) => !row.$parent_id);
  const children: Record<string, Row[]> = {};

  for (const row of data) {
    if (row.$parent_id) {
      const parentId = row.$parent_id.at(-1)!;
      if (!children[parentId]) {
        children[parentId] = [];
      }
      children[parentId].push(row);
    }
  }

  const sortLevel = (rows: Row[], parentId?: string): Row[] => {
    const currentSorting = parentId ? leafSorting[parentId] : sorting;

    if (currentSorting) {
      rows.sort(sortFn(currentSorting));
    }

    const result: Row[] = [];
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

export function createSorter() {
  let lastData: Row[] | undefined;
  let lastSorting: SortState | undefined;
  let lastLeafSorting: Record<string, SortState> | undefined;
  let lastResult: Row[] | undefined;

  return function sorter({ data, store }: SorterProps): Row[] {
    const sorting = store.sorting.value;
    const leafSorting = store.leafSorting.value;

    if (
      lastData === data &&
      lastSorting === sorting &&
      lastLeafSorting === leafSorting
    ) {
      return lastResult!;
    }

    const result = sortGroup(data, store);

    lastData = data;
    lastSorting = sorting;
    lastLeafSorting = leafSorting;
    lastResult = result;

    return result;
  };
}

export const sorter = createSorter();
