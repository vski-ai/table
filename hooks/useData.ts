import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";
import { PluginContainer } from "@/plugin/mod.ts";
import { DataLoadResult } from "@/table/types.ts";

function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number,
  store: TableStore,
) {
  let timeout: number;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
    store.state.loading.value = true;
  };
}

interface DataProps {
  onDataLoad: (options: {
    offset: number;
    limit: number;
    store: TableStore;
  }) => Promise<DataLoadResult>;
  store: TableStore;
  limit?: number;
  plugins: PluginContainer;
}

export const useData = ({
  onDataLoad,
  store,
  limit = 1,
  plugins,
}: DataProps) => {
  const data = useSignal<Row[]>([]);
  const total = useSignal(0);
  const abortController = useRef<AbortController | null>(null);

  const debouncedLoad = useCallback(
    debounce(
      async (start: number, end: number) => {
        if (abortController.current) {
          abortController.current.abort();
        }
        const controller = new AbortController();
        abortController.current = controller;

        store.state.loading.value = true;

        try {
          const options = await plugins.beforeLoad({
            offset: start,
            limit: end - start,
            store,
            abortController,
          });
          const res = await onDataLoad(options);
          if (controller.signal.aborted) return;

          const { rows, total: newTotal } = await plugins.afterLoad(res);
          if (controller.signal.aborted) return;
          total.value = newTotal;
          const newData = new Array(newTotal).fill(null);

          let zbi = 0;
          for (let i = start; i < end + 1; i++) {
            newData[i] = rows[zbi++];
          }

          data.value = newData;
        } catch (error) {
          if ((error as Error).message !== "Aborted") {
            console.error("Failed to load data", error);
          }
        } finally {
          if (abortController.current === controller) {
            abortController.current = null;
          }
          if (!controller.signal.aborted) {
            store.state.loading.value = false;
          }
        }
      },
      0,
      store,
    ),
    [store, onDataLoad, plugins],
  );

  const load = useCallback((start: number, end: number) => {
    if (end > start) {
      debouncedLoad(start, end);
    }
  }, [debouncedLoad, store.state.dataLoadKey.value]);

  useEffect(() => {
    load(0, limit);
  }, [store.state.dataLoadKey.value, limit, load]);

  return { data, total, load };
};
