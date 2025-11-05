import { useSignal } from "@preact/signals";
import { MutableRef, useMemo } from "preact/hooks";
import { useRowHeights } from "./useRowHeights.ts";
import { useVariableVirtualizer } from "./useVariableVirtualizer.ts";

import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";
import { DataLoadCallback } from "./types.ts";

import { useLoader } from "./useLoader.ts";
import { useRowKey } from "./useRowKey.ts";

interface DataFetcherProps {
  store: TableStore;
  scrollContainerRef: MutableRef<HTMLElement>;
  rowHeight: number;
  buffer?: number;
  onDataLoad: DataLoadCallback;
}

export function useDataFetcher({
  store,
  scrollContainerRef,
  rowHeight,
  onDataLoad,
}: DataFetcherProps) {
  const latestData = useSignal<(Row | null)[]>([]);
  const latestCount = useSignal(0);
  const rowKey = useRowKey({ store });
  const getRowHeight = useRowHeights({
    store,
    rowKey,
    height: rowHeight,
  });

  const rowHeights = latestData.value.map(getRowHeight);

  // 1. Get items range
  const {
    virtualItems,
    paddingTop,
    paddingBottom,
  } = useVariableVirtualizer({
    scrollContainerRef,
    itemCount: latestCount.value,
    rowHeights,
  });

  // 2. Get visible items: null meaning needs to load on
  //  the next iteration (displays as loading)
  const visibleRows = useMemo(() => {
    return virtualItems.map((item) => ({
      ...item,
      row: latestData.value[item.index] ?? null,
    }));
  }, [latestData.value, virtualItems]);

  // 3. Load and merge (todo: maybe separate concerns)
  //      - loads the data, fills nulled rows
  const { data, total, isLoading } = useLoader({
    onDataLoad,
    store,
    visibleRows,
  });

  // 4. Go to 1st step:
  //    - Some data loaded, but the total might have changed
  //    - Some data loaded, but there are null rows in visible range
  latestData.value = data.value;
  latestCount.value = total.value;

  return {
    visibleRows,
    data,
    total,
    isLoading,
    rowHeights,
    paddingBottom,
    paddingTop,
  };
}
