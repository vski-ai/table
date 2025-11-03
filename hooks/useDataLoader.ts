import { useSignal } from "@preact/signals";
import { MutableRef, useMemo } from "preact/hooks";
import { useRowHeights } from "./useRowHeights.ts";
import { useVariableVirtualizer } from "./useVariableVirtualizer.ts";

import { TableStore } from "@/store/types.ts";
import { PluginContainer } from "@/plugin/mod.ts";
import { DataLoadResult, Row } from "@/table/types.ts";

import { useData } from "./useData.ts";

interface DataLoaderProps {
  store: TableStore;
  plugins: PluginContainer;
  scrollContainerRef: MutableRef<HTMLElement>;
  rowHeight: number;
  rowKey?: string;
  buffer?: number;
  onDataLoad: (options: {
    offset: number;
    limit: number;
    store: TableStore;
  }) => Promise<DataLoadResult>;
}

export function useDataLoader({
  store,
  plugins,
  scrollContainerRef,
  rowKey,
  rowHeight,
  buffer = 60,
  onDataLoad,
}: DataLoaderProps) {
  const latestData = useSignal<(Row | null)[]>([]);
  const latestCount = useSignal(buffer);

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
  const { data, total, isLoading } = useData({
    onDataLoad,
    store,
    plugins,
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
