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
  groupable?: boolean;
}

export const useData = (
  {
    onDataLoad,
    store,
    limit = 100,
    groupable,
    plugins,
  }: DataProps,
) => {
  const data = useSignal<Row[]>([]);
  const total = useSignal(0);
  const timeoutRef = useRef<number | null>(null);
  const lastKey = useRef<number>(0);

  const load = useCallback((start: number, end: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (start > total.value && total.value > 0) {
        return;
      }

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

      if (!shouldLoad) {
        return;
      }

      lastKey.current = store.state.dataLoadKey.value;
      store.state.loading.value = true;

      const options = await plugins.beforeLoad({
        offset: start,
        limit: end - start,
        store,
      });

      const res = await onDataLoad(options);
      store.state.tableMeta.value = res.meta;

      const { rows, total: newTotal } = await plugins.afterLoad(res);

      if (total.value === 0) {
        total.value = newTotal;
        data.value = Array(newTotal).fill(null);
      }

      let newData = [...data.value];
      for (let i = 0; i < rows.length; i++) {
        newData[start + i] = rows[i];
      }
      if (groupable) {
        newData = newData.filter(Boolean);
      }
      data.value = newData;

      store.state.loading.value = false;
    }, 200);
  }, [store.state.dataLoadKey.value]);

  useEffect(() => {
    load(0, limit);
  }, []);

  return { data, total, load };
};
