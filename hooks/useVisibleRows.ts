import { useMemo } from "preact/hooks";
import { Row } from "@/table/types.ts";
import { TableStore } from "@/store/types.ts";

export interface VisibleRowsProps {
  data: Row[];
  store: TableStore;
  sortable?: boolean;
}

export function useVisibleRows({
  data,
  store,
  sortable,
}: VisibleRowsProps) {
  return useMemo(() => {
    const shown = data.filter((row: Row) => {
      if (!row.$parent_id?.length) {
        return true;
      }

      if (
        store.state.drilldowns.value &&
        row.$parent_id?.every(
          (id: string | number) =>
            store.state.drilldowns.value?.includes(id as never),
        )
      ) {
        return true;
      }

      return false;
    });
    return shown;
  }, [
    data,
    sortable,
    store.state.sorting.value,
    store.state.leafSorting.value,
    store.state.drilldowns?.value,
  ]);
}
