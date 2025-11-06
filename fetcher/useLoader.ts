import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { TableStore } from "@/store/mod.ts";
import { ColumnSetCommand } from "@/columns/store.ts";
import { Row } from "@/table/types.ts";
import { DataLoadCallback } from "./types.ts";
import { usePluginContainer } from "@/plugin/usePluginContainer.ts";
import { TableMetaCommnand } from "./store.ts";

interface LoaderProps {
  onDataLoad: DataLoadCallback;
  store: TableStore;
  visibleRows: any[];
}

export const useLoader = ({
  onDataLoad,
  store,
  visibleRows,
}: LoaderProps) => {
  const data = useSignal<(Row | null)[]>([]);
  const total = useSignal(0);
  const isLoading = useSignal(false);
  const loadedRanges = useRef<{ start: number; end: number }[]>([]);
  const reloadKey = store.state.dataLoadKey;
  const lastReloadKey = useRef(reloadKey.value);
  const plugins = usePluginContainer({ store });

  const load = useCallback(async (offset: number, limit: number) => {
    if (limit <= 0 || isLoading.value) return;

    isLoading.value = true;
    try {
      const options = await plugins.beforeLoad({ offset, limit, store });
      const res = await onDataLoad(options);
      const { rows, total: newTotal, meta } = await plugins.afterLoad(res);

      store.dispatch<ColumnSetCommand>({
        type: "COLUMNS_SET",
        payload: Object.keys(rows.find((r) => r !== null) ?? {}),
      });

      store.dispatch<TableMetaCommnand>({
        type: "TABLE_META_SET",
        payload: meta,
      });

      if (total.value !== newTotal) {
        total.value = newTotal;
        data.value = new Array(newTotal).fill(null);
        loadedRanges.current = [];
      }

      const finalData = [...data.value];
      for (let i = 0; i < rows.length; i++) {
        if (offset + i < finalData.length) {
          finalData[offset + i] = rows[i];
        }
      }
      data.value = finalData;

      // Merge ranges
      const newRange = { start: offset, end: offset + limit };
      const mergedRanges: { start: number; end: number }[] = [];
      let merged = false;
      for (const range of loadedRanges.current) {
        if (newRange.start <= range.end && newRange.end >= range.start) {
          newRange.start = Math.min(newRange.start, range.start);
          newRange.end = Math.max(newRange.end, range.end);
          merged = true;
        } else {
          mergedRanges.push(range);
        }
      }
      if (!merged) {
        mergedRanges.push(newRange);
      }
      loadedRanges.current = mergedRanges;
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      isLoading.value = false;
    }
  }, [
    onDataLoad,
    store,
    plugins,
    data,
    total,
    isLoading,
    loadedRanges,
    visibleRows,
  ]);

  useEffect(() => {
    if (!visibleRows) return;

    if (lastReloadKey.current !== reloadKey.value) {
      visibleRows.forEach((item) => {
        item.row = null;
      });
      lastReloadKey.current = reloadKey.value;
      loadedRanges.current = [];
    }

    const nullRanges: { start: number; end: number }[] = [];
    let start: number | null = null;
    for (const row of visibleRows) {
      if (row.row === null) {
        if (start === null) {
          start = row.index;
        }
      } else {
        if (start !== null) {
          nullRanges.push({ start, end: row.index - 1 });
          start = null;
        }
      }
    }
    if (start !== null) {
      nullRanges.push({
        start,
        end: visibleRows[visibleRows.length - 1].index,
      });
    }

    const newRanges = nullRanges.filter((range) => {
      return !loadedRanges.current.some((loadingRange) => {
        return range.start >= loadingRange.start &&
          range.end <= loadingRange.end;
      });
    });

    if (newRanges.length > 0) {
      for (const range of newRanges) {
        load(range.start, range.end - range.start + 1);
      }
    }
  }, [visibleRows, load, reloadKey.value]);

  return { data, total, isLoading };
};
