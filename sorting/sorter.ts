import { SorterStore, SortState } from "./types.ts";

type Row = Record<string, any>;
type Rows = Row[];

export interface SorterProps {
  data: Rows;
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
const sortGroup = (data: Rows, store: SorterStore): Rows => {
  const sorting = store.sorting.value;
  const leafSorting = store.leafSorting.value;

  const roots = data.filter((row) => !row.$parent_id);
  const children: Record<string, Rows> = {};

  for (const row of data) {
    if (row.$parent_id) {
      const parentId = row.$parent_id.at(-1)!;
      if (!children[parentId]) {
        children[parentId] = [];
      }
      children[parentId].push(row);
    }
  }

  const sortLevel = (rows: Rows, parentId: string | null): Rows => {
    const currentSorting = parentId ? leafSorting[parentId] : sorting;

    if (currentSorting) {
      rows.sort(sortFn(currentSorting));
    }

    const result: Rows = [];
    for (const row of rows) {
      result.push(row);
      if (children[row.id]) {
        const sortedChildren = sortLevel(children[row.id], row.id);
        result.push(...sortedChildren);
      }
    }
    return result;
  };

  return sortLevel(roots, null);
};

export function createSorter() {
  let lastData: Rows | undefined;
  let lastSorting: SortState | undefined;
  let lastLeafSorting: Record<string, SortState> | undefined;
  let lastResult: Rows | undefined;

  return function sorter({ data, store }: SorterProps): Rows {
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
