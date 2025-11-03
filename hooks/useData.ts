import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";
import { PluginContainer } from "@/plugin/mod.ts";
import { DataLoadResult } from "@/table/types.ts";
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

export const useData = (
  {
    onDataLoad,
    store,
    limit = 100,
    plugins,
  }: DataProps,
) => {
  const data = useSignal<Row[]>([]);
  const total = useSignal(0);
  const lastKey = useRef<number>(0);
  const queue = useRef<[number, number][]>([]);
  const isProcessing = useRef(false);

  const processQueue = useCallback(async () => {
    if (isProcessing.current || queue.current.length === 0) {
      return;
    }
    isProcessing.current = true;
    store.state.loading.value = true;

    const range = queue.current.pop()!;
    const [start, end] = range;

    if (start > total.value && total.value > 0) {
      // Range is out of bounds, ignore
    } else {
      let shouldLoad = false;
      for (let i = start; i < end; i++) {
        if (!data.value[i]) {
          shouldLoad = true;
          break;
        }
      }

      if (lastKey.current != store.state.dataLoadKey.value) {
        shouldLoad = true;
      }

      if (shouldLoad) {
        lastKey.current = store.state.dataLoadKey.value;

        const options = await plugins.beforeLoad({
          offset: start,
          limit: end - start,
          store,
        });

        const res = await onDataLoad(options);
        store.state.tableMeta.value = res.meta;

        const { rows, total: newTotal } = await plugins.afterLoad(res);

        let newData = [...data.value];
        if (total.value !== newTotal) {
          total.value = newTotal;
          newData = Array(newTotal).fill(null);
        }

        for (let i = 0; i < rows.length; i++) {
          if (start + i < newData.length) {
            newData[start + i] = rows[i];
          }
        }

        data.value = newData;
      }
    }

    isProcessing.current = false;
    store.state.loading.value = false;

    if (queue.current.length > 0) {
      processQueue();
    }
  }, [store.state.dataLoadKey.value]);

  const load = useCallback((start: number, end: number) => {
    queue.current.push([start, end]);
    processQueue();
  }, [processQueue]);

  useEffect(() => {
    load(0, limit);
  }, []);

  return { data, total, load };
};
